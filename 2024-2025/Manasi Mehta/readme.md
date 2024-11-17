# LLM for Automated Trading
Project Link: https://kaixu.me/2023/09/15/llm-for-automated-trading/

## Meeting Minutes and to:do
[Meeting Minutes Markdown](meetingMinutes.md)

# MVP
## Trading System: Minimal Working Demo To-Do List

## 1. Data Input
- [x] **Obtain historical data**: 
  - Fetch data from a reliable source (Alpaca API).
  - Ensure that data contains required fields like timestamp, price, volume, etc.
  - ![alt text](./assets/btcopeningprice.png)

- [ ] **Load and preprocess data**: 
  - Clean missing or invalid data.
  - Convert data to suitable formats for processing (Pandas DataFrame).
  - Ensure time is sorted and no out-of-sequence data points.

## 2. Trade Decision Logic (Rule-based)
- [x] **Define trading rules**: 
  - Create basic rules for entering and exiting trades (threshold-based conditions).
- [x] **Implement trading strategy**: 
  - Code the rules to decide whether to buy/sell based on the current data.
  - Test the decision logic independently with sample data.

## 3. Trade Execution
- [x] **Simulate trade execution**:
  - Create a basic trading function to simulate buy/sell orders. (Alpaca paper trading)
  - Ensure it records the amount traded, price, and time of the trade.
  - Account for transaction costs (if applicable) and apply them in the logic.

## 4. Performance Tracking
- [x] **Track trade history**: 
  - Store each executed trade with relevant details (price, quantity, etc.).
  - [Technical Analysis](./technicalAnalysis.md)
- [x] **Calculate performance metrics**: 
  - Track portfolio value over time.
  - Calculate metrics such as RSI, MACD, ROI, or Sharpe ratio for simple performance evaluation.
  
## 5. Output and Logging
- [x] **Generate logs**: 
  - Log every trade, decision, and performance updates.
- [x] **Output final results**: 
  - Create a summary of trading performance at the end of the simulation (e.g., total profit, number of trades).
  
## 6. Testing and Validation
- [x] **Test with sample data**: 
  - Run the system with a sample dataset to check for any bugs or incorrect trade executions.
  - Ensure that all modules are working together without errors.

## 7. Documentation
- [x] **Write documentation**: 
  - Document the design and functionality of each component.
  - Describe the inputs, outputs, and assumptions made in the system.
     
# Development
<ul>
  <li>Looked into Observable</li>
</ul>

Features to Include:
  Sentiment Analysis:
    Analyze cryptocurrency-related news, social media (e.g., Twitter), and forums (e.g., Reddit).
    Classify market sentiment as positive, neutral, or negative.
  Technical Analysis:
    Use technical indicators (e.g., RSI, MACD, Bollinger Bands).
    Implement price trend analysis and candlestick pattern recognition.
  Trading Strategies:
    Combine sentiment scores with technical indicators to make buy/sell decisions.
    Support multiple trading strategies (e.g., momentum trading, mean reversion).
  Backtesting:
    Test strategies on historical data before live trading.
  Live Trading:
    Integrate with cryptocurrency exchanges like Binance or Coinbase.
    Execute trades automatically based on predefined rules.
  Risk Management:
    Stop-loss and take-profit mechanisms.
    Position sizing based on risk tolerance.
  Dashboard and Visualization:
    Real-time price charts, trade history, and sentiment graphs.
    Detailed logs of trades and analysis.
