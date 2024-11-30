from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 存储从 Chrome Extension 接收到的标签标题
tab_titles = []

@app.route('/tabs', methods=['POST'])
def receive_tabs():
    global tab_titles
    data = request.json
    tab_titles = data.get('titles', [])
    return jsonify({"message": "Titles received successfully!"})

@app.route('/api/tabs', methods=['GET'])
def get_tabs():
    global tab_titles
    return jsonify({"titles": tab_titles})

if __name__ == '__main__':
    app.run(port=8080)
