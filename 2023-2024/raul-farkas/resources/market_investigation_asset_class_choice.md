# Market investigation and asset class choice for the project

When it comes to market, there are several asset classes that can be traded on various markets. 

Examples of such asset classes include:

* Equity (stocks)
* Fixed income (bonds)
* Forex
* Derivatives (futures and options)
* Cryptocurrencies

When choosing asset classes for this project, the following criteria were used:

* How easy it is to trade
* How easy it is to get news headlines
* How easy it is to get market data
* Trading cost (for live-trading)

## Platform

To decide the most suitable asset classes for this project, the first component that was investigated was the trading platforms that could be used.

The ideal trading platform would allow traders to use their API to perform both live-trading and paper-trading. Additionally it also provides both historical and live market data and ideally news headlines. Paper-trading should ideally be free of charge and live-trading cost per trade should be fairly low.

Given all these criteria, I have found Alpaca.markets to be the most suitable platform for this project as it:

* Provides Commission free live-trading
* Supports trading ETF, Stocks and Crypto
* Supports fractional shares trading
* Allows for free paper-trading
  * Account balance can be reset at any time
* Provides live and historical market data for all asset classes it supports
  * Up to 6 years historical data
* Provides news data from Benzinga
  * Both live and historical for a given symbol

Having one platform for both market/news data and trading makes it an ideal candidate for this project. 

Choosing this platform limits the range of asset classes for the project to Stocks, Cryptocurrencies and ETFs. Additionally, it also limits the market country to the US.

### Other options that were considered and drawbacks

* Oanda
  * Only FX and CFD available for most clients
  * Stocks only in EU
  * No news api
* FXCM
  * Only FX and CDF
* IG
  * No news api
  * No Stocks trading

## Equity and crypto

Given the chosen platform for the project, the list of asset classes that could be adopted is narrowed to ETFs, Crypto and Stocks.

In addition, for the purpose of this project, given that most of the trading will be intraday, the asset classes to be used need to have high liquidity to avoid having to hold for longer periods of time. For this purpose ETFs, Crypto and Stocks are all very good choices.

To start, the main focus will be developing a modular trading platform that allows different strategies to run at the same time for the same asset. Each strategy might be a variation of a base strategy that uses LLMs for sentiment analysis, or it might be a completely different strategy.

To ensure the success of the project, a narrow scope will be set to start with and development of the trading platform will focus on allowing stocks trading. The design of the platform will be kept modular, to allow for easy extension, with the potential of including Crypto as well. Ideally, switching betwen stocks and crypto should be as easy as changing strategy and choosing a different traded symbol. The modularity component of the platform will allow for the overall scope of the project to be easily increased througout the year.







