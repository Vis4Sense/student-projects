import React, { useEffect, useState } from "react";
import styles from "./TaskSummary.module.css";

const TaskSummary = ({selectedTaskId, chosenTaskSummary}) => {
    const [editing, setEditing] = useState(false);

    const handleSummaryChange = (e) => {
        // setSummary(e.target.value);
    };

    const handleSave = () => {
        // setEditing(false);
        // if (chrome.runtime && chrome.runtime.sendMessage) {
        //     chrome.runtime.sendMessage({ action: "update_summary", taskId: task.task_id, summary: summary }, (response) => {
        //         if (chrome.runtime.lastError) {
        //             console.error("Error updating summary:", chrome.runtime.lastError);
        //         } else {
        //             console.log("Summary updated:", response);
        //         }
        //     });
        // }
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

    return (
        <div className={styles["task-summary"]}>
            <h2>Summary of Task</h2>
            <textarea
                value={chosenTaskSummary}
                readOnly={!editing}
            />
            <button onClick={generateSummary}>generate task summary</button>
        </div>
    );
}

export default TaskSummary;