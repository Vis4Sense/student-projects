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

// a simple usecase
const kgApi = new KnowledgeGraphAPI();
kgApi.search('phone').then(data => console.log(data));
