chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fetch_titles") {
        chrome.tabs.query({}, (tabs) => { // 获取所有标签页
            const results = [];
            let pendingRequests = tabs.length;

            tabs.forEach(tab => {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['content.js']
                }, () => {
                    chrome.tabs.sendMessage(tab.id, { action: "fetch_content" }, (response) => {
                        if (response) {
                            results.push(response);
                        } else {
                            console.error(`Failed to fetch content for tab: ${tab.id}`);
                        }

                        // 检查所有请求是否完成
                        pendingRequests--;
                        if (pendingRequests === 0) {
                            // 所有标签页的内容已提取，发送到后端
                            fetch('http://localhost:8080/tabs', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ tabs: results })
                            })
                            .then(res => res.json())
                            .then(data => console.log("Data sent successfully:", data))
                            .catch(err => console.error("Error sending data:", err));
                        }
                    });
                });
            });
        });
    }
});
