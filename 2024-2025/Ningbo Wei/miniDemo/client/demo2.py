from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 存储从 Chrome Extension 接收到的标签标题
tabs = []    # 创建一个类，包含ID，title，，，，

@app.route('/tabs', methods=['POST'])
def receive_tabs():
    global tabs
    data = request.json
    if isinstance(data, dict) and 'tabs' in data:
        tabs = data['tabs']  # 提取 tabs 数组
    else:
        return jsonify({"error": "Invalid JSON format/missing of tabs info"}), 400
    # for i in tabs:
    #     print(i['title'])
    print(tabs[0])
    print("detect tabs number: " + str(len(tabs)))
    return jsonify({"message": "Titles received successfully!"})

@app.route('/api/tabs', methods=['GET'])
def get_tabs():
    global tabs
    return jsonify({"tabs": tabs})

if __name__ == '__main__':
    app.run(port=8080)
