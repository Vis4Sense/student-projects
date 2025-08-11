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

