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