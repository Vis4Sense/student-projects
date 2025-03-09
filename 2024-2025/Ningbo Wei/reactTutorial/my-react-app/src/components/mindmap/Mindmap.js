import React from "react";
import styles from "./Mindmap.module.css";

const Mindmap = ({ mindmapTabs,  setMindmapTabs, removeTab, selectedTaskId, selectedTaskName, chosenTaskSummary}) => {

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
            // 2. tell background.js that a tab is removed from the mindmap
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

    return (
        <div 
            className={styles.mindmap}
            onDragOver={(e) => {
                e.preventDefault();  // 允许放置
                e.dataTransfer.dropEffect = "move";  // 修改光标显示
            }}
            onDrop={handleTabDropToMindmap}
            >
            <h2>Tasks - {selectedTaskName}</h2>
            <h3>Summary - {chosenTaskSummary}</h3>
            <div className={styles.mindmap_tabs_container}>
                {mindmapTabs.map((tab) => (
                    <div 
                        key={tab.id} 
                        className={styles.mindmap_tab}
                        draggable
                        onDragStart={(event) => handleDragStart(event, tab)}>
                        <h3>{tab.title.slice(0, 50)}</h3>
                        <p>{tab.currentUrl.slice(0, 70)}</p>
                        <p>{tab.summary ? tab.summary : "waiting..."}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Mindmap;