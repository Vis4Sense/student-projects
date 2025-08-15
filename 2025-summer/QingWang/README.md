# Pain Points

1. Diverse import formats, high setup cost
  PDF, BibTeX, web pages, database exports use different schemas;
  Manual import and metadata cleaning are laborious.

2. Low retrieval efficiency, limited keyword search
  Keyword matching misses semantically relevant papers;
  Requires repeated filtering to find truly related work.

3. Scattered notes and highlights
  Highlights/annotations spread across PDF readers and docs;
  Hard to locate and reuse notes during writing.

4. Opaque topic structure and citation relations
  Hard to see which papers share themes or methods;
  Difficult to grasp the overall field structure and citation network.

5. Time-consuming review writing, lack of structured summaries
  Manual summarization and citation insertion take too long;
  Difficult to quickly draft a coherent review outline.

6. Cumbersome iterative filtering
  Filtering by year, author, keywords requires rerunning searches;
  No conversational interface for incremental refinement.

# Proposed Features
Pain	Feature	Description

1. One-Click Multi-Source Import & Metadata Cleaning	Support drag-and-drop folder, paste BibTeX/URL, import database exports; auto-normalize title, author, abstract, DOI, year, etc.
2.	Natural-Language Semantic Search	Allow full-sentence or question queries (e.g., “BERT applications in medical imaging”) over a local semantic index.
3.	Unified Notes & Highlights Hub	Embedded reader in plugin for highlighting and note-taking, auto-linked to bibliographic entries, searchable by tag/theme.
4.	Topic Clustering & Citation Network Visualization	Cluster selected papers, render scatter/force-directed plots; visualize citation/co-citation graphs. Charts support zoom/export but no text interpretation.
5.	Automated Summary & Outline Generation	Invoke RAG model to produce review outlines or draft paragraphs with in-text citation markers at one click.
6.	Conversational Filtering & Iteration	Built-in chat window lets users refine filters (e.g., “only papers after 2020,” “exclude method X”), updating retrieval, clustering, or comparison results in real time.

Wireframe：https://www.figma.com/design/CaHpdBnP3Lxpkptr9TcGG3/Untitled?node-id=0-1&m=dev&t=BIAdWvNT9FiQrRuG-1

1. Progress to date (right before “pack .xpi”)
(1) Environment & structure

Windows + PyCharm + venv (Python 3.11).

Dependencies: flask, flask-cors, numpy, pandas, scikit-learn, sentence-transformers, requests, streamlit(optional).

Layout:

data/: export-data.json (Zotero export), papers_cleaned.tsv, vector_store.json

my_project/: zotero_preprocess.py, generate_embeddings.py, server_min.py, plugin/…

my_project/plugin/: manifest.json, sidebar.html, sidebar.js (Zotero sidebar prototype)

(2) Data pipeline (Zotero → embeddings)

Exported export-data.json from Zotero.

zotero_preprocess.py: normalize metadata (id/key, title, creators, date(year), abstractNote, tags) → papers_cleaned.tsv.

generate_embeddings.py: SentenceTransformers all-MiniLM-L6-v2 (CPU) on title + abstract, L2-normalized → persisted to vector_store.json.

(3) Minimal backend API (Flask + CORS)

File: server_min.py, port http://localhost:3000.

Endpoints (working):

POST /semantic_search: { "query": "...", "top_k": 5 } → { "results": [{ id, title, year }, ...] } (MiniLM embedding + cosine NN).

POST /citation_relation (placeholder): { "a_id": "...", "b_id": "..." } → { "nodes":[...], "edges":[{ src, dst, type:"cites" }] }.

POST /cluster_papers: { "ids": ["…","…"] } → { "layout":[{ id, title, x, y, cluster }, ...] } (KMeans + PCA 2D).

(4) Sidebar prototype (pre-pack)

In my_project/plugin/: manifest.json, sidebar.html, sidebar.js.

Features:

Search → /semantic_search → list with Pick buttons.

Compare (A/B) → /citation_relation → JSON display (to be replaced by a mini graph later).

Cluster (multi-select) → /cluster_papers → simple Canvas scatter (color by cluster).

Since Node/npm is not installed on this machine, I’ll manually zip to .xpi with PowerShell.

(5) Local tests

Verified the three endpoints via Invoke-RestMethod in PowerShell; responses are correct.

2. Tech choices & trade-offs
NLP/Retrieval: MiniLM embeddings + cosine NN; normalized vectors for stability.

Clustering/DR: KMeans + PCA (MVP-first approach; can switch to UMAP later).

Backend: Flask + CORS, JSON APIs aligned with the wireframes.

Frontend/Plugin: vanilla HTML/CSS/JS + Canvas 2D; Manifest v2 sidebar; packable without Node.

Trade-off: prioritize “working MVP” now; refine UI/UMAP/visuals and Zotero API integration after your confirmation.

3. Next steps (proposed)
This week (MVP demo):

Pack & install the .xpi via PowerShell Compress-Archive → Zotero Tools → Add-ons → Install Add-on From File…; run end-to-end demo.

Wire real citation data into /citation_relation:

Option A: parse references from Zotero-exported metadata/attachments → citations.json.

Option B: if structured citations are unavailable, implement co-citation / co-references approximation to make the graph meaningful.

UI polish to match Figma: consistent components, loading/error states; hover highlight for cluster scatter.

Next phase (after discussion):
4. Zotero API integration & incremental updates: read items directly from the desktop library; detect changes; embed only new/updated items.
5. Visualization upgrades: small citation graph (SVG/Canvas), cluster zoom/highlight/selection.
6. Evaluation & logging: record latency, top-k perceived relevance, retry strategy; collect pilot user feedback.

Questions for your guidance

Is the MVP scope acceptable (chat-style semantic search + citation comparison + clustering visualization, no chart explanation)?

Preferred citation data source (Zotero-local vs. external)?

Is PCA acceptable for the MVP with a plan to swap to UMAP later?
