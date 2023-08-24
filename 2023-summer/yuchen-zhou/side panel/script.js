// 获取浏览历史数据
chrome.history.search({ text: '', maxResults: 10 }, function (historyItems) {
  const historyList = document.getElementById('historyList');

  historyItems.forEach(function (historyItem) {
    const listItem = document.createElement('li');
    listItem.textContent = historyItem.title || historyItem.url;
    historyList.appendChild(listItem);
  });
});
