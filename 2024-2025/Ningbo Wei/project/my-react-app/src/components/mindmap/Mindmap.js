import React, {useState} from "react";
import styles from "./Mindmap.module.css";

const Mindmap = ({ mindmapTabs,  setMindmapTabs, removeTab, selectedTaskId, selectedTaskName, chosenTaskSummary, selectedTabId, setSelectedTabId, selectedTabUrl, setSelectedTabUrl, selectedTaskSubtaskSet}) => {

    const [contextMenu, setContextMenu] = useState(null); // 存储菜单位置

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
            tabData.subtaskId = ""; // 设置 tab 的 subtaskId 为当前选中的 taskId

            // 1. 从 `tabs` 里删除该 `tab`
            removeTab(tabData.id); 
            // 2. tell background.js that a tab is to the mindmap
            const mindmapId = "mindmap" + selectedTaskId.replace("task", ""); // 移除 "task" 前缀
            setMindmapTabs((prevTabs) => {
                const isAlreadyAdded = prevTabs.some((t) => t.id === tabData.id);
                let newTabs;
              
                if (isAlreadyAdded) {
                  // ✅ 如果已存在，更新该 tab 的 subtaskId 为 ""
                  newTabs = prevTabs.map((t) =>
                    t.id === tabData.id ? { ...t, subtaskId: "" } : t
                  );
                } else {
                  // ✅ 如果不存在，添加进去并设 subtaskId 为空
                  newTabs = [...prevTabs, { ...tabData, subtaskId: "" }];
                }
              
                // ✅ 通知后端
                if (chrome.runtime && chrome.runtime.sendMessage) {
                  chrome.runtime.sendMessage(
                    {
                      action: "move_tab_to_mindmap",
                      removedTabId: tabData.id,
                      addedMindmapId: mindmapId,
                      newMindmap: newTabs,
                    },
                    (response) => {}
                  );
                }
              
                return newTabs;
              });
              
        } catch (error) {
            console.error("Error parsing dropped tab data:", error);
        }
    };

    const handleTabDropToSubtask = (event, subtaskId) => {
        event.preventDefault();
        const data = event.dataTransfer.getData('application/json');
        
        if (!data) {
          console.warn("No tab data received during drop.");
          return;
        }
      
        try {
          const tabData = JSON.parse(data);
          tabData.subtaskId = subtaskId; // 设置 tab 的 subtaskId 为当前选中的 taskId
          if (!selectedTaskId) {
            console.warn("No task selected for the tab.");
            return;
          }
          // 1. 从 `tabs` 里删除该 `tab`
          removeTab(tabData.id); 
      
          const mindmapId = "mindmap" + selectedTaskId.replace("task", "");
          setMindmapTabs((prevTabs) => {
            const isAlreadyAdded = prevTabs.some((t) => t.id === tabData.id);
            let newTabs;
          
            if (isAlreadyAdded) {
              // ✅ 如果已存在，更新该 tab 的 subtaskId 为 ""
              newTabs = prevTabs.map((t) =>
                t.id === tabData.id ? { ...t, subtaskId: subtaskId } : t
              );
            } else {
              // ✅ 如果不存在，添加进去并设 subtaskId
              newTabs = [...prevTabs, { ...tabData, subtaskId: subtaskId }];
            }
          
            // ✅ 通知后端
            if (chrome.runtime && chrome.runtime.sendMessage) {
              chrome.runtime.sendMessage(
                {
                  action: "move_tab_to_mindmap",
                  removedTabId: tabData.id,
                  addedMindmapId: mindmapId,
                  newMindmap: newTabs,
                },
                (response) => {}
              );
            }
          
            return newTabs;
          });
        } catch (error) {
          console.error("Error parsing dropped tab data:", error);
        }
      };
      

    const handleDragStart = (event, tab) => {
        setSelectedTabId(tab.id); // 设置当前被选中的 tab
        setSelectedTabUrl(tab.currentUrl);
        setContextMenu(null); // 点击时关闭右键菜单
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
        else if (option === "Annotate") {
            chrome.runtime.sendMessage({
                action: "open_annotation_page",
                tabId: tab.id,
                title: tab.title,
                taskId: selectedTaskId,
                note: tab.note || "" // 传递已有注释（如果有）
            });
        }
        else if (option === "NONE" || option === "GREEN" || option === "BLUE" || option === "PURPLE") {
            // 设置 tab 的颜色为 NONE
            chrome.runtime.sendMessage({
                action: "change_tab_color",
                tabId: tab.id,
                taskId: selectedTaskId,
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
            subtasks: selectedTaskSubtaskSet,
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

    const renderTab = (tab) => (
        <div 
          key={tab.id}
          className={`${styles.mindmap_tab} ${selectedTabId === tab.id ? styles.selectedTab : ""}`}
          draggable
          onDragStart={(event) => handleDragStart(event, tab)}
          onContextMenu={(event) => handleContextMenu(event, tab)}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTabId(tab.id);
            setSelectedTabUrl(tab.currentUrl);
            setContextMenu(null);
          }}
        >
          <h3>
            {tab.color === "GREEN" && "🟢 "}
            {tab.color === "BLUE" && "🔵 "}
            {tab.color === "PURPLE" && "🟣 "}
            {tab.title.slice(0, 50)}
          </h3>
          <p>{tab.currentUrl.slice(0, 40)}</p>
          <p>{tab.summary ? tab.summary : "waiting..."}</p>
          <p>{"----------------"}</p>
          {tab.note?.trim() && <p><strong>note:</strong> {tab.note.slice(0, 30)}</p>}
          {contextMenu && selectedTabId === tab.id && (
            <div
              className={styles.contextMenu}
              style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
            >
              <div onClick={() => handleMenuClick("NONE", tab)}>none color ⬜</div>
              <div onClick={() => handleMenuClick("GREEN", tab)}>color green 🟢</div>
              <div onClick={() => handleMenuClick("BLUE", tab)}>color blue 🔵</div>
              <div onClick={() => handleMenuClick("PURPLE", tab)}>color purple 🟣</div>
              <div onClick={() => handleMenuClick("Open this tab in browser", tab)}>Open in browser</div>
              <div onClick={() => handleMenuClick("Delet this tab", tab)}>Delete</div>
              <div onClick={() => handleMenuClick("Annotate", tab)}>Add/Edit Note</div>
              <hr />
              <div style={{ fontStyle: "italic", color: "#555", pointerEvents: "none" }}>
                {tab.note?.trim() ? `Note: ${tab.note}` : "No note"}
              </div>
            </div>
          )}
        </div>
      );

    const openTabsInTask = () => {
        // pick all the url in mindmapTabs and open them in the browser
        const urls = mindmapTabs.map(tab => tab.currentUrl);
        chrome.runtime.sendMessage({ action: "open_tabs_in_task", urls: urls });
    }
      

    return (
        <div 
            className={styles.mindmap}
            onDragOver={(e) => {
                e.preventDefault();  // 允许放置
                e.dataTransfer.dropEffect = "move";  // 修改光标显示
            }}
            onClick={handleClickAway}
            >
            <h2>Tasks - {selectedTaskName}</h2>
            <div className={styles.titleRow}>
                
                <button onClick={openTabsInTask}>🌐 open all tabs</button>
                <button onClick={generateSummary}>📝 generate summary</button>
                <button onClick={exportTask}>📦 export current Task</button>
            </div>
            <h3>Summary : {chosenTaskSummary}</h3>
            {/* <p>{chosenTaskSummary}</p> */}
            <div className={styles.mindmap_tabs_container}>

            {/* 1. 显示main task 的 tab */}
            <div 
                className={styles.subtaskBox}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleTabDropToMindmap(e)}
            >
                <div className={styles.subtaskBoxTitle}>main task Tabs</div>
                <div className={styles.subtaskTabsContainer}>
                {mindmapTabs
                    .filter(tab => !tab.subtaskId || !selectedTaskSubtaskSet?.some(sub => sub.subTaskId === tab.subtaskId))
                    .map((tab) => renderTab(tab))}
                </div>
            </div>

            {/* 2. 按照 selectedTaskSubtaskSet 中的每个 subtask 分组显示 tab */}
            {Array.isArray(selectedTaskSubtaskSet) && selectedTaskSubtaskSet.map((subtask) => {
                const tabsInSubtask = mindmapTabs.filter(tab => tab.subtaskId === subtask.subTaskId);
                return (
                <div 
                    key={subtask.subTaskId} 
                    className={styles.subtaskBox}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleTabDropToSubtask(e, subtask.subTaskId)} 
                >
                    <div className={styles.subtaskBoxTitle}>{subtask.subTaskName}</div>
                    <div className={styles.subtaskTabsContainer}>
                    {tabsInSubtask.map((tab) => renderTab(tab))}
                    </div>
                </div>
                );
            })}

            </div>
        </div>
    );
}

export default Mindmap;