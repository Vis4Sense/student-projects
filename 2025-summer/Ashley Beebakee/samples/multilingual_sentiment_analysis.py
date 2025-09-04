#------------------------------------------------------------#
# Name: Hugging Face BERT Multilingual Sentiment Analysis
# Description: This script uses a BERT model to perform
# sentiment analysis on multilingual text inputs. It supports
# various languages and provides a simple interface for users.
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 16/06/2025
# Python Version: 3.10.6
# Packages Required: deep-translator, transformers, matplotlib
#                    pandas
#------------------------------------------------------------#

# Import necessary libraries
from deep_translator import GoogleTranslator
from transformers import pipeline
import matplotlib.pyplot as plt
import pandas as pd

# Sentiment label to numeric score mapping
star_to_sentiment = {
    "1 star": -1.0,  # Very negative
    "2 stars": -0.5, # Negative
    "3 stars": 0.0,  # Neutral
    "4 stars": 0.5,  # Positive
    "5 stars": 1.0   # Very positive
}

# Crypto news headlines scraped using GPT-4o model
data = [
    # 🇬🇧 English (CoinDesk, Reuters, The Guardian)
    {"text": "Bitcoin's Rally to Record Highs Puts Focus on $115K Where an 'Invisible Hand' May Slow Bull Run", "lang": "en"},
    {"text": "Bitcoin Hits New $76K Record High, ETFs Post $620M Inflows", "lang": "en"},
    {"text": "Crypto funds' assets hit record high as investors hedge and diversify", "lang": "en"},
    {"text": "Bitcoin price tops $100,000 for first time as Trump win fuels crypto fever", "lang": "en"},
    {"text": "Bitcoin Spots ETFs Pull in $5.77B in May, Their Best Performance …", "lang": "en"},

    # 🇫🇷 French (Journal du Coin, Le Figaro, BFMTV, Cryptoast)
    {"text": "Bitcoin atteint les 100 000 $ : Jour historique pour le BTC et les cryptomonnaies !", "lang": "fr"},
    {"text": "Bitcoin le 21 novembre – Le BTC va‑t‑il toucher les 100 000 $ ?", "lang": "fr"},
    {"text": "Le bitcoin peut‑il atteindre les 100 000 dollars d'ici fin 2024 ?", "lang": "fr"},
    {"text": "Le bitcoin franchit pour la première fois la barre des 100 000 dollars", "lang": "fr"},
    {"text": "Le Bitcoin dépasse les 100 000 euros – Pourra‑t‑il s'arrêter un jour ?", "lang": "fr"},

    # 🇪🇸 Spanish (CriptoNoticias, Cointelegraph, Business Insider)
    {"text": "3 factores que llevarían a Ethereum a un nuevo máximo histórico", "lang": "es"},
    {"text": "Analistas predicen que Ethereum alcanzará máximos históricos en 2024", "lang": "es"},
    {"text": "Bitcoin alcanza los 100.000 dólares por primera vez en la historia", "lang": "es"},
    {"text": "Fiebre por las criptomonedas tras victoria de Trump impulsa precio de Bitcoin", "lang": "es"},
    {"text": "Fondos de criptomonedas baten récords mientras inversores buscan diversificación", "lang": "es"},

    # 🇨🇳 Chinese (Sina Finance, Jin10, Binance)
    {"text": "比特币突破10万美元创历史新高，市场情绪高涨", "lang": "zh"},
    {"text": "以太坊鲸鱼一个月内增持超150万个ETH，价格或将上涨", "lang": "zh"},
    {"text": "特朗普批准23亿美元比特币信托交易", "lang": "zh"},
    {"text": "Solana因DeFi项目激增而大涨，引发投资者关注", "lang": "zh"},
    {"text": "币安：2024年加密ETF资金流入创下新纪录", "lang": "zh"},

    # 🇩🇪 German (BTC-ECHO, Finanzen.net, Handelsblatt)
    {"text": "Bitcoin erreicht neuen Rekordwert von 100.000 Dollar – ETF-Zuflüsse beflügeln den Kurs", "lang": "de"},
    {"text": "Ethereum-Wale akkumulieren über 1,5 Millionen ETH – droht ein Preisanstieg?", "lang": "de"},
    {"text": "Donald Trump genehmigt 2,3-Milliarden-Dollar-Bitcoin-Trust", "lang": "de"},
    {"text": "Solana legt kräftig zu: DeFi-Projekte sorgen für Kursrallye", "lang": "de"},
    {"text": "Bitcoin-ETFs verzeichnen im Mai Rekordzuflüsse", "lang": "de"}
]

# Load sentiment model
sentiment_model = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")

# Create DataFrame
df = pd.DataFrame(data)

# Translate non-English headlines to English
df["translated"] = df["text"].apply(lambda x: GoogleTranslator(source='auto', target='en').translate(x))

# Run sentiment analysis on original and translated headlines
df["original_sentiment"] = df["text"].apply(lambda x: sentiment_model(x)[0])
df["original_score"] = df["original_sentiment"].apply(lambda x: star_to_sentiment.get(x["label"], 0.0))
df["translated_sentiment"] = df["translated"].apply(lambda x: sentiment_model(x)[0])
df["translated_score"] = df["translated_sentiment"].apply(lambda x: star_to_sentiment.get(x["label"], 0.0))

# Show comparison table
print("\nSentiment Comparison Table\n")
print(df[["lang", "text", "translated", "original_score", "translated_score"]])

# Compute standard deviation by language
std_by_lang = df.groupby("lang")[["original_score", "translated_score"]].std()
print("\nStandard Deviation of Sentiment Scores by Language\n")
print(std_by_lang)

# Plotting
fig, ax = plt.subplots(figsize=(10, 6))
bar_width = 0.35
index = range(len(std_by_lang.index))

ax.bar(index, std_by_lang["original_score"], bar_width, label='Original', alpha=0.7)
ax.bar([i + bar_width for i in index], std_by_lang["translated_score"], bar_width, label='Translated', alpha=0.7)

ax.set_xlabel('Language')
ax.set_ylabel('Standard Deviation of Sentiment Scores')
ax.set_title('Sentiment Score Variability by Language')
ax.set_xticks([i + bar_width / 2 for i in index])
ax.set_xticklabels(std_by_lang.index)
ax.legend()

plt.tight_layout()
plt.grid(True)
plt.show()

# Higher std -> diverse sentiment (strong positive/negative variation)
# Lower std -> uniform sentiment (neutral or similar across languages)

