const fetch = require('node-fetch');

async function testConnection() {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-proj-2bZB418U9XucbZg07wiHT3BlbkFJrmcYloHeNUUmSPSB6ocK'
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {"role": "user", "content": "Hello, Nice to meet you!"}
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = `HTTP error! status: ${response.status}`;
      console.error('API request failed:', errorData);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('API response:', data);

    if (!data.choices || data.choices.length === 0) {
      const errorMessage = 'we cannot find available response options';
      console.error(errorMessage);
      throw new Error('Invalid API response');
    }

    console.log(data.choices[0].message);
    console.log('connection success!');
  } catch (error) {
    console.error('connection failed:', error.message);
  }
}

testConnection();
