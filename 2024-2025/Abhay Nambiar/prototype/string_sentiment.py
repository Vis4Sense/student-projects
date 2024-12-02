import os
import pandas as pd

from datetime import datetime
import time
from dotenv import load_dotenv

from utils import add_moving_averages, map_news_to_stock_bars, get_stock_bars, get_full_news, extract_text_from_response


import google.generativeai as genai
from tqdm import tqdm

load_dotenv()

genai.configure(api_key=os.environ["GEMINI_KEY"])
model = genai.GenerativeModel("gemini-1.5-pro")
chat = model.start_chat()

def analyze_sentiment_zero_to_one(article,ticker,retry=3):
    response = chat.send_message(f"""You are a expert on analyzing market sentiment across US tech stocks. Here I will provide you with
                              headlines, please just respond with a sentiment score between -1 and 1 with positive indicating a
                              positive sentiment for NVDA. Negative means that the sentiment is bad and indicates a potential
                              downward movement in price. Please respond with just the value be tween -1 and 1 and nothing else.
                              I will now provide you with the various headlines. Please just give one value response between -1 and 1.what is the sentiment of this headline: {article}""")
    
    return extract_text_from_response(response)

            # except:
            #     pass

def score_sentiment(sentiment_scores):
    n = sentiment_scores.count("neutral")
    p = sentiment_scores.count("positive")
    ne = sentiment_scores.count("negative")

    total = n + p + ne

    if total == 0:
        print("Had an error, we have 0")
        return 0

    return (p - ne )/ total


def tokenize_article(article):
    if not article:
        return []
    
    return [string.strip() for string in article.split('.')]    



def analyse_sentiment(df):
    df["sentiment"] = None
    print("Analyzing sentiment")
    # waiting_tasks = []  
    
    for index,row in tqdm(df.iterrows(), total=len(df), desc="Sentiment Analysis"):
        # row["sentiment"] = score_sentiment(ast.literal_eval(analyze_sentiment_of_article(tokenize_article(row["headline"]),"NVDA")))
        score = analyze_sentiment_zero_to_one(row["headline"],"NVDA")
        df.at[index, "sentiment"] = float(score)
        
    print("Sentiment analysis complete")
    return df


def add_trading_signals(df):
    df.loc[:, "signal"] = "hold"

    for i in range(0, len(df), 20):
        # Get previous signal
        previous_signal = df.iloc[i - 1]["signal"]

        # Get the 5 minute window
        window = df.iloc[i : i + 20]
        # Get the 5 minute moving average
        ma5 = window["10MA"].mean()
        # Get the 80 minute moving average
        ma80 = window["80MA"].mean()

        # Get a list of all sentiments in the window
        sentiments = [x for x in window["sentiment"].tolist() if type(x) is float]
        # Get the most common sentiment in the window
        sentiment = None
        if sentiments:
            sentiment = max(set(sentiments), key=sentiments.count)

        if ma5 > ma80 and sentiment > 0 and previous_signal != "buy":
            df.at[window.index[0], "signal"] = "buy"
            previous_signal = "buy"  # Update the previous signal to "buy"
            print(f"we have a buy with sentiment {sentiment}")
        elif ma5 < ma80 and sentiment < 0 and previous_signal != "sell":
            df.at[window.index[0], "signal"] = "sell"
            previous_signal = "sell"  # Update the previous signal to "sell"
            print(f"we have a sell with sentiment {sentiment}")
        elif sentiment == 0:
            print("neutral sentiment broski")



    return df

def standard_sentiment_strategy():
    df = get_stock_bars(["NVDA"], datetime(2024, 10, 28), datetime(2024, 10, 30))
    df_news = get_full_news("NVDA", datetime(2024, 10, 28), datetime(2024, 10, 30))

    df_news = analyse_sentiment(df_news)
    # df_news.to_csv("news_data.csv",index=False)

    nvda = df[df.index.get_level_values("symbol") == "NVDA"]
    nvda = add_moving_averages(nvda, [10, 80])
    nvda = map_news_to_stock_bars(df_news, nvda)
    nvda = add_trading_signals(nvda)

    nvda.to_csv("all-data-output/signals_standard_strat.csv",index=True)
    time.sleep(1)
    nvda = pd.read_csv("all-data-output/signals_standard_strat.csv")
    nvda = add_trading_signals(nvda)
    nvda.to_csv("all-data-output/signals_standard_strat.csv",index=False)


    return nvda