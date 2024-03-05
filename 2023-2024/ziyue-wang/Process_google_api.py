text_data = []
for item in itemListElement:
    name = item['result']['name']
    description = item['result']['description']
    article_body = item['result']['detailedDescription']['articleBody']
    # 将实体名称、描述和文章摘要整合为一个文本
    combined_text = f"{name}. {description}. {article_body}"
    text_data.append(combined_text)
