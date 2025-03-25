import React, { useEffect, useState } from "react";
import styles from "./ChatBox.module.css";

const ChatBox = ({chatBoxReply, setChatBoxReply, selectedTaskId, mindmapTabs}) => {
    const [inputText, setInputText] = useState("");
    const [displayedText, setDisplayedText] = useState("");

    const chatWithLLM = (inputText) => {
        if(!inputText.trim()) return;
        console.log("chat with LLM:", inputText);
        setChatBoxReply(""); // 清空回复
        let allTabsSummary = " "
        if(selectedTaskId){
            const summaries = getSummaryFromTabsInMindmaps();
            allTabsSummary = JSON.stringify(summaries, null, 4);
        }
        let pre_prompt = `
        You are a good assistant in helping user solve problem or explaining concept. User have opened serveral webpages. You will be given a list of summarise of those webpages. Please answer user's question based on these information.

        ##### Webpages #####
        ${allTabsSummary}
        `;
        if(chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({ action: "LLM_conversation", prompt: inputText, pre_prompt: pre_prompt }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Error chatting with LLM:", chrome.runtime.lastError);
                } else {
                    console.log("Chat with LLM:", response);
                    setChatBoxReply(response.reply);
                }
            });
        }
    };

    function getSummaryFromTabsInMindmaps(){
        // 从所有的 mindmapTabs 中获取所有的 summary
        let allTabs = [];
        mindmapTabs.forEach((tab) => {
            allTabs.push({url:tab.currentUrl.slice(0,40), summary:tab.summary});
        });
        return allTabs;
    }


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
            setDisplayedText("Give a birfe introduce of the city/locaiton"); // 存储输入内容到显示区域
            chatWithLLM("please generate a introduction of the city or location related to the tabs"); 
        }}>brifly introduce of the city/locaiton</button>  
        <button onClick={() => {
            setDisplayedText("please recommand some place to visit in this city"); // 存储输入内容到显示区域
            chatWithLLM("please recommand some place to visit in this city"); 
        }}>please recommand some place to visit in this city</button> 

    </div>
    );
};


export default ChatBox;


