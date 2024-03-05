console.log("open content.js")

document.addEventListener('DOMContentLoaded', function() {
    var createButton = document.getElementById('createButton');
    createButton.addEventListener('click', createTaskBox);

    // Allow drop on task boxes
    var taskContainers = document.querySelectorAll('.taskContainer');
    taskContainers.forEach(function(container) {
        container.addEventListener('dragover', allowDrop);
        container.addEventListener('drop', drop);
    });

    // Allow nodes to be dragged
    var nodes = document.querySelectorAll('.sidebar button');
    nodes.forEach(function(node) {
        node.addEventListener('dragstart', drag);
    });
});

function createTaskBox() {
    // Get the input value
    var taskContent = document.getElementById('input_task').value;

    // Create a new task box element
    var taskBox = document.createElement('div');
    taskBox.classList.add('taskBox');
    taskBox.textContent = taskContent;

    // Set up attributes for drop behavior
    taskBox.setAttribute('ondragover', 'allowDrop(event)');
    taskBox.setAttribute('ondrop', 'drop(event)');

    // Append the task box to the task container
    document.getElementById('taskContainer').appendChild(taskBox);

    // Clear the input field after creating the task box
    document.getElementById('input_task').value = '';
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData('text', event.target.textContent);
}

function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData('text');

    // Create a new button element with the dragged node's text
    var newNode = document.createElement('button');
    newNode.textContent = data;
    newNode.draggable = true;
    newNode.addEventListener('dragstart', drag); // Set up drag behavior for the new node

    // Find the closest task box to the drop target
    var taskBox = event.target.closest('.taskBox');

    // Append the new node to the task box if found
    if (taskBox) {
        taskBox.appendChild(newNode);
    }
}
