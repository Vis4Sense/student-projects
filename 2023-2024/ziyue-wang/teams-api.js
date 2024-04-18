const axios = require('axios');

const endpoint = "https://ai-rum-swe-a909a5-2.openai.azure.com/"; // 你的API端点
const apiKey = "fb4f676e065c4e238870e2adc0cd5956"; // 你的API密钥

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
};

const data = {
    prompt: "Translate the following English text to French: 'Hello, how are you?'", // 或者你的具体应用场景
    model: "GPT-3.5-Turbo-0125", // 选择合适的模型
    temperature: 0.5,
    max_tokens: 60
};

axios.post(endpoint, data, { headers: headers })
    .then(response => {
        console.log("Response from API:", response.data);
    })
    .catch(error => {
        console.error("Error calling the API:", error);
    });