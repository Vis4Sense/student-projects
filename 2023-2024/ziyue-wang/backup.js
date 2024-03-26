chrome.runtime.onInstalled.addListener(function() {
    console.log("Sensemaking Extension installed.");
    //add other initializing codes here
  });
  
  // listen information from popup.js
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.contentScriptQuery == "fetchKnowledgeGraphData") {
        var url = "https://kgsearch.googleapis.com/v1/entities:search?query=" +
                  encodeURIComponent(request.query) + "&key=YOUR_API_KEY&limit=1";
                  // we need to replace it with api key word from google cloud platform
        fetch(url)
          .then(response => response.json())
          .then(response => sendResponse({data: response}))
          .catch(error => console.log('Error fetching data:', error));
        return true;  // Will respond asynchronously.
      }
    }
  );

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.active) {
    // inform content.js to conduct analyzing the content of website pages
    chrome.tabs.sendMessage(tabId, {action: "analyzePageContent"});
  }
});
