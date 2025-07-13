#------------------------------------------------------------#
# Name: Streamlit Dashboard for Modular DL Framework
# Description: This script creates a Streamlit dashboard for 
#              configuring and experimenting with a modular 
#              deep learning framework with the inclusion of
#              multilingual sentiment analysis and LLM options
#              to predict cryptocurrency prices.
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 07/07/2025
# Python Version: 3.10.6
# Packages Required: streamlit, pyyaml
#------------------------------------------------------------#

# Import required libraries
import streamlit as st
import yaml
import os

# Assign model config to constant variable
CONFIG_PATH = "config/framework_config.yaml"

# Define default config as backup
DEFAULT_CONFIG = {
    "llm": "LLaMA 3",
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

# Streamlit dashboard title
st.title("Streamlit Modular DL Framework Prototype v1.0")

# Load model_config.yaml if it exists, otherwise use default config
if os.path.exists(CONFIG_PATH):
    config = load_config()

# 'Sentiment Analysis' section
st.subheader("Sentiment Analysis")

# Variety of crypto news sources
config['sentiment'] = st.selectbox("Select Crypto News Source:", ["Reddit", "Twitter", "NewsAPI"], index=["Reddit", "Twitter", "NewsAPI"].index(config['sentiment']))
# Open-source and Closed-source LLM Options
llm_type = st.radio("Toggle Preferred LLM Type", ["Open-source", "Closed-source"], horizontal=True)
# Options based on LLM source type
open_source_llms = ["LLaMA 3", "Mixtral", "BLOOMZ"]
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

# LLM and prompt engineering options
config['llm'] = st.selectbox("Select LLM Model:", llm_options, index=llm_index)
config['prompt'] = st.selectbox("Select Prompt Engineering Technique:", ["Zero-shot", "Few-shot", "Chain-of-Thought (CoT)"], index=["Zero-shot", "Few-shot", "Chain-of-Thought (CoT)"].index(config['prompt']))

# To be implemented between 7th July 2025 and 14th July 2025
# config['architecture'] = st.selectbox("Select Deep Learning Architecture", ["CNN-LSTM-AE", "Transformer-LSTM", "GRU-AE"], index=["CNN-LSTM-AE", "Transformer-LSTM", "GRU-AE"].index(config['architecture']))

# Save and trigger (for debugging)
if st.button("Save Configuration"):
    save_config(config)
    st.success("Configuration saved!")

# Display current config (for debugging)
#st.subheader("Current Configuration")
#st.json(config)

# Run this in the Powershell terminal to save the file path as a variable
# $sl_path = "k:/student-projects/2025-summer/Ashley Beebakee/src/framework.py"
# Then run Streamlit with the saved path as below.
# streamlit run $sl_path