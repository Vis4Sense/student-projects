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
    floatingNode:{
        node1{},
        node2{},
        ...
    }
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
    ...
}
*/

let taskMap = {};
let userLog = {};

function allowDrop(event) {
    event.preventDefault();
    //console.log("drag over");
}


function deserializeHmPage(jsonString) {
    const data = JSON.parse(jsonString);
    return new hmPage(data.pageId, data.tabId, data.time, data.pageObj, data.parentPageId, data.docId, data.isOpened,data.content,data.embedding);
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
            nodeId="node"+(Object.keys(taskMap[section]).length-1);

            //Add node in corresponding task dict in taskMap
            updateTaskMap(section,pageData,nodeId,"add");

            //go through the floatingNode to find the nodeId of the dragged node
            for (var nodeId in taskMap["floatingNode"]) {
                // Check if nodeId starts with 'node'
                if (nodeId.startsWith('node')) {
                    if (taskMap["floatingNode"][nodeId].pageData.pageObj.title === pageData.pageObj.title) {
                        delete taskMap["floatingNode"][nodeId];
                        console.log(taskMap);
                    }
                }
            }
        }
        // Remove the node in the leftSidebar with the same text
        var leftSidebar = document.getElementsByClassName('leftSidebar')[0]; 
        var nodesInLeftSidebar = leftSidebar.querySelectorAll('button');

        for (var i = 0; i < nodesInLeftSidebar.length; i++) {
            if (nodesInLeftSidebar[i].firstChild.nodeValue.trim() === pageData.pageObj.title) {
                nodesInLeftSidebar[i].parentNode.removeChild(nodesInLeftSidebar[i]);
                break; 
            }
        }

    }else{
        // drag node from task box to left sidebar
        console.log(`drop node to left sidebar`)
        section = "nodeSection";
        
        chrome.storage.local.get('parentElementID', function(data) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
            } else {
                // remove the node from nodeContainer
                const parentElementID = data.parentElementID;
                var nodeContainer = document.querySelector('#' + parentElementID);
                if (nodeContainer && nodeContainer.id !== 'nodeSection') {
                    var nodesInContainer = nodeContainer.querySelectorAll('button');
                    for (var i = 0; i < nodesInContainer.length; i++) {
                        if (nodesInContainer[i].firstChild.nodeValue.trim() === pageData.pageObj.title) {
                            nodesInContainer[i].parentNode.removeChild(nodesInContainer[i]);

                            //remove the node in taskMap
                            updateTaskMap(parentElementID, pageData,"",'delete');

                            //get the node index according to the lengh of floatingNode
                            nodeId="node"+(Object.keys(taskMap["floatingNode"]).length+1);
                            //add node in floatingNode
                            updateTaskMap("floatingNode",pageData,nodeId,'addLeft');
                        }
                    }
                }
            }
        });

        // Check if the node already exists in the left sidebar
        var buttonsInNodeSection = document.querySelectorAll('.leftSidebar button');
        for (var i = 0; i < buttonsInNodeSection.length; i++) {
            var button = buttonsInNodeSection[i];
            if (button.firstChild.nodeValue.trim() === pageData.pageObj.title) {
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
            taskMap[taskId][nodeId] = {pageData};
            //console.log(taskMap);
            break;

        case "create":
            taskMap[taskId] = {
                taskTheme: pageData,
            };
            break;

        case "delete box":
            delete taskMap[taskId];
            //console.log(taskMap);
            break;

        case "createLeft":
            taskMap[taskId] = {
                
            };
            break;
        
        case "addLeft":
            taskMap[taskId][nodeId] = {pageData};
            //console.log(taskMap);
            break;
        };
} 