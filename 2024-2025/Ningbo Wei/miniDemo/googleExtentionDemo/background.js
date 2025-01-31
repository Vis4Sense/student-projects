const results = []; // 存储已读取的 Tab 信息
const currentUrl = [];

// refresh the tabs information
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fetch_titles") {
        chrome.tabs.query({}, (tabs) => {
            console.log("Total tabs:", tabs.length);
            results.length = 0; // 清空结果，重新获取 refresh
            currentUrl.length = 0;
            tabs.forEach((tab) => {
                processTab(tab, sendResponse);
            });

        });
        // saveTabsLocally()
    }
    return true; // 支持异步响应
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

// return the tabs information 
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "get_tabs") {
        console.log("sending result, with length:", results.length);
        sendResponse({tabs:results})
        // chrome.storage.local.get("tabs", (result) => {
        //     sendResponse({ tabs: result.tabs || [] });
        // });
        return true; 
    }
});


// // 监听新建 Tab
// chrome.tabs.onCreated.addListener((tab) => {
//     console.log("New tab detected:", tab.url);
//     processTab(tab, results.length, 1, null); // 处理新 Tab
// });

// 监听 Tab 更新事件
// waiting for handle the redirection-----search api()
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        console.log("Tab updated:", tab.url);
        processTab(tab, null); // 处理更新后的 Tab
        saveTabsLocally()
        // sendToBackend(); // 发送一次结果
    }
});

// 处理单个 Tab 的信息提取和发送逻辑
function processTab(tab, sendResponse) {
    if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('about:') || tab.url.startsWith('http://localhost:')) {
        console.log("Skipping unsupported tab:", tab.url);
        return;
    }

    // 检查 URL 是否已存在于 results 中
    if(currentUrl.includes(tab.url)){
        console.log("Skipping duplicate URL:", tab.url);
        return;
    }
    currentUrl.push(tab.url);

    chrome.scripting.executeScript(
        { target: { tabId: tab.id }, files: ['content.js'] },
        () => {
            if (chrome.runtime.lastError) {
                console.error(`Script injection failed for tab ${tab.url}: ${chrome.runtime.lastError.message}`);
                return;
            }
            const uniqueId = `${Date.now()}-${tab.id}`; // 结合 tabId 和时间戳
            chrome.tabs.sendMessage(tab.id, { action: "fetch_content", id: uniqueId }, (response) => {
                if (response) {
                    results.push(response);
                    console.log("Added result for:", tab.url);
                } else {
                    console.error("Failed to fetch content for tab:", tab.url);
                }
                // sendToBackend(); // 每次处理完一个 Tab，都发送一次结果
                // if (pendingRequests === 1 && sendResponse) {
                //     // 如果是 fetch_titles 消息最后一个 Tab，发送结果到后端
                //     sendToBackend();
                // }
            });
        }
    );
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

