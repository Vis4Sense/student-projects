export class TfIdf {
    constructor() {
      this.documents = []; // 存储文档
      this.termFreqs = []; // 每篇文档的词频
      this.idfMap = {};    // idf 索引
    }
  
    // 用于分词，去除标点并转为小写
    tokenize(text) {
      return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')  // 只保留英文和数字
        .split(/\s+/)
        .filter(Boolean);
    }
  
    // 添加一篇文档
    addDocument(text) {
      const tokens = this.tokenize(text);
      const freq = {};
      tokens.forEach(word => {
        freq[word] = (freq[word] || 0) + 1;
      });
      this.documents.push(tokens);
      this.termFreqs.push(freq);
    }
  
    // 计算 IDF
    computeIdf() {
      const docCount = this.documents.length;
      const df = {};
      this.documents.forEach(doc => {
        const seen = new Set();
        doc.forEach(word => {
          if (!seen.has(word)) {
            df[word] = (df[word] || 0) + 1;
            seen.add(word);
          }
        });
      });
  
      Object.keys(df).forEach(word => {
        this.idfMap[word] = Math.log(docCount / (df[word] || 1));
      });
    }
  
    // 获取某篇文档中每个词的 TF-IDF 值
    getTfIdf(docIndex) {
      const tfidf = {};
      const tf = this.termFreqs[docIndex];
      for (const word in tf) {
        const idf = this.idfMap[word] || 0;
        tfidf[word] = tf[word] * idf;
      }
      return tfidf;
    }
  
    // 输入短语进行分析（返回该输入在所有文档中的 TF-IDF 权重数组）
    analyzeInput(text) {
      const tokens = this.tokenize(text);
      const results = this.documents.map((_, idx) => {
        const tfidf = this.getTfIdf(idx);
        let score = 0;
        tokens.forEach(t => {
          score += tfidf[t] || 0;
        });
        return score;
      });
      return results;
    }
  }
  