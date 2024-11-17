# app.py

import gradio as gr
from backend import display_xlsx, get_sheet_names, reset_interface, process_mapping
import tempfile
import pandas as pd
import os
from io import StringIO

with gr.Blocks() as demo:
    # deal with user update file
    def update_sheets(file):
        if file is None:
            return reset_interface()
        sheets = get_sheet_names(file)
        return gr.update(choices=sheets, value=sheets[0], visible=True), "", gr.update(visible=True),"", "result", "Save Result"
    
    # save html to xlsx
    def save_result_as_xlsx(data_html, filename):
        # file name
        if not filename.strip():
            filename = "result.xlsx"
        else:
            # make sure filename end with xlsx
            if not filename.endswith(".xlsx"):
                filename += ".xlsx"

        # get content from html
        df = pd.read_html(StringIO(data_html))[0]
    
        df.to_excel(filename, index=False)

        return "Save Result"

    # the interfance components
    gr.Markdown("### Upload and Display File Content")
    file_input = gr.File(label="Upload an XLSX file")

    sheet_selector = gr.Dropdown(label="Select Sheet", choices=[], interactive=True, visible=False)
    data_display = gr.HTML()
    display_button = gr.Button("Process Mapping", visible=False)
    data_after = gr.HTML()

    # components for output 
    filename_input = gr.Textbox(label="Enter filename (if not input use result)", visible=False)
    output_button = gr.Button("Save Result", visible=False)

    # when user upload a file
    file_input.change(update_sheets, inputs=file_input, outputs=[sheet_selector, data_display, display_button, data_after,filename_input, output_button])
    
    # select which sheet in Excel
    sheet_selector.change(display_xlsx, inputs=[file_input, sheet_selector], outputs=data_display)

    # click the process button
    display_button.click(process_mapping, inputs=[file_input, sheet_selector], outputs=[data_after, filename_input, output_button])

    # click the save button
    output_button.click(save_result_as_xlsx, inputs=[data_after, filename_input], outputs = output_button)

demo.launch(share=False)
