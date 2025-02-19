import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header.module.css';
import Tabs from './components/tabs/Tabs';
import Tasks from './components/tasks/Tasks';
import Mindmap from './components/mindmap/Mindmap';

function App() {
    const [tabs, setTabs] = useState([]); // 用于存储标签页数据
    const [tasks, setTasks] = useState([]);  // 用于存储任务数据
    const [mindmapTabs, setMindmapTabs] = useState([]); // 存储拖拽到当前 Mindmap 的 tabs
    const [selectedTaskId, setSelectedTaskId] = useState(null); // current selected task
    const [selectedTaskName, setSelectedTaskName] = useState('choose to open a task'); // current selected task name

    useEffect(() => {  // a hook to fetch tasks and tabs
        setMindmapTabs([]);
        chrome.runtime.sendMessage({ action: "get_tasks" }, (response) => {
            if (response && response.tasks) {
                console.log("Fetched tasks:", response.tasks);
                setTasks(response.tasks);
        }});


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
            } else if (message.action === "update_tasks") {
                // update tasks
                console.log("Received updated tasks:", message.tasks);
                setTasks(message.tasks || []);
                if (selectedTaskId){
                    setSelectedTaskName(tasks.find(task => task.task_id === selectedTaskId).task_name);
                }
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
    //      "summary": "This is a summary of the page.",
    //     "summaryLong": "This is a long summary of the page.",
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

    // 删除被拖拽到 Mindmap 的 tab
    const removeTab = (tabId) => {
        setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== tabId));
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
                    <Tasks tasks={tasks} setTasks={setTasks} setSelectedTaskId = {setSelectedTaskId} selectedTaskId={selectedTaskId} setMindmapTabs={setMindmapTabs} setSelectedTaskName={setSelectedTaskName}/>
                </aside>

                {/* 中间内容区域 */}
                <main className="main-content">

                    {/* 使用 Tabs 组件 */}
                    <button onClick={refreshTabs}>Refresh</button>
                    <Tabs tabs={tabs} setTabs={setTabs} setMindmapTabs={setMindmapTabs} selectedTaskId={selectedTaskId}/>

                    {/* task详细内容区域，因为历史原因命名为mindmap */}
                    <Mindmap mindmapTabs={mindmapTabs} setMindmapTabs={setMindmapTabs} removeTab={removeTab} selectedTaskId={selectedTaskId} selectedTaskName={selectedTaskName}/>
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
