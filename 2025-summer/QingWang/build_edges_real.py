# build_edges_real.py  (robust v5a: ASCII UA fix + OA-ID->DOI + retry + cache)
import json, re, time, sys, random, os
from pathlib import Path
from urllib.parse import quote

import requests
import pandas as pd
from tqdm import tqdm
from rapidfuzz import fuzz

# ---------- 路径与输出 ----------
DATA1 = Path("data/export-data.json")
DATA2 = Path("data/export_data.json")
OUT_EDGES = Path("data/edges.csv")
MAP_OPENALEX = Path("data/openalex_map.csv")
MAP_S2       = Path("data/semanticscholar_map.csv")
MAP_CROSSREF = Path("data/crossref_map.csv")
MISS_CSV     = Path("data/id_miss.csv")

CACHE_DIR = Path("data/.cache")
OA_CACHE_F   = CACHE_DIR / "openalex.json"       # doi/title 查询缓存
OA_WORK_F    = CACHE_DIR / "openalex_work.json"  # 按 OpenAlex ID 取详情缓存
S2_CACHE_F   = CACHE_DIR / "s2.json"
CR_CACHE_F   = CACHE_DIR / "crossref.json"

# ---------- 配置 ----------
MAILTO = os.getenv("OPENALEX_MAILTO", "your_real_email@university.edu")  # 别用中文
S2_API_KEY = os.getenv("S2_API_KEY", "")  # 可留空；有 key 更稳

# —— 将 UA/mailto 强制为 ASCII，避免 requests 写 Header 时抛 UnicodeEncodeError
def _ascii(s: str) -> str:
    return "".join(ch for ch in str(s) if 32 <= ord(ch) <= 126)

MAILTO_ASCII = _ascii(MAILTO)

# 可按需跳过某个源
SKIP_OPENALEX = False
SKIP_S2       = False
SKIP_CROSSREF = False

# 对已命中 OA 的论文，是否也用 S2 补全参考文献
ENRICH_WITH_S2 = True

UA = f"Zotero-RAG-Assistant/0.5 (contact: {MAILTO_ASCII})"  # 只含 ASCII
BASE_OA = "https://api.openalex.org/works"
BASE_S2 = "https://api.semanticscholar.org/graph/v1"
BASE_CR = "https://api.crossref.org/works"

SESS = requests.Session()
SESS.headers.update({"User-Agent": UA})
if S2_API_KEY:
    SESS.headers.update({"x-api-key": S2_API_KEY})

TIMEOUT = 25
BASE_PAUSE = 0.3  # 基础限速

# ---------- 小工具 ----------
def norm_title(t: str) -> str:
    t = (t or "").lower()
    t = re.sub(r"\s+", " ", t)
    t = re.sub(r"[^\w\s:.-]", "", t)
    return t.strip()

def extract_arxiv_from_title(title: str) -> str | None:
    if not title:
        return None
    t = title.replace("ArXiv", "arXiv")
    m = re.search(r"arXiv:(\d{4}\.\d{4,5})(v\d+)?", t)
    if m: return m.group(1)
    m = re.search(r"\b(\d{4}\.\d{4,5})(v\d+)?\b", t)
    if m: return m.group(1)
    return None

def load_json(path: Path) -> dict:
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}

def save_json(path: Path, obj: dict):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2), encoding="utf-8")

OA_CACHE = load_json(OA_CACHE_F)
OA_WORK  = load_json(OA_WORK_F)
S2_CACHE = load_json(S2_CACHE_F)
CR_CACHE = load_json(CR_CACHE_F)

def get_json(url, params=None, ok_none_status=(400,403,404,422), max_retries=5):
    """429 指数退避；ok_none_status 直接返回 None；其余错误重试后再抛出"""
    p = dict(params or {})
    if "openalex.org" in url and MAILTO_ASCII:
        p.setdefault("mailto", MAILTO_ASCII)
    for attempt in range(max_retries):
        r = SESS.get(url, params=p, timeout=TIMEOUT)
        code = r.status_code
        if code in ok_none_status:
            return None
        if code == 429:
            backoff = min(60, (2 ** attempt)) + random.uniform(0, 0.6)
            time.sleep(backoff)
            continue
        try:
            r.raise_for_status()
            return r.json()
        except requests.HTTPError:
            if attempt < max_retries - 1:
                backoff = min(15, 1 + attempt) + random.uniform(0, 0.3)
                time.sleep(backoff)
                continue
            raise
    return None

# ---------- 解析导出 ----------
def load_items() -> pd.DataFrame:
    src = DATA1 if DATA1.exists() else DATA2
    if not src.exists():
        print(f"[ERR] Missing {DATA1} / {DATA2}", file=sys.stderr); sys.exit(1)
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
        if doi:
            doi = re.sub(r"^https?://(dx\.)?doi\.org/", "", doi, flags=re.I).strip()
        rows.append({
            "id": pid,
            "title": title,
            "title_norm": norm_title(title),
            "doi": doi,
            "year": year
        })
    if not rows:
        print("[ERR] No items parsed from export JSON.", file=sys.stderr); sys.exit(1)
    return pd.DataFrame(rows)

# ---------- OpenAlex ----------
def oa_by_doi(doi: str):
    key = f"doi:{doi}"
    if key in OA_CACHE: return OA_CACHE[key]
    j = get_json(f"{BASE_OA}/doi:{quote(doi, safe='')}")
    if not j:
        j = get_json(BASE_OA, {"filter": f"doi:{doi}",
                               "select": "id,doi,display_name,referenced_works,publication_year"})
        if j and j.get("results"):
            j = j["results"][0]
    if not j:
        j = get_json(BASE_OA, {"filter": f"doi.search:{doi}",
                               "select": "id,doi,display_name,referenced_works,publication_year"})
        if j and j.get("results"):
            j = j["results"][0]
    OA_CACHE[key] = j
    save_json(OA_CACHE_F, OA_CACHE)
    time.sleep(BASE_PAUSE)
    return j

def oa_by_title(title: str, year: str = ""):
    tn = norm_title(title)
    key = f"title:{tn}:{year}"
    if key in OA_CACHE: return OA_CACHE[key]
    params = {"search": title, "per-page": 3,
              "select": "id,doi,display_name,referenced_works,publication_year"}
    if year and year.isdigit():
        params["filter"] = f"from_publication_year:{year},to_publication_year:{year}"
    j = get_json(BASE_OA, params)
    best = None
    if j and j.get("results"):
        best_s = -1
        for w in j["results"]:
            s = fuzz.token_set_ratio(tn, norm_title(w.get("display_name","")))
            if s > best_s:
                best, best_s = w, s
    OA_CACHE[key] = best
    save_json(OA_CACHE_F, OA_CACHE)
    time.sleep(BASE_PAUSE)
    return best

def oa_work_meta(oa_id: str):
    """按 OpenAlex ID 取详情（拿 DOI），带缓存。"""
    if not oa_id:
        return None
    key = f"id:{oa_id}"
    if key in OA_WORK:
        return OA_WORK[key]
    j = get_json(f"{BASE_OA}/{quote(oa_id, safe=':/')}",
                 {"select": "id,doi,display_name"})
    OA_WORK[key] = j
    save_json(OA_WORK_F, OA_WORK)
    time.sleep(BASE_PAUSE)
    return j

# ---------- Semantic Scholar ----------
def s2_paper_by_doi(doi: str):
    key = f"doi:{doi}"
    if key in S2_CACHE: return S2_CACHE[key]
    url = f"{BASE_S2}/paper/DOI:{quote(doi, safe='')}"
    fields = "paperId,externalIds,year,title,referenceCount,citationCount,references.paperId,references.externalIds,references.doi,references.title"
    j = get_json(url, {"fields": fields})
    S2_CACHE[key] = j
    save_json(S2_CACHE_F, S2_CACHE)
    time.sleep(BASE_PAUSE)
    return j

def s2_paper_by_arxiv(arxiv_id: str):
    key = f"arxiv:{arxiv_id}"
    if key in S2_CACHE: return S2_CACHE[key]
    url = f"{BASE_S2}/paper/arXiv:{quote(arxiv_id, safe='')}"
    fields = "paperId,externalIds,year,title,referenceCount,citationCount,references.paperId,references.externalIds,references.doi,references.title"
    j = get_json(url, {"fields": fields})
    S2_CACHE[key] = j
    save_json(S2_CACHE_F, S2_CACHE)
    time.sleep(BASE_PAUSE)
    return j

def s2_search_title(title: str, year: str=""):
    tn = norm_title(title)
    key = f"title:{tn}:{year}"
    if key in S2_CACHE: return S2_CACHE[key]
    url = f"{BASE_S2}/paper/search"
    fields = "paperId,externalIds,year,title,referenceCount,citationCount,references.paperId,references.externalIds,references.doi,references.title"
    params = {"query": title, "limit": 3, "fields": fields}
    if year and year.isdigit():
        params["year"] = year
    j = get_json(url, params)
    best = None
    if j and j.get("data"):
        best_s = -1
        for w in j["data"]:
            s = fuzz.token_set_ratio(tn, norm_title(w.get("title","")))
            if s > best_s:
                best, best_s = w, s
    S2_CACHE[key] = best
    save_json(S2_CACHE_F, S2_CACHE)
    time.sleep(BASE_PAUSE)
    return best

def doi_is_arxiv(doi: str) -> str|None:
    m = re.match(r"10\.48550/([aA]r[Xx]iv)\.(\d{4}\.\d{4,5})(v\d+)?", doi or "")
    if m: return m.group(2)
    return None

# ---------- Crossref（补充引用列表） ----------
def crossref_by_doi(doi: str):
    key = f"doi:{doi}"
    if key in CR_CACHE: return CR_CACHE[key]
    url = f"{BASE_CR}/{quote(doi, safe='')}"
    j = get_json(url)
    # 标准化为：{"DOI": ..., "references":[{"doi": "10.xxx", "title":"..."}]}
    out = None
    if j and j.get("message"):
        msg = j["message"]
        refs = msg.get("reference") or []
        norm_refs = []
        for r in refs:
            rdoi = (r.get("DOI") or "").strip()
            rtitle = (r.get("article-title") or r.get("unstructured") or "").strip()
            if rdoi or rtitle:
                norm_refs.append({"doi": rdoi, "title": rtitle})
        out = {"DOI": (msg.get("DOI") or "").strip(), "references": norm_refs}
    CR_CACHE[key] = out
    save_json(CR_CACHE_F, CR_CACHE)
    time.sleep(BASE_PAUSE)
    return out

# ---------- 主流程 ----------
def main():
    df = load_items()
    print(f"📚 items: {len(df)} ; with DOI: {(df['doi']!='').sum()}")

    doi2id = {d.lower(): i for d,i in zip(df["doi"], df["id"]) if d}
    title2id = {}
    for i, tn in zip(df["id"], df["title_norm"]):
        title2id.setdefault(tn, []).append(i)

    id_map_oa, id_map_s2, id_map_cr, misses = {}, {}, {}, []

    for _, row in tqdm(df.iterrows(), total=len(df)):
        pid, title, year, doi = row["id"], row["title"], row["year"], row["doi"]
        found = False

        # ---- OpenAlex ----
        if not SKIP_OPENALEX:
            work = None
            if doi:
                work = oa_by_doi(doi)
            if not work:
                work = oa_by_title(title, year)
            if work and work.get("id"):
                id_map_oa[pid] = {
                    "doi": doi,
                    "openalex": work.get("id"),
                    "refs": work.get("referenced_works") or []
                }
                found = True

        # ---- Semantic Scholar ----（即使 OA 命中也可再补全参考文献）
        if (ENRICH_WITH_S2 or not found) and not SKIP_S2:
            s2 = None
            if doi:
                s2 = s2_paper_by_doi(doi)
                if not s2:
                    ax = doi_is_arxiv(doi)
                    if ax:
                        s2 = s2_paper_by_arxiv(ax)
            if not s2:
                ax2 = extract_arxiv_from_title(title)
                if ax2:
                    s2 = s2_paper_by_arxiv(ax2)
            if not s2:
                s2 = s2_search_title(title, year)
            if s2 and s2.get("paperId"):
                refs = s2.get("references") or []
                ref_min = []
                for r in refs:
                    rd = (r.get("doi") or (r.get("externalIds") or {}).get("DOI") or "").strip()
                    rt = (r.get("title") or "").strip()
                    ref_min.append({"doi": rd, "title": rt})
                id_map_s2[pid] = {"doi": doi, "paperId": s2.get("paperId"), "refs": ref_min}
                found = True or found

        # ---- Crossref ----（最后兜底）
        if not found and not SKIP_CROSSREF and doi:
            cr = crossref_by_doi(doi)
            if cr and (cr.get("references") or []):
                id_map_cr[pid] = {"doi": doi, "refs": cr["references"]}
                found = True

        if not found:
            misses.append({"id": pid, "title": title, "doi": doi, "year": year})

    # 映射表
    if id_map_oa:
        rows = [{"id": k, "doi": v.get("doi"), "openalex": v.get("openalex"), "refs": len(v.get("refs",[]))} for k,v in id_map_oa.items()]
        pd.DataFrame(rows).to_csv(MAP_OPENALEX, index=False)
        print(f"OpenAlex map: {MAP_OPENALEX} ({len(rows)} rows)")
    if id_map_s2:
        rows = [{"id": k, "doi": v.get("doi"), "paperId": v.get("paperId"), "refs": len(v.get("refs",[]))} for k,v in id_map_s2.items()]
        pd.DataFrame(rows).to_csv(MAP_S2, index=False)
        print(f"S2 map: {MAP_S2} ({len(rows)} rows)")
    if id_map_cr:
        rows = [{"id": k, "doi": v.get("doi"), "refs": len(v.get("refs",[]))} for k,v in id_map_cr.items()]
        pd.DataFrame(rows).to_csv(MAP_CROSSREF, index=False)
        print(f"Crossref map: {MAP_CROSSREF} ({len(rows)} rows)")
    if misses:
        pd.DataFrame(misses).to_csv(MISS_CSV, index=False)
        print(f"Missed: {MISS_CSV} ({len(misses)} rows)")

    # 生成库内→库内 edges
    edges = []

    # A) OpenAlex：两条路径产生边
    #  A1) 直接 OA-ID 命中库内
    oa2lib = {v["openalex"]: k for k,v in id_map_oa.items() if v.get("openalex")}
    for lib_id, meta in id_map_oa.items():
        for ref_oa in (meta.get("refs") or []):
            # a) 直接 OA-ID 命中库内
            lib2 = oa2lib.get(ref_oa)
            if lib2:
                edges.append({"citer": lib_id, "cited": lib2})
                continue
            # b) 反查 ref_oa 的 DOI，再与库内 DOI 匹配
            det = oa_work_meta(ref_oa)
            ref_doi = (det or {}).get("doi") or ""
            ref_doi = ref_doi.strip().lower()
            if ref_doi and ref_doi in doi2id:
                edges.append({"citer": lib_id, "cited": doi2id[ref_doi]})

    # B) S2：按 DOI（优先）或标题近似
    for lib_id, meta in id_map_s2.items():
        for r in (meta.get("refs") or []):
            r_doi = (r.get("doi") or "").lower().strip()
            if r_doi and r_doi in doi2id:
                edges.append({"citer": lib_id, "cited": doi2id[r_doi]})
                continue
            tn = norm_title(r.get("title") or "")
            if tn and tn in title2id:
                edges.append({"citer": lib_id, "cited": title2id[tn][0]})
                continue
            # 模糊匹配（>=92）
            best_id, best_s = None, -1
            for cand_tn, cand_ids in title2id.items():
                s = fuzz.token_set_ratio(tn, cand_tn)
                if s > best_s:
                    best_s, best_id = s, cand_ids[0]
            if best_s >= 92:
                edges.append({"citer": lib_id, "cited": best_id})

    # C) Crossref：同样按 DOI/标题匹配
    for lib_id, meta in id_map_cr.items():
        for r in (meta.get("refs") or []):
            r_doi = (r.get("doi") or "").lower().strip()
            if r_doi and r_doi in doi2id:
                edges.append({"citer": lib_id, "cited": doi2id[r_doi]})
                continue
            tn = norm_title(r.get("title") or "")
            if tn and tn in title2id:
                edges.append({"citer": lib_id, "cited": title2id[tn][0]})
                continue
            best_id, best_s = None, -1
            for cand_tn, cand_ids in title2id.items():
                s = fuzz.token_set_ratio(tn, cand_tn)
                if s > best_s:
                    best_s, best_id = s, cand_ids[0]
            if best_s >= 92:
                edges.append({"citer": lib_id, "cited": best_id})

    # 写出
    OUT_EDGES.parent.mkdir(parents=True, exist_ok=True)
    if edges:
        pd.DataFrame(edges).drop_duplicates().to_csv(OUT_EDGES, index=False)
        print(f"🧩 edges written: {OUT_EDGES} ({len(edges)} rows before dedup)")
    else:
        pd.DataFrame(columns=["citer","cited"]).to_csv(OUT_EDGES, index=False)
        print("⚠️ 还是没形成库内→库内引用边（可能互相不引用）。已写入空 edges.csv。"
              " 可考虑导入几篇彼此互引的论文后重跑。")

if __name__ == "__main__":
    main()
