import { API_CONFIG } from './config.js';  // get config of API

let results = []; // 存储已读取的 Tab 信息
const currentUrl = [];
const isTest = false; // 是否为测试模式
let tasks = []; // 存储任务列表

// refresh the tabs information
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // read currently opened tabs and sent it to the front-end
    if (message.action === "fetch_titles") {
        chrome.tabs.query({}, async (tabs) => {
            console.log("Total tabs:", tabs.length);
            // results.length = 0; // 清空结果 // 不能清空，否则前端无法获取到数据，这里主要是为了在原有基础上添加新的tab
            // 用 Promise.all 等待所有 processTab 任务完成
            await Promise.all(tabs.map(tab => processTab(tab)));
            // 现在所有 tabs 处理完了，才发送更新给前端
            sendTabsToFrontend();
            sendTasksToFrontend();
        });
        return true; // 支持异步响应
    }
    // directly sent the tabs information without reading again
    else if (message.action === "get_tabs") {
        console.log("sending result, with length:", results.length);
        sendTabsToFrontend();
        return true; 
    }
    // do summarization of a tab
    else if (message.action === "summarize_tab") {
        // console.log("Received tab title for summary:", message.title);
        const replySummary = getSummaryByLLM(message.title, message.mainText, message.outline) .then((summary) => {
            // update results with the summary
            const tabIndex = results.findIndex(tab => tab.id === message.tabId);
            if (tabIndex !== -1) {
                results[tabIndex].summary = summary;
                console.log(`Updated summary for tabId ${message.tabId}`);
            } else {
                console.warn(`Tab with id ${message.tabId} not found in results.`);
            }
            // send the summary back to the front-end
            chrome.runtime.sendMessage({
                action: "summary_result",
                tabId: message.tabId, 
                summary: summary
            });
        });
        return true; // 支持异步响应
    }
    else if(message.action === "move_tab_to_mindmap") {
        const removedTabId = message.removedTabId;
        const addedMindmapId = message.addedMindmapId;
        const newMindmap = message.newMindmap;
        // remove the tab from theresult_tabs
        results = results.filter((t) => t.id !== removedTabId);
        // // add the tab to the mindmapTabs
        // const mindmapTabs = results.filter((t) => t.id === removedTabId);
        // update the storage
        chrome.storage.local.set({ [addedMindmapId]: newMindmap }, () => {
            console.log("Mindmap tabs updated in storage:", newMindmap);
        });
        // send the updated tabs to the back-end
        sendTabsToFrontend();
        return true;
    }
    // add a new task
    else if(message.action === "create_new_task") {
        let taskName =  `Task ${tasks.length + 1}`;
        if (message.task_name === undefined ){
            taskName =  `Task ${tasks.length + 1}`;
        }else{
            taskName = message.task_name;
        }
        const basicId = crypto.randomUUID();
        const newTask = { task_id: "task"+basicId, name: taskName , MindmapId: "mindmap"+basicId};
        tasks.unshift(newTask);
        // store the tasks in the chrome storage
        chrome.storage.local.set({ taskList: tasks }, () => {
            console.log("update taskList with new task", newTask);
        });
        sendTasksToFrontend({ tasks });
        return true;
    }
    else if(message.action === "delete_task") {
        const taskId = message.taskId;
        // remove the task from the tasks
        tasks = tasks.filter((t) => t.task_id !== taskId);
        // remove the task from the storage
        chrome.storage.local.set({ taskList: tasks }, () => {
            console.log("Task deleted:", taskId);
        });
        // send the updated tasks to the back-end
        return true;
    }
    else if (message.action === "get_tasks") {
        chrome.storage.local.get(["taskList"], (result) => {
            if (result.taskList) {
                tasks = result.taskList; // 更新全局 tasks 数组
            }
            sendResponse({ tasks: tasks });
        });
        return true; // 让 Chrome 保持 sendResponse 可用
    }
    
    else if(message.action === "change_task_name") {
        const taskId = message.taskId;
        const taskName = message.taskName;
        // update the task name
        tasks = tasks.map((task) => task.task_id === taskId ? { ...task, name: taskName } : task);
        // update the storage
        chrome.storage.local.set({ taskList: tasks }, () => {
            console.log("Task name updated:", taskId, taskName);
        });
        // send the updated tasks to the back-end
        sendTasksToFrontend({ tasks });
        return true;
    }
});

// 发送 tabs 信息到 React 前端(直接发送，不需要front-end request)
function sendTabsToFrontend() {
    chrome.runtime.sendMessage({ action: "update_tabs", tabs: results }, (response) => {
      if (chrome.runtime.lastError) {
        console.warn("No listener for update_tabs, will retry later...");
      }
    });
}

function sendTasksToFrontend() {
    // 加载存储的 Mindmap Tabs
    chrome.storage.local.get(["taskList"], (result) => {
        if (result.taskList) {
            tasks.length = 0;  // 清空原数组，防止旧数据残留
            tasks.push(...result.taskList); // 直接修改数组内容
        }
        chrome.runtime.sendMessage({ action: "update_tasks", tasks: tasks }, (response) => {
            if (chrome.runtime.lastError) {
                console.warn("No listener for update_tasks, will retry later...");
            }
        });
    });
}
  
  // 防止 service_worker 被 Chrome 杀死
chrome.alarms.create("keep_alive", { periodInMinutes: 1 });
  
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "keep_alive") {
    console.log("Keeping service worker alive...");
    }
});

// popup the front-end
chrome.action.onClicked.addListener(() => {
    chrome.windows.create({
        url: chrome.runtime.getURL("build/index.html"),
        type: "popup",
        width: 1920,
        height: 1080
    });
});

// 监听 Tab 更新事件
// waiting for handle the redirection-----search api()
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        console.log("Tab updated:", tab.url);

        // 确保 processTab 完成后再执行 sendTabsToFrontend
        processTab(tab).then(() => {
            sendTabsToFrontend();
        });
    }
});

// 处理单个 Tab 的信息提取和发送逻辑
function processTab(tab) {
    return new Promise((resolve) => {
        if (!tab.url 
            || tab.url.startsWith('chrome://') 
            || tab.url.startsWith('about:') 
            || tab.url.startsWith('http://localhost:')
            || tab.url.startsWith('chrome-extension://')) {
            console.log("Skipping unsupported tab:", tab.url);
            resolve();
            return;
        }

        chrome.scripting.executeScript(
            { target: { tabId: tab.id }, files: ['content.js'] },
            () => {
                if (chrome.runtime.lastError) {
                    console.error(`Script injection failed for tab ${tab.url}: ${chrome.runtime.lastError.message}`);
                    resolve();
                    return;
                }
                const uniqueId = `${Date.now()}-${tab.id}`;
                
                // 确保 sendMessage 完成后再 resolve()
                chrome.tabs.sendMessage(tab.id, { action: "fetch_content", id: uniqueId }, (response) => {
                    if (response) {
                        // 在此处添加代码，如果respnse中的url出现在了currenturl内，则不添加
                        if (currentUrl.includes(response.currentUrl)) {
                            console.log("Tab already fetched:", response.currentUrl);
                            resolve();
                            return;
                        }
                        results.push(response);
                        currentUrl.push(response.currentUrl);
                        console.log("Added result for:", tab.url);
                    } else {
                        console.error("Failed to fetch content for tab:", tab.url);
                    }
                    resolve(); // 只有在 sendMessage 完成后才执行 resolve()
                });

                // 加入超时保护，防止某些 tab 无响应导致 Promise 永远不 resolve
                setTimeout(() => {
                    console.warn(`Timeout: No response from tab ${tab.url}, resolving anyway.`);
                    resolve();
                }, 5000);
            }
        );
    });
}



// store page data at the chrome.storage.local
function saveTabsLocally() {
    chrome.storage.local.set({ tabs: results }, () => {
        console.log("Tabs data stored successfully in Chrome storage.");
    });
}


function normalizeUrl(url) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.toString(); // 返回标准化的 URL
    } catch (err) {
        console.error("Failed to normalize URL:", url, err);
        return url;
    }
}

async function getSummaryByLLM(title, main_text, outline) {
    if (isTest) {
        return "This is a test summary";
    }
    console.log("Sending request to GPT about " + title.slice(0, 100) + " for summary");
    const { apiBase, apiKey, deploymentName, apiVersion } = API_CONFIG;  // get api key

    const url = `${apiBase}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;
    
    const prompt = `
        Following text is extracted from a website, including its title, main context, and outline. 
        Please help me analyze the following content and return a summary of less than 50 English words. 
        Ignore spam and ads information.

        ####### Title #######
        ${title.slice(0, 500)}

        ####### Main Context #######
        ${main_text.slice(0, 5000)}

        ####### Outline #######
        ${outline.slice(0, 5000)}
    `;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "You are a helpful assistant tasked with summarizing the main content of webpages." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 500
            })
        });  // use await to solve the problem of synchronize

        const data = await response.json();
        const reply = data.choices[0].message.content.trim().replace(/\n/g, "");
        console.log(reply);
        return reply;  // 现在可以正确返回 reply
    } catch (error) {
        console.error("Error:", error);
        return "Error fetching summary for this web tabs.";
    }
}
