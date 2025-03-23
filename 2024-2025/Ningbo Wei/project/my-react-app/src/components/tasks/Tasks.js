import React, { useEffect, useState } from "react";
import styles from "./Tasks.module.css";

const Tasks = ({ tasks, setTasks, setSelectedTaskId, selectedTaskId, setMindmapTabs, setSelectedTaskName, setchosenTaskSummary }) => {

    /*
    A task contain following component:
    {
        task_id: "task" + abcd,
        name: "xxxxx",
        MindmapId: "mindmap" + abcd, 
        summary: "xasfsva",
        createTime: Date()
    }
    */ 
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [newTaskPrompt, setnewTaskPrompt] = useState("");  // New state for input

    const handleDoubleClick = (taskId, currentTitle) => {
        setEditingTaskId(taskId);
        setEditedTitle(currentTitle);
    };

    const handleTitleChange = (e) => {
        setEditedTitle(e.target.value);
    };

    const handleBlurOrEnter = (taskId) => {
        if (!editedTitle.trim()) return; // 避免空标题
        // 立即在前端更新任务名称
        setTasks((prevTasks) => 
            prevTasks.map((task) => task.task_id === taskId ? { ...task, name: editedTitle } : task)
        );
        setSelectedTaskName(editedTitle);
        if(chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({ action: "change_task_name", taskId: taskId, taskName: editedTitle }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Error editing task:", chrome.runtime.lastError);
                } else {
                    console.log("Task edited:", response);
                }
            });
        }
        setEditingTaskId(null); // 退出编辑模式
    };

    const handleKeyDown = (e, taskId) => {
        if (e.key === "Enter") {
            handleBlurOrEnter(taskId);
        }
    };

    const deleteTask = (taskId) => {
        // 1. remove the task from the tasks
        setTasks((prevTasks) => prevTasks.filter((t) => t.task_id !== taskId));
        // 3. send the updated tasks to the back-end, including remove the task from the storage
        if (chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({ action: "delete_task", taskId: taskId }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Error deleting task:", chrome.runtime.lastError);
                } else {
                    console.log("Task deleted:", response);
                }
            });
        }
    };

    // 处理任务选择
    const handleTaskClick = (taskId, taskName) => {
        // 1. 更新选中的任务
        setSelectedTaskId(taskId);
        setSelectedTaskName(taskName);
    };

    // 监听 selectedTaskId 变化，在更新后执行后续操作
    useEffect(() => {
        if (!selectedTaskId) return; // 避免初始状态执行
        console.log("Selected Task Updated:", selectedTaskId);

        // 2. 更新 Mindmap Tabs
        const mindmapId = "mindmap" + selectedTaskId.replace("task", ""); // 移除 "task" 前缀
        chrome.storage.local.get([mindmapId], (result) => {
            const newTabs = result[mindmapId] || [];
            setMindmapTabs(newTabs);
            console.log("Updated mindmapTabs:", newTabs);
        });

        // 3. 更新 Task Summary
        console.log("Requesting task summary for:", selectedTaskId);
        chrome.runtime.sendMessage({ action: "get_task_summary_from_storage", taskId: selectedTaskId }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Error getting task summary:", chrome.runtime.lastError);
            } else {
                console.log("Task Summary:", response);
                setchosenTaskSummary(response);
            }
        });

    }, [selectedTaskId]); // 当 selectedTaskId 发生变化时执行

    const createNewTask = () => {
        if (chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({ action: "create_new_task" }, (response) => {
                console.log("Sent create new task request to background.js");
            });
        }
    };

    const autoGenerateTasks = () => {
        if (chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({ action: "auto_Generate_tasks" }, (response) => {
                console.log("Sent tab grouping request to background.js");
            });
        }
    };

    const personaliseGenerateTasks = () => {
        if (!newTaskPrompt.trim()) return;
        console.log("New task key word input:", newTaskPrompt);
        if (chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({ action: "personlise_Generate_tasks_embedding", taskKeyWord: newTaskPrompt }, (response) => {
                console.log("Sent tab grouping request with key word to background.js");
            });
        }
        setnewTaskPrompt(""); // Clear input after adding
    };

    return (
        <div className={styles.tasks}>
            {/* New Input and Button */}
            <div className={styles["task-input-row"]}>
                <input
                    type="text"
                    value={newTaskPrompt}
                    onChange={(e) => setnewTaskPrompt(e.target.value)}
                    placeholder="Enter keyword for new task"
                    className={styles.taskInputBox}
                />
                <button className={styles["task-button"]} onClick={personaliseGenerateTasks}>Create</button>
            </div>
            <div className={styles["task-buttons"]}>
                <button className={styles["task-button"]} onClick={createNewTask}>New Blank Task</button>
                <button className={styles["task-button"]} onClick={autoGenerateTasks}>Automatically Generate Tasks</button>
            </div>
            {tasks.map((task, index) => (
                <div
                    key={task.task_id || index}
                    className={`${styles.task} ${selectedTaskId === task.task_id ? styles.selected : ""}`}
                    onClick={() => handleTaskClick(task.task_id, task.name)}
                >
                    {editingTaskId === task.task_id ? (
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={handleTitleChange}
                            onBlur={() => handleBlurOrEnter(task.task_id)}
                            onKeyDown={(e) => handleKeyDown(e, task.task_id)}
                            autoFocus
                            className={styles.taskInput}
                        />
                    ) : (
                        <>
                            <h3 onDoubleClick={() => handleDoubleClick(task.task_id, task.name)}>
                                {task.name}
                            </h3>
                            <p>create time : {new Date(task.createTime).toLocaleString()} </p>
                        </>
                    )}
                    <button
                        className={styles.deleteButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            setTasks((prevTasks) => prevTasks.filter((t) => t.task_id !== task.task_id));
                            chrome.runtime.sendMessage({ action: "delete_task", taskId: task.task_id });
                        }}
                    >
                        ❌ Delete
                    </button>
                </div>
            ))}
        </div>
    );


}



export default Tasks;