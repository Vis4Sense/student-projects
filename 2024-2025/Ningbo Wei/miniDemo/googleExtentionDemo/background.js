import { API_CONFIG } from './config.js';  // get config of API

const deploymentName = "gpt-4o-mini" // 模型部署名称
const apiVersion = "2025-01-01-preview"  // API 版本

const retryTime = 23; // openai API 重试次数
const retryInterval = 2000; // openai API 重试间隔

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
        const mindmapId = "mindmap" + taskId.replace("task", "");
        // remove the task from the tasks
        tasks = tasks.filter((t) => t.task_id !== taskId);
        // remove the task from the storage
        chrome.storage.local.set({ taskList: tasks }, () => {
            console.log("Task deleted:", taskId);
        });
        // remove the mindmap tabs from the storage
        chrome.storage.local.remove([mindmapId], () => {});
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
    else if(message.action === "auto_Generate_tasks"){
        // deadling with result_tabs, only leave tabId and longSummary
        const tabs_for_classification = results.map((tab) => {
            return { tabId: tab.id, tab_Summary: tab.summaryLong };
        });
        // based on longsummary to classify the tabs
        getClassificationByLLM(tabs_for_classification).then((outputList) => {
            // update the new tasks
            let newTasks = [];
            console.log("outputList", outputList);
            outputList.map((output) => {
                const basicId = crypto.randomUUID();
                newTasks.push({ task_id: "task"+basicId, name: output.location, MindmapId: "mindmap"+basicId });
                console.log("new task", newTasks);
                // for each new task, create a new mindmap
                let newMindmap = [];
                output.tabId.map((thisTabId) => {
                    console.log("thisTabId", thisTabId);
                    // add the tab to the new mindmap
                    const tab = results.find((tab) => tab.id === thisTabId);
                    if (tab) {
                        newMindmap.push(tab);
                    }
                    // delete the tab from the results
                    const tabIndex = results.findIndex((tab) => tab.id === thisTabId);
                    console.log("tabIndex", tabIndex);
                    if (tabIndex !== -1) {
                        results = results.filter((tab) => tab.id !== thisTabId);
                    }
                });
                // store the mindmap in the chrome storage
                chrome.storage.local.set({ ["mindmap"+basicId]: newMindmap }, () => {
                    console.log("update mindmap with new tabs", newMindmap);
                });
            });
            // store the tasks in the chrome storage
            tasks.unshift(...newTasks);
            chrome.storage.local.set({ taskList: tasks }, () => {
                console.log("update taskList with new tasks", tasks);
            });
            sendTasksToFrontend({ tasks });
            sendTabsToFrontend();
        });
        return true;
    }
    else if(message.action === "personlise_Generate_tasks"){
        // deadling with result_tabs, only leave tabId and longSummary
        console.log("result tabs are", results);
        const tabs_for_classification = results.map((tab) => {
            return { tabId: tab.id, tab_Summary: tab.summaryLong };
        });
        const taskKeyWord = message.taskKeyWord;
        tabs_for_classification.taskKeyWord = taskKeyWord;
        console.log("tabs_for_classification", tabs_for_classification);
        // based on longsummary to classify the tabs
        getClassificationByLLMWithKeyWord(tabs_for_classification, taskKeyWord).then((outputList) => {
            // update the new tasks
            let newTasks = [];
            console.log("outputList", outputList);
            outputList.map((output) => {
                const basicId = crypto.randomUUID();
                newTasks.push({ task_id: "task"+basicId, name: output.task_title, MindmapId: "mindmap"+basicId });
                console.log("new task", newTasks);
                // for each new task, create a new mindmap
                let newMindmap = [];
                output.tabId.map((thisTabId) => {
                    console.log("thisTabId", thisTabId);
                    // add the tab to the new mindmap
                    const tab = results.find((tab) => tab.id === thisTabId);
                    if (tab) {
                        newMindmap.push(tab);
                    }
                    // delete the tab from the results
                    const tabIndex = results.findIndex((tab) => tab.id === thisTabId);
                    console.log("tabIndex", tabIndex);
                    if (tabIndex !== -1) {
                        results = results.filter((tab) => tab.id !== thisTabId);
                    }
                });
                // store the mindmap in the chrome storage
                chrome.storage.local.set({ ["mindmap"+basicId]: newMindmap }, () => {
                    console.log("update mindmap with new tabs", newMindmap);
                });
            });
            // store the tasks in the chrome storage
            tasks.unshift(...newTasks);
            chrome.storage.local.set({ taskList: tasks }, () => {
                console.log("update taskList with new tasks", tasks);
            });
            sendTasksToFrontend({ tasks });
            sendTabsToFrontend();
        });
        return true;
    }
    else if(message.action === "LLM_conversation") {
        const prompt = message.prompt;
        const reply = chat(prompt).then((reply) => {
            console.log("Reply from LLM:", reply);
            chrome.runtime.sendMessage({ action: "LLM_conversation_reply", reply: reply });
        });
        return true;
    }else if(message.action === "generate_task_summary"){
        const taskId = message.taskId;
        const mindmapId = "mindmap" + taskId.replace("task", "");
        const beginPrompt = message.beginPrompt;
        chrome.storage.local.get([mindmapId], (result) => {
            const mindmapTabs = result[mindmapId] || [];

            const tabsWithSummary = mindmapTabs.map(tab => {
                return { id: tab.id, summary: tab.summaryLong };
            });
            console.log("tabsWithSummary", tabsWithSummary);
            const tabsWithSummaryText = JSON.stringify(tabsWithSummary, null, 2);
            const prompt = beginPrompt + tabsWithSummaryText;
            // get the summary of the task
            const reply = chat(prompt).then((reply) => {
                console.log("Reply from LLM:", reply);
                chrome.runtime.sendMessage({ action: "generate_task_summary_reply", summary: reply });
            });
            // update this task with the summary in the storage


            // 调用chat接口，修改prompt以及begin prompt

            // 结构化返回，处理好返回的内容后，更新storage（切换task的同时，显示的summary也要切换，最好也留一个接口给用户自己更新summary）


        });
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

                chrome.tabs.sendMessage(tab.id, { action: "fetch_content", id: uniqueId }, (response) => {
                    if (response) {
                        if (currentUrl.includes(response.currentUrl)) {
                            console.log("Tab already fetched:", response.currentUrl);
                            resolve();
                            return;
                        }

                        // 添加默认 summary 为 "waiting..."
                        response.summary = "waiting...";
                        results.push(response);
                        currentUrl.push(response.currentUrl);
                        console.log("Added result for:", tab.url);

                        // 立即发送更新到前端，让 UI 显示"waiting..."
                        sendTabsToFrontend();
                        // 首先根据url获取summary
                        // getSummarywithUrlWithRateLimitHandling(response.currentUrl)
                        //     .then((summary) => {
                        //         // 先确保summaries不是“ERROR”，否则发送main_text和outline
                        //         if (summary.summary[1].longSummary !== "ERROR") {
                        //             const longSummary = summary.summary[1].longSummary;
                        //             const shortSummary = summary.summary[0].shortSummary;
                        //             const tabIndex = results.findIndex(t => t.id === response.id);
                        //             console.log(`receive two summaries for tabId ${response.title}`, shortSummary, longSummary);
                        //             if (tabIndex !== -1) {
                        //                 results[tabIndex].summary = shortSummary;
                        //                 results[tabIndex].summaryLong = longSummary;
                        //                 results[tabIndex].main_text = ""; // 清空 mainText，减小数据量
                        //                 results[tabIndex].outline = ""; // 清空 outline，减小数据量
                        //                 results[tabIndex].images = []; // 清空 images，减小数据量
                        //                 // console.log(`Updated tow summary for tabId ${response.title}`);
                        //                 sendTabsToFrontend(); // 再次通知前端更新 UI
                        //             }
                        //         }
                        //         else {
                        //             // 通过main_text获取summary，包含long和short
                        //             getSummaryWithRateLimitHandling(response.title, response.main_text, response.outline)
                        //             .then((summary) => {
                        //                 const longSummary = summary.summary[1].longSummary;
                        //                 const shortSummary = summary.summary[0].shortSummary;
                        //                 const tabIndex = results.findIndex(t => t.id === response.id);
                        //                 console.log(`receive two summaries for tabId ${response.title}`, shortSummary, longSummary);
                        //                 if (tabIndex !== -1) {
                        //                     results[tabIndex].summary = shortSummary;
                        //                     results[tabIndex].summaryLong = longSummary;
                        //                     results[tabIndex].main_text = ""; // 清空 mainText，减小数据量
                        //                     results[tabIndex].outline = ""; // 清空 outline，减小数据量
                        //                     results[tabIndex].images = []; // 清空 images，减小数据量
                        //                     // console.log(`Updated tow summary for tabId ${response.title}`);
                        //                     sendTabsToFrontend(); // 再次通知前端更新 UI
                        //                 }
                        //             })
                        //             .catch(err => {
                        //                 console.error("Error generating summary:", err);
                        //             });
                        //         }
                        //     })
                        //     .catch(err => {
                        //         console.error("Error generating summary:", err);
                        //     });

                        getSummaryWithRateLimitHandling(response.title, response.main_text, response.outline)
                            .then((summary) => {
                                const longSummary = summary.summary[1].longSummary;
                                const shortSummary = summary.summary[0].shortSummary;
                                const tabIndex = results.findIndex(t => t.id === response.id);
                                console.log(`receive two summaries for tabId ${response.title}`, shortSummary, longSummary);
                                if (tabIndex !== -1) {
                                    results[tabIndex].summary = shortSummary;
                                    results[tabIndex].summaryLong = longSummary;
                                    results[tabIndex].main_text = ""; // 清空 mainText，减小数据量
                                    results[tabIndex].outline = ""; // 清空 outline，减小数据量
                                    results[tabIndex].images = []; // 清空 images，减小数据量
                                    // console.log(`Updated tow summary for tabId ${response.title}`);
                                    sendTabsToFrontend(); // 再次通知前端更新 UI
                                }
                            })
                            .catch(err => {
                                console.error("Error generating summary:", err);
                            });
                    } else {
                        console.error("Failed to fetch content for tab:", tab.url);
                    }
                    resolve();
                });

                setTimeout(() => {
                    console.warn(`Timeout: No response from tab ${tab.url}, resolving anyway.`);
                    resolve();
                }, 8000);
            }
        );
    });
}

function getRetrySeconds(errorMessage_object){
    // 获取 message 里的文字
    const messageText = errorMessage_object.error.message;

    // 使用正则提取 "Please retry after X seconds." 里的数字
    const match = messageText.match(/Please retry after (\d+) seconds\./);
    const retrySeconds = match ? parseInt(match[1], 10) : null;

    return retrySeconds;
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getSummaryWithRateLimitHandling(title, mainText, outline) {
    await delay(700);  // 每个请求间隔 700ms，避免 API 速率超限
    return await getSummaryByLLM(title, mainText, outline);
}

async function getSummarywithUrlWithRateLimitHandling(webpageUrl) {
    await delay(700);  // 每个请求间隔 700ms，避免 API 速率超限
    return await getSummaryByLLMwithUrl(webpageUrl);
}

async function getSummaryByLLMwithUrl(webpageUrl, retryCount = retryTime) {
    if (isTest) {  
        return "This is a test summary";
    }

    const { apiBase, apiKey } = API_CONFIG;  // get API key
    const url = `${apiBase}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;
    
    const exampleOutput = {
        "summary": [
            { "shortSummary": "xxx" },
            { "longSummary": "xxxxxx" }
        ]
    };
    const exampleOutputText = JSON.stringify(exampleOutput, null, 2);
    
    const prompt = `
    You will be given a URL of a webpage.
    Please help me analyze the that webpage and return two summary of this website in JSON format. 
    Ignore spam and ads information. Some parts may be irrelevant. Please summarize the webpage in English.
    Two summaries are required. You should return them in a dictionary with two keys: shortSummary(less than 25 words) and longSummary(less than 100 words). If you are unable to access the webpage, please return "ERROR" in both summaries. 
    ###### example output #######
        ${exampleOutputText}

    -----Following is the URL of the webpage-----
    ${webpageUrl}
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
                max_tokens: 300
            })
        });
        const data = await response.json();
        // 如果遇到 429 状态码，则等待 1.5 秒后重试（最多 3 次）
        if (response.status === 429 && retryCount > 0) {
            const retrySeconds = getRetrySeconds(data);
            console.warn(`Rate limit hit (429), api need ${retrySeconds}. Retrying in 1.5s... (${retryCount} retries left)`);
            await new Promise(resolve => setTimeout(resolve, retryInterval));
            return await getSummaryByLLMwithUrl(webpageUrl, retryCount - 1);
        }

        console.log("API Response:", data);

        if (!data.choices || !data.choices[0].message || !data.choices[0].message.content) {
            console.log("Prompt length:", prompt.length);
            console.log("Prompt:", prompt);
            throw new Error("Invalid API response format");
        }

        let responseContent = data.choices[0].message.content.trim();
        responseContent = responseContent.replace(/^```json|```$/g, "").trim();
        responseContent = responseContent.replace(/,\s*([\]}])/g, '$1');
        
        const summary = JSON.parse(responseContent);
        if (!summary.summary || !summary.summary[0].shortSummary || !summary.summary[1].longSummary) {
            throw new Error("JSON 数据缺少必要的字段");
        }

        return summary;
    } catch (error) {
        console.error("Error:", error);
        return "Error fetching summary for this web tab.";
    }
}

async function getSummaryByLLM(title, main_text, outline, retryCount = retryTime) {
    if (isTest) {
        return "This is a test summary";
    }
    console.log("Sending request to GPT about " + title.slice(0, 100) + " for summary");
    const { apiBase, apiKey } = API_CONFIG;  // get api key

    const url = `${apiBase}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;
    
    const exampleOutput = {
        "summary": [
            { "shortSummary": "xxx" },
            { "longSummary": "xxxxxx"}
        ]
    };
    const exampleOutputText = JSON.stringify(exampleOutput, null, 2);

    const prompt = `
        Following text is extracted from a website, including its title, main context, and outline. 
        Due to the limitation of the display, the given information may be truncated. 
        Please help me analyze the following content and return two summary of this website in json fromat. 
        Ignore spam and ads information. Some parts may be irrelevant. Please summarize the main content in English.
        
        You can do this job through following stetps:
        1. Read the title, main context, and outline.
        2. Guess the main content of the website, including the main topic and key points.
        3. Write a short summary of less than 25 words and a long summary of less than 100 words.
        4. Return only a valid JSON object, with no extra text or formatting. You should return a dictionary with two keys: shortSummary and longSummary, shown as below:
        ###### example output #######
        ${exampleOutputText}
        
        ----------Following is the title, main context, and outline----------
        ####### Title #######
        ${title.slice(0, 100)}

        ####### Main Context #######
        ${main_text.slice(0, 1500)}

        ####### Outline #######
        ${outline.slice(0, 350)}
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
                max_tokens: 300
            })
        });  // use await to solve the problem of synchronize
        const data = await response.json();

        // 如果遇到 429 状态码，则等待 1.5 秒后重试（最多 3 次）
        if (response.status === 429 && retryCount > 0) {
            const retrySeconds = getRetrySeconds(data);
            console.warn(`Rate limit hit (429), api need ${retrySeconds}. Retrying in 1.5s... (${retryCount} retries left)`);
            await new Promise(resolve => setTimeout(resolve, retryInterval));
            return await getSummaryByLLM(title, main_text, outline, retryCount - 1);
        }
        console.log("API Response:", data);

        if (!data.choices || !data.choices[0].message || !data.choices[0].message.content) {
            // 输出请求的prompt长度，以便调试
            console.log("Prompt length:", prompt.length);
            console.log("Prompt:", prompt);
            throw new Error("Invalid API response format");
        }

        // 提取返回的内容
        let responseContent = data.choices[0].message.content.trim();

        // **去除 Markdown 代码块格式**（API 可能会返回 ` ```json ... ``` `）
        responseContent = responseContent.replace(/^```json|```$/g, "").trim();

        // **去除 JSON 中的多余逗号**，避免解析错误
        responseContent = responseContent.replace(/,\s*([\]}])/g, '$1');

        // **尝试解析 JSON**
        const summary = JSON.parse(responseContent);
        // console.log("Summary:", summary);

        // **检查 JSON 结构是否正确**
        if (!summary.summary || !summary.summary[0].shortSummary || !summary.summary[1].longSummary) {
            throw new Error("JSON 数据缺少必要的字段");
        }
        return summary;
    } catch (error) {
        console.error("Error:", error);
        return "Error fetching summary for this web tabs.";
    }
}


async function getClassificationByLLM(tabInfo, retryCount = retryTime) {
    if (isTest) {
        return "This is a test summary";
    }
    console.log("Sending request to GPT about for tabs grouping");
    const { apiBase, apiKey } = API_CONFIG;  // get api key

    const url = `${apiBase}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`
    const exampleInput = {
        "tabs": [
            { "tabId": "1234", "tab_Summary": "this web page is a wiki pedia page introducing London" },
            { "tabId": "0002", "tab_Summary": "this web page is the official web page of Jubilee line in London underground, showing it prices" },
            { "tabId": "0003", "tab_Summary": "this web page introduce The Forbidden city" },
            { "tabId": "0004", "tab_Summary": "this web page introduce the Buckingham Palace" },
            { "tabId": "0005", "tab_Summary": "LeetCode: Classic Interviews - 150 Questions. Master all the interview knowledge points. Valid address and contact information given" },
            { "tabId": "0006", "tab_Summary": "this web page introduce the Tsinghua University." }
        ]
    };
    const exampleOutput = {
        "output": [
            { "location": "London", "tabId": ["1234", "0002", "0004"] },
            { "location": "Beijing", "tabId": ["0003"] }
        ]
    };
    const exampleInputText = JSON.stringify(exampleInput, null, 2);
    const exampleOutputText = JSON.stringify(exampleOutput, null, 2);

    const beginPrompt = `
        You are a helpful assistant in web tabs clustering. 
        You will be given several summaries of different web tabs.
        These tabs are usually about traveling. 
        What you need to do is classify these tabs based on city. You need to consider information in the summaries, like city name, famous places, train station, airport, well known company or famous people. 
        Some tabs might not related to a city, and you need to ignore them. For example, a tab about a programming website should be ignored.
        You need to return a list of dictionaries, each containing a city name and a list of tabId. Please return the result in JSON format. 
        Following is an example:
        ###### example input #######
        ${exampleInputText}
        ###### example output #######
        ${exampleOutputText}
    `;

    const tabInfoText = JSON.stringify(tabInfo, null, 2);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: beginPrompt },
                    { role: "user", content: tabInfoText }
                ],
                max_tokens: 1500
            })
        });  // use await to solve the problem of synchronize
        const data = await response.json();

        if(response.status === 429 && retryCount > 0) {
            const retrySeconds = getRetrySeconds(data);
            console.warn(`Rate limit hit (429), api need ${retrySeconds}. Retrying in 1.5s... (${retryCount} retries left)`);
            await new Promise(resolve => setTimeout(resolve, retryInterval));  // 等待 1.5 秒   
            return await getClassificationByLLM(tabInfo, retryCount - 1);  // 递归重试
        }
        console.log("API Response for tab grouping", data);
        console.log("prompt length", beginPrompt.length+tabInfoText.length);
        console.log("prompt", beginPrompt+tabInfoText);
        
        if (!data.choices || !data.choices[0].message || !data.choices[0].message.content) {
            throw new Error("Invalid API response format");
        }

        // 提取返回的内容
        let responseContent = data.choices[0].message.content.trim();

        // **去除 Markdown 代码块格式**（API 可能会返回 ` ```json ... ``` `）
        responseContent = responseContent.replace(/^```json|```$/g, "").trim();

        // **去除 JSON 中的多余逗号**，避免解析错误
        responseContent = responseContent.replace(/,\s*([\]}])/g, '$1');

        // **尝试解析 JSON**
        const jsonResponse = JSON.parse(responseContent);
        const outputList = jsonResponse.output;  // 获取列表
        console.log(outputList);

        return outputList;
    } catch (error) {
        console.error("Error:", error);
        return "Error fetching summary for this web tabs.";
    }
}

async function getClassificationByLLMWithKeyWord(tabInfo, keyWord, retryCount = retryTime) {
    if (isTest) {
        return "This is a test summary";
    }
    console.log("Sending request to GPT about for tabs grouping");
    const { apiBase, apiKey } = API_CONFIG;  // get api key
    const url = `${apiBase}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`
    const exampleInput = {
        "tabs": [
            { "tabId": "1234", "tab_Summary": "this web page is a wiki pedia page introducing London" },
            { "tabId": "0002", "tab_Summary": "this web page is the official web page of Jubilee line in London underground, showing it prices" },
            { "tabId": "0003", "tab_Summary": "this web page introduce The Forbidden city" },
            { "tabId": "0004", "tab_Summary": "LeetCode: Classic Interviews - 150 Questions. Master all the interview knowledge points. Valid address and contact information given" },
            { "tabId": "0005", "tab_Summary": "This linkedin webpage is the profile page of Ningbo Wei, who has 30 connections " },
            { "tabId": "0006", "tab_Summary": "this web page is about amazon jobs. Recommended position are 2025 Graduate Software Dev Engineer and Embedded Software Development Engineer" }
        ],
        "taskKeyWord": "job applying"
    };
    const exampleOutput = {
        "output": [
            { "task_title": "job applying", "tabId": ["0004", "0005", "0006"] }
        ]
    };
    const exampleInputText = JSON.stringify(exampleInput, null, 2);
    const exampleOutputText = JSON.stringify(exampleOutput, null, 2);

    const beginPrompt = `
        You are a helpful assistant in web tabs picking. 
        You will be given several summaries of different web tabs and a keyword. Please pick those tabs which related to the keyword as a group(task). The title of the new task is the keyword.
        Please return the result in JSON format. 
        Following is an example of input and output. Its key word is "job applying" hence the output task_title is "job applying".:
        ###### example input #######
        ${exampleInputText}
        ###### example output #######
        ${exampleOutputText}

        If "taskKeyWord" changed, the choosen tabs and task_title might be different. 
        For example, under same "tabs", when the "taskKeyWord" is "London traveling", the output selected tabId might become ["1234", "0002"] and task_title: "London traveling". Or, when the "taskKeyWord" is "Beijing traveling", the output selected tabId might become ["0003"] and task_title: "Beijing traveling".

        Remember, the returned task_title should be the same as the input "taskKeyWord".
    `;

    const tabInfoText = JSON.stringify(tabInfo, null, 2);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: beginPrompt },
                    { role: "user", content: tabInfoText }
                ],
                max_tokens: 500
            })
        });  // use await to solve the problem of synchronize

        const data = await response.json();
        
        if(response.status === 429 && retryCount > 0) {
            const retrySeconds = getRetrySeconds(data);
            console.warn(`Rate limit hit (429), api need ${retrySeconds}. Retrying in 1.5s... (${retryCount} retries left)`);
            await new Promise(resolve => setTimeout(resolve, retryInterval));  // 等待 1.5 秒   
            return await getClassificationByLLMWithKeyWord(tabInfo, keyWord, retryCount - 1);  // 递归重试
        }
        console.log("API Response for tab grouping", data);
        if (!data.choices || !data.choices[0].message || !data.choices[0].message.content) {
            throw new Error("Invalid API response format");
        }

        // 提取返回的内容
        let responseContent = data.choices[0].message.content.trim();

        // **去除 Markdown 代码块格式**（API 可能会返回 ` ```json ... ``` `）
        responseContent = responseContent.replace(/^```json|```$/g, "").trim();

        // **去除 JSON 中的多余逗号**，避免解析错误
        responseContent = responseContent.replace(/,\s*([\]}])/g, '$1');

        // **尝试解析 JSON**
        const jsonResponse = JSON.parse(responseContent);
        const outputList = jsonResponse.output;  // 获取列表
        console.log(outputList);

        return outputList;
    } catch (error) {
        console.error("Error:", error);
        return "Error fetching summary for this web tabs.";
    }
}

async function chat(prompt, retryCount = retryTime) {
    if(isTest){
        return "This is a test summary";
    }
    console.log("Sending request to GPT about " + prompt.slice(0, 100) + " for summary");
    const { apiBase, apiKey } = API_CONFIG;  // get api key
    const url = `${apiBase}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "You are a good assistant in helping user solve problem or explaining concept." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 300
            })
        });  // use await to solve the problem of synchronize
        const data = await response.json();
        if(response.status === 429 && retryCount > 0) {
            const retrySeconds = getRetrySeconds(data);
            console.warn(`Rate limit hit (429), api need ${retrySeconds}. Retrying in 1.5s... (${retryCount} retries left)`);
            await new Promise(resolve => setTimeout(resolve, retryInterval));  // 等待 1.5 秒   
            return await chat(prompt, retryCount - 1);  // 递归重试
        }
        if (!data.choices || !data.choices[0].message || !data.choices[0].message.content) {
            throw new Error("Invalid API response format");
        }
        // 提取返回的内容
        let responseContent = data.choices[0].message.content.trim();
        return responseContent;
    } catch (error) {
        console.error("Error:", error);
        return "Error getting response form LLM.";
    }
    
}
