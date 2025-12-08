import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)
from live_data_service import live_service
import sys

print("Testing Live Insights Generation...")

coins = ["BTC", "ETH", "SOL", "ADA"]

for coin in coins:
    print(f"\n--- Testing {coin} ---")
    try:
        insight = live_service.generate_insight(coin)
        print(f"TEXT: {insight['text']}")
    except Exception as e:
        print(f"Error: {e}")

print("\nDone.")
