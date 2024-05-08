const MAIN_WINDOW_FILENAME = "popup.html";
const WINDOW_WIDTH = 1000;
const WINDOW_HEIGHT = 900;

chrome.action.onClicked.addListener(activateMainWindow);

function activateMainWindow() {
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
            // Create the main_window with specified dimensions
            chrome.windows.create({
                url: chrome.runtime.getURL(MAIN_WINDOW_FILENAME),
                type: "popup",
                width: WINDOW_WIDTH,
                height: WINDOW_HEIGHT,
            });
        }
    });
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "setApiDetails",
      title: "Set API Details",
      contexts: ["all"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    const left = 1010; 
    const top = 100; 
    if (info.menuItemId === "setApiDetails") {
      chrome.windows.create({
        url: "dropdown.html",
        type: "popup",
        width: 350,
        height: 250,
        left:left,
        top:top
      });
    }
  });

  chrome.storage.local.get(['endpoint', 'apiKey'], function(result) {
    if (result.endpoint && result.apiKey) {
        console.log("API Endpoint and Key are set: ", result);
        // You can initialize your API or other functions here
    } else {
        console.log("API details are not set.");
    }
});

// Listen for changes in storage
chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) {
        var storageChange = changes[key];
        console.log('Storage key "%s" in namespace "%s" changed. ' +
                    'Old value was "%s", new value is "%s".',
                    key, namespace, storageChange.oldValue, storageChange.newValue);
    }
});