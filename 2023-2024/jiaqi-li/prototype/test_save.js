document.addEventListener("DOMContentLoaded", function() {
    // Function to save a file

    
    function saveFile() {
        // Here you can implement the logic to save the file
        // For example, you can use FileSaver.js library (https://github.com/eligrey/FileSaver.js/)
        // For simplicity, let's just show an alert

        const taskMapContent = JSON.stringify(taskMap, null, 2);
        const taskMapBlob = new Blob([taskMapContent], { type: "application/json" });
        const taskMapUrl = URL.createObjectURL(taskMapBlob);

        const userLogContent = JSON.stringify(userLog, null, 2);
        const userLogBlob = new Blob([userLogContent], { type: "application/json" });
        const userLogUrl = URL.createObjectURL(userLogBlob);

        // Save taskMap
        const aTaskMap = document.createElement("a");
        aTaskMap.href = taskMapUrl;
        aTaskMap.download = "taskMap.json";
        document.body.appendChild(aTaskMap);
        aTaskMap.click();
        document.body.removeChild(aTaskMap);

        // Save userLog
        const aUserLog = document.createElement("a");
        aUserLog.href = userLogUrl;
        aUserLog.download = "userLog.json";
        document.body.appendChild(aUserLog);
        aUserLog.click();
        document.body.removeChild(aUserLog);
        alert("File saved!");
    }

    // Create a button element
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.id = "saveButton";
    saveButton.className = "button"; // Applying the .button class
    saveButton.style.position = "fixed";
    saveButton.style.top = "10px";
    saveButton.style.right = "10px";
        
    // Add click event listener to the button
    saveButton.addEventListener("click", saveFile);

    // Append the button to the body of the document
    document.body.appendChild(saveButton);
});