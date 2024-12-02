import matplotlib.pyplot as plt
from embedding_strat import embedding_strat
from string_sentiment import standard_sentiment_strategy
from pure_embedding_strat import pure_embedding_strat


def plot_trading(df, strat_name):

    if 'timestamp' in df.index.names:
        timestamp_idx = df.index.get_level_values('timestamp')

        if timestamp_idx.tz is not None:
            timestamp_idx = timestamp_idx.tz_convert(None)

        df = df.set_index(timestamp_idx)

    plt.figure(figsize=(12, 6))

    # Plot close prices and moving averages
    plt.plot(df.index, df["close"], label="Close", color="blue", linewidth=1)
    plt.plot(df.index, df["10MA"], label="10MA", color="green", linewidth=1)
    plt.plot(df.index, df["80MA"], label="80MA", color="orange", linewidth=1)
    
    # Scatter plot for sentiment
    # plt.scatter(
    #     df[df["sentiment"]>0].index,
    #     df[df["sentiment"]>0]["close"],
    #     label="Positive",
    #     color="green",
    #     s=50
    # )
    # plt.scatter(
    #     df[df["sentiment"] == 0].index,
    #     df[df["sentiment"] == 0]["close"],
    #     label="Neutral",
    #     color="purple",
    #     s=50
    # )
    # plt.scatter(
    #     df[df["sentiment"] < 0].index,
    #     df[df["sentiment"] < 0]["close"],
    #     label="Negative",
    #     color="red",
    #     s=50
    # )
    
    plt.scatter(
        df[df["signal"] == "buy"].index,
        df[df["signal"] == "buy"]["close"],
        label="Buy",
        color="green",
        marker="^",
        s=100
    )
    plt.scatter(
        df[df["signal"] == "sell"].index,
        df[df["signal"] == "sell"]["close"],
        label="Sell",
        color="red",
        marker="v",
        s=100
    )

    plt.scatter(
        df[df["signal"] == "buy_embed"].index,
        df[df["signal"] == "buy_embed"]["close"],
        label="Buy_Embeddings",
        color="darkgreen",
        marker="^",
        s=100
    )
    plt.scatter(
        df[df["signal"] == "sell_embed"].index,
        df[df["signal"] == "sell_embed"]["close"],
        label="Sell_Embeddings",
        color="brown",
        marker="v",
        s=100
    )

    # Titles and labels
    plt.title(strat_name)
    plt.xlabel("Date")
    plt.ylabel("Price")

    plt.legend(title="Legend")
    plt.xticks(rotation=45)  
    plt.tight_layout()       

    plt.show()



def main():
    while True:
        print("Choose a strategy to run:")
        print("1. Embedding Strategy")
        print("2. Standard Sentiment Strategy")
        print("3. LLM Direct Embedding Strategy")
        print("4. Exit")

        choice = input("Enter the number of your choice: ")

        if choice == "1":
            tolerance = float(input("What is the tolerance level for similarity? Please enter a float here: "))
            print("Running Embedding Strategy...")
            plot_trading(embedding_strat(tolerance), "Embedding Strategy Signals")
        elif choice == "2":
            print("Running Standard Sentiment Strategy...")
            plot_trading(standard_sentiment_strategy(), "Standard Sentiment Strategy")
        elif choice == "3":
            print("LLM Direct Embedding Strategy")
            plot_trading(pure_embedding_strat(), "Pure Embedding Strategy")
        elif choice == "4":
            print("Exiting...")
            break
        else:
            print("Invalid choice. Please enter 1, 2, or 3.")

if __name__ == "__main__":
    main()