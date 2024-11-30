import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import Header from './components/Header';

function App() {
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      axios.get('http://127.0.0.1:8080/api/tabs')
        .then(response => setTabs(response.data.titles))
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
          {tabs.map((title, index) => (
            <li key={index}>{title}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
