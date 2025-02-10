import React, { useEffect, useState } from "react";
import styles from "./Tasks.module.css";

const Tasks = ({ tasks, setTasks, setSelectedTaskId, selectedTaskId, setMindmapTabs }) => {
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");

    const handleDoubleClick = (taskId, currentTitle) => {
        setEditingTaskId(taskId);
        setEditedTitle(currentTitle);
    };

    const handleTitleChange = (e) => {
        setEditedTitle(e.target.value);
    };

    const handleBlurOrEnter = (taskId) => {
        if (!editedTitle.trim()) return; // 避免空标题
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.task_id === taskId ? { ...task, name: editedTitle } : task
            )
        );

        // 更新到 Chrome Storage
        chrome.storage.local.get(["taskList"], (result) => {
            const updatedTasks = (result.taskList || []).map((task) =>
                task.task_id === taskId ? { ...task, name: editedTitle } : task
            );
            chrome.storage.local.set({ taskList: updatedTasks });
        });

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
                        <h3 onDoubleClick={() => handleDoubleClick(task.task_id, task.name)}>
                            {task.name}
                        </h3>
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