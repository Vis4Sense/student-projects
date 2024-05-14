

function createTaskBox() {
    chrome.storage.local.get(['endpoint', 'apiKey'], function(result) {
        if (result.endpoint && result.apiKey) {
            var endpoint = result.endpoint;
            var azureApiKey = result.apiKey;
    var DeploymentID = "gpt-35-turbo-16k";
    
    
    //check if the node in nodesection have "highlight" class, remove the class
    var nodes = document.querySelectorAll('.node');
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].classList.remove('highlight');
    }

    // Get the input value
    var taskTopic = document.getElementById('input_task').value;

    if (taskTopic.trim() === '') {
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
    nodeContainer.id = "task"+(Object.keys(taskMap).length);
    
    
    //create task in taskMap
    updateTaskMap(nodeContainer.id,taskTopic,"","create");

    var taskTheme = document.createElement('p');
    taskTheme.textContent = taskTopic;

    // Dispatch an event to notify the embedding script
    // get the embedding vector for task topic
    document.dispatchEvent(new CustomEvent('embeddingEvent', { detail: { taskTopic: taskTopic,taskId: nodeContainer.id } }));
    
    // Allow the task box to accept dropped nodes
    nodeContainer.addEventListener('dragover', allowDrop);
    nodeContainer.addEventListener('drop', drop);
    nodeContainer.addEventListener('click', function() {
        //console.log(taskMap[nodeContainer.id].topic_embedding);
        document.dispatchEvent(new CustomEvent('readyForDimensionReduction', {
            detail: {
              action: 'taskBoxClick',
              taskId: nodeContainer.id,
              embedding: taskMap[nodeContainer.id].topic_embedding
            }
          }));
    });

    // Create the pull-out button
    // when click the button, all pages in the task box will be pulled out to a new window
    var pullOutButton = document.createElement('button');
    //pullOutButton.textContent = 'Pull Out';
    pullOutButton.classList.add('pullOutButton');
    pullOutButton.title = 'Pull Out webpages';
    pullOutButton.addEventListener('click', function() {
        // pull out functionality

        taksId = nodeContainer.id;
        // go through the taskMap to get the node URL
        var tabIds = [];
        for (var nodeId in taskMap[taksId]) {
            // Check if nodeId starts with 'node'
            console.log(nodeId);
            if (nodeId.startsWith('node')) {
                //nevigate to the pages in the task box
                tabIds.push(taskMap[taksId][nodeId].pageData.tabId
                    );
            }
        }

        //console.log(tabIds);
        chrome.windows.create({ focused: false, state: 'minimized'}, function(newWindow) {

            tabIds.forEach(function(tabId) {
                chrome.tabs.move(tabId, { windowId: newWindow.id, index: -1 });
            });
            // Once all tabs are moved, maximize the window
            chrome.windows.update(newWindow.id, { focused: true, state: 'maximized' });
        });

    });
    
    //Create summary button
    var summaryButton = document.createElement('button');
    summaryButton.classList.add('summaryButton');
    summaryButton.title = 'Generate task summary';
    summaryButton.addEventListener('click', function() {
        //generate task summary
        var text = "";
        for (var nodeId in taskMap[nodeContainer.id]) {
            // Check if nodeId starts with 'node'
            if (nodeId.startsWith('node')) {
                text += taskMap[nodeContainer.id][nodeId].pageData.content + "\n";
            }
        }
        messages = [{
            role: "system",
            content: `User message will provide several main content from different webpages about
             same topic ${taskTopic}, and you need to generate a summary based on the user message.
             The summary should be concise and informative, and serve as inference for user about 
             the main purpose of the task.
              
              Guidelines:
              - The summary should be concise and informative
              - Make the summary as a list of each webpage's main content, each point should be between <li> and <\li> 
                for example: 
                <li> this is a log in page </li>
              - Please only use the provided information for your answer
              - the summary should be less than 200 words
              - if there is no information from user quety, return "I need more information to generate summary"`
          }, {
            role: "user",
            content: text
          }];

        let url = "{AOAIEndpoint}/openai/deployments/{AOAIDeploymentID}/chat/completions?api-version=2023-06-01-preview".replace("{AOAIEndpoint}", endpoint).replace("{AOAIDeploymentID}", DeploymentID);
        let body = JSON.stringify({
           messages: messages
        });
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': azureApiKey
            },
            body: body
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            let messageContent = data.choices[0].message.content;
            console.log(messageContent);
            // 'data' is the JSON object from the response
            // var width = 400;
            // var height = 300;
            // var left = (window.screen.width - width) / 2;
            // var top = (window.screen.height - height) / 2;
            // var popup = window.open("", "popup", "width=" + width + ", height=" + height + ", top=" + top + ", left=" + left);
            // popup.document.write("<p>" + messageContent + "</p>");

            var existingSummaryText = document.getElementById(nodeContainer.id);

            if (existingSummaryText && existingSummaryText.classList.contains("summary-text")) {
                // If an element with the specified id exists and it has the "summary-text" class, update its content
                existingSummaryText.innerHTML = "<ul>" + messageContent + "<\/ul>";
            } else {
                // If no element with the specified id exists or it does not have the "summary-text" class, create a new one
                var newDiv = document.createElement("div");
                newDiv.innerHTML = "<ul>" + messageContent + "<\/ul>";
                newDiv.classList.add("summary-text");
                newDiv.setAttribute("id", nodeContainer.id); // Set the id if it doesn't exist, otherwise it retains its existing id
                newDiv.style.top = taskBox.offsetTop + "px";
                newDiv.style.right = "20px";
                
                document.body.appendChild(newDiv);
            }
        })
        .catch(error => {
            console.error('Failed to fetch:', error);
        });

        //console.log(summary);
        //popup a small window to show the summary
        //make the window at the middle of the screen
        
    }
    );


    // Create the delete button
    var deleteButton = document.createElement('button');
    //deleteButton.textContent = 'Delete';
    deleteButton.classList.add('deleteButton');
    deleteButton.title = 'Delete';
    deleteButton.addEventListener('click', function() {
        taskBox.remove();
        var existingSummaryText = document.getElementById(nodeContainer.id);
        if (existingSummaryText && existingSummaryText.classList.contains("summary-text")){
            existingSummaryText.remove();
        }
        
        //Delete the task box in taskMap
        updateTaskMap(nodeContainer.id,"","",'delete box');
    });

    // Append the buttons and content to the task box
    taskBox.appendChild(taskTheme)
    taskBox.appendChild(pullOutButton);
    taskBox.appendChild(deleteButton);
    taskBox.appendChild(summaryButton);
    taskBox.appendChild(nodeContainer);

    // Append the task box to the task container
    document.getElementById('taskContainer').appendChild(taskBox);

    // Clear the input field after creating the task box
    document.getElementById('input_task').value = '';

    }
  });
}



// handel the node creation and node behavior
function createNode(page,section) {
    var nodeSection = document.getElementById(section);

    // check if the page is already in the nodeSection
    var buttonsInNodeSection = document.querySelectorAll('#'+section+' button');
    for (var i = 0; i < buttonsInNodeSection.length; i++) {
        var button = buttonsInNodeSection[i];
        var text = button.firstChild.nodeValue.trim();
        if (text === page.pageObj.title) {
            console.log("node already exists in the left sidebar"+page.pageObj.title);
            return false; // Skip creating the node if the title already exists
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
        // get the parenrt element id 
        var parentElementID = newNode.parentNode.id;

        newNode.parentNode.removeChild(newNode);
        
        //console.log(parentElementID);
        //update taskMap
        if (parentElementID === "nodeSection") {
            updateTaskMap("floatingNode",page,"",'delete');
        } else {
            updateTaskMap(section,page,"",'delete');
        }
    });

    nodeSection.appendChild(newNode);

    return true;
}

