import os
import numpy as np
import pandas as pd

from datetime import datetime
from dotenv import load_dotenv

from utils import add_moving_averages, map_news_to_stock_bars, get_stock_bars, get_full_news, extract_text_from_response


import google.generativeai as genai
from tqdm import tqdm

load_dotenv()

genai.configure(api_key=os.environ["GEMINI_KEY"])
# model = genai.GenerativeModel("gemini-1.5-flash")
model = genai.GenerativeModel("gemini-1.5-pro")
chat = model.start_chat()

def analyze_sentiment_of_article(article, ticker):
    
    chat = model.start_chat()
    response = chat.send_message(f"You are a expert on analyzing market sentiment across US tech stocks. I will give you a python list of sentences in a report given by {ticker}. Please go through the list and return respond with only a new list where each element is either positive, negative or neutral in sentiment and only those options. This should be judged based on whether a sentence has implications toward market sentiment and potential price movement in the stock. Each element will map to the list I provided and remember to only reply with a list. Here are the sentences : {article}")
    response_text = extract_text_from_response(response)
    return response_text


def analyze_embedding(new_embedding):
    chat = model.start_chat()
    response = chat.send_message(f"You are a expert on analyzing market sentiment across US tech stocks. I have an embedding for you of a sentence from a news article and I want you to judge whether it is either positive or negative in sentiment and only those options. This should be judged based on whether a embedding has implications toward market sentiment and potential price movement in the stock. If the embedding has any indication of positive or negative sentiment please respond with that. Please reply with just positive or negative: {new_embedding}")
    response_text = extract_text_from_response(response)
    # print(response_text)
    return response_text

def get_sentiment_signal(row):

    new_embedding = row["embedding"]

    if isinstance(new_embedding, list) or isinstance(new_embedding, np.ndarray):
        if len(new_embedding) == 0 or np.isnan(new_embedding).any():
            return "hold"
    elif pd.isnull(new_embedding):
        return "hold"

    sentiment = analyze_embedding(row).strip().lower()
    print(f"this is sentiment :{sentiment} and {sentiment=="positive"}")

    if sentiment == "positive":
        print("we bought")
        return "buy_embed"
    elif sentiment == "negative":
        print("we sold")
        return "sell_embed"
    
    return "hold"




def gen_embedding_signals(df):
    # df.loc[:, "signal"] = "hold"

    for index,row in df.iterrows():
        # Get previous signal
        # Get the 5 minute window
        # window = df.iloc[i : i + 20]
        # # Get the 5 minute moving average
        # window["10MA"].mean()
        # # Get the 80 minute moving average
        # window["80MA"].mean()

        signal = get_sentiment_signal(row)
        # print(f"signal: {signal}")

        df.at[index, "signal"] = signal
        # if ma5 > ma80 and previous_signal != "buy_embed":
        #     df.at[window.index[0], "signal"] = "buy_embed"
        # elif ma5 < ma80 and previous_signal != "sell_embed":
        #     df.at[window.index[0], "signal"] = "sell_embed"

    return df

def generate_embeddings(df):
    df["embedding"] = None
    for index,row in tqdm(df.iterrows(), total=len(df), desc="Generating New Embeddings"):
        # row["sentiment"] = score_sentiment(ast.literal_eval(analyze_sentiment_of_article(tokenize_article(row["headline"]),"NVDA")))
        response = genai.embed_content(model="models/text-embedding-004", content=row["headline"])
        df.at[index, "embedding"] = response["embedding"]

    print("we are done!!!")
    print(df.head())
    return df

def pure_embedding_strat():
    start = datetime(2024, 10, 28)
    end = datetime(2024, 10, 30)
    df = get_stock_bars(["NVDA"], start, end)
    df_news = get_full_news("NVDA", start, end)
    df_news = generate_embeddings(df_news)
    # df_news = pd.read_csv("news_data.csv")


    # this will change to use embeddings
    # df_news = analyse_sentiment(df_news)
    # df_news.to_csv("news_data.csv",index=False)

    nvda = df[df.index.get_level_values("symbol") == "NVDA"]
    nvda = add_moving_averages(nvda, [10, 80])
    nvda = map_news_to_stock_bars(df_news, nvda)
    nvda = gen_embedding_signals(nvda)


    nvda.to_csv("all-data-output/signals_pure_embedding_strat.csv",index=False)

    return nvda