import React, {useState} from "react";
import styles from "./Mindmap.module.css";

const Mindmap = ({ mindmapTabs,  setMindmapTabs, removeTab, selectedTaskId, selectedTaskName, chosenTaskSummary}) => {

    const [contextMenu, setContextMenu] = useState(null); // 存储菜单位置
    const [selectedTabId, setSelectedTabId] = useState(null); // 存储当前右键的 Tab

   // 处理 Tab 拖拽到 Mindmap 的逻辑
    const handleTabDropToMindmap = (event) => {
        event.preventDefault();
        const data = event.dataTransfer.getData('application/json');

        if (!data) {
            console.warn("No tab data received during drop.");
            return;
        }
        if(!selectedTaskId) {
            console.warn("No task selected for the tab.");
            return;
        }
        try {
            const tabData = JSON.parse(data);
            console.log("Dropped tab to Mindmap:", tabData);

            // 1. 从 `tabs` 里删除该 `tab`
            removeTab(tabData.id); 
            // 2. tell background.js that a tab is to the mindmap
            const mindmapId = "mindmap" + selectedTaskId.replace("task", ""); // 移除 "task" 前缀
            setMindmapTabs((prevTabs) => {  // 注意这个setMindmapTabs是异步的，故把move_tab_to_mindmap放在里面
                const isAlreadyAdded = prevTabs.some((t) => t.id === tabData.id);
                const newTabs = isAlreadyAdded ? prevTabs : [...prevTabs, tabData];
                if (chrome.runtime && chrome.runtime.sendMessage) {
                    chrome.runtime.sendMessage({ action: "move_tab_to_mindmap", removedTabId: tabData.id, addedMindmapId: mindmapId, newMindmap: newTabs }, (response) => {
                        if (chrome.runtime.lastError) {
                            console.error("Error moving tab to mindmap:", chrome.runtime.lastError);
                        } else {
                            console.log("Tab moved to mindmap:", response);
                        }
                    });
                }
                return newTabs;
            });
        } catch (error) {
            console.error("Error parsing dropped tab data:", error);
        }
    };

    const handleDragStart = (event, tab) => {
        console.log("Drag start:", tab);
        event.dataTransfer.setData('application/json', JSON.stringify(tab));
        event.dataTransfer.effectAllowed = "move";  // 确保可以移动
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
            // remove this tab from the current mindmap
            setMindmapTabs((prevTabs) => prevTabs.filter((t) => t.id !== tab.id));
            const newMindeMapTabs = mindmapTabs.filter((t) => t.id !== tab.id);
            // tell background.js to remove this tab from the mindmap
            const mindmapId = "mindmap" + selectedTaskId.replace("task", ""); // 移除 "task" 前缀
            if (chrome.runtime && chrome.runtime.sendMessage) {
                chrome.runtime.sendMessage({ action: "remove_tab_from_mindmap", removedTabId: tab.id, mindmapId: mindmapId, newMindmap: newMindeMapTabs }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error removing tab from mindmap:", chrome.runtime.lastError);
                    } else {
                        console.log("Tab removed from mindmap:", response);
                    }
                });
            }
        }
        console.log(`${option} clicked on tab ${tab.title}`);
        setContextMenu(null); // 隐藏菜单
    };

    // 点击空白处隐藏菜单
    const handleClickAway = () => {
        setContextMenu(null);
        setSelectedTabId(null);
    };

    const generateSummary = () => {
        if(selectedTaskId){
            console.log("generate summary for task:", selectedTaskId);
            if (chrome.runtime && chrome.runtime.sendMessage) {
                const beginPrompt = `
                Please generate a summary for a task.
                This task consists of a serise of webpages.
                You will be given a list of summarise of those webpages, please analyise these information and return a summary of less than 100 words.

                ##### Webpages #####
                
                `;
                chrome.runtime.sendMessage({ action: "generate_task_summary", taskId: selectedTaskId, beginPrompt: beginPrompt}, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error generating summary:", chrome.runtime.lastError);
                    } else {
                        console.log("Summary generated:", response);
                        setSummary(response.summary);
                    }
                });
            }
        }
    }

    const exportTask = () =>{
        const data = { 
            taskName: selectedTaskName,
            taskSummary: chosenTaskSummary,
            taskTabs: mindmapTabs
        };
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = selectedTaskName + ".json";
        a.click();
        URL.revokeObjectURL(url);
        console.log("successfully export");
    }

    return (
        <div 
            className={styles.mindmap}
            onDragOver={(e) => {
                e.preventDefault();  // 允许放置
                e.dataTransfer.dropEffect = "move";  // 修改光标显示
            }}
            onDrop={handleTabDropToMindmap}
            onClick={handleClickAway}
            >
            <h2>Tasks - {selectedTaskName}</h2>
            <button onClick={generateSummary}>generate task summary</button>
            <button onClick={exportTask}>export current Task</button>
            <h3>Summary : {chosenTaskSummary}</h3>
            {/* <p>{chosenTaskSummary}</p> */}
            <div 
                className={styles.mindmap_tabs_container}  
                style={{ maxHeight: "400px", overflowY: "auto" }}
            >
                {mindmapTabs.map((tab) => (
                    <div 
                        key={tab.id} 
                        className={styles.mindmap_tab}
                        draggable
                        onDragStart={(event) => handleDragStart(event, tab)}
                        onContextMenu={(event) => handleContextMenu(event, tab)}
                    >
                        <h3>{tab.title.slice(0, 50)}</h3>
                        <p>{tab.currentUrl.slice(0, 40)}</p>
                        <p>{tab.summary ? tab.summary : "waiting..."}</p>
                        <p>{"----------------"}</p>
                        {tab.note?.trim() && <p><strong>note:</strong> {tab.note.slice(0, 30)}</p>}
                        {/* 右键菜单只显示在被右键点击的 tab 内 */}
                        {contextMenu && selectedTabId === tab.id &&(
                            <div
                                className={styles.contextMenu}
                                style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
                            >
                                <div onClick={() => handleMenuClick("Open this tab in browser", tab)}>Open this tab in browser</div>
                                <div onClick={() => handleMenuClick("Delet this tab", tab)}>Delet this tab</div>
                                <hr />
                                <div style={{ fontStyle: "italic", color: "#555", pointerEvents: "none" }}>
                                    {tab.note?.trim() ? `Note: ${tab.note}` : "No note for this tab"}
                                </div>
                            </div>
                        )}

                    </div>
                    
                ))}
            </div>
        </div>
    );
}

export default Mindmap;