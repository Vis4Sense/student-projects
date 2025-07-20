#------------------------------------------------------------#
# Name: Scraping Data Module
# Description: This script scrapes sentiment data from various
#              sources like Reddit, Twitter, and NewsAPI for
#              cryptocurrency news.
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 20/07/2025
# Python Version: 3.10.6
# Packages Required: requests, beautifulsoup4, pandas, os
#------------------------------------------------------------#

import requests
from bs4 import BeautifulSoup
import pandas as pd
import os

def scrape_reddit_posts(subreddit='CryptoCurrency', total_limit=100, excel_path=".data/scraping_dataset.xlsx"):
    # Load existing URLs to avoid duplicates
    existing_urls = set()
    if os.path.exists(excel_path):
        try:
            df_existing = pd.read_excel(excel_path)
            existing_urls = set(df_existing["URL"].tolist())
        except Exception as e:
            print(f"Could not read existing Excel file: {e}")
    
    # URL template for defined subreddit to be scraped
    base_url = f"https://old.reddit.com/r/{subreddit}/new/"
    # Headers to mimic a browser request to avoid being blocked by Reddit bot protection
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 OPR/119.0.0.0',}
    posts = []
    url = base_url

    # Loop to scrape posts until the total limit is reached
    while len(posts) < total_limit:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            print(f"Failed with status code: {response.status_code}")
            break

        soup = BeautifulSoup(response.content, 'html.parser')
        things = soup.find_all("div", {"class": "thing"}, limit=total_limit - len(posts))

        # N.B: 'el' refers to the HTML element, 'thing' refers to a post
        for thing in things:
            title_el = thing.find("a", class_="title")
            time_el = thing.find("time")
            fullname = thing.get("data-fullname", "")
            # Ensure both the title and time elements are present
            if title_el and time_el:
                title = title_el.get_text(strip=True)
                post_url = title_el["href"]
                if post_url.startswith("/r/"):
                    post_url = "https://old.reddit.com" + post_url
                timestamp = time_el.get("datetime", "")
                if post_url not in existing_urls:
                    posts.append({
                        "Title": title,
                        "URL": post_url,
                        "Timestamp": timestamp,
                        "Fullname": fullname
                    })
        # Emulate pagination by finding the next button
        next_button = soup.find("span", class_="next-button")
        if next_button and next_button.a:
            url = next_button.a["href"]
        else:
            break
    
    # Concatenate new posts with existing ones
    df_existing = pd.read_excel(excel_path)
    df_new = pd.DataFrame(posts)
    df_combined = pd.concat([df_existing, df_new], ignore_index=True)
    # Ensure no duplicate URLs and sort by timestamp
    df_combined.drop_duplicates(subset=["URL"], inplace=True)
    df_combined = df_combined.sort_values(by="Timestamp", ascending=False)
    # Save the combined DataFrame to Excel spreadsheet
    df_combined.to_excel(excel_path, index=False)

    # Return the number of new posts scraped
    num_new_posts = len(posts)

    return num_new_posts
