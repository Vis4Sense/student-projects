#------------------------------------------------------------#
# Name: Scraping Data Module
# Description: This script scrapes sentiment data from various
#              sources like Reddit and NewsAPI for
#              cryptocurrency news, then merges the results
#              into a single dataset in conjunction with the
#              Sentiment Extraction Module (extraction.py).
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 06/09/2025
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
import re

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

# Asset classification (regex patterns): BTC, ETH, DOGE, MULTI or OTHER
ASSET_REGEX = {
    "BTC": re.compile(r"\b(btc|bitcoin)\b", re.IGNORECASE),
    "ETH": re.compile(r"\b(eth|ethereum)\b", re.IGNORECASE),
    "DOGE": re.compile(r"\b(doge|dogecoin)\b", re.IGNORECASE),
}

# Asset (subreddit mapping)
SUBREDDIT_ASSET = {
    "bitcoin": "BTC",
    "ethereum": "ETH",
    "dogecoin": "DOGE",
}

# Column reordering for "reddit_crypto_dataset.xlsx" and "newsapi_crypto_dataset.xlsx"
def reorder_columns(df: pd.DataFrame, preferred: list[str]):
    specified_cols = [c for c in preferred if c in df.columns]
    unspecified_cols = [c for c in df.columns if c not in specified_cols]
    return df[specified_cols + unspecified_cols]

def reorder_reddit_columns(df: pd.DataFrame):
    preferred = ["Source", "Subreddit", "Asset", "Language", "Title", "URL", "Timestamp"]
    return reorder_columns(df, preferred)

def reorder_newsapi_columns(df: pd.DataFrame):
    preferred = ["Source", "Asset", "Language", "Title", "Description", "URL", "Timestamp"]
    return reorder_columns(df, preferred)

def reorder_merged_columns(df: pd.DataFrame):
    """Order merged dataset with shared core fields first, then the rest."""
    preferred = ["Source", "Subreddit", "Asset", "Language", "Title", "Description", "URL", "Timestamp"]
    return reorder_columns(df, preferred)

# Function to classify asset based on title, description, or subreddit hint
def classify_asset(title: str | None = None, description: str | None = None, subreddit_map: str | None = None):
    if subreddit_map:
        sub = str(subreddit_map).strip().lower()
        if sub in SUBREDDIT_ASSET:
            return SUBREDDIT_ASSET[sub]

    # Combine title and description for regex matching
    text_parts: list[str] = []
    if isinstance(title, str):
        text_parts.append(title)
    if isinstance(description, str):
        text_parts.append(description)
    blob = " ".join(text_parts)

    # Match asset keywords using regex
    hits = [a for a, pat in ASSET_REGEX.items() if pat.search(blob)]
    if len(hits) == 1:
        return hits[0]
    elif len(hits) > 1:
        return "MULTI"
    return "OTHER"

# Function to ensure that 'Asset' column exists and is populated
def check_asset_column(df: pd.DataFrame, subreddit_map: str | None = None):
    if "Asset" not in df.columns:
        df["Asset"] = None
    mask = df["Asset"].isna() | (df["Asset"] == "")
    # Only classify rows where Asset is missing
    if mask.any():
        df.loc[mask, "Asset"] = df.loc[mask].apply(
            lambda r: classify_asset(
                title=r.get("Title"),
                description=r.get("Description"),
                subreddit_map=subreddit_map or r.get("Subreddit")
            ),
            axis=1,
        )
    return df

# Function to scrape (Old) Reddit posts from specified subreddit(s)
def scrape_reddit_posts(subreddit='CryptoCurrency', total_limit=100, excel_path="./data/reddit_crypto_dataset.xlsx"):
    # Load existing URLs to avoid duplicates
    existing_urls: set[str] = set()
    df_existing = pd.DataFrame()
    if os.path.exists(excel_path):
        try:
            df_existing = pd.read_excel(excel_path)
            df_existing = check_asset_column(df_existing)
            existing_urls = set(df_existing.get("URL", pd.Series([], dtype=str)).tolist())
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
                # Check if the post URL is already in the existing URLs
                if post_url not in existing_urls:
                    # Append the post details to the list
                    posts.append({
                        "Source": "Reddit",
                        "Title": title,
                        "URL": post_url,
                        "Timestamp": timestamp,
                        "Language": "English",
                        "Subreddit": subreddit,
                        "Asset": classify_asset(title=title, description=None, subreddit_map=subreddit),
                    })
        # Emulate pagination by finding the next button
        next_button = soup.find("span", class_="next-button")
        if next_button and next_button.a:
            url = next_button.a["href"]
        else:
            break
    
    # Concatenate new posts with existing ones
    df_new = pd.DataFrame(posts)
    if not df_existing.empty:
        df_existing = check_asset_column(df_existing)
    if not df_new.empty and "Asset" not in df_new.columns:
        df_new = check_asset_column(df_new, subreddit_map=subreddit)
    df_combined = pd.concat([df_existing, df_new], ignore_index=True)
    # Ensure no duplicate URLs and sort by timestamp
    df_combined.drop_duplicates(subset=["URL"], inplace=True)
    df_combined = df_combined.sort_values(by="Timestamp", ascending=False)
    # Save the combined DataFrame to Excel spreadsheet (ordered columns)
    df_combined = reorder_reddit_columns(df_combined)
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
                    'Language': language_full,
                    'Asset': classify_asset(title=article.get('title'), description=article.get('description'), subreddit_map=None),
                }
                # Append the article information to the headlines list
                headlines.append(headline_info)
            
        # Load existing dataset if it exists
        if os.path.exists(excel_path):
            try:
                df_existing = pd.read_excel(excel_path)
                df_existing = check_asset_column(df_existing)
                # Extract existing URLs to avoid duplicates
                existing_urls = set(df_existing.get("URL", pd.Series([], dtype=str)).tolist())
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
        if not df_new.empty and "Asset" not in df_new.columns:
            df_new = check_asset_column(df_new)
        # Concatenate and deduplicate by URL
        df_combined = pd.concat([df_existing, df_new], ignore_index=True)
        # Ensure no duplicate URLs and sort by timestamp
        df_combined.drop_duplicates(subset=["URL"], inplace=True)
        df_combined = df_combined.sort_values(by="Timestamp", ascending=False)
        # Save the combined DataFrame to Excel spreadsheet (ordered columns)
        df_combined = reorder_newsapi_columns(df_combined)
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

        # Ensure that 'Asset' column exists and is populated
        df_reddit = check_asset_column(df_reddit)
        df_newsapi = check_asset_column(df_newsapi)

        # Load existing "merged_crypto_dataset.xlsx" (if it exists)
        # N.B: _ex implies "existing"
        df_merged_ex = pd.read_excel(merged_path) if os.path.exists(merged_path) else pd.DataFrame()

        # Combine Reddit and NewsAPI datasets
        df_combined = pd.concat([df_reddit, df_newsapi], ignore_index=True)

        # Align with existing merged dataset by URL
        if not df_merged_ex.empty:
            # Merge based on URL, prioritising the existing sentiment columns, i.e. Sentiment_Orca2
            df_combined = pd.merge(df_combined, df_merged_ex, on="URL", how="outer", suffixes=("_new", ""))

            # Handling of 'Asset' column with _new suffix
            if "Asset_new" in df_combined.columns and "Asset" in df_combined.columns:
                df_combined["Asset"] = df_combined["Asset"].combine_first(df_combined["Asset_new"])
                df_combined.drop(labels=["Asset_new"], axis=1, inplace=True)
            elif "Asset_new" in df_combined.columns and "Asset" not in df_combined.columns:
                df_combined.rename(columns={"Asset_new": "Asset"}, inplace=True)

            # Non-sentiment and Non-asset columns handling (left to right priority)
            for col in df_reddit.columns:
                if col == "URL" or col == "Asset" or str(col).lower().startswith("sentiment_"):
                    continue
                alt = col + "_new"
                if alt in df_combined.columns and col in df_combined.columns:
                    df_combined[col] = df_combined[alt].combine_first(df_combined[col])
                    df_combined.drop(labels=[alt], axis=1, inplace=True)
                elif alt in df_combined.columns and col not in df_combined.columns:
                    df_combined.rename(columns={alt: col}, inplace=True)

            # Resolve any remaining _new suffix columns (i.e. "Description_new" from NewsAPI)
            for alt in [c for c in list(df_combined.columns) if str(c).endswith("_new")]:
                base = alt[:-4]
                # Skip URL/Asset (handled elsewhere) and sentiment columns
                if base in ("URL", "Asset") or base.lower().startswith("sentiment_"):
                    # Drop stray _new suffix columns if base exists
                    if base in df_combined.columns:
                        df_combined.drop(labels=[alt], axis=1, inplace=True)
                    else:
                        # Rename to base to keep data if base is missing entirely
                        df_combined.rename(columns={alt: base}, inplace=True)
                    continue
                if base in df_combined.columns:
                    df_combined[base] = df_combined[alt].combine_first(df_combined[base])
                    df_combined.drop(labels=[alt], axis=1, inplace=True)
                else:
                    df_combined.rename(columns={alt: base}, inplace=True)

        # Ensure that 'Asset' column exists everywhere (fill any remaining gaps)
        df_combined = check_asset_column(df_combined)

        # Count duplicates and remove based on matching URLs
        num_duplicates = int(df_combined.duplicated(subset=["URL"]).sum())
        df_combined.drop_duplicates(subset=["URL"], inplace=True)

        # Sort by 'Timestamp' column if present
        if "Timestamp" in df_combined.columns:
            df_combined = df_combined.sort_values(by="Timestamp", ascending=False)

        # Save the updated "merged_crypto_dataset.xlsx"
        os.makedirs(os.path.dirname(merged_path), exist_ok=True)
        df_combined = reorder_merged_columns(df_combined)
        df_combined.to_excel(merged_path, index=False)

        # Print summary information for debugging and tracking
        print(f"Merged dataset saved to {merged_path} with {len(df_combined)} posts.")
        print(f"Number of duplicates removed: {num_duplicates}")
        
        return len(df_combined)

    # Return error if datasets fail to merge
    except Exception as e:
        print(f"Error merging the datasets: {e}")
        return 0