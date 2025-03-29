console.log("✅ annotate.js loaded!");
if (!chrome.runtime || !chrome.runtime.sendMessage) {
  alert("❌ 当前页面未以扩展方式打开，消息无法发送！");
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
      setTimeout(() => window.close(), 200);  // 稍等 200ms 再关闭
    });
  });
});
