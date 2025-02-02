import styles from './Tabs.module.css';

const tabSummary = (tab) => {
  console.log("Tab data trying sent to background.js:", tab);
  if (chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage(  // 打包为一个message类发送
      { 
        action: "summarize_tab", 
        title: tab.title, 
        url: tab.currentUrl, 
        images: tab.images 
      }, 
      (response) => {
        // console.log("Tab data sent to background.js:", tab);
      }
    );
  }
};

const Tabs = ({ tabs }) => {
    return (
      <div className={styles.tabs}>
        {tabs.map((tab, index) => (
          <div key={tab.id || index} className={styles.tab}>
            <button onClick={() => tabSummary(tab)}>Summary</button>
            <h3>{tab.title}</h3>
            <p>{tab.currentUrl.slice(0, 150)}...</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default Tabs;