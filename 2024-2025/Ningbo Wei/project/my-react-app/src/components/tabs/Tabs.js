import React, {useState} from 'react';
import styles from './Tabs.module.css';

const Tabs = ({ tabs, setTabs, setMindmapTabs, selectedTaskId }) => {

    const [contextMenu, setContextMenu] = useState(null); // 存储菜单位置
    const [selectedTabId, setSelectedTabId] = useState(null); // 存储当前右键的 Tab

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

    // 右键点击时显示菜单
    const handleContextMenu = (event, tab) => {
        event.preventDefault(); // 阻止默认右键菜单
        setSelectedTabId(tab.id); // 选中当前右键的 tab
        setContextMenu({
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
        });
    };

    // 处理菜单点击事件
    const handleMenuClick = (option, tab) => {
        // if (option === "A") console.log("a");
        // if (option === "B") console.log("b");
        // if (option === "C") console.log("c");
        if (option === "Open this tab in browser") {
            chrome.runtime.sendMessage({ action: "open_tab", url: tab.currentUrl });
        }
        else if (option === "Delet this tab") {
            // remove this tab from the tabs
            setTabs((prevTabs) => prevTabs.filter((t) => t.id !== tab.id));
            chrome.runtime.sendMessage({ action: "remove_tab_from_chacheResult", removedTabId: tab.id });
        }
        console.log(`${option} clicked on tab ${tab.title}`);
        setContextMenu(null); // 隐藏菜单
    };

    // 点击空白处隐藏菜单
    const handleClickAway = () => {
        setContextMenu(null);
        setSelectedTabId(null);
    };

    const handleDragStart = (event, tab) => {
        if (!selectedTaskId){
            console.log("No task selected for the tab.");
            return;
        }
        event.dataTransfer.setData('application/json', JSON.stringify(tab));
        event.dataTransfer.effectAllowed = "move";  // 确保可以移动
    };

    const handleDrop = (event) => {
        event.preventDefault();
        if (!selectedTaskId){
            console.log("No task selected for the tab.");
            return;
        }
        const droppedTab = JSON.parse(event.dataTransfer.getData('application/json'));
        // 1. add the dropped tab to the tabs
        setTabs((prevTabs) => {
            const isAlreadyAdded = prevTabs.some((t) => t.id === droppedTab.id);
            const newTabsList = isAlreadyAdded ? prevTabs : [...prevTabs, droppedTab];
            // tell the back-end to re-fresh the "result"
            chrome.runtime.sendMessage({ action: "update_result", newTabsList: newTabsList });
            return newTabsList;
        });
        // 2. 从 Mindmap 中移除该 Tab 并更新存储
        setMindmapTabs((prevTabs) => {
            const newTabs = prevTabs.filter((t) => t.id !== droppedTab.id);

            const mindmapId = "mindmap" + selectedTaskId.replace("task", ""); // 移除 "task" 前缀
            chrome.storage.local.set({ [mindmapId]: newTabs }, () => {
                console.log("Mindmap tabs updated in storage:", newTabs);
            });
            return newTabs;
        });
        
    };

    const allowDrop = (event) => {
        event.preventDefault();
    };

    return (
        <div
            className={styles.tabs}
            onDragOver={allowDrop}
            onDrop={handleDrop}
            onClick={handleClickAway}
        >
            {tabs.map((tab, index) => (
                <div
                    key={tab.id || index}
                    className={styles.tab}
                    draggable
                    onDragStart={(event) => handleDragStart(event, tab)}
                    onContextMenu={(event) => handleContextMenu(event, tab)}
                >
                    {/* <button onClick={() => handleSummary(tab)}>Summary</button> */}
                    <h3>{tab.title.slice(0, 50)}</h3>
                    <p>{tab.currentUrl.slice(0, 60)}...</p>
                    <p>{tab.summary ? tab.summary : "waiting..."}</p>

                     {/* 右键菜单只显示在被右键点击的 tab 内 */}
                     {contextMenu && selectedTabId === tab.id &&(
                        <div
                            className={styles.contextMenu}
                            style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
                        >
                            <div onClick={() => handleMenuClick("Open this tab in browser", tab)}>Open this tab in browser</div>
                            <div onClick={() => handleMenuClick("Delet this tab", tab)}>Delet this tab</div>
                            <div onClick={() => handleMenuClick("C", tab)}>Option C</div>
                        </div>
                    )}

                </div>
            ))}
        </div>
    );
};

export default Tabs;
