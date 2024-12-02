import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import Header from './components/Header';

function App() {
  const [tabs, setTabs] = useState([]); // 用于存储标签页数据

  useEffect(() => {
    const fetchData = () => {
      axios.get('http://127.0.0.1:8080/api/tabs') // 假设后端的 GET 路由返回新的数据结构
      .then(response => {
        console.log('Response data:', response.data); // 正确打印数据
        setTabs(response.data.titles || []); // 提取 titles 数组，确保其存在
        // setTabs(response.data); // 假设直接返回数组 [{ id, title, textContent, markdownOutline }]
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
        <Header></Header>
        <h1>Currently Open Tabs</h1>
        <ul>
          {tabs.map((tab, index) => (
            <li key={tab.id || index}>
              <strong>{tab.title}</strong>
              <p>{tab.textContent.slice(0, 100)}...</p> {/* 显示正文的前 100 个字符 */}
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
