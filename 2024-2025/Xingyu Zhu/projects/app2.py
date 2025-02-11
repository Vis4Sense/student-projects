import gradio as gr
import pandas as pd
import os
from backend import query_pipeline

# Information after mapping
extracted_info_storage = {}  # Key: search_term, Value: extracted_info
stored_search_terms = set()  
data_extract = None  # Used to store temporary tables

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

# Process the extracted information and store it
def display_extracted_info(extracted_info):
    global extracted_info_storage, stored_search_terms

    search_term = extracted_info.get("search_term", "").strip()

    # Avoid duplication
    if search_term and search_term not in stored_search_terms:
        extracted_info_storage[search_term] = extracted_info 
        stored_search_terms.add(search_term) 

    # Stereoscopic output
    output = "\n==== Extracted Information ===="
    output += f"\nReply: {extracted_info['reply']}"
    output += f"\nInformal Name: {extracted_info['informal_name']}"
    output += f"\nSearch Term: {search_term}\n"

    if extracted_info['CONCEPT']:
        df = pd.DataFrame(extracted_info['CONCEPT'])
        output += "\n==== Concept Information ===="
        output += f"\n{df.to_string(index=False)}"

    return output

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
            "Reply": info["reply"],
            "Informal Name": info["informal_name"],
            "Search Term": info["search_term"]
        }
        if info["CONCEPT"]:
            for concept in info["CONCEPT"]:
                row = {**base_info, **concept}
                all_data.append(row)
        else:
            all_data.append(base_info)

    df = pd.DataFrame(all_data)
    data_extract = df  # store
    return df, gr.update(visible=True), gr.update(visible=True)

# Svae function
def save_excel():
    global data_extract

    if data_extract is None:
        return None  

    file_path = "extracted_data.xlsx"
    data_extract.to_excel(file_path, index=False)  
    return file_path 

#下面这个函数有点问题
def reset_interface():
    global extracted_info_storage, stored_search_terms, data_extract
    
    # 清空全局变量
    extracted_info_storage = {}
    stored_search_terms = set()
    data_extract = None

    # 仅返回 6 个值
    return (
        gr.update(choices=[], value=None, visible=False),  # sheet_selector
        None,  # data_display
        gr.update(visible=False),  # data_display
        gr.update(value="", visible=False),  # cell_output
        gr.update(value="", visible=False),  # process_output
        gr.update(visible=False),  # generate_button
        gr.update(visible=False)  # temp_table_output
    )



# Gradio UI
with gr.Blocks() as demo:
    def update_sheets(file):
        if file is None:
            #这里需要改
            return reset_interface()
        sheets = pd.ExcelFile(file.name).sheet_names
        return gr.update(choices=sheets, value=sheets[0], visible=True), None, gr.update(visible=True),gr.update(visible=True),gr.update(visible=True),gr.update(visible=True),gr.update(visible=False)

    gr.Markdown("### Upload and Display File Content")

    file_input = gr.File(label="Upload an XLSX file")
    sheet_selector = gr.Dropdown(label="Select Sheet", choices=[], interactive=True, visible=False)
    data_display = gr.DataFrame(interactive=True, visible=False)
    cell_output = gr.Textbox(label="Selected Content", visible=False, interactive=False)
    process_output = gr.Textbox(label="Processed Output", visible=False)

    # 生成和显示临时表格
    generate_button = gr.Button("Generate Temporary Table", visible=False)
    temp_table_output = gr.DataFrame(label="Temporary Table",visible=False)

    # 保存表格
    save_button = gr.Button("Save Excel File", visible=False)
    download_link = gr.File(label="Download Excel File", visible=False)


    file_input.change(update_sheets, inputs=file_input, outputs=[sheet_selector, data_display,data_display,cell_output,process_output,generate_button, temp_table_output])
    sheet_selector.change(display_xlsx, inputs=[file_input, sheet_selector], outputs=data_display)
    data_display.select(select_cell, outputs=cell_output)

    generate_button.click(fn=generate_temp_excel, inputs=[], outputs=[temp_table_output, temp_table_output, save_button])

    # 处理 & 存储数据
    def process_and_store(x):
        extracted_info = query_pipeline(wrap_as_list(x))
        output_text = display_extracted_info(extracted_info)
        return output_text  

    cell_output.change(process_and_store, inputs=cell_output, outputs=[process_output])

    

    def save_and_return_file():
        file_path = save_excel()
        return file_path if file_path else None

    save_button.click(fn=save_and_return_file, inputs=[], outputs=download_link)

demo.launch(share=False)
