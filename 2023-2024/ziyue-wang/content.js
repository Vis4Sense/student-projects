chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "analyzePageContent") {
    // Capture the page title
    let title = document.title;
    console.log("Page title for analysis:", title);

    // Extract text content from the page body
    let bodyText = document.body.innerText;

    // Send the title and body text to background.js for further processing
    chrome.runtime.sendMessage({action: "processContent", title: title, bodyText: bodyText}, function(response) {
      console.log("Response from background:", response);
    });
  }
});
