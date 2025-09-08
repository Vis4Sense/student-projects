# my_project/zotero_preprocess.py
import json, csv, re
from pathlib import Path

IN = Path("data/export-data.json")
OUT = Path("data/papers_cleaned.tsv")

def norm(x):
    if not x: return ""
    return re.sub(r"\s+", " ", str(x)).strip()

def main():
    items = json.loads(IN.read_text(encoding="utf-8"))
    # 兼容 Better JSON / Zotero JSON 两种结构
    if isinstance(items, dict) and "items" in items:
        items = items["items"]

    fields = ["id","title","authors","year","abstract","keywords"]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields, delimiter="\t")
        w.writeheader()
        for it in items:
            creators = it.get("creators", []) or it.get("data", {}).get("creators", [])
            tags = it.get("tags", []) or it.get("data", {}).get("tags", [])
            abstract = it.get("abstractNote") or it.get("data", {}).get("abstractNote", "")
            date = it.get("date") or it.get("data", {}).get("date", "")

            w.writerow({
                "id": it.get("key") or it.get("id") or it.get("data", {}).get("key"),
                "title": norm(it.get("title") or it.get("data", {}).get("title")),
                "authors": "; ".join([c.get("lastName","") or c.get("name","") for c in creators]),
                "year": norm(date)[:4],
                "abstract": norm(abstract),
                "keywords": "; ".join([t["tag"] if isinstance(t, dict) else str(t) for t in tags])
            })
    print(f"[OK] wrote {OUT}")

if __name__ == "__main__":
    main()
