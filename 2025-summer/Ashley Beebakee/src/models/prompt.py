#------------------------------------------------------------#
# Name: LLM Prompt Templates Module
# Description: This script defines prompt templates for
#              sentiment analysis tasks using LLMs (Zero-shot,
#              Few-shot and Chain-of-Thought).
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 13/07/2025
# Python Version: 3.10.6
# Packages Required: ...
#------------------------------------------------------------#

# Define prompt templates for sentiment analysis tasks using LLMs (i.e. LLama 3.1)
ZERO_SHOT_PROMPT = """
<|begin_of_text|>
    <|start_header_id|>system<|end_header_id|>
        You are a social media analyst. Provide insightful analysis of posts.
<|eot_id|>
    <|start_header_id|>user<|end_header_id|>
        Analyse this Reddit post: {post}
<|eot_id|>
    <|start_header_id|>assistant<|end_header_id|>
"""

FEW_SHOT_PROMPT = """
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

CHAIN_OF_THOUGHT_PROMPT = """
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
