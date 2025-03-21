import openai
import httpx
import asyncio
from openai import AzureOpenAI, AsyncOpenAI
from miniDemo.config import api_base, api_key

api_base = api_base
api_key = api_key
deployment_name = "gpt-4o-mini"
api_version = "2024-08-01-preview"

client = AzureOpenAI(azure_endpoint=api_base, api_key=api_key, api_version=api_version)
client_async = AsyncOpenAI(api_key=api_key)

async def send_Request_async_SDK(prompt):
    """基于SDK，创建异步client"""
    conversation_history = [
        {"role": "system", "content": "You are a helpful assistant tasked with summarizing the main content of webpages."}
    ]
    user_message = {"role": "user", "content": prompt}
    conversation_history.append(user_message)

    response = await client_async.chat.completions.create(
        model=deployment_name,
        messages=conversation_history,
        max_tokens=500
    )

    assistant_reply = {"role": "assistant", "content": response.choices[0].message.content}
    print(assistant_reply["content"])  # 打印回复

def send_Request_SDK(prompt):
    """基于SDK，创建client"""
    conversation_history = [
        {"role": "system", "content": "You are a helpful assistant tasked with summarizing the main content of webpages."}
    ]
    user_message = {"role": "user", "content": prompt}
    conversation_history.append(user_message)

    response = client.chat.completions.create(
        model=deployment_name,
        messages=conversation_history,
        max_tokens=500
    )

    assistant_reply = {"role": "assistant", "content": response.choices[0].message.content}
    # conversation_history.append(assistant_reply)

    print(assistant_reply["content"])  # 打印回复

async def sent_Request_HTTP(prompt):
    """模仿 background.js 的 fetch() 请求，即使用 http发送请求"""
    headers = {
		"Content-Type": "application/json",
		"api-key": api_key
	}
    body = {
		"messages": [
			{"role": "system", "content": "You are a helpful assistant tasked with summarizing webpages."},
			{"role": "user", "content": prompt}
		],
		"max_tokens": 300
	}
    URL = f"{api_base}/openai/deployments/{deployment_name}/chat/completions?api-version={api_version}"

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(URL, headers=headers, json=body, timeout=10.0)
            print(response.headers)
            response.raise_for_status()  # 如果 HTTP 失败，抛出异常
            data = response.json()
            print(data["choices"][0]["message"]["content"].strip())
            return data["choices"][0]["message"]["content"].strip()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 429:  # 速率限制
                print("------ Rate limit exceeded. --------")
                print(e.response.json())
                await asyncio.sleep(2)
                return await sent_Request_HTTP(prompt)
            else:
                print(f"HTTP Error: {e}")
        except Exception as e:
            print(f"Request failed: {e}")

# prompt that use content for a page to get sumary
prompt_mainTextBased = """ Following text is extracted from a website, including its title, main context, and outline. 
        Due to the limitation of the display, the given information may be truncated. 
        Please help me analyze the following content and return two summary of this website in json fromat. 
        Ignore spam and ads information. Some parts may be irrelevant. Please summarize the main content in English.
        
        You can do this job through following stetps:
        1. Read the title, main context, and outline.
        2. Guess the main content of the website, including the main topic and key points.
        3. Write a short summary of less than 25 words and a long summary of less than 100 words.
        4. Return only a valid JSON object, with no extra text or formatting. You should return a dictionary with two keys: shortSummary and longSummary, shown as below:
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
        
        ----------Following is the title, main context, and outline----------
        ####### Title #######
        应聘记录 - 加入字节跳动

        ####### Main Context #######
        字节跳动的使命是“激发创造，丰富生活”。
我们因使命而驱动，希望吸引认同我们的人加入，一起激发更多人的创造。
了解详情
了解详情
一键投递
一键投递
字节范 ByteStyle
字节范是 ByteDancer 在追求使命、达成愿景的过程中共享的工作风格和方法
始终创业
保持创业心态，始终开创而不守成，创新而非依赖资源
敏捷有效，最简化流程，避免简单事情复杂化
对外敏锐谦逊，避免自满或优越感
坦诚清晰
表达真实想法，不怕暴露问题，反对“向上管理”
准确、简洁、直接，少用抽象、模糊、空泛的词
就事论事，理性沟通，避免主观臆测和情绪化表达
多元兼容
欣赏个体多样性，聚焦人的核心特质
全球视角，理解不同文化、观点和实践
善意假设，默认开放信任，有效合作
求真务实
独立思考，刨根问底，找到本质
直接体验，深入事实，拿一手数据或信息
不自嗨，注重实际效果
敢为极致
敢于为了更好的结果明智地冒险，注重整体ROI
尝试多种可能性，在更大范围里找最优解 
追求卓越，高标准，不仅做了，更要做好
共同成长
相信并认可使命和愿景，基于使命愿景自驱
面对短期波动有耐心、有韧性，共同解决问题
持续学习，不设边界，与组织一起成长
北京
上海
广州
香港
新加坡
首尔
东京
悉尼
洛杉矶
纽约
西雅图
圣何塞
圣保罗
伦敦
巴黎
都柏林
约翰内斯堡
北京
上海
广州
香港
新加坡
首尔
东京
悉尼
洛杉矶
纽约
西雅图
圣何塞
圣保罗
伦敦
巴黎
都柏林
约翰内斯堡
Welcome To ByteDance
Welcome To ByteDance
Welcome To ByteDance
Welcome To ByteDance
字节跳动的产品和服务覆盖全球150个国家和地区，
员工分布在全球超过120座城市。
*以上展示字节跳动部分办公室
和优秀的人 做有挑战的事
校招生在字节跳动如何成长
联系我们​
相关网站​
候选人反馈平台
官网使用体验反馈
字节跳动
社招官网
全球招聘
豆包大模型团队

        ####### Outline #######
        # 
# 校园招聘
##### 添加一个标题
###### 添加一个标题
###### 添加一个标题
###### 添加一个标题
###### 添加一个标题
#### 字节范 ByteStyle
##### 始终创业
##### 坦诚清晰
##### 多元兼容
##### 求真务实
##### 敢为极致
##### 共同成长
#### 和优秀的人 做有挑战的事"
"""

# prompt that use URL for a page to get sumary
Prompt_urlBased = """
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
    https://en.wikipedia.org/wiki/Shenzhen
    """

# prompt that use URL for a page to get sumary, but simply version
quickPromt = """
    visit https://en.wikipedia.org/wiki/Tower_of_London and return a summary of the webpage. The summary should be less than 25 words.
    """

def main():
    # response = openai.Quota.retrieve()
    # print(response)
    
    for i in range(6):
        sent_Request_HTTP(prompt_mainTextBased)
        # sent_Request_HTTP(quickPromt)

async def main_async():
    tasks = []
    for i in range(6):  # 发送 6 个请求
        tasks.append(sent_Request_HTTP(prompt_mainTextBased))   # use http, often 429(even in the first request)
        # tasks.append(send_Request_SDK(quickPromt))   # use SDK, seldom 429
    await asyncio.gather(*tasks)  # 执行所有请求

if __name__ == "__main__":
    # main()
    asyncio.run(main_async())
