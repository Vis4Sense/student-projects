import os
import pandas as pd
import matplotlib.pyplot as plt

from datetime import datetime
from dotenv import load_dotenv
from alpaca_trade_api.rest import REST
from alpaca.data.historical.news import NewsClient
from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import NewsRequest
from alpaca.data.requests import StockBarsRequest, TimeFrame
from newsapi import NewsApiClient



load_dotenv()

alpaca_api = REST(os.environ["ALPACA_KEY"],os.environ["ALPACA_SECRET"])
newsapi_object = NewsApiClient(api_key=os.environ["NEWS_API_KEY"])

print(alpaca_api.get_news("NVDA","2021-01-01", "2021-12-31"))

# Taken from rauls simple-strategy.py code
def map_news_to_stock_bars(news, bars):
    news["timestamp"] = pd.to_datetime(news["created_at"])
    # Aproximate minutes to nearest minute
    news["timestamp"] = news["timestamp"].dt.floor("min")
    # Remove duplicates
    news = news.drop_duplicates(subset=["timestamp"])
    # Match news to the bars based on timestamp index
    news = news.set_index("timestamp")
    bars = bars.join(news, how="left")

    return bars


def get_stock_bars(symbols, start, end):
    key = os.environ["ALPACA_KEY"]
    secret = os.environ["ALPACA_SECRET"]
    client = StockHistoricalDataClient(api_key=key, secret_key=secret)

    request_params = StockBarsRequest(
        symbol_or_symbols=symbols, timeframe=TimeFrame.Minute, start=start, end=end
    )

    bars = client.get_stock_bars(request_params)

    return bars.df


def get_news(symbol, start, end):
    key = os.environ["ALPACA_KEY"]
    secret = os.environ["ALPACA_SECRET"]
    client = NewsClient(api_key=key, secret_key=secret)

    request_params = NewsRequest(symbols=symbol, start=start, end=end, limit=50)
    news = [x.model_dump() for x in client.get_news(request_params).news]
    return pd.DataFrame.from_records(news, columns=news[0].keys())


# using news api (Just has headlines like alpaca but can be used as a different source)
def fetch_nvidia_news():
    response = newsapi_object.get_everything(q='Nvidia',
        from_param = '2024-10-17',
        to = '2024-10-17',
        sort_by = 'relevancy',
        language = 'en')
    
    if response["status"] == "ok":
        print(f"successful retrieval, total results: {response["totalResults"]}")
        articles = response["articles"]
        return ['Title:' + article['title'] + '. content:' + article["content"] for article in articles]
    print(f"response code failed {response.status_code}")
    return []

def prep_data():
    df = get_stock_bars(["NVDA"], datetime(2024, 10, 1), datetime(2024, 10, 30))
    df_news = get_news("NVDA", datetime(2023, 10, 1), datetime(2024, 10, 30))
    return

