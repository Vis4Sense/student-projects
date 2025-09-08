# my_project/build_index.py
from __future__ import annotations
import json, sys
from pathlib import Path
import numpy as np
from tqdm import tqdm

def _norm(s: str|None) -> str:
    return (s or "").replace("\n", " ").strip()

def load_items(p: Path):
    data = json.loads(p.read_text(encoding="utf-8"))
    items = []
    for it in data:
        if it.get("itemType") == "attachment":
            continue
        zid  = it.get("key") or it.get("id") or it.get("uri") or it.get("url")
        title= _norm(it.get("title"))
        abstr= _norm(it.get("abstractNote"))
        tags = " ".join([t["tag"] for t in it.get("tags", []) if isinstance(t, dict)])
        year = _norm(it.get("date"))
        doi  = _norm(it.get("DOI"))
        url  = _norm(it.get("url"))
        text = " ".join([title, abstr, tags, year, doi]).strip()
        if zid and title and text:
            items.append({
                "id": zid, "title": title, "url": url, "doi": doi, "year": year, "text": text
            })
    return items

def main(in_json: str, out_faiss: str, out_meta: str, out_corpus: str):
    from sentence_transformers import SentenceTransformer
    import faiss

    IN  = Path(in_json)
    OFI = Path(out_faiss)
    OJM = Path(out_meta)
    OJL = Path(out_corpus)
    for p in (OFI, OJM, OJL):
        p.parent.mkdir(parents=True, exist_ok=True)

    items = load_items(IN)
    if not items:
        print("No items.", file=sys.stderr); sys.exit(1)
    print(f"Loaded {len(items)} items.")

    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    texts = [it["text"] for it in items]
    embs  = model.encode(texts, batch_size=64, show_progress_bar=True,
                         convert_to_numpy=True, normalize_embeddings=True)

    import faiss
    dim = embs.shape[1]
    index = faiss.IndexFlatIP(dim)
    index.add(embs.astype(np.float32))
    faiss.write_index(index, str(OFI))

    meta = [{"id": it["id"], "title": it["title"], "url": it["url"]} for it in items]
    OJM.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")

    # 语料：一行一个 JSON（含 text）
    OJL.write_text(
        "\n".join(json.dumps({"id": it["id"], "title": it["title"], "url": it["url"], "text": it["text"]},
                             ensure_ascii=False) for it in items),
        encoding="utf-8"
    )
    print(f"OK: {OFI} / {OJM} / {OJL}")

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Usage: python build_index.py data\\export_data.json data\\faiss.index data\\meta.json data\\corpus.jsonl")
        sys.exit(2)
    main(*sys.argv[1:5])
