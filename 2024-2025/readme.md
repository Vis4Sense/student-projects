This is the folder for student projects in 2024-2025.

# Project list
- Abhay Nambiar: Machine learning for automated trading
   - focus: stock 
- Manasi Mehta: Machine learning for automated trading
   - focus: crypto
   - Anomaly detection: CNN-LSTM
   - front end UI
- Ningbo Wei: visual analytics for sensemaking
   - browser extension using LLM to support online senesmaking
- Xingyu Zhu: Human-AI Collaboration – LLM for Qualitative Analysis
   - Project 2: Medical data integration
   - Use LLM to help the mapping from medical database (such as those from NHS) to medical ontology (such as SNOMED)
   - Collaboration with School of Medicine (Grazziela Figueredo)

# 25 March 2025

Manasi, Tianxiang, Kai

Manasi
- (ablation) test results of cnn/lstm/ae on solana price for one year at 10 minutes interval: using all three has the best results (~90% AOC-ROC)

## Todo (in the next week or two)

For model comparision with the baseline:
- compare against with Sub-LOF [22], which is the best performing univariate unsupervised model acccording to [Anomaly detection in time series: a comprehensive evaluation](https://dl.acm.org/doi/pdf/10.14778/3538598.3538602)
- compare against ARIMA [65], which is also lstm/ae/cnn/transformer based (the same model type)
- Only on solana price data, which was used for cnn-lstm-ae?

For comparison among different coins and coin universe
- select 4 more coins besides solana
- train one cnn-lstm-ae model for each coin
- train one cnn-lstm-ae model using all the coin prices

For coin universe, plot the prediction error of each coin over time
- this is to see how often they change order

For trading, single coin, compare:
- baseline: buy and hold
- strategy 1:
   - when there is a positive anomaly, put all the fund into that
   - sell all the coin if there is a negative anomaly
 
For trading, coin universe, compare:
- baseline: buy and hold, equal percentage of all the coins, i.e., 20% each if there are five coins?
- strategy 1:
   - when there is a positive anomaly, put all the fund into that coin
   - if another coin has a positive anomaly, sell the current coin and put all the fund into the new coin
   - sell all the coin if there is a negative anomaly for this coin (this seems not ideal as if the price of the coin is going down it does not make sense to still hold it even if there is no negative anomaly)
- strategy 2
   - put all the fund into the coin with the largest positive prediction error, even this is not an anomaly yet
   - do not invest in any coin if there is no positive prediction error?
   - as the coin with the largest positive prediction error changes, move all the fund to the new coin
      - could this lead to too many reinvestments?
   - sell all the coin if there is only negative anomaly
- strategy 3: maybe learn a dynamic threhold?
   - measurement such as z-score is dynamic, but the threshold, such as 10% change, is not
   - middle ground between strategy 1 and 2?
- strategy 4:
   - invest a certain percentage of the fund, 20%, 30%, etc., every time instead of all the fund
   - the rest is the same as strategy 1-3
 
Integrating news sentiment
- Plot the price change and news sentiment value change over time to see if there is a strong correlation, i.e., does positive anomaly always associates with very positive news that is very popular
- Manasi: use news sentiment as a confidence score (how?)
- Kai: possible lag of the news, i.e., the creation and publishing of the news take time while the event already affects the price.

# To Do
## Manasi and Abhay
1. (online) database storage
2. universe:
   3. need to find a list of all the stocks
   4. nasdaq
   5. start with stocks with small market capticals
6. update the binary classification to predict when a big price change, like 5% in 5 minutes, will happen
7. train a model for each coin and one model with all the coin
   8. 
1. **(4 Feb 2025) Get a feeling what the change range is for the daily top movers are like, 10%, 50%, or 200%?**
   1. collect the everyday top movers for the last year or more (this will be the training data, with the highest time resolution)
   1. focus on the short term only, a few hours, max one day
   1. pick a coin with large volatility
      1. need price data very minute
      1. Try Kraken API?
      1. Use daily price to find which coins are more volatile
      1. If there is a (daily) top mover list, we can also use that
      1. Then get the minute price/volume data for those
   1. Put the data in an (onlie) database such as supabsase.
   1. Have a look of these price changes (visualise) to see if there is anything interesting/pattern
      1. Plot out the big price changes on (line) charts, maybe even one chart for each change event
      2. This may provide some clues what drives the changes, i.e., what input to feed the model.
1. Build some very simple model, such as decision tree, to see how accurate we can predict such sudden changes
   1. **(4 Feb 2025) This can be binary, i.e., whether the price will keep going up in the next 5, 10, 30 minutes.**
   1. Besides price prediction (e.g., using linear regression), we can also use decision tree to predict change range: 0-50%, 50-100%, etc.
   1. We don't need to predict too far ahead, from a few minutes to a few hours maximum. This is also when the model prediction has a better accuracy. The results are usually not good for longer periods, e.g., a few days to a few weeks.
   1. A possibility is to just use the 'top movers' list, but the remaining further increase may be limited by the time a stock/crypto makes to the list (something we can test)
1. The portofolio algorithm can work like this:
   1. Predict the price (or momentum?) for all the stocks/cryptos for the next 1/5/10 mintues, etc.
   2. Pick the one with the largest increase **and confidence**.
   3. Put all the fund into that stock/crypto, including selling any stock/crypto currently holding, if this is not the case already
   4. Repeat this process for every minute (or however fast we can do)
   - Cash is also always an option, with almost constant small but positive returns 
   - This would cover when to unload a stock/crypto (step 3)
   - This can be extended to short sell as well, i.e., comparing going long or short and see which has the better return
  
# 18 Mar 2025

## Manasi
- like reconstruction method, because it is better than forecasting based for volatile coins
- haven't selected models yet
   - univariate
   - point prediction   
- metrics: ROC

## Abhay
- reading the time series classification survey
- understand what DTW is
- testing shapelet: not working well so far
- tree-based algorithms: time series random forest - best performing so far, 0.58
- have not tried bag of words or bag of features

# Meeting 4 Mar 2025

## Abhay
- read the survey paper on time series classfication
   - time wrapping: expensive, most effective, 
   - shapelet: like it, expensive,
   - start with univariate (price), and then later add multivariate like volumn and other (similar) stock price
- collected data for 20 tickers: from 2015 by minute
   - labeling data: based on the interval size and threshold 
- (todo) complete the literature review paper
- (todo) select the most promising a few techniques and test their performance

## Manasi
- seasonality, noise, and the residule is anomaly
- just start the survey
- (todo) complete the literature review paper
- (todo) select the most promising a few techniques and test their performance

## Xingyu
- move 'details' to the same page under the 'results table'
- move 'filters' under the search
- move 'general search using llm' to where the 'filters' currently is
- show a ontology graph including all the concepts in the search results
- save the current state including the search/llm query and the results table and llm response

## Ningbo
- (todo) send Kai the details of api request and rate limit error message
- using own gpt-4o-mini api no rate limit issue (uk south)
- using python sdk has less rate limit error than javascript api
- chat box: (todo) use information from the opened tabs
- automatically add opened webpage to a task
- generate summary of pages in a task. (todo) add the summary to the displayed task box

# Meeting 25 Feb 2025

## Kai
- School says can set up a database
- Oracle seems promising 200GB free tier?

## Abhay
- largest daily changes for all nasdaq stocks every day: increase or decrease
- 75% of the changes are above 50% increase or decrease
- but for each stock, this happens at most 4 times a year
- get the hourly data
- calculated volitality based on RSI
- ranked the stocks based on weighted values of 5 features: price, volume, etc.
- collected minute data for the top 5 stocks for 1 year
   - about 1MB for one stack by minute data for one year   
- Questions: how to code the alphas
   - Don't need to code all the alphas
   - Maybe there are libraries implemented some of these
- (todo) write down the details of model training
- (todo) and then train the model

## Manasi
- trained on solano, doesn't work well for other coins
- when trained on data of multiple coins, the results are better
- price, volume, moving average prices/volume, standard deviation
- predicting mometum (price) of next minute, and then repeat for one day
- (todo) write down the details of model training
- (todo) memory monitor/analysis: what is using lots of memory
- (todo) share the notebook.

## Ningbo
- started using gpt-4o-mini
- reduce summary prompt size to 1000 characters
- (todo) try to send the url instead of webpage text
- created a chat box using python, will be converted to javascript and included in the chrome extension
- (todo) create buttons for specific task
- (todo) prompt caching https://platform.openai.com/docs/guides/prompt-caching
- (todo) send prompt and error message about the api rate limit
- (todo) finish the MVP

# Meeting 18 Feb 2025

Manasi is not feeling well.

## Abhay
Data
- Daily price for 3000 Nasdaq stocks
- Currently the difference of the close price of two consecutive days
  - It seems that most of the price change happens at the opening of the next day and this cannot be captured.
- (ToDo) Maybe change to the difference of open and close price
- (ToDo) select 10 stocks with the most price changes
- (ToDo) collect minute data for these 10 stocks

Model
- Currently, predicting if the price will increase by more than 5% in the next day
- (ToDo) maybe increase this 20%, or the average of the big price changes
- Currently, tested on random stocks
- (ToDo) test on the top 10
- (ToDo) make sure the model input is a time series, such a vector of the previous prices.

## Ningbo
- Currently, use LLM API summarise webpage
- (ToDo) need to switch to gpt4o-mini: the gpt3.5 cost is 10 times higher, but probably perform worse
- (ToDo) reduce the webpage token in the prompt: current there are 10K character in each prompt.
- Currently, Use LLM to group the webpages
- (ToDo) allow users to manually create groups and include those in the groups LLM created.

## Xingyu
- (ToDo) create a summary and requirement list from the meeting with Esmond
- The goal is to capture and display the entire mapping process
   - Including what has been checked and not included in the mapping
   - need to include the requred functions, such as search OMOP, so these can be captured in the tool
   - (ToDo) make a list of required functions
- (ToDo) create a sketch of how the UI may look like (possibly multiple screens)

# Meeting 11 Feb 2025

## Abhay, Manasi, Tianxiang, Kai

### Abhay
- missing data from Alpaca, but still using it
- binary prediction: whether will go up or not in 5 minutes
   - whether increase or decrease
   - input: price (open, high, low, close), volume, momentum, only look back 5 minutes
   - decision tree: poor result
   - random forest: slightly best
   - lstm: ~60%

### Manasi
- collect data
   - universe: all the cryptos from alpaca, ~120, the actual coins may be more
- Top coins: sol, uni, shib, doge
- there is almost coin with 20% daily price change every day.
   - 20% maybe a good threhold   

### Storage issue
Abhay: 
- 1 stock, 8 year, 1 minute, 130MB
- 480 stocks, 15GB
 
Manasi
- 1 minute resultion, for 1 coin, for 1 year,
- a few coins alreay over 500MB free Supabase limit

todo: find a solution
- ask school for database server

## Xingyu and Ningbo

### Xingyu
- todo: generate the output table automatically?
- todo: remove the 'reply' column in the generated table
- todo: make the input table one column
- todo: combine the input and output into one table

### Ningbo
- UI design
- todo: have one box for each task instead currently two
- Coding:
   - creat 'task' and add tabs
   - storage:
      - synchronised storage (100kb)
   - use of LLM for tab clustering (by city)

# Meeting 4 Feb 2025

## Manasi
- coin history data missing from alpaca
- using data from polygon.io
- test on solana whole of 2023
- input: lots of features, used some feature selection method
- output: momentum, using the definition from last meeting, in 1 day in future
- model: lstm, and decision tree (releative worse, especially for long term)

## Xingyu and Ningbo

Xingyu
- James replied
- updated UI
- next step
   - update the interface to include output columns in the table
   - meeting with the Esmond
 
Ningbo
- updated UI
   - refresh button to load the tabs
   - new tab gets added automatically
   - summary button to generate summary with azure api (gpt 3.5)
   - tasks and subtasks
- next step
   - let user customise tasks and subtasks
   - update the sketch:
      - have a hirearchical task tree on the left (UI)
      - how the tabs are displayed for each task

# Meeting 28 Jan 2025
## Manasi and Abhay
Manasi
- Top moving crypto for one day
- predicting price for the next 5 minutes using linear regression
- summary button to generate summary

## Ningbo and Xingyu
Rescheduled the meeting with Xingyu to Friday
Ningbo
- removed the backend and use chrome extension only
- 3 second delay to wait for page redirection
- choose a task: group holiday planning
   - sub task: different location (tokyo or osaka), but also different tasks (travel, hotel, attractions)
   - group task
   - start with one person and one sub task
- deepseek
   - summary
   - cluster
- local storage

# Meeting 13 Jan 2025

## Interim report feedback
- Abhay
  - the report is quite good
- Manasi
  - the report is very good;
  - is 'fundamental analysis' possible for crypto?
  - fine tune LLM and parallelism are optional/less a priority
  - CNN-LSTM
    - Is this one or two models?
      - one model  
    - what is the input and output, sentiment score?
      - Input: news and prices of all the stocks or cryptos (not a single one)
      - Output: which stock/crypto to invest, ~~and how much/many~~
    - Both CNN and LSTM are for historical data?
      - CNN is not for 'spatial' data? 
- Abhay & Manasi
  - the focus now should be on the trading, not just improve sentiment analysis by itself
  - need to find/create a trading strategy that can take advantage of sentiment results
  - improve/update sentiment if it helps with trading
  - **next step: focus on a specific scenario when there is a large/sudden price change?**
- Ningbo
  - good report
  - develop a back end model or use a hosted one such as those on HuggingFace?
  - database or browser local storage?
  - chat box: allow users to ask questions about the opened pages (by including those in the prompt)?
  - **next step: pick a specific sensemaking task to target.** Currently it is a bit too broad.

# Meeting 7 Oct 2024

Abhay, Manais, Ningbo, Xingyu, Kai

Discussed the tasks for minimal working demo.
- Less ambitious: maximum 2 weeks to complete
- More implementation details

Abhay/Manasi - data access: alapac or yahoo finance

Ningbo
- it is OK to use data from prevous student projects.
- choose a very small user task, such as comparing the prices (of a single product) from different website.

Xingyu
- scenario: User select a column and the LLM tries to find the best matching concept from the ontology
- there can be more than one matches
- eventaully this can be done for entire table or database
- option for front end: https://www.gradio.app/ 

## To Do
- Kai
   - to contact the collaborator about a meeting/example data
   - check the LLM access settings
- Everyone:
   - update the task list with implemention details the for the minimal working demo
   - add a deadline for each task (maximum 2 week, by 18 Oct)
   - start the implementation

# Meeting 2 Oct 2024

Manais, Xingyu, Ningbo, Kai (Abhay is ill)

Went through [How the project works](https://github.com/Vis4Sense/student-projects/?tab=readme-ov-file#how-the-project-works), [Project topics](https://github.com/Vis4Sense/student-projects/?tab=readme-ov-file#project-topics), and [Software and services](https://github.com/Vis4Sense/student-projects/blob/main/instructions/software.md).

## To Do
1. Creat a folder under '2024-2025' with your name. This will be the home folder for your code, data, and reports
2. Create a `readme.md` in your folder, within it list all the project tasks that you can think of for a _minimal working demo_, a simplest possible prototype that have all the necessary components.
   - For example for trading, this includes reading in the data, decide whether and how to trade (can be rule based), execute the trade, and record the results for performance comparison.
   - We will complete this  'minimal working demo' first, as it will help narrow the project focus and set the rest of the tasks.
