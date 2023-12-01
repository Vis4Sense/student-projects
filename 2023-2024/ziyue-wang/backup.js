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