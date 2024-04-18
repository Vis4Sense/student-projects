class ChatGPTAPI {
    constructor(apiKey) {
      this.apiKey = apiKey;
      this.baseUrl = 'https://api.openai.com/v1/chat/completions';
    }
  
    async generateResponse(prompt, retryCount = 0) {
      const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 50,
        n: 1,
        stop: null,
        temperature: 1,
      };
  
      try {
        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify(requestBody),
        });
  
        if (response.status === 429) {
          if (retryCount < 3) {
            const retryDelay = (retryCount + 1) * 5000;
            console.log(`请求过于频繁,等待 ${retryDelay / 1000} 秒后重试...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return this.generateResponse(prompt, retryCount + 1);
          } else {
            throw new Error('重试次数超过限制');
          }
        }
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API 请求失败:', errorData);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        return data.choices[0].message.content.trim();
      } catch (error) {
        console.error('请求过程中出现错误:', error);
        throw error;
      }
    }
  }
  
  const apiKey = 'sk-proj-Y7eEppWUmptLxs3JXspET3BlbkFJ2DVpOjYnSWriGeYRNbco';
  const chatGptApi = new ChatGPTAPI(apiKey);
  
  const prompt = "这是测试调用gpt的api的程序,如果收到信息请输出yes";
  chatGptApi.generateResponse(prompt)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.error('Error:', error);
    });