import requests
import json

def query_pipeline(names, url):
    #有几种不同的endpoint
    headers = {"Content-Type": "application/json"}
    data = {"names": names}

    response = requests.post(url, json=data, headers=headers)

    if response.status_code != 200:
        print(f"Error: HTTP {response.status_code}")
        return None

    # 解析 SSE 响应
    lines = response.text.strip().split("\n")
    parsed_data = []

    for line in lines:
        if line.startswith("data: "):  # 只解析 "data:" 行
            json_part = line[6:].strip()  # 去掉 "data: " 前缀并去除前后空格
            try:
                parsed_data.append(json.loads(json_part))  # 解析 JSON
            except json.JSONDecodeError as e:
                print(f"JSON 解析失败: {e}")

    return parsed_data

# 测试函数
url = "http://127.0.0.1:8000/pipeline/"
names = ["Betnovate Scalp Application"]

result = query_pipeline(names, url)
print("Output:", result)
