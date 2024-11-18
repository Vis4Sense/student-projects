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

## Backlog:
- Investigate consensus around various news sources (yahoo finance, benzinga, newsapi, etc)
- Investigate correlated events (Trump election)
- Connect scoring algorithm to simple trading strategy to evaluate performance
- Backtest (**BLOCKED**)
- Figure out method of storing static data that interacts well with streamed data
- Implement streamed data scorer using alpaca for starter (**BLOCKED**)
- Diversified sources (RL should pick this up)
- Implement class for streaming alpaca news data
- Devise some benchmarking and evaluation methods
- Plot the results once time-series scoring algorithm has been implemented

## Current Sprint:
- Single-stock scoring algorithm (can start off with static data)
  - How to approach universe of stocks?
    - *Create a vector and judge sentiment across this vector?*
- Extract text data from pdf (SEC filings)
- Investigate how to get this from API or scraper:
  - *scraper is the only way*
- Tokenize text data
- Score using gemini flash model


## Questions for next meeting:
- Best way to backtest? Alpaca trading platform
- Do neutral sentences have an impact?
  - Does sentiment influence price movement?
    - No, should we be aiming for a signal that provides use for price movement
    - Yes, how do we measure precision?
- Parsing big reports. E.g 10k filing?