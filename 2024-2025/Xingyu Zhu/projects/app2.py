import gradio as gr
import pandas as pd
from backend import query_pipeline


# Use Dataframe
def display_xlsx(file, sheet_name):
    if file is None:
        return None
    df = pd.read_excel(file.name, sheet_name=sheet_name)
    return df

# Deal with select cell
def select_cell(evt: gr.SelectData):
    # return the key
    return evt.value  

def wrap_as_list(value):
    return [value] if isinstance(value, str) else value

with gr.Blocks() as demo:
    def update_sheets(file):
        if file is None:
            return gr.update(choices=[], value="", visible=False), None
        sheets = pd.ExcelFile(file.name).sheet_names
        return gr.update(choices=sheets, value=sheets[0], visible=True), None

    gr.Markdown("### Upload and Display File Content")
    
    file_input = gr.File(label="Upload an XLSX file")
    sheet_selector = gr.Dropdown(label="Select Sheet", choices=[], interactive=True, visible=False)
    data_display = gr.DataFrame(interactive=True)
    cell_output = gr.Textbox(label="Selected Content", visible=True)
    process_output = gr.Textbox(label="Processed Output", visible=True)

    file_input.change(update_sheets, inputs=file_input, outputs=[sheet_selector, data_display])
    sheet_selector.change(display_xlsx, inputs=[file_input, sheet_selector], outputs=data_display)
    data_display.select(select_cell, outputs=cell_output)
    cell_output.change(lambda x: query_pipeline(wrap_as_list(x)), inputs=cell_output, outputs=process_output)

demo.launch(share=False)
