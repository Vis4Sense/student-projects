import React from 'react';
import styles from './Tabs.module.css';

const Tabs = ({ tabs, setTabs, setMindmapTabs}) => {

  const handleSummary = (tab) => {
    // 点击按钮后，立即更新该 tab 的 summary 为 "waiting to generate summary"
    const updatedTabs = tabs.map(t => {
      if (t && t.id) {
        return t.id === tab.id ? { ...t, summary: "waiting..." } : t;
      } else {
        console.warn("Invalid tab found:", t);
        return t;  // 返回原值，避免 undefined
      }
    });

    setTabs(updatedTabs);  // 更新父组件的 tabs 状态，触发重新渲染

    // 发送消息到后台请求总结
    if (chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage(
        {
          action: "summarize_tab",
          title: tab.title,
          mainText: tab.main_text,
          outline: tab.outline,
          tabId: tab.id  // 发送 tabId，方便后端返回时识别
        }
      );
    }
  };

  const handleDragStart = (event, tab) => {
    event.dataTransfer.setData('application/json', JSON.stringify(tab));
    event.dataTransfer.effectAllowed = "move";  // 确保可以移动
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedTab = JSON.parse(event.dataTransfer.getData('application/json'));
    // 1. add the dropped tab to the tabs
    setTabs((prevTabs) => {
      const isAlreadyAdded = prevTabs.some((t) => t.id === droppedTab.id);
      return isAlreadyAdded ? prevTabs : [...prevTabs, droppedTab];
    });
    // 2. remove the dropped tab from the mindmapTabs
    console.log("droppedTab:", droppedTab);
    setMindmapTabs((prevTabs) => prevTabs.filter((t) => t.id !== droppedTab.id));
  };

  const allowDrop = (event) => {
    event.preventDefault();
  };

  return (
    <div 
      className={styles.tabs} 
      onDragOver={allowDrop} 
      onDrop={handleDrop}
    >
      {tabs.map((tab, index) => (
        <div 
          key={tab.id || index} 
          className={styles.tab} 
          draggable 
          onDragStart={(event) => handleDragStart(event, tab)}
        >
          <button onClick={() => handleSummary(tab)}>Summary</button>
          <h3>{tab.title.slice(0, 50)}</h3>
          <p>{tab.currentUrl.slice(0, 100)}...</p>
          <p>{tab.summary || "No summary generated yet"}</p>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
