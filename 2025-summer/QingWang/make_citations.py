from pathlib import Path
import csv, json

DATA = Path("data/edges.csv")
OUT  = Path("data/citations.json")

def main():
    g = {}
    with DATA.open("r", encoding="utf-8") as f:
        for i, row in enumerate(csv.DictReader(f)):
            a = (row.get("citer") or "").strip()
            b = (row.get("cited") or "").strip()
            if not a or not b:
                continue
            g.setdefault(a, []).append(b)
    OUT.write_text(json.dumps(g, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {OUT} with {len(g)} nodes")

if __name__ == "__main__":
    main()
