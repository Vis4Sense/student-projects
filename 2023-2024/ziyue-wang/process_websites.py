from bs4 import BeautifulSoup
import requests

# assume that we have already visited some websites
url = 'http://example.com'
response = requests.get(url)
soup = BeautifulSoup(response.content, 'html.parser')

# get the title
title = soup.find('title').text

# get the text information
texts = soup.find_all('p')
article_text = ' '.join([p.text for p in texts])

# process and store the data
# ... here we can implement some NLP related processing data and codes ...
