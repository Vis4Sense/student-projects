chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // console.log("Message received:", message);
    //使用 chrome.runtime.onMessage.addListener 监听从 background.js 发送的消息
    // here input message is an object(对象) with action and id(tab.id)
    if (message.action === "fetch_content") {
        try {
            const id = message.id;
            const tab_idInBrowser = message.tab_idInBrowser;
            const title = document.title || "No title found";
            const mainElement = document.querySelector('main') || document.body;
            const mainText = mainElement ? mainElement.innerText.trim() : "No main content found";

            const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(heading => {
                const level = heading.tagName.slice(1);
                return `${"#".repeat(level)} ${heading.innerText.trim()}`;
            });
            const outline = headings.join("\n");
            const currentUrl = window.location.href;
            const summary = "haven't generate summary";
            const summaryLong = "haven't generate summary";
            sendResponse({ id, tab_idInBrowser, title, main_text: mainText, outline, currentUrl, summary, summaryLong });
        } catch (err) {
            console.error("Error in content.js:", err.message);
            sendResponse({ error: err.message });
        }
    }
    return true; // 必须返回 true 以支持异步响应
});

// return sample data
// {
//     "id": 1,
//     "title": "Sample Page",
//     "main_text": "This is the main content of the page.",
//     "outline": "# Heading 1\n## Heading 2",
//     "currentUrl": "https://example.com",
//     "embedding": [],
//     "shortSummary": "",
//     "longSummary": "",
//     "images": [
//       {
//         "url": "https://example.com/image1.png",
//         "base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..."
//       },
//       {
//         "url": "https://example.com/image2.jpg",
//         "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABg..."
//       }
//     ]
//   }

  
