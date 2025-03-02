import React, { useEffect, useState } from "react";
import styles from "./TaskSummary.module.css";

const TaskSummary = ({ task, setTasks }) => {
    const [summary, setSummary] = useState(task.summary || "");
    const [editing, setEditing] = useState(false);

    const handleSummaryChange = (e) => {
        setSummary(e.target.value);
    };

    const handleSave = () => {
        setEditing(false);
        if (chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({ action: "update_summary", taskId: task.task_id, summary: summary }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Error updating summary:", chrome.runtime.lastError);
                } else {
                    console.log("Summary updated:", response);
                }
            });
        }
    };

    return (
        <div className={styles["task-summary"]}>
            <h2>Summary of Task</h2>
            <textarea
                value={summary}
                onChange={handleSummaryChange}
                readOnly={!editing}
            />
            <button onClick={() => setEditing(true)}>Edit</button>
            <button onClick={handleSave}>Save</button>
        </div>
    );
}