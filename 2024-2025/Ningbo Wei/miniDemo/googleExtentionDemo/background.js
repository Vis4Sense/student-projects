const results = []; // 存储已读取的 Tab 信息
const currentUrl = [];

// 监听 fetch_titles 消息
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
        sendToBackend(); // 每次处理完所有 Tab，都发送一次结果
    }
    return true; // 支持异步响应
});

// // 监听新建 Tab
// chrome.tabs.onCreated.addListener((tab) => {
//     console.log("New tab detected:", tab.url);
//     processTab(tab, results.length, 1, null); // 处理新 Tab
// });

// 监听 Tab 更新事件
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        console.log("Tab updated:", tab.url);
        processTab(tab, null); // 处理更新后的 Tab
        sendToBackend(); // 发送一次结果
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

// 将结果发送到后端
function sendToBackend() {
    console.log("Final results count:", results.length);
    fetch('http://localhost:8080/tabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tabs: results })
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            console.log("Sent tabs count:", results.length);
            return res.json();
        })
        .then(data => console.log("Data sent successfully:", data))
        .catch(err => console.error("Error sending data:", err));
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

