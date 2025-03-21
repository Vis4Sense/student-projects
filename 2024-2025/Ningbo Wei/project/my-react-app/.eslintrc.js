module.exports = {
    env: {
      browser: true,
      es6: true,
      webextensions: true  // 允许 Chrome 扩展 API
    },
    globals: {
      chrome: "readonly"  // 让 eslint 识别 `chrome` 变量
    },
    rules: {
      "no-undef": "off" // 关闭 `chrome is not defined` 报错
    }
  };
  