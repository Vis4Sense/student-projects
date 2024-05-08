document.getElementById('save').addEventListener('click', function() {
    const endpoint = document.getElementById('endpoint').value;
    const apiKey = document.getElementById('apiKey').value;

    if (endpoint && apiKey) {
        chrome.storage.local.set({ endpoint, apiKey }, function() {
            console.log('API details saved.');
            window.close(); // Optionally close the popup after saving
        });
    } else {
        alert('Please fill in all fields.');
    }
});