import openai
from openai import AzureOpenAI
from miniDemo.config import api_base, api_key

api_base = api_base
api_key = api_key
deployment_name = "gpt-4o-mini"
api_version = "2024-08-01-preview"

client = AzureOpenAI(azure_endpoint=api_base, api_key=api_key, api_version=api_version)

# 存储对话历史
conversation_history = [
    {"role": "system", "content": "You are a helpful guide in tourism. Your name is Yixin Hou and you were born in London. Please answer the question of the tourist."}
    # include all the summary of tabs in this task into this first promt
]

def send_beginRequest():
    """发送初始请求并存储对话记录"""
    user_message = {"role": "user", "content": "please introduce yourself"}
    conversation_history.append(user_message)

    response = client.chat.completions.create(
        model=deployment_name,
        messages=conversation_history,
        max_tokens=500
    )

    assistant_reply = {"role": "assistant", "content": response.choices[0].message.content}
    conversation_history.append(assistant_reply)

    print(assistant_reply["content"])  # 打印回复

def send_followupRequest(prompt):
    """继续现有对话并追加新消息"""
    user_message = {"role": "user", "content": prompt}
    conversation_history.append(user_message)

    response = client.chat.completions.create(
        model=deployment_name,
        messages=conversation_history,
        max_tokens=500
    )

    assistant_reply = {"role": "assistant", "content": response.choices[0].message.content}
    conversation_history.append(assistant_reply)

    print(assistant_reply["content"])  # 打印回复

def main():
    send_beginRequest()

    prompt2 = "Sorry, what is your name?"
    send_followupRequest(prompt2)  # 继续对话

    prompt3 = "Do you konw London?"
    send_followupRequest(prompt3)  # 继续对话

if __name__ == "__main__":
    main()
