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
        soup = BeautifulSoup(r.text, "html.parser")

        # 提取所有 <p> 标签的文字作为正文
        paragraphs = [p.get_text().strip() for p in soup.find_all("p")]
        content = "\n".join(paragraphs[:50])  # 取前几段
        domain = tldextract.extract(url).domain
        return f"[{domain}] {content[:20000]}"  # 限制最大长度
    except Exception as e:
        return f"[{url}] 无法抓取内容 ({e})"


# ====== 3. 使用 Azure OpenAI 回答 ======
def answer_question_with_web(query):
    # urls = duckduckgo_search(query)
    # time.sleep(1)  # 防止被限速

    snippets = []
    urls = ["https://www.booking.com/searchresults.zh-cn.html?ss=%E8%AF%BA%E4%B8%81%E6%B1%89&ssne=%E8%AF%BA%E4%B8%81%E6%B1%89&ssne_untouched=%E8%AF%BA%E4%B8%81%E6%B1%89&efdco=1&label=zh-cn-gb-booking-desktop-Zx5vIb*jBbjo53dodt4urgS654267613649%3Apl%3Ata%3Ap1%3Ap2%3Aac%3Aap%3Aneg%3Afi%3Atikwd-65526620%3Alp9046400%3Ali%3Adec%3Adm&aid=2311236&lang=zh-cn&sb=1&src_elem=sb&src=index&dest_id=-2604469&dest_type=city&checkin=2025-03-25&checkout=2025-03-26&group_adults=2&no_rooms=1&group_children=0"]
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
