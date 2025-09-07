#-------------------------------------------------------------------------------#
# Name: Streamlit Dashboard for Modular DL Framework
# Description: This script creates a Streamlit dashboard for configuring and 
#              experimenting with a modular deep learning framework with the 
#              inclusion of multilingual sentiment analysis and LLM options
#              to predict cryptocurrency prices.
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 06/09/2025
# Python Version: 3.10.6
# Packages Required: matplotlib, streamlit, altair, pandas, numpy, torch, pyyaml,
#                    mlflow
#-------------------------------------------------------------------------------#
# Run this in the Powershell terminal to save the file path as a variable
# $sl_path = "k:/student-projects/2025-summer/Ashley Beebakee/src/framework.py"
# To run Streamlit within localhost:
# -> streamlit run $sl_path
# To generate requirements.txt (external packages):
# -> pipreqs "K:\student-projects\2025-summer\Ashley Beebakee" --force
# To generate environment.yml (conda packages):
# -> conda env export --name thesis > environment.yml
#-------------------------------------------------------------------------------#

# Import necessary libraries
import matplotlib.pyplot as plt
import streamlit as st
import altair as alt
import pandas as pd
import numpy as np
import subprocess
import mlflow
import torch
import yaml
import time
import json
import os
import sys

# Import required modules
from sentiment.scraping import scrape_reddit_posts, get_newsapi_headlines, merge_datasets
from models.prompt import ZERO_SHOT_LLAMA, FEW_SHOT_LLAMA, CHAIN_OF_THOUGHT_LLAMA
from models.prompt import ZERO_SHOT_BLOOMZ, FEW_SHOT_BLOOMZ, CHAIN_OF_THOUGHT_BLOOMZ
from models.prompt import ZERO_SHOT_ORCA, FEW_SHOT_ORCA, CHAIN_OF_THOUGHT_ORCA
from models.llm_selection import analyse_sentiment_os, analyse_sentiment_cs
from sentiment.extraction import score_excel
from data.historical import fetch_price_data
from networks.dataloader import load_and_prepare_data
from networks.architecture import get_model
from networks.training import train_model, predict
from datetime import datetime
from pathlib import Path

# Define path for configuration file
CONFIG_PATH = "config/framework_config.yaml"

# Define path for the console output
CONSOLE_PATH = "config/console_output.json"

# Define default config which merges chronologically with 'framework_config.yaml'
DEFAULT_CONFIG = {
    "architecture": "CNN-LSTM",
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
MERGED_PATH = "./data/merged_crypto_dataset.xlsx"

# Define paths for Time Series Data
BTC_PATH = "./data/btc_dataset_20250101_20250701_1d.csv"
ETH_PATH = "./data/eth_dataset_20250101_20250701_1d.csv"
DOGE_PATH = "./data/doge_dataset_20250101_20250701_1d.csv"

# Define paths for all folders
DATA_FOLDER = "./data"
MODELS_FOLDER = "./models"
NETWORKS_FOLDER = "./networks"
SENTIMENT_FOLDER = "./sentiment"

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

# Load console output from JSON file
def load_console_output():
    if os.path.exists(CONSOLE_PATH):
        with open(CONSOLE_PATH, "r") as f:
            return json.load(f)
    return []

# Save console output to JSON file
def save_console_output(output_list):
    with open(CONSOLE_PATH, "w") as f:
        json.dump(output_list, f)

# Append messages to the console output
def add_console_message(msg):
    st.session_state.console_output.append(msg)
    save_console_output(st.session_state.console_output)

# Initialise session state for the console output
if "console_output" not in st.session_state:
    st.session_state.console_output = load_console_output()

# Print output and save to console output JSON file
def log_and_console(msg):
    st.write(msg)
    add_console_message(msg)

# Set page layout to wide
st.set_page_config(layout="wide")

# Add custom CSS for styling columns
st.markdown(
    """
    <style>
    /* Apply global style to all columns */
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
st.title(f"Streamlit Modular DL Framework Prototype v1.4 ({st.__version__})")

# Nota Bene (N.B.):
# The prefix "r_" denotes the word "run", as in where the run button is placed.
# The default start and end dates are set to 1st January 2025 and 1st August 2025 respectively.

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
                num_posts = st.slider("Number of Posts to Scrape:", min_value=10, max_value=1000, value=150, help="Select how many posts to scrape (10-1000).")
                subreddit = st.selectbox("Choose Subreddit to Scrape:", ["All", "CryptoCurrency", "Bitcoin", "Ethereum", "Dogecoin", "CryptoMarkets"], index=["All","CryptoCurrency", "Bitcoin", "Ethereum", "Dogecoin", "CryptoMarkets"].index(config['subreddits']))

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
        # 'Large Language Model (LLM)' section
        st.subheader("Large Language Model (LLM)")

        # Open-source and Closed-source LLM Options
        llm_type = st.radio("Toggle Preferred LLM Type:", ["Open-source", "Closed-source"], horizontal=True)
        # Options based on LLM source type
        open_source_llms = ["LLaMA 3.1 8B (4-bit)", "LLaMA 3.1 8B (2-bit)", "Orca 2 7B (6-bit)", "BLOOMZ 7B (4-bit)"]
        closed_source_llms = ["GPT-5", "Gemini 2.5 Pro", "Claude 3 Opus"]

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

        # Select LLM and prompt engineering to use
        config['llm'] = st.selectbox("Select LLM Model:", llm_options, index=llm_index)
        if llm_type == "Open-source":
            config['prompt'] = st.selectbox("Select Prompt Engineering Technique:", ["Zero-shot", "Few-shot", "Chain-of-Thought (CoT)"], index=["Zero-shot", "Few-shot", "Chain-of-Thought (CoT)"].index(config['prompt']))

        #----------------------------------------------------------------------------------------------------#
        # 'Sentiment Analysis (Manual)' section
        st.subheader("Sentiment Analysis (Manual)")

        # Define the layout for the LLM and prompt engineering section
        man_col, r_man_col = st.columns([8.25, 1.5])
        with man_col:
            # Before running the LLM, load merged dataset and let the user pick a post
            merged_df = None
            if os.path.exists(MERGED_PATH):
                merged_df = pd.read_excel(MERGED_PATH)

            # Default post text to analyse (if merged_df is empty)
            post_text = "Bitcoin just crossed $120,000, a huge milestone"

            # If the merged dataset is not empty, allow user to select a post
            if merged_df is not None and not merged_df.empty:
                text_column = "Title" if "Title" in merged_df.columns else merged_df.columns[0]
                post_options = merged_df[text_column].dropna().unique().tolist()
                selected_post = st.selectbox("Select Post for Sentiment Analysis:", post_options)
                post_text = selected_post

            # Explain functionality of the 'Sentiment Analysis (Manual)' section
            st.caption("This feature tests the quality of sentiment analysis by the chosen LLM based on its prompt engineering technique.")

        # When the "Run" button is clicked, run the LLM for sentiment analysis
        with r_man_col:
            st.markdown("<div style='height: 1.75em;'></div>", unsafe_allow_html=True) # Empty space for alignment
            run_man = st.button("▶", key="run_man")

        #----------------------------------------------------------------------------------------------------#
        # 'Sentiment Analysis (Automatic)' section
        st.subheader("Sentiment Analysis (Automatic)")

        # Define the layout for the LLM and prompt engineering section
        aut_col, r_aut_col = st.columns([8.25, 1.5])
        with aut_col:
            num_sentiment_posts = st.slider("Number of Posts for Sentiment Extraction:", min_value=10, max_value=10000, value=20, help="Select how many posts to extract sentiment from (10-10000).")

            st.caption("This feature uses a default prompt template configured for rapid sentiment analysis of multiple posts.")

        # When the "Run" button is clicked, run the LLM for sentiment analysis
        with r_aut_col:
            st.markdown("<div style='height: 1.75em;'></div>", unsafe_allow_html=True) # Empty space for alignment
            run_aut = st.button("▶", key="run_aut")

    with column2:
        # 'Time Series Data' section
        st.subheader("Time Series Data")
        # Define the layout for the time series data section
        crypto_col, r_crypto_col = st.columns([8.25, 1.5])
        
        with crypto_col:
            # Select cryptocurrency for which to fetch historical data
            config['cryptocurrency'] = st.selectbox("Select Cryptocurrency:", ["Bitcoin", "Ethereum", "Dogecoin"], index=["Bitcoin", "Ethereum", "Dogecoin"].index(config['cryptocurrency']), help="Choose cryptocurrency to fetch historical price data for.")
            
            # Set default start and end dates based on the selected cryptocurrency
            start_date = st.date_input("Start Date:", value=pd.to_datetime("2025-01-01"), min_value=pd.to_datetime("2025-01-01"), max_value=pd.to_datetime("2025-08-01"))
            end_date = st.date_input("End Date:", value=pd.to_datetime("2025-08-01"), min_value=pd.to_datetime("2025-01-01"), max_value=pd.to_datetime("2025-08-01"))
            config['interval'] = st.selectbox("Select Time Interval:", ["1m", "5m", "15m", "1h", "1d"], index=["1m", "5m", "15m", "1h", "1d"].index(config['interval']))
            st.caption("Press 'Refresh UI' button after execution.")

        # When the "Run" button is clicked, fetch historical data for the selected cryptocurrency
        with r_crypto_col:
            st.markdown("<div style='height: 1.75em;'></div>", unsafe_allow_html=True) # Empty space for alignment
            run_crypto = st.button("▶", key="run_crypto")

        #----------------------------------------------------------------------------------------------------#
        # 'Deep Learning Architecture' section
        st.subheader("Deep Learning Architecture")
        # Define the layout for the deep learning architecture section
        architecture_col, r_architecture_col = st.columns([8.25, 1.5])

        with architecture_col:
            config['architecture'] = st.selectbox("Select Architecture:", ["LSTM", "CNN", "CNN-LSTM"], index=["LSTM", "CNN", "CNN-LSTM"].index(config['architecture']))

            # Preprocessing options (no leakage + optional return target)
            # N.B: The prefix 'pp_' stands for pre-processing
            with st.expander("Pre-processing", expanded=False):
                config['pp_sequence_length'] = st.number_input("Sequence Length", min_value=5, max_value=256, value=int(config.get('pp_sequence_len', 30)), help="Enter a value between 5 and 256.")
                config['pp_feat_scaler'] = st.selectbox("Feature Scaler", ["MinMax", "Standard"], index=["MinMax", "Standard"].index(config.get('pp_feat_scaler', "MinMax")))
                config['pp_target_mode'] = st.selectbox("Target Type", ["price", "log_return"], index=["price", "log_return"].index(config.get('pp_target_mode', "price")))
                config['pp_target_scaler'] =  st.selectbox("Target Scaler", ["None", "MinMax", "Standard"], index=["None", "MinMax", "Standard"].index(config.get('pp_target_scaler', "None")))
                config['pp_batch_size'] = st.number_input("Batch Size", min_value=8, max_value=512, value=int(config.get('pp_batch_size', 32)), step=8, help="Enter a value between 8 and 512.")

            # Define set of hyperparameters for corresponding architecture (LSTM, CNN, CNN-LSTM)
            # N.B: The prefix 'hp_' stands for hyperparameter
            with st.expander("Hyperparameters", expanded=False):
                if config['architecture'] == "LSTM":
                    config['hp_lstm_hidden'] = st.number_input("LSTM Hidden Size", min_value=8, max_value=1024, value=int(config.get('hp_lstm_hidden', 64)), step=8, help="Enter a value between 8 and 1024.")
                    config['hp_lstm_layers'] = st.slider("LSTM Layers", min_value=1, max_value=4, value=int(config.get('hp_lstm_layers', 2)), help="Enter a value between 1 and 4.")
                    config['hp_lstm_dropout'] = st.slider("LSTM Dropout", min_value=0.0, max_value=0.8, value=float(config.get('hp_lstm_dropout', 0.2)), step=0.05, help="Enter a value between 0.0 and 0.8.")
                elif config['architecture'] == "CNN":
                    config['hp_cnn_filters'] = st.number_input("CNN Filters", min_value=4, max_value=512, value=int(config.get('hp_cnn_filters', 64)), step=4, help="Enter a value between 4 and 512.")
                    config['hp_cnn_kernel'] = st.selectbox("CNN Kernel Size", options=[3, 5, 7, 9, 11], index=[3, 5, 7, 9, 11].index(int(config.get('hp_cnn_kernel', 5))))
                    config['hp_cnn_stride'] = st.selectbox("CNN Stride", options=[1, 2], index=[1, 2].index(int(config.get('hp_cnn_stride', 1))), help="Enter a value between 1 and 2.")
                    config['hp_cnn_dropout'] = st.slider("CNN Dropout", min_value=0.0, max_value=0.8, value=float(config.get('hp_cnn_dropout', 0.2)), step=0.05, help="Enter a value between 0.0 and 0.8.")
                else:
                    config['hp_cnnlstm_filters'] = st.number_input("CNN-LSTM Convolution Filters", min_value=4, max_value=512, value=int(config.get('hp_cnnlstm_filters', 32)), step=4, help="Enter a value between 4 and 512.")
                    config['hp_cnnlstm_kernel'] = st.selectbox("CNN-LSTM Kernel Size", options=[3, 5, 7], index=[3, 5, 7].index(int(config.get('hp_cnnlstm_kernel', 5))), help="Enter a value between 3 and 7.")
                    config['hp_cnnlstm_lstm_hidden'] = st.number_input("CNN-LSTM Hidden Size", min_value=8, max_value=1024, value=int(config.get('hp_cnnlstm_lstm_hidden', 64)), step=8, help="Enter a value between 8 and 1024.")
                    config['hp_cnnlstm_lstm_layers'] = st.slider("CNN-LSTM Layers", min_value=1, max_value=4, value=int(config.get('hp_cnnlstm_lstm_layers', 2)), help="Enter a value between 1 and 4.")
                    config['hp_cnnlstm_dropout'] = st.slider("CNN-LSTM Dropout", min_value=0.0, max_value=0.8, value=float(config.get('hp_cnnlstm_dropout', 0.2)), step=0.05, help="Enter a value between 0.0 and 0.8.")

            # Training options (optim & regularisation)
            # N.B: The prefix 'tr_' stands for training
            with st.expander("Training", expanded=False):
                # Display training logs (epochs) within the VS Code terminal
                config['tr_verbose'] = st.checkbox("Show training logs", value=bool(config.get('tr_verbose', True)))
                config['tr_epochs'] = st.number_input("Epochs", min_value=1, max_value=5000, value=int(config.get('tr_epochs', 100)), step=50, help="Enter a value between 1 and 5000.")
                col_lr, col_wd = st.columns(2)
                with col_lr:
                    config['tr_lr'] = st.number_input("Learning rate", min_value=1e-6, max_value=1.0, value=float(config.get('tr_lr', 1e-3)), step=1e-4, format="%.6f", help="Enter a value between 1e-6 and 1.0.")
                with col_wd:
                    config['tr_weight_decay'] = st.number_input("Weight decay", min_value=0.0, max_value=1.0, value=float(config.get('tr_weight_decay', 0.0)), step=1e-4, format="%.6f", help="Enter a value between 0.0 and 1.0.")
                # Optionality for 'Early Stopping'
                config['tr_es_enable'] = st.checkbox("Enable Early Stopping", value=bool(config.get('tr_es_enable', False)))
                es_cols = st.columns(2)
                with es_cols[0]:
                    config['tr_es_patience'] = st.number_input("ES Patience", min_value=1, max_value=500, value=int(config.get('tr_es_patience', 20)), help="Enter a value between 1 and 500.")
                with es_cols[1]:
                    config['tr_es_min_delta'] = st.number_input("ES Min Delta", min_value=0.0, max_value=1.0, value=float(config.get('tr_es_min_delta', 0.0)), step=0.0001, format="%.6f", help="Enter a value between 0.0 and 1.0.")
            
            # MLflow (Experiment Tracking)
            # N.B: The prefix 'mlf_' stands for MLflow
            # 'URI' stands for Uniform Resource Identifier
            with st.expander("MLflow (Experiment Tracking)", expanded=False):
                config['mlf_enable'] = st.checkbox("Enable MLflow Tracking", value=bool(config.get('mlf_enable', True)))
                config['mlf_experiment'] = st.text_input("Experiment Name", value=str(config.get('mlf_experiment', 'training_logs')), help="Name of the MLflow experiment to log runs under.")
                config['mlf_tracking_uri'] = st.text_input("Tracking URI", value=str(config.get('mlf_tracking_uri', 'file:./mlruns')), help="For local tracking store, use defined 'Uniform Resource Identifier'.")
                
                # Define default port for MLflow UI (Port 5001)
                default_port = int(config.get('mlf_port', 5001))
                config['mlf_port'] = st.number_input("UI Port", min_value=1024, max_value=65535, value=default_port, step=1)
                
                # Manage simple start/stop of MLflow UI
                if 'mlflow_ui_proc' not in st.session_state:
                    st.session_state.mlflow_ui_proc = None
                    st.session_state.mlflow_ui_port = None
                start_ui = st.button("Start UI")
                stop_ui = st.button("Stop UI")

                # Start MLflow UI handler
                if start_ui:
                    if mlflow is None:
                        st.error("MLflow is not installed. Please install requirements and restart.")
                    elif st.session_state.mlflow_ui_proc is None or st.session_state.mlflow_ui_proc.poll() is not None:
                        try:
                            port = int(config['mlf_port'])
                            # Launch MLflow UI process using current Python environment
                            cmd = [sys.executable, "-m", "mlflow", "ui", "--port", str(port), "--backend-store-uri", str(config['mlf_tracking_uri'])]
                            proc = subprocess.Popen(cmd, shell=False)
                            st.session_state.mlflow_ui_proc = proc
                            st.session_state.mlflow_ui_port = port
                            st.success(f"MLflow UI started on http://127.0.0.1:{port}")
                            add_console_message(f"MLflow UI started on http://127.0.0.1:{port}")
                        except Exception as e:
                            st.error(f"Failed to start MLflow UI: {e}")
                    else:
                        st.info("MLflow UI already running.")
                # Stop MLflow UI handler
                if stop_ui:
                    proc = st.session_state.get('mlflow_ui_proc')
                    if proc is not None and proc.poll() is None:
                        try:
                            proc.terminate()
                            time.sleep(1)
                            if proc.poll() is None:
                                proc.kill()
                            st.session_state.mlflow_ui_proc = None
                            st.session_state.mlflow_ui_port = None
                            st.success("MLflow UI stopped.")
                        except Exception as e:
                            st.error(f"Failed to stop MLflow UI: {e}")
                    else:
                        st.info("MLflow UI is not running.")

            # Get list of available CSV files from data folder
            if os.path.exists(DATA_FOLDER):
                csv_files = [f for f in os.listdir(DATA_FOLDER) if f.endswith('.csv')]
                if csv_files:
                    select_ts = st.selectbox(
                        "Select Time Series Data:",
                        csv_files,
                        help="Choose a CSV file from the data folder."
                    )
                    # Store selection for availability when clicking "run_architecture"
                    st.session_state["selected_time_series"] = select_ts
                    #st.caption("To be fused with merged_crypto_dataset.xlsx")
                else:
                    st.warning("No CSV files found in the data folder.")
            else:
                st.error("Data folder not found.")
        
        with r_architecture_col:
            st.markdown("<div style='height: 1.75em;'></div>", unsafe_allow_html=True)
            run_architecture = st.button("▶", key="run_architecture")

    with column3:
        # Set header for the console output section
        st.subheader("Console History & Output")

        # Button to clear console output
        if st.button("Clear Console Output"):
            st.session_state.console_output = []
            save_console_output(st.session_state.console_output)
            st.rerun()

        # Define scrollable, fixed-height container for console output
        st.markdown("""
            <div style="
                height: 300px;
                overflow-y: auto;
                background: #222;
                color: #fff;
                border-radius: 8px;
                padding: 12px;
                font-family: monospace;
                font-size: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                margin-bottom: 1em;
            ">
            {}
            </div>
        """.format("<br>".join(st.session_state.console_output[-100:])), unsafe_allow_html=True)

        # Button to refresh the Streamlit dashboard
        if st.button("Refresh UI"):
            st.rerun()

        if run_news:
            # If Reddit is selected, scrape posts from specified subreddit(s)
            if config['sentiment'] == "Reddit":
                # N.B: Failed with status code: 429 Too Many Requests (Reddit bot protection)
                # Which seems to occurs with the r/Ethereum (midway through scraping) and r/Dogecoin subreddits
                # If "All" is selected, scrape posts from all subreddits
                if subreddit == "All":
                    subreddits_all = ["CryptoCurrency", "Bitcoin", "Ethereum", "Dogecoin", "CryptoMarkets"]
                    total_new_posts = 0
                    # Loop through each subreddit and scrape its posts
                    for sub in subreddits_all:
                        with st.spinner(f"Scraping {num_posts} posts from r/{sub}..."):
                            try:
                                num_new_posts = scrape_reddit_posts(subreddit=sub, total_limit=num_posts, excel_path=REDDIT_PATH)
                                log_and_console(f"{num_new_posts} new posts added from r/{sub}.")
                            except Exception as e:
                                st.warning(f"Error scraping r/+{sub}: {e}")
                                time.sleep(10)  # Wait longer if error 429 occurs
                            time.sleep(3)  # Delay between subreddits to attempt prevention of error 429
                            # Update the total count of new posts
                            total_new_posts += num_new_posts
                    log_and_console(f"Scraping complete: {total_new_posts} new posts added to the dataset.")
                # If a specific subreddit is selected, scrape posts from that subreddit
                else:
                    with st.spinner(f"Attempting to scrape {num_posts} posts from r/{subreddit}..."):
                        num_new_posts = scrape_reddit_posts(subreddit=subreddit, total_limit=num_posts, excel_path=REDDIT_PATH)
                    log_and_console(f"Scraping complete: {num_new_posts} new posts added to the dataset.")
                    log_and_console(f"You can view the dataset in the 'Reddit' tab.")
            
            # If NewsAPI is selected, get news headlines
            elif config['sentiment'] == "NewsAPI":
                # N.B: Some languages were not included due to potential LLM compatibility issues
                # If "All" is selected, get news headlines for each language
                if isinstance(language, list):
                    total_new_headlines = 0
                    # Loop through each language and get news headlines
                    for lang in language:
                        with st.spinner(f"Getting cryptocurrency news headlines from NewsAPI.org in {lang}..."):
                            time.sleep(1)
                            num_new_headlines = get_newsapi_headlines(language=lang, excel_path=NEWS_API_PATH)
                            log_and_console(f"{num_new_headlines} new headlines added for language '{lang}'.")
                        # Update the total count of new headlines
                        total_new_headlines += num_new_headlines
                    log_and_console(f"Scraping complete: {total_new_headlines} new headlines added to the dataset.")
                    log_and_console(f"You can view the dataset in the 'NewsAPI' tab.")
                # If a specific language is selected, get news headlines for that language
                else:
                    with st.spinner(f"Getting cryptocurrency news headlines from NewsAPI.org in {lang_option}..."):
                        time.sleep(2)
                        num_new_headlines = get_newsapi_headlines(language=language, excel_path=NEWS_API_PATH)
                    log_and_console(f"Scraping complete: {num_new_headlines} new headlines added to the dataset.")
                    log_and_console(f"You can view the dataset in the 'NewsAPI' tab.")

            # After scraping for Reddit posts and getting NewsAPI headlines, merge the datasets
            merged_length = merge_datasets(reddit_path=REDDIT_PATH, newsapi_path=NEWS_API_PATH, merged_path=MERGED_PATH)
            st.success(f"Merged dataset saved to {MERGED_PATH} with {merged_length} posts.")
            add_console_message(f"Merged dataset saved to {MERGED_PATH} with {merged_length} posts.")

        elif run_man:
            if llm_type == "Open-source":
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
                    else:
                        prompt_template = CHAIN_OF_THOUGHT_ORCA

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
                    st.error("Apologies, the selected open-source LLM is not supported yet.")
                    model_path = None
                    prompt_template = None
                
                # Apply post_text into corresponding prompt template
                prompt = prompt_template.format(post=post_text)

                add_console_message(f"Analysing with {config['llm']}...")
                with st.spinner(f"Analysing with {config['llm']}..."):
                    # Call the sentiment analysis open-source function
                    response = analyse_sentiment_os(prompt, model_path)

                # Display success message
                add_console_message("Sentiment Analysis (Manual) complete.")
                st.success("Sentiment Analysis (Manual) complete.")
                # Display the configuration and response in the console output
                log_and_console(f"**LLM Model:** {config['llm']}")
                log_and_console(f"**Prompt Technique:** {config['prompt']}")
                log_and_console(f"**Post:** {post_text}")
                log_and_console(response)

            elif llm_type == "Closed-source":
                if config['llm'] == "GPT-5":
                    with st.spinner(f"Analysing with {config['llm']}..."):
                        # Call the sentiment analysis closed-source function
                        response = analyse_sentiment_cs(post_text)

                    # Display success message
                    add_console_message("Sentiment Analysis (Manual) complete.")
                    st.success("Sentiment Analysis (Manual) complete.")
                    # Display the configuration and response in the console output
                    log_and_console(f"**LLM Model:** {config['llm']}")
                    log_and_console(f"**Post:** {post_text}")
                    log_and_console(f"Sentiment Score: {response}")

                elif config['llm'] == "Gemini 2.5 Pro":
                    st.warning("Apologies, Gemini 2.5 Pro is not supported yet.")

                elif config['llm'] == "Claude 3 Opus":
                    st.warning("Apologies, Claude 3 Opus is not supported yet.")

        elif run_aut:
            if llm_type == "Closed-source":
                st.warning("Apologies, Sentiment Analysis (Automatic) is only supported for open-source LLMs at the moment.")
            else: 
                # Map user-friendly LLM names to internal model keys (extraction.py)
                llm_map = {
                    "LLaMA 3.1 8B (4-bit)": "llama31_q4",
                    "LLaMA 3.1 8B (2-bit)": "llama31_iq2", 
                    "Orca 2 7B (6-bit)": "orca2",
                    "BLOOMZ 7B (4-bit)": "bloomz_7b1"
                }
                add_console_message(f"Analysing sentiment of {num_sentiment_posts} posts with {config['llm']}...")
                with st.spinner(f"Analysing sentiment of {num_sentiment_posts} posts with {config['llm']}..."):
                    # Run automatic sentiment analysis based on chosen LLM
                    output_column, processed, total_scored, remaining, total_rows, saved_path = score_excel(limit=num_sentiment_posts, model_key=llm_map.get(config['llm'], "orca2"))
                    st.success("Sentiment Analysis (Automatic) complete.")
                    log_and_console(f"Run summary for {output_column}: \nprocessed = {processed}, \ntotal_scored = {total_scored}, \nremaining = {remaining}, \ntotal_rows = {total_rows}")
                    log_and_console(f"Wrote scores to {saved_path}.")

        elif run_crypto:
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

            with st.spinner(f"Running time series data extraction for {config['cryptocurrency']} with {config['interval']} interval from {start_date} to {end_date}..."):
                time.sleep(3)
                # Fetch time series data from Yahoo Finance
                df = fetch_price_data(ticker=ticker, start_date=start, end_date=end, interval=interval)
                # Preprocess (scale) data
                #df_scaled, scaler = preprocess_data(df, scaler_type="minmax", columns=["Close"])

            # Save the preprocessed data to CSV
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            df.to_csv(file_path, index=False)
            st.success(f"Preprocessed data saved to {file_path}")
            add_console_message(f"Preprocessed data saved to {file_path}")

            # Display the dataset in the console output
            st.subheader(f"{config['cryptocurrency']} Dataset Preview")
            st.dataframe(df)

        elif run_architecture:
            # Load the selected Time Series Dataset (.csv)
            selected_ts = st.session_state.get("selected_time_series")

            # Get the CSV file path
            csv_path = os.path.join(DATA_FOLDER, selected_ts)
            
            # Configure data loaders (train, val & test)
            train_loader, val_loader, test_loader, input_size, meta = load_and_prepare_data(
                csv_path, 
                sequence_length=int(config.get('pp_sequence_length', 30)),
                target_column="Close",
                scaler_type=("minmax" if config.get('pp_feat_scaler', "MinMax") == "MinMax" else "standard"),
                batch_size=int(config.get('pp_batch_size', 32)),
                target_mode=config.get('pp_target_mode', "price"),
                target_scaler_type=(None if config.get('pp_target_scaler', "None") == "None" else ("minmax" if config.get('pp_target_scaler') == "MinMax" else "standard"))
            )

            # Configure deep learning architecture with corresponding hyperparameters
            model = config['architecture']
            # Long Short Term Memory (LSTM)
            if model == "LSTM":
                model = get_model(
                    model.lower(),
                    input_size=input_size,
                    output_size=1,
                    hidden_size=int(config.get('hp_lstm_hidden', 64)),
                    num_layers=int(config.get('hp_lstm_layers', 2)),
                    dropout=float(config.get('hp_lstm_dropout', 0.2)),
                )
            # Convolutional Neural Network (CNN)
            elif model == "CNN":
                model = get_model(
                    model.lower(),
                    input_size=input_size,
                    output_size=1,
                    filters=int(config.get('hp_cnn_filters', 64)),
                    kernel_size=int(config.get('hp_cnn_kernel', 5)),
                    stride=int(config.get('hp_cnn_stride', 1)),
                    dropout=float(config.get('hp_cnn_dropout', 0.2)),
                )
            # CNN-LSTM (Hybrid of above)
            else:
                model = get_model(
                    model.lower(),
                    input_size=input_size,
                    output_size=1,
                    conv_filters=int(config.get('hp_cnnlstm_filters', 32)),
                    kernel_size=int(config.get('hp_cnnlstm_kernel', 5)),
                    stride=1,
                    lstm_hidden=int(config.get('hp_cnnlstm_lstm_hidden', 64)),
                    lstm_layers=int(config.get('hp_cnnlstm_lstm_layers', 2)),
                    dropout=float(config.get('hp_cnnlstm_dropout', 0.2)),
                )

            # Print model information to UI
            device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            model.to(device)
            st.success(model)

            # Define helper function to log parameters to MLflow
            def log_mlflow_params():
                mlflow.log_param('architecture', config.get('architecture'))
                mlflow.log_param('data_csv', selected_ts)

                # Pre-processing
                mlflow.log_param('pp_sequence_length', int(config.get('pp_sequence_length', 30)))
                mlflow.log_param('pp_feat_scaler', config.get('pp_feat_scaler', 'MinMax'))
                mlflow.log_param('pp_target_mode', config.get('pp_target_mode', 'price'))
                mlflow.log_param('pp_target_scaler', config.get('pp_target_scaler', 'None'))
                mlflow.log_param('pp_batch_size', int(config.get('pp_batch_size', 32)))

                # Model hyperparameters
                arch = config.get('architecture')
                if arch == 'LSTM':
                    mlflow.log_param('hp_lstm_hidden', int(config.get('hp_lstm_hidden', 64)))
                    mlflow.log_param('hp_lstm_layers', int(config.get('hp_lstm_layers', 2)))
                    mlflow.log_param('hp_lstm_dropout', float(config.get('hp_lstm_dropout', 0.2)))
                elif arch == 'CNN':
                    mlflow.log_param('hp_cnn_filters', int(config.get('hp_cnn_filters', 64)))
                    mlflow.log_param('hp_cnn_kernel', int(config.get('hp_cnn_kernel', 5)))
                    mlflow.log_param('hp_cnn_stride', int(config.get('hp_cnn_stride', 1)))
                    mlflow.log_param('hp_cnn_dropout', float(config.get('hp_cnn_dropout', 0.2)))
                else:
                    mlflow.log_param('hp_cnnlstm_filters', int(config.get('hp_cnnlstm_filters', 32)))
                    mlflow.log_param('hp_cnnlstm_kernel', int(config.get('hp_cnnlstm_kernel', 5)))
                    mlflow.log_param('hp_cnnlstm_lstm_hidden', int(config.get('hp_cnnlstm_lstm_hidden', 64)))
                    mlflow.log_param('hp_cnnlstm_lstm_layers', int(config.get('hp_cnnlstm_lstm_layers', 2)))
                    mlflow.log_param('hp_cnnlstm_dropout', float(config.get('hp_cnnlstm_dropout', 0.2)))

                # Training
                mlflow.log_param('epochs', int(config.get('tr_epochs', 100)))
                mlflow.log_param('learning_rate', float(config.get('tr_lr', 1e-3)))
                mlflow.log_param('weight_decay', float(config.get('tr_weight_decay', 0.0)))
                mlflow.log_param('early_stopping', bool(config.get('tr_es_enable', False)))
                mlflow.log_param('es_patience', int(config.get('tr_es_patience', 20)))
                mlflow.log_param('es_min_delta', float(config.get('tr_es_min_delta', 0.0)))

            # Configure MLflow if enabled
            use_mlflow = bool(config.get('mlf_enable', False)) and (mlflow is not None)
            if bool(config.get('mlf_enable', False)) and mlflow is None:
                st.warning("MLflow not available, disable tracking or install it.")
            if use_mlflow:
                try:
                    mlflow.set_tracking_uri(str(config.get('mlf_tracking_uri', 'file:./mlruns')))
                    mlflow.set_experiment(str(config.get('mlf_experiment', 'CryptoForecast')))
                except Exception as e:
                    st.warning(f"Could not configure MLflow: {e}")
                    use_mlflow = False

            # Define epoch callback for MLflow
            epoch_cb = None
            if use_mlflow:
                def epoch_cb(epoch, train_loss, val_loss):
                    try:
                        mlflow.log_metric('train_loss', float(train_loss), step=int(epoch))
                        mlflow.log_metric('val_loss', float(val_loss), step=int(epoch))
                    except Exception:
                        pass

            # Train the deep learning model based on selected configurations
            current_run_id = None
            if use_mlflow:
                with mlflow.start_run(run_name=f"{config.get('architecture')}-{Path(selected_ts).stem}"):
                    try:
                        active = mlflow.active_run()
                        if active is not None:
                            current_run_id = active.info.run_id
                    except Exception:
                        current_run_id = None
                    log_mlflow_params()
                    trained_model, history = train_model(
                        model,
                        train_loader,
                        val_loader,
                        num_epochs=int(config.get('tr_epochs', 100)),
                        learning_rate=float(config.get('tr_lr', 1e-3)),
                        weight_decay=float(config.get('tr_weight_decay', 0.0)),
                        early_stopping=bool(config.get('tr_es_enable', False)),
                        es_patience=int(config.get('tr_es_patience', 20)),
                        es_min_delta=float(config.get('tr_es_min_delta', 0.0)),
                        verbose=bool(config.get('tr_verbose', False)),
                        on_epoch_end=epoch_cb,
                    )
            # Redundant training script
            else:
                trained_model, history = train_model(
                    model, 
                    train_loader, 
                    val_loader, 
                    num_epochs=int(config.get('tr_epochs', 100)),
                    learning_rate=float(config.get('tr_lr', 1e-3)),
                    weight_decay=float(config.get('tr_weight_decay', 0.0)),
                    early_stopping=bool(config.get('tr_es_enable', False)),
                    es_patience=int(config.get('tr_es_patience', 20)),
                    es_min_delta=float(config.get('tr_es_min_delta', 0.0)),
                    verbose=bool(config.get('tr_verbose', False)),
                )
            
            # Define function for training history (loss)
            def plot_loss(history):
                fig, ax = plt.subplots(figsize=(7, 4), dpi=120)
                ax.plot(history["train_loss"], label="Train Loss")
                ax.plot(history["val_loss"], label="Validation Loss")
                ax.set_title("Training vs Validation Loss")
                ax.set_xlabel("Epoch")
                ax.set_ylabel("Loss")
                ax.grid(True, alpha=0.3)
                ax.legend()
                st.pyplot(fig, clear_figure=True) # Render the chart in Streamlit
                return fig

            # Visualise training history (loss) — rendered below when logging artifacts

            # Predict on test set and plot 'Predicted vs Actual'
            preds, trues, mse, r2 = predict(trained_model, test_loader)

            # Define function for plotting predictions
            def plot_predictions(y_true, y_pred, title_suffix: str = ""):
                fig, ax = plt.subplots(figsize=(7, 4), dpi=120)
                x = np.arange(len(y_true))

                # Optionality for inverse-transform if 'Target Scaler' has been selected
                y_label = "Target"
                displayed_true = np.asarray(y_true)
                displayed_pred = np.asarray(y_pred)
                inv_note = ""
                try:
                    tgt_scaler = meta.get('target_scaler') if isinstance(meta, dict) else None
                    if tgt_scaler is not None:
                        displayed_true = tgt_scaler.inverse_transform(displayed_true.reshape(-1, 1)).ravel()
                        displayed_pred = tgt_scaler.inverse_transform(displayed_pred.reshape(-1, 1)).ravel()
                        inv_note = " (inverse-transformed)"
                except Exception:
                    pass

                # Plot 'Predicted vs Actual' axes
                ax.plot(x, displayed_true, label="Actual", linewidth=1.8)
                ax.plot(x, displayed_pred, label="Predicted", linewidth=1.2)

                # Label based on mode
                pp_mode = st.session_state.get('pp_target_mode', "price")
                pp_tgt_scaler = st.session_state.get('pp_target_scaler', "None")
                if pp_mode == "price":
                    y_label = "Price" if inv_note else ("Scaled price" if pp_tgt_scaler != "None" else "Price")
                else:
                    y_label = "Log return" if inv_note == "" and pp_tgt_scaler == "None" else ("Scaled log return" if inv_note == "" else "Log return")

                # Recompute metrics in displayed units
                def _mse(a, b):
                    a = np.asarray(a); b = np.asarray(b)
                    return float(np.mean((a - b) ** 2))
                def _r2(a, b):
                    a = np.asarray(a); b = np.asarray(b)
                    ss_res = float(np.sum((a - b) ** 2))
                    ss_tot = float(np.sum((a - np.mean(a)) ** 2))
                    return float(1.0 - ss_res / ss_tot) if ss_tot > 0 else float('nan')
                mse_disp = _mse(displayed_true, displayed_pred)
                r2_disp = _r2(displayed_true, displayed_pred)

                # Plot 'Predicted vs Actual' chart
                ax.set_title(f"Predicted vs Actual{inv_note} {title_suffix}".strip())
                ax.set_xlabel("Time (test index)")
                ax.set_ylabel(y_label)
                ax.grid(True, alpha=0.3)
                ax.legend()
                # Metrics banner
                ax.text(0.01, 0.98, f"MSE: {mse_disp:.4f}  |  R²: {r2_disp:.4f}", transform=ax.transAxes,
                        va='top', ha='left', fontsize=9,
                        bbox=dict(boxstyle='round', facecolor='white', alpha=0.7, edgecolor='#ddd'))
                st.pyplot(fig, clear_figure=True)
                return fig, float(mse_disp), float(r2_disp)

            # Visualise 'Predicted vs Actual' prediction
            # Loss plot
            loss_fig = plot_loss(history)
            # Predictions plot and displayed metrics
            pred_fig, mse_disp, r2_disp = plot_predictions(trues, preds, title_suffix="")

            # Save and log artifacts if MLflow enabled
            if use_mlflow:
                try:
                    def _log_all():
                        # Log raw metrics (in training/target space)
                        try:
                            mlflow.log_metric('test_mse_raw', float(mse))
                            mlflow.log_metric('test_r2_raw', float(r2))
                        except Exception:
                            pass
                        artifacts_dir = Path('./artifacts')
                        artifacts_dir.mkdir(parents=True, exist_ok=True)
                        ts = datetime.now().strftime('%Y%m%d_%H%M%S')
                        loss_path = artifacts_dir / f'loss_{ts}.png'
                        pred_path = artifacts_dir / f'pred_vs_actual_{ts}.png'
                        loss_fig.savefig(loss_path, dpi=150, bbox_inches='tight')
                        pred_fig.savefig(pred_path, dpi=150, bbox_inches='tight')
                        # Log artifacts
                        mlflow.log_artifact(str(loss_path))
                        mlflow.log_artifact(str(pred_path))
                        # Log final metrics in displayed units
                        mlflow.log_metric('test_mse_displayed', float(mse_disp))
                        mlflow.log_metric('test_r2_displayed', float(r2_disp))
                        # Optionality to log the trained model
                        try:
                            if hasattr(mlflow, 'pytorch'):
                                mlflow.pytorch.log_model(trained_model, artifact_path='model')
                        except Exception:
                            pass

                    # Reuse the same run context if needed
                    active = None
                    try:
                        active = mlflow.active_run()
                    except Exception:
                        active = None
                    if active is not None:
                        _log_all()
                    elif current_run_id is not None:
                        with mlflow.start_run(run_id=current_run_id):
                            _log_all()
                    else:
                        # As a last resort, skip logging to avoid creating a stray run
                        pass
                except Exception as e:
                    st.warning(f"Failed to log artifacts to MLflow: {e}")

            # Terminate 'Matplotlib' figures
            try:
                plt.close(loss_fig)
                plt.close(pred_fig)
            except Exception:
                pass
    
    with column4:
        # Load "merged_crypto_dataset.xlsx"
        timeline_path = MERGED_PATH
        try:
            df = pd.read_excel(timeline_path)
        except Exception as e:
            st.error(f"Could not load merged_crypto_dataset: {e}")
            st.stop()

        # Asset filter for the timeline (BTC, ETH, DOGE, MULTI and OTHER)
        asset_options = ["All"]
        if "Asset" in df.columns:
            try:
                asset_options += sorted([a for a in df["Asset"].dropna().unique().tolist()])
            except Exception:
                pass
        selected_asset = st.selectbox("Filter by Asset:", asset_options, index=0)
        if selected_asset != "All" and "Asset" in df.columns:
            df = df[df["Asset"] == selected_asset].copy()

    # Define which columns are for the sentiment scores by prefix "Sentiment_"
        sentiment_cols = [col for col in df.columns if col.lower().startswith("sentiment_")]

        # Convert 'Timestamp' column values to datetime
        if not np.issubdtype(df["Timestamp"].dtype, np.datetime64):
            try:
                df["Timestamp"] = pd.to_datetime(df["Timestamp"], errors="coerce")
            except Exception as e:
                st.error(f"Could not parse the 'Timestamp' column: {e}")
                st.stop()

        # Clean rows without valid timestamps
        df = df.dropna(subset=["Timestamp"]).copy()

        # Set a date range for the visualisation of the timeline, i.e. year 2025
        start_date = datetime(2025, 1, 1)
        end_date = datetime(2025, 12, 31)

        # Build coverage frame for each day of year 2025
        full_range = pd.date_range(start=start_date, end=end_date, freq="D")
        coverage = pd.DataFrame({"date": full_range})

        # Ensure 'date' columns align (naive/without timezone)
        df["date"] = df["Timestamp"].dt.floor("D")
        df["date"] = df["date"].dt.tz_localize(None)
        coverage["date"] = coverage["date"].dt.tz_localize(None)

        # Count rows per date
        rows_per_date = (
            df[(df["date"] >= start_date) & (df["date"] <= end_date)]
            .groupby("date")
            .size()
            .rename("row_count")
        )
        coverage = coverage.merge(rows_per_date, on="date", how="left").fillna({"row_count": 0})
        # Ensure integer dtype after merge/fill to avoid float later
        coverage["row_count"] = coverage["row_count"].astype("int64")

        # Sentiment data per specific day (date)
        if sentiment_cols:
            has_sentiment_mask = df[sentiment_cols].notna().any(axis=1)
            df["has_sentiment"] = has_sentiment_mask
            sent_per_date = (
                df[(df["date"] >= start_date) & (df["date"] <= end_date)]
                .groupby("date")["has_sentiment"]
                .any()
                .rename("has_sentiment")
            )
            coverage = coverage.merge(sent_per_date, on="date", how="left")
        else:
            coverage["has_sentiment"] = False

        # Fill NaNs and normalize types to avoid FutureWarning
        # Use pandas nullable BooleanDtype to avoid object downcasting warnings
        coverage["has_sentiment"] = (
            coverage["has_sentiment"]
            .astype("boolean")
            .fillna(False)
            .astype(bool)
        )
        coverage["has_rows"] = (coverage["row_count"] > 0)

        # Label status based on group type
        def label_status(row):
            if not row["has_rows"]:
                return "No Data"
            return "Sentiment Data" if row["has_sentiment"] else "Non-Sentiment Data"
    
        coverage["status"] = coverage.apply(label_status, axis=1)

        # Build explicit 1-day intervals so each day renders as its own block
        coverage = coverage.sort_values("date").reset_index(drop=True)
        coverage["end"] = coverage["date"] + pd.Timedelta(days=1)
        coverage["band"] = "Coverage"

        # Consolidate contiguous days with the same status into intervals (Gantt-style)
        prev_date = coverage["date"].shift(1)
        prev_status = coverage["status"].shift(1)
        new_group = (coverage["status"] != prev_status) | (coverage["date"] != prev_date + pd.Timedelta(days=1))
        coverage["grp"] = new_group.cumsum()
        intervals = (
            coverage.groupby(["grp", "status"], as_index=False)
            .agg(start=("date", "min"), end=("end", "max"), rows=("row_count", "sum"))
        )
        intervals["band"] = "Coverage"

        # Split into separate DataFrames for robust layered rendering AND build single-encoded dataset with fixed colors
        color_map = {
            "Sentiment Data": "#22c55e",
            "Non-Sentiment Data": "#f97316",
            "No Data": "#ef4444",
        }
        intervals["color"] = intervals["status"].map(color_map)

        # Debugging code to inspect intervals (Sentiment Data, Non-Sentiment Data, No Data)
        #st.write("### Debug: Intervals by status")
        #st.write(intervals["status"].value_counts())
        #st.write(intervals.head(10))

        # Build layered chart per status for robust coloring
        iv_red = intervals[intervals["status"] == "No Data"]
        iv_orange = intervals[intervals["status"] == "Non-Sentiment Data"]
        iv_green = intervals[intervals["status"] == "Sentiment Data"]

        base_enc_layered = dict(
            x=alt.X("start:T", title="Date"),
            x2="end",
            y=alt.Y("band:N", title="", axis=alt.Axis(labels=False, ticks=False)),
            tooltip=[
                alt.Tooltip("status:N", title="Status"),
                alt.Tooltip("start:T", title="Start"),
                alt.Tooltip("end:T", title="End"),
            ],
        )

        # Create individual charts for each group type (chart)
        ch_red = alt.Chart(iv_red).mark_bar(color="#ef4444", height=26).encode(**base_enc_layered)
        ch_orange = alt.Chart(iv_orange).mark_bar(color="#f97316", height=26).encode(**base_enc_layered)
        ch_green = alt.Chart(iv_green).mark_bar(color="#22c55e", height=26).encode(**base_enc_layered)

        # Combine all layers into a single chart (timeline) with defined height value
        chart = alt.layer(ch_red, ch_orange, ch_green).properties(height=72)

        # Add a title for the timeline
        st.subheader("Timeline - Year 2025 (News Sources Data Availability)")
        st.altair_chart(chart, use_container_width=True)

        # Define legend for the timeline (Green, Orange and Red)
        #st.markdown()

        # Statistics of data coverage for year 2025
        st.subheader("Statistics")
        counts = (coverage["status"].value_counts().reindex(["Sentiment Data", "Non-Sentiment Data", "No Data"]).fillna(0).astype(int))

        # Define four columns to display each group type's total count
        col1, col2, col3, col4 = st.columns([1, 1, 1, 1])
        col1.metric("Sentiment Data", f"{counts.get('Sentiment Data', 0)} day(s)")
        col2.metric("Non-Sentiment Data", f"{counts.get('Non-Sentiment Data', 0)} day(s)")
        col3.metric("No Data", f"{counts.get('No Data', 0)} day(s)")
        with col4:
            # Display total posts of "merged_crypto_dataset.xlsx" (with asset filter if applied)
            total_posts = len(df)
            label = f"Total Posts ({selected_asset})" if 'selected_asset' in locals() and selected_asset != "All" else "Total Posts (All Assets)"
            st.metric(label, f"{total_posts}")

    column5, column6 = st.columns([10, 10]) # Adjust values to change column width/ratio

    with column5:
        # 'Framework Configuration' section
        st.subheader("Configuration")

        # Display the current configuration
        st.write("Current Configuration:")
        st.json(config)

        # Save the configuration of the framework when the button is clicked
        if st.button("Save Configuration"):
            save_config(config)
            st.success("Configuration saved successfully!")

    with column6:
        st.subheader("[To insert YouTube Demos Here]")

with tab2:
    st.write("Here you can visualise scraped and API data from Reddit and NewsAPI along with scores from Sentiment Analysis performed by various LLMs.")
    # Create tabs for configuration and scraped/API data visualisation
    merged_tab, reddit_tab, news_api_tab = st.tabs(["Merged", "Reddit", "NewsAPI"])

    with merged_tab:
        st.subheader("Merged Dataset (Reddit + NewsAPI + Sentiment)")
        # Load and display the merged dataset (Reddit + NewsAPI + Sentiment)
        if os.path.exists(MERGED_PATH):
            df = pd.read_excel(MERGED_PATH)
            st.dataframe(df)
        else:
            st.warning("No merged dataset found.")

    with reddit_tab:
        st.subheader("Reddit Dataset")
        # Load and display the Reddit dataset
        if os.path.exists(REDDIT_PATH):
            df = pd.read_excel(REDDIT_PATH)
            st.dataframe(df)
        else:
            st.warning("No Reddit dataset found.")

    with news_api_tab:
        st.subheader("NewsAPI Dataset (1st July 2025 onwards)")
        # Load and display the NewsAPI dataset
        if os.path.exists(NEWS_API_PATH):
            df = pd.read_excel(NEWS_API_PATH)
            st.dataframe(df)
        else:
            st.warning("No NewsAPI dataset found.")

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
