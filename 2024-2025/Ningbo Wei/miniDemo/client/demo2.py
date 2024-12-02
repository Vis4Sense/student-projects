from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 存储从 Chrome Extension 接收到的标签标题
tab_titles = []    # 创建一个类，包含ID，title，，，，

@app.route('/tabs', methods=['POST'])
def receive_tabs():
    global tab_titles
    tab_titles = []
    data = request.json
    tab_titles = data.get('titles', [])
    print(tab_titles)

    #  # 提取数据并存储
    # tab_titles.append({
    #     "id": data['id'],
    #     "title": data['title'],
    #     "textContent": data['textContent'],
    #     "markdownOutline": data['markdownOutline']
    # })

    return jsonify({"message": "Titles received successfully!"})

@app.route('/api/tabs', methods=['GET'])
def get_tabs():
    global tab_titles
    return jsonify({"titles": tab_titles})

if __name__ == '__main__':
    app.run(port=8080)
