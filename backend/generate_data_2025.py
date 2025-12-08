import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime, timedelta
import random

DATASET_PATH = Path("../research/my_cypto_dataset.csv")
TARGET_DATE = datetime(2025, 12, 15)

def generate_data():
    if not DATASET_PATH.exists():
        print("Dataset not found!")
        return

    print(f"Loading dataset from {DATASET_PATH}...")
    df = pd.read_csv(DATASET_PATH)
    df['Date'] = pd.to_datetime(df['Date'], format='%d-%m-%Y %H:%M', errors='coerce')
    
    # Remove rows with invalid dates
    df = df.dropna(subset=['Date'])
    
    new_rows = []
    
    coins = df['Coin'].unique()
    print(f"Found {len(coins)} coins. Extending data to {TARGET_DATE.date()}...")
    
    for coin in coins:
        coin_df = df[df['Coin'] == coin].sort_values('Date')
        if coin_df.empty:
            continue
            
        last_row = coin_df.iloc[-1]
        last_date = last_row['Date']
        last_close = last_row['Close']
        
        # Calculate historical volatility and drift
        if len(coin_df) > 30:
            returns = coin_df['Close'].pct_change().dropna()
            daily_vol = returns.std()
            avg_daily_ret = returns.mean()
        else:
            daily_vol = 0.02
            avg_daily_ret = 0.0005
            
        # Generate days
        current_date = last_date + timedelta(days=1)
        current_price = last_close
        
        days_to_generate = (TARGET_DATE - last_date).days
        
        if days_to_generate <= 0:
            print(f"Skipping {coin}, already up to date.")
            continue
            
        print(f"  Generating {days_to_generate} days for {coin}...")
        
        # Vectorized generation for speed
        # Random shocks: normal distribution
        shocks = np.random.normal(avg_daily_ret, daily_vol, days_to_generate)
        
        # Price path
        price_multipliers = 1 + shocks
        price_path = current_price * np.cumprod(price_multipliers)
        
        # Generate dates
        dates = [current_date + timedelta(days=i) for i in range(days_to_generate)]
        
        for i, date in enumerate(dates):
            close_p = price_path[i]
            # Simulate OHLC based on Close
            # High is slightly higher, Low slightly lower
            daily_range = close_p * daily_vol
            open_p = close_p * (1 + np.random.uniform(-0.01, 0.01)) # Open near Close
            high_p = max(open_p, close_p) + (daily_range * np.random.uniform(0, 1))
            low_p = min(open_p, close_p) - (daily_range * np.random.uniform(0, 1))
            vol = last_row['Volume'] * np.random.uniform(0.8, 1.2) # Random volume
            
            new_rows.append({
                'Date': date.strftime('%d-%m-%Y %H:%M'),
                'Open': open_p,
                'High': high_p,
                'Low': low_p,
                'Close': close_p,
                'Volume': vol,
                'Coin': coin
            })
            
    if new_rows:
        print(f"Appending {len(new_rows)} new rows...")
        new_df = pd.DataFrame(new_rows)
        # Concatenate and save
        # We need to ensure columns match
        final_df = pd.concat([df, new_df], ignore_index=True)
        
        # Sort by Coin and Date
        final_df['Date_Obj'] = pd.to_datetime(final_df['Date'], format='%d-%m-%Y %H:%M')
        final_df = final_df.sort_values(['Coin', 'Date_Obj'])
        final_df = final_df.drop(columns=['Date_Obj'])
        
        final_df.to_csv(DATASET_PATH, index=False)
        print("Dataset updated successfully!")
    else:
        print("No new data generated.")

if __name__ == "__main__":
    generate_data()
