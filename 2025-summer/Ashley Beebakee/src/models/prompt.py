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

# Define prompt templates for sentiment analysis tasks using the Llama 3.1 8B 4-bit and 2-bit models
ZERO_SHOT_LLAMA = """
<|begin_of_text|>
    <|start_header_id|>system<|end_header_id|>
        You are a social media analyst. For each post, provide:
        1. A sentiment score between -1 (very negative) and 1 (very positive)
        2. A brief explanation for your score
<|eot_id|>
    <|start_header_id|>user<|end_header_id|>
        Analyse this Reddit post: {post}
<|eot_id|>
    <|start_header_id|>assistant<|end_header_id|>
        Let me analyse the sentiment:
"""

FEW_SHOT_LLAMA = """
<|begin_of_text|>
    <|start_header_id|>system<|end_header_id|>
        You are a social media analyst. For each post, provide a sentiment score and explanation.
<|eot_id|>
    <|start_header_id|>user<|end_header_id|>
        Analyse this Reddit post: Bitcoin is crashing and investors are worried!
<|eot_id|>
    <|start_header_id|>assistant<|end_header_id|>
        Sentiment score: -0.8
        Explanation: The post expresses concern and fear among investors due to Bitcoin's price drop.
<|eot_id|>
    <|start_header_id|>user<|end_header_id|>
        Analyse this Reddit post: Dogecoin is trending again and the community is excited!
<|eot_id|>
    <|start_header_id|>assistant<|end_header_id|>
        Sentiment score: 0.9
        Explanation: The post shows excitement and enthusiasm in the Dogecoin community.
<|eot_id|>
    <|start_header_id|>user<|end_header_id|>
        Analyse this Reddit post: {post}
<|eot_id|>
    <|start_header_id|>assistant<|end_header_id|>
        Let me analyse the sentiment:
"""

CHAIN_OF_THOUGHT_LLAMA = """
<|begin_of_text|>
    <|start_header_id|>system<|end_header_id|>
        You are a social media analyst. Think step by step to analyse posts and provide:
        1. Your reasoning process
        2. A sentiment score between -1 (very negative) and 1 (very positive)
        3. A brief explanation
<|eot_id|>
    <|start_header_id|>user<|end_header_id|>
        Analyse this Reddit post: {post}
<|eot_id|>
    <|start_header_id|>assistant<|end_header_id|>
        Let me break down the analysis step by step:
"""

# Define prompt templates for sentiment analysis tasks using the Bloomz 7B 4-bit model.
ZERO_SHOT_BLOOMZ = """
You are a social media analyst. For the following Reddit post, you must provide:
1. A numerical sentiment score exactly between -1.0 and 1.0 where:
   * -1.0 = extremely negative
   * -0.5 = moderately negative
   * 0.0 = neutral
   * 0.5 = moderately positive
   * 1.0 = extremely positive
2. A brief explanation supporting your numerical score.

Format your response as:
Score: [number]
Explanation: [text]

Reddit post: {post}
Score:
"""

FEW_SHOT_BLOOMZ = """
You are a social media analyst. For each Reddit post, provide a numerical sentiment score and explanation.
Scores must be between -1.0 and 1.0 where -1.0 is extremely negative, 0.0 is neutral, and 1.0 is extremely positive.

Example analyses:

Reddit post: Bitcoin is crashing and investors are worried!
Score: -0.8
Explanation: The post expresses significant fear and concern, indicating strong negative sentiment about Bitcoin's price action.

Reddit post: Dogecoin is trending again and the community is excited!
Score: 0.9
Explanation: The post conveys high enthusiasm and positive energy around Dogecoin's renewed popularity.

Reddit post: {post}
Score:
"""

CHAIN_OF_THOUGHT_BLOOMZ = """
You are a social media analyst. Analyze the following Reddit post step by step:
1. First, identify the key sentiment indicators in the text
2. Then, evaluate their intensity and direction
3. Finally, assign a numerical score between -1.0 and 1.0 where:
   * -1.0 = extremely negative
   * -0.5 = moderately negative
   * 0.0 = neutral
   * 0.5 = moderately positive
   * 1.0 = extremely positive

Format your response:
Analysis steps:
1. [step 1]
2. [step 2]
3. [step 3]

Final Score: [number between -1.0 and 1.0]
Explanation: [brief justification]

Reddit post: {post}
Analysis steps:
"""

# Define prompt templates for sentiment analysis tasks using the Orca 2 7B 6-bit model.
ZERO_SHOT_ORCA = """
You are a financial sentiment analysis expert. For each Reddit post, provide:
1. A sentiment score between -1 (very negative) and 1 (very positive)
2. A brief explanation for your score

Reddit post: {post}
Sentiment score:
"""

FEW_SHOT_ORCA = """
You are a financial sentiment analysis expert. For each Reddit post, provide a sentiment score and a short explanation.

Example 1:
Reddit post: Bitcoin is crashing and investors are worried!
Sentiment score: -0.8
Explanation: The post expresses strong concern and fear about Bitcoin's price drop.

Example 2:
Reddit post: Dogecoin is trending again and the community is excited!
Sentiment score: 0.9
Explanation: The post shows excitement and optimism in the Dogecoin community.

Reddit post: {post}
Sentiment score:
"""

CHAIN_OF_THOUGHT_ORCA = """
You are a financial sentiment analysis expert. Think step by step to analyze the following Reddit post:
1. Identify the main sentiment indicators in the text
2. Assess their intensity and direction
3. Assign a sentiment score between -1 (very negative) and 1 (very positive)
4. Provide a brief explanation

Reddit post: {post}
Analysis steps:
"""

CLASSIFICATION_ORCA = """
Is the following text related to cryptocurrency? Answer "yes" or "no".
Text: {post}
"""