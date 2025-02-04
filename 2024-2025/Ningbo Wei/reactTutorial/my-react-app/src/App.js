import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import Tabs from './components/tabs/Tabs';
import Tasks from './components/tasks/Tasks';

function App() {
  const [tabs, setTabs] = useState([]); // 用于存储标签页数据
  const [tasks, setTasks] = useState([]);  // 用于存储任务数据
  const [activeTaskId, setActiveTaskId] = useState(null); // 用于存储当前选中的任务 ID

  useEffect(() => {
    // 监听 `background.js` 推送的 tabs 更新
    const handleMessage = (message) => {
      if (message.action === "update_tabs") {
        console.log("Received updated tabs:", message.tabs);
        setTabs(message.tabs || []);
      }
      else if (message.action === "summary_result") {
        // 收到后台返回的总结后，更新对应的 tab.summary
        setTabs(prevTabs => {
          const updatedTabs = prevTabs.map(tab => {
            if (tab.id === message.tabId) {
              return { ...tab, summary: message.summary };
            }
            return tab;
          });
          console.log("original tabs:", tabs);
          console.log("Updated tabs with summary:", updatedTabs);
          return updatedTabs;
        });
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    // 在组件加载时主动请求一次 tabs
    chrome.runtime.sendMessage({ action: "get_tabs" });
    
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

    // return sample data
        // {[
        //     "id": 1,
        //     "title": "Sample Page",
        //     "main_text": "This is the main content of the page.",
        //     "outline": "# Heading 1\n## Heading 2",
        //     "currentUrl": "https://example.com",
        //     "images": [
        //       {
        //         "url": "https://example.com/image1.png",
        //         "base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..."
        //       },
        //       {
        //         "url": "https://example.com/image2.jpg",
        //         "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABg..."
        //       }
        //     ]
        //   ]}

  const refreshTabs = () => {
    if (chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ action: "fetch_titles" }, (response) => {
        console.log("Sent refresh request to background.js");
      });
    }
  };

  const createNewTask = () => {
    const newTask = { id: Date.now(), name: `Task ${tasks.length + 1}`, tabs: [] };
    setTasks(prevTasks => [...prevTasks, newTask]);
    setActiveTaskId(newTask.id);
  };

  const handleTabDrop = (tab) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === activeTaskId) {
        return { ...task, tabs: [...task.tabs, tab] };
      }
      return task;
    }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sense Making Visualise</h1>
      </header>
      <div className="layout">
        {/* 左侧任务列表 */}
        <aside className="task-list">
        <h2>Tasks</h2>
          <button onClick={createNewTask}>New Task</button>
          <Tasks tasks={tasks} />
          {/* <ul>
            {tasks.map(task => (
              <li key={task.id} onClick={() => setActiveTaskId(task.id)}>
                {task.name}
              </li>
            ))}
          </ul> */}
        </aside>

        {/* 中间内容区域 */}
        <main className="main-content">

          {/* 使用 Tabs 组件 */}
          <button onClick={refreshTabs}>Refresh</button>
          <Tabs tabs={tabs} setTabs={setTabs} onTabDrop={handleTabDrop}/>

          {/* 思维导图区域 */}
          <div className="mindmap">
            <h2>Mindmap</h2>
              {tasks.find(task => task.id === activeTaskId)?.tabs.map(tab => (
                <div key={tab.id} className="tab">
                  <h3>{tab.title}</h3>
                  <p>{tab.currentUrl}</p>
                </div>
              ))}
            {/* 思维导图展示逻辑 */}
          </div>
        </main>

        {/* 右侧问答区域 */}
        <aside className="qa-section">
          <h2>QA</h2>
          <input type="text" placeholder="Ask a question..." />
          <button>Search</button>
          <div className="qa-results">
            {/* 问答结果展示 */}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
