## Overview
This is sentiment files coming from three different LLM Model (GPTQ) sourced from Huggingface. The model used to produced the sentiment score (strength) are:
1. Orca-2-13B-GPTQ-4b-32g (7 Billion parameters)
2. dolphin-2.6-mistral-7B-dpo-GPTQ-4b-32g (7 Billion parameters)
3. Kunoichi-7B-GPTQ-4b-32g (7 Billion parameters)

## Details of sentiment
- The news is sourced from Alpaca API
- To produce the sentiment, 6-shot scenario Chain of Thought prompting is used.
- the sentiment is for 8 assets which are ['TSLA', 'AAPL', 'MSFT', 'AMZN', 'NVDA', 'META', 'GOOG', 'AMD']
- the period of the news data for above assets is from 1 January 2023 to 28 February 2024
- Sentiment score produced is ranging from -1 (most negative) to 1 (most positive) where 0 is neutral
