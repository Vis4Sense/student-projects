import requests
from bs4 import BeautifulSoup
from openai import AzureOpenAI
import time
import tldextract
from config import apiBase, apiKey, deploymentName, apiVersion

# 信息混乱、结构不清、模型无法准确识别关键信息.
# 抓下来的 HTML 纯文本杂乱,没有浏览器javasscript的处理，失去了一些内容的结构化对应关系
# 需要针对特定的网站优化，才能获得结构化数据


# ====== 配置 Azure OpenAI ======
AZURE_OPENAI_KEY = apiKey
AZURE_OPENAI_ENDPOINT = apiBase # 注意以 / 结尾
DEPLOYMENT_NAME = deploymentName  # gpt-35-turbo 或 gpt-4
API_VERSION = apiVersion


# ====== 1. DuckDuckGo 搜索函数 ======
def duckduckgo_search(query, max_results=3):
    url = f"https://html.duckduckgo.com/html/?q={query}"
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    links = []

    for a in soup.find_all("a", class_="result__a", href=True):
        if len(links) >= max_results:
            break
        href = a['href']
        links.append(href)

    return links


# ====== 2. 网页正文摘要提取函数 ======
def extract_main_text(url):
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        r = requests.get(url, headers=headers, timeout=5)
        r.encoding = r.apparent_encoding  # 自动识别编码
        soup = BeautifulSoup(r.text, "html.parser")

        # 定义需要提取的标签
        tags_to_extract = ['p', 'div', 'span', 'article', 'section']

        # 提取文字内容
        texts = []
        for tag in tags_to_extract:
            for elem in soup.find_all(tag):
                # 过滤掉 class/id 中含有无关关键词的元素
                if elem.has_attr('class') and any(keyword in ' '.join(elem['class']).lower() for keyword in ['nav', 'footer', 'sidebar', 'header', 'comment', 'ads']):
                    continue
                if elem.has_attr('id') and any(keyword in elem['id'].lower() for keyword in ['nav', 'footer', 'sidebar', 'header', 'comment', 'ads']):
                    continue

                text = elem.get_text(strip=True)
                # 跳过太短的内容
                if len(text) >= 30:
                    texts.append(text)

        # 去重并拼接前几段
        seen = set()
        clean_texts = []
        for t in texts:
            if t not in seen:
                clean_texts.append(t)
                seen.add(t)

        content = "\n".join(clean_texts[:100])  # 可调节数量

        domain = tldextract.extract(url).domain
        return f"[{domain}] {content[:20000]}"
    except Exception as e:
        return f"[{url}] 无法抓取内容 ({e})"


# ====== 3. 使用 Azure OpenAI 回答 ======
def answer_question_with_web(query):
    # urls = duckduckgo_search(query)
    # time.sleep(1)  # 防止被限速

    snippets = []
    urls = ["https://www.booking.com/searchresults.zh-cn.html?ss=nottingham&ssne=%E5%B7%B4%E9%BB%8E&ssne_untouched=%E5%B7%B4%E9%BB%8E&efdco=1&label=gog235jc-1DCAEoggI46AdIM1gDaFCIAQGYASu4ARfIAQzYAQPoAQGIAgGoAgO4Aoqzjb8GwAIB0gIkNmNiYmFmZDAtYmU3Mi00MzhlLWJhNTgtMzdjZTRiMzUxNzY12AIE4AIB&sid=f3d5d543f1bf61eadfca1ba8d156aa42&aid=397594&lang=zh-cn&sb=1&src_elem=sb&src=index&dest_id=-2604469&dest_type=city&ac_position=0&ac_click_type=b&ac_langcode=en&ac_suggestion_list_length=5&search_selected=true&search_pageview_id=7b4f0b055c60010b&ac_meta=GhA3YjRmMGIwNTVjNjAwMTBiIAAoATICZW46Cm5vdHRpbmdoYW1AAEoAUAA%3D&checkin=2025-06-15&checkout=2025-06-17&group_adults=2&no_rooms=1&group_children=0"]
    for url in urls:
        snippet = extract_main_text(url)
        print("length is "+str(len(snippet)))
        print(snippet)
        snippets.append(snippet)

    combined_info = "\n\n".join(snippets)
    prompt = f"""
你是一个联网助手，以下是我通过网页搜索找到的内容，请根据这些信息回答用户提出的问题。

用户问题：{query}

网页内容摘要如下：
{combined_info}

请用中文简洁明了地回答问题。
"""

    client = AzureOpenAI(
        api_key=AZURE_OPENAI_KEY,
        api_version=API_VERSION,
        azure_endpoint=AZURE_OPENAI_ENDPOINT
    )

    response = client.chat.completions.create(
        model=DEPLOYMENT_NAME,
        messages=[
            {"role": "system", "content": "你是一个智能助理，擅长分析网页信息回答问题。"},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=500
    )
    answer = response.choices[0].message.content
    return answer


# ====== 示例使用 ======
if __name__ == "__main__":
    user_question = "这里面哪些酒店是在70磅到90磅之间，并且评分在8.0以上的？"
    answer = answer_question_with_web(user_question)
    print("\n🤖 AI 回答：\n", answer)
