// import styles from './Tabs.module.css';

// const tabSummary = (tab) => {
//   console.log("Tab data trying sent to background.js:", tab);
//   if (chrome.runtime && chrome.runtime.sendMessage) {
//     chrome.runtime.sendMessage(  // 打包为一个message类发送
//       { 
//         action: "summarize_tab", 
//         title: tab.title, 
//         mainText: tab.main_text, 
//         outline: tab.outline 
//       }, 
//       (response) => {
//         // console.log("Tab data sent to background.js:", tab);
//       }
//     );
//   }
// };

// const Tabs = ({ tabs }) => {
//     return (
//       <div className={styles.tabs}>
//         {tabs.map((tab, index) => (
//           <div key={tab.id || index} className={styles.tab}>
//             <button onClick={() => tabSummary(tab)}>Summary</button>
//             <h3>{tab.title.slice(0, 50)}</h3>
//             <p>{tab.currentUrl.slice(0, 150)}...</p>
//             <p>{tab.summary}...</p>
//           </div>
//         ))}
//       </div>
//     );
//   };
  
//   export default Tabs;

import React from 'react';
import styles from './Tabs.module.css';

const Tabs = ({ tabs, setTabs }) => {

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

  return (
    <div className={styles.tabs}>
      {tabs.map((tab, index) => (
        <div key={tab.id || index} className={styles.tab}>
          <button onClick={() => handleSummary(tab)}>Summary</button>
          <h3>{tab.title.slice(0, 50)}</h3>
          <p>{tab.currentUrl.slice(0, 150)}...</p>
          <p>{tab.summary || "No summary generated yet"}</p>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
