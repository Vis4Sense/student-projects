// STORYBOARD FUNCTIONALITY

// Drag and drop scene divs using SortableJS https://github.com/SortableJS/Sortable
document.addEventListener('DOMContentLoaded', function () {
    var el = document.getElementById('storyboard');
    Sortable.create(el, {
        animation: 150, // ms, animation speed moving items when sorting, `0` — without animation
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder
        dragClass: "sortable-drag", // Class name for the dragging item
        // TODO Add more functionality like the multi drag!
    });

    // Delete scene divs by checking for clicks on the storyboard div (using event delegation)
    document.getElementById('storyboard').addEventListener('click', function(e) {
        // Check if the clicked element is a delete button
        if (e.target.classList.contains('delete-scene-btn')) {
            // Find the parent scene div and remove it
            var sceneCard = e.target.closest('.scene-div');
            if (sceneCard) {
                sceneCard.remove();
            }
        }
    });
});

// Create the scene div
function createSceneDiv() {
    const sceneDiv = document.createElement("div");
    sceneDiv.classList.add("scene-div");

    // Create scene title
    const sceneTitle = document.createElement("div");
    sceneTitle.classList.add("scene-title", "draggable");
    const sceneTitlePara = document.createElement("p");
    sceneTitlePara.classList.add("editable");
    sceneTitlePara.setAttribute("contenteditable", "false");
    sceneTitlePara.textContent = "Title"; // Placeholder title
    sceneTitle.appendChild(sceneTitlePara);

    // Create scene image
    const sceneImg = document.createElement("div");
    sceneImg.classList.add("draggable");
    const img = document.createElement("img");
    img.src = "./static/img/big_park.jpg"; // Placeholder image of a park
    sceneImg.appendChild(img);

    // Create scene description text
    const sceneText = document.createElement("div");
    sceneText.classList.add("draggable", "scene-text");
    const sceneTextP = document.createElement("p");
    sceneTextP.classList.add("editable");
    sceneTextP.setAttribute("contenteditable", "false");
    sceneTextP.textContent = "The main character does XYZ action..."; // Placeholder scene description
    sceneText.appendChild(sceneTextP);

    // Create the delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-scene-btn");
    deleteBtn.textContent = "Delete Scene";

    // Append the sceneTitle, sceneImg, sceneText, and deleteBtn elements to the sceneDiv
    sceneDiv.appendChild(sceneTitle);
    sceneDiv.appendChild(sceneImg);
    sceneDiv.appendChild(sceneText);
    sceneDiv.appendChild(deleteBtn);

    return sceneDiv;
}

// Add scene when user clicks on add scene btn
document.getElementById('add-scene-btn').addEventListener('click', function() {
    const newSceneDiv = createSceneDiv();
    document.getElementById('storyboard').appendChild(newSceneDiv);
});


// TODO Upload images


// Edit scene title and scene description text
document.addEventListener('click', function(e) {
    // Check if the element can be edited
    if (e.target.classList.contains('editable')) {
        // Make the element editable
        e.target.setAttribute('contenteditable', 'true');
        e.target.setAttribute('id', 'edit-text');
        e.target.focus();
    }
});

document.addEventListener('keydown', function(e) {
    // Save changes when user presses the Enter key
    if (e.key === 'Enter') {
        e.preventDefault();
        if (document.activeElement.classList.contains('editable')) {
            document.activeElement.setAttribute('contenteditable', 'false');
            document.activeElement.blur();
        }
    }
});

document.addEventListener('blur', function(e) {
    // Save changes when user clicks outside
    if (e.target.classList.contains('editable')) {
        // Disable editing
        e.target.setAttribute('contenteditable', 'false');
        e.target.removeAttribute('id');
    }
}, true);

