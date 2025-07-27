#------------------------------------------------------------#
# Name: Historical Data Module
# Description: This script fetches and processes historical
#              cryptocurrency data from various sources like
#              Alpaca and Yahoo Finance.
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 20/07/2025
# Python Version: 3.10.6
# Packages Required: yfinance, pandas, scikit-learn
#------------------------------------------------------------#

# import necessary libraries
import yfinance as yf
import pandas as pd
from sklearn.preprocessing import MinMaxScaler, StandardScaler

def fetch_price_data(ticker="BTC-USD", start_date="2023-01-01", end_date="2024-01-01", interval="1d"):
    df = yf.download(ticker, start=start_date, end=end_date, interval=interval, progress=False)

    # Basic cleaning
    df = df.dropna()
    df.reset_index(inplace=True)

    return df

def preprocess_data(df, scaler_type="minmax", columns=["Close"]):
    df_copy = df.copy()

    if scaler_type == "minmax":
        scaler = MinMaxScaler()
    elif scaler_type == "standard":
        scaler = StandardScaler()
    else:
        raise ValueError("scaler_type must be 'minmax' or 'standard'.")

    df_copy[columns] = scaler.fit_transform(df_copy[columns])

    return df_copy, scaler

# Fetch BTC data for a custom date range i.e. 1st January 2025 to 30th June 2025
df = fetch_price_data(ticker="BTC-USD", start_date="2025-01-01", end_date="2025-07-01", interval="1d")

# Preprocess Close price
df_scaled, scaler = preprocess_data(df, scaler_type="minmax", columns=["Close"])

print(df_scaled.head())

# Print full dataset
#pd.set_option('display.max_rows', None)  # Show all rows
#print(df_scaled)

# Save the scaled dataset to CSV in the historical folder
#csv_path = "./data/btc_dataset_6m-1d.csv"
#df_scaled.to_csv(csv_path, index=False)
#print(f"Saved scaled dataset to {csv_path}")