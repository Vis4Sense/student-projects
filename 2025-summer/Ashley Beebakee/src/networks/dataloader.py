#------------------------------------------------------------#
# Name: Dataloader Module
# Description: This script defines data loading and preprocessing
#              routines for time series data fused with sentiment
#              and technical indicators to predict future price
#              movements.
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 11/08/2025
# Python Version: 3.10.6
# Packages Required: N/A
#------------------------------------------------------------#

# Import necessary libraries
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from torch.utils.data import TensorDataset, DataLoader
import torch

# Function to coerce all columns to numeric, excluding specified ones
# N.B: 'coerce' means "obtain/set"
def coerce_numeric_columns(df: pd.DataFrame, exclude: set[str] | None = None) -> pd.DataFrame:
    exclude = exclude or set()
    for c in df.columns:
        if c in exclude:
            continue
        if df[c].dtype == object:
            # Remove common non-numeric characters then coerce
            df[c] = (
                df[c].astype(str)
                    .str.replace(",", "", regex=False)
                    .str.replace(" ", "", regex=False)
                    .str.replace("%", "", regex=False)
            )
        df[c] = pd.to_numeric(df[c], errors="coerce")
    return df

def load_and_prepare_data(csv_path, sequence_length=30, target_column='Close', scaler_type="minmax", batch_size=32):
    """
    Loads and prepares time series + sentiment dataset for training.
    Ensures all features/target are numeric float32.

    Args:
        csv_path (str): Path to the model-ready CSV file.
        sequence_length (int): Length of historical sequence.
        target_column (str): Column to predict.
        scaler_type (str): 'minmax' or 'standard'
        batch_size (int): Batch size for DataLoaders.
    
    Returns:
        train_loader, val_loader, test_loader, input_size
    """
    df = pd.read_csv(csv_path)

    # Detect date-like columns to exclude from numeric coercion/feature set
    date_cols = [c for c in df.columns if c.lower() in ("date", "datetime", "timestamp")]

    # Coerce all non-date columns to numeric (invalid -> NaN)
    df = coerce_numeric_columns(df, exclude=set(date_cols))

    # Ensure target exists and is numeric
    if target_column not in df.columns:
        raise ValueError(f"Target column '{target_column}' not found in CSV.")
    if not np.issubdtype(df[target_column].dtype, np.number):
        df[target_column] = pd.to_numeric(df[target_column], errors="coerce")

    # Keep only numeric feature columns (exclude target)
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    feature_cols = [c for c in numeric_cols if c != target_column]
    if not feature_cols:
        raise ValueError("No numeric feature columns found after cleaning.")

    # Drop rows with NaNs in features/target and reset index
    df = df.dropna(subset=feature_cols + [target_column]).reset_index(drop=True)

    # Build arrays in float32
    features = df[feature_cols].to_numpy(dtype=np.float32)
    targets = df[target_column].to_numpy(dtype=np.float32)

    # Scale features
    scaler = MinMaxScaler() if scaler_type == "minmax" else StandardScaler()
    features = scaler.fit_transform(features).astype(np.float32)

    # Windowing
    X, y = [], []
    L = int(sequence_length)
    if len(df) <= L:
        raise ValueError(f"Not enough rows ({len(df)}) for sequence_length={L}.")
    for i in range(len(df) - L):
        X.append(features[i:i+L])
        y.append(targets[i+L])  # next-step target
    X = np.asarray(X, dtype=np.float32)
    y = np.asarray(y, dtype=np.float32)

    # Split: 70% train, 15% val, 15% test
    n = len(X)
    train_end = int(n * 0.7)
    val_end = int(n * 0.85)

    X_train, y_train = X[:train_end], y[:train_end]
    X_val, y_val     = X[train_end:val_end], y[train_end:val_end]
    X_test, y_test   = X[val_end:], y[val_end:]

    # Convert to tensors (float32 preserved)
    train_loader = DataLoader(TensorDataset(torch.from_numpy(X_train), torch.from_numpy(y_train)), batch_size=batch_size, shuffle=True)
    val_loader   = DataLoader(TensorDataset(torch.from_numpy(X_val),   torch.from_numpy(y_val)),   batch_size=batch_size)
    test_loader  = DataLoader(TensorDataset(torch.from_numpy(X_test),  torch.from_numpy(y_test)),  batch_size=batch_size)

    input_size = X.shape[2]
    return train_loader, val_loader, test_loader, input_size
