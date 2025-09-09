#------------------------------------------------------------#
# Name: Dataloader Module
# Description: This script defines data loading and preprocessing
#              routines for time series data fused with sentiment
#              and technical indicators to predict future price
#              movements.
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 09/09/2025
# Python Version: 3.10.6
# Packages Required: scikit-learn, torch, pandas, numpy
#------------------------------------------------------------#

# Import necessary libraries
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from torch.utils.data import TensorDataset, DataLoader
import pandas as pd
import numpy as np
import torch

# Function to coerce all columns to numeric, excluding specified ones
# N.B: 'coerce' means "obtain/set"
def coerce_numeric_columns(df: pd.DataFrame, exclude: set[str] | None = None):
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

# N.B: '*,' implies that all subsequent parameters must be passed by keyword AND not position
def load_and_prepare_data(
    csv_path,
    sequence_length: int = 30,
    target_column: str = 'Close',
    scaler_type: str = "minmax",
    batch_size: int = 32,
    *,
    target_mode: str = "price",
    target_scaler_type: str | None = None,
    # Early-fusion (optional)
    early_fusion: bool = False,
    merged_path: str | None = None,
    fusion_asset: str | None = None,
    fusion_sentiment_col: str | None = None
):
    df = pd.read_csv(csv_path)

    # Detect date-like columns to exclude from numeric coercion/feature set
    date_cols = [c for c in df.columns if c.lower() in ("date", "datetime", "timestamp")]

    # Coerce all non-date columns to numeric (invalid -> NaN)
    df = coerce_numeric_columns(df, exclude=set(date_cols))

    # Early-fusion of daily sentiment features from merged_crypto_dataset.xlsx
    if early_fusion and merged_path and isinstance(merged_path, str) and len(merged_path) > 0:
        try:
            df_sent = pd.read_excel(merged_path)
            # Filter by asset if provided
            if fusion_asset and "Asset" in df_sent.columns:
                df_sent = df_sent[df_sent["Asset"] == fusion_asset].copy()
            # Build date with removed time zone
            if "Timestamp" in df_sent.columns:
                df_sent["Timestamp"] = pd.to_datetime(df_sent["Timestamp"], errors="coerce")
                df_sent = df_sent.dropna(subset=["Timestamp"])  # keep valid times
                df_sent["date"] = df_sent["Timestamp"].dt.floor("D")
            else:
                # If there is no 'Timestamp' column, create empty df_sent to skip fusion
                df_sent = pd.DataFrame(columns=["date"])

            # Select sentiment columns
            sent_cols = [c for c in df_sent.columns if str(c).lower().startswith("sentiment_")]
            if fusion_sentiment_col and fusion_sentiment_col in df_sent.columns:
                sent_cols = [fusion_sentiment_col]

            # Aggregate daily mean for sentiments; also count posts per day
            if sent_cols:
                agg = df_sent.groupby("date")[sent_cols].mean().add_prefix("S_")
                counts = df_sent.groupby("date").size().to_frame("S_count")
                df_day = agg.join(counts, how="outer").reset_index()
            else:
                df_day = df_sent.groupby("date").size().to_frame("S_count").reset_index()

            # Prepare price frame date for join
            join_date = None
            for dc in ("Date", "Datetime", "Timestamp"):
                if dc in df.columns:
                    try:
                        df[dc] = pd.to_datetime(df[dc], errors="coerce")
                        join_date = dc
                        break
                    except Exception:
                        continue
            if join_date is not None:
                df["date"] = df[join_date].dt.floor("D")
                # Left-join and fill NaNs
                df = df.merge(df_day, on="date", how="left")
                for c in [c for c in df.columns if c.startswith("S_") or c == "S_count"]:
                    df[c] = pd.to_numeric(df[c], errors="coerce").fillna(0.0)
            # If we created a helper 'date' column for join, keep but exclude later from numeric feature list
        except Exception:
            # Fail silently to keep baseline working if Excel missing or malformed
            pass

    # Ensure source target column exists and is numeric (i.e., 'Close')
    if target_column not in df.columns:
        raise ValueError(f"Target column '{target_column}' not found in CSV.")
    if not np.issubdtype(df[target_column].dtype, np.number):
        df[target_column] = pd.to_numeric(df[target_column], errors="coerce")

    # For 'log_return', create a new label column and drop its NaNs
    if target_mode.lower() == "log_return":
        df['RETURN_1D'] = np.log(df[target_column] / df[target_column].shift(1))
        label_col = 'RETURN_1D'
    elif target_mode.lower() == "price":
        label_col = target_column
    else:
        raise ValueError("Target_mode must be 'price' or 'log_return'.")

    # Keep only numeric feature columns
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    feature_cols = numeric_cols.copy()

    # Exclude label column from features
    feature_cols = [c for c in feature_cols if c != label_col]
    if not feature_cols:
        raise ValueError("No numeric feature columns found after cleaning.")

    # Drop rows with NaNs in features/label and reset index
    df = df.dropna(subset=feature_cols + [label_col]).reset_index(drop=True)

    # Build arrays in float32 (no scaling yet, to split first to avoid leakage)
    features = df[feature_cols].to_numpy(dtype=np.float32)
    targets = df[label_col].to_numpy(dtype=np.float32)

    # Sequence Length (Windowing)
    X, y = [], []
    L = int(sequence_length)
    if len(df) <= L:
        raise ValueError(f"Not enough rows ({len(df)}) for sequence_length={L}.")
    for i in range(len(df) - L):
        X.append(features[i:i+L])
        y.append(targets[i+L])  # predict next step after the window
    X = np.asarray(X, dtype=np.float32)
    y = np.asarray(y, dtype=np.float32)

    # Split samples: 70% train, 15% val, 15% test (time-ordered, without shuffle)
    n = len(X)
    train_end = int(n * 0.7)
    val_end = int(n * 0.85)

    X_train, y_train = X[:train_end], y[:train_end]
    X_val, y_val     = X[train_end:val_end], y[train_end:val_end]
    X_test, y_test   = X[val_end:], y[val_end:]

    # Fit 'Feature Scaler' on TRAIN ONLY to avoid leakage
    feat_scaler = MinMaxScaler() if scaler_type == "minmax" else StandardScaler()
    X_train_2d = X_train.reshape(-1, X_train.shape[2]) # (n_train * L, F)
    feat_scaler.fit(X_train_2d)

    def transform_windows(Xw: np.ndarray) -> np.ndarray:
        X2d = Xw.reshape(-1, Xw.shape[2])
        X2d = feat_scaler.transform(X2d).astype(np.float32)
        return X2d.reshape(Xw.shape)

    X_train = transform_windows(X_train)
    X_val   = transform_windows(X_val)
    X_test  = transform_windows(X_test)

    # Optionality for 'Target Scaler' on TRAIN ONLY
    y_scaler = None
    if target_scaler_type:
        y_scaler = MinMaxScaler() if target_scaler_type == "minmax" else StandardScaler()
        y_train_2d = y_train.reshape(-1, 1)
        y_scaler.fit(y_train_2d)
        y_train = y_scaler.transform(y_train_2d).astype(np.float32).ravel()
        y_val   = y_scaler.transform(y_val.reshape(-1, 1)).astype(np.float32).ravel()
        y_test  = y_scaler.transform(y_test.reshape(-1, 1)).astype(np.float32).ravel()

    # Convert to 'Tensors' (float32 preserved)
    train_loader = DataLoader(TensorDataset(torch.from_numpy(X_train), torch.from_numpy(y_train)), batch_size=batch_size, shuffle=True)
    val_loader   = DataLoader(TensorDataset(torch.from_numpy(X_val),   torch.from_numpy(y_val)),   batch_size=batch_size)
    test_loader  = DataLoader(TensorDataset(torch.from_numpy(X_test),  torch.from_numpy(y_test)),  batch_size=batch_size)

    input_size = X.shape[2]

    # Return scalers to inverse-transform later (optional)
    return train_loader, val_loader, test_loader, input_size, {
        "feature_scaler": feat_scaler,
        "target_scaler": y_scaler,
        "feature_cols": feature_cols,
        "label_col": label_col,
        "sequence_length": L,
        "target_mode": target_mode,
    }
