# Folder for all the 2023-2024 projects (UG and PGT) 
- Visual Analytics for Sensemaking:
  - Ziyue Wang (UG): support comparison of online shopping options with knowledge graph
  - Jiaqi Li (PGT): 
- Human-AI teaming
  - Rachana Hegde (PGT): image generative AI for writers
  - Jianwen Lyu (UG): ~~image generative AI for artists (Jupyter extension)~~ Browser extension for prompt recommendation for generative image model.
  - Peining: help artists record the images generated, personalised recommendations, website, 
- Chat with your data using LLM
  - Hongye An (PGT): Chat with your academic papers with LLM
- LLM for trading
  - Ralk Farkas (UG)
  - Muhamad Hermawan (PGT)
  - Xiruo Sun (PGT)

 |                   | Ziyue | Jiaqi | Rachana | Jiawen | Peining | Hongye |
 |-------------------|-------|-------|---------|--------|---------|--------|
 |interview questions|       |       |         |        |         |        |
 |recruit user       |       |       |         |        |         |        |
 |conduct interview  |       |       |         |        |         |        |
 |analyse data       |       |       |         |        |         |        |
 |requirement list   |       |       |         |        |         |        |
 |...                |       |       |         |        |         |        |

# 27 Nov 2023

Muhamad
- financial phrasebank (huggingface):
  - 1000 samples
  - positive/negative/neutral distribution
  - only 4-bit quantisation
- Alpaca: subscribe news based on the asset

  
## Todo
- Muhamad
  - create a issue on refinitive trading and export news: summarise the information and status
  - check if the asset is given in the sentiment dataset
  - try to see if there is Aspect-Based Sentiment Analysis benchmark
    - if not, use the review benchmark from the paper
    - could make our own labels, but will be time consuming 
  - Run Aspect-Based Sentiment Analysis (ABSA) in lab: follow the example in the paper, include a few examples in the prompt (few shots insteadof zero shots)
- Kai
  - contact Kevin and Dominic about using the computers in MRL and cobot maker space

# 24 Nov 2023 
- Ziyue: help user build a knowledge (sub)graph related to his/her research
- Rachana is leaving on 14 Dec and coming back 12 Jan
  - interviewed two users
  - transcribe the interview
  - come up a list of requirements
  - started website structure design (sitemap)
- Jiawen: change the project topic
- Hongye:
  - will further develop vatility
    - change the backend to document vector similarity search
    - update the frontend accordingly
  - will be away next Friday


## Todo
- All:
  - please update the table above based on your progress so far: a brief summary of the outcomes so far and link to the document/code in the repository folder.
  - continue the tasks in the table that are not completed yet
  - add all the tasks that you plan to work on before the next meeting to this list (if they are not here yet)
- Ziyue: 
  - pick a specific use case if buying camera is not relevant to the user
  - learn more about how to let user update knowledge graph and how to use knowledge graph
- Rachana
  - pick a few requirements to focus on for the project
  - think about possible solutions to meet these requirements
  - start the sketch out solution ideas
- Hongye: compare the performance of different LLMs for similarity search:
  - see if there is any existing paper/work on such comparison
  - if not, find a benchmark dataset for comparison
  - vector storage built-in LLM
  - LLM APIs,
  - open-source LLM with different sizes, such as 7B, 13B, and 70B version of Llama2
  - different levels of quantisation: 16bit, 8bit, 4bit, 2bit, etc.

# 20 Nov 2023 (trading)

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



# 17 Nov  2023

Rachana: design the interview and ethics

Ziyue Wang: 
- talked to the PhD student
- graphical neural networks

Peining
- MSc HCI
- Image models for artists
- ask sister in US to recruit artists

Jianwen
- interview with ameture user interested in stable diffusion
- building a notebook extension

Hongye
- talk to neighbour, who is a master student, need more preparation to under his paper reserach needs
- building a prototype with kaggle arxiv dataset with chroma

Jiaqi
 - talked to 4 users
 - phd student: extract the 'method' section from a set of papers
 - colleague:
   - have one window (multiple tabs) for each task
   - infer the connection between webpages
 - different ways of grouping tabs
 - a simple browser extension with popup

## To do
- continue with the user requirements if not finished
- continue with the prototype if not finished
- **further narrow down the project idea**
- push/upload your code/documents (markdown) to the repository folder
- Have a look of the quantisd LLMs lised in the Teams chat, compare the performance of different models
- have a look of the azure openAI api document
- write down the interview with enough information that someone new can understand
  - and come up with some requirements from the interview
- Ziyue: research on knowledge graph, not graph neural network
- Ziyue: find users with problem you can help with
- Peining: identify potential users and their challenges
- Jiawen: decide
  - whether to include recommendation or not (i.e., just history visualisation)
  - wheter to support web or notebook interface
  - try to capture the values from the disco diffusion notebook as a start

# 13 Nov 2023 (trading)

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
  

# 10 Nov 2023

- Rachana:
  - user study  
  - gpt-3.5-turbo-1106 + dalle2
  - storyboarding
  - £40
  - 5 users
- Hongye
  - vector db can create text embedding: chroma
  - locally run LLM - Illma 2 - 7B
- Users
  - Rachana: 1 CS student writing a book, a poet in canada
  - Jianwen: one student from group project, personal interest, midjourney; an anime interest group
  - Hongye: PhD student reseraching in recommender security, literature review
  - Ziyure: Jianwen, PhD student at Warwick, searching and comparison, roommate CS,
  - Jiaqi: intern colleague, developer, always has lots of tab, PhD in Japan, agriculture, create a mindmap

## Todo
- Talk to your users to understand their requirements and challengs.
- Start designing and buidling a very simple end-to-end prototype

# 6 Nov 2023  (trading)

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

# 3 Nov 2023
- [Generative AI for Everyone](https://www.deeplearning.ai/courses/generative-ai-for-everyone/)
- Rachana - papers: [Where to Hide a Stolen Elephant: Leaps in Creative Writing with Multimodal Machine Intelligence](https://dl.acm.org/doi/10.1145/3511599) and [Grimm in Wonderland: Prompt Engineering with Midjourney to Illustrate Fairytales](https://arxiv.org/abs/2302.08961)
- Jiaqi [Design Order Guided Visual Note Layout Optimization](https://ieeexplore.ieee.org/document/9767765) and [Target Netgrams: An Annulus-Constrained Stress Model for Radial Graph Visualization](https://ieeexplore.ieee.org/document/9814874/)
- Jianwen [Beyond Text-to-Image: Multimodal Prompts to Explore Generative AI](https://dl.acm.org/doi/10.1145/3544549.3577043) and [Enhancing Arabic Content Generation with Prompt Augmentation Using Integrated GPT and Text-to-Image Models](https://dl.acm.org/doi/10.1145/3573381.3596466)
- Hongye [VITALITY: Promoting Serendipitous Discovery of Academic Literature with Transformers & Visual Analytics
](https://ieeexplore.ieee.org/document/9552447) and [Interactive and Visual Prompt Engineering for Ad-hoc Task Adaptation with Large Language Models
](https://ieeexplore.ieee.org/abstract/document/9908590?casa_token=FpG4__iGu-8AAAAA:vQgLsYE0rVFPI6QfdJ00vSJaBKY8WUb1PoaCPZvFwBxgixdpdP5DrVqowU3wGZv7lQNpyT-OoA)
- Ziyue [DIVI: Dynamically Interactive Visualization
  ](https://ieeexplore.ieee.org/document/10299539) and [Foresight, sensemaking, and new product development: Constructing meanings for the future
  ](https://www.sciencedirect.com/science/article/pii/S0040162522004668)
  
## Todo
- add the paper(s) you found to the meeting notes above 
- decide on the LLM API you want to use
  - The cost of the API and roughly the total cost
- find some potential users, just 2-3 for now


# 30 Oct 2023 (trading)
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

# 27 October 2023

## Todo
- Kai to add the [prompthis paper](https://github.com/Vis4Sense/student-projects/blob/main/instructions/202310022007-prompthis.pdf) to the repository (please do not distrubte the paper as it is not published yet)
- Kai to add the Richard interview: the summary and images discussed are in this [google folder](https://drive.google.com/drive/folders/1A9SnyVm7mEd-FsuFxO8po6s2_f0U4aVq?usp=sharing), but the actual recording is no longer available (auto deleted by zoom).
- Kai to add information about vitality tool (added to the [project page](https://kaixu.me/2023/09/14/llm-for-literature-review/))
- Find at least one paper from either TVCG or CHI that is relevant to your project
  - By going through the papers published in 2023 
  - And add it to your zotero database
- Finalise your project idea

# 23 October 2023 (trading)
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

# 20 October 2023

## To do list
- Start writing or revise your project proposal
- ethics forms/approval: prelimimary/full ethics form and data management plan
- (optional) find **one** relevant paper (not listed on the webpage).

# 13 October 2023

## Task for next week
- post your github account name in the teams chat, so Kai can add you to the project repository
  - Once added to the repository, created a folder under the `2023-2024` directory with your name and add a file named `readme.md` there with a brief description of what your project is.
- agree the time for weekly meeting
- read one paper (Kai will ask you to discuss the paper next week)
- UG proposal draft by next Wed
