#------------------------------------------------------------#
# Name: Sentiment Scraping Module
# Description: This script scrapes sentiment data from various
#              sources like Reddit, Twitter, and NewsAPI for
#              cryptocurrency news.
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 13/07/2025
# Python Version: 3.10.6
# Packages Required: requests, beautifulsoup4
#------------------------------------------------------------#

import requests
from bs4 import BeautifulSoup

# Scrape Reddit posts from a specific subreddit (i.e. CryptoCurrency)
def scrape_reddit_posts(subreddit='CryptoCurrency', total_limit=100):
    # Base URL for Reddit's old interface (easier to scrape)
    base_url = f"https://old.reddit.com/r/{subreddit}/new/"
    # Set headers to mimic a browser request and avoid bot detection
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 OPR/119.0.0.0',}

    # List to hold scraped posts
    posts = []
    url = base_url

    # Loop to scrape until we reach the total limit or no more available pages
    while len(posts) < total_limit:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            print(f"Failed with status code: {response.status_code}")
            break

        # Parse the HTML content
        soup = BeautifulSoup(response.content, 'html.parser')
        things = soup.find_all("div", {"class": "thing"}, limit=total_limit - len(posts))

        for thing in things:
            title_el = thing.find("a", class_="title")
            if title_el:
                title = title_el.get_text(strip=True)
                post_url = title_el["href"]
                if post_url.startswith("/r/"):
                    post_url = "https://old.reddit.com" + post_url
                posts.append({"title": title, "url": post_url})

        # Finds and enables button to navigate to the next page
        next_button = soup.find("span", class_="next-button")
        if next_button and next_button.a:
            url = next_button.a["href"]
        else:
            break

    return posts