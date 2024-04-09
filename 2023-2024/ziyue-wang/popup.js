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
  });
});

// 处理保存 API 密钥的事件
document.getElementById('saveApiKey').addEventListener('click', function() {
  const apiKey = document.getElementById('apiKeyInput').value.trim();
  if (apiKey) {
    // 保存 API 密钥到浏览器存储
    chrome.storage.sync.set({ apiKey: apiKey }, function() {
      document.getElementById('kgMessage').textContent = 'API Key saved';
    });
  } else {
    document.getElementById('kgMessage').textContent = 'Please input API Key';
  }
});

// 显示已保存的 API 密钥
chrome.storage.sync.get('apiKey', function(data) {
  if (data.apiKey) {
    document.getElementById('apiKeyInput').value = data.apiKey;
  }
});

// 执行 Knowledge Graph 搜索
document.getElementById('kgSearchBtn').addEventListener('click', function() {
  const query = document.getElementById('kgSearchInput').value.trim();
  if (!query) {
    alert("Please enter your search terms.");
    return;
  }

  // 从存储中获取 API 密钥
  chrome.storage.sync.get('apiKey', function(data) {
    if (data.apiKey) {
      // 执行搜索
      const kgApi = new KnowledgeGraphAPI(data.apiKey);
      kgApi.search(query).then(function(result) {
        // 处理和展示结果
        // 这里使用了 knowledge-graph-api.js 中的 processResult 函数
        processResult(result);
      }).catch(function(error) {
        document.getElementById('kgSearchResults').textContent = error.message;
      });
    } else {
      alert('API Key is not set.');
    }
  });
});

// as users press "Go" button then perform searching action
document.getElementById('do-search').addEventListener('click', function() {
  var searchInput = document.getElementById('search-input').value.trim();
  if (!searchInput) {
    alert("Please enter your search terms.");
    return;
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
