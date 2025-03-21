const path = require('path');

module.exports = {
  mode: 'development',
  entry: './tfidf-wrapper.js',
  output: {
    filename: 'tfidf.bundle.js', // 打包后输出的文件名
    path: path.resolve(__dirname),
  },
  devtool: false,  // 🚨 关键！彻底关闭 eval()
  resolve: {
    fallback: {
      fs: false,
      path: false
    }
  }
};
