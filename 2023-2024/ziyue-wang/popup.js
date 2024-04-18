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
    fetchHistory();
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
  });

  // Add the event listener for the GPT Analysis button here, outside of the other event listener
  document.getElementById('gpt-analysis-btn').addEventListener('click', performGPTAnalysis);
});

function fetchHistory() {
  console.log('fetchHistory called from popup');
  
  chrome.runtime.sendMessage({command: "fetchHistory"}, function(response) {
    if(chrome.runtime.lastError) {
      console.error('Error:', chrome.runtime.lastError);
      return;
    }

    const historyResults = document.getElementById('search-history');
    historyResults.innerHTML = '';

    if (response && response.historyItems && response.historyItems.length > 0) {
      // Save the fetched history to storage
      chrome.storage.sync.set({searchHistory: response.historyItems}, function() {
        console.log('Search history saved to storage.');
      });

      // Display the history to the user
      response.historyItems.forEach(function(historyItem) {
        const entry = document.createElement('div');
        entry.textContent = `${historyItem.title} - ${historyItem.url}`;
        historyResults.appendChild(entry);
      });
    } else {
      historyResults.textContent = 'No recent history found.';
    }
  });
}

document.getElementById('history-btn').addEventListener('click', function() {
  chrome.history.search({text: '', maxResults: 10}, function(historyItems) {
    console.log('History Items:', historyItems);
    chrome.storage.sync.set({searchHistory: historyItems}, function() {
      console.log('Search history saved to storage.');
    });
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
  // Get search history and latest search input and output
  chrome.storage.sync.get({ searchHistory: [], lastSearchInput: '', lastSearchOutput: '' }, function(data) {
    const { searchHistory, lastSearchInput, lastSearchOutput } = data;
    console.log('Retrieved Data:', data);

    // Format the last search output
    let formattedLastSearchOutput = typeof lastSearchOutput === 'object' ? JSON.stringify(lastSearchOutput) : lastSearchOutput;

    // Function to format timestamps into "hour:minute" format
    function formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }

    // Format the search history with title, time, and URL
    let formattedSearchHistory = searchHistory.map(entry => {
      return `title: ${entry.title}\ntime: ${formatTimestamp(entry.lastVisitTime)}\nurl: ${entry.url}\n\n`;
    }).join('');

    // If no relevant data is present, don't proceed
    if (!formattedSearchHistory && !lastSearchInput && !formattedLastSearchOutput) {
      document.getElementById('gpt-analysis-results').textContent = 'No recent search activity to analyze.';
      return;
    }

    // Construct the conversation with the system message
    let conversation = [
      {
        role: "system",
        content: "This is a sensemaking task for a browser extension designed to summarize, analyze, and predict information based on a user's search history. Histories are presented in the format of title, time, and URL."
      },
      {
        role: "user",
        content: formattedSearchHistory
      },
      {
        role: "user",
        content: lastSearchInput
      },
      {
        role: "assistant",
        content: formattedLastSearchOutput
      },
      {
        role: "user",
        content: "Considering these searches, what might I be interested in and what further actions could I consider? Tips: Consider that browsing history might include accidental ad clicks which distort the interpretation of mainstream activity; numerous related pages visited in a short period indicate high relevance, lastSearchInput also matters. Do you know gpt-researcher on github? Please also generate an instruction/command/prompt for it to conduct a research and leave this prompt in a sepreate line at the bottom of your response."
      }
    ];

    // Call the OpenAI API with the conversation array
    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer YOUR-API-KEY`, // Replace with your actual API key
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4", // Specify the chat model
        messages: conversation // The constructed conversation array
      })
    })
    .then(response => response.json())
    .then(data => {
      const gptResponse = data.choices && data.choices.length > 0 ? data.choices[0].message.content : 'No response from GPT.';
      document.getElementById('gpt-analysis-results').textContent = gptResponse;
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('gpt-analysis-results').textContent = 'Analysis failed.';
    });
  });
}

function displaySearchResults(data) {
  const resultsElement = document.getElementById('search-results');
  resultsElement.innerHTML = `Name: ${data.itemListElement[0].result.name}<br>
  Description: ${data.itemListElement[0].result.description || 'No description available.'}<br>
  Detailed Description: ${data.itemListElement[0].result.detailedDescription ? data.itemListElement[0].result.detailedDescription.articleBody : 'No detailed description available.'}<br>
  Image: ${data.itemListElement[0].result.image ? data.itemListElement[0].result.image.contentUrl : 'No image available.'}<br>
  Wikipedia URL: ${data.itemListElement[0].result.detailedDescription ? data.itemListElement[0].result.detailedDescription.url : 'No Wikipedia URL available.'}<br>
  Official URL: ${data.itemListElement[0].result.url || 'No official URL available.'}`;
}

function processResult(data) {
  const element = data.itemListElement[0];
  const result = element.result;
  const info = {
    name: result.name,
    description: result.description || 'No description available.',
    detailedDescription: result.detailedDescription ? result.detailedDescription.articleBody : 'No detailed description available.',
    image: result.image ? result.image.contentUrl : 'No image available.',
    wikipediaUrl: result.detailedDescription ? result.detailedDescription.url : 'No Wikipedia URL available.',
    officialUrl: result.url || 'No official URL available.',
    score: element.resultScore
  };

  displayInfoToUser(info);
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

  resultsElement.textContent = 'Loading...'; // Show loading text
  
  chrome.runtime.sendMessage({
    contentScriptQuery: "fetchKnowledgeGraphData",
    query: searchInput
  }, function(response) {
    if (response.error) {
      document.getElementById('search-results').textContent = 'Error: ' + response.error;
    } else {
      // display the searching results
      console.log('Raw response data:', response.data);
      displaySearchResults(response.data);
      const info = processResult(response.data);
      console.log('Processed info:', info);
      chrome.storage.sync.set({
        lastSearchInput: searchInput,
        lastSearchOutput: info, // This should be the structured info object
      }, function() {
        console.log('Last search input and output saved.');
      });
    }
  });
});
