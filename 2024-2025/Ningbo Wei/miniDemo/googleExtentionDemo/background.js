chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fetch_titles") {
        chrome.tabs.query({}, (tabs) => {
            const results = [];
            let pendingRequests = tabs.length;
            console.log("get totally tabs: " + pendingRequests);

            tabs.forEach((tab, index) => {
                // 过滤不支持的页面
                if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('about:')) {
                    console.log(" find a useless tab: " + tab.url);
                    pendingRequests--;
                    return;
                }

                console.log("trying to execute A: " + tab.url);

                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['content.js']
                }, () => {
                    if (chrome.runtime.lastError) {
                        console.error(`Script injection failed for tab ${tab.id}: ${chrome.runtime.lastError.message}`);
                        pendingRequests--;
                        return;
                    }

                    console.log("trying to execute B: " + tab.url);

                    // 使用 Promise 处理异步操作
                    chrome.tabs.sendMessage(tab.id, { action: "fetch_content", id: index + 1 }, (response) => {
                        if (response) {
                            results.push(response);
                            console.log("Added result for: " + tab.url);
                        } else {
                            console.error(`Failed to fetch content for tab: ${tab.id}`);
                        }

                        pendingRequests--;
                        console.log(`Pending requests left: ${pendingRequests}`);

                        // 检查是否所有请求完成
                        if (pendingRequests === 0) {
                            console.log("Final results count: " + results.length);
                            fetch('http://localhost:8080/tabs', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ tabs: results }) // 将数组包装在对象内
                            })
                                .then(res => {
                                    if (!res.ok) {
                                        throw new Error(`HTTP error! status: ${res.status}`);
                                    }
                                    console.log("sent tabs count " + results.length);
                                    return res.json();
                                })
                                .then(data => console.log("Data sent successfully:", data))
                                .catch(err => console.error("Error sending data:", err));
                        }
                    });
                });
            });
        });
    }
});
