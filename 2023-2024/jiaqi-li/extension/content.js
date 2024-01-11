console.log("Content script running.");

var mainContentContainer = document.getElementById("main-content") || document.getElementsByTagName("main")[0];

// Function to extract text content recursively
function extractTextContent(element) {
    var textContent = '';

    if (element) {
        for (var i = 0; i < element.childNodes.length; i++) {
            var childNode = element.childNodes[i];

            // Exclude script and style elements
            if (childNode.tagName !== 'SCRIPT' && childNode.tagName !== 'STYLE') {
                textContent += extractTextContent(childNode);
            }
        }

        // Add text content of the current element
        if (element.nodeType === Node.TEXT_NODE) {
            textContent += element.textContent;
        }
    }

    return textContent;
}


var mainContent = extractTextContent(mainContentContainer);

console.log("title: " + document.querySelector("h1").innerHTML)
console.log(mainContent);


