# my_project/server_min.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np, json
from pathlib import Path
from sklearn.neighbors import NearestNeighbors
from sklearn.cluster import KMeans

VEC_PATH = Path("data/vector_store.json")
data = json.loads(VEC_PATH.read_text(encoding="utf-8"))
IDS = [d["id"] for d in data]
TITLES = {d["id"]: d["title"] for d in data}
X = np.array([d["vector"] for d in data])

app = Flask(__name__)
CORS(app)

# 最近邻索引（余弦）
nn = NearestNeighbors(n_neighbors=min(10, len(X)), metric="cosine").fit(X)

@app.post("/semantic_search")
def semantic_search():
    body = request.get_json(force=True)
    query = (body or {}).get("query","")
    top_k = int((body or {}).get("top_k", 5))
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    qv = model.encode([query], normalize_embeddings=True)
    dist, idx = nn.kneighbors(qv, n_neighbors=min(top_k, len(IDS)))
    res = [{"id": IDS[i], "title": TITLES[IDS[i]]} for i in idx[0]]
    return jsonify({"results": res})

@app.post("/citation_relation")
def citation_relation():
    a = (request.json or {}).get("a_id")
    b = (request.json or {}).get("b_id")
    # 占位返回（如果有真实引用数据可替换）
    nodes = [{"id": a, "label": TITLES.get(a, a)}, {"id": b, "label": TITLES.get(b, b)}]
    edges = [{"src": a, "dst": b, "type": "cites"}]
    return jsonify({"nodes": nodes, "edges": edges})

@app.post("/cluster_papers")
def cluster_papers():
    sel = (request.json or {}).get("ids", [])
    idxs = [IDS.index(i) for i in sel if i in IDS]
    if not idxs:
        return jsonify({"layout": []})
    Xs = X[idxs]
    k = max(1, min(3, len(idxs)))
    km = KMeans(n_clusters=k, n_init=10, random_state=42).fit(Xs)
    # 用 PCA 代替 UMAP，避免额外依赖
    from sklearn.decomposition import PCA
    coords = PCA(n_components=2).fit_transform(Xs)
    layout = []
    for j, i in enumerate(idxs):
        layout.append({
            "id": IDS[i],
            "title": TITLES[IDS[i]],
            "x": float(coords[j,0]),
            "y": float(coords[j,1]),
            "cluster": int(km.labels_[j])
        })
    return jsonify({"layout": layout})

if __name__ == "__main__":
    app.run(port=3000, debug=True)
