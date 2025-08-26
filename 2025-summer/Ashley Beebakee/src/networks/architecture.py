#------------------------------------------------------------#
# Name: Architecture Module
# Description: This script defines deep learning architectures
#              for training and evaluation of time series data
#              fused with sentiment and technical indicators
#              to predict future price movements.
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 26/08/2025
# Python Version: 3.10.6
# Packages Required: N/A
#------------------------------------------------------------#

# Import necessary libraries
import torch.nn as nn

# Define LSTM, CNN, and CNN-LSTM models for time series prediction
class LSTMModel(nn.Module):
    def __init__(self, input_size, hidden_size, output_size, num_layers=2, dropout=0.2):
        super(LSTMModel, self).__init__()
        # Dropout in LSTM applies between layers when num_layers > 1
        lstm_dropout = dropout if num_layers and num_layers > 1 else 0.0
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, dropout=lstm_dropout, batch_first=True)
        self.fc = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        out, _ = self.lstm(x)
        out = self.fc(out[:, -1, :])  # Use the last output
        return out

class CNNModel(nn.Module):
    def __init__(self, input_size, filters, output_size, kernel_size=3, stride=1, dropout=0.0):
        super(CNNModel, self).__init__()
        # Use padding to preserve temporal length approximately for odd kernels
        padding = kernel_size // 2
        self.conv1 = nn.Conv1d(in_channels=input_size, out_channels=filters, kernel_size=kernel_size, stride=stride, padding=padding)
        self.relu = nn.ReLU()
        self.pool = nn.AdaptiveMaxPool1d(1)
        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Linear(filters, output_size)

    def forward(self, x):
        x = x.permute(0, 2, 1)  # (B, T, F) → (B, F, T)
        x = self.relu(self.conv1(x))
        x = self.pool(x).squeeze(-1)
        x = self.dropout(x)
        x = self.fc(x)
        return x

class CNNLSTMModel(nn.Module):
    def __init__(self, input_size, conv_filters, output_size, kernel_size=3, stride=1, lstm_hidden=64, lstm_layers=2, dropout=0.2):
        super(CNNLSTMModel, self).__init__()
        padding = kernel_size // 2
        self.conv1 = nn.Conv1d(in_channels=input_size, out_channels=conv_filters, kernel_size=kernel_size, stride=stride, padding=padding)
        self.relu = nn.ReLU()
        lstm_dropout = dropout if lstm_layers and lstm_layers > 1 else 0.0
        self.lstm = nn.LSTM(input_size=conv_filters, hidden_size=lstm_hidden, num_layers=lstm_layers, batch_first=True, dropout=lstm_dropout)
        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Linear(lstm_hidden, output_size)

    def forward(self, x):
        x = x.permute(0, 2, 1)  # (B, T, F) → (B, F, T)
        x = self.relu(self.conv1(x))  # (B, H, T')
        x = x.permute(0, 2, 1)        # (B, T', H)
        out, _ = self.lstm(x)
        out = self.dropout(out[:, -1, :])
        out = self.fc(out)
        return out

# Function to get the model based on the deep learning architecture name
def get_model(name, input_size, output_size, **kwargs):
    # Set model name to lowercase to facilitate selection
    name = name.lower()
    if name == "lstm":
        hidden = kwargs.get("hidden_size", 64)
        num_layers = kwargs.get("num_layers", 2)
        dropout = kwargs.get("dropout", 0.2)
        return LSTMModel(input_size, hidden, output_size, num_layers=num_layers, dropout=dropout)
    elif name == "cnn":
        filters = kwargs.get("filters", kwargs.get("hidden_size", 64))
        kernel_size = kwargs.get("kernel_size", 3)
        stride = kwargs.get("stride", 1)
        dropout = kwargs.get("dropout", 0.0)
        return CNNModel(input_size, filters, output_size, kernel_size=kernel_size, stride=stride, dropout=dropout)
    elif name == "cnn-lstm":
        conv_filters = kwargs.get("conv_filters", kwargs.get("filters", kwargs.get("hidden_size", 32)))
        kernel_size = kwargs.get("kernel_size", 3)
        stride = kwargs.get("stride", 1)
        lstm_hidden = kwargs.get("lstm_hidden", kwargs.get("hidden_size", 64))
        lstm_layers = kwargs.get("lstm_layers", 2)
        dropout = kwargs.get("dropout", 0.2)
        return CNNLSTMModel(input_size, conv_filters, output_size, kernel_size=kernel_size, stride=stride, lstm_hidden=lstm_hidden, lstm_layers=lstm_layers, dropout=dropout)
    else:
        raise ValueError(f"Unknown deep learning architecture: {name}")