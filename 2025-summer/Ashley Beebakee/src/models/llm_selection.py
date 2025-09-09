#------------------------------------------------------------#
# Name: LLM Selection Module
# Description: This script lists and allows selection of
#              various LLMs (open-source and closed-source) 
#              for use in the modular deep learning framework 
#              created with Streamlit.
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 01/09/2025
# Python Version: 3.10.6
# Packages Required: llama-cpp-python, openai
# Packages Installation: llama-cpp-python --force-reinstall 
#                        --no-cache-dir (GPU acceleration)               
# Hugging Face Token: Thesis.Token
#------------------------------------------------------------#

# Import necessary libraries
from llama_cpp import Llama
from openai import OpenAI

# Function to load API keys from 'keys' folder
def load_api_key(filepath):
    with open(filepath, "r") as f:
        return f.read().strip()

# Function to set up LLM with optimised settings for AMD GPU
def llm_optimisation(model_path):
    """LLM settings optimised for AMD RX 6600 XT GPU with 8GB VRAM."""
    
    llm = Llama(
        model_path=model_path,
        # GPU settings (0 for CPU, -1 for GPU)
        n_gpu_layers=-1,  # Use partial GPU offloading (balances speed and VRAM usage)
        
        # Memory settings
        n_ctx=4096,       # Context window size (how much the model can see at once)
        n_batch=1024,      # Smaller batch for stability (controls how many tokens are processed)
        
        # CPU settings
        n_threads=12,     # Use multiple CPU threads
        
        # Performance settings
        use_mmap=True,    # Memory-mapped files
        use_mlock=False,  # Don't lock memory (Windows)
        
        # Sampling settings
        seed=-1,          # Random seed
        
        verbose=True      # See performance stats
    )
    
    return llm

# Script for text generation using a variety of LLMs with sentiment analysis prompts
def analyse_sentiment_os(prompt, model_path):
    #model_path = "./models/Llama-3.1-8B-Instruct-bf16-q4_k.gguf" 4-bit model
    #model_path = "./models/Llama-3.1-8B-Instruct-iq2_xxs.gguf"   2-bit model
    #model_path = "./models/orca-2-7b.Q6_K.gguf"                  6-bit model
    #model_path = "./models/bloomz-7b1-mt-Q4_K_M.gguf"            4-bit model
     
    # Optimised Llama 3.1 settings for AMD GPU
    llm = llm_optimisation(model_path)
    
    # Generate response using the LLM and corresponding prompt template
    response = llm(                                                      
        prompt,
        max_tokens=300,
        temperature=0.7,
        top_p=0.9,
        repeat_penalty=1.15,
        stop=["<|eot_id|>", "<|end_of_text|>", "\n\nUser:", "\n\nHuman:"],
        echo=False
    )
    
    return response['choices'][0]['text']

def analyse_sentiment_cs(post_text):
    # OpenAI valid API key
    api_key = load_api_key("keys/openai_key.txt")
    client = OpenAI(api_key=api_key)

    # Generate response from selected LLM model
    response = client.responses.create(
        model="gpt-5",
        input=f"Extract the sentiment as a score between -1 and 1 for the following post: {post_text}"
    )

    return response.output_text

# Run sentiment analysis using the selected LLM
if __name__ == "__main__":
    print("--- Analysis Start ---")
    result = analyse_sentiment_os()
    print("\n--- Analysis Results ---")
    print(result)
    print("--- Analysis End ---")