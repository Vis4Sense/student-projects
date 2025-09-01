// When the extension icon is clicked, inject the sidebar content script
chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) return;

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content_script.js"]
  });
});
