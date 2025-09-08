import os
from openai import OpenAI

# 从环境变量里取 key，也可以直接写死
api_key = os.getenv("OPENAI_API_KEY") or "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"

client = OpenAI(api_key=api_key)

try:
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "Hello, can you read me?"}],
        max_tokens=20,
    )
    print("✅ Key 有效，测试回答：", resp.choices[0].message.content)
except Exception as e:
    print("❌ Key 无效，报错：", e)
