import openai
import asyncio
import json
import os
from openai import AzureOpenAI, AsyncAzureOpenAI
from miniDemo.config import api_base, api_key

api_base = api_base
api_key = api_key
deployment_name = "gpt-4o-mini"  
api_version = "2024-08-01-preview"

client = AsyncAzureOpenAI(azure_endpoint=api_base, api_key=api_key, api_version=api_version)

with open("benchMark.txt", "r", encoding="utf-8") as f:
    content = f.read()
first_1000_chars = content[:1000]

exampleOutput = {
    "summary": [
            { "shortSummary": "xxx" },
            { "longSummary": "xxxxxx"}
        ]
}

exampleOutputText = json.dumps(exampleOutput, indent=4)

prompt = f"""
        Following text is extracted from a website, including its title, main context, and outline. 
        Due to the limitation of the display, the given information may be truncated. 
        Please help me analyze the following content and return two summary of this website in json fromat. 
        Ignore spam and ads information. Some parts may be irrelevant. Please summarize the main content in English.
        
        You can do this job through following stetps:
        1. Read the title, main context, and outline.
        2. Guess the main content of the website, including the main topic and key points.
        3. Write a short summary of less than 25 words and a long summary of less than 100 words.
        4. Return only a valid JSON object, with no extra text or formatting. You should return a dictionary with two keys: shortSummary and longSummary, shown as below:
        ###### example output #######
        {exampleOutputText}
        
        ----------Following is the title, main context, and outline----------
        ####### Title #######
        Camera - wiki pedia

        ####### Main Context #######
        {first_1000_chars}
    """

async def send_request(i):
    print(f"------------request {i}------------")
    response = await client.chat.completions.create(
        model=deployment_name,
        messages=[
            {"role": "system", "content": "You are a helpful assistant tasked with summarizing the main content of webpages."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=500
    )
    print(f"------------response {i}------------")
    print(response)


async def main():
    tasks = [send_request(i) for i in range(20)]
    await asyncio.gather(*tasks)


if __name__ == "__main__":
    asyncio.run(main())


# print(prompt)
