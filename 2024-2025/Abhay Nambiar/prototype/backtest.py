import os
import numpy as np
import pandas as pd
from datetime import datetime

LOT_SIZE = 1000

class Order:
    def __init__(self, side, price, vol=1) -> None:
        self.side = side
        self.price = price
        self.vol = vol

def backtest(orders: Order):
    cash_wallet = 50_000
    position_volume = 0
    position_price = 0
    portfolio_value = cash_wallet
    portfolio_history = []

    for index, order in enumerate(orders):
        vol = order.vol
        price = order.price
        side = 1 if order.side == "buy" else -1

        if side == 1:
            transaction_cost = price * vol
            if cash_wallet >= transaction_cost:
                cash_wallet -= transaction_cost
                position_volume += vol
                if position_volume > 0:
                    position_price = ((position_price * (position_volume - vol)) + transaction_cost) / position_volume
            else:
                print(f"Order {index + 1}: Insufficient funds to buy {vol} at {price}")
        elif side == -1:
            cash_wallet += price * vol
            position_volume -= vol

        portfolio_value = cash_wallet + (position_volume * price)
        portfolio_history.append(portfolio_value)
        print(f"Order {index + 1}: Cash: {cash_wallet}, Position: {position_volume} @ {position_price}, Portfolio: {portfolio_value}")

    return portfolio_value, portfolio_history

def strategy(path):
    data = pd.read_csv(path)

    orders = []
    position = None

    for i in range(len(data)):
        row = data.iloc[i]
        close_price, signal = row['close'], row['signal']

        if (signal == 'buy_embed' or signal == 'buy') and position is None:
            orders.append(Order('buy', close_price, LOT_SIZE))
            position = 'long'

        elif (signal == 'sell_embed' or signal == 'sell') and position is None:
            orders.append(Order('sell', close_price, LOT_SIZE))
            position = 'short'

        elif (signal == 'sell_embed' or signal == 'sell') and position == 'long':
            orders.append(Order('sell', close_price, LOT_SIZE))
            position = None

        elif (signal == 'buy_embed' or signal == 'buy') and position == 'short':
            orders.append(Order('buy', close_price, LOT_SIZE))
            position = None

    return orders

def calculate_metrics(portfolio_history, file_name):
    elapsed_time = 3/365
    returns = np.diff(portfolio_history) / portfolio_history[:-1]
    pnl = ((portfolio_history[-1] - portfolio_history[0]) / portfolio_history[0]) * 100
    annualized_return = (portfolio_history[-1] / portfolio_history[0]) ** (1 / elapsed_time) - 1
    annualized_volatility = np.std(returns) * np.sqrt(252)
    sharpe_ratio = annualized_return / annualized_volatility if annualized_volatility != 0 else 0

    metrics = {
        'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        'file_name': file_name,
        'initial_portfolio_value': portfolio_history[0],
        'final_portfolio_value': portfolio_history[-1],
        'total_pnl': pnl,
        'annualized_return': annualized_return,
        'annualized_volatility': annualized_volatility,
        'sharpe_ratio': sharpe_ratio
    }
    return metrics

def save_metrics_to_csv(metrics, output_file='output-data/backtest_metrics.csv'):
    if not os.path.exists(output_file):
        df = pd.DataFrame([metrics])
        df.to_csv(output_file, mode='w', index=False)
    else:
        df = pd.DataFrame([metrics])
        df.to_csv(output_file, mode='a', header=False, index=False)

def main():
    print("Enter the name of the file (from the 'all-data-output' directory):")
    files = ["signals_standard_strat.csv", "signals_pure_embedding_strat.csv", "signals_embedding_strat.csv"]

    for file in files:
        file_name = file
        file_path = os.path.join("all-data-output", file_name)
        if not os.path.exists(file_path):
            print(f"Error: File '{file_name}' not found in 'all-data-output' directory.")
            return

        orders = strategy(file_path)

        final_portfolio_value, portfolio_history = backtest(orders)

        metrics = calculate_metrics(portfolio_history, file_name)

        save_metrics_to_csv(metrics)

    print("Metrics have been saved to 'backtest_metrics.csv'.")

if __name__ == "__main__":
    main()
