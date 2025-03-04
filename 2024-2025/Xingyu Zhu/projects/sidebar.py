import gradio as gr

# 侧边栏状态变量
sidebar_visible = False

def toggle_sidebar():
    """切换侧边栏的可见性"""
    global sidebar_visible
    sidebar_visible = not sidebar_visible
    return gr.update(visible=sidebar_visible)

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
    
    # 侧边栏
    with gr.Column(scale=1, elem_id="sidebar", visible=False, elem_classes="visible") as sidebar:
        gr.Markdown("### Sidebar")
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

demo.launch()