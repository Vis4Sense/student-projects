const axios = require('axios');

function performGPTAnalysis() {
    const lastSearchInput = 'sensemaking'; // pre-difined
    const lastSearchOutput = {
      detailedDescription: "Sensemaking or sense-making is the process by which people give meaning to their collective experiences. It has been defined as 'the ongoing retrospective development of plausible images that rationalize what people are doing'.",
    }; // pre-defined

    let prompt = `This is a sensemaking task for a browser extension designed to summarize, analyze, and predict information based on a user's search history. The user's last search query was about: "${lastSearchInput}". They found the following information: "${lastSearchOutput.detailedDescription}". Considering this search, what might the user be interested in and what further actions could the user consider? Please provide analysis and suggestions within 300 words.`; // should be kept

    axios.post('https://api.openai.com/v1/chat/completions', {  // 修改端点为 v1/chat/completions
      messages: [{role: "system", content: "Analyze user search query and provide suggestions based on the following description."}, 
                 {role: "user", content: prompt}],
      model: "gpt-4",  // 确保使用正确的模型标识符
      max_tokens: 750
    }, {
      headers: {
        'Authorization': 'Bearer sk-proj-EnUAQnTOEWDbiLWpOnDaT3BlbkFJQnbeMfij4F9CmjTtkmlB', // 确保使用了有效的API密钥
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      const gptResponse = response.data.choices && response.data.choices.length > 0 ? response.data.choices[0].message.content : 'No response from GPT.';
      console.log(gptResponse);
    })
    .catch(error => {
      console.error('Error status:', error.response.status);
      console.error('Error message:', error.response.data);
    });
}

performGPTAnalysis();