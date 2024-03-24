class hmPage {
    constructor(pageId, tabId, time, pageObj, parentPageId, docId=null, isOpened=true) {
       this.pageId = pageId;
       this.docId = docId; // a UUID of the document loaded, get from webNavigation API, needed for locating the page to update pageObj after navigation completed
       this.tabId = tabId;
       this.time = time;
       this.pageObj = pageObj;
       this.parentPageId = parentPageId;
       this.isOpened = isOpened;
       // this.clicked = false;
       this.forwardBack = {
          forward: 0, // the number of times the parent page goes forward to this page
          back: 0 // the number of times this page goes back to the parent page
       };
    }
 }
 
 const ignoredUrls = [
    'chrome-extension://',
    'edge://extensions/'
 ];
 
 let hmPages = []


 //read openning tags' info, and add in list
 function addPage(tabURL, docId, tabID, pageObj, parentPageId, isOpened=true) {
    if (!ignoredUrls.some(url => tabURL.includes(url))) {
      let newPageId = window.crypto.randomUUID();
      let newPage = new hmPage(
          newPageId,
          tabID,
          new Date(),
          pageObj,
          parentPageId,
          docId,
          isOpened
       );
      hmPages.push(newPage);
      console.log("A new hmPage added:", newPage.pageObj.title, ', ', newPage.pageObj.url);
       
      //add node in interface

      var nodeSection = document.getElementById('nodeSection');
      var newNode = document.createElement("button");
      newNode.setAttribute('draggable', 'true')
      newNode.textContent = newPage.pageObj.title;
      nodeSection.appendChild(newNode);

      newNode.addEventListener('click', function() {
         // Check if browser extension APIs are available
         if (typeof chrome !== 'undefined' && chrome.tabs) {
             // Find the tab with the matching URL
             chrome.tabs.query({ url: newPage.pageObj.url }, function(tabs) {
                 if (tabs && tabs.length > 0) {
                     // If the tab exists, navigate to it
                     chrome.tabs.update(tabs[0].id, { active: true });
                 } else {
                     // If the tab doesn't exist, open a new tab with the URL
                     chrome.tabs.create({ url: newPage.pageObj.url });
                 }
             });
         } else {
             // Handle the case where browser extension APIs are not available
             console.log("Browser extension APIs are not available.");
         }
     });
      //newNode.addEventListener('dragstart', dragStart);
      newNode.addEventListener('dragstart', function(event) {
         // Additional actions before calling dragStart
         nodeDetail = serializeHmPage(newPage);
         chrome.storage.local.set({ 'nodeDetail': nodeDetail }, function() {
             if (chrome.runtime.lastError) {
                 console.error(chrome.runtime.lastError);
             } else {
                 console.log('Node detail stored successfully.');
                 
                 // Call the dragStart function
                 dragStart(event);
             }
         });
     });
    }
 }

 function initializeHmPages() {
    // add all the tabs opened before running historymap to hmPages
    chrome.tabs.query({}, function (openedTabs) {
       console.log("Tabs opened before historymap: ", openedTabs);
       hmPages = []
       for (let i = 0; i < openedTabs.length; i++) {
          addPage(openedTabs[i].url, null, openedTabs[i].id, openedTabs[i], null);
       }
    });
 }


 window.addEventListener("DOMContentLoaded", function () {
    // Initialize hmPages
    initializeHmPages();
});
 