chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fetch_content") {
        const title = document.title;
        const mainContent = document.querySelector('main') || document.body;
        const textContent = mainContent ? mainContent.innerText : "No content found";
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(heading => {
            const level = heading.tagName.slice(1); // "H1" -> "1"
            return `${"#".repeat(level)} ${heading.innerText.trim()}`;
        });
        const markdownOutline = headings.join("\n");

        const uniqueID = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        sendResponse({ id: uniqueID, title, textContent, markdownOutline });
    }
    return true; // Required to use sendResponse asynchronously
});
