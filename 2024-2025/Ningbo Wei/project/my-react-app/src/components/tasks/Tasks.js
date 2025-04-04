import React, { useEffect, useState } from "react";
import styles from "./Tasks.module.css";

const Tasks = ({ tasks, setTasks, setSelectedTaskId, selectedTaskId, setMindmapTabs, setSelectedTaskName, setchosenTaskSummary,setSelectedTaskSubtaskSet }) => {

    /*
    A task contain following component:
    {
        task_id: "task" + abcd,
        name: "xxxxx",
        MindmapId: "mindmap" + abcd, 
        summary: "xasfsva",
        createTime: Date(),
        subtask: [
            {
                subTaskId: "subtask" + abcd,
                subTaskName: "xxxxx"
            }
        ]
    }
    */ 
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [newTaskPrompt, setnewTaskPrompt] = useState("");  // New state for input
    const [menuOpenTaskId, setMenuOpenTaskId] = useState(null);
    const [editingSubTask, setEditingSubTask] = useState(null); // { taskId, subTaskId }
    const [editedSubTaskTitle, setEditedSubTaskTitle] = useState("");


    useEffect(() => {
        const handleClickOutside = () => setMenuOpenTaskId(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);
    
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
        // 获得task下对应的subtask列表
        const task = tasks.find((t) => t.task_id === taskId);
        const subtaskList = task.subtask || []; // 防止 undefined 报错
        // console.log("Subtask List:", subtaskList);
        setSelectedTaskSubtaskSet(subtaskList); // 更新选中的子任务列表
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

    const addSubTask = (taskId) => {
        // // check if task have already have more than 3 sub tasks
        // const task = tasks.find((t) => t.task_id === taskId);
        // const subtaskList = task.subtask || []; // 防止 undefined 报错
        // if (subtaskList.length >= 3) return;
        chrome.runtime.sendMessage({ action: "add_sub_task", taskId: taskId }, (response) => {
            console.log("Sent add sub task request to background.js", response);
        })
    };


    const getMenuOptions = (task) => [
        {
            label: "Delete",
            onClick: () => {
                deleteTask(task.task_id);
                setMenuOpenTaskId(null);
            }
        },
        {
            label: "Rename",
            onClick: () => {
                setEditingTaskId(task.task_id);
                setEditedTitle(task.name);
                setMenuOpenTaskId(null);
            }
        },
        {
            label: "add sub task",
            onClick: () => {
                addSubTask(task.task_id);
                setMenuOpenTaskId(null);
            }
        },
        // 可以继续添加更多按钮，比如导出、分享等
    ];
    

    const importTask = () => {
        // import a new task
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
    
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) return;
    
            const reader = new FileReader();
    
            reader.onload = (e) => {
                try {
                    const content = e.target.result;
                    const parsedData = JSON.parse(content);
                    const task_name = parsedData.taskName;
                    const task_summary = parsedData.taskSummary;
                    const mindmap_tabs = parsedData.taskTabs;
                    const task_subtasks = parsedData.subtasks;
                    console.log("✅ 导入成功，文件内容如下：", parsedData);
                    chrome.runtime.sendMessage({
                        action: "import_task",
                        task_name: task_name,
                        task_summary: task_summary,
                        mindmap_tabs: mindmap_tabs,
                        task_subtasks: task_subtasks
                    });
                } catch (error) {
                    console.error("❌ 解析 JSON 失败：", error);
                    alert("文件格式不正确，请上传有效的 JSON 文件。");
                }
            };
    
            reader.readAsText(file);
        };
    
        input.click(); // 触发文件选择
    };

    const deleteSubTask = (taskId, subTaskId) => {
        if (chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage(
                {
                    action: "delete_sub_task",
                    taskId: taskId,
                    subTaskId: subTaskId
                },
                (response) => {}
            );
        }
    };

    const handleSubTaskRenameSubmit = (taskId, subTaskId) => {
        setSelectedTaskId(taskId); // 更新选中的任务
        setSelectedTaskName(editedSubTaskTitle); // 更新选中的任务名称
        if (!editedSubTaskTitle.trim()) return;
        if (chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({
                action: "rename_sub_task",
                taskId: taskId,
                subTaskId: subTaskId,
                name: editedSubTaskTitle
            }, (response) => {
                // const task = tasks.find((t) => t.task_id === taskId);
                // const subtaskList = task.subtask || []; // 防止 undefined 报错
                // // console.log("Subtask List:", subtaskList);
                // setSelectedTaskSubtaskSet(subtaskList); // 更新选中的子任务列表
            });
        }
        setEditingSubTask(null);
    };
    
    
    

    return (
        <div className={styles.tasks}>
            {/* New Input and Button */}
            <button onClick={importTask}>📥 import a task</button>
            <div className={styles["task-input-row"]}>
                <input
                    type="text"
                    value={newTaskPrompt}
                    onChange={(e) => setnewTaskPrompt(e.target.value)}
                    placeholder="Enter keyword for new task"
                    className={styles.taskInputBox}
                />
                <button className={styles["task-button"]} onClick={personaliseGenerateTasks}>⚙️ Create</button>
            </div>
            <div className={styles["task-buttons"]}>
                <button className={styles["task-button"]} onClick={createNewTask}>✳️ New Blank Task</button>
                <button className={styles["task-button"]} onClick={autoGenerateTasks}>🤖 Automatically Generate Tasks</button>
            </div>
            {tasks.map((task, index) => (
                <div
                    key={task.task_id || index}
                    className={`${styles.task} ${styles.taskContainer} ${selectedTaskId === task.task_id ? styles.selected : ""}`}
                    onClick={() => handleTaskClick(task.task_id, task.name)}
                >
                    <button
                        className={styles.menuButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpenTaskId((prev) => (prev === task.task_id ? null : task.task_id));
                        }}
                    >
                        ⋯
                    </button>

                    {menuOpenTaskId === task.task_id && (
                        <div className={styles.dropdownMenu} onClick={(e) => e.stopPropagation()}>
                            {getMenuOptions(task).map((option, i) => (
                                <button key={i} className={styles.dropdownItem} onClick={option.onClick}>
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}

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

                    {/* 显示 subtasks */}
                    {selectedTaskId === task.task_id && Array.isArray(task.subtask) && task.subtask.length > 0 && (
                        <div className={styles.subTaskContainer}>
                            {task.subtask.map((thisSubTask, subIndex) => (
                                <div key={thisSubTask} className={styles.subTask}>
                                    {editingSubTask && editingSubTask.taskId === task.task_id && editingSubTask.subTaskId === thisSubTask.subTaskId ? (
                                        <input
                                            type="text"
                                            value={editedSubTaskTitle}
                                            onChange={(e) => setEditedSubTaskTitle(e.target.value)}
                                            onBlur={() => handleSubTaskRenameSubmit(task.task_id, thisSubTask.subTaskId)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleSubTaskRenameSubmit(task.task_id, thisSubTask.subTaskId);
                                                }
                                            }}
                                            autoFocus
                                            className={styles.taskInput}
                                        />
                                    ) : (
                                        <span
                                            onDoubleClick={(e) => {
                                                e.stopPropagation();
                                                setEditingSubTask({ taskId: task.task_id, subTaskId: thisSubTask.subTaskId });
                                                setEditedSubTaskTitle(thisSubTask.subTaskName);
                                            }}
                                        >
                                            {thisSubTask.subTaskName}
                                        </span>
                                    )}

                                    <button
                                        className={styles.subTaskDeleteButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteSubTask(task.task_id, thisSubTask.subTaskId);
                                        }}
                                    >
                                        ❌
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}


        </div>
    );


}



export default Tasks;