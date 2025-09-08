from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # 开发期直接全放开

@app.post("/semantic_search")
def semantic_search():
    data = request.get_json() or {}
    # TODO: 调用你的检索逻辑
    return jsonify({"results":[{"id":"P1","title":"Demo Paper 1","year":2023},{"id":"P2","title":"Demo Paper 2","year":2024}]})

@app.post("/citation_relation")
def citation_relation():
    data = request.get_json() or {}
    a = data.get("a_id"); b = data.get("b_id")
    # TODO: 真实引用分析
    return jsonify({"a":a,"b":b,"relation":"a cites b? (demo=false)","paths":[]})

@app.post("/cluster_papers")
def cluster_papers():
    data = request.get_json() or {}
    ids = data.get("ids", [])
    # TODO: 返回真实聚类/布局
    layout = [{"id":pid,"x":i*10,"y":i*12,"cluster":i%3} for i,pid in enumerate(ids)]
    return jsonify({"layout":layout})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=3000, debug=True)
