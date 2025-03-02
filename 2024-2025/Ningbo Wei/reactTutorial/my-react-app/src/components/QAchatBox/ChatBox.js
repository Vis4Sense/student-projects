import React, { useEffect, useState } from "react";
import styles from "./ChatBox.module.css";

const ChatBox = ({}) => {
    const [inputText, setInputText] = useState("");
    const [displayedText, setDisplayedText] = useState("");

    return (
        <div className={styles["chat-box"]}>
            <h2>QA chat box</h2>
            <p>Input your question here:</p>
            <p>{displayedText}</p>
        <input 
            type="text" 
            placeholder="Enter text..." 
            value={inputText} 
            onChange={(e) => setInputText(e.target.value)}
        />
        <button onClick={() => {
            console.log(inputText);
            setDisplayedText(inputText); // 存储输入内容到显示区域
        }}>Submit</button>
    </div>
    );
};



