This is the folder for student projects in 2024-2025.

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
