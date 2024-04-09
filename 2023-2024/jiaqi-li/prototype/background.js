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
