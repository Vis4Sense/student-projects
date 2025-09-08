# build_edges_from_openalex.py  (robust)
import json, time, re, sys
from pathlib import Path
import requests
import pandas as pd
from urllib.parse import quote
from tqdm import tqdm

DATA = Path("data/export-data.json")      # 或 data/export_data.json
DATA_ALT = Path("data/export_data.json")
OUT_EDGES = Path("data/edges.csv")
OUT_MAP   = Path("data/openalex_map.csv")

# *** 必填：请改成你的真实邮箱 ***
MAILTO = "alyqw23.nottingham.ac.uk"
UA     = f"Zotero-RAG-Assistant/0.2 (contact: {MAILTO})"

BASE = "https://api.openalex.org/works"
SESS = requests.Session()
SESS.headers.update({"User-Agent": UA})
TIMEOUT = 25
PAUSE = 0.25   # 礼貌限速

def load_items():
    src = DATA if DATA.exists() else DATA_ALT
    if not src.exists():
        print(f"[ERR] Missing {DATA} / {DATA_ALT}", file=sys.stderr); sys.exit(1)
    raw = json.loads(src.read_text(encoding="utf-8"))
    rows = []
    for it in raw:
        d = it.get("data") if isinstance(it, dict) and "data" in it else it
        if not isinstance(d, dict):
            continue
        pid   = str(d.get("id") or d.get("key") or d.get("itemID") or "").strip()
        title = str(d.get("title") or d.get("shortTitle") or "").strip()
        doi   = str(d.get("DOI")   or d.get("doi") or "").strip()
        year  = str(d.get("year")  or d.get("date") or "")[:4]
        if not pid or not title:
            continue
        doi = re.sub(r"^https?://(dx\.)?doi\.org/", "", doi, flags=re.I) if doi else ""
        rows.append({"id": pid, "title": title, "doi": doi, "year": year})
    return pd.DataFrame(rows)

def get_json(url, params=None):
    p = dict(params or {})
    if MAILTO:
        p.setdefault("mailto", MAILTO)
    r = SESS.get(url, params=p, timeout=TIMEOUT)
    if r.status_code == 404:
        return None
    r.raise_for_status()
    return r.json()

def by_doi_all_ways(doi):
    """试 3 种 DOI 查询方式，任一命中即返回 work 对象"""
    # 1) /works/doi:xxxxx
    try:
        j = get_json(f"{BASE}/doi:{quote(doi, safe='')}")
        if j and "id" in j:
            return j
    except requests.HTTPError as e:
        # 400/404 继续尝试
        pass

    # 2) filter=doi:xxxxx （精确）
    try:
        j = get_json(BASE, params={"filter": f"doi:{doi}", "select": "id,doi,display_name,referenced_works"})
        # filter 返回 results[]
        if j and isinstance(j.get("results"), list) and j["results"]:
            return j["results"][0]
    except requests.HTTPError:
        pass

    # 3) filter=doi.search:xxxxx （宽松）
    try:
        j = get_json(BASE, params={"filter": f"doi.search:{doi}", "select": "id,doi,display_name,referenced_works"})
        if j and isinstance(j.get("results"), list) and j["results"]:
            return j["results"][0]
    except requests.HTTPError:
        pass

    return None

def by_title_fallback(title, year=""):
    """标题搜索兜底：search=title，附带年份筛一筛"""
    params = {"search": title, "per-page": 3, "select": "id,doi,display_name,publication_year,referenced_works"}
    if year and year.isdigit():
        params["filter"] = f"from_publication_year:{year},to_publication_year:{year}"
    j = get_json(BASE, params=params)
    if j and isinstance(j.get("results"), list) and j["results"]:
        # 简单拿第一条；可加相似度/年份精确匹配
        return j["results"][0]
    return None

def main():
    df = load_items()
    if df.empty:
        print("[ERR] No items parsed from export JSON."); return

    # 仅用带 DOI 的先匹配；无 DOI 的回退标题搜
    print(f"📚 Items: {len(df)} (with DOI: {(df['doi']!='').sum()})")
    id_map = {}      # lib_id -> {"doi":..., "openalex":..., "refs":[...]}
    misses = []

    for _, row in tqdm(df.iterrows(), total=len(df)):
        pid, doi, title, year = row["id"], row["doi"], row["title"], row["year"]
        work = None
        if doi:
            work = by_doi_all_ways(doi)
        if work is None:
            # 标题兜底（尤其是没有 DOI 或特殊 DOI）
            try:
                work = by_title_fallback(title, year)
            except Exception as e:
                pass

        if work and work.get("id"):
            refs = work.get("referenced_works") or []
            id_map[pid] = {
                "doi": doi,
                "openalex": work.get("id"),
                "refs": refs
            }
        else:
            misses.append({"id": pid, "title": title, "doi": doi, "year": year})

        time.sleep(PAUSE)

    print(f"✅ mapped: {len(id_map)} ; ❌ missed: {len(misses)}")
    if not id_map:
        print("没有任何条目匹配到 OpenAlex。请检查：1) 将 MAILTO 改成你的真实邮箱；2) 网络可访问 openalex；3) 数据里是否有 DOI。")
        OUT_MAP.parent.mkdir(parents=True, exist_ok=True)
        pd.DataFrame(misses).to_csv(OUT_MAP.with_name("openalex_miss.csv"), index=False)
        return

    # 反向映射：仅库内
    oa2lib = {v["openalex"]: k for k, v in id_map.items() if v.get("openalex")}
    # 生成库内→库内边
    edges = []
    for lib_id, v in id_map.items():
        src_oa = v.get("openalex")
        if not src_oa:
            continue
        for ref in v.get("refs", []):
            if ref in oa2lib:  # 只保留指向库内论文的引用
                edges.append({"citer": lib_id, "cited": oa2lib[ref]})

    OUT_EDGES.parent.mkdir(parents=True, exist_ok=True)
    if edges:
        pd.DataFrame(edges).drop_duplicates().to_csv(OUT_EDGES, index=False)
        print(f"🧩 edges written: {OUT_EDGES}  ({len(edges)} rows, deduped)")
    else:
        # 没有库内→库内的边也算成功（只是图为空）
        pd.DataFrame(columns=["citer","cited"]).to_csv(OUT_EDGES, index=False)
        print("⚠️ 没形成库内→库内的引用（可能都指向库外）。已写入空 edges.csv。")

    # 保存映射表便于排查
    rows = [{"id": k, "doi": v.get("doi"), "openalex": v.get("openalex")} for k, v in id_map.items()]
    pd.DataFrame(rows).to_csv(OUT_MAP, index=False)
    if misses:
        pd.DataFrame(misses).to_csv(OUT_MAP.with_name("openalex_miss.csv"), index=False)
        print(f"部分未匹配，详见：{OUT_MAP.with_name('openalex_miss.csv')}")

if __name__ == "__main__":
    main()
