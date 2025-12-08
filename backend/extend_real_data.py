import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime, timedelta

DATASET_PATH = Path("../research/my_cypto_dataset.csv")
TARGET_DATE = datetime(2025, 12, 15)

def extend_data():
    print(f"Loading real data from {DATASET_PATH}...")
    df = pd.read_csv(DATASET_PATH)
    df['Date'] = pd.to_datetime(df['Date'])
    
    new_rows = []
    coins = df['Coin'].unique()
    
    print(f"Extending {len(coins)} coins to {TARGET_DATE.date()}...")
    
    for coin in coins:
        coin_df = df[df['Coin'] == coin].sort_values('Date')
        if coin_df.empty:
            continue
            
        last_row = coin_df.iloc[-1]
        last_date = last_row['Date']
        last_close = last_row['Close']
        
        days_to_generate = (TARGET_DATE - last_date).days
        
        if days_to_generate <= 0:
            print(f"Skipping {coin}, already up to date.")
            continue
            
        # print(f"  Generating {days_to_generate} days for {coin}...")
        
        # Calculate volatility from recent real data
        if len(coin_df) > 30:
            returns = coin_df['Close'].pct_change().dropna().tail(30)
            daily_vol = returns.std()
            avg_daily_ret = returns.mean()
        else:
            daily_vol = 0.02
            avg_daily_ret = 0.0005
            
        # Generate future path
        shocks = np.random.normal(avg_daily_ret, daily_vol, days_to_generate)
        price_path = last_close * np.cumprod(1 + shocks)
        
        dates = [last_date + timedelta(days=i+1) for i in range(days_to_generate)]
        
        for i, date in enumerate(dates):
            close_p = max(0.000001, price_path[i])
            daily_range = close_p * daily_vol
            open_p = close_p * (1 + np.random.uniform(-0.01, 0.01))
            high_p = max(open_p, close_p) + (daily_range * np.random.uniform(0, 1))
            low_p = min(open_p, close_p) - (daily_range * np.random.uniform(0, 1))
            vol = last_row['Volume'] * np.random.uniform(0.8, 1.2)
            
            new_rows.append({
                'Date': date.strftime('%Y-%m-%d %H:%M:%S'),
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
        final_df = pd.concat([df, new_df], ignore_index=True)
        
        # Sort
        final_df['Date'] = pd.to_datetime(final_df['Date'])
        final_df = final_df.sort_values(['Coin', 'Date'])
        
        final_df.to_csv(DATASET_PATH, index=False)
        print("SUCCESS: Dataset extended to Dec 15, 2025.")
    else:
        print("No new data needed.")

if __name__ == "__main__":
    extend_data()
