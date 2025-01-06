import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import Header from './components/Header';
import Tabs from './components/tabs/Tabs';

function App() {
  const [tabs, setTabs] = useState([]); // 用于存储标签页数据

  useEffect(() => {
    const fetchData = () => {
      axios.get('http://127.0.0.1:8080/api/tabs') // 后端返回的数据
      .then(response => {
        console.log('Response data:', response.data); // 正确打印数据
        setTabs(response.data.tabs || []); // 提取 titles 数组，确保其存在
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
      })
      .catch(error => console.error('Error fetching tabs:', error));
        
    };

    // 初次加载数据
    fetchData();

    // 每隔 3 秒轮询一次
    const interval = setInterval(fetchData, 3000);

    // 清理定时器
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sense Making Visualise</h1>
      </header>
      <div className="layout">
        {/* 左侧任务列表 */}
        <aside className="task-list">
          <h2>Tasks</h2>
          <ul>
            <li>Cameras comparing</li>
            <li>Jobs searching</li>
            <li>Hotel booking</li>
            <li>London traveling</li>
          </ul>
        </aside>

        {/* 中间内容区域 */}
        <main className="main-content">

          {/* 使用 Tabs 组件 */}
          <Tabs tabs={tabs} />

          {/* 思维导图区域 */}
          <div className="mindmap">
            <h2>Generated Mindmap</h2>
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
