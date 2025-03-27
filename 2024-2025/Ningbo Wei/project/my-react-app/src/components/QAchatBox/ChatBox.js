import React, { useEffect, useState } from "react";
import styles from "./ChatBox.module.css";

const ChatBox = ({chatBoxReply, setChatBoxReply, selectedTaskId, mindmapTabs, selectedTabUrl}) => {
    const [inputText, setInputText] = useState("");
    const [displayedText, setDisplayedText] = useState("");
    const [selectedOption, setSelectedOption] = useState('tab');

    const chatWithLLM = (inputText) => {
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

    const chatWithLLMinURL = (inputText, url) =>{
        let pre_prompt = `
        You are an online assistant. Here is what I found through web search. Please answer the questions raised by users based on this information. The answer should be clearly and concisely in English.

        ##### Webpages content #####

        `;
        chrome.runtime.sendMessage({ action: "LLM_conversation_with_url", prompt: "User question: "+inputText, pre_prompt: pre_prompt, url:url }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Error chatting with LLM:", chrome.runtime.lastError);
            } else {
                console.log("Chat with LLM:", response);
                setChatBoxReply(response.reply);
            }
        });
    }

    const commonChat = (inputText) =>{
        let pre_prompt = `
        You are an online assistant. Here is what I found through web search. Please answer the questions clearly and concisely in English.
        `;
        chrome.runtime.sendMessage({ action: "LLM_conversation", prompt: inputText, pre_prompt: pre_prompt }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Error chatting with LLM:", chrome.runtime.lastError);
            } else {
                console.log("Chat with LLM:", response);
                setChatBoxReply(response.reply);
            }
        });
    }

    const submitQuestion = (inputText) => {
        if(!inputText.trim()) return;
        setChatBoxReply("");
        if(selectedOption === 'task' && selectedTaskId){
            chatWithLLM(inputText);
        }
        else if(selectedOption === 'tab' && selectedTabUrl){
            chatWithLLMinURL(inputText, selectedTabUrl);
        }
        else{
            commonChat(inputText);
        }
    }

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
            submitQuestion(inputText); // 发送输入内容到后台
        }}>Submit</button>

        <button onClick={() => {
            setDisplayedText("Give a birfe introduce of the city/locaiton"); // 存储输入内容到显示区域
            chatWithLLM("please generate a introduction of the city or location related to the tabs"); 
        }}>brifly introduce of the city/locaiton</button>  
        <button onClick={() => {
            setDisplayedText("please recommand some place to visit in this city"); // 存储输入内容到显示区域
            chatWithLLM("please recommand some place to visit in this city"); 
        }}>please recommand some place to visit in this city</button> 

        {/* ✅ 新增的互斥选项按钮 */}
        <div style={{ marginTop: '20px' }}>
                <button 
                    style={{ backgroundColor: selectedOption === 'tab' ? '#339af0' : '#ccc' }}
                    onClick={() => setSelectedOption('tab')}
                >answer with tab</button>
                <button 
                    style={{ backgroundColor: selectedOption === 'task' ? '#339af0' : '#ccc' }}
                    onClick={() => setSelectedOption('task')}
                >answer with task</button>
            </div>
    </div>
    );
};


export default ChatBox;


