document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('fetch-titles');
    if (button) {
        button.addEventListener('click', () => {
            // after clicking button, sent a message to the backgroun.js
            chrome.runtime.sendMessage({ action: "fetch_titles" });  
        });
    } else {
        console.error("Button with id 'fetch-titles' not found");
    }
});
