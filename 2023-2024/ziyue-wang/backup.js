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

// Listen for messages
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "processContent") {
      // Received page title and body text for processing
      console.log("Received content for processing:", request.title, request.bodyText);

      // A simple function to analyze text and extract frequent words
      const analyzeText = (text) => {
        const words = text.match(/\w+/g);
        const frequencies = words.reduce((map, word) => {
          map[word] = (map[word] || 0) + 1;
          return map;
        }, {});
        return Object.entries(frequencies).sort((a, b) => b[1] - a[1]).slice(0, 10); // Top 10 words
      };

      // Analyze the body text to find frequent words
      const frequentWords = analyzeText(request.bodyText);
      console.log("Frequent words in text:", frequentWords);

      // Respond or perform other actions as needed
      sendResponse({message: `Content processed. Frequent words: ${JSON.stringify(frequentWords)}`});
      return true; // Keep the message channel open for async response
    }

    // Existing logic for fetching Knowledge Graph data remains unchanged
    // Replace with your existing code as needed
  }
);

