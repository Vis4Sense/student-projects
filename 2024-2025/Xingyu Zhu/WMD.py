#导入必要的库
from openai import AzureOpenAI
import requests
import gradio as gr
import pandas as pd

#This file only include the code, do not have any endpoint/key......
client = AzureOpenAI(azure_endpoint=api_base, api_key=api_key, api_version=api_version)

#display xlsx
def display_xlsx(file, sheet_name):
    if file is None:
        return ""
    df = pd.read_excel(file.name, sheet_name=sheet_name)
    html = df.to_html(index=False)
    html = f"<div style='overflow-x: auto'>{html}</div>"
    return html 

def get_sheet_names(file):
    if file is None:
        return ""
    xlsx = pd.ExcelFile(file.name)
    return xlsx.sheet_names

def reset_interface():
    return gr.update(choices=[], value=None, visible=False), "", gr.update(visible=False),""

#The function to mapping
def get_athena_mapping(column_heading):
    prompt = f"Mapping '{column_heading}' into the OHDSI Athena standard vocabulary and provide only the ID of it."

    try:
        #send request
        response = client.chat.completions.create(
            model=deployment_name, 
            messages=[
                {"role": "system", "content": "You are a helpful assistant."}, 
                {"role": "user", "content": prompt}
            ],
            max_tokens=50
        )   

        #get the answer
        mapped_value = response.choices[0].message.content.strip().replace("\n", "")
        return mapped_value
    except Exception as e:
        return f"Something wrong: {str(e)}"

    
#Gradio Blocks
with gr.Blocks() as demo:
    def update_sheets(file):
        if file is None:
            return reset_interface()
        sheets = get_sheet_names(file)
        return gr.update(choices=sheets, value=sheets[0], visible=True), "", gr.update(visible=True),""
    
    def process_mapping(file_input, sheet_selector):        
        if file_input is None:
            return ""
        
        df = pd.read_excel(file_input.name, sheet_name=sheet_selector)
        mappings = {}
        
        #mapping head of each columns
        for column in df.columns:
            mapped_value = get_athena_mapping(column)
            mappings[column] = mapped_value
                            
        
        mapping_df = pd.DataFrame(list(mappings.items()), columns=['Original Heading', 'Mapped Value'])
        html = mapping_df.to_html(index=False)
        html = f"<div style='overflow-x: auto'>{html}</div>"
        return html

    gr.Markdown("### Upload and Display XLSX File Content")
    file_input = gr.File(label="Upload an XLSX file")
    sheet_selector = gr.Dropdown(label="Select Sheet", choices=[], interactive=True, visible=False)
    data_display = gr.HTML()
    display_button = gr.Button("Process Mapping", visible=False)
    
    data_after = gr.HTML()
   
    
    file_input.change(update_sheets, inputs=file_input, outputs=[sheet_selector, data_display, display_button, data_after])

    sheet_selector.change(display_xlsx, inputs=[file_input, sheet_selector], outputs=data_display)

    display_button.click(process_mapping, inputs=[file_input, sheet_selector], outputs=data_after)

demo.launch(share=True)
