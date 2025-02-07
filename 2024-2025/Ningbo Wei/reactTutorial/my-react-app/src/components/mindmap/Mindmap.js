import React from "react";
import styles from "./Mindmap.module.css";

const Mindmap = ({ mindmapTabs,  setMindmapTabs, removeTab }) => {

   // 处理 Tab 拖拽到 Mindmap 的逻辑
    const handleTabDropToMindmap = (event) => {
        event.preventDefault();
        const data = event.dataTransfer.getData('application/json');

        if (!data) {
            console.warn("No tab data received during drop.");
            return;
        }

        try {
            const tabData = JSON.parse(data);
            console.log("Dropped tab to Mindmap:", tabData);

            // 1. 从 `tabs` 里删除该 `tab`
            removeTab(tabData.id); 

            // 2. 添加到 `mindmapTabs`（避免重复添加）
            setMindmapTabs((prevTabs) => {
                const isAlreadyAdded = prevTabs.some((t) => t.id === tabData.id);
                const newTabs = isAlreadyAdded ? prevTabs : [...prevTabs, tabData];
                // **存储 Mindmap Tabs**
                chrome.storage.local.set({ mindmapTabs: newTabs }, () => {
                    console.log("Mindmap tabs updated in storage:", newTabs);
                });
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
            <h2>Mindmap</h2>
            {mindmapTabs.map((tab) => (
                    <div 
                        key={tab.id} 
                        className={styles.mindmap_tab}
                        draggable
                        onDragStart={(event) => handleDragStart(event, tab)}>
                <h4>{tab.title.slice(0, 50)}</h4>
                <p>{tab.currentUrl.slice(0, 70)}</p>
                </div>
            ))}
        </div>
    );
}

export default Mindmap;