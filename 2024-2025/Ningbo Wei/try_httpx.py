import httpx
import asyncio
import json
from miniDemo.config import api_base, api_key

# Azure OpenAI API 配置信息
API_BASE = api_base  # 你的 Azure OpenAI 地址
API_KEY = api_key  # 替换成你的 API Key
DEPLOYMENT_NAME = "gpt-4o-mini"
API_VERSION = "2024-08-01-preview"

# 请求 URL
URL = f"{API_BASE}/openai/deployments/{DEPLOYMENT_NAME}/chat/completions?api-version={API_VERSION}"

# 限流控制，每秒最多 3 个请求
SEMAPHORE = asyncio.Semaphore(3)

async def fetch_summary(prompt):
    """模仿 background.js 的 fetch() 请求"""
    async with SEMAPHORE:
        headers = {
            "Content-Type": "application/json",
            "api-key": API_KEY
        }
        body = {
            "messages": [
                {"role": "system", "content": "You are a helpful assistant tasked with summarizing webpages."},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 300
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(URL, headers=headers, json=body, timeout=10.0)
                response.raise_for_status()  # 如果 HTTP 失败，抛出异常
                data = response.json()
                return data["choices"][0]["message"]["content"].strip()
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 429:  # 速率限制
                    print("Rate limit exceeded. Retrying in 2 seconds...")
                    print(e.response.json())
                    await asyncio.sleep(2)
                    return await fetch_summary(prompt)
                else:
                    print(f"HTTP Error: {e}")
            except Exception as e:
                print(f"Request failed: {e}")

async def main():
    """并行执行多个请求"""
    urlPrompt = """
    You will be given a URL of a webpage.
    Please help me analyze the that webpage and return two summary of this website in json fromat. 
    Ignore spam and ads information. Some parts may be irrelevant. Please summarize the main content in English.
    Two summaries are required: short summary less than 25 words and long summary less than 100 words.
    Return only a valid JSON object, with no extra text or formatting. You should return a dictionary with two keys: shortSummary and longSummary, shown as below:
    ###### example output #######
        {
  "summary": [
    {
      "shortSummary": "xxx"
    },
    {
      "longSummary": "xxxxxx"
    }
  ]
}
    If you are unable to access the webpage, please return "ERROR" in both summaries.

    ----------Following is the URL of the webpage----------
    https://en.wikipedia.org/wiki/Tower_of_London
    """
    quickPromt = """
    visit https://en.wikipedia.org/wiki/Tower_of_London and return a summary of the webpage. The summary should be less than 25 words.
    """


    tasks = [fetch_summary(quickPromt) for j in range(6)]
    results = await asyncio.gather(*tasks)

    for i, result in enumerate(results):
        print(f"Response {i+1}: {result}")

if __name__ == "__main__":
    asyncio.run(main())
