import React from "react";
import styles from "./Tasks.module.css";

const Tasks = ({ tasks, setTasks, setSelectedTaskId, selectedTaskId, setMindmapTabs }) => {


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
    const handleTaskClick = (taskId) => {
        // 1. 更新选中的任务
        setSelectedTaskId(taskId);
        console.log("Selected Task:", taskId);
        // 2. 更新 Mindmap Tabs
        const mindmapId = "mindmap" + taskId.replace("task", ""); // 移除 "task" 前缀
        chrome.storage.local.get([mindmapId], (result) => {
            const newTabs = result[mindmapId] || [];
            setMindmapTabs(newTabs);
            console.log("Updated mindmapTabs:", newTabs);
        });
    };

    return (
        <div className={styles.tasks}>
            {tasks.map((task, index) => (
                <div
                    key={task.task_id || index}
                    className={`${styles.task} ${selectedTaskId === task.task_id ? styles.selected : ""}`}
                    onClick={() => handleTaskClick(task.task_id)}
                >
                    <h3>{task.name}</h3>
                    <button className={styles.deleteButton} onClick={(e) => {
                        e.stopPropagation(); // 防止点击删除按钮时触发选择任务
                        deleteTask(task.task_id);
                    }}>
                        ❌ Delete
                    </button>
                </div>
            ))}
        </div>
    );


}



export default Tasks;