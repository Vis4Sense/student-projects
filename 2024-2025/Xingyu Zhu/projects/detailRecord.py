import gradio as gr
import pandas as pd
import os
from backend import query_pipeline
import json
import requests
import random
from pydantic import BaseModel
from typing import Optional, List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from langchain.prompts import PromptTemplate
from langchain.llms.base import LLM
from langchain.chains import LLMChain

# Information after mapping
extracted_info_storage = {}
stored_search_terms = set()  
data_extract = None  
selected_record = None  # 用于存储选中的记录

def display_xlsx(file, sheet_name):
    if file is None:
        return None
    df = pd.read_excel(file.name, sheet_name=sheet_name)
    return df

def select_record(evt: gr.SelectData):
    global selected_record
    selected_record = evt.value  # 选中行的数据
    return gr.update(visible=False), gr.update(visible=True)  # 隐藏主页面，显示详情页面

def go_back_to_main():
    return gr.update(visible=True), gr.update(visible=False)  # 显示主页面，隐藏详情页面

def generate_temp_excel():
    global data_extract
    if not extracted_info_storage:
        return None 
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
    data_extract = df
    return df

def display_extracted_info(extracted_info):
    global extracted_info_storage, stored_search_terms
    search_term = extracted_info.get("search_term", "").strip()
    if search_term and search_term not in stored_search_terms:
        extracted_info_storage[search_term] = extracted_info 
        stored_search_terms.add(search_term)
    output = generate_temp_excel()
    return output

def save_excel():
    global data_extract
    if data_extract is None:
        return None  
    file_path = "extracted_data.xlsx"
    data_extract.to_excel(file_path, index=False)  
    return file_path 

def process_and_store(x):
    if not x.strip():
        return
    extracted_info = query_pipeline([x])
    temp_table = display_extracted_info(extracted_info)
    return temp_table, gr.update(visible=True), gr.update(visible=True)

def save_and_return_file():
    file_path = save_excel()
    return file_path if file_path else None

def toggle_mapping_button(x):
    return gr.update(visible=True) if x.strip() else gr.update(visible=False)

def get_llm_response(input):
    result = (prompt | llm).invoke(input)
    return result

with gr.Blocks() as demo:
    main_page = gr.Column(visible=True)
    detail_page = gr.Column(visible=False)
    
    with main_page:
        gr.Markdown("## **Mapping Suggestion Interface**")
        text_input = gr.Textbox(label="Enter search term", placeholder="Type your query here...")
        mapping_button = gr.Button("Find Mapping", visible=False)
        temp_table_output = gr.DataFrame(label="Mapped Results", visible=False)
        save_button = gr.Button("Save as Excel", visible=False)
        download_link = gr.File(label="Download Excel File", visible=False)
        text_input.change(toggle_mapping_button, inputs=[text_input], outputs=[mapping_button])
        mapping_button.click(fn=process_and_store, inputs=[text_input], outputs=[temp_table_output, temp_table_output, save_button])
        save_button.click(fn=save_and_return_file, inputs=[], outputs=download_link)
        temp_table_output.select(select_record, inputs=[], outputs=[main_page, detail_page])
    
    with detail_page:
        gr.Markdown("## **Record Details**")
        gr.Textbox(label="Selected Record", value=lambda: selected_record if selected_record else "No record selected", interactive=False)
        back_button = gr.Button("Back to Main Page")
        back_button.click(go_back_to_main, inputs=[], outputs=[main_page, detail_page])
    
    demo.launch(share=False)
