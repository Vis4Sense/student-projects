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
