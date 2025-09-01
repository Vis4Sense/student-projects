#------------------------------------------------------------#
# Name: Scraping Data Module
# Description: This script scrapes sentiment data from various
#              sources like Reddit and NewsAPI for
#              cryptocurrency news, then merges the results
#              into a single dataset in conjunction with the
#              Sentiment Extraction Module (extraction.py).
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 23/08/2025
# Python Version: 3.10.6
# Packages Required: python-dateutil, newsapi-python,
#                    beautifulsoup4, pandas, requests
#------------------------------------------------------------#

# Import necessary libraries
from dateutil.relativedelta import relativedelta
from newsapi import NewsApiClient
from datetime import datetime
from bs4 import BeautifulSoup
import pandas as pd
import requests
import os

# Function to load API keys from 'keys' folder
def load_api_key(filepath):
    with open(filepath, "r") as f:
        return f.read().strip()
    
LANGUAGE_MAP = {
    'en': 'English',
    'de': 'German',
    'fr': 'French',
    'es': 'Spanish',
    'it': 'Italian'
}

# Function to scrape (Old) Reddit posts from specified subreddit(s)
def scrape_reddit_posts(subreddit='CryptoCurrency', total_limit=100, excel_path="./data/reddit_crypto_dataset.xlsx"):
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
    source = f"Reddit r/{subreddit}"

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
                # Check if the post URL is already in the existing URLs
                if post_url not in existing_urls:
                    # Append the post details to the list
                    posts.append({
                        "Source": source,
                        "Title": title,
                        "URL": post_url,
                        "Timestamp": timestamp,
                        "Language": "English"
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

# Function to scrape cryptocurrency news from NewsAPI.org
def get_newsapi_headlines(language='en', excel_path="./data/newsapi_crypto_dataset.xlsx"):
    # NewsAPI.org valid API key
    api_key = load_api_key("./keys/newsapi_key.txt")
    newsapi = NewsApiClient(api_key=api_key)
    
    # Define the from and to dates for the news articles
    # N.B: The from date is set to 1 month ago from today to adhere with the API's free plan limits
    from_date = from_date = (datetime.now() - relativedelta(months=1)).strftime('%Y-%m-%d')
    to_date = datetime.now().strftime('%Y-%m-%d')
    
    # N.B: Supported languages: ar, de, en, es, fr, he, it, nl, no, pt, ru, sv, ud, zh
    # Arabic, German, English, Spanish, French, Hebrew, Italian, Dutch, Norwegian, Portuguese, Russian, Swedish, Urdu, Chinese
    language_full = LANGUAGE_MAP.get(language, "English")

    try:
        # Fetch cryptocurrency news articles
        crypto_news = newsapi.get_everything(
            q='cryptocurrency OR crypto OR bitcoin OR ethereum OR dogecoin',
            from_param=from_date,
            to=to_date,
            language=language,
            sort_by='relevancy',
            page_size=100
        )
        headlines = []
        if crypto_news['status'] == 'ok':
            for article in crypto_news['articles']:
                # Extract relevant information from each article
                headline_info = {
                    'Source': article['source']['name'],
                    'Title': article['title'],
                    'URL': article['url'],
                    'Timestamp': article['publishedAt'],
                    'Description': article['description'],
                    'Language': language_full
                }
                # Append the article information to the headlines list
                headlines.append(headline_info)
            
        # Load existing dataset if it exists
        if os.path.exists(excel_path):
            try:
                df_existing = pd.read_excel(excel_path)
                # Extract existing URLs to avoid duplicates
                existing_urls = set(df_existing["URL"].tolist())
            except Exception as e:
                print(f"Could not read existing Excel file: {e}")
                df_existing = pd.DataFrame()
                existing_urls = set()
        else:
            # If the file doesn't exist, create an empty DataFrame
            df_existing = pd.DataFrame()
            existing_urls = set()

        # Filter only new headlines (not already in dataset)
        new_headlines = [h for h in headlines if h["URL"] not in existing_urls]

        # Create DataFrame for new headlines
        df_new = pd.DataFrame(new_headlines)
        # Concatenate and deduplicate by URL
        df_combined = pd.concat([df_existing, df_new], ignore_index=True)
        # Ensure no duplicate URLs and sort by timestamp
        df_combined.drop_duplicates(subset=["URL"], inplace=True)
        df_combined = df_combined.sort_values(by="Timestamp", ascending=False)
        # Save the combined DataFrame to Excel spreadsheet
        df_combined.to_excel(excel_path, index=False)

        # Return the number of new headlines actually added
        num_new_headlines = len(new_headlines)
        
        return num_new_headlines
    
    # Handle exceptions during API calls or data processing
    except Exception as e:
        print(f"Error: {e}")
        return {'error': str(e)}
    
# Function to merge Reddit & NewsAPI datasets to allow sentiment extraction by specific LLM
def merge_datasets(reddit_path="./data/reddit_crypto_dataset.xlsx", newsapi_path="./data/newsapi_crypto_dataset.xlsx", merged_path="./data/merged_crypto_dataset.xlsx"):
    try:
        # Check if both Reddit & NewsAPI datasets exist
        if not os.path.exists(reddit_path) or not os.path.exists(newsapi_path):
            print("One or both source datasets not found.")
            return 0

        # Load both datasets
        df_reddit = pd.read_excel(reddit_path)
        df_newsapi = pd.read_excel(newsapi_path)

        # Load existing "merged_crypto_dataset.xlsx" (if it exists)
        # N.B: _ex implies "existing"
        if os.path.exists(merged_path):
            df_merged_ex = pd.read_excel(merged_path)
        else:
            df_merged_ex = pd.DataFrame()

        # Combine Reddit and NewsAPI datasets
        df_combined = pd.concat([df_reddit, df_newsapi], ignore_index=True)

        # Align with existing merged dataset by URL
        if not df_merged_ex.empty:
            # Merge based on URL, prioritising the existing sentiment columns, i.e. Sentiment_Orca2
            df_combined = pd.merge(df_combined, df_merged_ex, on="URL", how="outer", suffixes=("_new", ""))

            # For non-sentiment columns, combine existing and temporary _new columns
            for col in df_reddit.columns:
                if col != "URL" and not col.lower().startswith("sentiment_"):
                    df_combined[col] = df_combined[col + "_new"].combine_first(df_combined[col])
                    # Remove temporary _new columns
                    df_combined.drop(columns=[col + "_new"], inplace=True)
        
        # Count the number of duplicates before removing them
        num_duplicates = df_combined.duplicated(subset=["URL"]).sum()

        # Remove duplicates based on URL and sort by timestamp
        df_combined.drop_duplicates(subset=["URL"], inplace=True)
        if "Timestamp" in df_combined.columns:
            df_combined = df_combined.sort_values(by="Timestamp", ascending=False)

        # Save the updated "merged_crypto_dataset.xlsx"
        os.makedirs(os.path.dirname(merged_path), exist_ok=True)
        df_combined.to_excel(merged_path, index=False)

        # Print summary information for debugging and tracking
        print(f"Merged dataset saved to {merged_path} with {len(df_combined)} posts.")
        print(f"Number of duplicates removed: {num_duplicates}")
        
        return len(df_combined)

    # Return error if datasets fail to merge
    except Exception as e:
        print(f"Error merging the datasets: {e}")
        return 0