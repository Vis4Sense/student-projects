#------------------------------------------------------------#
# Name: Dataloader Module
# Description: This script defines data loading and preprocessing
#              routines for time series data fused with sentiment
#              and technical indicators to predict future price
#              movements.
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 07/08/2025
# Python Version: 3.10.6
# Packages Required: N/A
#------------------------------------------------------------#

# Import necessary libraries
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from torch.utils.data import TensorDataset, DataLoader
import torch

def load_and_prepare_data(csv_path, sequence_length=30, target_column='Close', scaler_type="minmax", batch_size=32):
    """
    Loads and prepares time series + sentiment dataset for training.
    
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
    df = df.dropna()
    df = df.reset_index(drop=True)

    features = df.drop(columns=["Date", target_column]).values
    targets = df[target_column].values

    # Normalize features
    scaler = MinMaxScaler() if scaler_type == "minmax" else StandardScaler()
    features = scaler.fit_transform(features)

    # Windowing
    X, y = [], []
    for i in range(len(df) - sequence_length):
        X.append(features[i:i+sequence_length])
        y.append(targets[i+sequence_length])  # predict next-step close

    X = np.array(X)
    y = np.array(y)

    # Split: 70% train, 15% val, 15% test
    n = len(X)
    train_end = int(n * 0.7)
    val_end = int(n * 0.85)

    X_train, y_train = X[:train_end], y[:train_end]
    X_val, y_val = X[train_end:val_end], y[train_end:val_end]
    X_test, y_test = X[val_end:], y[val_end:]

    # Convert to tensors
    train_loader = DataLoader(TensorDataset(torch.tensor(X_train), torch.tensor(y_train)), batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(TensorDataset(torch.tensor(X_val), torch.tensor(y_val)), batch_size=batch_size)
    test_loader = DataLoader(TensorDataset(torch.tensor(X_test), torch.tensor(y_test)), batch_size=batch_size)

    input_size = X.shape[2]  # number of features

    return train_loader, val_loader, test_loader, input_size
