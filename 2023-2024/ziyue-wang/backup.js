chrome.runtime.onInstalled.addListener(function() {
    console.log("Sensemaking Extension installed.");
    //add other initializing codes here
});
  
// listen information from popup.js 
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.contentScriptQuery === "fetchKnowledgeGraphData") {
    const kgApi = new KnowledgeGraphAPI();
    kgApi.search(request.query)
      .then(data => {
        sendResponse({data: data});
      })
      .catch(error => {
        console.error('Error:', error);
        sendResponse({error: error.message});
      });
    return true;
  }
});

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

// Example: Send page content for advanced analysis to your backend service.
function sendForAdvancedAnalysis(title, bodyText) {
  // Fetching the current tab URL
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTabUrl = tabs[0].url;

    fetch('https://your-backend-service.com/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({url: currentTabUrl, title, bodyText}),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Advanced analysis results:', data);
      // Process the returned analysis results here.
    })
    .catch(error => {
      console.error('Error during advanced analysis:', error);
    });
  });
}

