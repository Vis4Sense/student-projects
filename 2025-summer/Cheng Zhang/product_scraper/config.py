import os
from dotenv import load_dotenv

load_dotenv()

# 从环境变量读取 API Key
OPENAI_API_KEY   = os.getenv("OPENAI_API_KEY")
SERPAPI_API_KEY  = os.getenv("SERPAPI_API_KEY")

# 常量配置
OPENAI_MODEL   = "gpt-4o"
SEARCH_ENGINE  = "google"
NUM_RESULTS    = int(os.getenv("NUM_RESULTS", 5))
AMAZON_DOMAIN  = os.getenv("AMAZON_DOMAIN", "amazon.co.uk")
MISTRAL_MODEL_PATH = os.getenv("MISTRAL_MODEL_PATH")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
