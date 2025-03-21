import React, { useEffect, useState } from "react";
import styles from "./ProcessWindow.module.css";

const ProcessWindow = ({ ifLLMready = "checking the api status...", maxLLMtaskToDo = 0, apiWaitingTime = 0}) => {

    return (
        <div className={styles.processWindow}>
            <h2>Process Window</h2>
            <p>LLM API Status: {ifLLMready}</p>
            <p>rest LLM tasks To Do: {maxLLMtaskToDo}</p>
            <p>API Waiting Time: {apiWaitingTime }</p>
        </div>
    )

};

export default ProcessWindow;







