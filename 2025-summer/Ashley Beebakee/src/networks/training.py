#------------------------------------------------------------#
# Name: Training Module
# Description: This script defines training routines for deep 
#              learning models for time series data fused with 
#              sentiment and technical indicators to predict 
#              future price movements.
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 07/08/2025
# Python Version: 3.10.6
# Packages Required: N/A
#------------------------------------------------------------#

# Import necessary libraries
from sklearn.metrics import mean_squared_error, r2_score
import torch.optim as optim
import torch.nn as nn
import numpy as np
import torch

# Define training function
def train_model(model, train_loader, val_loader, num_epochs=20, learning_rate=0.001):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model.to(device)

    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)

    history = {"train_loss": [], "val_loss": []}

    for epoch in range(num_epochs):
        model.train()
        train_losses = []

        for X_batch, y_batch in train_loader:
            X_batch = X_batch.to(device).float()
            y_batch = y_batch.to(device).float()

            optimizer.zero_grad()
            outputs = model(X_batch).squeeze()
            loss = criterion(outputs, y_batch)
            loss.backward()
            optimizer.step()

            train_losses.append(loss.item())

        avg_train_loss = np.mean(train_losses)

        val_loss = evaluate_model(model, val_loader, criterion, device)

        history["train_loss"].append(avg_train_loss)
        history["val_loss"].append(val_loss)

        print(f"Epoch {epoch+1}/{num_epochs} - Train Loss: {avg_train_loss:.4f} - Val Loss: {val_loss:.4f}")

    return model, history

# Define evaluation function
def evaluate_model(model, val_loader, criterion, device):
    model.eval()
    losses = []

    with torch.no_grad():
        for X_batch, y_batch in val_loader:
            X_batch = X_batch.to(device).float()
            y_batch = y_batch.to(device).float()
            outputs = model(X_batch).squeeze()
            loss = criterion(outputs, y_batch)
            losses.append(loss.item())

    return np.mean(losses)

# Define prediction function
def predict(model, test_loader):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.eval()
    preds = []
    trues = []

    with torch.no_grad():
        for X_batch, y_batch in test_loader:
            X_batch = X_batch.to(device).float()
            y_batch = y_batch.to(device).float()
            outputs = model(X_batch).squeeze()
            preds.extend(outputs.cpu().numpy())
            trues.extend(y_batch.cpu().numpy())

    mse = mean_squared_error(trues, preds)
    r2 = r2_score(trues, preds)

    return preds, trues, mse, r2
