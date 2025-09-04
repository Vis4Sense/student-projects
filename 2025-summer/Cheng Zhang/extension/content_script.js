// Prevent multiple injection of the sidebar iframe
if (!document.getElementById("llm-sidebar-iframe")) {
  const iframe = document.createElement("iframe");
  iframe.id = "llm-sidebar-iframe";
  iframe.src = chrome.runtime.getURL("sidebar.html");
  iframe.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 550px;
    height: 100%;
    border: none;
    z-index: 999999;
    background: white;
    box-shadow: 2px 0 6px rgba(0,0,0,0.2);
  `;
  document.documentElement.appendChild(iframe);
}
