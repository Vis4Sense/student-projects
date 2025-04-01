import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header.module.css';
import Tabs from './components/tabs/Tabs';
import Tasks from './components/tasks/Tasks';
import Mindmap from './components/mindmap/Mindmap';
import QAchatBox from './components/QAchatBox/ChatBox';
import TaskSummary from './components/taskSummary/TaskSummary';
import ProcessWindow from './components/processWindow/ProcessWindow';

function App() {
    const [tabs, setTabs] = useState([]); // 用于存储标签页数据z
    const [tasks, setTasks] = useState([]);  // 用于存储任务数据
    const [mindmapTabs, setMindmapTabs] = useState([]); // 存储拖拽到当前 Mindmap 的 tabs
    const [selectedTaskId, setSelectedTaskId] = useState(null); // current selected task
    const [selectedTaskSubtaskSet, setSelectedTaskSubtaskSet] = useState([]); // current selected task name
    const [selectedTaskName, setSelectedTaskName] = useState('choose to open a task'); // current selected task name
    const [chatBoxReply, setChatBoxReply] = useState(''); // 用于存储chatbox的回复
    const [chosenTaskSummary, setchosenTaskSummary] = useState(''); // 用于存储task summary
    const [maxLLMtaskToDo, setMaxLLMtaskToDo] = useState(0);
    const [apiWaitingTime, setApiWaitingTime] = useState(0);
    const [ifLLMready, setIfLLMready] = useState("checking the api status..."); // READY;FAILD;WORKING
    const [selectedTabId, setSelectedTabId] = useState(null); // 存储当前右键的 Tab
    const [selectedTabUrl, setSelectedTabUrl] = useState(null); // 存储当前右键的 Tab url


    useEffect(() => {  // a hook to fetch tasks and tabs
        setMindmapTabs([]);
        chrome.runtime.sendMessage({ action: "get_tasks" }, (response) => {
            if (response && response.tasks) {
                console.log("Fetched tasks:", response.tasks);
                setTasks(response.tasks);
        }});
        console.log("app.js start checing api status");
        chrome.runtime.sendMessage({ action: "check_LLM_api" }, (response) => {
            if (response && response.apiStatus) {
                console.log("Fetched api status:", response.apiStatus);
                setIfLLMready(response.apiStatus);
            }
            else{
                console.log("Fetched api status failed");
                setIfLLMready("FAILD");
            }
        });

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
                const currentTaskId = message.currentTaskId; // 从消息中获取选中的任务 ID
                console.log("Current Task ID:", currentTaskId);
                if (currentTaskId){
                    const task = message.tasks.find((t) => t.task_id === currentTaskId);
                    console.log("APP.JS:Selected Task:", task);
                    setSelectedTaskName(task.name); // 更新选中的任务名称
                    const subtaskList = task.subtask || []; // 防止 undefined 报错
                    // console.log("Subtask List:", subtaskList);
                    setSelectedTaskSubtaskSet(subtaskList); // 更新选中的子任务列表
                }
            } else if (message.action === "update_mindmap") {
                // update mindmap tabs
                // console.log("Received updated mindmap tabs:", message.mindmapTabs);
                setMindmapTabs(message.mindmapTabs || []);
            } else if (message.action === "LLM_conversation_reply") {
                // update chat box reply
                console.log("Received chat box reply:", message.reply);
                setChatBoxReply(message.reply);
            } else if(message.action === "generate_task_summary_reply"){
                const taskToUpdate = message.taskId;
                // update task summary in front end
                console.log("Received task summary:", message.summary);
                setchosenTaskSummary(message.summary);
                // update task summary in back end
                if (chrome.runtime && chrome.runtime.sendMessage) {
                    console.log("taskToUpdate:", taskToUpdate);
                    chrome.runtime.sendMessage({ action: "update_task_summary", taskId: taskToUpdate, summary: message.summary }, (response) => {
                        if (chrome.runtime.lastError) {
                            console.error("Error updating task summary:", chrome.runtime.lastError);
                        } else {
                            console.log("Task summary updated:", response);
                        }
                    });
                }
            }
            else if(message.action === "update_API_request_count"){
                console.log("update_API_request_count: Received updated maxLLMtaskToDo:", message.count);
                setMaxLLMtaskToDo(message.count);
            }
            else if(message.action === "update_API_waiting_time"){
                console.log("update_API_waiting_time: Received updated waiting time:", message.waitingTime);
                setApiWaitingTime(message.waitingTime);
            }
            else if(message.action === "update_LLM_api_status"){
                console.log("update_LLM_api_status: Received updated api status:", message.apiStatus);
                setIfLLMready(message.apiStatus);
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
                    <Tasks tasks={tasks} setTasks={setTasks} setSelectedTaskId = {setSelectedTaskId} selectedTaskId={selectedTaskId} setMindmapTabs={setMindmapTabs} setSelectedTaskName={setSelectedTaskName} setchosenTaskSummary={setchosenTaskSummary} setSelectedTaskSubtaskSet={setSelectedTaskSubtaskSet}/>
                </aside>

                {/* 中间内容区域 */}
                <main className="main-content">

                    {/* 使用 Tabs 组件 */}
                    <button onClick={refreshTabs}>Refresh</button>
                    <Tabs tabs={tabs} setTabs={setTabs} setMindmapTabs={setMindmapTabs} selectedTaskId={selectedTaskId} selectedTabId={selectedTabId} setSelectedTabId={setSelectedTabId} selectedTabUrl={selectedTabUrl} setSelectedTabUrl={setSelectedTabUrl}/>

                    {/* task详细内容区域，因为历史原因命名为mindmap */}
                    <Mindmap mindmapTabs={mindmapTabs} setMindmapTabs={setMindmapTabs} removeTab={removeTab} selectedTaskId={selectedTaskId} selectedTaskName={selectedTaskName} chosenTaskSummary={chosenTaskSummary} selectedTabId={selectedTabId} setSelectedTabId={setSelectedTabId} selectedTabUrl={selectedTabUrl} setSelectedTabUrl={setSelectedTabUrl} selectedTaskSubtaskSet={selectedTaskSubtaskSet}/>
                </main>

                {/* 右侧问答区域 */}
                <aside className="qa-section">
                    {/* <h2>QA Chat Box</h2> */}
                    <QAchatBox chatBoxReply={chatBoxReply} setChatBoxReply={setChatBoxReply} selectedTaskId={selectedTaskId} mindmapTabs={mindmapTabs} selectedTabUrl={selectedTabUrl}/>
                    {/* Process Window */}
                    <ProcessWindow ifLLMready={ifLLMready}  maxLLMtaskToDo={maxLLMtaskToDo} apiWaitingTime={apiWaitingTime} />
                    {/* <TaskSummary />
                    <TaskSummary selectedTaskId={selectedTaskId} chosenTaskSummary={chosenTaskSummary}/> */}
                </aside>
            </div>
        </div>
    );
}

export default App;
