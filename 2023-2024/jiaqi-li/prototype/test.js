document.addEventListener('DOMContentLoaded', function() {
    var createButton = document.getElementById('createButton');
    createButton.addEventListener('click', createTaskBox);

    var nodes = document.querySelectorAll('#nodeSection button');
    nodes.forEach(function(node, index) {
        node.addEventListener('dragstart', function(event) {
            const nodeTitle = node.innerHTML; // Assuming the title is stored as innerHTML of the node
            const hmPageInstance = hmPages.find(instance => instance.pageObj.title === nodeTitle);
            if (hmPageInstance) {
                dragStart(event, hmPageInstance);
            } else {
                console.log("hmPageInstance not found for node:", nodeTitle);
            }
        });
    });
});
function createTaskBox() {
    // Get the input value
    var taskContent = document.getElementById('input_task').value;

    // Create a new task box element
    var taskBox = document.createElement('div');
    taskBox.classList.add('taskBox');

    var nodeContainer = document.createElement('div');
    nodeContainer.classList.add('nodeContainer');
    
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

function serializeHmPage(hmPageInstance) {
    return JSON.stringify(hmPageInstance);
}

function deserializeHmPage(jsonString) {
    const data = JSON.parse(jsonString);
    return new hmPage(data.pageId, data.tabId, data.time, data.pageObj, data.parentPageId, data.docId, data.isOpened);
}

function allowDrop(event) {
    event.preventDefault();
    console.log("drag over");
}

function dragStart(event,hmPageInstance) {
    console.log("Dragging a node");
    const serializedData = serializeHmPage(hmPageInstance);
    event.dataTransfer.setData('application/json', serializedData);
}



function drop(event) {
    event.preventDefault();
    //var data = event.dataTransfer.getData('text/plain');
    const jsonString = event.dataTransfer.getData('application/json');
    const page = deserializeHmPage(jsonString);

    // Create a new node element with the dragged text
    var newNode = createNode(page);

    // Find the closest node container to the drop target
    var nodeContainer = event.target.closest('.nodeContainer');

    // Append the new node to the node container if found
    if (nodeContainer) {
        nodeContainer.appendChild(newNode);

        // Remove the node in the leftSidebar with the same text
        var leftSidebar = document.getElementsByClassName('leftSidebar')[0]; 
        var nodesInLeftSidebar = leftSidebar.querySelectorAll('button');

        for (var i = 0; i < nodesInLeftSidebar.length; i++) {
            if (nodesInLeftSidebar[i].textContent.trim() === data.trim()) {
                nodesInLeftSidebar[i].parentNode.removeChild(nodesInLeftSidebar[i]);
                break; 
            }
        }

    }
    console.log("drop node in box");
}

function createNode(page) {
    
    //var newNode = document.createElement('button');
    //newNode.classList.add('node');
    //newNode.textContent = text;
    //newNode.draggable = true;
    //newNode.addEventListener('dragstart', dragStart); // Set up drag behavior for the new node
    //return newNode;

    var newNode = document.createElement("button");
    newNode.classList.add('node');
    newNode.setAttribute('draggable', 'true')
    newNode.textContent = page.pageObj.title;
    nodeSection.appendChild(newNode);

    newNode.addEventListener('click', function() {
        window.open(newPage.pageObj.url, '_blank');
     });
       newNode.addEventListener('dragstart', dragStart
    );

    return newNode;
}