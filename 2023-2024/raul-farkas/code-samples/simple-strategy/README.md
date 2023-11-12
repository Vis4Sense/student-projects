# Simple strategy example to outline a basic trading pipeline

The pipeline found in the `simple-strategy.py` file performs the following steps:

1. Acquires market data for the AAPL symbol of a given day
2. Gets the news related to AAPL for the same day
3. Performs sentiment analysis on the news headline and produces a string (negative/neutral/positive)
4. Maps the news to the market data (uses article creation time to match it to market data time)
5. Adds moving averages (10 minute one and 80 minute one)
6. Generates trading signals with the following criteria
    * A 20 minute window is used, decisions are made based on that window
        * If the 10 minute moving average is > than the 80 minute one and an article with positive sentiment was
          published in the same timeframe, buy
        * If the 10 minute moving average is < than the 80 minute one and an article with negative sentiment was
          published in the same timeframe, sell
        * Trader does not sell if the previous signal was to also sell
        * Trader does not buy if the previous signal was also to buy

## Requirements

* Alpaca.markets API
* OpenAI API key
* Install python requirements using `pip install -r requirements.txt`