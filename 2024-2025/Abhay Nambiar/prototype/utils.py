import os
import pandas as pd


from datetime import timedelta
from alpaca.data.historical.news import NewsClient
from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import NewsRequest
from alpaca.data.requests import StockBarsRequest, TimeFrame


def add_moving_averages(df: pd.DataFrame, periods: list[int]) -> pd.DataFrame:
    """Given a df and periods add moving averages of the close."""
    for period in periods:
        df[f"{period}MA"] = df["close"].rolling(period).mean()

    return df

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
    print("Retrieving historical price data")
    client = StockHistoricalDataClient(api_key=key, secret_key=secret)

    request_params = StockBarsRequest(
        symbol_or_symbols=symbols, timeframe=TimeFrame.Minute, start=start, end=end
    )

    bars = client.get_stock_bars(request_params)
    print("Successfully retrieved stock bars")
    return bars.df


def get_news(symbol, start, end):
    key = os.environ["ALPACA_KEY"]
    secret = os.environ["ALPACA_SECRET"]
    client = NewsClient(api_key=key, secret_key=secret)

    request_params = NewsRequest(symbols=symbol, start=start, end=end, limit=50)
    news = [x.model_dump() for x in client.get_news(request_params).news]
    return pd.DataFrame.from_records(news, columns=news[0].keys())

def get_full_news(symbol, start, end):
    count = 0
    key = os.environ["ALPACA_KEY"]
    secret = os.environ["ALPACA_SECRET"]
    print("Starting news retrieval")
    client = NewsClient(api_key=key, secret_key=secret)
    

    all_news = []
    current_end = end 

    while current_end >= start:
        print(f"count is {count}")
        count+=1

        request_params = NewsRequest(symbols=symbol, start=start, end=current_end, limit=50)
        response = client.get_news(request_params)


        if not response.news:
            break

        news = [x.model_dump() for x in response.news]
        all_news.extend(news)

        last_created_at = (news[-1].get('created_at')).replace(tzinfo=None)
        # if isinstance(last_created_at, datetime):
        #     last_created_at = last_created_at.isoformat()  # Convert datetime to ISO string
        # elif not isinstance(last_created_at, str):
        #     raise ValueError(f"Unexpected format for 'created_at' field: {last_created_at}")
        # Update the current end date to be one day before the earliest news article
        current_end = (last_created_at - timedelta(days=1))

    print("News retrieval complete")

    # Create and return a DataFrame from all collected news records
    return pd.DataFrame.from_records(all_news, columns=all_news[0].keys()) if all_news else pd.DataFrame()


def extract_text_from_response(response):
    response_dict = response.to_dict()
    try:
        candidates = response_dict.get('candidates', [])
        content = candidates[0].get('content', {}) if candidates else {}
        parts = content.get('parts', [])
        text = parts[0].get('text', '') if parts else ''
    except (IndexError, KeyError, TypeError) as e:
        print(f"Error extracting text: {e}")
        return None

    return text