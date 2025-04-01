import React, {useState} from 'react';
import styles from './Tabs.module.css';

const Tabs = ({ tabs, setTabs, setMindmapTabs, selectedTaskId, selectedTabId, setSelectedTabId, selectedTabUrl, setSelectedTabUrl}) => {

    /*
    {
    "id": 1,
    "title": "Sample Page",
    "main_text": "This is the main content of the page.",
    "outline": "",
    "currentUrl": "https://example.com",
    "embedding": [],
    "shortSummary": "",
    "longSummary": "",
    "subtaskId": "xxxxxxx",
    }
    */

    const [contextMenu, setContextMenu] = useState(null); // 存储菜单位置

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
        if (option === "Open this tab in browser") {
            chrome.runtime.sendMessage({ action: "open_tab", url: tab.currentUrl });
        }
        else if (option === "Delet this tab") {
            // remove this tab from the tabs
            setTabs((prevTabs) => prevTabs.filter((t) => t.id !== tab.id));
            chrome.runtime.sendMessage({ action: "remove_tab_from_chacheResult", removedTabId: tab.id });
        }
        else if (option === "Annotate") {
            chrome.runtime.sendMessage({
                action: "open_annotation_page",
                tabId: tab.id,
                title: tab.title,
                taskId: "",
                note: tab.note || "" // 传递已有注释（如果有）
            });
        }
        else if (option === "NONE" || option === "GREEN" || option === "BLUE" || option === "PURPLE") {
            // 设置 tab 的颜色为 NONE
            chrome.runtime.sendMessage({
                action: "change_tab_color",
                tabId: tab.id,
                taskId: "",
                color: option
            });
        }
        console.log(`${option} clicked on tab ${tab.title}`);
        setContextMenu(null); // 隐藏菜单
    };

    // 点击空白处隐藏菜单
    const handleClickAway = () => {
        setContextMenu(null);
        setSelectedTabId(null);
        setSelectedTabUrl(null);
        // setSelectedTabId(null); // 保留选中 tab
    };

    const handleDragStart = (event, tab) => {
        setSelectedTabId(tab.id); // 设置当前被选中的 tab
        setSelectedTabUrl(tab.currentUrl);
        setContextMenu(null); // 点击时关闭右键菜单
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
                    className={`${styles.tab} ${selectedTabId === tab.id ? styles.selectedTab : ""}`}
                    draggable
                    onDragStart={(event) => handleDragStart(event, tab)}
                    onContextMenu={(event) => handleContextMenu(event, tab)}
                    onClick={(e) => {
                        e.stopPropagation(); // 防止点击空白处导致 selectedTabId 被清空
                        setSelectedTabId(tab.id); // 设置当前被选中的 tab
                        setSelectedTabUrl(tab.currentUrl);
                        setContextMenu(null); // 点击时关闭右键菜单
                    }}
                >
                    {/* <button onClick={() => handleSummary(tab)}>Summary</button> */}
                    <h3>
                        {tab.color === "GREEN" && "🟢 "}
                        {tab.color === "BLUE" && "🔵 "}
                        {tab.color === "PURPLE" && "🟣 "}
                        {tab.title.slice(0, 50)}
                    </h3>
                    <p>{tab.currentUrl.slice(0, 30)}...</p>
                    <p>{tab.summary ? tab.summary : "waiting..."}</p>
                    <p>{"----------------"}</p>
                    {tab.note?.trim() && <p><strong>note:</strong> {tab.note.slice(0, 30)}</p>}

                     {/* 右键菜单只显示在被右键点击的 tab 内 */}
                     {contextMenu && selectedTabId === tab.id &&(
                        <div
                            className={styles.contextMenu}
                            style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
                        >   
                            <div onClick={() => handleMenuClick("NONE", tab)}>none color ⬜</div>
                            <div onClick={() => handleMenuClick("GREEN", tab)}>color green 🟢</div>
                            <div onClick={() => handleMenuClick("BLUE", tab)}>color blue 🔵</div>
                            <div onClick={() => handleMenuClick("PURPLE", tab)}>color green 🟣</div>
                            <div onClick={() => handleMenuClick("Open this tab in browser", tab)}>Open this tab in browser</div>
                            <div onClick={() => handleMenuClick("Delet this tab", tab)}>Delet this tab</div>
                            <div onClick={() => handleMenuClick("Annotate", tab)}>creat or modify a comment</div>
                            <hr />
                            <div style={{ fontStyle: "italic", color: "#555", pointerEvents: "none" }}>
                                {tab.note?.trim() ? `Note: ${tab.note}` : "No note for this tab"}
                            </div>
                        </div>
                    )}

                </div>
            ))}
        </div>
    );
};

export default Tabs;
