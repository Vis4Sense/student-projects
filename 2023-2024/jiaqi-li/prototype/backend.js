console.log("*****************backend script running.***************");

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    // Check if the message contains mainContent
    if (message.mainContent) {
        setTimeout(function() {
            var mainContent = message.mainContent;
            // Process the mainContent received from the content script
            console.log('Main content received:', mainContent);
            // Perform any further actions with the mainContent
        }, 2000);
        
    }
});