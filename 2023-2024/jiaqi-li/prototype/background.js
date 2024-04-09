const MAIN_WINDOW_FILENAME = "popup.html";

chrome.action.onClicked.addListener(activate_main_window)


function activate_main_window(){
    // Construct the main_window URL
    const targetURL = chrome.runtime.getURL(MAIN_WINDOW_FILENAME);
    // Query tabs to find if any match the URL
    chrome.tabs.query({}, (tabs) => {
      let found = false;
      for (const tab of tabs) {
        if (tab.url === targetURL) {
          found = true;
          // Make the tab active within its window
          chrome.tabs.update(tab.id, { active: true });
  
          // Bring the window to the front
          chrome.windows.update(tab.windowId, {
            drawAttention: true,
            focused: true,
          });
          break;
        }
      }
      
      if (!found) {
        // Create the main_window
        chrome.windows.create({
          url: chrome.runtime.getURL(MAIN_WINDOW_FILENAME),
          type: "popup",
        });
      }
    });  
  }

// Function to inject content script into a tab
function injectContentScript(tabId) {
  chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content_script.js']
  }).then(() => {
      console.log('Content script injected into tab:', tabId);
  }).catch(error => {
      console.error('Failed to inject content script:', error);
  });
}

// Event listener for when the extension is installed or enabled
chrome.runtime.onInstalled.addListener(function() {
  // Query all open tabs and inject content script into each tab
  chrome.tabs.query({}, function(tabs) {
      tabs.forEach(tab => {
          // Check if the tab is not a Chrome internal page
          if (!tab.url.startsWith('chrome://')) {
              injectContentScript(tab.id);
          }
      });
  });
});

// Event listener for when a new tab is created
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // Check if the tab has finished loading and is not a Chrome internal page
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
      // Inject content script into the newly created tab
      injectContentScript(tabId);
  }
});

