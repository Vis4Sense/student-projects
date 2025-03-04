import React, { useEffect, useState } from "react";
import styles from "./ChatBox.module.css";

const ChatBox = ({chatBoxReply, setChatBoxReply}) => {
    const [inputText, setInputText] = useState("");
    const [displayedText, setDisplayedText] = useState("");

    const chatWithLLM = (inputText) => {
        if(!inputText.trim()) return;
        console.log("chat with LLM:", inputText);
        setChatBoxReply(""); // 清空回复
        if(chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({ action: "LLM_conversation", prompt: inputText }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Error chatting with LLM:", chrome.runtime.lastError);
                } else {
                    console.log("Chat with LLM:", response);
                }
            });
        }
    };


    return (
        <div className={styles["chat-box"]}>
            <h2>QA chat box</h2>
            <p>Input your question here:</p>
            <p>{displayedText}</p>
        <textarea
            value={chatBoxReply}
            readOnly    
        />
        <input 
            type="text" 
            placeholder="Enter text..." 
            onChange={(e) => setInputText(e.target.value)}
        />
        <button onClick={() => {
            console.log(inputText);
            setDisplayedText(inputText); // 存储输入内容到显示区域
            chatWithLLM(inputText); // 发送输入内容到后台
        }}>Submit</button>

        <button onClick={() => {
            // console.log(inputText);
            // setDisplayedText(inputText); // 存储输入内容到显示区域
            // chatWithLLM(inputText); // 发送输入内容到后台
        }}>Find the best Hotel</button>  
        <button onClick={() => {
            // console.log(inputText);
            // setDisplayedText(inputText); // 存储输入内容到显示区域
            // chatWithLLM(inputText); // 发送输入内容到后台
        }}>please help me make an breif tourist plant</button> 

    </div>
    );
};


export default ChatBox;


