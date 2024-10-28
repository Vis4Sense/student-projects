import openai
from openai import AzureOpenAI

# 设置 API 密钥
api_key = "xxxxxxxxxxxx"
api_base = "xxxxxxxxxxxxxxxxx"  # 设置您的 Azure OpenAI endpoint
api_type = "azure"
api_version = "2023-12-01"  # 根据您的 API 版本调整

client = AzureOpenAI(azure_endpoint=api_base, api_key=api_key, api_version=api_version)

# 定义模型部署名称
deployment_name = "gpt-3.5-turbo"  # Azure 中的模型部署名称

# 使用 Chat Completions 接口
response = client.chat.completions.create(
    model=deployment_name,  # 使用您 Azure 部署的引擎名称
    messages=[
        {"role": "system", "content": "你是一位帮助生成 Python 编程介绍的助手。"},
        {"role": "user", "content": "请生成一段关于Python编程的简介"}
    ],
    max_tokens=100
)

# 输出生成的内容
print(response['choices'][0]['message']['content'].strip())