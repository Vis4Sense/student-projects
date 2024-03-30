import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.16.1';

pipe = pipeline('sentiment-analysis')
/*

window.addEventListener('DOMContentLoaded', getNodeList);

function getNodeList() {
    // Retrieve the HTML content of the current webpage
    const nodeList = document.getElementById('nodeSection');
    // Process the HTML content
    console.log(nodeList)
}


var example = ['ChatGPT',
"@themaximalist/embeddings.js - npm",
"@langchain/openai - npm",
"@themaximalist/embeddings.js - npm",
"vis4sense",
"Simple Budget",
"Top JavaScript Courses Online - Updated [March 2024]",
"Online Web Development & Programming Courses | Udemy",
"javascript - How to import ES6 modules in content script for Chrome Extension - Stack Overflow"]



async function generateEmbeddingsForList(list) {
    const embeddingsList = [];

    // Iterate over each element in the list
    for (const element of list) {
        try {
            // Generate embedding for the current element
            const embedding = await embeddings(element);
            
            // Push the embedding into the embeddingsList
            embeddingsList.push(embedding);
        } catch (error) {
            console.error("Error generating embedding:", error);
        }
    }

    return embeddingsList;
}

generateEmbeddingsForList(example)
    .then(embeddingsList => {
        console.log("Embeddings for each element:", embeddingsList);
    })
    .catch(error => {
        console.error("Error generating embeddings for list:", error);
    });


const generator = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
const text = ["Density-based spatial clustering of applications with noise (DBSCAN) is one of the most popular algorithm for clustering data."+
"Ordering points to identify the clustering structure (OPTICS) is an algorithm for clustering data similar to DBSCAN. The main difference between OPTICS and DBSCAN is that it can handle data of varying densities."+
"K-means clustering is one of the most popular method of vector quantization, originally from signal processing. Although this method is not density-based, it's included in the library for completeness."]
const output = await generator(text, {
    max_new_tokens: 100,
  });

console.log(output)
//{summary_text: " The main difference between OPTICS and DBSCAN is that it can handle data of varying densities. K-means clustering is one of the most popular method of vector quantization. Although this method is not density-based, it's included in the library for completeness."}

*/
