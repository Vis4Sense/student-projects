class KnowledgeGraphAPI {
  constructor() {
    this.apiKey = 'AIzaSyAPUzaIGCpxj0MdpMr-pGTFuYnMnwRRAuI';
    this.baseUrl = 'https://kgsearch.googleapis.com/v1/entities:search';
  }

  search(query, limit = 1) {
    const url = `${this.baseUrl}?query=${encodeURIComponent(query)}&key=${this.apiKey}&limit=${limit}&indent=True`;
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!data.itemListElement || data.itemListElement.length === 0) {
          throw new Error('No results found.');
        }
        return data;
      })
      .catch(error => console.error('Error:', error));
  }
}

function processResult(data) {
  const element = data.itemListElement[0];
  const result = element.result;
  const info = {
    name: result.name,
    description: result.detailedDescription ? result.detailedDescription.articleBody : 'No description available.',
    image: result.image ? result.image.contentUrl : 'No image available.',
    score: element.resultScore
  };

  displayInfoToUser(info);
}

function displayInfoToUser(info) {
  // Simplified UI display logic
  console.log("Displaying information to user:");
  console.log(`Name: ${info.name}`);
  console.log(`Description: ${info.description}`);
  if (info.image !== 'No image available.') {
    console.log(`Image URL: ${info.image}`);
  }
  console.log(`Score: ${info.score}`);
}

// Example usage
const kgApi = new KnowledgeGraphAPI();
kgApi.search('Headphones').then(processResult);
