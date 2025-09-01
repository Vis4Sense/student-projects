import re
import os
import json
from typing import List, Optional
from .config import OPENAI_API_KEY, OPENAI_MODEL, GEMINI_API_KEY
from openai import OpenAI
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer, util
from keybert import KeyBERT
import google.generativeai as genai

client = OpenAI(api_key=OPENAI_API_KEY)

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# === Load env ===
load_dotenv()

# === Init models ===
EMBEDDER_MODEL = os.getenv("EMBEDDER_MODEL", "paraphrase-multilingual-MiniLM-L12-v2")
embedder = SentenceTransformer(EMBEDDER_MODEL)
kw_model = KeyBERT(model=embedder)

# === Init FastAPI ===
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

# === Schemas ===
class Product(BaseModel):
    id: Optional[str] = None
    url: Optional[str] = None
    title: str
    description: str = ""
    reviews: str = ""
    position: Optional[int] = None

class ExtractInput(BaseModel):
    query: str

class ScoreInput(BaseModel):
    keywords: List[str]
    products: List[Product]
    price_min: Optional[float] = None
    price_max: Optional[float] = None
    exclude_bulk: Optional[bool] = True
    user_brand: Optional[str] = None
    user_color: Optional[str] = None

class RecommendInput(BaseModel):
    keywords: List[str]
    product: Product

class QuestionInput(BaseModel):
    query: str

class AttrInput(BaseModel):
    title: str
    description: str
    url: str = ""

class FeatureInput(BaseModel):
    title: str
    description: str
    features: str = ""

class CompareInput(BaseModel):
    keywords: List[str]
    products: List[Product]

# === Helpers ===
def normalize_keywords(query: str, kw_pairs: List[tuple]) -> List[str]:
    def clean(s: str) -> str:
        s = s.strip()
        s = re.sub(r"\s+", " ", s)
        return s
    q_emb = embedder.encode(query, convert_to_tensor=True)
    candidates = []
    for phrase, _ in kw_pairs:
        p = clean(phrase)
        if p and p not in candidates:
            candidates.append(p)
    scored = []
    for p in candidates:
        p_emb = embedder.encode(p, convert_to_tensor=True)
        sim = float(util.cos_sim(q_emb, p_emb)[0][0])
        scored.append((p, sim))
    scored.sort(key=lambda x: (x[1], len(x[0])), reverse=True)
    out = []
    for p, _ in scored:
        if p.lower() not in [o.lower() for o in out]:
            out.append(p)
        if len(out) >= 5:
            break
    return out

def choose_target_item(keywords: List[str]) -> str:
    if not keywords:
        return ""
    kws = sorted(keywords, key=lambda s: ((" " in s), len(s)), reverse=True)
    return kws[0]

# === API ===
@app.post("/extract_keywords")
def extract_keywords(input: ExtractInput):
    try:
        q = input.query.strip()
        if not q:
            return {"keywords": []}
        kw_pairs = kw_model.extract_keywords(
            q,
            keyphrase_ngram_range=(1, 2),
            stop_words='english',
            use_mmr=True,
            diversity=0.7,
            top_n=10
        )
        keywords = normalize_keywords(q, kw_pairs)
        return {"keywords": keywords}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Keyword extraction failed: {e}")

@app.post("/score_products")
def score_products(input: ScoreInput):
    try:
        keyword_text = " ".join(input.keywords).strip() or "product"
        target_item = choose_target_item(input.keywords)
        target_emb = embedder.encode(target_item or keyword_text, convert_to_tensor=True)

        # === 过滤函数1：批量/耳罩/非个人消费类 ===
        def is_bulk_product(p: Product) -> bool:
            text = f"{p.title} {p.description}".lower()
            bulk_keywords = [
                "bulk", "classroom", "school", "library", "hospital",
                "pack", "100 pack", "200 pack", "500 pack", "1000",
                "pcs", "lot", "wholesale",
                "earmuff", "kids", "children", "safety", "hearing protection"
            ]
            return any(kw in text for kw in bulk_keywords)

        # === 过滤函数2：分类页/目录页 ===
        def is_category_page(p: Product) -> bool:
            text = f"{p.title} {p.description}".lower()
            url = (p.url or "").lower()

            # 特征1：标题里带大类/价格区间/分类提示
            bad_title_keywords = [
                "headphones & earbuds", "electronics:", "accessories:",
                "price range", "category", "shop", "list of", "results for"
            ]
            if any(kw in text for kw in bad_title_keywords):
                return True

            # 特征2：URL 里是搜索/分类页面
            if any(x in url for x in ["amazon.com/s?", "amazon.com/gp/browse", "amazon.com/gp/search"]):
                return True

            return False

        results = []
        seen_titles = set()  # 避免重复标题

        for product in input.products:
            if is_bulk_product(product):
                continue  # ❌ 批量/耳罩类
            if is_category_page(product):
                continue  # ❌ 分类/搜索结果页

            # 避免重复标题（有些 URL 不同但标题完全相同）
            if product.title.strip().lower() in seen_titles:
                continue
            seen_titles.add(product.title.strip().lower())

            # 计算语义相似度
            product_text = f"{product.title}. {product.description}. {product.reviews}"
            prod_emb = embedder.encode(product_text, convert_to_tensor=True)
            s_sim = float(util.cos_sim(target_emb, prod_emb)[0][0])

            # 兜底 attributes，避免 undefined
            results.append({
                "id": getattr(product, "id", None),
                "url": product.url,
                "title": product.title,
                "description": product.description,
                "reviews": product.reviews,
                "score": round(s_sim * 10, 2),
                "attributes": {
                    "brand": "Unknown",
                    "price": "Unknown",
                    "rating": "Unknown",
                    "features": "Unknown",
                }
            })

        if not results:
            return {"scored_products": []}

        final_sorted = sorted(results, key=lambda x: x["score"], reverse=True)
        return {"scored_products": final_sorted}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scoring failed: {e}")



@app.post("/extract_attributes_llm")
def extract_attributes_llm(input: AttrInput):
    """
    Extract product attributes with Gemini first, fallback to OpenAI if error/quota exceeded.
    """
    try:
        text = f"Title: {input.title}\nDescription: {input.description}\nURL: {input.url}"
        prompt = (
            "From the following product info, extract these attributes:\n"
            "- brand\n- price (estimate if missing)\n- rating (estimate if missing)\n"
            "- features (1–2 concise sentences)\n\n"
            "If a value is not explicitly mentioned, make a reasonable estimate from context; "
            "NEVER output 'Unknown'.\n\n"
            f"{text}\n\n"
            "Return ONLY JSON with keys: brand, price, rating, features."
        )

        raw_text = None
        # --- Try Gemini first ---
        if GEMINI_API_KEY:
            try:
                response = genai.GenerativeModel("gemini-1.5-flash").generate_content(prompt)
                raw_text = (response.text or "").strip()
            except Exception as ge:
                print(f"[Gemini extract_attributes_llm error] {ge}")

        # --- Fallback to OpenAI ---
        if not raw_text and OPENAI_API_KEY:
            response = client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "You are a helpful shopping assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=220
            )
            raw_text = (response.choices[0].message.content or "").strip()

        if not raw_text:
            return {"brand": "Unknown", "price": "Unknown", "rating": "Unknown", "features": "Unknown"}

        # Clean JSON fences if any
        cleaned = raw_text.replace("```json", "").replace("```", "").strip()
        import re
        match = re.search(r"\{.*\}", cleaned, flags=re.DOTALL)
        if match:
            cleaned = match.group(0)

        try:
            data = json.loads(cleaned)
        except Exception:
            return {"brand": "Unknown", "price": "Unknown", "rating": "Unknown", "features": cleaned[:200]}

        # Normalize fields
        return {
            "brand": str(data.get("brand", "Unknown")),
            "price": str(data.get("price", "Unknown")),
            "rating": str(data.get("rating", "Unknown")),
            "features": str(data.get("features", "Unknown"))
        }

    except Exception as e:
        print(f"[extract_attributes_llm fatal] {e}")
        return {"brand": "Unknown", "price": "Unknown", "rating": "Unknown", "features": "Unknown"}


@app.post("/recommend_reason")
def recommend_reason(input: RecommendInput):
    try:
        kws = ", ".join(input.keywords)
        title = input.product.title
        desc = input.product.description or ""

        prompt = (
            f"Recommend this product in under 50 words.\n"
            f"Title: {title}\nDescription: {desc}\nKey needs: {kws}\n"
        )

        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": "You are a helpful shopping assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=100
        )

        ai_reason = response.choices[0].message.content.strip()
        return {"reason": ai_reason, "source": "AI Generated"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation failed: {e}")

@app.post("/generate_questions")
def generate_questions(input: QuestionInput):
    """
    Generate up to 3 follow-up questions.
    Use Gemini first, fallback to OpenAI if error/quota exceeded.
    """
    try:
        prompt = (
            "Generate up to 3 short, clear follow-up questions "
            "to refine a shopping search query.\n\n"
            f"User query: {input.query}\n\nQuestions:"
        )

        text = ""
        # --- Try Gemini first ---
        if GEMINI_API_KEY:
            try:
                response = genai.GenerativeModel("gemini-1.5-flash").generate_content(prompt)
                text = (response.text or "").strip()
            except Exception as ge:
                print(f"[Gemini generate_questions error] {ge}")

        # --- Fallback to OpenAI ---
        if not text and OPENAI_API_KEY:
            try:
                response = client.chat.completions.create(
                    model=OPENAI_MODEL,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.5,
                    max_tokens=150
                )
                text = (response.choices[0].message.content or "").strip()
            except Exception as oe:
                print(f"[OpenAI generate_questions error] {oe}")

        if not text:
            return {"questions": []}

        # Parse into list
        questions = [q.strip("-• ").strip() for q in text.split("\n") if q.strip()]
        return {"questions": questions[:3]}

    except Exception as e:
        print(f"[generate_questions fatal] {e}")
        return {"questions": []}


@app.post("/summarize_features")
def summarize_features(input: FeatureInput):
    try:
        text = f"Title: {input.title}\nDescription: {input.description}\nFeatures: {input.features}"
        prompt = (
            "Summarize product features in 1–2 short sentences.\n"
            "Focus on what matters most to buyers.\n\n"
            f"{text}\n\nSummary:"
        )

        if GEMINI_API_KEY:
            response = genai.GenerativeModel("gemini-1.5-flash").generate_content(prompt)
            return {"summary": response.text.strip()}
        else:
            response = client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "You are a helpful shopping assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=100
            )
            ai_summary = response.choices[0].message.content.strip()
            return {"summary": ai_summary}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Feature summarization failed: {e}")

@app.post("/compare_with_llm")
def compare_with_llm(input: CompareInput):
    try:
        product_texts = "\n\n".join([
            f"Title: {p.title}\nDescription: {p.description}\nURL: {p.url}"
            for p in input.products
        ])
        kws = ", ".join(input.keywords)

        prompt = (
            f"User search keywords: {kws}\n\n"
            f"Products to compare:\n{product_texts}\n\n"
            "Task:\n"
            "1. Compare these products in a structured table with keys: title, brand, price, rating, features.\n"
            "2. Highlight the main differences.\n"
            "3. Recommend the best option with a short explanation (<50 words).\n\n"
            "Return JSON with keys: comparison_table (list of dicts), recommendation (string)."
        )

        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
            max_tokens=800
        )
        raw = (response.choices[0].message.content or "").strip()

        # --- clean markdown fences ---
        cleaned = raw.replace("```json", "").replace("```", "").strip()

        # --- try to locate JSON block ---
        import re
        match = re.search(r"\{.*\}", cleaned, flags=re.DOTALL)
        if match:
            cleaned = match.group(0)

        try:
            return json.loads(cleaned)
        except Exception as je:
            print(f"[compare_with_llm JSON parse error] raw={raw[:200]}... err={je}")
            # safe fallback
            return {
                "comparison_table": [],
                "recommendation": "Comparison failed, please try again."
            }

    except Exception as e:
        print(f"[compare_with_llm fatal error] {e}")
        return {
            "comparison_table": [],
            "recommendation": "Comparison API error."
        }


@app.get("/config")
def get_config():
    serpapi_key = os.getenv("SERPAPI_API_KEY", "")
    return {"serpapi_key": serpapi_key}
