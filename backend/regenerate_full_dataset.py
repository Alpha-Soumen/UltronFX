import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from pathlib import Path

DATASET_PATH = Path("../research/my_cypto_dataset.csv")
TARGET_DATE = datetime(2025, 12, 15)

# Approximate start dates and initial prices for realism
COINS = {
    'coin_Bitcoin': {'start': '2013-04-29', 'price': 135.0},
    'coin_Ethereum': {'start': '2015-08-08', 'price': 0.75},
    'coin_BinanceCoin': {'start': '2017-07-26', 'price': 0.1},
    'coin_Cardano': {'start': '2017-10-02', 'price': 0.02},
    'coin_Dogecoin': {'start': '2013-12-16', 'price': 0.0002},
    'coin_XRP': {'start': '2013-08-05', 'price': 0.005},
    'coin_Solana': {'start': '2020-04-11', 'price': 0.95},
    'coin_Polkadot': {'start': '2020-08-21', 'price': 2.7},
    'coin_Litecoin': {'start': '2013-04-29', 'price': 4.3},
    'coin_Tron': {'start': '2017-09-14', 'price': 0.002},
    'coin_ChainLink': {'start': '2017-09-21', 'price': 0.15},
    'coin_Stellar': {'start': '2014-08-06', 'price': 0.002},
    'coin_Uniswap': {'start': '2020-09-18', 'price': 3.0},
    'coin_Aave': {'start': '2020-10-05', 'price': 52.0},
    'coin_Cosmos': {'start': '2019-03-15', 'price': 6.0},
    'coin_Monero': {'start': '2014-05-22', 'price': 2.0},
    'coin_EOS': {'start': '2017-07-02', 'price': 1.0},
    'coin_Iota': {'start': '2017-06-14', 'price': 0.6},
    'coin_NEM': {'start': '2015-04-02', 'price': 0.0004},
    'coin_USDCoin': {'start': '2018-10-09', 'price': 1.0},
    'coin_Tether': {'start': '2015-02-26', 'price': 1.0},
    'coin_CryptocomCoin': {'start': '2018-12-15', 'price': 0.02},
    'coin_WrappedBitcoin': {'start': '2019-01-31', 'price': 3500.0},
}

def generate_full_dataset():
    print("Regenerating full dataset...")
    all_data = []
    
    for coin, info in COINS.items():
        start_date = datetime.strptime(info['start'], '%Y-%m-%d')
        days = (TARGET_DATE - start_date).days + 1
        
        print(f"Generating {days} days for {coin}...")
        
        # Random walk parameters
        mu = 0.0005  # Slight upward drift
        sigma = 0.04 # 4% daily volatility
        
        # Stablecoins have low vol
        if coin in ['coin_USDCoin', 'coin_Tether']:
            mu = 0.0
            sigma = 0.001
            
        returns = np.random.normal(mu, sigma, days)
        price_path = info['price'] * np.cumprod(1 + returns)
        
        dates = [start_date + timedelta(days=i) for i in range(days)]
        
        for i, date in enumerate(dates):
            close_p = max(0.000001, price_path[i]) # Ensure positive
            daily_range = close_p * sigma
            open_p = close_p * (1 + np.random.uniform(-0.01, 0.01))
            high_p = max(open_p, close_p) + (daily_range * np.random.uniform(0, 1))
            low_p = min(open_p, close_p) - (daily_range * np.random.uniform(0, 1))
            vol = np.random.uniform(100000, 100000000)
            
            all_data.append({
                'Date': date.strftime('%Y-%m-%d %H:%M:%S'), # Standard ISO
                'Open': open_p,
                'High': high_p,
                'Low': low_p,
                'Close': close_p,
                'Volume': vol,
                'Coin': coin
            })
            
    df = pd.DataFrame(all_data)
    print(f"Total rows generated: {len(df)}")
    
    print(f"Saving to {DATASET_PATH}...")
    df.to_csv(DATASET_PATH, index=False)
    print("Done.")

if __name__ == "__main__":
    generate_full_dataset()
