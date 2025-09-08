# ingest_build_index.py
"""
从 Zotero 导出的 CSL JSON 构建向量索引：
- 仅用 标题 + 摘要（无须 PDF，离线可跑）
- 模型：sentence-transformers/all-MiniLM-L6-v2（384维）
- 产物：outdir/index.faiss + outdir/meta.jsonl

用法：
  python ingest_build_index.py --input data/export-data.json --outdir data/index
"""
import json, re, argparse
from pathlib import Path
from tqdm import tqdm

import numpy as np
import pandas as pd

from sentence_transformers import SentenceTransformer
import faiss

def norm_txt(s: str) -> str:
    s = (s or "").strip()
    s = re.sub(r"\s+", " ", s)
    return s

def load_zotero_json(path: Path) -> pd.DataFrame:
    raw = json.loads(path.read_text(encoding="utf-8"))
    rows = []
    for it in raw:
        d = it.get("data") if isinstance(it, dict) and "data" in it else it
        if not isinstance(d, dict):
            continue
        pid   = str(d.get("id") or d.get("key") or d.get("itemID") or "").strip()
        title = str(d.get("title") or d.get("shortTitle") or "").strip()
        # 摘要字段在 Zotero 里可能叫 abstractNote 或 abstract
        abstract = d.get("abstractNote") or d.get("abstract") or ""
        year  = str(d.get("year") or d.get("date") or "")[:4]
        doi   = str(d.get("DOI") or d.get("doi") or "")
        if not pid or not title:
            continue
        text = norm_txt(title) + ("\n\n" + norm_txt(abstract) if abstract else "")
        rows.append({
            "id": pid,
            "title": norm_txt(title),
            "year": year,
            "doi": doi,
            "text": text
        })
    if not rows:
        raise RuntimeError("No valid items found in export-data.json")
    return pd.DataFrame(rows)

def build_index(df: pd.DataFrame, outdir: Path, batch_size=64, model_name="sentence-transformers/all-MiniLM-L6-v2"):
    outdir.mkdir(parents=True, exist_ok=True)
    model = SentenceTransformer(model_name)
    vecs = []
    for i in tqdm(range(0, len(df), batch_size), desc="Embedding"):
        batch = df.iloc[i:i+batch_size]["text"].tolist()
        emb = model.encode(batch, show_progress_bar=False, normalize_embeddings=True)
        vecs.append(emb.astype("float32"))
    X = np.vstack(vecs)  # [N, 384]

    index = faiss.IndexFlatIP(X.shape[1])  # 余弦相似（向量已规一化）
    index.add(X)

    faiss.write_index(index, str(outdir / "index.faiss"))
    with (outdir / "meta.jsonl").open("w", encoding="utf-8") as f:
        for i, row in df.iterrows():
            meta = {"id": row["id"], "title": row["title"], "year": row["year"], "doi": row["doi"]}
            f.write(json.dumps(meta, ensure_ascii=False) + "\n")

    print(f"Done. embeddings: {X.shape}, index -> {outdir/'index.faiss'}, meta -> {outdir/'meta.jsonl'}")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", type=str, default="data/export-data.json")
    ap.add_argument("--outdir", type=str, default="data/index")
    args = ap.parse_args()
    df = load_zotero_json(Path(args.input))
    print(f"Items: {len(df)}")
    build_index(df, Path(args.outdir))

if __name__ == "__main__":
    main()
