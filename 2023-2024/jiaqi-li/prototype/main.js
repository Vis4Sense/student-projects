document.addEventListener('DOMContentLoaded', function() {
    var createButton = document.getElementById('createButton');
    createButton.addEventListener('click', createTaskBox);

    var leftSidebarCollection = document.getElementsByClassName('leftSidebar');

    for (var i = 0; i < leftSidebarCollection.length; i++) {
        var leftSidebar = leftSidebarCollection[i];
        leftSidebar.addEventListener('dragover', allowDrop);
        leftSidebar.addEventListener('drop', drop);
    }
});
/*
taskMap structure
{
    task01: {
        taskTheme: "task theme",
        node1:{
            pageId = pageId,
            tabId = tabId,
            time = time,
            pageObj = pageObj,
            parentPageId = parentPageId,
            docId = docId,
        }
    },
    task02: {
        taskTheme: "task theme",
        // Add other properties as needed
    },
*/

let taskMap = {};

function createTaskBox() {
    // Get the input value
    var taskContent = document.getElementById('input_task').value;

    if (taskContent.trim() === '') {
        // Set input field value to a message
        document.getElementById('input_task').placeholder = "The task theme can not be null";
        // Add CSS class to change placeholder color
        document.getElementById('input_task').classList.add('empty-task');
        return; 
    }else {
        document.getElementById('input_task').classList.remove('empty-task');
        document.getElementById('input_task').placeholder = "input your brief task theme, include as much keyword as possible";
    }

    // Create a new task box element
    var taskBox = document.createElement('div');
    taskBox.classList.add('taskBox');

    var nodeContainer = document.createElement('div');
    nodeContainer.classList.add('nodeContainer');
    //set unique id for each task box, use the length of taskMap as the id
    nodeContainer.id = "task"+(Object.keys(taskMap).length)+1;
    
    
    //update taskMap 
    taskMap[nodeContainer.id] = {
        taskTheme: taskContent,
        // Add other properties as needed
    };
    console.log(taskMap);

    var taskTheme = document.createElement('p');
    taskTheme.textContent = taskContent;

    nodeContainer.addEventListener('dragover', allowDrop);
    nodeContainer.addEventListener('drop', drop);


    // Create the archive button
    var archiveButton = document.createElement('button');
    //archiveButton.textContent = 'Archive';
    archiveButton.classList.add('archiveButton');
    archiveButton.addEventListener('click', function() {
        // archive functionality


        /*
        // Assume tabIds is an array containing the IDs of the tabs you want to move
        var tabIds = [1, 2, 3]; // Example tab IDs

        // Create a new window
        chrome.windows.create({ focused: true }, function(newWindow) {
            // Move each tab to the new window
            tabIds.forEach(function(tabId) {
                chrome.tabs.move(tabId, { windowId: newWindow.id, index: -1 });
            });
        });
        */



    });

    // Create the delete button
    var deleteButton = document.createElement('button');
    //deleteButton.textContent = 'Delete';
    deleteButton.classList.add('deleteButton');
    deleteButton.addEventListener('click', function() {
        taskBox.remove();
    });

    // Append the buttons and content to the task box
    taskBox.appendChild(taskTheme)
    taskBox.appendChild(archiveButton);
    taskBox.appendChild(deleteButton);
    taskBox.appendChild(nodeContainer);

    // Append the task box to the task container
    document.getElementById('taskContainer').appendChild(taskBox);

    // Clear the input field after creating the task box
    document.getElementById('input_task').value = '';
}

function allowDrop(event) {
    event.preventDefault();
    console.log("drag over");
}


function serializeHmPage(hmPageInstance) {
    return JSON.stringify(hmPageInstance);
}

function deserializeHmPage(jsonString) {
    const data = JSON.parse(jsonString);
    return new hmPage(data.pageId, data.tabId, data.time, data.pageObj, data.parentPageId, data.docId, data.isOpened);
}

function dragStart(event) {
    chrome.storage.local.get('nodeDetail', function(data) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            const nodeDetail = data.nodeDetail;
            //console.log(`Dragging ${nodeDetail}`);
        }
    });
    
    var nodeParent = event.target.parentNode.parentNode;
    sourceContainer = getFirstPartByNewline(nodeParent.innerText);

    chrome.storage.local.set({ 'sourceContainer': sourceContainer});

    function getFirstPartByNewline(str) {
        // Split the string by newline characters
        const parts = str.split('\n');
        // Return the first part
        return parts[0];
    }
}

function drop(event) {
    event.preventDefault();

    chrome.storage.local.get('nodeDetail', function(data) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            const nodeDetail = data.nodeDetail;
            //console.log(nodeDetail)
        }
    });
    
    data = deserializeHmPage(nodeDetail);

    // Find the closest node container to the drop target and get the id of that container
    var nodeContainer = event.target.closest('.nodeContainer');
    section = nodeContainer.id;

    // Create a new node element with the dragged text
    var newNode = createNode(data,section);
    
    var leftSidebar = document.querySelector('.leftSidebar');


    //***********not functioning when drag node back************/
    // Append the new node to the node container if found
    if (nodeContainer) {
        console.log(`drop node to node container: ${data}`);
        nodeContainer.appendChild(newNode);

        // Remove the node in the leftSidebar with the same text
        var leftSidebar = document.getElementsByClassName('leftSidebar')[0]; 
        var nodesInLeftSidebar = leftSidebar.querySelectorAll('button');

        for (var i = 0; i < nodesInLeftSidebar.length; i++) {
            if (nodesInLeftSidebar[i].textContent.trim() === data.pageObj.title) {
                nodesInLeftSidebar[i].parentNode.removeChild(nodesInLeftSidebar[i]);
                break; 
            }
        }

    }else{
        // drag node from task box to left sidebar
        console.log(`drop node to left sidebar: ${data}`)
        leftSidebar.appendChild(newNode);

        chrome.storage.local.get('sourceContainer', function(data) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
            } else {
                var sourceContainer = data.sourceContainer;
            }
        });

        var nodeContainer = document.querySelector('.nodeContainer');

        if (nodeContainer){
            var buttonsInContainer = nodeContainer.querySelectorAll('button');

            for (var i = 0; i < buttonsInContainer.length; i++) {
                var button = buttonsInContainer[i];
                // Check if button text content matches certain criteria
                if (button.textContent.trim() === data.pageObj.title) {
                    button.parentNode.removeChild(button);
                    break; 
                }
            }
        }

    }
}
/*
function createNode(node) {
    var newNode = document.createElement('button');
    newNode.classList.add('node');
    newNode.textContent = node.pageObj.title;
    newNode.draggable = true;
    newNode.addEventListener('dragstart', dragStart); // Set up drag behavior for the new node
    
    newNode.addEventListener('click', function() {
        // Check if browser extension APIs are available
        if (typeof chrome !== 'undefined' && chrome.tabs) {
            // Find the tab with the matching URL
            chrome.tabs.query({ url: node.pageObj.url }, function(tabs) {
                if (tabs && tabs.length > 0) {
                    // If the tab exists, navigate to it
                    chrome.tabs.update(tabs[0].id, { active: true });
                } else {
                    // If the tab doesn't exist, open a new tab with the URL
                    chrome.tabs.create({ url: node.pageObj.url });
                }
            });
        } else {
            // Handle the case where browser extension APIs are not available
            console.log("Browser extension APIs are not available.");
        }
    });

    newNode.addEventListener('contextmenu', function (event) {
        event.preventDefault(); 
        newNode.parentNode.removeChild(newNode);
        // Additional actions can be performed as needed
    });
    return newNode;
}
*/