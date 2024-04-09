# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
from dotenv import load_dotenv
import os

load_dotenv()  # Take environment variables from .env.

app = FastAPI()

class ResearchRequest(BaseModel):
    query: str

@app.post("/research")
async def perform_research(request: ResearchRequest):
    gpt_response = call_gpt_researcher(request.query)
    if gpt_response is None:
        raise HTTPException(status_code=500, detail="GPT-researcher API call failed")
    return gpt_response

def call_gpt_researcher(query):
    # The actual URL and API key for your GPT-researcher API should come from environment variables
    gpt_researcher_url = os.getenv('GPT_RESEARCHER_URL', "http://localhost:8000")
    api_key = os.getenv('GPT_RESEARCHER_API_KEY')  # Assuming you have set GPT_RESEARCHER_API_KEY in your .env file
    headers = {
        "Authorization": f"Bearer {api_key}"
    }
    response = requests.post(gpt_researcher_url, headers=headers, json={"query": query})
    if response.status_code == 200:
        return response.json()
    else:
        # Log error details here and return None or handle accordingly
        return None

@app.get("/")
def read_root():
    # You could use this endpoint to check if the environment variables are being loaded correctly
    openai_key = os.getenv('OPENAI_API_KEY')
    tavily_key = os.getenv('TAVILY_API_KEY')
    return {"OpenAI Key": openai_key, "Tavily Key": tavily_key}
