let tabId = null;

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  tabId = decodeURIComponent(params.get("tabId"));
//   console.log("annotate received id: ", tabId);
  const title = decodeURIComponent(params.get("title"));
  const note = decodeURIComponent(params.get("note"));

  document.getElementById("tab-title").innerText = title;
  document.getElementById("note-input").value = note || "";

  document.getElementById("save-btn").addEventListener("click", () => {
    const updatedNote = document.getElementById("note-input").value;
    chrome.runtime.sendMessage({
      action: "save_tab_note",
      tabId,
      note: updatedNote
    });
    window.close(); // 关闭注释页面
  });
});
