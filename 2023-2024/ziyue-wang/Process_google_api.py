text_data = []
for item in itemListElement:
    name = item['result']['name']
    description = item['result']['description']
    article_body = item['result']['detailedDescription']['articleBody']
    # to make the names, description, and the article into a new text file
    combined_text = f"{name}. {description}. {article_body}"
    text_data.append(combined_text)
