chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'copyContent') {
      const url = window.location.href;
      let text = '';
  
      if (url.includes('chat.openai.com')) {
        console.log('Copying content from ChatGPT');
        const selector = [...document.querySelectorAll('.whitespace-pre-wrap')];
        const elements = selector.map((selector) => selector.textContent.trim());
        text = elements.join('\n\n');
      } else {
        console.log('Copying content from a website');
        const selector = 'h1, h2, h3, h4, h5, h6, p';
        const elements = document.querySelectorAll(selector);
  
        elements.forEach((element) => {
          const elementText = element.innerText;
          if (elementText !== 'New chat') {
            text += elementText + '\n\n';
          }
        });
      }
  
      console.log('The text is: ', text);
      sendResponse({ text: text });
    }
  
    return true;
  });
  