chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // console.log("Message received:", message);
    //使用 chrome.runtime.onMessage.addListener 监听从 background.js 发送的消息
    // here input message is an object(对象) with action and id(tab.id)
    if (message.action === "fetch_content") {
        try {
            const id = message.id;
            const title = document.title || "No title found";
            const mainElement = document.querySelector('main') || document.body;
            const mainText = mainElement ? mainElement.innerText.trim() : "No main content found";

            const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(heading => {
                const level = heading.tagName.slice(1);
                return `${"#".repeat(level)} ${heading.innerText.trim()}`;
            });
            const outline = headings.join("\n");
            const currentUrl = window.location.href;

            // 提取页面中的前五张图片
            // 可有后期更改： 结合尺寸和位置权重，提取最重要的图片
            const images = Array.from(document.querySelectorAll('img'))
                .slice(0, 5)
                .map(img => {
                    const imageUrl = img.src || '';
                    return new Promise(resolve => {
                        try {
                            const imgElement = new Image();
                            imgElement.crossOrigin = 'Anonymous';
                            imgElement.src = imageUrl;
                            imgElement.onload = () => {
                                const canvas = document.createElement('canvas');
                                const context = canvas.getContext('2d');
                                canvas.width = imgElement.width;
                                canvas.height = imgElement.height;
                                context.drawImage(imgElement, 0, 0);
                                const base64 = canvas.toDataURL('image/png');
                                resolve({ url: imageUrl, base64 });
                            };
                            imgElement.onerror = () => {
                                console.warn(`Failed to load image: ${imageUrl}`);
                                resolve({ url: imageUrl, base64: '' });
                            };
                        } catch (error) {
                            console.warn(`Error processing image: ${imageUrl}`, error);
                            resolve({ url: imageUrl, base64: '' });
                        }
                    });
                });

            const summary = "haven't generate summary";
            // 等待所有图片的 Base64 转换完成
            Promise.all(images).then(imagesData => {
                sendResponse({ id, title, main_text: mainText, outline, currentUrl, images: imagesData, summary });
            });
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
  
