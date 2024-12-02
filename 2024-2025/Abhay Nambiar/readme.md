# LLM for automated trading

## Project Tasks

1. Gather some sample data
    - ~~stick to single stock for now (consider a universe later)~~
    - ~~needs to contain at least:~~
        - ~~Date~~
        - ~~Open~~
        - ~~Close~~
    - ~~try get at least 5 years of data~~
    - ~~preferably csv format~~
    - ~~yahoo finance or alpaca~~
2. Setup basic indicators:
    - ~~RSI~~
    - ~~MACD~~
    - ~~Stochastic Oscillators~~
    - ~~20 MA (consider bollinger bands as well)~~
3. Generate series of orders for data given
    - ~~build portfolio and order class~~
        - ~~Portfolio:~~
            - ~~needs current cash remaining, current open positions, current pnl, closed positions, initial amount~~
            - ~~requires functions to add and deduct from the current cash remaining~~
            - ~~buy and sell positions (this will be in open/closed positions as well)~~
            - ~~calculate fees for transactions~~
        - ~~Orders~~:
            - ~~needs some sort of unique id~~
            - ~~date of transaction~~
            - ~~side~~
            - ~~size~~
            - ~~price~~
    - ~~can be long only for now but consider extending to accomodate shorting~~
4. Implement simple rule based strategy function
    - ~~Just use known techniques with 20 MA cross and sensitivity trading~~
    - ~~Based on rules create a hitter to produce orders~~
5. Backtester
    - ~~implement function that uses the strategies generated orders and simulates them~~
    - ~~calculate pnl and roi~~

## Next steps
- Figure out common uses of sentiment (risk management? how good is sentiment trading? test it out?)
- What is the focus of this dissertation (stocks? if so a particular market? what part of a trading system? single stock or portfolio management (*likely to evolve into the latter*))
- Find some material on particular successful use cases of LLM's in this space

## *Note* Alpaca or Yahoo Fin

Using rauls OpenTradingPlatform, we can create a client to that instead of reinventing that platform. After playing around with it, seems to be the best approach to implementing and testing our own strategies. <br>

Yahoo finance also has limited support for historical data so for one off use, can use -> https://www.nasdaq.com to just get a csv 

*Alpaca ~ there is a limit on a potential universe of tickers that we can connect at once.*

## Timeline

| Milestone                                    | Target Date     |
|---------------------------------------------|-----------------|
| Interim Report first draft                  | 5th Nov         |
| Interim Report submission                   | 11th Nov        |
| **EXAMS**                                   |                 |
| Create model for order creation (trading bot component) | 31st Jan        |
| Combine with LLM sentiment                  | 10th Feb        |
| Fine tuning and try different learning techniques | 17th Feb        |
| Clean code and separate into classes        | 23rd Feb        |
| Add RAG module as per relevant paper        | 30th Feb        |
| Investigate semantic search methods         | 12th Mar        |
| Evaluate output                             | 17th Mar        |



## Previous tasks
- Single stock MVD
- Counting based sentiment analysis
- SEC filing analysis
- Connect to alpaca for both news and price data
- Backtester prototype
- Single-stock scoring algorithm (can start off with static data)
    - Extract text data from pdf (SEC filings)
    - Investigate how to get this from API or scraper:
        - *scraper is the only way*
    - Tokenize text data
    - Score using gemini flash model
- Headline scoring
- Investigate SEC latency
- Investigate use of embeddings
- Use embeddings to score sentiment
- Compare various methods till date
- Investigate correlated events (Trump election)
- Plot the results once time-series scoring algorithm has been implemented
- Connect scoring algorithm to simple trading strategy to evaluate performance
- 

## Backlog:
- Investigate consensus around various news sources (yahoo finance, benzinga, newsapi, etc)
- Figure out method of storing static data that interacts well with streamed data
- Implement streamed data scorer using alpaca for starter
- Diversified sources (RL should pick this up)
- Investigate backtesting library found
- Compile requirements and specification formally
- Connect to trading platform for paper trading (single stock at first)
- Connect to SEC filings (web-scraper or Edgar-filings api)
- Add logging using WandB

## Current Sprint:
- Use LLM for embeddings directly
- Use raw signals as trading strategy (buy and hold / short and hold)
- Refactor scripts till date
- Investigate potential alphas
- Build backtested for signals generated
- Asynchronous LLM requests

## Questions for next meeting:
- Best way to backtest? Alpaca trading platform
- Do neutral sentences have an impact?
  - Does sentiment influence price movement?
    - No, should we be aiming for a signal that provides use for price movement
    - Yes, how do we measure precision?
- Parsing big reports. E.g 10k filing?

