# LLM-Based Browser Extension for Natural-Language-Based Product Discovery

## 📌 Project Overview
This project implements a Chrome browser extension combined with a FastAPI backend.  
Users can describe shopping needs in natural language, and the system will:
- Extract keywords
- Generate clarification questions
- Retrieve product candidates via SerpAPI
- Rank products using semantic similarity
- Extract attributes (brand, price, rating, features) via LLM
- Provide comparison and recommendations

---

## ⚙️ Architecture
- **Frontend**: Chrome Extension (`manifest.json`, `sidebar.html`, `sidebar.js`, `content_script.js`)
- **Backend**: FastAPI (`main.py`)
- **Models**:
  - KeyBERT + SentenceTransformers (keyword extraction, semantic scoring)
  - OpenAI GPT / Gemini API (attribute extraction, reasoning, comparison)
- **Search Engine**: Google SerpAPI

---

## 🖥️ Environment
- Python 3.10+
- Node.js 16+ (optional, for frontend development)
- Chrome Browser

Dependencies are listed in `requirements.txt`.

Environment variables are set in `.env`:

OPENAI_API_KEY=your_openai_api_key
SERPAPI_API_KEY=your_serpapi_api_key
GEMINI_API_KEY=your_gemini_api_key # optional


---

##  Running the Backend
From the project root, run:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000

Test the backend:
http://127.0.0.1:8000/config

## Running the Extension

Open Chrome → chrome://extensions/

Enable Developer mode

Click Load unpacked

Select the folder containing manifest.json

The extension icon will appear, click it to open the sidebar

Usage

Open any google searching page

Enter a shopping query in the sidebar (e.g., "I want a cheap Apple laptop")

The system will:

Extract keywords and possibly generate follow-up questions

Retrieve and rank products from SerpAPI

Display the top 5 products in a comparison table

Allow selection of multiple products for detailed comparison

Provide an AI-generated recommendation