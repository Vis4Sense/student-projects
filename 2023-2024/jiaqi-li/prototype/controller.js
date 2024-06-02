class hmPage {
    constructor(pageId, tabId, time, pageObj, parentPageId, docId=null, isOpened=true, pageContent,embedding) {
       this.pageId = pageId;
       this.docId = docId; // a UUID of the document loaded, get from webNavigation API, needed for locating the page to update pageObj after navigation completed
       this.tabId = tabId;
       this.time = time;
       this.pageObj = pageObj;
       this.parentPageId = parentPageId;
       this.isOpened = isOpened;
       // this.clicked = false;
       this.forwardBack = {
          forward: 0, 
          back: 0 
       };
       this.content = pageContent;
       this.embedding = embedding;
    }
 }
 
 const ignoredUrls = [
    'chrome-extension://',
    'edge://extensions/',
    'chrome://extensions/',
    'chrome://newtab/',
    'https://chromewebstore.google.com/',
    'chrome://history/',
    'google.com/search',
 ];
 

 let hmPages = [];
 //read openning tags' info, and add in list
 function addPage(tabURL, docId, tabID, pageObj, parentPageId, isOpened=true,pageContent,embedding) {
    if (!ignoredUrls.some(url => tabURL.includes(url))) {
      let newPageId = window.crypto.randomUUID();
      let newPage = new hmPage(
          newPageId,
          tabID,
          new Date(),
          pageObj,
          parentPageId,
          docId,
          isOpened,
          pageContent,
          embedding
       );
      hmPages.push(newPage);
      console.log("A new hmPage added:", newPage.pageObj.title, ', ', newPage.pageObj.url);
    }
 }


function initializeHmPages() {
    // Initialize taskMap
    updateTaskMap("floatingNode","","","createLeft");

    // Add all the tabs opened before running historymap to hmPages
    chrome.tabs.query({}, function (openedTabs) {
        for (let i = 0; i < openedTabs.length; i++) {
            // Ignore urls that start with chrome
            if (!ignoredUrls.some(url => openedTabs[i].url.includes(url))) {
                chrome.scripting.executeScript({
                    target: { tabId: openedTabs[i].id },
                    files: ['backend.js'] 
                });
            }
        }
    });
}


function serializeHmPage(hmPageInstance) {
    return JSON.stringify(hmPageInstance);
}


// Listen for the message from content script and update hmpages and interface
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'extractedPageContent') {
        let pageContent = message.pageContent;
        let embedding = message.embedding;
        // Add page with extracted content
        //console.log("received message from backend.js  "+sender.tab.url);
        addPage(sender.tab.url, null, sender.tab.id, sender.tab, null, true, pageContent,embedding);
        section = "nodeSection";
        newPage = hmPages[hmPages.length-1];
        let isCreated = createNode(newPage,section);
        //console.log(isCreated);
        //only update task map when node created successfully
        if(isCreated){
            nodeId="node"+(Object.keys(taskMap["floatingNode"]).length+1);
            updateTaskMap("floatingNode",newPage,nodeId,"addLeft");
            //console.log(taskMap);
        }
        
    }
});


 window.addEventListener("DOMContentLoaded", function () {
    // Initialize hmPages
    initializeHmPages();

    // create new nodes when new tabs be opened
    let isNewTab = false;

    chrome.tabs.onCreated.addListener(function(tab) {
        isNewTab = true;
    });
    


    let delays = {};

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, updatedTab) {
        if (!ignoredUrls.some(url => updatedTab.url.includes(url))) {
            if (tabId === updatedTab.id && changeInfo.status === 'complete') {
                // Cancel any existing timeout for this tab to handle rapid consecutive updates
                if (delays[tabId]) {
                    clearTimeout(delays[tabId]);
                }
    
                // Set a new timeout
                delays[tabId] = setTimeout(() => {
                    // Execute the script
                    chrome.scripting.executeScript({
                        target: {tabId: tabId},
                        files: ['backend.js']
                    });
                    //console.log("Script re-injected into tab:", updatedTab.url);
    
                    delete delays[tabId];
                }, 2000); 
            }
        }
    });
    

    //console.log(hmPages);
});
 