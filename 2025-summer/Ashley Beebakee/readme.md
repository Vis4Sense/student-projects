# LLM for Automated Trading (est. 15th September 2023)
<ul>
<li>This project's idea revolves around the use of Large Language Models (LLMs) to achieve better return in automated trading through a blend of sentiment and technical analysis techniques.</li>
<li>More information on this project can be found at: https://kaixu.me/2023/09/15/llm-for-automated-trading/</li>
</ul>

## A User-Configurable Deep Learning Framework for Automated Cryptocurrency Market Prediction Using Multilingual LLM-Based Sentiment Fusion
<ul>
<li>This dissertation builds upon a recurring MSc project theme offered annually within the School of Computer Science, which focuses on financial prediction using AI and sentiment analysis.</li>
<li>While prior iterations explored various architectures and sentiment techniques, this project introduces a novel contribution through the development of a fully modular, user-configurable deep learning framework that integrates multilingual LLM-based sentiment fusion for cryptocurrency market forecasting.</li>
</ul>

## Streamlit Module DL Framework Prototype v0.8 (1.46.0)
### News Sources Data (Reddit & NewsAPI)
<ul>
  <li>Reddit</li>
  <ul>
    <li>Select 1 - 1000 posts to scrape for Reddit for the following subreddits: r/Cryptocurrency, r/Bitcoin, r/Ethereum, r/Dogecoin, r/CryptoMarkets (or All).</li>
    <li>Reddit bot protection may cause "Failed with status code: 429 Too Many Requests" (Auto-fixed by waiting some time).<br></li>
  </ul>
  <li>NewsAPI</li>
  <ul>
    <li>Select one of the following languages: English, German, Grench, Spanish, Italian (or All) to obtain a maximum of 100 posts from 1st July 2025 onwards (can be modified).</li>
  </ul>
</ul>

### (Manual) Sentiment Analysis
<ul>
  <li>Select open-source LLM: LLaMA 3.1 8B (4-bit), LLaMA 3.1 8B (2-bit), Orca 2 7B (6-bit), BLOOMZ 7B (4-bit) OR</li>
  <li>Select closed-source LLM: GPT-5, GPT-4o, Gemini 1.5 Pro, Claude 3 Opus.</li>
  <li>Select prompt engineering technique: Zero-shot, Few-shot, Chain-of-Thought (CoT) or Text Classification.</li>
  <li>Select post from merged Reddit & NewsAPI dataset to extract sentiment from.</li>
</ul>

### (Automatic) Sentiment Analysis
<ul>
  <li>To be implemented...</li>
</ul>

### Time Series Data (Yahoo Finance)
<ul>
  <li>Select cryptocurrency: Bitcoin, Ethereum or Dogecoin.</li>
  <li>Select start and end dates for historical data.</li>
  <li>Select time interval for historical data.</li>
</ul>

### Deep Learning Architecture
<ul>
  <li>Select architecture: LSTM, CNN or CNN-LSTM.</li>
  <li>Select time series dataset for sentiment fusion and model training.</li>
</ul>

### Terminology
<ul>
  <li>Prompt Templates</li>
  <ul>
    <li><b>Zero-shot</b>: ask LLM to rate sentiment without examples.</li>
    <li><b>Few-shot</b>: provide a few labelled examples to improve LLM accuracy.</li>
    <li><b>Chain-of-Thought(CoT)</b>: ask the model to explain its reasoning before giving a score, improving accuracy.</li>
  </ul>
  <li>Sentiment Fusion</li>
  <ul>
    <li><b>Early Fusion</b>: combine sentiment and price data before feeding into model.</li>
    <li><b>Late Fusion</b>: run separate branches for sentiment and price, merge at output.</li>
    <li><b>Attention-based Fusion</b>: learn which signal (price or sentiment) matters more at each step.</li>
  </ul>
  <li>LLaMA Optimisation</li>
  <ul>
    <li><b>n_gpu_layers</b>: number of transformer layers to offload to GPU, balances speed and VRAM usage.</li>
    <li><b>n_ctx</b>: context window size (how much the model can see at once).</li>
    <li><b>n_batch</b>: controls how many tokens to process per forward pass, smaller values = more stable, less VRAM needed.</li>
    <li><b>n_threads</b>: number of CPU threads to use if necessary.</li>
    <li><b>use_nmap/use_mlock</b>: memory-related flags.</li>
    <li><b>verbose</b>: prints detailed logs.</li>
  </ul>
  <li>LLM Response</li>
  <ul>
    <li><b>max_tokens</b>: maximum tokens to generate.</li>
    <li><b>temperature</b>: higher = more creative, lower = more deterministic.</li>
    <li><b>top_p</b>: controls nucleus sampling, how many probable tokens to consider.</li>
    <li><b>repeat_penalty</b>: penalises repetition.</li>
    <li><b>stop</b>: stop sequences to end generation cleanly, i.e. <|eot_id|>.</li>
  </ul>
  <li>Deep Learning Architecture</li>
  <ul>
    <li><b>sequence_length</b>: how many rows of past data to include in each input sequence for a model like LSTM/CNN-LSTM.</li>
    <li><b>target_column</b>: the column that you want to predict (dependent variable) of your dataset (.csv).</li>
    <li><b>scaler_type</b>: which normalisation/scaling method to apply to the dataset, minmax -> scales to [0, 1], standard -> scales to mean = 0 and std = 1.</li>
    <li><b>batch_size</b>: how many samples to include in one batch for training or testing (Controls: memory usage during training and frequency of model weight updates).</li>
  </ul>
  <li>PyTorch Objects</li>
  <ul>
    <li><b>train_loader</b>: used to feed the training set to your model, it is where the model learns patterns from the data, contains majority of the samples, often shuffled so the model doesn't memorise the order.</li>
    <li><b>val_loader</b>: uesd for validation during training, after each epoch the model is evaluated to see: generalisation performance, tuning hyperparameters and detecting overfitting (when the model memorises training data instead of learning patterns).</li>
    <li><b>test_loader</b>: used for the final evaluation after training is complete, this is never shown to the model during training or validation, gives you an unbiased estimate of how your model will perform on new, unseen data.</li>
  </ul>
</ul>

### Project Timeline
<img width="1659" height="1015" alt="project_timeline_status1" src="https://github.com/user-attachments/assets/ae471c94-60ef-4740-a391-fef4f3aa925e" />

### System Architecture (est. 24th July 2025)
<img width="1076" height="508" alt="system_architecture_v1" src="https://github.com/user-attachments/assets/7917df34-004d-4ee4-8694-f2b208fd9813" />

[Last updated: 11/08/2025 03:57]
