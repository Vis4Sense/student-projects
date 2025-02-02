console.log("Hello, World!");

// const fetch = require('node-fetch');  // 如果在 Node.js 环境运行，需安装 node-fetch 模块
import fetch from 'node-fetch'

const apiBase = "https://ai-rum-swe-a909a5-2.openai.azure.com/";  // API Base URL
const apiKey = "fb4f676e065c4e238870e2adc0cd5956";  // API Key
const deploymentName = "gpt-35-turbo-16k";  // 模型部署名称
const apiVersion = "2023-06-01-preview";  // API 版本

const url = `${apiBase}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;

const prompt = "给我推荐一些中式炒菜";

const headers = {
    "Content-Type": "application/json",
    "api-key": apiKey
};

const body = JSON.stringify({
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt }
    ],
    max_tokens: 500
});

fetch(url, {
    method: "POST",
    headers: headers,
    body: body
})
.then(response => response.json())
.then(data => {
    const reply = data.choices[0].message.content.trim().replace(/\n/g, "");
    console.log(reply);
})
.catch(error => {
    console.error("Error:", error);
});
