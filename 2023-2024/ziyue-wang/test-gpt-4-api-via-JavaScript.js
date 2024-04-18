fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-proj-EnUAQnTOEWDbiLWpOnDaT3BlbkFJQnbeMfij4F9CmjTtkmlB', // Replace with your actual API key
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: "gpt-4", // Specify the chat model
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Translate 'Hello, how are you?' to French." } // Replace with your actual message
    ]
  })
})
.then(response => response.json())
.then(data => {
  console.log(data);
})
.catch(error => {
  console.error('Error:', error);
});
