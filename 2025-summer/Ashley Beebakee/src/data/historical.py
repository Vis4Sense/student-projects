#------------------------------------------------------------#
# Name: Historical Data Module
# Description: This script fetches and processes historical
#              cryptocurrency data from Yahoo Finance.
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 06/08/2025
# Python Version: 3.10.6
# Packages Required: yfinance, pandas, scikit-learn
#------------------------------------------------------------#

# import necessary libraries
import yfinance as yf
import pandas as pd
from sklearn.preprocessing import MinMaxScaler, StandardScaler

# Function to fetch historical price data from Yahoo Finance
def fetch_price_data(ticker="BTC-USD", start_date="2025-01-01", end_date="2025-07-01", interval="1d"):
    df = yf.download(ticker, start=start_date, end=end_date, interval=interval, progress=False)

    # Drop rows with any 'NaN' values
    df = df.dropna()

    # Reset index to have a clean Pandas DataFrame
    df.reset_index(inplace=True)

    return df

# Function to preprocess the data through scaling
def preprocess_data(df, scaler_type="minmax", columns=["Close"]):
    # Create a copy of the DataFrame to avoid modifying the original
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

# You can choose these intervals: 
# 1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo