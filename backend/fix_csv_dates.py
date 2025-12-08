import pandas as pd
from pathlib import Path

DATASET_PATH = Path("../research/my_cypto_dataset.csv")

def fix_dates():
    print(f"Reading {DATASET_PATH}...")
    df = pd.read_csv(DATASET_PATH)
    
    print("Parsing dates with dayfirst=True...")
    # This handles both 2020-10-05 (ISO) and 14-12-2025 (DMY) correctly
    df['Date'] = pd.to_datetime(df['Date'], dayfirst=True, errors='coerce')
    
    # Check for failures
    nats = df[df['Date'].isna()]
    if not nats.empty:
        print(f"WARNING: {len(nats)} rows could not be parsed and became NaT.")
        print(nats.head())
    else:
        print("All dates parsed successfully.")
        
    print("Saving back to CSV with consistent ISO format...")
    df.to_csv(DATASET_PATH, index=False)
    print("Done.")

if __name__ == "__main__":
    fix_dates()
