# 28 May 2024
Xiruo Sun
1. Progress:
   - reset the max number of stock trading quantity(full buying power), do experiments again. some sentiment models perform better than none-sentiment models.
   - write some part of the dissertion.
2. Question and difficulty
   - it is difficult to summary the pattern of these experinment.
3. Next step
   - finish the dissertion


Muhamad Hermawan
1. progress:
   - Train the agent with sentimen and without sentiment in longer period time from 2019 to 2021
   - testing the agent with 9 different period of testing data, from 2022 to 2024
2. Difficulty and Question
   - Failed to train on longer timeframe, taking too much time for enough episode of training above 4000 episodes training.
3. Next step
   - Writing dissertation


# 21 May 2024

Muhamad Hermawan
1. Progress:
   - modify environtment, implement various reward function
   - More test with various reward function
2. Question or Difficulty:
   Haven't found reliable hourly market data at least for 5 years history
   - Alpaca, available but close price is non adjusted, some missing data on 8 asset stocks
   - yahoo finance, cannot retrieve historical hourly data beyond one and half years
   - Eikon Refinitiv (Reuters), only lattest 1 year historical data for hourly data
   - Bought from databento.com, got from 2018 hourly data, but it is non adjusted closed price, some missing data
   - bought from polygon.io, got from 2020, close price is adjusted, but too many missing data between hours. random between stock, so one record
   - haven't got another free source or affordable. others too expensive to try.
3. Next Step
   - Start writing 


Xiruo Sun
1. Progress:
   - do experiments using different input environments.
2. Question and difficulty
   - the performance using only price features is better than only using sentiment features.
3. Next step
   - try more experiment.
   - write paper


# 14 May 2024

Muhamad Hermawan
1. Progress:
   - primarly debug and modifying environtment especially reward, (trying quite variations of reward and punishment) and testing
   - three testing on sentiment and non sentiment with final reward function
2. Question and difficulty
   - not converge yet after training up to around 5000 episodes,  probably need more
3. Next step
   - start to draft disertation
   - little bit extended experiment
  

Xiruo Sun
1. Progress
   - no much progress, because I need to modify the observation space last week, I only started doing the parameter tuning experiment yesterday.
2. Question and difficulty
   - when I do parameter tuning, I could only do 200 episodes training each set of parameters(different learning rate, gamma, etc.) because of the limited time, does this make sense?
3. Next step
   - writing dissertation while doing experiments.

Raul Farkas
1. Progress:
   - Started working on final presentation
2. Questions and difficulties
   - None
3. Next step
   - Finish presentation and present of Friday


# 7 May 2024

Muhamad Hermawan
1. Progress
   Experiments:
   - trying decaying learning rate, as the training goes on the learning rate will smaller
   - testing around with different reward scenario.
     
        -good thing: the agent now seems encourage more to trade rather than buy and hold
     
        -bad thing: not as expected, the agent failed to converge, both on 2 technicals + sentiment and 2 technicals only (no sentiment)
     
        -tried up to 23,000 episodes, same result.
2. Question and difficulty
   - Need to debug the environtment regarding the reward or punishment calculation to make sure it is as intended.
   - Need more test with different reward and punishment calculation
   - Feature scaller, yes or no?
3. Next Step
   - Will try to lift the trading limit, above test is max buy each stock is 5% from initial balance. Next: unlimited as the agent like to buy and sell
   - More experiment with different reward calculation

Xiruo Sun
1. Progress
   - do experiment for 8000 episodes.
   - the performance of with sentiment is better than without sentiment.
   - write the optuna code to test different model.learn parameter
2. Question and difficulty
   - need to do more experiment.
3. Next step
   - do optuna experiment.
   - do experiment using other stocks dataset


# 30 Apr 2024

Muhamad Hermawan
1. Progress
   - do extended testing up to 7000 episodes both for non sentiment and sentiment version. got highest sharpe on sentiment version, >6
   - strange behaviour of the agent which is sell all holding stocks, several times on some points are identified. (market crash safety is triggered, for the lattest test, I set it off)
2. Question and difficulty
   - on training phase, both the sentiment and non sentiment showing decrease of reward on end of training pahse and stabilise around that reward (after 5000 for non sent, above 3000 for non sent)
   - on this around 7000 episodes of training, the agent only buy and hold both on sentiment and non sentiment (first time I encounter this). on my previous up to around 1300 episodes of training the behaviour is normal, buy sell hold.
3. Next step
   - another test and experiment: reduce the complexity (reducing techincal indicator used, try only 3 or 4) adding new features (price change)
   - modify the environtment, hopefully better result.
   - do another 7000++ episodes training with new setting.

Raul Farkas
1. Progress
   - Not much work has been done after the submission of the disertation
   - Link to project repositories:
      - https://github.com/raulfrk/OpenTradingPlatform
      - https://github.com/raulfrk/OpenTradingPlatformPythonClient
      - https://github.com/raulfrk/StrategyBuilder
      - https://github.com/raulfrk/TradingExperiments

2. Question and difficulty Next
   - None

4. Next steps
   - Prepare final presentation


Xiruo Sun
1. Progress
   - do experiment for 1500 episodes.
2. Question and difficulty
   - Using my env and finrl environment for experiments, there is always only one action when test.
   - I change my env and the action is no longer just one, but doing the same action every time.
3. Next step
   - change reward function

# 23 Apr 2024
Muhamad Hermawan
1. Progress
   - Did series of testing with this condition:
        - Remove the deterministic output (remove random_seed) from agent and trading environtment. Instead, run each test 3 times (each for sentiment and non sentiment features) with identical parameters and take average of the result.
        - To minimise the volatility of the test result, I increase the training period to around 1200 episodes on each training phase of the test.
   - From above test, it is more evidence that the agent trained with sentiment feature, doing better compare to non sentiment.
2. Question and difficullty
   - about the sufficiency of agent training, how to properly evaluate the training phase?
3. Next step
   - Enough with agent params, now will try to play around with environtment, modify here and there..to see if it will increase the overall result.


Xiruo Sun
1. Progress
   - do experiment using all the sensations I have.
2. Question and difficulty
   - In order to increase the frequency of agent transactions, I modify the reward function, but the results are not good.
3. Next step
   - change reward function
   - change action function
  
Raul Farkas
1. Progress
   - Finished dissertation and submitted
2. Question and difficulty
   - None
3. Next step
   - Finish the final presentation


# 16 Apr 2024
Xiruo Sun
1. Progress
   - do some parameter tuning
2. Question and difficulty
   - the more training times, the less action the rl model takes
3. Next step
   - do more experinment
  
Muhamad Hermawan
1. Progress
   - experiment with hyper parameters tuning
   - Lots of testing with 5 sentiment model, dolphin 7B, Kunoichi 7B, Orca2 13B, equal weighted Ensembled 3 LLM (dolphin, Kunoichi, Orca), weighted Ensembled 3 LLM
   - trying baseline from paper Deep Reinforcement Learning for Automated Stock Trading: An Ensemble Strategy: source https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3690996
2. Question and difficulty
   - Parameters tunning takes lot of time, it seems like no limit since single slight change in parameters sometimes will resulting quite different result, no pattern, will take most high from all test, and use the parameters to test on asset with different sentiment and also no sentiment. Lean on using Weighted ensembled
3. Next step
   - more experiment testing and trying to add other baselines.

Raul Farkas
1. Progress
   - Writing final dissertation
   - Performed more experiments
2. Questions
   - None
3. Next step
   - Finish dissertation work

# 09 Apr 2024
Raul Farkas
1. Progress
   - Concluded most experimentation with the trading agents in backtesting, found interesting results
     - Amazing performance with zero-commission trading
     - Lower performance when commission is introduced, but still possible to make a profit on certain stocks
     - Uncertain results with and without sentiment analysis (might be due to incorrect sentiment score (attempting with sentiment analysis per-symbol in a news headline)
2. Questions and difficulties
  - None so far
3. Next steps
   - Finish writing dissertation
   - Create 3-min demo video

Xiruo Sun
1. Progress
   - only read some papers
2. Question and difficulty
   - stuck with the project about how to improve sentiment analysis
3. Next step
   - try the baseline and improve sentiment analysis
  
Muhamad Hermawan
1. Progress
   - Implementing Hyperparameters Optimitation using Optuna
   - Trying multiple sentiment and optimised through Optuna to see best result per sentiment and without sentiment
2. Question and difficulty
   - Parameter optimisation is time consuming, many parameters and all of it are sensitive to the output result.
3. Next step
   -  run couple more parameter tunning to see the output variance between sentiment including no sentiment. and then try to finalise the sentiment before run more thorough parameter optimisation
   - Read the recommended paper for baseline and try to understand and implement it, look other possibilities for alternative baseline from other papers.


# 02 Apr 2024
Xiruo Sun
1. Progress
   - read the excepted return and llm, get baseline model sensation based on this paper's method
   - compare the baseline model and orca model
2. Question and difficulty
   - my env has something wrong, I need to edit it
3. Next step
   - try different sensation strategy and do experienment
  
Muhamad Hermawan
1. Progress
   - Increasing the reliability of sentiment strength, from 3-shot CoT -> 6 shot CoT, and from 3 shot non-CoT into 9-shot non-CoT
   - Changing the asset composition into all tech, increasing it to 8 assets. (take most 8 tech asssets with most news)
   
2. Question and difficullty
   - need more exploration on new sentiment output with that new assets compositions
3. Next step
   - Increasing training period.
   - implementing dynamic traning period.
   - finalising sentiment extraction method.

Raul Farkas
1. Progress
   - Working on stabilizing agent training to avoid having massively different results when training multiple times on same conditions
2. Question and difficulty
   - Getting baseline for comparison
3. Next step
   - Finish adjusting model training, train model multiple times with different symbols and features (such as sentiment).
   - Collect performance results and compare with the buy and hold strategy
   - Write dissertation

# 26 Mar 2024
Raul Farkas
1. Progress
  - Experimented with the development of RL models for trading, produced a model with good performance on a volatile stock
  - Currently experimenting with stocks that are generally used for longer term trading e.g. AAPL (might need to modify the technical indicators)
2. Question and difficulty
  - Fairly major issue with differences between data in the Gym env and during backtesting (seems that in the env the data is slightly different post-normalization). If no solution is found in a timely manner, the data will go through the Gym env before inference.
3. Next step
  - Create a set of models for a set of symbols
  - Then re-create the same models but with news sentiment as a feature
  - Wrap-up code

Xiruo Sun
1. Progress
   - do some experiment using different sentiment features
2. Question and difficulty
   - haven't try to get the average of test
   - the profit still negative
3. Next step
   - keep try different sentiment features or other methods to improve profit
  
Muhamad Hermawan
1. Progress
   - Comparing output from different LLM sent input
   - comparing different prompting 3 shot learning CoT vs Non CoT
   - more expriment with parameter tuning
2. Question and difficulty
   - producing sentiment longer than initially thought, probably will have to choose CoT prompt and not much experiment in producing sentiment, and also limiting the asset around 5 to 10 to reduce raw news
3. Next step
   - selecting other asset
   - trying different processed sentiment

# 20 Mar 2024
Xiruo Sun
1. Progress
   - Have finished modifying my env code
   - do the experiment with and without sentiment scores using my env
2. Question and difficulty
   - The experiment results have randomness, need to find out how to make the experiment results stable
3. Next step
   - try to make the experiment result stable
   - try to optimise the sentiment analysis to improve result
  
Muhamad Hermawan
1. Progress
   - did the experiment on 5 assets portofolio, PPO agent, with and without sentiment scores, with various additional technical indicators as another input features. 
2. Question and difficulty
   - need to finding out another way to aggregate the sentiment. Interested in ensemble method.
3. Next step
   - Try to test another sentiment output from different LLM model
   - find related paper about state of the art strategy in quantifying the sentiment strength from LLM for RL model input.



# 13 Mar 2024
Raul Farkas
- Progress
   - Further experiments on stock trend/price prediction
      - No significant imporvements, barely better than a moving average (i.e. it is a lagged feature)
   - Started focusing on developing the trading RL strategy
      - Explored backtesting.py as a backtesting/broker simulator to simplify RL env development
-  Questions and difficulty
   - None
- Next step
   - Leave forecasting on the side and start working on the RL models that use sentiment analysis
- Links
   - https://github.com/twopirllc/pandas-ta
 
Xiruo Sun
1. Progress
   - write my own environment code
2. Question and difficulty
   - the profit of the trading is very low, I don't know if it's caused by the code error. I need to modify the code.
3. Next step
   - modify the code and do some experienments
  
Muhamad Hermawan
1. Progress
   - more experiment with FinRL lib, ex: try different algo, params, stock comp, technical features, slight modification add functionality
   - Aanalysing news character for strategy
   - preprocess news for sentiment feature
2. Question and difficulty
   - need more time to explore how to produce high quality sent feature
   - appropriate lenght of historical data and test data, and about effect of different historical trend of training and test data
     
3 Next step
   - experiment with various sentiment strategy as feature input
   - more experiment on env params and algo params with and combine it with different params and stocks


# 06 Mar 2024

Project separation:
- Raul: improve the return of a single symbol/asset with price and technical indicators
   - The goal is to improve longer term return, such as after one year.
   - Have a look of the longer term prediction paper from Google and the related work it mentioned.
   - One idea is to identify certain 'patterns', such as sudden price increase, and take advantage of that.
- Xiruo: improve the return of a single symbol/stock by optimising the sentiment analysis
- Muhamad: improve the return of portfolio selection and weighting by optimising the sentiment analysis and possibly RL.

Raul Farkas
1. Progress
   - Further work on developing a Stock Close price forecast model (Based on BiGRU-LSTM architecture)
   - Created unified diagram of trading system
2. Questions and difficulty
   - Training requires a lot of time (especially when testing different parameters) will attempt using Hyperparameter tuning where possible
3. Next step
   - Use Hyperparameter tuning for stock close price forecast
   - Develop RL model
   - Experiment with toggling on/off sentiment score as a feature to the signal generation RL model and see what is the outcome difference
   - If time allows, train RL model using hyperparameter tuning
     
Xiruo Sun
1. Progress
   - read some papers and create an overview diagram of the combined system
2. Question and difficulty
   - need to learn deep learning
3. Next step
   - write code

  Muhamad Hermawan
1. Progress
   - experimenting with FinRL a python opensource module for quantitative fianancial in RL
   - Read some of its published journal/paper
2. Question and difficulty
   - still need more time with DRL 
3. Next step
   - more experiment with Trading RL Environment and strategy

# 26 Feb 2024

## Discussions
- The goal is to maximise profit (and then reduce risk) and not predicting future price.
- Need to decide/predict (for each asset):
   - Is it a good time to buy or sell
   - How much to buy or sell
 
## Todo
- Raul, Xiruo, Muhamad: create an overview diagram of the combined system that
   - The goal is to maximise profit (and then reduce risk) and not predicting future price.
   - Support portfolio management, i.e., for each asset need to decide/predict:
      - Is it a good time to buy or sell
      - How much to buy or sell
- (from previous week)
   - ~~Kai to find the deep learning time series paper from google~~ [A decoder-only foundation model for time-series forecasting](https://blog.research.google/2024/02/a-decoder-only-foundation-model-for.html)
   - Raul to have a look of the time series prediction literature

Raul Farkas
1. Progress
   - Implemented technical analysis indicators (RSI, Moving average, Exponential Moving Average)
   - Started implementing matching mechanism to match news sentiment to stock data
   - Had discussion with Xirou and Muhamad about what each project will be focusing on
   - Released OTP v0.1.2 (Contains important bug fix)
2. Questions and difficulty
   - None
3. Next step
   - Finish matching mechanism and start implementing experiments with RL and LSTM (For stock price prediction)

Xiruo Sun
1. Progress
   - try a very simple rl model with very simple rl environment
2. Question and difficulty
   - not very clearly about the rl, need further study
3. Next step
   - try to design a suitable environment

Muhamad Hermawan
1. Progress
   - Tried some examples provided by open ai gymn, ex: bipedal walking robot
   - learning David Silver teaching video (unfinished)
2. Question and difficulty
   - rl more complext than I expected, need more time to learn about it.
3. Next step
   - keep learning rl and relate that open gym example environtment into trading environment
   - finding literature and material about creating trading environment for rl, and try to reimplement it.

### Outcome of meeting to discuss the focus of each project

- Muhamad: Quality of sentiment analysis from different prompts and model selection with reinforcement learning(choosing the best trading strategy with a RL or some other AI based model)
- Xirou: Market impact of news and reaction time of strategies when making trading decisions.
- Raul: Using reinforcement learning to make trading decisions based on market data such as bar data, technical indicators, news sentiment and stock prices forecast obtained from models like LSTM to predict prices at different intervals (1minute, 5 minuites...). Various features will be toggled on and off to see their impact on the trading outcome.

# 19 Feb 2024

## Discussions
- Reinforcement Learning (RL) resources
   - [OpenAI RL tutorial](https://www.gymlibrary.dev/content/environment_creation/)
   - [Lecture (and video recording) by David Silver from UCL](https://www.davidsilver.uk/teaching/)
   - Hugging Face tutorial (https://huggingface.co/learn/deep-rl-course/unit0/introduction)
   - Other tutorials (@Ruals and @Muhamad, please add here)
   - [Reinforcement Learning from Human Feedback (RLHF) tutorial (google cloud)](https://www.deeplearning.ai/short-courses/reinforcement-learning-from-human-feedback/)
- Baseline system for comparision
   - [Online Portfolio Selection: A Survey](https://arxiv.org/abs/1212.2129)
   - https://github.com/OLPS/OLPS

## ToDo
- ~~Kai to find the deep learning time series paper from google~~ [A decoder-only foundation model for time-series forecasting](https://blog.research.google/2024/02/a-decoder-only-foundation-model-for.html)
- Raul to have a look of the time series prediction literature
- Raul, Xiruo, and Muhamad: revisit the papers Tianxiang sent at the beginning of the project
   - system/platform architecture
   - as potential baseline
- Raul, Xiruo, and Muhamad: to meet and discuss
   - all the different things to try to test and improve the trading performance
   - an order/plan of these: what to start, what's next, and so on (start with the simplest and gradually add more data/complexity)
   - a division of work among the three   

Raul Farkas

1. Progress
   - Released new verson of Trading Platform and Python Client with minor bug fixes mostly and a significant change to match the new Alpaca API for getting historical bar data
   - Experimented with the creation of a OpenAI gym environment for trading and developing a stock price prediction model based on RNN (Recurrent neural network) architecture that makes use of LSTM (Long short-term memory) operators to generate t+1 datapoint using t-n previous market data points
   - Started development of trading strategy functionality
2. Questions and difficulties
   - Is the final presentation in May online?
3. Next steps
   - Design and develop experiments that make use of stock price prediction and RL using OpenAI gym to assess the utility of various trading strategies. There will be a strong focus on running very similar strategies/models with and without news sentiment data to assess the impact of integrating them as a trading decision factor
   - Further experiments with the addition of technical analysis indicators to the training and testing datasets to verify the performance impact.
   - Repeat the same set of experiemnts with multiple symbols and even other asset classes such as Crypto to verify if there are any differences.
   - Possibly try to use Recurrent Networks for signal generation too and compare the performance with using RL
  
Xiruo Sun
1. Progress
   - learn reinforcement learning on huggingface
2. Question and difficulty
   - None
3. Next step
   - complete learning RL
   - try RL using openai gym
  
Muhamad Hermawan
1. Progress
   - Learning about concept of Reinforcement Learning and how it implemented for trading strategy
   - got a knowledge about asyncio python
   - Tried to implement Raul's OpenTradingPlatform, and able to run it in windows and incorporate LLM Ollama module through WSL
   - Progressing on finding out trading strategies, currently lean on to maximise the LLM capabilities in understanding the news context by Investigating the sentiment granularity effect on the trading outcome. ex. sentiment ranging from -1.000 to 1.000 compared to different level of granularity like neutral, positive, very positive, negative, very negative. and with negative, neutral, positive. Additionally, find out What is the treshold of the granurality of the sentiment, on what level of sentiment will consistently give impactful effect to trading outcome. What if various technique analysis incorporated. What results come from different RF algorithm
  
2. Question and difficulties
   - about baseline, 1st, How to find suitable baseline, should be reputable lots of citation paper? (Excelent but probably long or hard to implement since no code usually provided). Or any paper that have good result and providing codes to replicate is Ok?. 2nd, does the baseline could be any strategy of trading as long as yield high return (state of the art), or it must be relevant with ours, like using RF or maybe incormorating sentiment.
   - Want to know more about different machine learning methods, e.g., reinforcement learning (RL) vs other machine learning methods.
  
3. To do
   - Involve more on RF environment and its implementation on Financial trading
   - works on project trading strategy
   - Ask Raul to know better about OTP and how to maximise its potential
  


# 12 Feb 2024

**No meeting** (break for Chinese New Year)

## Work might be needed (for the second half of the project)
- stock vs crypto
- different machine learning methods, e.g., reinforcement learning (RL) vs other machine learning methods.
- different trading strategies, e.g., high-frequency vs. short/mid/long term, value-based vs momentum, experts generated vs. ML based.
- fine tuning the LLM for trading, i.e., what parameter/prompt/shot is best for trading (not the benchmark).
- generate synthetic data (for ML/RL training): similar to the characteristics of the real data; generating the news might be diffcult (can we use LLM for this?)

## Todo
- discuss the relationships between the different models, how one is related to other.
- Select the best performing model based on the target scenario, e.g., the number of shots that we are likely to use, the actual prompt that we will use, etc., and not average over all number of shots and all possible prompts.
- continue the discussion on how to make sure Raul/Xiruo/Muhamad's project are not the same.


# 5 Feb 2024

Raul Farkas
1. Progress
   - Initial version of the OpenTradingPlatform (OTP) is ready and was released with version v0.1.0. Link to github repo: https://github.com/raulfrk/OpenTradingPlatform/tree/v0.1.0
   - Initial version of the OTP Python client is ready and was released with version v0.1.0: Link to github repo: https://github.com/raulfrk/OpenTradingPlatformPythonClient/tree/v0.1.0
   - Both repos contain guides on how to install OTP and the python client and also how to use it in various scenarios.
   - Contact me in case of any issues or bugs. I will work to fix them as soon as they are found, just make sure you provide all the context of how you found the bug and how it manifested to make it easier for me to reproduce it.
   - Added support for another LLM provider (gpt4all)
2. Questions and difficulty
   - None
3. Next step
   - Start having a look at training the RL models for trading
   - Fix any bugs in the OTP or client
   - Help others with getting started with the platform
   - Make progress on remaining trading platform features (lower priority)

Xiruo Sun
1. Progress
   - Prepare the prensentation
   - discuss with Muhamad about the next step
2. Question and difficulty
   - None
3. Next step
   - learn reinforcement learning knowledge
   - learn how to use openai gym
   - find some suitable investment strategies.
  
Muhamad Hermawan
1. Progress
   - Done preparing for presentation
   - Have discussed with Xiruo about how our project will unique in each other
   - learning about reinfored learning (pending)
   - Read asyncio python documentation (pending)
2. Question amd difficulty
   - None
3. Next step
   - Learn and try reinforced learning
   - Formulating trading strategy including US stock and sector choises
   - red Asyncio python documentation

# 29 Jan 2024
Xiruo Sun
1. Progress
   - find another sentiment strengh benchmark: FiQA, and conduct experiments using FIQA: https://sites.google.com/view/fiqa/home
   - finish the first semester report
2. Question and difficulty
   - None
3. Next Step
   - prepare the presentation

Muhamad Hermawan
1. Progress
   - have finished first semester report
2. Question
3. Next:
   - Preparing presentation documentation
   - Discuss with Xiruo about how to differentiate our project, strategy, assets, etc
   - Read asyncio python documentation
   - learn a bit about RL qym through its documentation

Raul
1. Progress:
   - Completed implementation of sentiment analysis for analysing news data from database with both normal and semantic approaches.
      - Only ollama currently supported as a model provider for now
   - Missing live news analysis (delayed for later since not immediately needed. Priority is given to implmeneting the client library for the trading platform)
   - Trading platform wrapped in docker containers making it easier to run it with just one simple commnad (documentation not written yet)
   - Started a bug crunch and refactoring process to reduce code size and find any bugs (still in progress)
   - Had a quick look at weights and biases platform. Seems possible to install on-premise open source version. Further investigation will be done when RL models training       starts.
2. Question and difficulty
   - None currently, development is progressing well
3. Next steps
   - Priority is given to the development of the trading platform python API
   - Starting to write user guide for trading platform and trading platform client
   - Continue with bug crunch and refactoring


# 22 Jan 2024
Raul Farkas
1. Completed implementation of the Data Provider (component that gets live and historical data from Alpaca), completed implementation of Data Storage (component that saves all the data that arrives from any source). Development in progress for the Sentiment Analyzer component (that performs sentiment analysis using LLM on news). Development of the Python API not started yet.

3. The development of storage component took significant time, which stretched the timeline for the platform development. 
   
5. Continue development of the trading platform and start development of the Python API.

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

Xiruo Sun
1. Progress
   - Conduct experiments using all the data from SemEval
   - Complete the Experimental part of the first semester report 
2. Next Step
   - finish the first semester report


# 15 Jan 2024

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
