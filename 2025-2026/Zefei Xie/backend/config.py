"""
Author: Henry X
Date: 2025/10/16 9:19
File: config.py
Description: [Add your description here]
"""

from pydantic_settings import BaseSettings
from typing import Optional
from pathlib import Path

# make sure to set the correct path to your.env file
BASE_DIR = Path(__file__).resolve().parent
ENV_FILE = BASE_DIR / ".env"


class Settings(BaseSettings):
    # FastAPI
    APP_NAME: str = "Research Agent System"
    DEBUG: bool = False
    API_V1_STR: str = "/api/v1"

    PROVIDER: str = "openai"

    # OpenAPI
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-5-mini"

    # Azure OpenAI
    AZURE_OPENAI_ENDPOINT: str
    AZURE_OPENAI_API_KEY: str
    AZURE_OPENAI_DEPLOYMENT: str
    AZURE_OPENAI_API_VERSION: str = "2025-01-01-preview"

    # Embedding API
    EMBEDDING_USE_AZURE : bool
    AZURE_EMBEDDING_DEPLOYMENT : str = "text-embedding-3-small-zefei-litreview"

    # search API
    SEMANTIC_SCHOLAR_API_KEY: Optional[str] = None
    ARXIV_API_URL: str = "http://export.arxiv.org/api/query"

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/app.log"

    class Config:
        env_file = str(ENV_FILE)
        env_file_encoding = 'utf-8'
        case_sensitive = True
        extra = "ignore"


# instance
settings = Settings()

if __name__ == "__main__":
    print("=== Configuration Loaded ===")
    print(f"ENV_FILE path: {ENV_FILE}")
    print(f"ENV_FILE exists: {ENV_FILE.exists()}")
    print(f"AZURE_OPENAI_ENDPOINT: {settings.AZURE_OPENAI_ENDPOINT}")
    print(f"AZURE_OPENAI_DEPLOYMENT: {settings.AZURE_OPENAI_DEPLOYMENT}")
    print(f"AZURE_OPENAI_API_KEY: {settings.AZURE_OPENAI_API_KEY[:10]}...")
    print(f"AZURE_EMBEDDING_DEPLOYMENT: {settings.AZURE_EMBEDDING_DEPLOYMENT}")

