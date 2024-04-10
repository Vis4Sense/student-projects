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
            isOpened = isOpened,
            pageContent = pageContent
        },
        node2:{
            pageId = pageId,
            ...
        },
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
    nodeContainer.id = "task"+(Object.keys(taskMap).length+1);
    
    
    //update taskMap 
    updateTaskMap(nodeContainer.id,taskContent,"","create");

    var taskTheme = document.createElement('p');
    taskTheme.textContent = taskContent;

    nodeContainer.addEventListener('dragover', allowDrop);
    nodeContainer.addEventListener('drop', drop);


    // Create the pull-put button
    // when click the button, all pages in the task box will be pulled out to a new window
    var pullOutButton = document.createElement('button');
    //pullOutButton.textContent = 'Pull Out';
    pullOutButton.classList.add('pullOutButton');
    pullOutButton.addEventListener('click', function() {
        // pull out functionality

        taksId = nodeContainer.id;
        // go through the taskMap to get the node URL
        var tabIds = [];
        for (var nodeId in taskMap[taksId]) {
            // Check if nodeId starts with 'node'
            if (nodeId.startsWith('node')) {
                // Your code for processing nodes here
                tabIds.push(taskMap[taksId][nodeId].pageData.tabId
                    );
            }
        }

        console.log(tabIds);
        chrome.windows.create({ focused: false, state: 'minimized'}, function(newWindow) {

            tabIds.forEach(function(tabId) {
                chrome.tabs.move(tabId, { windowId: newWindow.id, index: -1 });
            });
            // Once all tabs are moved, maximize the window
            chrome.windows.update(newWindow.id, { focused: true, state: 'maximized' });
        });

    });

    // Create the delete button
    var deleteButton = document.createElement('button');
    //deleteButton.textContent = 'Delete';
    deleteButton.classList.add('deleteButton');
    deleteButton.addEventListener('click', function() {
        taskBox.remove();
        //update taskMap
        updateTaskMap(nodeContainer.id,"","",'delete box');
    });

    // Append the buttons and content to the task box
    taskBox.appendChild(taskTheme)
    taskBox.appendChild(pullOutButton);
    taskBox.appendChild(deleteButton);
    taskBox.appendChild(nodeContainer);

    // Append the task box to the task container
    document.getElementById('taskContainer').appendChild(taskBox);

    // Clear the input field after creating the task box
    document.getElementById('input_task').value = '';
}

function allowDrop(event) {
    event.preventDefault();
    //console.log("drag over");
}


function deserializeHmPage(jsonString) {
    const data = JSON.parse(jsonString);
    return new hmPage(data.pageId, data.tabId, data.time, data.pageObj, data.parentPageId, data.docId, data.isOpened,data.content);
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
        }
    });
    pageData = deserializeHmPage(nodeDetail);
    console.log(pageData);
    // Find the closest node container to the drop target and get the id of that container
    var nodeContainer = event.target.closest('.nodeContainer');
    var leftSidebar = document.querySelector('.leftSidebar');


    // Append the new node to the node container if found,or left sidebar
    if (nodeContainer) {
        section = nodeContainer.id;
        // Create a new node element with the dragged node info
        isCreated=createNode(pageData,section);

        //update taskMap only when the node is created
        if(isCreated){
        //update taskMap,the node index shoule update to the latest index
            nodeId="node"+Object.keys(taskMap[section]).length;

            //update taskMap
            updateTaskMap(section,pageData,nodeId,"add");
        }
        // Remove the node in the leftSidebar with the same text
        var leftSidebar = document.getElementsByClassName('leftSidebar')[0]; 
        var nodesInLeftSidebar = leftSidebar.querySelectorAll('button');

        for (var i = 0; i < nodesInLeftSidebar.length; i++) {
            if (nodesInLeftSidebar[i].textContent.trim() === pageData.pageObj.title) {
                nodesInLeftSidebar[i].parentNode.removeChild(nodesInLeftSidebar[i]);
                break; 
            }
        }

    }else{
        // drag node from task box to left sidebar
        console.log(`drop node to left sidebar: ${pageData}`)
        section = "nodeSection";
        
        chrome.storage.local.get('parentElementID', function(data) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
            } else {
                // remove the node from nodeContainer

                const parentElementID = data.parentElementID;
                var nodeContainer = document.querySelector('#' + parentElementID);
                
                if (nodeContainer) {
                    var nodesInContainer = nodeContainer.querySelectorAll('button');
                    for (var i = 0; i < nodesInContainer.length; i++) {
                        if (nodesInContainer[i].textContent.trim() === pageData.pageObj.title) {
                            nodesInContainer[i].parentNode.removeChild(nodesInContainer[i]);

                            //update taskMap
                            updateTaskMap(parentElementID, pageData,"",'delete');
                        }
                    }
                }
            }
        });

        // Check if the node already exists in the left sidebar
        var buttonsInNodeSection = document.querySelectorAll('.leftSidebar button');
        for (var i = 0; i < buttonsInNodeSection.length; i++) {
            var button = buttonsInNodeSection[i];
            if (button.textContent.trim() === pageData.pageObj.title) {
                console.log("node already exists in the left sidebar"+pageData.pageObj.title);
                return; // Skip creating the node if the title already exists
            }
        }

        createNode(pageData,section);

    }
}

//update taskMap in different situation
function updateTaskMap(taskId,pageData,nodeId,type) {
    //update taskMap
    switch(type){
    //get the node index according to the pageData
        case "delete":

            for (var NodeId in taskMap[taskId]) {
                // Check if NodeId starts with 'node'
                if (NodeId.startsWith('node')) {
                    // Your code for processing nodes here
                    if (taskMap[taskId][NodeId].pageData.pageObj.title === pageData.pageObj.title) {
                        delete taskMap[taskId][NodeId];
                        console.log(taskMap);
                    }
                }
            }
            break;

        case "add":
            //update taskMap
            taskMap[taskId][nodeId] = {pageData};
            console.log(taskMap);
            break;
        case "create":
            taskMap[taskId] = {
                taskTheme: pageData,
            };
            console.log(taskMap);
            break;
        

        case "delete box":
            delete taskMap[taskId];
            console.log(taskMap);
            break;

        };
} 