#------------------------------------------------------------#
# Name: Training Module
# Description: This script defines training routines for deep 
#              learning models for time series data fused with 
#              sentiment and technical indicators to predict 
#              future price movements.
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 11/09/2025
# Python Version: 3.10.6
# Packages Required: scikit-learn, torch, numpy
#------------------------------------------------------------#

# Import necessary libraries
from sklearn.metrics import mean_squared_error, r2_score
import torch.optim as optim
import torch.nn as nn
import numpy as np
import torch

# Additional evaluation metrics (RMSE, MAPE, Directional Accuracy)
# N.B: y_true: Iterable of ground truth values.
# AND  y_pred: Iterable of predicted values (aligned with y_true).
def compute_additional_metrics(y_true, y_pred):
    y_true = np.asarray(y_true, dtype=np.float64)
    y_pred = np.asarray(y_pred, dtype=np.float64)

    # RMSE (Root Mean Squared Error)
    rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))

    # MAPE (%), avoid division by near-zero
    eps = 1e-8
    mask = np.abs(y_true) > eps
    if mask.any():
        mape = float(np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100.0)
    else:
        mape = float('nan')

    # Directional Accuracy (Sign of change)
    if len(y_true) >= 2 and len(y_pred) >= 2:
        true_dir = np.sign(y_true[1:] - y_true[:-1])
        pred_dir = np.sign(y_pred[1:] - y_pred[:-1])
        directional_accuracy = float(np.mean(true_dir == pred_dir))
    else:
        directional_accuracy = float('nan')

    return rmse, mape, directional_accuracy

# Define training function
def train_model(
    model,
    train_loader,
    val_loader,
    num_epochs: int = 20,
    learning_rate: float = 0.001,
    weight_decay: float = 0.0,
    early_stopping: bool = False,
    es_patience: int = 20,
    es_min_delta: float = 0.0,
    verbose: bool = True,
    on_epoch_end=None,  # optional callback(epoch, train_loss, val_loss)
):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model.to(device)

    criterion = nn.MSELoss()
    optimiser = optim.Adam(model.parameters(), lr=learning_rate, weight_decay=weight_decay)

    history = {"train_loss": [], "val_loss": []}

    # Early stopping book-keeping
    best_val = float('inf')
    best_state = None
    patience_count = 0

    for epoch in range(num_epochs):
        model.train()
        train_losses = []

        for X_batch, y_batch in train_loader:
            X_batch = X_batch.to(device).float()
            y_batch = y_batch.to(device).float()

            optimiser.zero_grad()
            outputs = model(X_batch).squeeze()
            loss = criterion(outputs, y_batch)
            loss.backward()
            optimiser.step()

            train_losses.append(loss.item())

        avg_train_loss = np.mean(train_losses)

        val_loss = evaluate_model(model, val_loader, criterion, device)

        history["train_loss"].append(avg_train_loss)
        history["val_loss"].append(val_loss)

        # Early stopping check
        if early_stopping:
            if val_loss < best_val - es_min_delta:
                best_val = val_loss
                best_state = {k: v.detach().clone() for k, v in model.state_dict().items()}
                patience_count = 0
            else:
                patience_count += 1
                if patience_count >= es_patience:
                    if verbose:
                        print(f"Early stopping at epoch {epoch+1}; best val loss {best_val:.6f}")
                    break

        # Optional callback for external logging (MLflow)
        if callable(on_epoch_end):
            try:
                on_epoch_end(epoch, float(avg_train_loss), float(val_loss))
            except Exception:
                pass

        if verbose:
            # N.B: ReduceLROnPlateau could be implemented in the next prototype
            current_lr = optimiser.param_groups[0]['lr']
            print(f"Epoch {epoch+1}/{num_epochs} - Train Loss: {avg_train_loss:.4f} - Val Loss: {val_loss:.4f} - LR: {current_lr:.6g}")

    # Load the best weights if stopped early and captured the best state
    if early_stopping and best_state is not None:
        model.load_state_dict(best_state)

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

# Late-fusion blending, by choosing alpha between [0,1] to minimise val MSE
def blend_by_validation(y_val_true, y_val_a, y_val_b, step: float = 0.05):
    best_alpha, best_mse = 0.5, float('inf')
    alphas = np.arange(0.0, 1.0 + 1e-9, step)
    for a in alphas:
        y_val_pred = a * np.asarray(y_val_a) + (1 - a) * np.asarray(y_val_b)
        mse = mean_squared_error(y_val_true, y_val_pred)
        if mse < best_mse:
            best_mse, best_alpha = mse, float(a)
    return best_alpha, best_mse
