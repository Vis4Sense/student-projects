# 22 Jan 2024

Raul

Muhamad Hermawan
1. Progress:
   - Done testing 5 different prompts on each dataset (Financiall Phrasebank, SemEval2017, SentFin-v1.1, Emotion Stimuli)
   - Done testing orca 2 7 and 13 bilion parameters in all quantisation variants + 7b unquantised
   - First smester report draft progres: Already drafting the Methodology, Experiment Setup, and Findings, Providing Graphical from the testing result
2.Question and difficulty
   - About citing the quantised model tested if the model does not giving citing sugestion on its page or the model does not have paper
3. Next Step
   - Finalise all testing, Finishing First semester reporting
   - Preparing data for next nearest goal of the project (implementing LLMs' sentiment analysis on trading framework)


# 15 Jan 2024
Raul Farkas
1. Completed implementation of the Data Provider (component that gets live and historical data from Alpaca), completed implementation of Data Storage (component that saves all the data that arrives from any source). Development in progress for the Sentiment Analyzer component (that performs sentiment analysis using LLM on news). Development of the Python API not started yet.

3. The development of storage component took significant time, which stretched the timeline for the platform development. 
   
5. Continue development of the trading platform and start development of the Python API.

Muhamad Hermawan
1. progress
   Done testing sentiment analysis on 42 Quantized 4 bit model (7b, 10.7b, 11b, 13b, and 20b model parameters). Test conducted in 4 different dataset, financial phrasebank (sentiment classification), SemEval2017 (sentiment strength), SentFin1.1 (identifying entity and its sentiment), and Emotion Stimuli (7 emotion extraction). Done testing Orca 2 in all variance (6 variance - 13b 4bit and 8bit)  and (7 variance - 7b 4bit and 8bit + 7b unquantized version) on Financial phrasebank dataset.
3. question and difficulty
   - reporting layout for all 42 model testing, and evaluation metrinc regarding adding another evaluation metric such as F1, recall, and precision
5. next step 
- testing Orca 2 all variance (6 variance - 13b 4bit and 8bit)  and (7 variance - 7b 4bit and 8bit + 7b unquantized version) on SemEval2017 datasets.
- prompt engineering comparation to see how big is the result difference if using different prompt (slight and total different prompt)
- First smester drafting

Xiruo Sun
1. progress ...
   - do some model experiments
3. question and difficulty ...
   - should I do the fine-tuning the model or I just use the model quantized by others and only change hyperparameter?
4. next step ...
   - writing everything down
   - create the charts for the results
   - ~~further hyperparameter tuning~~
   - try Azure openai chatgpt
   - ~~find a better evaluation method~~
   - use whole dataset with GPU
  
Kai
- [x] forward Xiruo the emails about PC to run LLM
- [x] ask about the Azure API

# 11 Dec 2023

This will be the last meeting for 2023, meeting in 2024 resumes on Monday, 15 January.

LLM remember previous promopt: https://docs.gpt4all.io/gpt4all_python.html#gpt4all.gpt4all.GPT4All.__init__

Compare the sentiment performance of chatGPT against the gpt4all/huggingface models once Azure OpenAI service is available.

Tianxiang
- which market and start collect data: ideal to get FTSE and DAX (or other EU market) data
- choose model for sentiment analysis
- baseline trading strategies

Muhamad
- using the models from HuggingFace
- https://github.com/Vis4Sense/student-projects/tree/main/2023-2024/muhamad-hermawan/LLMs%20Benchmark
- LLM group size?
- 7B and 13B models, 4 bit
- Best accuracy: orca, slim-orca
- 0-shot and 3-shot have better performance than 1-shot and 5 shot (shot example chosen randomly)

Xiruo
- updated the prompt, include 2 shot and 5 shot, 

## Todo

Muhamad
- test non-quantised 7B model on 16GB VRAM, orca,
  - test if the model remembers previous example for 2-shot or 5-shot
- write up the test setup and results (can be used for first-semester report later)
  - come up with sentiment analysis LLM recommendations

Xiruo
- if there is any difference betweent the (quantised) models from gpt4all and huggingface
  - if the base model is the same
  - if there is any performance impact changing from using GPU memory to main memory
- write up the test setup and results (can be used for first-semester report later)
  - come up with sentiment analysis LLM recommendations  

Raul
- finish the trading platform.
  - include the option to select which LLM for sentiment analysis

# 4 Dec 2023
- Kai:
  - school GPU server information in the general channel.
  - university azure openAI possibly set up this week.
  - School can set up a MySQL server
- Muhamad
  - Refinitiv issue: https://github.com/Vis4Sense/student-projects/issues/64
  - Aspect Sentiment: Orca has the best performance
  - Run LLM on GPU vs CPU
    - MRL lab machine has 16GB vram
    - CUDA much faster than Vulkan and seems to support all LLMs
    - Rocket-3B: 21s (GPU) vs 28min (CPU)
    - For 7B LLM ran out of VRAM
- Xiruo
  - semEval 2017: sentiment score, 1142 samples, has more symbols per headline
  - 0-shot and 2-shot (perform better)
  - finBert sentiment classification is about 50%, not very good.
  - Mistral-7b has the best classification performance
  - Orca does not perform as well as in Muhamad's test because that was aspect sentiment and this is sentiment classification.
  - currently not including the symbol in the input
- Rual
  - 200-300MB (1.4m records, stock back to 2016, crypto back to 2021) price data per minute
  - check if news has more than one symbol first and then decide whether to use aspect sentiment
  - almost finished data provider implementation
  - everyone holds a local copy of the database
  - docker composer
  - implement as a python library (instead of API).
 
## Todo
- Muhamad
  - try quantised LLMs with CUDA
  - try CUDA LLM on the School GPU server
- Xiruo
  - Send Tianxiang FinBert performance results (and test details)
  - try 2-shot and 5-shot
  - calcuate mean absolute error
  - include the asset/symbol in the input as a separate test
  - find out how to use the school GPU server
- Raul
  - Interim report
- Kai
  - check to see if there is any PC with more VRAM with Kelvin and Cobot Maker Space
  - follow up with the School database server
  - follow up with the Azure OpenAI service
 
# 27 Nov 2023

Muhamad
- financial phrasebank (huggingface):
  - 1000 samples
  - positive/negative/neutral distribution
  - only 4-bit quantisation
- Alpaca: subscribe news based on the asset

Xiruo
- semEval 2017 financial news
- finBert

Raul
- virtual machine cost
- data subscription service
  
## Todo
- Muhamad
  - create a issue on refinitive trading and export news: summarise the information and status
  - try to see if there is Aspect-Based financial Sentiment Analysis benchmark
    - if not, use the review benchmark from the paper
    - could make our own labels, but will be time consuming 
  - Run Aspect-Based Sentiment Analysis (ABSA) in lab:
    - follow the example in the paper,
    - include a few examples in the prompt (few shots insteadof zero shots)
- Xiruo
  - read the sentiment analysis paper posted in Teams chat.
  - test sentiment strength using semEval 2017 dataset: on the models that performed well so far
  - test the performance of the FinBert (sentiment classification and strength)
- Raul
  - continue platform implementation
  - design the format to store the (historical) data: price, news, etc.
- Kai
  - contact Kevin and Dominic about using the computers in MRL and cobot maker space
  - ask school to see if we can host database on school server
 
# 20 Nov 2023

Muhamad
- needs a separate app fxtrade
- yahoo unofficial API only
- no sentiment benchmark

Xiruo
- test Alpaca paper trading with chatGPT sentiment analysis
- easy to use
- haven't tried back testing: more difficult than real time trading; difficulty getting the code to work
- Alpaca: news 7 years back
  - missing news content
- Yahoo: RapidAPI (not free) - price and news, two other free API but only price
- Reuter: 30 years Apple price
- gpt4all: tried first 3 models

Tianxiang
- sentiment analysis: accurate OK is fine (70%-80%), but speed is more important: has to be fast
- will share a sentiment benchmark: https://github.com/ProsusAI/finBERT
- test small models: quantised
- for paper: human label needed to create a benchmark unless we can find a benchmark

Raul
- back testing
  - alpaca data: max 30 assets all mixed
  - plotly for the chart
- system architecture
  - for both real-time and back testing
  - database: clickhouse
  - 2-3 weeks to build the system
  - 
* Created [design plans](raul-farkas/project-design/data_acquisition_component_design.md) and diagram for data acquisition component
  * Started implementation, already have a clear idea about tech stack
* Investigated possible options for storing data locally
  * Decided to use ClickHouse (Described in design document)
    * For its columnar storage approach which is way faster for when getting data indexed based on time
  
## Todo
Muhamad: 
- [ ] create a markdown file about Refinitive trading in the repository and add a link here in the notes
- [ ] ask if it is possible to expoert news from the refinitive software

Muhamad and Xiruo
- [ ] start a overleaf (latex) report, using online tools to convert table into latex, on the sentiment comparison results
- [ ] read the '[Sentiment Analysis in the Era of Large Language Models: A Reality Check](https://arxiv.org/abs/2305.15005)' paper posted in the Teams chat
- [ ] find a sentiment benchmark, such as
  - [ ] [finBERT](https://github.com/ProsusAI/finBERT)
  - [ ] [SemEval: International Workshop on Semantic Evaluation](https://semeval.github.io/)

Raul:
- [x] the cost of hosting the system and database online: create a github issue to compare the options ([link](./raul-farkas/resources/hosting_cost_and_vps_providers.md))
- [ ] implment the data collection system
  * Made progress, getting close to finishing DataProvider
    * Most complex component, but the structure adopted here will be very similar in other components (lots of shared code)
   
# 13 Nov 2023

Muhamad
- wait for James' response to lab access
- Refinitiv: free university access
  - valid for 1 month or 1 semester
  - news back 20 years
  - Eikon data api: news 15 months back, price 20+ years, tried with Jupyter/python
  - Has it own cloud hosted notebook (similar to google colab)
- Yahoo finance data: all the back prices data, similar to Reutur
  - real-time trading 50 minutes
- sentiment analysis: notebook,
  - gpt4all.io, equilavent of which chatgpt version?
  - can run the llm locally
  Xiruo
- used alpaca to collect news
- use chatgpt API (paid herself) for sensation analysis
- only the news title, may need to include news text
- paper trading using Alpaca

Raul

* Got llama2 and mistral LLMs to work on local machine with Ollama.ai
  * It produces answers quickly, especially Mistral
  * Exposes a web api endpoint
* Created a very simple trading [pipeline](https://github.com/Vis4Sense/student-projects/tree/main/2023-2024/raul-farkas/code-samples/simple-strategy)
  * It does not perform actual trading but it does generate buy/sell signals based on a given strategy
  * Implementation in python
  * For sentiment analysis I used ChatGPT API (with credit I added myself)

## Todo
Trading simulation
- [ ] Muhamad: whether Refinitiv can support paper or real trading: both real-time and back testing
- [ ] Xiruo: alpaca paper trading - both real-time and back testing 
- [ ] trading simulation: Muhamad and Xiruo - compare refinitiv and alpaca
Data
- [ ] Muhamad: compare Reuter and Yahoo data: how detailed the data is, what data is available,
- [ ] Muhamad and Xiruo: compare the data from alpaca/Reuter/yahoo
  - [ ] what data is available
  - [ ] the resolution of the data, i.e., how detailed
  - [ ] how far back the data goes
  - [ ] ...
  LLM
- [ ] compare the sentiment performance of models from https://gpt4all.io/
  - [ ] Muhamad: find out which model you used
  - [ ] Muhamad: find out whihc benchmark includes sentiment analysis: https://gpt4all.io/
  - [ ] Xiruo: find out existing sentiment analysis performance of different chatGPT versions, ideally the same sentiment benchmark
  - [ ] Xiruo/Rauls: investigtate sentiment performance of the quantized LLM such as Llama2
    - [ ] https://huggingface.co/TheBloke/llama-2-13B-Guanaco-QLoRA-GGUF ([QLoRA: Efficient Finetuning of Quantized LLMs](https://arxiv.org/abs/2305.14314))
    - [ ] https://huggingface.co/TheBloke/Llama-2-7B-GPTQ
    - [ ] https://towardsai.net/p/machine-learning/gptq-quantization-on-a-llama-2-7b-fine-tuned-model-with-huggingface
  - Sentiment analysis benchmark
    - [SemEval-2017 Task 4: Sentiment Analysis in Twitter](https://aclanthology.org/S17-2088/)
    - [SemEval 2022 Task 10: Structured Sentiment Analysis](https://aclanthology.org/2022.semeval-1.180/)
- [ ] local database: news and mark information for training

# 6 Nov 2023

## Todo
- Muhamad: check if you can access the lab pc in business school that has access to Reuter's data, and find out how to download the historical data (details in the email)
  - Refinitiv
  - Online video for how to use it
  - find out what data is available, how far data is availalbe, download limit, can we download the data
- All: a simple end-to-end trading pipeline
  - get some (historical/realtime) data
  - do some analysis, such as sentiment with chatGPT API
  - do some trading, using the simplest strategy possible
  - Raul to lead, and discuss with Muhamad and Xiruo
  - https://www.investopedia.com/simulator/
  - tradingview simulator (does it support python now?)
  - GitHub: [simulator](https://github.com/topics/trading-simulator?l=python), [backtesting](https://github.com/topics/backtesting?o=desc&s=stars)
  - https://superalgos.org/
  - https://wilsonfreitas.github.io/awesome-quant/
  - platform API
- All: learn about the [OpenAI RL gym](https://openai.com/research/openai-gym-beta)
  - download and run it?
 
# 30 Oct 2023
- Raul: Accessing LLM ([details](https://github.com/Vis4Sense/student-projects/blob/main/2023-2024/raul-farkas/resources/llm_cost_research.md))
  - access hosted LLM through API 
  - self hosting LLM on a cloud service: too expensive and too much work
  - hybrid: host the model on a website but only pay for the running time
- Raul: Alpaca
  - price data for crypto and stock
  - new for stock (and crypo?), maximum back to 2 weeks?
    - RF: Historical news up to 2015 for both stocks and crypto
- Project: Raul
  - start with stock;
  - should be easy to change to crypto
  - portofolio selection and management (second stage)
- Project: Muhamad
  - apply to crypo instead of stock?
  - include more information besides sentiment, and compare the different options

## Todo
- [x] Kai to confirm with Xiruo if the 10am Monday meeting time is fine.
- [x] Kai to follow up about business school data access
- [x] Kai to find out if School project fund can be used to cover LLM cost
- Raul to investigate if it is possible to use hybrid services, such as replicate, to train the RL model for trading.
  - RF: It does not seem to be possible, other solutions were briefly investigated ([notes](raul-farkas/resources/ml_training_platforms.md))
- All: Read the two papers about trading using machine learning added to the [project page](https://kaixu.me/2023/09/15/llm-for-automated-trading/)
- All: go through the tutorial on [literature review](https://github.com/Vis4Sense/student-projects/blob/main/instructions/literature.md) and: 
  - find at least one paper from a **top** conference or journal, such as TVCG or CHI that is relevant to your project
  - By going through the papers published in 2023 
  - And add it to your zotero database
- All: Finalise your project idea
- All: check if you can access the lab pc in business school that has access to Reuter's data, and find out how to download the historical data (details in the email)

# 23 October 2023
Xiruo 
- need to learn more about language models.
- Project idea: compare different LLMs

Raul
- has FinGPT running: very slow on macbook
- project idea: explore different trading strategies

Muhamad
- project idea: compare LLMs for sentiment analysis

Tianxiang
- find a target market
- collect data
- convert sentiment analysis to trading signals instead of predicting price
- more likely to have data available for crypto data (news/data api)
  - huobi
  - binance

## To Do
- Kai - find tutorials on LLM
- Kai - try to find out if UoN business school has access to Reuter data/news feed
- Raul
  - investigate the options to run FinGPT or Llama2 in cloud and how much it costs
  - investigage the cost of access LLM APIs such as chatGPT: [some of the more prominent LLMs](https://hai.stanford.edu/news/introducing-foundation-model-transparency-index)
- Have a look of the two papers about trading using machine learning added to the [project page](https://kaixu.me/2023/09/15/llm-for-automated-trading/)
- find a target market and what data is (freely) available: 
- Start writing or revise your project proposal
- ethics forms/approval: prelimimary ethics form and data management plan
