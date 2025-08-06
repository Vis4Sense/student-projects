#-------------------------------------------------------------------------------#
# Name: Streamlit Dashboard for Modular DL Framework
# Description: This script creates a Streamlit dashboard for configuring and 
#              experimenting with a modular deep learning framework with the 
#              inclusion of multilingual sentiment analysis and LLM options
#              to predict cryptocurrency prices.
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 06/08/2025
# Python Version: 3.10.6
# Packages Required: streamlit, pandas, pyyaml, time, os
#-------------------------------------------------------------------------------#
# Run this in the Powershell terminal to save the file path as a variable
# $sl_path = "k:/student-projects/2025-summer/Ashley Beebakee/src/framework.py"
# Then run Streamlit with the saved path as below.
# streamlit run $sl_path
#-------------------------------------------------------------------------------#

# Import necessary libraries
import streamlit as st
import pandas as pd
import yaml
import time
import os

# Import required modules
from sentiment.scraping import scrape_reddit_posts, get_newsapi_headlines
from models.prompt import ZERO_SHOT_LLAMA, FEW_SHOT_LLAMA, CHAIN_OF_THOUGHT_LLAMA
from models.prompt import ZERO_SHOT_BLOOMZ, FEW_SHOT_BLOOMZ, CHAIN_OF_THOUGHT_BLOOMZ
from models.prompt import ZERO_SHOT_ORCA, FEW_SHOT_ORCA, CHAIN_OF_THOUGHT_ORCA, CLASSIFICATION_ORCA
from models.llm_selection import analyse_sentiment
from data.historical import fetch_price_data, preprocess_data

# Assign model config to constant variable
CONFIG_PATH = "config/framework_config.yaml"

# Define default config as backup
DEFAULT_CONFIG = {
    "cryptocurrency": "Bitcoin",
    "interval": "1d",
    "llm": "LLaMA 3.1 8B (4-bit)",
    "prompt": "Zero-shot",
    "sentiment": "Reddit",
    "subreddits": "CryptoCurrency"
}

# Define paths for News Sources Data
REDDIT_PATH = "./data/reddit_crypto_dataset.xlsx"
NEWS_API_PATH = "./data/newsapi_crypto_dataset.xlsx"

# Define paths for Time Series Data
BTC_PATH = "./data/btc_dataset_20250101_20250701_1d.csv"
ETH_PATH = "./data/eth_dataset_20250101_20250701_1d.csv"
DOGE_PATH = "./data/doge_dataset_20250101_20250701_1d.csv"

# Load model configuration from YAML file
def load_config():
    if not os.path.exists(CONFIG_PATH):
        return DEFAULT_CONFIG.copy()
    with open(CONFIG_PATH, 'r') as f:
        data = yaml.safe_load(f)
        if data is None:
            data = {}
        # Merge with default config to ensure all elements exist
        config = DEFAULT_CONFIG.copy()
        config.update(data)
        return config

# Save model configuration to YAML file
def save_config(config):
    os.makedirs(os.path.dirname(CONFIG_PATH), exist_ok=True)
    with open(CONFIG_PATH, 'w') as f:
        yaml.dump(config, f)

# Set page layout to wide
st.set_page_config(layout="wide")

# Add custom CSS for styling columns
st.markdown(
    """
    <style>
    div[data-testid="stColumn"] {
        border: 1px solid #fff !important;
        border-radius: 10px !important;
        padding: 12px !important;
        margin: 4px !important;
    }
    </style>
    """,
    unsafe_allow_html=True
)

# Streamlit dashboard title
st.title("Streamlit Modular DL Framework Prototype v0.8")

# Nota Bene (N.B.):
# The prefix "r_" denotes the word "run", as in where the run button is placed.
# The default start and end dates are set to 1st January 2025 and 1st July 2025 respectively.

# Create tabs for configuration and data visualisation
tab1, tab2, tab3 = st.tabs(["Configuration", "News Sources Data", "Time Series Data"])

with tab1:
    column1, column2, column3, column4 = st.columns([10, 10, 10, 10]) # Adjust values to change column width/ratio

    with column1:
        # Load model_config.yaml if it exists, otherwise use default config
        if os.path.exists(CONFIG_PATH):
            config = load_config()

        # 'News Sources Data' section
        st.subheader("News Sources Data")
        # Define the layout for the news sources data section
        news_col, r_news_col = st.columns([8.25, 1.5])

        with news_col:
            # Select news source to scrape/get data from
            config['sentiment'] = st.selectbox("Select Crypto News Source:", ["Reddit", "NewsAPI"], index=["Reddit", "NewsAPI"].index(config['sentiment']))
            
            # If Reddit is selected, add slider for number of posts to be scraped
            # N.B: This is only applicable for Reddit posts scraping
            if config['sentiment'] == "Reddit":
                # Add slider for number of posts to be scraped
                num_posts = st.slider("Number of Posts to Scrape:", min_value=1, max_value=1000, value=1, help="Select how many posts to scrape (1-1000)")
                subreddit = st.selectbox("Choose Subreddit to Scrape:", ["All", "CryptoCurrency", "Bitcoin", "Ethereum", "Dogecoin", "CryptoMarkets", "Altcoin"], index=["All","CryptoCurrency", "Bitcoin", "Ethereum", "Dogecoin", "CryptoMarkets", "Altcoin"].index(config['subreddits']))
            
            # If NewsAPI is selected, add radio button for language selection
            elif config['sentiment'] == "NewsAPI":
                lang_option = st.radio("Select Language for NewsAPI:", ["All", "English", "German", "French", "Spanish", "Italian"], horizontal=True)
                # Map language options to NewsAPI language codes
                language_map = {
                    "English": "en",
                    "German": "de",
                    "French": "fr",
                    "Spanish": "es",
                    "Italian": "it"
                }
                # If "All" is selected, use all languages
                if lang_option == "All":
                    language = list(language_map.values())
                else:
                    # Get the selected language code
                    language = language_map.get(lang_option, "en")

        # When the "Run" button is clicked, scrape Reddit posts or get NewsAPI headlines
        with r_news_col:
            st.markdown("<div style='height: 1.75em;'></div>", unsafe_allow_html=True) # Empty space for alignment
            run_news = st.button("▶", key="run_news")

        #----------------------------------------------------------------------------------------------------#
        # 'Sentiment Analysis' section
        st.subheader("Sentiment Analysis")

        # Open-source and Closed-source LLM Options
        llm_type = st.radio("Toggle Preferred LLM Type:", ["Open-source", "Closed-source"], horizontal=True)
        # Options based on LLM source type
        open_source_llms = ["LLaMA 3.1 8B (4-bit)", "LLaMA 3.1 8B (2-bit)", "Orca 2 7B (6-bit)", "BLOOMZ 7B (4-bit)"]
        closed_source_llms = ["GPT-4o", "Gemini 1.5 Pro", "Claude 3 Opus"]

        # Display corresponding drop-down menu based on LLM source type
        if llm_type == "Open-source":
            llm_options = open_source_llms
        else:
            llm_options = closed_source_llms
            
        # Set default index when switching between LLM types
        if config['llm'] in llm_options:
            llm_index = llm_options.index(config['llm'])
        else:
            llm_index = 0
            config['llm'] = llm_options[0]

        # Define the layout for the LLM and prompt engineering section
        llm_col, r_llm_col = st.columns([8.25, 1.5])
        with llm_col:
            # Select LLM and prompt engineering to use
            config['llm'] = st.selectbox("Select LLM Model:", llm_options, index=llm_index)
            config['prompt'] = st.selectbox("Select Prompt Engineering Technique:", ["Zero-shot", "Few-shot", "Chain-of-Thought (CoT)", "Text Classification"], index=["Zero-shot", "Few-shot", "Chain-of-Thought (CoT)", "Text Classification"].index(config['prompt']))

            # Before running the LLM, load merged dataset and let the user pick a post
            merged_df = None
            if os.path.exists(REDDIT_PATH) and os.path.exists(NEWS_API_PATH):
                df_reddit = pd.read_excel(REDDIT_PATH)
                df_newsapi = pd.read_excel(NEWS_API_PATH)
                merged_df = pd.concat([df_reddit, df_newsapi], ignore_index=True)
                merged_df = merged_df.sort_values(by="Timestamp", ascending=False)

            # Default post text to analyse
            post_text = "Bitcoin just crossed $120,000, a huge milestone"

            # If the merged DataFrame is not empty, allow user to select a post
            if merged_df is not None and not merged_df.empty:
                text_column = "Title" if "Title" in merged_df.columns else merged_df.columns[0]
                post_options = merged_df[text_column].dropna().unique().tolist()
                selected_post = st.selectbox("Select Post for Sentiment Analysis:", post_options)
                post_text = selected_post
        
        # When the "Run" button is clicked, run the LLM for sentiment analysis
        with r_llm_col:
            st.markdown("<div style='height: 1.75em;'></div>", unsafe_allow_html=True) # Empty space for alignment
            run_llm = st.button("▶", key="run_llm")

        # Placeholder to display a video within the framework (optional)
        #st.video("https://www.youtube.com/watch?v=B2iAodr0fOo")

    with column2:
        # 'Time Series Data' section
        st.subheader("Time Series Data (In Progress)")
        # Define the layout for the time series data section
        crypto_col, r_crypto_col = st.columns([8.25, 1.5])
        
        with crypto_col:
            # Select cryptocurrency for which to fetch historical data
            config['cryptocurrency'] = st.selectbox("Select Cryptocurrency:", ["Bitcoin", "Ethereum", "Dogecoin"], index=["Bitcoin", "Ethereum", "Dogecoin"].index(config['cryptocurrency']))
            
            # Set default start and end dates based on the selected cryptocurrency
            start_date = st.date_input("Start Date:", value=pd.to_datetime("2025-01-01"), min_value=pd.to_datetime("2025-01-01"), max_value=pd.to_datetime("2025-07-01"))
            end_date = st.date_input("End Date:", value=pd.to_datetime("2025-07-01"), min_value=pd.to_datetime("2025-01-01"), max_value=pd.to_datetime("2025-07-01"))
            config['interval'] = st.selectbox("Select Time Interval:", ["1m", "5m", "15m", "1h", "1d"], index=["1m", "5m", "15m", "1h", "1d"].index(config['interval']))
            
        # When the "Run" button is clicked, fetch historical data for the selected cryptocurrency
        with r_crypto_col:
            st.markdown("<div style='height: 1.75em;'></div>", unsafe_allow_html=True) # Empty space for alignment
            run_crypto = st.button("▶", key="run_crypto")

    with column3:
        # Display the console output
        st.subheader("Console Output")

        if run_news:
            # If Reddit is selected, scrape posts from specified subreddit(s)
            if config['sentiment'] == "Reddit":
                # N.B: Failed with status code: 429 Too Many Requests (Reddit bot protection)
                # Which seems to occurs with the r/Ethereum (midway through scraping) and r/Dogecoin subreddits
                
                #st.subheader("Reddit Posts")
                # If "All" is selected, scrape posts from all subreddits
                if subreddit == "All":
                    subreddits_all = ["CryptoCurrency", "Bitcoin", "Ethereum", "Dogecoin", "CryptoMarkets", "Altcoin"]
                    total_new_posts = 0
                    # Loop through each subreddit and scrape its posts
                    for sub in subreddits_all:
                        st.write(f"Scraping {num_posts} posts from r/{sub}...")
                        try:
                            num_new_posts = scrape_reddit_posts(subreddit=sub, total_limit=num_posts, excel_path=REDDIT_PATH)
                            st.write(f"{num_new_posts} new posts added from r/{sub}.")
                        except Exception as e:
                            st.warning(f"Error scraping r/+{sub}: {e}")
                            time.sleep(10)  # Wait longer if error 429 occurs
                        time.sleep(3)  # Delay between subreddits to attempt prevention of error 429
                        # Update the total count of new posts
                        total_new_posts += num_new_posts
                    st.write(f"Scraping complete: {total_new_posts} new posts added to the dataset.")
                # If a specific subreddit is selected, scrape posts from that subreddit
                else:
                    st.write(f"Attempting to scrape {num_posts} posts from r/{subreddit}...")
                    num_new_posts = scrape_reddit_posts(subreddit=subreddit, total_limit=num_posts, excel_path=REDDIT_PATH)
                    st.write(f"Scraping complete: {num_new_posts} new posts added to the dataset.")
                    st.write(f"You can view the dataset in the 'Reddit' tab.")
            
            # If NewsAPI is selected, get news headlines
            elif config['sentiment'] == "NewsAPI":
                # N.B: Some languages were not included due to potential LLM compatibility issues

                #st.subheader("NewsAPI Headlines")
                # If "All" is selected, get news headlines for each language
                if isinstance(language, list):
                    total_new_headlines = 0
                    # Loop through each language and get news headlines
                    for lang in language:
                        st.write(f"Getting cryptocurrency news headlines from NewsAPI.org in {lang}...")
                        num_new_headlines = get_newsapi_headlines(language=lang, excel_path=NEWS_API_PATH)
                        st.write(f"{num_new_headlines} new headlines added for language '{lang}'.")
                        # Update the total count of new headlines
                        total_new_headlines += num_new_headlines
                    st.write(f"Scraping complete: {total_new_headlines} new headlines added to the dataset.")
                    st.write(f"You can view the dataset in the 'NewsAPI' tab.")
                # If a specific language is selected, get news headlines for that language
                else:
                    st.write(f"Getting cryptocurrency news headlines from NewsAPI.org in {lang_option}...")
                    num_new_headlines = get_newsapi_headlines(language=language, excel_path=NEWS_API_PATH)
                    st.write(f"Scraping complete: {num_new_headlines} new headlines added to the dataset.")
                    st.write(f"You can view the dataset in the 'NewsAPI' tab.")

        elif run_llm:
            if config['llm'] == "LLaMA 3.1 8B (4-bit)":
                model_path = "./models/Llama-3.1-8B-Instruct-bf16-q4_k.gguf"
                # Assign prompt template for LLaMA 3.1 8B 4-bit model
                if config['prompt'] == "Zero-shot":
                    prompt_template = ZERO_SHOT_LLAMA
                elif config['prompt'] == "Few-shot":
                    prompt_template = FEW_SHOT_LLAMA
                else:
                    prompt_template = CHAIN_OF_THOUGHT_LLAMA
            elif config['llm'] == "LLaMA 3.1 8B (2-bit)":
                model_path = "./models/Llama-3.1-8B-Instruct-iq2_xxs.gguf"
                # Assign prompt template for LLaMA 3.1 8B 2-bit model
                if config['prompt'] == "Zero-shot":
                    prompt_template = ZERO_SHOT_LLAMA
                elif config['prompt'] == "Few-shot":
                    prompt_template = FEW_SHOT_LLAMA
                else:
                    prompt_template = CHAIN_OF_THOUGHT_LLAMA
            elif config['llm'] == "Orca 2 7B (6-bit)":
                model_path = "./models/orca-2-7b.Q6_K.gguf"
                # Assign prompt template for Orca 2 7B 6-bit model
                if config['prompt'] == "Zero-shot":
                    prompt_template = ZERO_SHOT_ORCA
                elif config['prompt'] == "Few-shot":
                    prompt_template = FEW_SHOT_ORCA
                elif config['prompt'] == "Chain-of-Thought (CoT)":
                    prompt_template = CHAIN_OF_THOUGHT_ORCA
                else:
                    prompt_template = CLASSIFICATION_ORCA
            elif config['llm'] == "BLOOMZ 7B (4-bit)":
                model_path = "./models/bloomz-7b1-mt-Q4_K_M.gguf"
                # Assign prompt template for Bloomz 7B 4-bit model
                if config['prompt'] == "Zero-shot":
                    prompt_template = ZERO_SHOT_BLOOMZ
                elif config['prompt'] == "Few-shot":
                    prompt_template = FEW_SHOT_BLOOMZ
                else:
                    prompt_template = CHAIN_OF_THOUGHT_BLOOMZ
            else:
                st.error("Apologies, the selected LLM is not supported yet.")
                model_path = None
                prompt_template = None
            
            # Apply post_text into corresponding prompt template
            prompt = prompt_template.format(post=post_text)

            # Show progress bar while waiting for response
            progress = st.progress(0, text="Analysing with LLM...")
            for percent in range(1, 91, 3):
                time.sleep(0.05)  # Simulate progress (remove if not needed)
                progress.progress(percent, text="Analysing with LLM...")

            # Call the sentiment analysis function
            response = analyse_sentiment(prompt, model_path)

            # Show progress bar completion
            progress.progress(100, text="Analysis complete!")
            time.sleep(1.5)
            progress.empty()

            st.subheader("LLM Sentiment Analysis Result")
            # Visualise the config for debugging
            st.write(f"**LLM Model:** {config['llm']}")
            st.write(f"**Prompt Technique:** {config['prompt']}")
            st.write(f"**Reddit Post:** {post_text}")
            st.write(response)

        elif run_crypto:
            #st.subheader("Time Series Data Analysis")

            # Map user-friendly names to Yahoo tickers
            ticker_map = {
                "Bitcoin": "BTC-USD",
                "Ethereum": "ETH-USD",
                "Dogecoin": "DOGE-USD"
            }
            ticker = ticker_map.get(config['cryptocurrency'], "BTC-USD")

            # Convert Streamlit date objects to string
            start = start_date.strftime("%Y-%m-%d")
            end = end_date.strftime("%Y-%m-%d")
            interval = config['interval']
            # Format dates for dataset naming
            start_fmt = start_date.strftime("%Y%m%d")
            end_fmt = end_date.strftime("%Y%m%d")
            prefix = ""

            # Prefix for the dataset filename
            if config['cryptocurrency'] == "Bitcoin":
                prefix = "btc"
            elif config['cryptocurrency'] == "Ethereum":
                prefix = "eth"
            elif config['cryptocurrency'] == "Dogecoin":
                prefix = "doge"

            # Assign naming convention for the dataset file
            # N.B: The dataset will be saved in the ./data directory
            filename = f"{prefix}_dataset_{start_fmt}_{end_fmt}_{interval}.csv"
            file_path = os.path.join("./data", filename)

            st.write(f"Running time series data extraction for {config['cryptocurrency']} with {config['interval']} interval from {start_date} to {end_date}...")
            # Fetch time series data from Yahoo Finance
            df = fetch_price_data(ticker=ticker, start_date=start, end_date=end, interval=interval)
            # Preprocess (scale) data
            #df_scaled, scaler = preprocess_data(df, scaler_type="minmax", columns=["Close"])

            # Save the preprocessed data to CSV
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            df.to_csv(file_path, index=False)
            st.success(f"Preprocessed data saved to {file_path}")

            # Display the dataset in the console output
            st.subheader(f"{config['cryptocurrency']} Dataset Preview")
            st.dataframe(df)

    with column4:
        # 'Framework Configuration' section
        st.subheader("Configuration")

        # Display the current configuration
        st.write("Current Configuration:")
        st.json(config)

        # Save the configuration of the framework when the button is clicked
        if st.button("Save Configuration"):
            save_config(config)
            st.success("Configuration saved successfully!")

with tab2:
    st.write("Here you can visualise scraped and API data from Reddit and NewsAPI.")
    # Create tabs for configuration and scraped/API data visualisation
    merged_tab, reddit_tab, news_api_tab = st.tabs(["Merged", "Reddit", "NewsAPI"])

    with merged_tab:
        st.subheader("Merged Dataset (Reddit + NewsAPI)")
        # Load and display the merged dataset (Reddit + NewsAPI)
        if os.path.exists(REDDIT_PATH) and os.path.exists(NEWS_API_PATH):
            df_reddit = pd.read_excel(REDDIT_PATH)
            df_newsapi = pd.read_excel(NEWS_API_PATH)
            df_combined = pd.concat([df_reddit, df_newsapi], ignore_index=True)
            df_combined = df_combined.sort_values(by="Timestamp", ascending=False)
            st.dataframe(df_combined)
        else:
            st.warning("No data files found.")

    with reddit_tab:
        st.subheader("Reddit Dataset (4th July 2025 onwards)")
        # Load and display the Reddit dataset
        if os.path.exists(REDDIT_PATH):
            df = pd.read_excel(REDDIT_PATH)
            st.dataframe(df)
        else:
            st.warning("No data file found.")

    with news_api_tab:
        st.subheader("NewsAPI Dataset (1st July 2025 onwards)")
        # Load and display the NewsAPI dataset
        if os.path.exists(NEWS_API_PATH):
            df = pd.read_excel(NEWS_API_PATH)
            st.dataframe(df)
        else:
            st.warning("No data file found.")

with tab3:
    st.write("Here you can visualise historical cryptocurrency data from Yahoo Finance.")
    # Create tabs for configuration and historical data visualisation
    btc_tab, eth_tab, doge_tab = st.tabs(["Bitcoin", "Ethereum", "Dogecoin"])

    with btc_tab:
        st.subheader("Bitcoin Dataset (1st Jan 2025 - 1st July 2025, 1-day interval)")
        # Load and display the historical Bitcoin data
        if os.path.exists(BTC_PATH):
            df = pd.read_csv(BTC_PATH)
            st.dataframe(df)
        else:
            st.warning("No historical dataset found.")
    
    with eth_tab:
        st.subheader("Ethereum Dataset (1st Jan 2025 - 1st July 2025, 1-day interval)")
        # Load and display the historical Ethereum data
        if os.path.exists(ETH_PATH):
            df = pd.read_csv(ETH_PATH)
            st.dataframe(df)
        else:
            st.warning("No historical dataset found.")

    with doge_tab:
        st.subheader("Dogecoin Dataset (1st Jan 2025 - 1st July 2025, 1-day interval)")
        # Load and display the historical Dogecoin data
        if os.path.exists(DOGE_PATH):
            df = pd.read_csv(DOGE_PATH)
            st.dataframe(df)
        else:
            st.warning("No historical dataset found.")
