# backend.py

import pandas as pd
import gradio as gr
import os
import requests
import json

# display xlsx
def display_xlsx(file, sheet_name):
    if file is None:
        return ""
    df = pd.read_excel(file.name, sheet_name=sheet_name)
    html = df.to_html(index=False)
    html = f"<div style='overflow-x: auto'>{html}</div>"
    return html

def extract_important_info(parsed_data):
    extracted_data = {
        'reply': '',
        'informal_name': '',
        'search_term': '',
        'CONCEPT': []
    }
    
    flattened_data = []
    for item in parsed_data:
        if isinstance(item, list):
            flattened_data.extend(item)  # 处理嵌套列表
        else:
            flattened_data.append(item)
    
    for item in flattened_data:
        if not isinstance(item, dict):
            continue
        
        event = item.get('event', '')
        data = item.get('data', {})
        
        if event == 'llm_output':
            extracted_data['reply'] = data.get('reply', '')
            extracted_data['informal_name'] = data.get('informal_name', '')
        
        elif event == 'omop_output':
            extracted_data['search_term'] = data.get('search_term', '')
            for concept in data.get('CONCEPT', []):
                extracted_data['CONCEPT'].append({
                    'Concept Name': concept.get('concept_name', ''),
                    'Concept ID': concept.get('concept_id', ''),
                    'Vocabulary ID': concept.get('vocabulary_id', ''),
                    'Concept Code': concept.get('concept_code', ''),
                    'Similarity Score': concept.get('concept_name_similarity_score', '')
                })
    
    return extracted_data

def query_pipeline(names, url = "http://127.0.0.1:8000/pipeline/"):
    #有几种不同的endpoint
    headers = {"Content-Type": "application/json"}
    data = {"names": names}

    response = requests.post(url, json=data, headers=headers)

    if response.status_code != 200:
        print(f"Error: HTTP {response.status_code}")
        return None

    # 解析 SSE 响应
    lines = response.text.strip().split("\n")
    parsed_data = []

    for line in lines:
        if line.startswith("data: "):  # 只解析 "data:" 行
            json_part = line[6:].strip()  # 去掉 "data: " 前缀并去除前后空格
            try:
                parsed_data.append(json.loads(json_part))  # 解析 JSON
            except json.JSONDecodeError as e:
                print(f"JSON 解析失败: {e}")

    return extract_important_info(parsed_data)
    

# get the name of all sheets
def get_sheet_names(file):
    if file is None:
        return ""
    xlsx = pd.ExcelFile(file.name)
    return xlsx.sheet_names

# rest
def reset_interface():
    # update sheet_selector/data_display/display_button/data_after/filename_input/output_button
    return gr.update(choices=[], value=None, visible=False), "", gr.update(visible=False),"", gr.update(visible=False), gr.update(visible=False)

# mapping function 
def get_athena_mapping(column_heading):
    # now is an example code
    return "test"

# the function to mapping
def process_mapping(file_input, sheet_selector):        
    if file_input is None:
        return ""
    
    df = pd.read_excel(file_input.name, sheet_name=sheet_selector)
    mappings = {}
    
    # 
    for column in df.columns:
        mapped_value = get_athena_mapping(column)
        mappings[column] = mapped_value
    
    # transfer result to html
    mapping_df = pd.DataFrame(list(mappings.items()), columns=['Original Heading', 'Mapped Value'])
    html = mapping_df.to_html(index=False)
    html = f"<div style='overflow-x: auto'>{html}</div>"
    
    # save result and make filename_input/output_button visible
    return html, gr.update(visible=True), gr.update(visible=True)


