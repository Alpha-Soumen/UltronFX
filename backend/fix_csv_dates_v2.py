import pandas as pd
from pathlib import Path

DATASET_PATH = Path("../research/my_cypto_dataset.csv")

def fix_dates_v2():
    print(f"Reading {DATASET_PATH}...")
    df = pd.read_csv(DATASET_PATH)
    
    # Convert to string to ensure consistent type
    df['Date'] = df['Date'].astype(str)
    
    print("Attempt 1: Parsing as ISO (YYYY-MM-DD)...")
    dates_iso = pd.to_datetime(df['Date'], format='mixed', errors='coerce')
    
    # Check what failed
    mask_nat = dates_iso.isna()
    print(f"  Failed rows: {mask_nat.sum()}")
    
    if mask_nat.sum() > 0:
        print("Attempt 2: Parsing failed rows as DMY (%d-%m-%Y)...")
        # Try specific DMY format for the failed ones
        dates_dmy = pd.to_datetime(df.loc[mask_nat, 'Date'], dayfirst=True, errors='coerce')
        
        # Combine
        dates_iso.loc[mask_nat] = dates_dmy
        
    df['Date'] = dates_iso
    
    # Final check
    final_nats = df[df['Date'].isna()]
    if not final_nats.empty:
        print(f"CRITICAL: {len(final_nats)} rows still NaT!")
        print(final_nats.head())
    else:
        print("SUCCESS: All dates parsed.")
        
    print("Saving back to CSV (ISO format)...")
    df.to_csv(DATASET_PATH, index=False)
    print("Done.")

if __name__ == "__main__":
    fix_dates_v2()
