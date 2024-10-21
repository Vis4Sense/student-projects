# LLM for automated trading

## Project Tasks

1. Gather some sample data
    - stick to single stock for now (consider a universe later)
    - needs to contain at least:
        - Date
        - Open
        - Close
    - try get at least 5 years of data
    - preferably csv format
    - yahoo finance or alpaca
2. Setup basic indicators:
    - RSI
    - MACD
    - Stochastic Oscillators
    - 20 MA (consider bollinger bands as well)
3. Generate series of orders for data given
    - build portfolio and order class
        - Portfolio:
            - needs current cash remaining, current open positions, current pnl, closed positions, initial amount
            - requires functions to add and deduct from the current cash remaining
            - buy and sell positions (this will be in open/closed positions as well)
            - calculate fees for transactions
        - Orders:
            - needs some sort of unique id
            - date of transaction
            - side
            - size
            - price
    - can be long only for now but consider extending to accomodate shorting
4. Implement simple rule based strategy function
    - Just use known techniques with 20 MA cross and sensitivity trading
    - Based on rules create a hitter to produce orders
5. Backtester
    - implement function that uses the strategies generated orders and simulates them
    - calculate pnl and roi

## Next steps
- Use rauls OpenTradingPlatform to connect and use realtime data instead of daily
    - Apply same simple rule based trading strategy and see performance
- Figure out common uses of sentiment (risk management? how good is sentiment trading? test it out?)
- What is the focus of this dissertation (stocks? if so a particular market? what part of a trading system? single stock or portfolio management (*likely to evolve into the latter*))
- Find some material on particular successful use cases of LLM's in this space

## *Note* Alpaca or Yahoo Fin

Using rauls OpenTradingPlatform, we can create a client to that instead of reinventing that platform. After playing around with it, seems to be the best approach to implementing and testing our own strategies. <br>

Yahoo finance also has limited support for historical data so for one off use, can use -> https://www.nasdaq.com to just get a csv 

*Alpaca ~ there is a limit on a potential universe of tickers that we can connect at once.*

