// STORYBOARD FUNCTIONALITY

document.addEventListener('DOMContentLoaded', function () {
    var el = document.getElementById('storyboard');
    displayStoryboardData(); // Load storyboard from local storage

    // Drag and drop scene divs using SortableJS https://github.com/SortableJS/Sortable
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
                saveStoryboardData();  // Update localStorage after deleting a scene
            }
        }
    });

    // Make it possible to upload an image for existing scene cards
    document.querySelectorAll('.upload-img-btn').forEach(button => {
        button.addEventListener('click', function() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.onchange = e => {
                const file = e.target.files[0];
                const fileReader = new FileReader();
                fileReader.onload = function(e) {
                    const img = button.previousElementSibling;
                    img.src = e.target.result;
                };
                fileReader.readAsDataURL(file);
            };
            fileInput.click();
        });
    });
});

// Create the scene div
// Pass in scene data object as a function parameter
function createSceneDiv(data = { title: 'Title', imgSource: './static/img/big_park.jpg', description: 'The main character does XYZ action...' }) {
    const sceneDiv = document.createElement("div");
    sceneDiv.classList.add("scene-div");

    // Create scene title
    const sceneTitle = document.createElement("div");
    sceneTitle.classList.add("scene-title", "draggable");
    const sceneTitlePara = document.createElement("p");
    sceneTitlePara.classList.add("editable");
    sceneTitlePara.setAttribute("contenteditable", "false");
    sceneTitlePara.textContent = data.title; // Placeholder title from the data object
    sceneTitle.appendChild(sceneTitlePara);

    // Create scene image div
    const sceneImgDiv = document.createElement("div");
    sceneImgDiv.classList.add("scene-img", "draggable");
    const img = document.createElement("img");
    img.src = data.imgSource; // Placeholder image of a park from the data object
    sceneImgDiv.appendChild(img);

    // Create upload image button
    const uploadImgBtn = document.createElement("button");
    uploadImgBtn.textContent = "Upload Image";
    uploadImgBtn.classList.add("upload-img-btn");
    sceneImgDiv.appendChild(uploadImgBtn);

    // Make it possible to upload an image
    uploadImgBtn.addEventListener('click', function() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = e => {
            const file = e.target.files[0];
            const fileReader = new FileReader();
            fileReader.onload = function(e) {
                img.src = e.target.result;
                saveStoryboardData();  // Save changes to storyboard after uploading image
            };
            fileReader.readAsDataURL(file);
        };
        fileInput.click();
    });

    // Create scene description text
    const sceneText = document.createElement("div");
    sceneText.classList.add("draggable", "scene-text");
    const sceneTextP = document.createElement("p");
    sceneTextP.classList.add("editable");
    sceneTextP.setAttribute("contenteditable", "false");
    sceneTextP.textContent = data.description // Placeholder scene description from data object
    sceneText.appendChild(sceneTextP);

    // Create the delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-scene-btn");
    deleteBtn.textContent = "Delete Scene";

    // Append the sceneTitle, sceneImgDiv, sceneText, and deleteBtn elements to the sceneDiv
    sceneDiv.appendChild(sceneTitle);
    sceneDiv.appendChild(sceneImgDiv);
    sceneDiv.appendChild(sceneText);
    sceneDiv.appendChild(deleteBtn);

    return sceneDiv;
}

// Add scene when user clicks on add scene btn
document.getElementById('add-scene-btn').addEventListener('click', function() {
    const newSceneDiv = createSceneDiv();
    document.getElementById('storyboard').appendChild(newSceneDiv);
    saveStoryboardData();  // Save changes to storyboard
});

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
            saveStoryboardData();  // Save changes to storyboard
        }
    }
});

document.addEventListener('blur', function(e) {
    // Save changes when user clicks outside
    if (e.target.classList.contains('editable')) {
        // Disable editing
        e.target.setAttribute('contenteditable', 'false');
        e.target.removeAttribute('id');
        saveStoryboardData();  // Save changes to storyboard
    }
}, true);

// Save changes to text and image data in storyboard using StoreJS
function saveStoryboardData() {
    const scenes = document.querySelectorAll('.scene-div');  // Select all scene-div elements
    // Convert NodeList into an array
    const storyboardData = Array.from(scenes).map(scene => {
        return {
            // Create new object containing scene title, image, and description properties
            title: scene.querySelector('.scene-title p').textContent,
            imgSource: scene.querySelector('.scene-img img').src,
            description: scene.querySelector('.scene-text p').textContent
        };
    });

    // Store array of scene objects under the key 'storyboardData'
    store.set('storyboardData', storyboardData);
}

// Display data from local storage
function displayStoryboardData() {
    const storyboardData = store.get('storyboardData');
    if (storyboardData) {
        document.getElementById('storyboard').innerHTML = '';  // Delete content on storyboard
        // Loop through the storyboard array and
        storyboardData.forEach(data => {
            const sceneDiv = createSceneDiv(data);
            document.getElementById('storyboard').appendChild(sceneDiv);  // Add new scene to the page
        });
    }
}
