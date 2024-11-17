# backend.py

import pandas as pd
import gradio as gr
import os

# display xlsx
def display_xlsx(file, sheet_name):
    if file is None:
        return ""
    df = pd.read_excel(file.name, sheet_name=sheet_name)
    html = df.to_html(index=False)
    html = f"<div style='overflow-x: auto'>{html}</div>"
    return html

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


