// GPT-Analysis.js

function performGPTAnalysis(callback) {
  // 从浏览器扩展的存储中获取搜索历史
  chrome.storage.sync.get({searchHistory: [], lastSearchInput: '', lastSearchOutput: ''}, function(data) {
    const { searchHistory, lastSearchInput, lastSearchOutput } = data;
    const currentTime = new Date().getTime();

    // 过滤最近30分钟内的搜索历史
    const recentSearchHistory = searchHistory.filter(entry => currentTime - entry.timestamp <= 1800000);

    // 构建一个考虑上下文的prompt
    let prompt = "This is a sensemaking task for a browser extension designed to summarize, analyze, and predict information based on a user's search history. ";
    if (lastSearchInput) {
      prompt += `The user's last search query was about: "${lastSearchInput}". They found the following information: "${lastSearchOutput}". `;
    }
    if (recentSearchHistory.length) {
      const formattedSearchHistory = recentSearchHistory.map(entry => `"${entry.query}"`).join(', ');
      prompt += `The user's recent searches include: ${formattedSearchHistory}. `;
    }
    prompt += "Considering these searches, what might the user be interested in and what further actions could the user consider? Please provide analysis and suggestions.";

    // 调用 OpenAI API 使用构建的prompt
    axios.post('https://api.openai.com/v1/chat/completions', {
      messages: [
        {role: "system", content: "Analyze user search query and provide suggestions based on the following description."},
        {role: "user", content: prompt}
      ],
      model: "gpt-4",
      max_tokens: 750,
    }, {
      headers: {
        'Authorization': 'Bearer your-api-key',
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      const gptResponse = response.data.choices && response.data.choices.length > 0 ? response.data.choices[0].message.content : 'No response from GPT.';
      callback(gptResponse); // 通过回调函数返回结果
    })
    .catch(error => {
      console.error('Error:', error);
      callback('Analysis failed.');
    });
  });
}

module.exports = { performGPTAnalysis }; // 导出函数