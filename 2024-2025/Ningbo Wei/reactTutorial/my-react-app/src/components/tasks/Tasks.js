import React from "react";
import styles from "./Tasks.module.css";

const Tasks = ({tasks, setTasks}) => {

    
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
      

return (
    <div className={styles.tasks}>
        {tasks.map((task, index) => (
            <div key={task.task_id || index} className={styles.task}>
                <h3>{task.name}</h3>
                <button className={styles.deleteButton} onClick={() => deleteTask(task.task_id)}>
                    ❌ Delete
                </button>
            </div>
        ))}
    </div>
);


}



export default Tasks;