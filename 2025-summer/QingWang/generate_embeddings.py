# my_project/generate_embeddings.py
from pathlib import Path
import json, pandas as pd
from sentence_transformers import SentenceTransformer

IN = Path("data/papers_cleaned.tsv")
OUT = Path("data/vector_store.json")

def main():
    df = pd.read_csv(IN, sep="\t")
    texts = (df["title"].fillna("") + " " + df["abstract"].fillna("")).tolist()
    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    vecs = model.encode(texts, normalize_embeddings=True).tolist()

    data = []
    for i, row in df.iterrows():
        data.append({
            "id": str(row["id"]),
            "title": str(row["title"]),
            "year": str(row["year"]),
            "vector": vecs[i]
        })
    OUT.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    print(f"[OK] wrote {OUT} with {len(data)} vectors")

if __name__ == "__main__":
    main()
