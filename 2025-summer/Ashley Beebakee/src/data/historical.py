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

# Function to fetch historical price data from Yahoo Finance
def fetch_price_data(ticker="BTC-USD", start_date="2023-01-01", end_date="2024-01-01", interval="1d"):
    df = yf.download(ticker, start=start_date, end=end_date, interval=interval, progress=False)

    # Basic cleaning
    df = df.dropna()
    # Reset index to have a clean DataFrame
    df.reset_index(inplace=True)

    return df

# Function to preprocess the data
def preprocess_data(df, scaler_type="minmax", columns=["Close"]):
    df_copy = df.copy()

    # Ensure the specified columns exist in the DataFrame
    if scaler_type == "minmax":
        # Initialize MinMaxScaler to scale the data between 0 and 1
        scaler = MinMaxScaler()
    elif scaler_type == "standard":
        # Initialize StandardScaler to standardize the data (mean=0, std=1)
        scaler = StandardScaler()
    else:
        raise ValueError("scaler_type must be 'minmax' or 'standard'.")

    # Scale the specified columns
    df_copy[columns] = scaler.fit_transform(df_copy[columns])

    return df_copy, scaler

# Fetch BTC data for a custom date range i.e. 1st January 2025 to 30th June 2025
df = fetch_price_data(ticker="BTC-USD", start_date="2025-01-01", end_date="2025-07-01", interval="1d")
# You can choose these intervals: 1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo

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