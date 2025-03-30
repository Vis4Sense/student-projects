import { API_CONFIG } from './config.js';  // get config of API
// import { TfIdf } from './mytf-idf.js';  // get the TF-IDF model
// importScripts('transformers.min.js'); 
// import { pipeline } from '@xenova/transformers';
// import { TFIDF } from './tfidf.bundle.js';


const MAIN_TEXT_SIGMENT = 1000; // 主要文本的分段长度

const deploymentName = "gpt-4o-mini" // 模型部署名称
const deploymentName_embedding = "text-embedding-3-small" // 模型部署名称
const apiVersion = "2025-01-01-preview"  // API 版本

const retryTime = 23; // openai API 重试次数
const retryInterval = 2000; // openai API 重试间隔
const EMBEDDING_DIMESION = 256
const EMBEDDING_SELECTION_THREASHOLD = 0.2

let results = []; // 存储已读取的 Tab 信息
const currentUrl = [];
const isTest = false; // 是否为测试模式
let tasks = []; // 存储任务列表
let currentAPIrequestCount = 0; // 当前 API 请求次数
let extractor = null;

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
    else if(message.action === "check_LLM_api"){
        chat("Hello").then((reply) => {
            console.log("check_LLM_api: LLM API is ready");
            sendResponse({ apiStatus: "READY" });
        }).catch((err) => {
            console.error("check_LLM_api: LLM API is not ready:", err);
            sendResponse({ apiStatus: "FAILD" });
        });
        return true;
    }
    // directly sent the tabs information without reading again
    else if (message.action === "get_tabs") {
        console.log("sending result, with length:", results.length);
        sendTabsToFrontend();
        return true; 
    }
    else if(message.action === "update_result"){
        // console.log("update_result: current result ", results);
        const newTabsList = message.newTabsList;
        results.length = 0;
        results.push(...newTabsList);
        // results.set(addedTab);
        return true;
    }
    else if (message.action === "open_tab") {
        const openUrl = message.url;
        // 直接查找已经打开的 tab
        chrome.tabs.query({}, (tabs) => {
            const existingTab = tabs.find(tab => tab.url === openUrl);
            
            if (existingTab) {
                // 如果找到了已打开的 tab，则切换到该 tab
                chrome.tabs.update(existingTab.id, { active: true });
            } else {
                // 否则创建新的 tab
                chrome.tabs.create({ url: openUrl });
            }
        });
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
            sendResponse(true);
        });
        // send the updated tabs to the back-end
        // sendTabsToFrontend();
        // sendResponse(true);
        return true;
    }
    else if(message.action === "remove_tab_from_chacheResult"){
        const removedTabId = message.removedTabId;
        // remove the tab from theresult_tabs
        results = results.filter((t) => t.id !== removedTabId);
        return true;
    }
    else if(message.action === "remove_tab_from_mindmap") {
        // remove a tab from the mindmap
        console.log("remove_tab_from_mindmap: remove tab from mindmap", message);
        const removedTabId = message.removedTabId;
        const mindmapId = message.mindmapId;
        const newMindmap = message.newMindmap;
        chrome.storage.local.set({ [mindmapId]: newMindmap }, () => {
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
        const newTask = { task_id: "task"+basicId, name: taskName , MindmapId: "mindmap"+basicId, summary: "Haven't generate summary", createTime : new Date().toISOString()};
        tasks.unshift(newTask);
        // store the tasks in the chrome storage
        chrome.storage.local.set({ taskList: tasks }, () => {
            console.log("update taskList with new task", newTask);
        });
        sendTasksToFrontend({ tasks });
        return true;
    }
    else if(message.action === "update_task_summary") {
        const taskId = message.taskId;  // get the task id
        const taskSummary = message.summary;  // get the task summary
        // 更新内存变量 tasks
        tasks = tasks.map((task) => task.task_id === taskId ? { ...task, summary: taskSummary } : task);
        // **等待 storage 存储完成后再发送响应**
        chrome.storage.local.set({ taskList: tasks }, () => {
            console.log("Task summary updated:", taskId, taskSummary);
            // 确保存储完成后再发消息
            sendResponse("success update summary in storage"); 
        });
        return true;  // 保证异步操作能够完成
    }
    else if(message.action === "get_task_summary_from_storage") {
        const taskId = message.taskId;
         // 直接从 Chrome Storage 里获取最新数据
        chrome.storage.local.get(["taskList"], (result) => {
            const storedTasks = result.taskList || [];  // 读取最新存储的任务列表
            const task = storedTasks.find((task) => task.task_id === taskId);

            console.log("Task found in storage:", task);
            if (task) {
                if (task.summary) {
                    console.log("Task summary found:", task.summary);
                    sendResponse(task.summary);
                } else {
                    console.log("Task summary not found");
                    sendResponse("Task summary not found");
                }
            } else {
                console.log("Task not found");
                sendResponse("Task not found");
            }
        });

        return true;  // 必须 return true 让 Chrome 保持异步响应
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
        chrome.storage.local.remove([mindmapId], () => {
            sendResponse("success");
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
                newTasks.push({ task_id: "task"+basicId, name: output.Them, MindmapId: "mindmap"+basicId, summary: "Haven't generate summary", createTime : new Date().toISOString() });
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
                newTasks.push({ task_id: "task"+basicId, name: output.task_title, MindmapId: "mindmap"+basicId, summary: "Haven't generate summary", createTime : new Date().toISOString() });
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
    }else if(message.action === "personlise_Generate_tasks_TFIDF"){
        // 后期可以考虑用LLM生成多个近义词，然后再用TFIDF计算相似度
        const taskKeyWord = message.taskKeyWord;
        const tfidf = new TfIdf();
        const texts = [
            "Artificial intelligence is the new electricity.",
            "Machine learning is a subfield of artificial intelligence.",
            "today is a good day.",
            "I like to eat apple."
        ];
        
        // 添加文本
        texts.forEach(text => tfidf.addDocument(text));
        tfidf.computeIdf();
        // 计算关键词与每个文本的相似度
        texts.forEach((text, i) => {
            console.log(`文本: "${text}"，TF-IDF 相似度: ${tfidf.analyzeInput(taskKeyWord)}`);
        });

    }
    else if(message.action === "personlise_Generate_tasks_embedding") {
        const text = message.taskKeyWord;
        getEmbedding(text).then(inputEmbedding => {
            // get embedding from tabs, and calculate the consine similarty
            const scoredTabs = results
                .filter(tab => (tab.embedding.length > 2))
                .map(tab => ({
                    tabId: tab.id,
                    score: cosineSimilarity(inputEmbedding, tab.embedding)
                }));
            // rank the tabs based on consine similarty
            scoredTabs.sort((a, b) => b.score - a.score);
            console.log("personlise_Generate_tasks_embedding: scoredTabs ", scoredTabs)
            // 动态挑选：只要分数下降不剧烈就继续保留
            let topTabs = selectTopByMeanStd(scoredTabs);;
            // creat a new task
            const basicId = crypto.randomUUID();
            let newTask = []
            newTask.push({ task_id: "task"+basicId, name: text, MindmapId: "mindmap"+basicId, summary: "Haven't generate summary", createTime : new Date().toISOString() });
            // add picked tabs to the new task(mindmap)
            let newMindmap = [];
            topTabs.map((thisScoreItem) => {
                // add the tab to the new mindmap
                const tab = results.find((tab) => tab.id === thisScoreItem.tabId);
                if (tab) {
                    newMindmap.push(tab);
                }
                // delete the tab from the results
                const tabIndex = results.findIndex((tab) => tab.id === thisScoreItem.tabId);
                console.log("tabIndex", tabIndex);
                if (tabIndex !== -1) {
                    results = results.filter((tab) => tab.id !== thisScoreItem.tabId);
                }
            });
            // store the new mindmap in the chrome storage
            chrome.storage.local.set({ ["mindmap"+basicId]: newMindmap }, () => {
                console.log("update mindmap with new tabs", newMindmap);
            });
            // store the tasks in chrom storage
            tasks.unshift(...newTask);
            chrome.storage.local.set({ taskList: tasks }, () => {
                console.log("update taskList with new tasks", tasks);
            });
            sendTasksToFrontend(tasks);
            sendTabsToFrontend();
        });
        return true;
    }
    else if(message.action === "import_task"){
        const task_name = message.task_name;
        const task_summary = message.task_summary;
        const mindmap_tabs = message.mindmap_tabs;
        const basicId = crypto.randomUUID();
        // store the mindmap into chrome storage
        chrome.storage.local.set({ ["mindmap"+basicId]: mindmap_tabs }, () => {
            console.log("import_task: update mindmap with new tabs");
        });
        // store the task into chrome storage
        let newTasks = [];
        newTasks.push({ task_id: "task"+basicId, name: task_name, MindmapId: "mindmap"+basicId, summary: task_summary, createTime : new Date().toISOString() });
        tasks.unshift(...newTasks);
        chrome.storage.local.set({ taskList: tasks }, () => {
            console.log("update taskList with new tasks", tasks);
        });
        sendTasksToFrontend({ tasks });
        sendTabsToFrontend();
        return true;
    }
    else if(message.action === "LLM_conversation") {
        const prompt = message.prompt;
        const pre_prompt = message.pre_prompt || "";
        console.log("LLM_conversation: pre-Prompt from front-end:", pre_prompt);
        if (pre_prompt===""){
            const reply = chat(prompt).then((reply) => {
                sendResponse({ reply: reply});
            });
        }else{
            const reply = chat(prompt, retryTime, pre_prompt).then((reply) => {
                console.log("Reply from LLM:", reply);
                sendResponse({ reply: reply });
            });
        }
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
                chrome.runtime.sendMessage({ action: "generate_task_summary_reply", summary: reply, taskId: taskId });
            });
        });
        return true;
    }
    else if (message.action === "LLM_conversation_with_url"){
        const {pre_prompt, prompt, url} = message;
        fetchTabTextIfOpen(url).then((result) => {
            const new_pre_prompt = pre_prompt + result.content.slice(0,5000);

            const reply = chat(prompt, retryTime, new_pre_prompt).then((reply) => {
                console.log("Reply from LLM:", reply);
                sendResponse({ reply: reply });
            });
        });
        return true;
    }
    else if (message.action === "open_annotation_page") {
        const { tabId, title, taskId, note } = message;
        console.log("open_annotation_page: reveived id: ", tabId);
        const url = `annotate.html?tabId=${tabId}&title=${encodeURIComponent(title)}&note=${encodeURIComponent(note || '')}&taskId=${encodeURIComponent(taskId || '')}`;
        chrome.windows.create({
            url,
            type: "popup",
            width: 400,
            height: 400
        });
        return true;
    }
    else if (message.action === "save_tab_note") {
        const { tabId, note, taskId} = message;
        console.log("save_tab_note: get note: ", note);
        console.log("tabid is: ", tabId);
        if(taskId.length <= 2){
            // this tab is not in a task
            const tabIndex = results.findIndex(tab => tab.id === tabId);
            if (tabIndex !== -1) {
                results[tabIndex].note = note;
            }
            sendResponse("success");
            sendTabsToFrontend();
        }else{
            // this tab is in a task
            const mindmapId = "mindmap" + taskId.replace("task", "");
            console.log("mindmapId is: ", mindmapId);
            chrome.storage.local.get([mindmapId], (result) => {
                const mindmapTabs = result[mindmapId] || [];
                const tabIndex = mindmapTabs.findIndex(tab => tab.id === tabId);
                console.log("tabIndex is: ", tabIndex);
                if (tabIndex !== -1) {
                    mindmapTabs[tabIndex].note = note;
                    // update storage
                    chrome.storage.local.set({ [mindmapId]: mindmapTabs }, () => {
                        console.log("Mindmap tabs updated in storage:", mindmapTabs);
                        sendMindmapToFrontend(mindmapId);
                    });
                }
            });
            sendResponse("success");
        }
        
        return true;
    }
    else if(message.action === "change_tab_color") {
        const { tabId, taskId, color} = message;
        console.log("get_tab_note: get color: ", color);
        if(taskId.length <= 2){
            // this tab is not in a task
            const tabIndex = results.findIndex(tab => tab.id === tabId);
            if (tabIndex !== -1) {
                results[tabIndex].color = color;
            }
            sendResponse("success");
            sendTabsToFrontend();
        }else{
            // this tab is in a task
            const mindmapId = "mindmap" + taskId.replace("task", "");
            console.log("mindmapId is: ", mindmapId);
            chrome.storage.local.get([mindmapId], (result) => {
                const mindmapTabs = result[mindmapId] || [];
                const tabIndex = mindmapTabs.findIndex(tab => tab.id === tabId);
                console.log("tabIndex is: ", tabIndex);
                if (tabIndex !== -1) {
                    mindmapTabs[tabIndex].color = color;
                    // update storage
                    chrome.storage.local.set({ [mindmapId]: mindmapTabs }, () => {
                        console.log("Mindmap tabs updated in storage:", mindmapTabs);
                        sendMindmapToFrontend(mindmapId);
                    });
                }
            });
            sendResponse("success");
        }
        
        return true;
    }
    
});

// 发送 tabs 信息到 React 前端(直接发送，不需要front-end request)
function sendTabsToFrontend() {
    chrome.runtime.sendMessage({ action: "update_tabs", tabs: results });
}

function sendMindmapToFrontend(mindmapId) {
    chrome.storage.local.get([mindmapId], (result) => { 
        const mindmapTabs = result[mindmapId] || [];
        console.log("mindmapTabs", mindmapTabs);
        chrome.runtime.sendMessage({ action: "update_mindmap", mindmapId: mindmapId, mindmapTabs: mindmapTabs });
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
        console.log("new Tab updated:", tab.url);
        if (!tab.url 
            || tab.url.startsWith('chrome://') 
            || tab.url.startsWith('about:') 
            || tab.url.startsWith('http://localhost:') 
            || tab.url.startsWith('chrome-extension://')) {
            console.log("Skipp this tab:");
            return;
        }
        // 确保 processTab 完成后再执行 sendTabsToFrontend
        processTab(tab).then(() => {
            sendTabsToFrontend();
        });
    }
});

function updateAPIwaitingTime(waitingTime) {
    // 更新 API 等待时间
    chrome.runtime.sendMessage({ action: "update_API_waiting_time", waitingTime: waitingTime });
}

function updateAPIrequestCount() {
    // 更新 API 请求次数
    chrome.runtime.sendMessage({ action: "update_API_request_count", count: currentAPIrequestCount });
}

function updateLLMreadyStatus(apiStatus) {
    // 更新 LLM API 状态
    chrome.runtime.sendMessage({ action: "update_LLM_api_status", apiStatus: apiStatus });
}

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

                chrome.tabs.sendMessage(tab.id, { action: "fetch_content", id: uniqueId, tab_idInBrowser: tab.id }, (response) => {
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

                        sendTabsToFrontend();
                        let textForEmbedding = "";
                        // currentAPIrequestCount += 1;
                        getSummaryWithRateLimitHandling(response.title, response.main_text, response.outline)
                            .then((summary) => {
                                // currentAPIrequestCount -= 1;
                                const longSummary = summary.summary[0].longSummary;
                                const shortSummary = summary.summary[0].shortSummary;
                                const tabIndex = results.findIndex(t => t.id === response.id);
                                console.log(`receive two summaries for tabId ${response.title}`, shortSummary, longSummary);
                                if (tabIndex !== -1) {
                                    results[tabIndex].summary = shortSummary;
                                    results[tabIndex].summaryLong = longSummary;
                                    textForEmbedding = longSummary;
                                    results[tabIndex].main_text = ""; // 清空 mainText，减小数据量
                                    results[tabIndex].outline = ""; // 清空 outline，减小数据量
                                    results[tabIndex].images = []; // 清空 images，减小数据量
                                    // console.log(`Updated tow summary for tabId ${response.title}`);
                                    sendTabsToFrontend(); // 再次通知前端更新 UI
                                    // calculate embedding
                                    getEmbedding(textForEmbedding)
                                    .then((embeddingResult) => {
                                        const tabIndex = results.findIndex(t => t.id === response.id);
                                        if(tabIndex !== -1 ){
                                            results[tabIndex].embedding = embeddingResult;
                                            sendTabsToFrontend();
                                        }
                                    })
                                    .catch(err => {
                                        console.error("Error generating embedding:", err);
                                    });
                                }
                            })
                            .catch(err => {
                                // currentAPIrequestCount -= 1;
                                console.error("Error generating summary:", err);
                                const tabIndex = results.findIndex(t => t.id === response.id);
                                if (tabIndex !== -1) {
                                    results[tabIndex].summary = "error in generating summary";
                                    results[tabIndex].summaryLong = "error in generating summary";
                                    results[tabIndex].embedding = [0];
                                    results[tabIndex].main_text = ""; // 清空 mainText，减小数据量
                                    results[tabIndex].outline = ""; // 清空 outline，减小数据量
                                    results[tabIndex].images = []; // 清空 images，减小数据量
                                    // console.log(`Updated tow summary for tabId ${response.title}`);
                                    sendTabsToFrontend(); // 再次通知前端更新 UI
                                }

                            });
                    } else {
                        console.error("Failed to fetch content for tab:", tab.url);
                    }
                    resolve();
                });

                // setTimeout(() => {
                //     console.warn(`Timeout: No response from tab ${tab.url}, resolving anyway.`);
                //     resolve();
                // }, 8000);
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

function getMainTextSlice(mainText) {
    // get thress slices of the main text
    let mainText_length = mainText.length;
    if(mainText_length <= 3 * MAIN_TEXT_SIGMENT){
        return mainText;
    }
    const midPos = Math.floor(mainText_length / 2);
    const first_slice = mainText.slice(0, MAIN_TEXT_SIGMENT);
    const second_slice = mainText.slice(midPos, midPos + MAIN_TEXT_SIGMENT);
    const last_slice = mainText.slice(-MAIN_TEXT_SIGMENT);
    return `
    ---- fist ${MAIN_TEXT_SIGMENT} characters ----
        ${first_slice}
    ---- middle ${MAIN_TEXT_SIGMENT} characters ----
        ${second_slice}
    ---- last ${MAIN_TEXT_SIGMENT} characters ----
        ${last_slice}
    `;

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
            currentAPIrequestCount -= 1;
            updateAPIwaitingTime(retrySeconds);
            console.warn(`Rate limit hit (429), api need ${retrySeconds}. Retrying in 1.5s... (${retryCount} retries left)`);
            await new Promise(resolve => setTimeout(resolve, retryInterval));
            return await getSummaryByLLMwithUrl(webpageUrl, retryCount - 1);
        }
        updateAPIwaitingTime(0);
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
    currentAPIrequestCount += 1;
    updateLLMreadyStatus("WORKING");
    updateAPIrequestCount();
    console.log("Sending request to GPT about " + title.slice(0, 100) + " for summary");
    const { apiBase, apiKey } = API_CONFIG;  // get api key

    const url = `${apiBase}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;
    
    const exampleOutput = {
        "summary": [
            { 
                "shortSummary": "xxx",
                "longSummary": "xxxxxx"
            }
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
        ${title.slice(0, 150)}

        ####### Main Context #######
        ${getMainTextSlice(main_text)}

        ####### Outline #######
        ${outline.slice(0, 800)}
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
            currentAPIrequestCount -= 1;
            updateAPIwaitingTime(retrySeconds);
            console.warn(`Rate limit hit (429), api need ${retrySeconds}. Retrying in 1.5s... (${retryCount} retries left)`);
            await new Promise(resolve => setTimeout(resolve, retryInterval));
            return await getSummaryByLLM(title, main_text, outline, retryCount - 1);
        }
        console.log("API Response:", data);
        updateAPIwaitingTime(0);
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
        if (!summary.summary || !summary.summary[0].shortSummary || !summary.summary[0].longSummary) {
            throw new Error("JSON 数据缺少必要的字段");
        }
        currentAPIrequestCount -= 1;
        updateLLMreadyStatus("READY");
        updateAPIrequestCount();
        return summary;
    } catch (error) {
        console.error("Error:", error);
        currentAPIrequestCount -= 1;
        updateLLMreadyStatus("READY");
        updateAPIrequestCount();
        return "Error fetching summary for this web tabs.";
    }
}


async function getClassificationByLLM(tabInfo, retryCount = retryTime) {
    if (isTest) {
        return "This is a test summary";
    }
    currentAPIrequestCount += 1;
    updateAPIrequestCount();
    updateLLMreadyStatus("WORKING");
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
            { "Them": "London traveling", "tabId": ["1234", "0002", "0004"] },
            { "Them": "Beijing tourist", "tabId": ["0003", "006"] },
            { "Them": "Coding practice", "tabId": ["0005"] }
        ]
    };
    const exampleInputText = JSON.stringify(exampleInput, null, 2);
    const exampleOutputText = JSON.stringify(exampleOutput, null, 2);

    const beginPrompt =  `
        You are an assistant skilled in understanding webpage content and classifying it by topic.
        I will provide a list of webpages, each with a short summary.
        Your task is to categorize each webpage into an appropriate topic based on its content.

        Please follow these rules:

        1. Group webpages with similar or related content under the same topic.

        2. Each webpage should be assigned to only one most suitable topic.

        3. Output is a list of dictionaries in JSON format. A example of input and output is given later.

        If multiple pages belong to the same category, make sure the topic name is consistent across them.

        ###### example input #######
        ${exampleInputText}

         ###### example output #######
        ${exampleOutputText}
    `

    // const beginPrompt = `
    //     You are a helpful assistant in web tabs clustering. 
    //     You will be given several tabs and their summaries.
    //     These tabs are usually about traveling. 
    //     What you need to do is classify these tabs based on city. You need to consider information in the summaries, like city name, famous places, train station, airport, well known company or famous people. 
    //     Some tabs might not related to a city, and you need to ignore them. For example, a tab about a programming website should be ignored.
    //     You need to return a list of dictionaries, each containing a city name and a list of tabId. Please return the result in JSON format. 
    //     Following is an example:
    //     ###### example input #######
    //     ${exampleInputText}
    //     ###### example output #######
    //     ${exampleOutputText}
    // `;

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
            currentAPIrequestCount -= 1;
            updateAPIwaitingTime(retrySeconds);
            console.warn(`Rate limit hit (429), api need ${retrySeconds}. Retrying in 1.5s... (${retryCount} retries left)`);
            await new Promise(resolve => setTimeout(resolve, retryInterval));  // 等待 1.5 秒   
            return await getClassificationByLLM(tabInfo, retryCount - 1);  // 递归重试
        }
        updateAPIwaitingTime(0);
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
        currentAPIrequestCount -= 1;
        updateLLMreadyStatus("READY");
        updateAPIrequestCount();
        return outputList;
    } catch (error) {
        console.error("Error:", error);
        currentAPIrequestCount -= 1;
        updateLLMreadyStatus("READY");
        updateAPIrequestCount();
        return "Error fetching summary for this web tabs.";
    }
}

async function getClassificationByLLMWithKeyWord(tabInfo, keyWord, retryCount = retryTime) {
    if (isTest) {
        return "This is a test summary";
    }
    currentAPIrequestCount += 1;
    updateAPIrequestCount();
    updateLLMreadyStatus("WORKING");
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
            currentAPIrequestCount -= 1;
            updateAPIwaitingTime(retrySeconds);
            console.warn(`Rate limit hit (429), api need ${retrySeconds}. Retrying in 1.5s... (${retryCount} retries left)`);
            await new Promise(resolve => setTimeout(resolve, retryInterval));  // 等待 1.5 秒   
            return await getClassificationByLLMWithKeyWord(tabInfo, keyWord, retryCount - 1);  // 递归重试
        }
        updateAPIwaitingTime(0);
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
        currentAPIrequestCount -= 1;
        updateLLMreadyStatus("READY");
        updateAPIrequestCount();
        return outputList;
    } catch (error) {
        console.error("Error:", error);
        currentAPIrequestCount -= 1;
        updateLLMreadyStatus("READY");
        updateAPIrequestCount();
        return "Error fetching summary for this web tabs.";
    }
}

async function chat(prompt, 
    retryCount = retryTime,
    pre_prompt = "You are a good assistant in helping user solve problem or explaining concept." 
) {
    if(isTest){
        return "This is a test summary";
    }
    currentAPIrequestCount += 1;
    updateAPIrequestCount();
    updateLLMreadyStatus("WORKING");
    console.log("Chat: Sending request to GPT [" + pre_prompt.slice(0,200) +"] ---;--- [" + prompt.slice(0, 100) + " ]");
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
                    { role: "system", content: pre_prompt },
                    { role: "user", content: prompt }
                ],
                max_tokens: 300
            })
        });  // use await to solve the problem of synchronize
        const data = await response.json();
        if(response.status === 429 && retryCount > 0) {
            const retrySeconds = getRetrySeconds(data);
            currentAPIrequestCount -= 1;
            updateAPIwaitingTime(retrySeconds);
            console.warn(`Rate limit hit (429), api need ${retrySeconds}. Retrying in 1.5s... (${retryCount} retries left)`);
            await new Promise(resolve => setTimeout(resolve, retryInterval));  // 等待 1.5 秒   
            return await chat(prompt, retryCount - 1);  // 递归重试
        }
        updateAPIwaitingTime(0);
        if (!data.choices || !data.choices[0].message || !data.choices[0].message.content) {
            throw new Error("Invalid API response format");
        }
        // 提取返回的内容
        let responseContent = data.choices[0].message.content.trim();
        currentAPIrequestCount -= 1;
        updateLLMreadyStatus("READY");
        updateAPIrequestCount();
        return responseContent;
    } catch (error) {
        console.error("Error:", error);
        currentAPIrequestCount -= 1;
        updateLLMreadyStatus("READY");
        updateAPIrequestCount();
        return "Error getting response form LLM.";
    }
}

async function getEmbedding(texts) {
    // sent the texts to the azure LLM to get the embeddings
    const{ apiBase, apiKey } = API_CONFIG;
    const url = `${apiBase}/openai/deployments/${deploymentName_embedding}/embeddings?api-version=${apiVersion}`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey
            },
            body: JSON.stringify({ input: texts, dimensions: EMBEDDING_DIMESION })
        });
        const data = await response.json();
        console.log("API Response for embedding", data);
        if (!data.data[0].embedding) {
            throw new Error("Invalid API response format");
        }
        return data.data[0].embedding;
    } catch (error) {
        console.error("getEmbedding(): Error:", error);
        return "getEmbedding(): Error getting embeddings from LLM.";
    }
}

function cosineSimilarity(vecA, vecB) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }
  
function selectTopByMeanStd(scoredTabs) {
    // 均值 + 标准差筛选法
    if (!Array.isArray(scoredTabs) || scoredTabs.length === 0) return [];

    const scores = scoredTabs.map(item => item.score);
    const mean = scores.reduce((sum, val) => sum + val, 0) / scores.length;

    const variance = scores.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);

    const threshold = mean + 0.5*stdDev;

    return scoredTabs.filter(item => item.score >= threshold);
}

function selectTopByScoreGap(scoredTabs, thresholdGap = EMBEDDING_SELECTION_THREASHOLD) {
    //差值阈值法
    const result = [];
    for (let i = 0; i < scoredTabs.length; i++) {
        result.push(scoredTabs[i]);
        const next = scoredTabs[i + 1];
        if (!next) break;
        if ((scoredTabs[i].score - next.score) > thresholdGap) break;
    }
    return result;
}

// 查找是否有 tab 打开了指定 URL
const findTabByUrl = async (targetUrl) => {
    return new Promise((resolve) => {
      chrome.tabs.query({}, (tabs) => {
        const matchedTab = tabs.find((tab) => tab.url && tab.url.includes(targetUrl));
        resolve(matchedTab || null);
      });
    });
};
  
  // 注入脚本，从 tab 页面中提取 main 或 body 的纯文本
const getTabMainText = async (tabId) => {
    return new Promise((resolve) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          func: () => {
            const mainElement = document.querySelector('main') || document.body;
            const mainText = mainElement ? mainElement.innerText.trim() : "No main content found";
            return mainText;
          },
        },
        (results) => {
          if (chrome.runtime.lastError) {
            resolve({ error: chrome.runtime.lastError.message });
          } else {
            resolve({ text: results[0].result });
          }
        }
      );
    });
};
  
    // 主流程：查找 tab + 获取内容
const fetchTabTextIfOpen = async (urlToCheck) => {
    const tab = await findTabByUrl(urlToCheck);
    
    // ✅ 情况 1：如果该网页已打开，注入脚本提取 main
    if (tab) {
        const content = await getTabMainText(tab.id);
        return {
        found: true,
        fromTab: true,
        tabId: tab.id,
        url: tab.url,
        content: content.text || ""
        };
    }
    
    // ✅ 情况 2：该网页没打开，fetch + 注入别的 tab 来解析 
    console.log("trying to visit: ", urlToCheck);
    const htmlResult = await fetchRawHtml(urlToCheck);  // !!!! 
    /*
        What we get is a orignal HTML file, it contains some content like JS.
        orignal HTML will be load into a webpage by browse, but here we only read info diractly from the orignal HTML.

        Reason why I don't user browser to handle the orignal HTML befor extracting info is that, this will creat a new tab.
        Hence here might seem to have some bugs...
    */
    if (!htmlResult.success) {
        console.log("failed to visit");
        return { found: false, error: htmlResult.error };
    }
    // 找一个可注入的 tab（任意前台 tab 即可）
    const candidateTabs = await getInjectableTab();
    
    if (!candidateTabs) {
        console.log("no tab to do injection");
        return { found: false, error: "No active tab available to inject" };
    }
    
    const injectedTabId = candidateTabs.id;
    const htmlString = htmlResult.html;
    
    // 注入脚本 + 传入 HTML 字符串，提取 main 内容
    return new Promise((resolve) => {
        chrome.scripting.executeScript(
        {
            target: { tabId: injectedTabId },
            func: (html) => {
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const mainElement = doc.querySelector("main") || doc.body;
                const mainText = mainElement ? mainElement.innerText.trim() : "No main content found";
                return mainText;
            } catch (e) {
                return "DOM parsing failed: " + e.toString();
            }
            },
            args: [htmlString],
        },
        (results) => {
            if (chrome.runtime.lastError) {
                console.log("error in analyse html", chrome.runtime.lastError.message);
                resolve({ found: false, error: chrome.runtime.lastError.message });
            } else {
                console.log("mainText result: ", results);
                resolve({
                    found: true,
                    fromTab: false,
                    tabId: injectedTabId,
                    url: urlToCheck,
                    content: results?.[0]?.result || ""
                });
            }
        }
        );
    });
};

      

const fetchRawHtml = async (urlToCheck) => {
    try {
      const response = await fetch(urlToCheck);
      const html = await response.text();
      return { success: true, html };
    } catch (err) {
      console.error("Failed to fetch remote HTML:", err);
      return { success: false, error: err.toString() };
    }
};

const getInjectableTab = async () => {
    return new Promise((resolve) => {
      chrome.tabs.query({}, (tabs) => {
        const realPage = tabs.find(
          (tab) =>
            tab.url &&
            !tab.url.startsWith("chrome://") &&
            !tab.url.startsWith("chrome-extension://")
        );
        resolve(realPage || null);
      });
    });
  };
  
  