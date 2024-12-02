import os
import numpy as np
import pandas as pd

from datetime import datetime
from dotenv import load_dotenv
from sklearn.metrics.pairwise import cosine_similarity
from utils import add_moving_averages, map_news_to_stock_bars, get_stock_bars, get_full_news, extract_text_from_response


import google.generativeai as genai
from tqdm import tqdm

load_dotenv()

genai.configure(api_key=os.environ["GEMINI_KEY"])
model = genai.GenerativeModel("gemini-1.5-flash")
# model_pro = genai.GenerativeModel("gemini-1.5-pro")
chat = model.start_chat()


def analyze_sentiment_of_article(article, ticker):
    
    chat = model.start_chat()
    response = chat.send_message(f"You are a expert on analyzing market sentiment across US tech stocks. I will give you a python list of sentences in a report given by {ticker}. Please go through the list and return respond with only a new list where each element is either positive, negative or neutral in sentiment and only those options. This should be judged based on whether a sentence has implications toward market sentiment and potential price movement in the stock. Each element will map to the list I provided and remember to only reply with a list. Here are the sentences : {article}")
    response_text = extract_text_from_response(response)
    return response_text



def gen_embedding_signals(df, positive_embeddings, negative_embeddings, tolerance=0.3):
    df.loc[:, "signal"] = "hold"

    for i in tqdm(range(0, len(df), 20),total=20,desc= "Generating Signals"):
        # Get previous signal
        df.iloc[i - 1]["signal"] if i > 0 else "hold"


        # Get the 5 minute window
        window = df.iloc[i : i + 20]
        # Get the 5 minute moving average
        window["10MA"].mean()
        # Get the 80 minute moving average
        window["80MA"].mean()

        for index, row in window.iterrows():
            signal = cosine_similarity_signal(row, positive_embeddings, negative_embeddings, tolerance)
            
            df.at[index, "signal"] = signal
            if signal == "buy_embed":
                positive_embeddings.append(row["embedding"])

            elif signal == "sell_embed":
                negative_embeddings.append(row["embedding"])
        
        # if ma5 > ma80 and previous_signal != "buy_embed":
        #     df.at[window.index[0], "signal"] = "buy_embed"
        # elif ma5 < ma80 and previous_signal != "sell_embed":
        #     df.at[window.index[0], "signal"] = "sell_embed"

    return df


def cosine_similarity_signal(row, pos_embeddings, neg_embeddings, threshold=0.3):
    new_embedding = row["embedding"]

    if isinstance(new_embedding, list) or isinstance(new_embedding, np.ndarray):
        if len(new_embedding) == 0 or np.isnan(new_embedding).any():
            return "hold"
    elif pd.isnull(new_embedding):
        return "hold"
    pos_similarity = cosine_similarity([new_embedding], pos_embeddings).mean()
    neg_similarity = cosine_similarity([new_embedding], neg_embeddings).mean()

    # print(f"pos: {pos_similarity}, neg: {neg_similarity}")
    
    if pos_similarity > threshold and pos_similarity > neg_similarity:
        return "buy_embed"
    elif neg_similarity > threshold and pos_similarity < neg_similarity:
        return "sell_embed"
    return "hold"

def load_embeddings_data(path):
    with open(path, 'r') as file:
        lines = file.readlines()

    array = []
    for line in tqdm(lines, total=len(lines), desc="Loading Embedding Training Data"):
        row = [float(num) for num in line.strip().split()]
        array.append(row)

    return array

def generate_embeddings(df):
    df["embedding"] = None
    for index,row in tqdm(df.iterrows(), total=len(df), desc="Generating New Embeddings"):
        # row["sentiment"] = score_sentiment(ast.literal_eval(analyze_sentiment_of_article(tokenize_article(row["headline"]),"NVDA")))
        response = genai.embed_content(model="models/text-embedding-004", content=row["headline"])
        df.at[index, "embedding"] = response["embedding"]

    print("we are done!!!")
    print(df.head())
    return df

def embedding_strat(tolerance):
    p = load_embeddings_data("all-data-output/positive_embeddings.txt")
    n = load_embeddings_data("all-data-output/negative_embeddings.txt")

    df = get_stock_bars(["NVDA"], datetime(2024, 10, 28), datetime(2024, 10, 30))
    df_news = get_full_news("NVDA", datetime(2024, 10, 28), datetime(2024, 10, 30))
    df_news = generate_embeddings(df_news)
    # df_news = pd.read_csv("news_data.csv")


    # this will change to use embeddings
    # df_news = analyse_sentiment(df_news)
    # df_news.to_csv("news_data.csv",index=False)

    nvda = df[df.index.get_level_values("symbol") == "NVDA"]
    nvda = add_moving_averages(nvda, [10, 80])
    nvda = map_news_to_stock_bars(df_news, nvda)
    nvda = gen_embedding_signals(nvda, p, n, tolerance)


    nvda.to_csv("all-data-output/signals_embedding_strat.csv",index=False)

    return nvda