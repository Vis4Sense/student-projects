
// Function to extract page content
function extractPageContent() {
    let pageContent = '';
    // Check if the URL includes 'chat.openai.com'
    if (document.location.href.includes('chat.openai.com')) {
        const chatElements = [...document.querySelectorAll('.whitespace-pre-wrap')];
        const chatText = chatElements.map((element) => element.textContent.trim()).join('\n\n');
        pageContent += chatText;
    } else {
        // Select h1, h2, h3, h4, h5 and paragraph text
        const selector = '#main-content,#markdown-content,h1, h2, h3, h4, h5, h6, p';
        const elements = document.querySelectorAll(selector);

        elements.forEach((element) => {
            const elementText = element.innerText;
            if (elementText !== 'New chat') {
                pageContent += elementText + '\n\n';
            }
        });
    }
    console.log(pageContent);
    return pageContent;
}

// Execute the function and send the result back to the main script
chrome.runtime.sendMessage({
    action: 'extractedPageContent',
    pageContent: extractPageContent()
});
