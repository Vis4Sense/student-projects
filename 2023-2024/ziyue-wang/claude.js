const { Client } = require('anthropic');

const apiKey = 'sk-ant-api03-mrmRzF-1x397AtlRNiur-PEQ7TlpAf3HxY4YQXeyvfB1p642QIAiMYN4Qwv98mKPCJOhA-ZvoYKgAA';
const client = new Client(apiKey);

async function testConnection() {
  try {
    const response = await client.complete({
      prompt: 'Human: Hello, Nice to meet you!\nAssistant:',
      model: 'claude-v1',
      max_tokens_to_sample: 100,
    });

    console.log(response.completion);
    console.log('连接测试成功!');
  } catch (error) {
    console.error('连接测试失败:', error.message);
  }
}

testConnection();