import ast
from enum import Enum
import os
from dotenv import load_dotenv
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from alpaca_trade_api.rest import REST
import csv
from datetime import datetime
import PyPDF2
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.environ["GEMINI_KEY"])
api = REST(os.environ["ALPACA_KEY"],os.environ["ALPACA_SECRET"])
api.get_news()
model = genai.GenerativeModel("gemini-1.5-flash")
model_pro = genai.GenerativeModel("gemini-1.5-pro")

# class Sentiment(Enum):
#     POSITIVE = 1
#     NEGATIVE = -1
#     NEUTRAL = 0

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

def test():
    chat = model.start_chat()
    response = chat.send_message("hello there, is this sentence positive or negative: 'Today is a very good day'")
    print(extract_text_from_response(response))


def analyze_sentiment(article, ticker):
    
    chat = model.start_chat()
    response = chat.send_message(f"You are a expert on analyzing market sentiment across US tech stocks. I will give you a python list of sentences in a report given by {ticker}. Please go through the list and return respond with only a new list where each element is either positive, negative or neutral in sentiment and only those options. This should be judged based on whether a sentence has implications toward market sentiment and potential price movement in the stock. Each element will map to the list I provided and remember to only reply with a list. Here are the sentences : {article}")
    return extract_text_from_response(response)
        
def analyze_sentiment_zero_to_one(article,ticker):
    chat = model.start_chat()
    response = chat.send_message(f"You are a expert on analyzing market sentiment across US tech stocks. Here I will provide you with an article, please just respond with a sentiment score between -1 and 1 with positive indicating a positive sentiment for the ticker {ticker}. Negative means that the sentiment is bad and indicates a potential downward movement in price. Please respond with just the value between -1 and 1 and nothing else. Here is the article: {article}")
    return extract_text_from_response(response)

def score_sentiment(sentiment_scores):
    n = sentiment_scores.count("neutral")
    p = sentiment_scores.count("positive")
    ne = sentiment_scores.count("negative")

    total = n + p + ne

    print(f"Values were as follows: \n Positive: {p}\n Negative: {ne}\n Neutral: {n}")

    return (p - ne )/ total


def tokenize_article(article):
    if not article:
        return []
    
    return [string.strip() for string in article.split('.')]

def vader_benchmark(article):
    analyzer = SentimentIntensityAnalyzer()
    n = 0
    p = 0
    ne = 0
    for sentence in article:
        vs = analyzer.polarity_scores(sentence)
        compound_score = vs['compound']
        
        if compound_score >= 0.05:
            p += 1
        elif compound_score <= -0.05:
            ne += 1
        else:
            n += 1
    
    total = n + p + ne

    return (p - ne) / total

def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as pdf_file:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        extracted_text = ""
        for page in pdf_reader.pages:
            text = page.extract_text()
            if text:
                extracted_text += text
        return extracted_text
    


files = ["sec-filings/FinancialStatement", "sec-filings/EarningsReport"]
# ,"sec-filings/2023AnnualReport"]

csv_file = "sentiment_scores.csv"

header = ["File", "Timestamp", "All-in-One Score", "Vader Score", "Gemini Score"]

try:
    with open(csv_file, "x", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(header)
except FileExistsError:
    pass

for file in files:
    text = extract_text_from_pdf(f"{file}.pdf")
    scores = analyze_sentiment(tokenize_article(text), "NVDA")
    all_in_one_score = analyze_sentiment_zero_to_one(text, "NVDA")
    vader_score = vader_benchmark(scores)
    gemini_score = score_sentiment(ast.literal_eval(scores))

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(csv_file, "a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([file, timestamp, all_in_one_score, vader_score, gemini_score])

    print(f"File {file}.pdf processed and scores saved to {csv_file}")
