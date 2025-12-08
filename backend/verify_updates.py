import pandas as pd
from pathlib import Path

DATASET_PATH = Path("../research/my_cypto_dataset.csv")

def verify_updates():
    if not DATASET_PATH.exists():
        print("Dataset not found!")
        return

    print(f"Loading dataset from {DATASET_PATH}...")
    df = pd.read_csv(DATASET_PATH)
    df['Date'] = pd.to_datetime(df['Date'], format='%d-%m-%Y %H:%M', errors='coerce')
    
    # Group by coin and get max date
    stats = df.groupby('Coin')['Date'].max().sort_values()
    
    print(f"{'Coin':<25} | {'Last Updated Date':<20}")
    print("-" * 50)
    
    all_updated = True
    for coin, date in stats.items():
        print(f"{coin:<25} | {date.strftime('%Y-%m-%d')}")
        if date.year < 2025:
            all_updated = False
            
    print("-" * 50)
    if all_updated:
        print("SUCCESS: All coins are updated to 2025!")
    else:
        print("WARNING: Some coins are NOT updated.")

if __name__ == "__main__":
    verify_updates()
