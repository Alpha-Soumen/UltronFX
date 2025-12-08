import pandas as pd
from pathlib import Path

DATASET_PATH = Path("../research/my_cypto_dataset.csv")

def inspect():
    print(f"Reading {DATASET_PATH}...")
    df = pd.read_csv(DATASET_PATH)
    
    print(f"Total rows: {len(df)}")
    print(f"NaT count: {df['Date'].isna().sum()}")
    
    # Show some valid rows
    valid = df.dropna(subset=['Date'])
    if not valid.empty:
        print(f"Found {len(valid)} valid rows.")
        print("Sample valid rows:")
        print(valid.head())
        print("Valid rows per coin:")
        print(valid['Coin'].value_counts())
    else:
        print("No valid dates found.")

if __name__ == "__main__":
    inspect()
