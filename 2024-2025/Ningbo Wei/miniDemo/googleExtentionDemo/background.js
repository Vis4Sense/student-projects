const results = []; // 存储已读取的 Tab 信息
const currentUrl = [];

// refresh the tabs information
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // read currently opened tabs and sent it to the front-end
    if (message.action === "fetch_titles") {
        chrome.tabs.query({}, async (tabs) => {
            console.log("Total tabs:", tabs.length);
            results.length = 0; // 清空结果
            currentUrl.length = 0;
            // 用 Promise.all 等待所有 processTab 任务完成
            await Promise.all(tabs.map(tab => processTab(tab)));
            // 现在所有 tabs 处理完了，才发送更新给前端
            sendTabsToFrontend();
        });
        return true; // 支持异步响应
    }
    // directly sent the tabs information without reading again
    if (message.action === "get_tabs") {
        console.log("sending result, with length:", results.length);
        sendTabsToFrontend();
        return true; 
    }
    // do summarization of a tab
    if (message.action === "summarize_tab") {
        console.log("Received tab title for summary:", message.title);
        // 这里可以继续调用 API 或处理摘要逻辑
        // sendResponse({ status: "Title received successfully" });
        return true; // 支持异步响应
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
                        results.push(response);
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

