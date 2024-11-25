# LLM for Automated Trading
Project Link: https://kaixu.me/2023/09/15/llm-for-automated-trading/

## Meeting Minutes and to:do
[Meeting Minutes Markdown](meetingMinutes.md)

# Trading System

## 1. Data Input
- [x] **Obtain historical data**: 
  - Fetch data from a reliable source (Alpaca API).
  - Ensure that data contains required fields like timestamp, price, volume, etc.
  - ![alt text](./assets/btcopeningprice.png)

- [x] **Load and preprocess data**: 
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
<ul>
  <li>Sentiment Analysis:</li>
  <ul>
    <li> [x] Analyze cryptocurrency-related news, social media (e.g., Twitter), and forums (e.g., Reddit).</li>
    <li> [x] Classify market sentiment as positive, neutral, or negative.</li>
  </ul>
  <li>Technical Analysis:</li>
  <ul>
    <li> [x] Use technical indicators (e.g., RSI, MACD, Bollinger Bands).</li>
    <li> [] Implement price trend analysis and candlestick pattern recognition.</li>
  </ul>
  <li>Trading Strategies:
    <ul>
    <li>[] Combine sentiment scores with technical indicators to make buy/sell decisions.</li>
    <li>[] Support multiple trading strategies (e.g., momentum trading, mean reversion).</li>
    </ul>
  <li>Backtesting:
    <ul>
    <li>[] Test strategies on historical data before live trading.</li>
    </ul>
  <li>Live Trading:
    <ul>
    <li>[] Integrate with cryptocurrency exchanges like Alpaca.</li>
    <li>[] Execute trades automatically based on predefined rules.</li>
    </ul>
  <li>Risk Management:
    <ul>
    <li>[] Stop-loss and take-profit mechanisms.</li>
    <li>[] Position sizing based on risk tolerance.</li>
    </ul>
  <li>Dashboard and Visualization:
    <ul>
    <li>[x] Real-time price charts, trade history, and sentiment graphs.</li>
    <li>[] Detailed logs of trades and analysis.</li>
    </ul>
</ul>


# Timeline
<ul>
  <li>[x] Project Proposal - 30th October</li>
  <li>[x] Develop a prototype and GUI, 1st-2nd week November</li>
  <li>[] Create frontend for the backend machine learning model - working on - 2nd week November - 3rd week of November</li>
  <li>[] Interim Report - 11th December</li>
  <li>[x] Research into Machine Learning Algorithms - 4th week of October - 1st week of November</li>
  <li>[] LLM Sentiment Analysis Testing for Social Media - 3rd Week of November - 1st week of December</li>
  <li>EXAM BREAK + REVISION</li>
  <li>[] LLM Sentiment Analysis Testing and Tuning - 2nd week of December - 3rd week of February</li>
  <li>[] Deep Learning Technical Analaysis Development - 1st week of February - 2nd week of March</li>
  <li>[] Deep Learning Model Testing and Parameter Tuning - 2nd week of March - 1st week of April</li>
  <li>[] Final Report - 17th April</li> 
</ul>
<strong>Backlog: frontend/backend for bot</strong>

## Current Task: create a bot dashboard that has paramter tuning aspects of the bot: indicators, prompt tuning - playground, create a document with all the model values and tuning
