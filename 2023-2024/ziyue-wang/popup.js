document.getElementById('searchBtn').addEventListener('click', function() {
    var userInput = document.getElementById('userInput').value;
    chrome.runtime.sendMessage({
        contentScriptQuery: "fetchKnowledgeGraphData",
        query: userInput
    }, response => {
      if (response.data) {
        // process and show data here
        var graphData = response.data.itemListElement[0].result;
        document.getElementById('graph').innerHTML = `
          Name: ${graphData.name} <br>
          Description: ${graphData.description} <br>
          Detailed Description: ${graphData.detailedDescription ? graphData.detailedDescription.articleBody : 'N/A'}
        `;
      }
    });
  });

document.getElementById('searchBtn').addEventListener('click', function() {
  // Assuming here we send a request to your backend for keyword search or other operations.
  // After receiving the results, update the `analysisResults` section on the page.
  const resultsElement = document.getElementById('analysisResults');
  resultsElement.innerHTML = ''; // Clear previous results.

  // Example: Assuming the results received from the server are an array of objects.
  const results = [{name: 'Keyword1', score: 0.9}, {name: 'Keyword2', score: 0.8}]; // Sample data.
  results.forEach(result => {
    const resultItem = document.createElement('div');
    resultItem.textContent = `Keyword: ${result.name}, Score: ${result.score}`;
    resultsElement.appendChild(resultItem);
  });
});
