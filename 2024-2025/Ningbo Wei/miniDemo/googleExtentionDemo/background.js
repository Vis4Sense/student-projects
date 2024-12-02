chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fetch_titles") {
        chrome.tabs.query({}, (tabs) => {
            const results = [];
            let pendingRequests = tabs.length;
            console.log("get totally tabs: "+ pendingRequests)
            tabs.forEach((tab, index) => {
                // 过滤不支持的页面
                if (tab.url.startsWith('chrome://') || tab.url.startsWith('about:')) {
                    console.log(" find a useless tab: " + tab.url)
                    pendingRequests--;
                    return;
                }

                console.log("trying to execute A: " + tab.url) //-------------------

                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['content.js']
                }, (results) => {
                    if (chrome.runtime.lastError) {
                        console.error(`Script injection failed for tab ${tab.id}: ${chrome.runtime.lastError.message}`);
                        pendingRequests--;
                        return;
                    }
                    
                    console.log("trying to execute B: " + tab.url) //-------------------

                    chrome.tabs.sendMessage(tab.id, { action: "fetch_content", id: index + 1 }, (response) => {
                        if (response) {
                            results.push(response);
                            // console.log("trying to execute C: " + tab.url) //-------------------
                            console.log("results have "+results.length+" trying to execute C: " + tab.url) //-------------------这里的results.length一直只返回2，为什么？

                        } else {
                            console.error(`Failed to fetch content for tab: ${tab.id}`);
                        }

                        pendingRequests--;
                        if (pendingRequests === 0) {
                            // 所有标签页的内容已提取，发送到后端
                            fetch('http://localhost:8080/tabs', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ tabs: results }) // 将数组包装在对象内，使用 "tabs" 作为键
                            })
                            .then(res => {
                                if (!res.ok) {
                                    throw new Error(`HTTP error! status: ${res.status}`);
                                }
                                console.log("sent tabs count "+ results.length)
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
