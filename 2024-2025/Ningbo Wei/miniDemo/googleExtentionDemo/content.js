chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fetch_content") {
        const id = message.id; // 使用从 background.js 传递过来的顺序 ID
        const title = document.title || "No title found";
        const mainElement = document.querySelector('main') || document.body;
        const mainText = mainElement ? mainElement.innerText.trim() : "No main content found";

        // 提取大纲结构
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(heading => {
            const level = heading.tagName.slice(1); // 提取 heading 等级，例如 H1 -> 1
            return `${"#".repeat(level)} ${heading.innerText.trim()}`;
        });
        const outline = headings.join("\n");

        sendResponse({ id, title, main_text: mainText, outline, links: Array.from(document.links).map(link => link.href) });

        console.log("reading: " + title)
    }
    return true; // 必须返回 true 以支持异步响应
});
