import pandas as pd
from pathlib import Path

DATASET_PATH = Path("../research/my_cypto_dataset.csv")

def check_integrity():
    print(f"Loading {DATASET_PATH}...")
    df = pd.read_csv(DATASET_PATH)
    df['Date'] = pd.to_datetime(df['Date'])
    
    print(f"Total Rows: {len(df)}")
    
    # 1. Check for Duplicates
    duplicates = df.duplicated(subset=['Coin', 'Date'])
    if duplicates.sum() > 0:
        print(f"CRITICAL: Found {duplicates.sum()} duplicate rows!")
    else:
        print("✅ No duplicates found.")
        
    # 2. Check for Negative Prices
    neg_prices = df[(df['Close'] <= 0) | (df['High'] <= 0) | (df['Low'] <= 0) | (df['Open'] <= 0)]
    if not neg_prices.empty:
        print(f"CRITICAL: Found {len(neg_prices)} rows with negative/zero prices!")
        print(neg_prices.head())
    else:
        print("✅ No negative prices found.")
        
    # 3. Check for Gaps
    print("\nChecking for date gaps (Real Data Period: 2021-2025)...")
    coins = df['Coin'].unique()
    for coin in coins:
        coin_df = df[df['Coin'] == coin].sort_values('Date')
        
        # Filter for the "Real" period we just fetched (approx July 2021 to Nov 2025)
        mask = (coin_df['Date'] >= '2021-07-07') & (coin_df['Date'] <= '2025-11-22')
        real_df = coin_df[mask]
        
        if real_df.empty:
            continue
            
        # Check date diffs
        date_diffs = real_df['Date'].diff().dropna()
        gaps = date_diffs[date_diffs > pd.Timedelta(days=1)]
        
        if not gaps.empty:
            print(f"⚠️  {coin}: Found {len(gaps)} gaps in real data sequence.")
            # print(gaps.head())
        else:
            # print(f"  {coin}: Continuous.")
            pass
            
    print("✅ Gap check complete (Warnings above if any).")

    # 4. Check Latest Real Data Point
    btc_df = df[df['Coin'] == 'coin_Bitcoin']
    # Filter for dates <= Today (Nov 23)
    # We fetched up to Nov 22 inclusive usually with yfinance end=Nov 23
    recent = btc_df[btc_df['Date'] <= '2025-11-23'].iloc[-1]
    print(f"\nLatest Bitcoin Data Point (Dataset):")
    print(f"Date: {recent['Date']}")
    print(f"Close: ${recent['Close']:.2f}")
    
if __name__ == "__main__":
    check_integrity()
