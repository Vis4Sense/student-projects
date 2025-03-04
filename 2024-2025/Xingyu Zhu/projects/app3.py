import gradio as gr
import pandas as pd
import os
from backend import query_pipeline

import json
import requests
import random
from pydantic import BaseModel  # 确保正确导入
from typing import Optional, List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from langchain.prompts import PromptTemplate
from langchain.llms.base import LLM
from langchain.chains import LLMChain

# Information after mapping
extracted_info_storage = {}  # Key: search_term, Value: extracted_info
stored_search_terms = set()  
data_extract = None  # Used to store temporary tables

# 侧边栏状态变量
sidebar_visible = False

# 用于存储选中的记录
selected_record = None  

#使用ollama和llama进行交流的function
class OllamaLLM(LLM, BaseModel):
    @property
    def _llm_type(self) -> str:
        return "ollama"
    
    def _call(self, prompt: str, stop: Optional[List[str]] = None) -> str:
        return self.invoke(prompt)

    def invoke(self, prompt: str, stop: Optional[List[str]] = None) -> str:
        response = get_completion(prompt=prompt)
        if response is None:
            raise ValueError("Failed to get a valid response from LLaMA server.")
        return response

llm = OllamaLLM(model_name="llama32")

# prompt的格式 此时直接将input作为prompt就可以了
prompt = PromptTemplate(
    input_variables=["input"],
    template=(
        "{input}"
        )
    )

# Read Excel
def display_xlsx(file, sheet_name):
    if file is None:
        return None
    df = pd.read_excel(file.name, sheet_name=sheet_name)
    return df

# Select cell
def select_cell(evt: gr.SelectData):
    return evt.value  

def wrap_as_list(value):
    return [value] if isinstance(value, str) else value

# Generate temporary table
def generate_temp_excel():
    global data_extract

    # No data
    if not extracted_info_storage:
        return None 

    # Make all extracted_info to DataFrame
    all_data = []
    for info in extracted_info_storage.values():
        base_info = {
            "Informal Name": info["informal_name"],
            "Reply": info["reply"]
        }
        if info["CONCEPT"]:
            for concept in info["CONCEPT"]:
                row = {**base_info, **concept}
                all_data.append(row)
        else:
            all_data.append(base_info)

    df = pd.DataFrame(all_data)
    data_extract = df  # store
    return df

# Process the extracted information and store it
# 存储并输出表格
def display_extracted_info(extracted_info):
    global extracted_info_storage, stored_search_terms

    search_term = extracted_info.get("search_term", "").strip()

    # Avoid duplication
    if search_term and search_term not in stored_search_terms:
        extracted_info_storage[search_term] = extracted_info 
        stored_search_terms.add(search_term) 

    # 这里直接产生列表，并输出列表
    output = generate_temp_excel()

    return output

# Svae function
def save_excel():
    global data_extract

    if data_extract is None:
        return None  

    file_path = "extracted_data.xlsx"
    data_extract.to_excel(file_path, index=False)  
    return file_path 

def get_completion(prompt, model="llama3.2", url="http://localhost:11434/api/generate", temperature=0, max_tokens=100000, timeout=10):
    headers = {
        "Content-Type": "application/json"
    }
    
    # 确保 prompt 是字符串
    if not isinstance(prompt, str):
        prompt = str(prompt)  # 或者 prompt.to_string()（如果这个方法可用）

    payload = {
        "model": model,
        "prompt": prompt,
        "temperature": temperature,
        "max_tokens": max_tokens
    }

    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload), timeout=timeout)
        response.raise_for_status() 

        raw_content = response.text.splitlines()
        generated_text = ""
        for line in raw_content:
            try:
                json_line = json.loads(line)
                if "response" in json_line:
                    generated_text += json_line["response"]
                if json_line.get("done", False):
                    break  
            except json.JSONDecodeError:
                print(f"Skipping invalid JSON line: {line}")
                continue

        return generated_text.strip()

    except requests.exceptions.RequestException as e:
        print(f"Error communicating with the LLaMA server: {e}")
        return None

def toggle_sidebar():
    """切换侧边栏的可见性"""
    global sidebar_visible
    sidebar_visible = not sidebar_visible
    return gr.update(visible=sidebar_visible)


def select_record(evt: gr.SelectData):
    global selected_record
    selected_record = evt.value  # 选中行的数据

    #print("Selected Record:", selected_record)  # 调试信息

    if not selected_record:  # 检查是否选中了记录
        print("No record selected!")
        return gr.update(visible=False), gr.update(visible=False)

    return gr.update(visible=False), gr.update(visible=True), str(selected_record), gr.update(visible=True)

#回到main
def go_back_to_main():
    return gr.update(visible=True), gr.update(visible=False), gr.update(visible=False) # 显示主页面，隐藏详情页面


# Gradio UI 构建
with gr.Blocks(css="""
/* 侧边栏样式 */
#sidebar {
    transition: transform 0.3s ease;
    position: fixed;
    top: 0;
    left: 0;
    width: 250px;
    background-color: #ffffff;
    height: 100vh;
    padding: 20px;
    box-shadow: 4px 0 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    transform: translateX(-100%);
}

/* 当侧边栏可见时，将其移回原位 */
#sidebar.visible {
    transform: translateX(0);
}

/* 圆形按钮样式 */
#open_button {
    position: fixed;
    top: 20px;
    left: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #007bff;
    color: white;
    font-size: 24px;
    border: none;
    cursor: pointer;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s ease, transform 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

#open_button:hover {
    background-color: #0056b3;
    transform: scale(1.1);
}

/* 关闭按钮样式 */
#close_button {
    margin-top: auto;  /* 将按钮放在最下面 */
    width: 100%;
    padding: 10px;
    background-color: #ff4d4d;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 1s ease;
}

#close_button:hover {
    background-color: #cc0000;
}
""") as demo:

    gr.Markdown("## **Mapping Suggestion Interface**")
    main_page = gr.Column(visible=True)
    detail_page = gr.Column(visible=False)

    detail_Infor = gr.Textbox(label="Selected Record", visible=False, interactive=False)

    with main_page:
        # 侧边栏
        with gr.Column(scale=1, elem_id="sidebar", visible=False, elem_classes="visible") as sidebar:
            gr.Markdown("### Action History")
            # 其他内容可以放在这里
            gr.Markdown("Some content here...")
            gr.Markdown("More content here...")
            close_button = gr.Button("Close Sidebar", elem_id="close_button")
    
        # 圆形打开按钮
        open_button = gr.Button("☰", elem_id="open_button")

        # 绑定按钮事件
        open_button.click(
            fn=toggle_sidebar,
            outputs=[sidebar]
        )
        close_button.click(
            fn=toggle_sidebar,
            outputs=[sidebar]
        )

        # Upper Section: Search Input + Filters
        with gr.Row():
            with gr.Column():
                gr.Markdown("### **Search Input**")
                text_input = gr.Textbox(label="Enter search term", placeholder="Type your query here...")
                mapping_button = gr.Button("Find Mapping", visible=False)
    
            with gr.Column():
                gr.Markdown("### **Filters**")
                filter_class = gr.Textbox(label="Filter by Concept Class", placeholder="Enter concept class...")
                filter_domain = gr.Textbox(label="Filter by Domain", placeholder="Enter domain...")
                filter_vocab = gr.Textbox(label="Filter by Vocabulary", placeholder="Enter vocabulary...")
        
        # Middle Section: Mapping Results
        gr.Markdown("### **Results Table**")
        temp_table_output = gr.DataFrame(label="Mapped Results", visible=False)
        # 查看详细信息
        temp_table_output.select(select_record, outputs=[main_page, detail_page, detail_Infor, detail_Infor])

        save_button = gr.Button("Save as Excel", visible=False)
        download_link = gr.File(label="Download Excel File", visible=False)
    
        # Lower Section: General LLM Search
        gr.Markdown("## **General Search using LLM**")
        llm_query = gr.Textbox(label="Ask anything", placeholder="E.g., What is paracetamol called in the USA?")
        llm_search_button = gr.Button("Ask")
        llm_response_output = gr.Textbox(label="LLM Response", interactive=False)
    
        # Logic for Mapping Button Visibility
        def toggle_mapping_button(x):
            return gr.update(visible=True) if x.strip() else gr.update(visible=False)
    
        text_input.change(toggle_mapping_button, inputs=[text_input], outputs=[mapping_button])
    
        #获取建议并存储
        def process_and_store(x):
            if not x.strip():
                return
            extracted_info = query_pipeline([x])
            temp_table = display_extracted_info(extracted_info)
            return temp_table, gr.update(visible=True), gr.update(visible=True)
    
        mapping_button.click(
            fn=process_and_store, 
            inputs=[text_input], 
            outputs=[temp_table_output, temp_table_output, save_button]
        )
    
        #保存的逻辑
        def save_and_return_file():
            file_path = save_excel()
            return file_path if file_path else None
        
        save_button.click(fn=save_and_return_file, inputs=[], outputs=download_link)
    
        # LLM Search Logic
        def get_llm_response(input):
            result = (prompt | llm).invoke(input)
            return result
    
        llm_search_button.click(fn=get_llm_response, inputs=[llm_query], outputs=[llm_response_output])

    with detail_page:
        back_button = gr.Button("Back to Main Page")
        back_button.click(go_back_to_main, inputs=[], outputs=[main_page, detail_page, detail_Infor])


    

demo.launch(share=False)











