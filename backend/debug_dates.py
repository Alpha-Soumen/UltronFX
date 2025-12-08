import pandas as pd
from pathlib import Path

DATASET_PATH = Path("../research/my_cypto_dataset.csv")

def debug_dates():
    print(f"Reading {DATASET_PATH}...")
    # Read as string to see raw format
    df = pd.read_csv(DATASET_PATH, dtype={'Date': str})
    
    print("Tail of Date column (Raw Strings):")
    print(df['Date'].tail(10))
    
    # Try parsing
    print("\nTrying to parse with %d-%m-%Y %H:%M ...")
    parsed = pd.to_datetime(df['Date'], format='%d-%m-%Y %H:%M', errors='coerce')
    
    print("Tail of Parsed Dates:")
    print(parsed.tail(10))
    
    # Check for NaT
    nats = parsed[parsed.isna()]
    if not nats.empty:
        print(f"\nFound {len(nats)} NaT values!")
        print("First 5 NaT indices:")
        print(nats.head())
        print("Corresponding Raw Strings:")
        print(df.loc[nats.index, 'Date'].head())
    else:
        print("\nNo NaT values found. Parsing successful.")

if __name__ == "__main__":
    debug_dates()
