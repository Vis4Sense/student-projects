document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('fetch-titles');
    if (button) {
        button.addEventListener('click', () => {
            chrome.runtime.sendMessage({ action: "fetch_titles" });
        });
    } else {
        console.error("Button with id 'fetch-titles' not found");
    }
});
