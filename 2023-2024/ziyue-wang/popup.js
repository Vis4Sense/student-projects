function showContainer(containerId) {
  // Hide all containers
  document.querySelectorAll('.container').forEach(function(container) {
    container.classList.remove('active');
  });
  
  // Show the selected container
  document.getElementById(containerId).classList.add('active');
}

document.addEventListener('DOMContentLoaded', function() {
  // Event listeners for menu buttons
  document.getElementById('search-btn').addEventListener('click', function() {
    showContainer('search-container');
  });

  document.getElementById('history-btn').addEventListener('click', function() {
    showContainer('history-container');
  });

  document.getElementById('do-search').addEventListener('click', function() {
    var searchInput = document.getElementById('search-input').value.trim();
    if (!searchInput) {
      alert("Please enter your search terms.");
      return;
    }

    // Perform the search and update the results
    document.getElementById('search-results').textContent = 'Results for: ' + searchInput;
    // Here you would typically include a call to an API

    document.getElementById('gpt-analysis-btn').addEventListener('click', performGPTAnalysis);
  });
});

// perform Knowledge Graph search
document.getElementById('kgSearchBtn').addEventListener('click', function() {
  const query = document.getElementById('kgSearchInput').value.trim();
  if (!query) {
    alert("Please enter your search terms.");
    return;
  }
});

function performGPTAnalysis() {
  // get searching history
  chrome.storage.sync.get({searchHistory: []}, function(data) {
    const searchHistory = data.searchHistory;

    // make prompt
    const prompt = `The user has searched for the following terms: ${searchHistory.join(', ')}. Based on this, what kind of information might the user be interested in?`;

    // call OpenAI API
    fetch('https://api.openai.com/v1/engines/text-davinci-004/completions', {
      method: 'POST',
      headers: {
        //API KEY HERE
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 150
      })
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById('gpt-analysis-results').textContent = data.choices[0].text;
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('gpt-analysis-results').textContent = 'Analysis failed.';
    });
  });
}

// as users press "Go" button then perform searching action
document.getElementById('do-search').addEventListener('click', function() {
  var searchInput = document.getElementById('search-input').value.trim();
  const resultsElement = document.getElementById('search-results');

  // get rid of the previously  defaulted searching results and show the tips of loading
  resultsElement.innerHTML = '<div>Loading...</div>';

  if (!searchInput) {
    alert("Please enter your search terms.");
    return;
  }
  
  chrome.runtime.sendMessage({
    contentScriptQuery: "fetchKnowledgeGraphData",
    query: searchInput
  }, function(response) {
    if (response.error) {
      document.getElementById('search-results').textContent = 'Error: ' + response.error;
    } else {
      // display the searching results
      displaySearchResults(response.data);
    }
  });

function displaySearchResults(data) {
  const resultsElement = document.getElementById('search-results');
  resultsElement.innerHTML = `Name: ${data.itemListElement[0].result.name}<br>
  Description: ${data.itemListElement[0].result.description || 'No description available.'}<br>
  Detailed Description: ${data.itemListElement[0].result.detailedDescription ? data.itemListElement[0].result.detailedDescription.articleBody : 'No detailed description available.'}<br>
  Image: ${data.itemListElement[0].result.image ? data.itemListElement[0].result.image.contentUrl : 'No image available.'}<br>
  Wikipedia URL: ${data.itemListElement[0].result.detailedDescription ? data.itemListElement[0].result.detailedDescription.url : 'No Wikipedia URL available.'}<br>
  Official URL: ${data.itemListElement[0].result.url || 'No official URL available.'}`;
}

// save the searching history 
chrome.storage.sync.get({searchHistory: []}, function(data) {
  var history = data.searchHistory;
  history.push(searchInput);
  chrome.storage.sync.set({searchHistory: history}, function() {
    console.log('Search history updated.');
  });
});

  // send search requests to gpt-researcher
  fetch('http://localhost:8000/#form', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: searchInput })
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById('search-results').textContent = JSON.stringify(data, null, 2);
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('search-results').textContent = 'Search failed.';
  });
});
