import openai
from openai import AzureOpenAI

api_base = "**************************"  
api_key = "****************************" 
deployment_name = "gpt-35-turbo-16k"  
api_version = "2023-06-01-preview"

client = AzureOpenAI(azure_endpoint=api_base, api_key=api_key, api_version=api_version)

prompt = "给我推荐一些中式炒菜"

response = client.chat.completions.create(
        model=deployment_name, 
        messages=[
            {"role": "system", "content": "You are a helpful assistant."}, 
            {"role": "user", "content": prompt}
        ],
        max_tokens=500
    )   

#去除回复中的所有\n以及结尾的空格
mapped_value = response.choices[0].message.content.strip().replace("\n", "")
print(mapped_value) 
