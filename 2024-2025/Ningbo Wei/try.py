import openai

# 设置 API 密钥
openai.api_key = "fb4f676e065c4e238870e2adc0cd5956"
openai.api_base = "https://ai-rum-swe-a909a5-2.openai.azure.com/"  # 设置您的 Azure OpenAI endpoint
openai.api_type = "azure"
openai.api_version = "2023-12-01"  # 根据您的 API 版本调整

# 定义模型部署名称
deployment_name = "gpt-35-turbo-16k"  # Azure 中的模型部署名称

# 使用 Chat Completions 接口
response = openai.ChatCompletion.create(
    engine=deployment_name,  # 使用您 Azure 部署的引擎名称
    messages=[
        {"role": "system", "content": "你是一位帮助生成 Python 编程介绍的助手。"},
        {"role": "user", "content": "请生成一段关于Python编程的简介"}
    ],
    max_tokens=100
)

# 输出生成的内容
print(response['choices'][0]['message']['content'].strip())