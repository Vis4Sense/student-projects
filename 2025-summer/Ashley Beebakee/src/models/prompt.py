#------------------------------------------------------------#
# Name: LLM Prompt Templates Module
# Description: This script defines prompt templates for
#              sentiment analysis tasks using LLMs (Zero-shot,
#              Few-shot and Chain-of-Thought).
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 14/07/2025
# Python Version: 3.10.6
# Packages Required: N/A
#------------------------------------------------------------#

# Define prompt templates for sentiment analysis tasks using Llama 3.1 8B 4-bit and 2-bit models, and Bloomz 7B 4-bit model.
ZERO_SHOT_LLAMA = """
<|begin_of_text|>
    <|start_header_id|>system<|end_header_id|>
        You are a social media analyst. Provide insightful analysis of posts.
<|eot_id|>
    <|start_header_id|>user<|end_header_id|>
        Analyse this Reddit post: {post}
<|eot_id|>
    <|start_header_id|>assistant<|end_header_id|>
"""

FEW_SHOT_LLAMA = """
<|begin_of_text|>
    <|start_header_id|>system<|end_header_id|>
        You are a social media analyst. Provide insightful analysis of posts.
<|eot_id|>
    <|start_header_id|>user<|end_header_id|>
        Analyse this Reddit post: Bitcoin is crashing and investors are worried!
<|eot_id|>
    <|start_header_id|>assistant<|end_header_id|>
        The sentiment is negative. The post expresses concern and fear among investors due to Bitcoin's price drop.
<|eot_id|>
    <|start_header_id|>user<|end_header_id|>
        Analyse this Reddit post: Dogecoin is trending again and the community is excited!
<|eot_id|>
    <|start_header_id|>assistant<|end_header_id|>
        The sentiment is positive. The post shows excitement and enthusiasm in the Dogecoin community.
<|eot_id|>
    <|start_header_id|>user<|end_header_id|>
        Analyse this Reddit post: {post}
<|eot_id|>
    <|start_header_id|>assistant<|end_header_id|>
"""

CHAIN_OF_THOUGHT_LLAMA = """
<|begin_of_text|>
    <|start_header_id|>system<|end_header_id|>
        You are a social media analyst. Think step by step and provide insightful analysis of posts.
<|eot_id|>
    <|start_header_id|>user<|end_header_id|>
        Analyse this Reddit post: {post}
<|eot_id|>
    <|start_header_id|>assistant<|end_header_id|>
        Let's break down the post step by step:
"""

ZERO_SHOT_BLOOMZ = """
You are a social media analyst. Analyse the following Reddit post and provide:
1. A sentiment score between -1 (very negative) and 1 (very positive).
2. A brief explanation for your score.

Reddit post: {post}
Sentiment score:
"""

FEW_SHOT_BLOOMZ = """
You are a social media analyst. Analyse each Reddit post and provide:
1. A sentiment score between -1 (very negative) and 1 (very positive).
2. A brief explanation for your score.

Reddit post: Bitcoin is crashing and investors are worried!
Sentiment score: -0.8
Explanation: The post expresses concern and fear due to Bitcoin's price drop.

Reddit post: Dogecoin is trending again and the community is excited!
Sentiment score: 0.9
Explanation: The post shows excitement and enthusiasm in the Dogecoin community.

Reddit post: {post}
Sentiment score:
"""

CHAIN_OF_THOUGHT_BLOOMZ = """
You are a social media analyst. Think step by step to analyse the following Reddit post. Provide:
1. Your reasoning process.
2. A sentiment score between -1 (very negative) and 1 (very positive).
3. A brief explanation.

Reddit post: {post}
Let's break down the post step by step:
"""