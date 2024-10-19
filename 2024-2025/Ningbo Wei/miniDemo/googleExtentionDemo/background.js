// chrome.action.onClicked.addListener((tab) => {
//     console.log("try to get taps");  // 打印标题数组，检查是否正确
//     chrome.tabs.query({}, (tabs) => {
//         const tabTitles = tabs.map(t => t.title);
//         console.log("Tab Titles:", tabTitles);  // 打印标题数组，检查是否正确
//         fetch('http://localhost:8080/tabs', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ titles: tabTitles }),
//         })
//         .then(response => response.json())
//         .then(data => console.log('Success:', data))
//         .catch((error) => {
//             console.error('Error:', error);
//         });
//     });
// });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetch_titles") {
        chrome.tabs.query({}, (tabs) => {
            const tabTitles = tabs.map(t => t.title);
            console.log("Tab Titles:", tabTitles);  // 打印标题数组，检查是否正确
            fetch('http://localhost:8080/tabs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ titles: tabTitles }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                sendResponse({ success: true });
            })
            .catch((error) => {
                console.error('Error:', error);
                sendResponse({ success: false });
            });

            return true;  // 表示异步响应
        });
    }
});