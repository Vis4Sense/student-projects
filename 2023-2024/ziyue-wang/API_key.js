document.getElementById('saveBtn').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    if (apiKey) {
        // Save API Key into browser
        chrome.storage.sync.set({ apiKey }, () => {
            document.getElementById('message').textContent = 'API Key saved';
        });
    } else {
        document.getElementById('message').textContent = 'Please input API Key';
    }
});

// Show the saved API Key from the browser
chrome.storage.sync.get('apiKey', (data) => {
    if (data.apiKey) {
        document.getElementById('apiKeyInput').value = data.apiKey;
    }
});
