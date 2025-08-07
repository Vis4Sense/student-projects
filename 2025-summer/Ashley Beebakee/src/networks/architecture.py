#------------------------------------------------------------#
# Name: Architecture Module
# Description: This script defines deep learning architectures
#              for training and evaluation of time series data
#              fused with sentiment and technical indicators
#              to predict future price movements.
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 07/08/2025
# Python Version: 3.10.6
# Packages Required: N/A
#------------------------------------------------------------#

# Import necessary libraries
import torch
import torch.nn as nn

# Define LSTM, CNN, and CNN-LSTM models for time series prediction
class LSTMModel(nn.Module):
    def __init__(self, input_size, hidden_size, output_size, num_layers=2, dropout=0.2):
        super(LSTMModel, self).__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, dropout=dropout, batch_first=True)
        self.fc = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        out, _ = self.lstm(x)
        out = self.fc(out[:, -1, :])  # Use the last output
        return out


class CNNModel(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(CNNModel, self).__init__()
        self.conv1 = nn.Conv1d(in_channels=input_size, out_channels=hidden_size, kernel_size=3)
        self.relu = nn.ReLU()
        self.pool = nn.AdaptiveMaxPool1d(1)
        self.fc = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        x = x.permute(0, 2, 1)  # (B, T, F) → (B, F, T)
        x = self.relu(self.conv1(x))
        x = self.pool(x).squeeze(-1)
        x = self.fc(x)
        return x


class CNNLSTMModel(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(CNNLSTMModel, self).__init__()
        self.conv1 = nn.Conv1d(in_channels=input_size, out_channels=hidden_size, kernel_size=3)
        self.relu = nn.ReLU()
        self.lstm = nn.LSTM(hidden_size, hidden_size, batch_first=True)
        self.fc = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        x = x.permute(0, 2, 1)  # (B, T, F) → (B, F, T)
        x = self.relu(self.conv1(x))  # (B, H, T')
        x = x.permute(0, 2, 1)        # (B, T', H)
        out, _ = self.lstm(x)
        out = self.fc(out[:, -1, :])
        return out

# Function to get the model based on the name
def get_model(name, input_size, hidden_size, output_size):
    name = name.lower()
    if name == "lstm":
        return LSTMModel(input_size, hidden_size, output_size)
    elif name == "cnn":
        return CNNModel(input_size, hidden_size, output_size)
    elif name == "cnn-lstm":
        return CNNLSTMModel(input_size, hidden_size, output_size)
    else:
        raise ValueError(f"Unknown model architecture: {name}")

model = get_model("cnn-lstm", input_size=5, hidden_size=64, output_size=1)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

print(model)
