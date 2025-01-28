This is the folder for student projects in 2024-2025.

# Meeting 28 Jan 2025
Manasi
- Top moving crypto for one day
- predicting price for the next 5 minutes using linear regression

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

## To Do
Manasi and Abhay
1. **Get a feeling what the change range is for the daily top movers are like, 10%, 50%, or 200%?**
   1. collect the everyday top movers for the last week/month/year/... (this will be the training data, with the highest time resolution)
   1. have a look of these price changes (visualise) to see if there is anything interesting/pattern
1. Build some very simple model, such as decision tree, to see how accurate we can predict such sudden changes
   1. **This can be **binary**, i.e., whether the price will keep going up in the next 5, 10, 30 minutes.**
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
