console.log("open content.js")

document.addEventListener('DOMContentLoaded', function() {
    var createButton = document.getElementById('createButton');
    createButton.addEventListener('click', createTaskBox);

    var nodes = document.querySelectorAll('#nodeSection button');
    nodes.forEach(function(node) {
        console.log("find node in sidebar")
        node.addEventListener('dragstart', dragStart);
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

function allowDrop(event) {
    event.preventDefault();
    console.log("drag over");
}

function dragStart(event) {
    console.log("drag a node")
    event.dataTransfer.setData('text/plain', event.target.textContent);
}





function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData('text/plain');

    // Create a new node element with the dragged text
    var newNode = createNode(data);

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

function createNode(text) {
    
    var newNode = document.createElement('button');
    newNode.classList.add('node');
    newNode.textContent = text;
    newNode.draggable = true;
    newNode.addEventListener('dragstart', dragStart); // Set up drag behavior for the new node
    return newNode;
}