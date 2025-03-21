// embedding-worker.js
importScripts('transformers.min.js');

let extractor = null;

onmessage = async (event) => {
  const text = event.data;

  if (!extractor) {
    extractor = await transformers.pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2'
    );
  }

  const result = await extractor(text, {
    pooling: 'mean',
    normalize: true
  });

  postMessage(result.data); // embedding 向量
};
