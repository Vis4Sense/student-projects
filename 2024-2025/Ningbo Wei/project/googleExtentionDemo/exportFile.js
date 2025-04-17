// this script is injected into the current page
// aims to export the content of the a task to a json file

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("expoting.js is downloading the file..");
    if (message.action === "startDownload") {
        const data = {
            message: "hello"
        };
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "out.json";
        a.click();
        URL.revokeObjectURL(url);

        sendResponse({ status: "downloaded" });
        return true;
    }
});
