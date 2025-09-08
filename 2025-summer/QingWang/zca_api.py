# -*- coding: utf-8 -*-
from __future__ import annotations
import os, json, re, math
from pathlib import Path
from typing import Any, Dict, List, Tuple, Optional

import numpy as np
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.responses import HTMLResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ====================== OpenAI ======================
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
try:
    from openai import OpenAI  # type: ignore
    _openai = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None
except Exception:
    _openai = None

ZCA_MODEL        = os.getenv("ZCA_MODEL","gpt-4o-mini")
ZCA_TEMPERATURE  = float(os.getenv("ZCA_TEMPERATURE","0.2"))
MAX_SNIPPETS     = int(os.getenv("ZCA_MAX_SNIPPETS","8"))
SEMANTIC_QE      = bool(int(os.getenv("SEMANTIC_QE","1")))
USE_RERANK       = bool(int(os.getenv("RERANK","0")))
ALLOW_FULL       = bool(int(os.getenv("ALLOW_FULL_TEXT","0")))

# ====================== vitality2 REST ======================
import requests
from urllib.parse import urljoin

V2_BASE_URL   = os.getenv("V2_BASE_URL", "http://127.0.0.1:3000")
ZCA_BACKEND   = os.getenv("ZCA_BACKEND", "vitality2").lower()
V2_EMBEDDING  = os.getenv("V2_EMBEDDING", "specter").lower()
V2_DIMENSIONS = os.getenv("V2_DIMENSIONS", "nd").lower()

class Vitality2Client:
    def __init__(self, base_url: str):
        self.base = base_url.rstrip("/") + "/"

    def _post_json(self, path: str, payload: dict, timeout: float = 40.0):
        url = urljoin(self.base, path.lstrip("/"))
        r = requests.post(url, json=payload, headers={"Content-Type":"application/json"}, timeout=timeout)
        r.raise_for_status()
        try:
            return r.json()
        except Exception:
            return json.loads(r.text)

    def similar_by_keyword(self, keywords: List[str], limit: int = 10):
        return self._post_json("/getSimilarPapersByKeyword", {"input_data": keywords, "limit": int(limit)})

    def similar_by_abstract(self, text: str, limit: int = 10):
        return self._post_json("/getSimilarPapersByAbstract", {"input_data": {"title": text[:200], "abstract": text}, "limit": int(limit)})

    def similar_by_titles(self, titles: List[str], limit: int = 10,
                          embedding: str = V2_EMBEDDING, dimensions: str = V2_DIMENSIONS):
        payload = {"input_type":"Title","input_data":titles,"embedding":embedding,"dimensions":dimensions,"limit":int(limit)}
        return self._post_json("/getSimilarPapers", payload)

    @staticmethod
    def to_hits(items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        hits = []
        for it in (items or []):
            pid   = it.get("ID") or it.get("id") or it.get("_id") or it.get("Url") or it.get("URL") or it.get("Title") or ""
            title = it.get("Title") or it.get("title") or it.get("shortTitle") or pid
            url   = it.get("URL") or it.get("Url") or it.get("url") or ""
            score = it.get("score") or it.get("similarity") or 0.0
            abs_  = (it.get("Abstract") or it.get("abstract") or it.get("abstractNote") or
                     it.get("summary") or it.get("Summary") or it.get("note") or
                     it.get("description") or it.get("Description") or "")
            hits.append({"id": str(pid),"score": float(score) if isinstance(score,(int,float)) else 0.0,
                        "title": str(title), "url": str(url or pid), "abstract": abs_})
        return hits

_V2 = Vitality2Client(V2_BASE_URL)

def _as_list(items):
    if isinstance(items, dict):
        for k in ("results","data","items"):
            v = items.get(k)
            if isinstance(v, list):
                return v
        return []
    return items or []

# ====================== Local FAISS Fallback ======================
ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
INDEX_F = DATA / "faiss.index"
META_F  = DATA / "meta.json"
CORPUS_F= DATA / "corpus.jsonl"
EDGES_CSV = DATA / "edges.csv"
DEFAULT_DIM = 384

try:
    import faiss  # type: ignore
except Exception:
    faiss = None

STATE: Dict[str, Any] = dict(index=None, ids=[], id2meta={}, id2row={}, dim=DEFAULT_DIM,
                             chunk_text={}, chunk2doc={}, doc2chunks={}, edges=set())

def _load_meta(path: Path) -> Tuple[List[str], Dict[str, Dict[str, Any]], int]:
    if not path.exists(): return [], {}, DEFAULT_DIM
    j = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(j, dict):
        return j.get("ids") or [], j.get("id2meta") or {}, int(j.get("dim") or DEFAULT_DIM)
    if isinstance(j, list):
        if all(isinstance(x, str) for x in j):
            ids=list(j); return ids, {i:{"id":i,"title":i,"url":i} for i in ids}, DEFAULT_DIM
        ids, id2=[], {}
        for r in j:
            if not isinstance(r, dict): continue
            _id = r.get("id") or r.get("doc_id") or r.get("url")
            if not _id: continue
            ids.append(_id)
            rr=dict(r); rr.setdefault("id",_id); rr.setdefault("title", rr.get("title") or _id); rr.setdefault("url", rr.get("url") or _id)
            id2[_id]=rr
        return ids, id2, DEFAULT_DIM
    return [], {}, DEFAULT_DIM

def _load_corpus(path: Path):
    id2text, chunk2doc, doc2chunks = {}, {}, {}
    if path.exists():
        for line in path.read_text(encoding="utf-8").splitlines():
            if not line.strip(): continue
            try: j=json.loads(line)
            except Exception: continue
            cid = j.get("id") or j.get("doc_id") or j.get("url")
            if not cid: continue
            text = j.get("text") or " ".join(str(j.get(k) or "") for k in ("title","abstract","summary","notes","abstractNote","note"))
            id2text[cid]=text
            did = j.get("doc_id") or cid
            chunk2doc[cid]=did
            doc2chunks.setdefault(did, []).append(cid)
    return id2text, chunk2doc, doc2chunks

def _load_edges_csv(path: Path):
    s=set()
    if path.exists():
        for i, line in enumerate(path.read_text(encoding="utf-8").splitlines()):
            if i==0 or not line.strip(): continue
            a,b=[x.strip() for x in line.split(",",1)]
            if a and b: s.add((a,b))
    return s

# ============ Dataset upload & registry ============
UPLOADS_DIR = DATA / "uploads"
REGISTRY_F  = DATA / "uploads_registry.json"
ACTIVE_F    = DATA / "active_dataset.json"

def _now_ts():
    import datetime as _dt
    return _dt.datetime.utcnow().strftime("%Y%m%d-%H%M%S")

def _read_json(path: Path, default):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default

def _write_json(path: Path, obj):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2), encoding="utf-8")

def load_from_dir(dir_path: Path) -> Dict[str, Any]:
    META = dir_path / "meta.json"
    CORP = dir_path / "corpus.jsonl"
    EDG  = dir_path / "edges.csv"
    IDX  = dir_path / "faiss.index"

    ids, id2, dim = _load_meta(META)
    STATE["ids"], STATE["id2meta"], STATE["dim"] = ids, id2, dim
    STATE["id2row"] = {pid:i for i,pid in enumerate(ids)}
    STATE["index"] = faiss.read_index(str(IDX)) if (faiss and IDX.exists()) else None
    ct, c2d, d2c = _load_corpus(CORP)
    STATE["chunk_text"], STATE["chunk2doc"], STATE["doc2chunks"] = ct, c2d, d2c
    STATE["edges"] = _load_edges_csv(EDG)
    return {"docs": len(ids), "faiss": bool(STATE["index"] is not None),
            "edges": len(STATE["edges"]), "has_corpus": bool(ct), "dir": str(dir_path)}

def load_all() -> Dict[str, Any]:
    active = _read_json(ACTIVE_F, {})
    d = Path(active.get("dir") or DATA)
    return load_from_dir(d)

_EMB=None
def _embedder():
    global _EMB
    if _EMB is None:
        from sentence_transformers import SentenceTransformer  # type: ignore
        _EMB = SentenceTransformer(os.getenv("ZCA_EMB","sentence-transformers/all-MiniLM-L6-v2"))
    return _EMB
def _embed_query(q: str) -> np.ndarray:
    v=_embedder().encode([q], normalize_embeddings=True); return v[0].astype("float32")
def _faiss_search(q: str, top_k: int=10):
    idx=STATE["index"]; ids=STATE["ids"]; id2=STATE["id2meta"]
    if idx is None or not ids: return []
    top_k=max(1,min(top_k,50))
    D,I=idx.search(_embed_query(q).reshape(1,-1), min(top_k,len(ids)))
    out=[]
    for d,i in zip(D[0].tolist(), I[0].tolist()):
        if i<0 or i>=len(ids): continue
        pid=ids[i]; m=id2.get(pid,{})
        out.append({"id":pid,"score":float(d),"title":m.get("title",pid),"url":m.get("url",pid)})
    return out
def _reconstruct(r:int)->Optional[np.ndarray]:
    idx=STATE["index"]
    if idx is None: return None
    try: return idx.reconstruct(r).astype("float32")
    except Exception: return None

# ====================== FastAPI ======================
app = FastAPI(title="Zotero Chat Assistant (Route A)")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.on_event("startup")
def _startup():
    print("[ZCA] loaded:", load_all())

def _pick_text_for_llm(h: Dict[str, Any], raw: Optional[Dict[str,Any]]=None) -> str:
    pid=h.get("id","")
    text=(STATE["chunk_text"].get(pid,"") or "").strip()
    if (not text) and raw:
        for key in ["Abstract","abstract","abstractNote","note","annote","summary","Summary","extra","Extra","description","Description"]:
            val=raw.get(key)
            if isinstance(val,str) and val.strip():
                text=val.strip(); break
    if not text:
        title=h.get("title") or (raw.get("title") if raw else "") or pid
        url=h.get("url") or (raw.get("URL") if raw else "") or ""
        text=f"{title}. {url}".strip()
    return text if ALLOW_FULL else text[:1200]

def _compose_ctx(hits: List[Dict[str,Any]], raw_records: Optional[List[Dict[str,Any]]]=None):
    ctx=[]
    for i,h in enumerate(hits):
        pid=h["id"]; meta=STATE["id2meta"].get(pid,{})
        title=h.get("title") or meta.get("title",pid)
        url=h.get("url") or meta.get("url",pid)
        raw=(raw_records[i] if raw_records and i<len(raw_records) else None)
        text=_pick_text_for_llm(h, raw=raw)
        if text: ctx.append({"id":pid,"title":title,"url":url,"text":text})
    return ctx

def semantic_rewrite_and_expand(q: str) -> Dict[str, Any]:
    if not _openai or not SEMANTIC_QE:
        toks=[w for w in re.split(r"\W+", q) if w]; return {"query": q, "keywords": toks[:8]}
    sys=("You are a query rewriting assistant for academic search. "
         "Rewrite the question to a concise English query and propose 5–10 keywords. Output JSON keys: query, keywords.")
    try:
        rsp=_openai.chat.completions.create(model=ZCA_MODEL, temperature=0.0,
                messages=[{"role":"system","content":sys},{"role":"user","content":q}])
        txt=rsp.choices[0].message.content or ""
        m=re.search(r"\{.*\}", txt, re.S)
        if m:
            out=json.loads(m.group(0))
            if "query" in out and "keywords" in out:
                return {"query": out["query"], "keywords": out["keywords"][:12]}
    except Exception:
        pass
    toks=[w for w in re.split(r"\W+", q) if w]; return {"query": q, "keywords": toks[:8]}

def rerank_snippets(query: str, ctx: List[Dict[str,Any]], topn:int):
    if not USE_RERANK or len(ctx)<=1: return ctx[:topn]
    try:
        from sentence_transformers import CrossEncoder  # type: ignore
        model=CrossEncoder(os.getenv("RERANK_MODEL","cross-encoder/ms-marco-MiniLM-L-6-v2"))
        scores=model.predict([(query,c["text"]) for c in ctx]).tolist()
        ranked=sorted(zip(ctx,scores), key=lambda x:-x[1])
        return [c for c,_ in ranked[:topn]]
    except Exception:
        return ctx[:topn]

# ---------- Dataset management APIs ----------
from fastapi import UploadFile, File, Form

class DatasetInfo(BaseModel):
    dataset_id: str
    user: Optional[str] = None
    dir: str
    created_at: str
    files: List[str]

def _list_registry() -> List[Dict[str,Any]]:
    return _read_json(REGISTRY_F, [])

def _save_registry(items: List[Dict[str,Any]]):
    _write_json(REGISTRY_F, items)

@app.post("/upload_dataset")
async def upload_dataset(
    user: Optional[str] = Form(None),
    meta: UploadFile = File(...),
    corpus: Optional[UploadFile] = File(None),
    edges: Optional[UploadFile] = File(None),
    faiss_idx: Optional[UploadFile] = File(None)
):
    who = (user or "anon").strip() or "anon"
    ts = _now_ts()
    dest = UPLOADS_DIR / who / ts
    dest.mkdir(parents=True, exist_ok=True)

    saved = []
    async def _save(file: UploadFile, name: str):
        p = dest / name
        b = await file.read()
        p.write_bytes(b)
        saved.append(name)

    if not meta or meta.filename == "":
        raise HTTPException(400, "meta.json is required")
    await _save(meta, "meta.json")
    if corpus:    await _save(corpus, "corpus.jsonl")
    if edges:     await _save(edges, "edges.csv")
    if faiss_idx: await _save(faiss_idx, "faiss.index")

    dataset_id = f"{who}:{ts}"
    reg = _list_registry()
    reg.append({
        "dataset_id": dataset_id,
        "user": who,
        "dir": str(dest),
        "created_at": ts,
        "files": saved
    })
    _save_registry(reg)

    _write_json(ACTIVE_F, {"dataset_id": dataset_id, "dir": str(dest)})
    status = load_from_dir(dest)

    return {"ok": True, "dataset_id": dataset_id, "dir": str(dest), "files": saved, "status": status}

@app.get("/datasets")
def list_datasets(user: Optional[str] = None):
    items = _list_registry()
    if user:
        items = [x for x in items if x.get("user") == user]
    active = _read_json(ACTIVE_F, {})
    return {"items": items, "active": active}

@app.post("/datasets/activate")
def activate_dataset(dataset_id: str):
    items = _list_registry()
    cand = next((x for x in items if x.get("dataset_id")==dataset_id), None)
    if not cand:
        raise HTTPException(404, "dataset_id not found")
    _write_json(ACTIVE_F, {"dataset_id": dataset_id, "dir": cand["dir"]})
    status = load_from_dir(Path(cand["dir"]))
    return {"ok": True, "active": {"dataset_id": dataset_id, "dir": cand["dir"]}, "status": status}

@app.delete("/datasets/delete")
def delete_dataset(dataset_id: str):
    items = _list_registry()
    keep = [x for x in items if x.get("dataset_id")!=dataset_id]
    if len(keep)==len(items):
        raise HTTPException(404, "dataset_id not found")
    _save_registry(keep)
    active = _read_json(ACTIVE_F, {})
    if active.get("dataset_id")==dataset_id:
        _write_json(ACTIVE_F, {"dir": str(DATA)})
        load_from_dir(DATA)
    return {"ok": True, "left": len(keep)}

# ---------- Existing APIs ----------
@app.get("/version")
def version():
    active = _read_json(ACTIVE_F, {})
    return {"backend": ZCA_BACKEND, "v2_embedding": V2_EMBEDDING, "v2_dimensions": V2_DIMENSIONS, **load_all(), "active": active}

@app.get("/search")
def search(q: str = Query(..., min_length=1), k: int = 10):
    k=max(1,min(int(k),50))
    if ZCA_BACKEND=="vitality2":
        try:
            kws=[w for w in re.split(r"\W+", q) if w]
            raw = _V2.similar_by_keyword(kws, limit=k) if kws else _V2.similar_by_abstract(q, limit=k)
            items = _as_list(raw)
            hits = Vitality2Client.to_hits(items)
            print(f"[ZCA][search] q='{q}' vitality2 hits={len(hits)} (raw_len={len(items)})")
            return {"results": hits}
        except Exception as e:
            print("[ZCA] vitality2 search error:", e)
    hits = _faiss_search(q,k)
    print(f"[ZCA][search] q='{q}' local hits={len(hits)}")
    return {"results": hits}

# ====================== Compare ======================
@app.get("/compare")
def compare(a: str, b: str):
    a_id, b_id = a.strip(), b.strip()
    id2 = STATE["id2meta"]
    edges = STATE["edges"]

    def title_of(pid: str) -> str:
        return id2.get(pid, {}).get("title", pid)
    def url_of(pid: str) -> str:
        return id2.get(pid, {}).get("url", pid)

    outA = {dst for (src, dst) in edges if src == a_id}
    outB = {dst for (src, dst) in edges if src == b_id}
    inA  = {src for (src, dst) in edges if dst == a_id}
    inB  = {src for (src, dst) in edges if dst == b_id}

    both_cite = list(outA & outB)
    both_cited_by = list(inA & inB)

    both_cite_refs = [{"id": pid, "title": title_of(pid), "url": url_of(pid)} for pid in both_cite]
    both_cited_by_refs = [{"id": pid, "title": title_of(pid), "url": url_of(pid)} for pid in both_cited_by]

    return {
        "a_id": a_id, "b_id": b_id,
        "a_title": title_of(a_id), "b_title": title_of(b_id),
        "a_cites_b": (a_id, b_id) in edges,
        "b_cites_a": (b_id, a_id) in edges,
        "both_cite_refs": both_cite_refs, "both_cited_by_refs": both_cited_by_refs,
        "summary_ready": True
    }

# ====================== Chat ======================
class ChatReq(BaseModel):
    q: str = Field("", description="user question (qa mode)")
    query: Optional[str] = None
    top_k: int = 6
    scope_ids: Optional[List[str]] = None
    task: str = Field("qa", description="qa | summarize | compare")
    target_ids: Optional[List[str]] = Field(None)
    title: Optional[str] = Field(None)

@app.post("/chat")
async def chat(request: Request, req: ChatReq = None):
    try:
        data = await request.json()
        if not isinstance(data, dict):
            data = {}
    except Exception:
        data = {}

    if req is None:
        req = ChatReq(**{k:v for k,v in data.items() if k in {"q","query","top_k","scope_ids","task","target_ids","title"}})

    q_text = (req.q or req.query or data.get("q") or data.get("query") or "").strip()
    task = (req.task or data.get("task") or "qa").strip().lower()
    top_k = int(data.get("top_k", req.top_k if req.top_k else 6) or 6)

    if task=="qa" and not q_text:
        raise HTTPException(400,"empty query")

    rewritten={"query":q_text,"keywords":[]}
    if task=="qa" and q_text:
        rewritten=semantic_rewrite_and_expand(q_text)

    items_for_ctx: Optional[List[Dict[str, Any]]] = None
    hits: List[Dict[str, Any]]

    try:
        if ZCA_BACKEND=="vitality2":
            if task=="summarize":
                titles = req.target_ids or ([req.title] if req.title else [])
                if not titles: raise HTTPException(400, "summarize requires target_ids or title")
                items_for_ctx=[]
                per = max(3, int(math.ceil(top_k / max(1,len(titles)))))
                for t in titles:
                    items_for_ctx += _as_list(_V2.similar_by_abstract(t, limit=per))
                dedup={}
                for it in items_for_ctx:
                    key = it.get("ID") or it.get("URL") or it.get("Title")
                    if key and key not in dedup: dedup[key]=it
                items_for_ctx=list(dedup.values())[:top_k]
                hits = Vitality2Client.to_hits(items_for_ctx)

            elif task=="compare":
                titles = req.target_ids or []
                if len(titles)<2: raise HTTPException(400,"compare requires two target_ids")
                items_for_ctx=[]
                per = max(2, int(math.ceil(top_k / len(titles))))
                for t in titles:
                    items_for_ctx += _as_list(_V2.similar_by_abstract(t, limit=per))
                dedup={}
                for it in items_for_ctx:
                    key = it.get("ID") or it.get("URL") or it.get("Title")
                    if key and key not in dedup: dedup[key]=it
                items_for_ctx=list(dedup.values())[:top_k]
                hits = Vitality2Client.to_hits(items_for_ctx)

            else:
                items_main=_as_list(_V2.similar_by_abstract(rewritten["query"], limit=top_k))
                items_kw=_as_list(_V2.similar_by_keyword(rewritten["keywords"], limit=top_k)) if rewritten["keywords"] else []
                merged={}
                for it in (items_main or []) + (items_kw or []):
                    key=it.get("ID") or it.get("URL") or it.get("Title")
                    if key and key not in merged: merged[key]=it
                items_for_ctx=list(merged.values())[: max(top_k*2, top_k)]
                hits=Vitality2Client.to_hits(items_for_ctx)
        else:
            query=(rewritten["query"] if task=="qa" else (",".join(req.target_ids or []) if req.target_ids else (req.title or "")))
            hits=_faiss_search(query, top_k=top_k)
    except Exception as e:
        print("[ZCA] vitality2 retrieval error:", e)
        query=(rewritten["query"] if task=="qa" else (",".join(req.target_ids or []) if req.target_ids else (req.title or "")))
        hits=_faiss_search(query, top_k=top_k)

    if req.scope_ids:
        scope=set(req.scope_ids)
        hits=[h for h in hits if h["id"] in scope]

    ctx_all=_compose_ctx(hits, raw_records=items_for_ctx)

    if not ctx_all and items_for_ctx:
        tmp=[]
        for it in items_for_ctx[:min(6,len(items_for_ctx))]:
            title=it.get("Title") or it.get("title") or it.get("shortTitle") or it.get("ID") or ""
            url  =it.get("URL") or it.get("Url") or it.get("url") or ""
            if title: tmp.append({"id": it.get("ID") or title, "title": title, "url": url, "text": f"{title}. {url}"})
        ctx_all=tmp

    ctx = rerank_snippets(rewritten.get("query") or q_text or (req.title or ""), ctx_all, topn=min(MAX_SNIPPETS, top_k))
    print(f"[ZCA][chat] task={task} ctx_hits={len(ctx)} items_raw={len(items_for_ctx or [])}")

    def render_sources(n=6):
        return [{"n":i+1,"id":c["id"],"title":c["title"],"url":c["url"]} for i,c in enumerate(ctx[:n])]

    if not _openai:
        if not ctx: return {"answer":"No context found.", "sources":[], "hits":hits, "references": []}
        q_txt=(q_text or " ".join((req.target_ids or [])) or (req.title or "")).lower()
        kws=[w for w in re.split(r"\W+", q_txt) if w and len(w)>2]
        sents=[]
        for i,c in enumerate(ctx[:MAX_SNIPPETS]):
            for s in re.split(r"(?<=[.!?。！？])\s+", c["text"]):
                t=s.strip()
                if not t: continue
                score=sum(1 for k in kws if k in t.lower()) + min(len(t),400)/400.0
                sents.append((score,i,t))
        sents.sort(key=lambda x:-x[0])
        top=[t for _,_,t in sents[:10]]
        half=max(3, math.ceil(len(top)/2))
        p1=" ".join(top[:half]); p2=" ".join(top[half:])
        lead="Based on the retrieved papers, we observe the following: "
        tail=" These statements are grounded in the retrieved snippets [1]–[{}].".format(min(len(ctx), MAX_SNIPPETS))
        ans=(lead+p1).strip()
        if p2: ans+="\n\n"+p2.strip()
        ans+=tail
        return {"answer": ans, "sources": render_sources(), "hits": hits, "references": render_sources()}

    def build_prompt()->List[Dict[str,str]]:
        sys=("You are a rigorous academic assistant. Use ONLY the provided snippets. "
             "Write 2–3 cohesive paragraphs (~120–220 words). "
             "Integrate information across snippets; do not just list paper titles. "
             "Cite snippet indices like [1],[2]; if evidence is insufficient, say so.")
        if task=="summarize":
            header=("Task: Summarize the target paper in 2–3 paragraphs covering problem, method, data, findings, limitations, contributions.\n"
                    f"Target(s): {', '.join(req.target_ids or ([req.title] if req.title else []))}")
        elif task=="compare":
            header=("Task: Compare the two target papers in 2–3 paragraphs, covering problem focus, methods, datasets, results, limitations, impact.\n"
                    f"Target(s): {', '.join(req.target_ids or [])}")
        else:
            header=("Task: Answer the user's question with 2–3 paragraphs grounded strictly in the snippets.\n"
                    f"Question: {q_text}")
        snippets="\n".join([f"[{i+1}] {c['title']}: {c['text']}" for i,c in enumerate(ctx[:MAX_SNIPPETS])])
        user=header + "\n\nSnippets:\n" + snippets
        return [{"role":"system","content":sys},{"role":"user","content":user}]

    try:
        rsp=_openai.chat.completions.create(model=ZCA_MODEL, temperature=ZCA_TEMPERATURE, messages=build_prompt())
        ans=rsp.choices[0].message.content
    except Exception as e:
        ans=f"(offline draft due to OpenAI API error: {e})"
    return {"answer": ans, "sources": render_sources(), "hits": hits, "references": render_sources()}

# ====================== Cluster Core (shared) ======================
def _cluster_core(ids: List[str], scale_x: float = 1.0, scale_y: float = 1.0):
    ids=[x.strip() for x in ids if x.strip()]
    if not ids: return [], [], []
    rows=[STATE["id2row"].get(i) for i in ids]; rows=[r for r in rows if r is not None]
    if not rows: raise HTTPException(400,"IDs not found in meta.json")
    vecs, kept=[], []
    for r in rows:
        v=_reconstruct(r)
        if v is not None: vecs.append(v); kept.append(STATE["ids"][r])
    if not vecs: raise HTTPException(400,"Vectors not reconstructable from FAISS.")
    X=np.vstack(vecs).astype("float32")

    from sklearn.decomposition import PCA  # type: ignore
    XY=PCA(n_components=2, random_state=0).fit_transform(X)
    def minmax(a):
        lo,hi=float(a.min()),float(a.max())
        if hi-lo<1e-8: return np.zeros_like(a)
        return (a-lo)/(hi-lo)*2-1
    x=minmax(XY[:,0])*float(scale_x); y=minmax(XY[:,1])*float(scale_y)

    from math import sqrt, ceil
    from sklearn.cluster import KMeans  # type: ignore
    k=max(2, ceil(sqrt(len(kept)))); labels=KMeans(n_clusters=k, n_init=10, random_state=0).fit_predict(X)

    PALETTE=["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf",
             "#393b79","#637939","#8c6d31","#843c39","#7b4173"]
    def color_of(l): return PALETTE[l%len(PALETTE)]

    layout=[{"id":pid,"title":STATE["id2meta"].get(pid,{}).get("title",pid),
             "x":float(x[i]),"y":float(y[i]),"cluster":f"cluster-{int(labels[i])}","color":color_of(int(labels[i]))}
            for i,pid in enumerate(kept)]
    clusters: Dict[str,List[str]]={}
    for i,pid in enumerate(kept): clusters.setdefault(f"cluster-{int(labels[i])}",[]).append(pid)
    legend=[{"label":lab,"color":color_of(int(lab.split('-')[-1]))} for lab in clusters.keys()]
    return layout, clusters, legend

# ====================== Cluster API ======================
class ClusterReq(BaseModel):
    ids: List[str]
    scale_x: float = 1.0
    scale_y: float = 1.0

def _map_to_internal_ids(any_ids: List[str]) -> List[str]:
    id2meta = STATE["id2meta"]
    known_ids = set(id2meta.keys())
    url2id: Dict[str,str] = {}
    title2id: Dict[str,str] = {}

    def norm_title(s: str) -> str:
        return re.sub(r"\s+", " ", s.strip().lower())

    for pid, m in id2meta.items():
        url = (m.get("url") or "").strip()
        if url: url2id[url] = pid
        title = (m.get("title") or "").strip()
        if title: title2id[norm_title(title)] = pid

    mapped: List[str] = []
    for x in any_ids:
        if not x: continue
        if x in known_ids:
            mapped.append(x); continue
        if x in url2id:
            mapped.append(url2id[x]); continue
        nx = norm_title(x)
        if nx in title2id:
            mapped.append(title2id[nx]); continue
        if "/" in x:
            tail = x.rsplit("/", 1)[-1]
            if tail in known_ids:
                mapped.append(tail); continue
    return mapped

@app.post("/cluster")
def cluster(req: ClusterReq):
    raw_ids = [s.strip() for s in req.ids if s and s.strip()]
    if not raw_ids:
        raise HTTPException(400, "no ids provided")

    mapped_ids = _map_to_internal_ids(raw_ids)
    if not mapped_ids:
        raise HTTPException(400, "IDs not found in meta.json (title/URL mapping also failed)")

    print(f"[ZCA][cluster] raw={len(raw_ids)} mapped={len(mapped_ids)} -> {mapped_ids[:5]}{'...' if len(mapped_ids)>5 else ''}")
    layout, clusters, legend = _cluster_core(mapped_ids, req.scale_x, req.scale_y)
    return {"clusters":[{"label":k,"ids":v} for k,v in clusters.items()], "layout":layout, "legend":legend}

# -------- Cluster Explanation (NLG) ----------
class ClusterExplainReq(BaseModel):
    ids: List[str]
    top_terms: int = 6
    examples: int = 3

@app.post("/cluster_explain")
def cluster_explain(req: ClusterExplainReq):
    mapped_ids = _map_to_internal_ids([s.strip() for s in req.ids if s and s.strip()])
    if not mapped_ids:
        raise HTTPException(400, "IDs not found for explanation.")
    layout, clusters, legend = _cluster_core(mapped_ids, 1.0, 1.0)

    def text_of(pid: str) -> str:
        meta = STATE["id2meta"].get(pid, {})
        title = meta.get("title") or pid
        txt = STATE["chunk_text"].get(pid, "")
        return f"{title}. {txt}" if txt else title

    outlines=[]
    for lab, ids in clusters.items():
        texts=[text_of(pid) for pid in ids]
        titles=[STATE["id2meta"].get(pid,{}).get("title",pid) for pid in ids]
        try:
            from sklearn.feature_extraction.text import TfidfVectorizer  # type: ignore
            vec = TfidfVectorizer(max_features=200, ngram_range=(1,2), stop_words="english")
            mat = vec.fit_transform(texts)
            scores = np.asarray(mat.sum(axis=0)).ravel()
            idx = np.argsort(-scores)[:req.top_terms]
            vocab = np.array(vec.get_feature_names_out())[idx].tolist()
        except Exception:
            vocab = []
        outlines.append({
            "cluster": lab,
            "size": len(ids),
            "top_terms": vocab,
            "examples": titles[:req.examples]
        })

    if _openai:
        sys = ("You are a data analysis assistant. You will receive cluster outlines of academic papers. "
               "Write 2–3 concise paragraphs (120–220 words) explaining what each cluster represents, "
               "what themes or methods dominate, and any notable differences or overlaps among clusters.")
        user = "Cluster outlines:\n" + json.dumps(outlines, ensure_ascii=False, indent=2)
        try:
            rsp = _openai.chat.completions.create(
                model=ZCA_MODEL, temperature=0.2,
                messages=[{"role":"system","content":sys},{"role":"user","content":user}]
            )
            explanation = rsp.choices[0].message.content or ""
        except Exception as e:
            explanation = f"(offline draft due to OpenAI API error: {e})"
    else:
        parts=[]
        for o in outlines:
            terms = ", ".join(o["top_terms"][:req.top_terms]) if o["top_terms"] else "varied topics"
            ex = "; ".join(o["examples"][:req.examples]) if o["examples"] else ""
            sent = (f"{o['cluster']} groups {o['size']} paper(s), characterized by {terms}."
                    + (f" Examples: {ex}." if ex else ""))
            parts.append(sent)
        explanation = " ".join(parts)

    return {"explanation": explanation, "outline": outlines, "layout": layout, "legend": legend,
            "clusters":[{"label":k,"ids":v} for k,v in clusters.items()]}

# ====================== Minimal English UI ======================
_HTML = """<!doctype html><html><head>
<meta charset="utf-8"/><title>Zotero Chat Assistant</title>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
:root{
  --bg:#ffffff;
  --text:#0f172a;
  --muted:#64748b;
  --card:#ffffff;
  --border:#e5e7eb;
  --primary:#2563eb;
  --primary-weak:#eef2ff;
}
*{box-sizing:border-box}
body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;color:var(--text);background:var(--bg);margin:24px;max-width:1200px}
h1{margin:0 0 14px;font-size:24px;font-weight:700;letter-spacing:.2px}
h2{margin:14px 0 10px;font-size:18px}
.card{border:1px solid var(--border);background:var(--card);border-radius:10px;padding:12px;margin:12px 0;box-shadow:0 1px 0 rgba(0,0,0,0.03)}
.row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.full{flex:1 1 auto;min-width:260px}
input,button,textarea{font:inherit}
input[type=text],textarea{width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;background:#fff}
button{padding:8px 14px;border:1px solid var(--primary);border-radius:8px;background:var(--primary);color:#fff;cursor:pointer;transition:filter .15s ease}
button:hover{filter:brightness(0.95)}
button.secondary{background:#fff;color:var(--primary);border-color:var(--border)}
.muted{color:var(--muted)}
pre{white-space:pre-wrap;word-break:break-word;background:#fafafa;padding:10px;border:1px solid #eee;border-radius:8px}
.pill{display:inline-block;background:var(--primary-weak);border:1px solid #dbeafe;border-radius:999px;padding:2px 8px;margin:2px 6px 2px 0;font-size:12px}
.ref{margin:6px 0;padding:8px 10px;border-radius:10px;background:#f3f6ff;border:1px solid #dbe7ff;display:flex;align-items:flex-start;gap:10px}
.ref a{text-decoration:none}
.ref-badge{flex:0 0 auto;background:var(--primary);color:#fff;font-weight:700;border-radius:6px;padding:2px 8px;line-height:1.3}
#plot{position:relative;border:1px solid var(--border);border-radius:10px;height:420px;background:#fff}
#plot canvas{width:100%;height:100%}
.tip{position:absolute;pointer-events:none;background:#222;color:#fff;font-size:12px;padding:4px 6px;border-radius:6px;opacity:0.92;display:none}
label{color:var(--muted)}
</style></head><body>
<h1>Zotero Chat Assistant</h1>

<div class="card"><h2>Datasets</h2>
  <div class="row">
    <input id="dsUser" placeholder="User (optional)" style="max-width:220px">
    <input id="dsFiles" type="file" multiple accept=".json,.jsonl,.csv,.index" />
    <button id="btnUpload">Upload Files & Activate</button>
    <button id="btnRefreshDs" class="secondary">Refresh List</button>
  </div>
  <div id="dsStatus" class="muted" style="margin-top:6px"></div>
  <div id="dsList" style="margin-top:8px"></div>
</div>

<div class="card"><h2>Chat</h2>
  <textarea id="ask" rows="3" placeholder="Ask a question, 'summarize: &lt;title&gt;', or 'compare: A || B'"></textarea>
  <div class="row" style="margin-top:6px">
    <label>top-k <input id="topk" type="number" value="6" min="1" max="12" style="width:72px;margin-left:4px"></label>
    <button id="btnAsk">Ask</button><span class="muted" id="chatStatus"></span>
  </div>
  <div id="ans" class="card"></div>
  <div id="refs" class="card" style="background:#fcfcff"></div>
</div>

<div class="card"><h2>Search</h2>
  <div class="row">
    <input id="q" class="full" placeholder="e.g., bert / transformer / financial risk / deep learning"/>
    <button id="btnSearch" class="secondary">Search</button><span class="muted" id="pickedCnt">Picked: 0</span>
    <button id="toIDs" class="secondary">Picked → Cluster IDs</button>
    <button id="toA" class="secondary">1st → Compare A</button><button id="toB" class="secondary">2nd → Compare B</button>
  </div>
  <div id="results" style="margin-top:8px"></div>
</div>

<div class="card"><h2>Compare (citations)</h2>
  <div class="row"><input id="a" class="full" placeholder="A: id or Zotero URL or title"/>
    <input id="b" class="full" placeholder="B: id or Zotero URL or title"/><button id="btnCompare">Compare A → B</button></div>
  <div id="cmp" class="card" style="background:#fbfbff"></div>
</div>

<div class="card"><h2>Cluster</h2>
  <div class="row">
    <input id="ids" class="full" placeholder="comma-separated ids (or titles)"/>
    <label>Scale X <input id="sx" type="range" min="0.5" max="2.5" step="0.1" value="1.2"></label>
    <label>Scale Y <input id="sy" type="range" min="0.5" max="2.5" step="0.1" value="1.0"></label>
    <button id="btnCluster">Cluster</button><button id="btnFit" class="secondary">Fit</button>
    <button id="btnExplain" class="secondary">Explain (NLG)</button>
  </div>
  <div id="plot"><canvas id="cv"></canvas><div id="tip" class="tip"></div></div>
  <div id="legend"></div>
  <div id="explain" class="card" style="background:#fcfcff"></div>
</div>

<script>
// ---- helpers ----
const PICKED=new Set(); const $=id=>document.getElementById(id);
function escapeHtml(s){return (s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

// ---- Datasets: upload multiple files ----
function pickBest(files, predicate){ for(const f of files){ if(predicate(f)) return f; } return null; }
function nm(f){ return (f.name||'').trim().toLowerCase().replace(/^.*[\\\/]/,''); } // 去路径 & 统一大小写
function looksMeta(f){
  const n = nm(f);
  const whitelist = ['meta.json','export-data.json','export.json','zotero.json','library.json','items.json'];
  if (whitelist.includes(n)) return true;
  if (/^export[-_].+\.json$/.test(n)) return true; // 兼容 export-*.json
  return false;
}
function ends(file, tail){ return nm(file).endsWith(tail.toLowerCase()); }
function nameEq(file, target){ return nm(file) === target.toLowerCase(); }

async function handleUpload(){
  const files = Array.from($('dsFiles').files||[]);
  if(!files.length){ $('dsStatus').textContent='Please choose files (meta.json is required).'; return; }

  let meta   = pickBest(files, looksMeta);
  const jsons = files.filter(f => ends(f,'.json'));
  if(!meta && jsons.length===1) meta = jsons[0];

  const corpus = pickBest(files, f => nameEq(f,'corpus.jsonl') || ends(f,'.jsonl'));
  const edges  = pickBest(files, f => nameEq(f,'edges.csv')   || ends(f,'.csv'));
  const faiss  = pickBest(files, f => nameEq(f,'faiss.index') || ends(f,'.index'));

  if(!meta){ $('dsStatus').textContent='Missing meta.json / export-data.json'; return; }

  const fd = new FormData();
  const u = $('dsUser').value.trim();
  if(u) fd.append('user', u);
  // 无论原名是什么，都按 meta.json 传给后端
  fd.append('meta', meta, 'meta.json');
  if(corpus) fd.append('corpus', corpus, 'corpus.jsonl');
  if(edges)  fd.append('edges',  edges,  'edges.csv');
  if(faiss)  fd.append('faiss_idx', faiss, 'faiss.index');

  $('dsStatus').textContent='Uploading...';
  try{
    const r = await fetch('/upload_dataset',{method:'POST', body: fd});
    let payload = null, rawText = null;
    const ct = r.headers.get('content-type') || '';
    try{
      if(ct.includes('application/json')) payload = await r.json();
      else rawText = await r.text();
    }catch(e){ rawText = await r.text().catch(()=>null); }

    if(!r.ok || !(payload && payload.ok)){
      const detail = payload?.detail
        ? (typeof payload.detail === 'string' ? payload.detail : JSON.stringify(payload.detail))
        : (rawText || (r.status + ' ' + r.statusText));
      $('dsStatus').textContent = 'Failed: ' + detail;
      console.error('Upload failed:', payload || rawText);
    }else{
      $('dsStatus').textContent = `Uploaded & activated: ${payload.dataset_id}`;
      $('btnRefreshDs').click();
    }
  }catch(err){
    $('dsStatus').textContent = 'Upload error: ' + String(err);
    console.error('Upload error:', err);
  }finally{
    $('dsFiles').value='';
  }
}

async function fetchDatasets(user){
  const u = user ? ('?user='+encodeURIComponent(user)) : '';
  const r = await fetch('/datasets'+u); return await r.json();
}
function renderDsList(j){
  const active = j.active || {}; const items = j.items || [];
  if(!items.length){ $('dsList').innerHTML = '<span class="muted">No uploads yet.</span>'; return; }
  $('dsList').innerHTML = items.map(x=>{
    const isAct = (active.dataset_id && active.dataset_id===x.dataset_id);
    const badge = isAct ? '<span class="pill">active</span>' : '';
    const files = (x.files||[]).map(f=>`<span class="pill">${f}</span>`).join(' ');
    return `<div class="row" style="align-items:center;border-top:1px solid #eee;padding:6px 0">
      <div class="full"><strong>${x.dataset_id}</strong> ${badge}<br><span class="muted">${x.dir}</span><br>${files}</div>
      <button class="secondary" onclick="activateDs('${x.dataset_id}')">Activate</button>
      <button class="secondary" onclick="deleteDs('${x.dataset_id}')">Delete</button>
    </div>`;
  }).join('');
}
async function activateDs(id){
  $('dsStatus').textContent='Activating...';
  const r = await fetch('/datasets/activate',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:'dataset_id='+encodeURIComponent(id)});
  const j = await r.json(); $('dsStatus').textContent = j.ok ? ('Activated: '+id) : ('Failed: '+(j.detail||'')); 
}
async function deleteDs(id){
  if(!confirm('Delete record: '+id+' ? (files kept on disk)')) return;
  const r = await fetch('/datasets/delete?dataset_id='+encodeURIComponent(id),{method:'DELETE'});
  const j = await r.json(); $('dsStatus').textContent = j.ok ? 'Deleted.' : ('Failed: '+(j.detail||'')); 
  $('btnRefreshDs').click();
}
$('btnUpload').onclick = ()=>{ handleUpload(); };
$('btnRefreshDs').onclick = async ()=>{ const j=await fetchDatasets($('dsUser').value.trim()); renderDsList(j); };
$('btnRefreshDs').click();

// ---- Chat ----
function refsHtml(list){
  if(!list || !list.length) return '<span class="muted">No references.</span>';
  return '<h3 style="margin:6px 0">References</h3>' + list.map(r=>{
    const t=escapeHtml(r.title||r.id||'');
    const a=r.url ? `<a href="${r.url}" target="_blank">${t}</a>` : t;
    return `<div class="ref"><span class="ref-badge">[${r.n}]</span><div>${a}</div></div>`;
  }).join('');
}
$('btnAsk').onclick=async()=>{
  const raw=$('ask').value.trim(); if(!raw) return;
  $('chatStatus').textContent='Thinking...';
  let payload={q:raw, top_k:parseInt($('topk').value||'6',10), task:'qa'};
  if(/^summarize\s*:/i.test(raw)){ const title=raw.replace(/^summarize\s*:/i,'').trim();
    payload={q:'', top_k:parseInt($('topk').value||'6',10), task:'summarize', title:title};}
  else if(/^compare\s*:/i.test(raw) && raw.includes('||')){
    const t=raw.replace(/^compare\s*:/i,'').split('||').map(s=>s.trim()).filter(Boolean);
    payload={q:'', top_k:parseInt($('topk').value||'6',10), task:'compare', target_ids:t};}
  const r=await fetch('/chat',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)});
  const j=await r.json(); $('chatStatus').textContent='';
  $('ans').innerHTML='<pre>'+escapeHtml(j.answer||'(no answer)')+'</pre>';
  $('refs').innerHTML=refsHtml(j.sources || j.references);
};

// ---- Search ----
const resultsBox=$('results');
function renderResults(res){
  resultsBox.innerHTML='';
  (res||[]).forEach(it=>{
    const row=document.createElement('div'); row.className='row'; row.style.padding='4px 0'; row.style.alignItems='center';
    row.innerHTML = `<input type="checkbox" class="pick" data-id="${it.id}">
      <span class="pill">score ${(it.score||0).toFixed(3)}</span>
      <a href="${it.url}" target="_blank">${it.title||it.id}</a>
      <span class="muted">${it.id}</span>`;
    resultsBox.append(row);
  });
  resultsBox.querySelectorAll('input.pick').forEach(cb=>{
    const id=cb.getAttribute('data-id'); cb.checked=PICKED.has(id);
    cb.addEventListener('change',()=>{ if(cb.checked) PICKED.add(id); else PICKED.delete(id); $('pickedCnt').textContent='Picked: '+PICKED.size;});
  });
  $('pickedCnt').textContent='Picked: '+PICKED.size;
}
$('btnSearch').onclick=async()=>{
  const q=$('q').value.trim(); if(!q) return;
  const r=await fetch('/search?q='+encodeURIComponent(q)); const j=await r.json(); renderResults(j.results||[]);
};
$('toIDs').onclick=()=>{ $('ids').value=[...PICKED].join(','); };
$('toA').onclick=()=>{ const a=[...PICKED][0]; if(a) $('a').value=a; };
$('toB').onclick=()=>{ const b=[...PICKED][1]; if(b) $('b').value=b; };

// ---- Compare ----
function refsListHtml(list){
  if(!list || !list.length) return '<div class="muted">None.</div>';
  return list.map(r=>{
    const t = escapeHtml(r.title || r.id || '');
    const a = r.url ? `<a href="${r.url}" target="_blank">${t}</a>` : t;
    return `<div class="ref"><span class="ref-badge">•</span><div>${a}</div></div>`;
  }).join('');
}
$('btnCompare').onclick=async()=>{
  const a=$('a').value.trim(), b=$('b').value.trim(); if(!a||!b) return;
  const r=await fetch('/compare?a='+encodeURIComponent(a)+'&b='+encodeURIComponent(b));
  const j=await r.json();

  const aTitle = escapeHtml(j.a_title || j.a_id || 'A');
  const bTitle = escapeHtml(j.b_title || j.b_id || 'B');
  const ab = j.a_cites_b ? `${aTitle} cites ${bTitle}` : `${aTitle} does not cite ${bTitle}`;
  const ba = j.b_cites_a ? `${bTitle} cites ${aTitle}` : `${bTitle} does not cite ${aTitle}`;

  const bothCiteCnt = (j.both_cite_refs||[]).length;
  const bothCitedByCnt = (j.both_cited_by_refs||[]).length;

  let html = `<div><strong>Summary</strong><br/>
    ${ab}; ${ba}.<br/>`;

  if(bothCiteCnt>0){
    html += `Both papers <strong>co-reference</strong> ${bothCiteCnt} paper(s) (below):</div>`;
  }else{
    html += `No <strong>common references</strong> were found.</div>`;
  }
  html += `<div style="margin:8px 0 16px 0">${refsListHtml(j.both_cite_refs||[])}</div>`;

  if(bothCitedByCnt>0){
    html += `<div>There are ${bothCitedByCnt} paper(s) that <strong>cite both</strong> (below):</div>`;
  }else{
    html += `<div>No <strong>common citers</strong> were found.</div>`;
  }
  html += `<div style="margin:8px 0">${refsListHtml(j.both_cited_by_refs||[])}</div>`;

  $('cmp').innerHTML = html;
};

// ---- Cluster drawing ----
let lastLayout=null;
function fitCanvas(){const div=$('plot'),cv=$('cv'); cv.width=div.clientWidth; cv.height=div.clientHeight;}
function drawPoints(layout,legend){fitCanvas(); const cv=$('cv'),ctx=cv.getContext('2d'); ctx.clearRect(0,0,cv.width,cv.height);
  layout.forEach(p=>{const x=(p.x*0.48+0.5)*cv.width, y=(1-(p.y*0.48+0.5))*cv.height; ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2);
    ctx.fillStyle=p.color||'#333'; ctx.fill(); p._px=x; p._py=y;});
}
function fmtMs(ms){ if(ms < 1000) return ms.toFixed(0)+' ms'; return (ms/1000).toFixed(2)+' s'; }

document.getElementById('btnCluster').onclick=async()=>{
  let ids=$('ids').value.trim();
  if(!ids){ ids=[...PICKED].join(','); $('ids').value=ids; }
  ids = $('ids').value.trim();
  if(!ids){ alert('Please select results or input ids/titles first.'); return; }

  const sx=parseFloat($('sx').value||'1.0'), sy=parseFloat($('sy').value||'1.0');
  $('explain').innerHTML = '<span class="muted">Clustering…</span>';

  const t0 = performance.now();
  let layoutResp, clusterJson;
  try{
    layoutResp = await fetch('/cluster',{method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ids:ids.split(',').map(s=>s.trim()).filter(Boolean),scale_x:sx,scale_y:sy})});
    if(!layoutResp.ok){
      const txt=await layoutResp.text();
      alert('Cluster error: '+txt);
      $('explain').innerHTML = '<span class="muted">Cluster error: '+escapeHtml(txt)+'</span>';
      return;
    }
    clusterJson = await layoutResp.json();
  }catch(err){
    alert('Cluster request failed: '+err);
    $('explain').innerHTML = '<span class="muted">Cluster request failed: '+escapeHtml(String(err))+'</span>';
    return;
  }
  const t1 = performance.now();

  lastLayout = clusterJson.layout || [];
  drawPoints(lastLayout, clusterJson.legend || []);

  $('explain').innerHTML = '<span class="muted">Explaining clusters…</span>';
  const t2 = performance.now();
  try{
    const expResp = await fetch('/cluster_explain',{method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ ids: ids.split(',').map(s=>s.trim()).filter(Boolean), top_terms: 6, examples: 3 })});
    if(!expResp.ok){
      const txt=await expResp.text();
      $('explain').innerHTML = '<span class="muted">Explain error: '+escapeHtml(txt)+'</span>';
      return;
    }
    const expJson = await expResp.json();
    const t3 = performance.now();

    const tCluster = fmtMs(t1 - t0);
    const tExplain = fmtMs(t3 - t2);

    const para = escapeHtml(expJson.explanation || '(no explanation)');
    $('explain').innerHTML =
      `<div style="margin-bottom:6px" class="muted">Cluster time: <strong>${tCluster}</strong> · Explain time: <strong>${tExplain}</strong></div>`+
      `<pre>${para}</pre>`;
  }catch(err){
    $('explain').innerHTML = '<span class="muted">Explain request failed: '+escapeHtml(String(err))+'</span>';
  }
};
document.getElementById('btnFit').onclick=()=>{ drawPoints(lastLayout||[], []); };
$('btnExplain').onclick=async()=>{
  const ids=$('ids').value.trim(); if(!ids){ alert('Please provide ids or pick results first.'); return; }
  $('explain').innerHTML='<span class="muted">Generating explanation…</span>';
  const r=await fetch('/cluster_explain',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ids:ids.split(',').map(s=>s.trim()).filter(Boolean)})});
  if(!r.ok){ const t=await r.text(); $('explain').innerHTML='<span class="muted">Error: '+escapeHtml(t)+'</span>'; return; }
  const j=await r.json();
  $('explain').innerHTML = '<pre>'+escapeHtml(j.explanation||'(no explanation)')+'</pre>';
};
</script>
</body></html>
"""

# 禁止缓存 /ui，避免浏览器保留旧版 HTML
@app.get("/ui")
def ui(ts: Optional[int]=None):
    return Response(
        content=_HTML,
        media_type="text/html",
        headers={"Cache-Control":"no-store, no-cache, must-revalidate, max-age=0","Pragma":"no-cache","Expires":"0"},
    )

# 可选：去掉 favicon 404
@app.get("/favicon.ico")
def favicon():
    return HTMLResponse("", status_code=204)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("zca_api:app", host="127.0.0.1", port=3031, reload=True)
