// this file is used to annotate the tab with a note

console.log("✅ annotate.js loaded!");
if (!chrome.runtime || !chrome.runtime.sendMessage) {
  alert("❌ This extension is not running in a Chrome environment. Please open it in a Chrome browser.");
}


let tabId = null;

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  tabId = decodeURIComponent(params.get("tabId"));
  console.log("annotate received id: ", tabId);
  const title = decodeURIComponent(params.get("title"));
  const note = decodeURIComponent(params.get("note"));
  const taskId = decodeURIComponent(params.get("taskId"));

  document.getElementById("tab-title").innerText = title;
  document.getElementById("note-input").value = note || "";

  document.getElementById("save-btn").addEventListener("click", () => {
    const updatedNote = document.getElementById("note-input").value;
    chrome.runtime.sendMessage({
      action: "save_tab_note",
      tabId,
      note: updatedNote,
      taskId
    }, (response) => {
      console.log("save_tab_note response received:", response);
      setTimeout(() => window.close(), 200);  // wait for 200ms before closing the window, otherwise the message may not be sent successfully
    });
  });
});
