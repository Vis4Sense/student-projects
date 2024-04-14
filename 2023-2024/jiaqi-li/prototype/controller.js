class hmPage {
    constructor(pageId, tabId, time, pageObj, parentPageId, docId=null, isOpened=true, pageContent) {
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
       this.content = pageContent;
    }
 }
 
 const ignoredUrls = [
    'chrome-extension://',
    'edge://extensions/',
    'chrome://extensions/',
    'chrome://newtab/',
    'https://chromewebstore.google.com/',
 ];
 

 let hmPages = [];
 //read openning tags' info, and add in list
 function addPage(tabURL, docId, tabID, pageObj, parentPageId, isOpened=true,pageContent) {
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
       );
      hmPages.push(newPage);
      console.log("A new hmPage added:", newPage.pageObj.title, ', ', newPage.pageObj.url);
    }
 }


function initializeHmPages() {
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

    // Listen for the message from content script and add extracted page content
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.action === 'extractedPageContent') {
            let pageContent = message.pageContent;
            // Add page with extracted content
            console.log("received message from backend.js "+sender.tab.url);
            addPage(sender.tab.url, null, sender.tab.id, sender.tab, null, true, pageContent);
        }
    });
}

function serializeHmPage(hmPageInstance) {
    return JSON.stringify(hmPageInstance);
}



function createNode(page,section) {
    var nodeSection = document.getElementById(section);

    // check if the page is already in the nodeSection
    var buttonsInNodeSection = document.querySelectorAll('#'+section+' button');
    for (var i = 0; i < buttonsInNodeSection.length; i++) {
        var button = buttonsInNodeSection[i];
        var text = button.firstChild.nodeValue.trim();
        if (text === page.pageObj.title) {
            console.log("node already exists in the left sidebar"+page.pageObj.title);
            return; // Skip creating the node if the title already exists
        }
    }
    // Create a new node element
    var newNode = document.createElement("button");
    newNode.setAttribute('draggable', 'true');
    newNode.classList.add('node');
    newNode.textContent = page.pageObj.title;

    // Create the summary element for this button
    const summary = document.createElement('div');
    summary.className = 'summary';
    summary.textContent = page.content;
    newNode.appendChild(summary); // Append the summary to the button element

    newNode.addEventListener('click', function() {
        // Check if browser extension APIs are available
        if (typeof chrome !== 'undefined' && chrome.tabs) {
            // Find the tab with the matching URL
            chrome.tabs.query({ url: page.pageObj.url }, function(tabs) {
                if (tabs && tabs.length > 0) {
                    // If the tab exists, navigate to it
                    chrome.tabs.update(tabs[0].id, { active: true });
                } else {
                    // If the tab doesn't exist, open a new tab with the URL
                    chrome.tabs.create({ url: page.pageObj.url });
                }
            });
        } else {
            // Handle the case where browser extension APIs are not available
            console.log("Browser extension APIs are not available.");
        }
    });
        
    newNode.addEventListener('dragstart', function(event) {
        // Additional actions before calling dragStart
        nodeDetail = serializeHmPage(page);
        chrome.storage.local.set({ 'nodeDetail': nodeDetail }, function() {
            if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            } else {
                console.log('Node detail stored successfully.');
                    
                    // Call the dragStart function
                dragStart(event);
            }
        });
        // Check if the parent element of newNode has an id
        if (newNode.parentNode.id) {
            // Store the parent element id in chrome storage
            chrome.storage.local.set({ 'parentElementID': newNode.parentNode.id }, function() {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
            } else {
                //console.log('Parent element id stored successfully.'+ newNode.parentNode.id);
            }
            });
        }
    });
    
    // Add a context menu to delete the node
    newNode.addEventListener('contextmenu', function (event) {
        event.preventDefault(); 
        newNode.parentNode.removeChild(newNode);
        //update taskMap
        updateTaskMap(section,page,"",'delete');
    });

    nodeSection.appendChild(newNode);

    return true;
}


 window.addEventListener("DOMContentLoaded", function () {
    // Initialize hmPages
    initializeHmPages();
    
    // set timeout and Create nodes in the left sidebar
    setTimeout(function() {
        section = "nodeSection";
        hmPages.forEach(function(page) {
            createNode(page,section);
        });
    }, 1000);
    
    // create new nodes when new tabs be opened
    let isNewTab = false;

    chrome.tabs.onCreated.addListener(function(tab) {
        isNewTab = true;
    });
    

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, updatedTab) {
        // Check if the update is for the newly created tab and it's fully loaded
        if (!ignoredUrls.some(url => updatedTab.url.includes(url))){
            if (isNewTab && tabId === updatedTab.id && changeInfo.status === 'complete') {
                // Reset the flag
                isNewTab = false;
                // Add the tab once its properties are fully updated
                section = "nodeSection"
                chrome.scripting.executeScript({
                    target: { tabId: updatedTab.id },
                    files: ['backend.js'] 
                });
                newPage = hmPages[hmPages.length-1];
                createNode(newPage,section);

                console.log("A new tab added:", updatedTab.title, ', ', updatedTab.url);
            }else {
                section = "nodeSection"
                
                chrome.scripting.executeScript({
                    target: { tabId: updatedTab.id },
                    files: ['backend.js'] 
                });

                newPage = hmPages[hmPages.length-1];
                createNode(newPage,section);
                console.log("A new tab updated:");
            };
        };
    });
    //console.log(hmPages);
});
 