#------------------------------------------------------------#
# Name: Streamlit Dashboard for Modular DL Framework
# Description: This script creates a Streamlit dashboard for 
#              configuring and experimenting with a modular 
#              deep learning framework with the inclusion of
#              multilingual sentiment analysis and LLM options
#              to predict cryptocurrency prices.
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 13/07/2025
# Python Version: 3.10.6
# Packages Required: streamlit, pyyaml, time, os
#------------------------------------------------------------#

# Import required libraries
import streamlit as st
import yaml
import time
import os

# Import required modules
from sentiment.scraping import scrape_reddit_posts
from models.prompt import ZERO_SHOT_LLAMA, FEW_SHOT_LLAMA, CHAIN_OF_THOUGHT_LLAMA
from models.prompt import ZERO_SHOT_BLOOMZ, FEW_SHOT_BLOOMZ, CHAIN_OF_THOUGHT_BLOOMZ
from models.llm_selection import analyse_sentiment

# Assign model config to constant variable
CONFIG_PATH = "config/framework_config.yaml"

# Define default config as backup
DEFAULT_CONFIG = {
    "llm": "LLaMA 3.1 8B (4-bit)",
    "prompt": "Zero-shot",
    "sentiment": "Reddit"
}

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

# Streamlit dashboard title
st.title("Streamlit Modular DL Framework Prototype v4.0")

column1, column2 = st.columns([8, 10]) # Adjust values to change column width

# N.B: The prefix "r_" denotes the word "run", as in where the run button is placed.
with column1:
    # Load model_config.yaml if it exists, otherwise use default config
    if os.path.exists(CONFIG_PATH):
        config = load_config()

    # 'Sentiment Analysis' section
    st.subheader("Sentiment Analysis")

    news_col, r_news_col = st.columns([7, 1]) # Must sum up to column1's width of 8
    with news_col:
        # Variety of crypto news sources
        config['sentiment'] = st.selectbox("Select Crypto News Source:", ["Reddit", "Twitter", "NewsAPI"], index=["Reddit", "Twitter", "NewsAPI"].index(config['sentiment']))
        # Add slider for number of posts to be scraped
        num_posts = st.slider("Number of Posts to Scrape:", min_value=1, max_value=100, value=1, help="Select how many posts to scrape (1-100)")
    
    with r_news_col:
        st.markdown("<div style='height: 1.75em;'></div>", unsafe_allow_html=True) # Empty space for alignment
        run_news = st.button("▶", key="run_news")

    # Open-source and Closed-source LLM Options
    llm_type = st.radio("Toggle Preferred LLM Type", ["Open-source", "Closed-source"], horizontal=True)
    # Options based on LLM source type
    open_source_llms = ["LLaMA 3.1 8B (4-bit)", "LLaMA 3.1 8B (2-bit)", "BLOOMZ 7B (4-bit)"]
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

    llm_col, r_llm_col = st.columns([7, 1]) # Must sum up to column1's width of 8
    with llm_col:
        # LLM and prompt engineering options
        config['llm'] = st.selectbox("Select LLM Model:", llm_options, index=llm_index)
        config['prompt'] = st.selectbox("Select Prompt Engineering Technique:", ["Zero-shot", "Few-shot", "Chain-of-Thought (CoT)"], index=["Zero-shot", "Few-shot", "Chain-of-Thought (CoT)"].index(config['prompt']))

    with r_llm_col:
        st.markdown("<div style='height: 4.5em;'></div>", unsafe_allow_html=True) # Empty space for alignment
        run_llm = st.button("▶", key="run_llm")

    # To be implemented between 7th July 2025 and 14th July 2025
    # config['architecture'] = st.selectbox("Select Deep Learning Architecture", ["CNN-LSTM-AE", "Transformer-LSTM", "GRU-AE"], index=["CNN-LSTM-AE", "Transformer-LSTM", "GRU-AE"].index(config['architecture']))

    # Save and trigger (for debugging)
    #if st.button("Save Configuration"):
        #save_config(config)
        #st.success("Configuration saved!")

    # Display current config (for debugging)
    #st.subheader("Current Configuration")
    #st.json(config)

with column2:
    if run_news:
        # Run the sentiment analysis scraping function
        posts = scrape_reddit_posts(subreddit='CryptoCurrency', total_limit=num_posts)
        st.subheader("Reddit Posts")

        for i, post in enumerate(posts, 1):
            st.write(f"{i}. {post['title']}\n{post['url']}\n")

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
        
        # Parse Reddit's 1st scraped post for sentiment analysis
        posts = scrape_reddit_posts(subreddit='CryptoCurrency', total_limit=1)
        #post_text = posts[0]['title'] if posts else "No posts available."
        post_text = "Bitcoin just crossed $120,000, a huge milestone" # From 14th July 2025
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

# Run this in the Powershell terminal to save the file path as a variable
# $sl_path = "k:/student-projects/2025-summer/Ashley Beebakee/src/framework.py"
# Then run Streamlit with the saved path as below.
# streamlit run $sl_path