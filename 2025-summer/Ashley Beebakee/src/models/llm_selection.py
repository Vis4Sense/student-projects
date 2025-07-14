#------------------------------------------------------------#
# Name: LLM Selection Module
# Description: This script lists and allows selection of
#              various LLMs for use in the modular deep 
#              learning framework created with Streamlit.
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 13/07/2025
# Python Version: 3.10.6
# Packages Required: llama-cpp-python (CPU only)
#                    llama-cpp-python --force-reinstall 
#                    --no-cache-dir (GPU acceleration)
# Hugging Face Token: Thesis.Token
#------------------------------------------------------------#

# import necessary libraries
from llama_cpp import Llama

def llm_optimisation(model_path):
    """LLM settings optimised for AMD RX 6600 XT GPU with 8GB VRAM."""
    
    llm = Llama(
        model_path=model_path,
        # GPU settings (0 for CPU, -1 for GPU)
        n_gpu_layers=25,  # Use partial GPU offloading (balances speed and VRAM usage)
        
        # Memory settings
        n_ctx=2048,       # Context window size (how much the model can see at once)
        n_batch=256,      # Smaller batch for stability (controls how many tokens are processed)
        
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
def analyse_sentiment(prompt, model_path):
    #model_path = "./models/Llama-3.1-8B-Instruct-bf16-q4_k.gguf" 4-bit model
    #model_path = "./models/Llama-3.1-8B-Instruct-iq2_xxs.gguf"   2-bit model
    #model_path = "./models/bloomz-7b1-mt-Q4_K_M.gguf"
     
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

# Run sentiment analysis using the selected LLM
if __name__ == "__main__":
    print("--- Analysis Start ---")
    result = analyse_sentiment()
    print("\n--- Analysis Results ---")
    print(result)
    print("--- Analysis End ---")