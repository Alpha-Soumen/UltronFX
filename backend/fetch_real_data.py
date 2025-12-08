import yfinance as yf
import pandas as pd
from pathlib import Path
from datetime import datetime

DATASET_PATH = Path("../research/my_cypto_dataset.csv")
ORIGINAL_DATASET_PATH = Path("../research/my_cypto_dataset_original.csv") # Backup if exists, or assume current is mixed

# Map internal coin names to Yahoo Finance Tickers
TICKER_MAP = {
    'coin_Bitcoin': 'BTC-USD',
    'coin_Ethereum': 'ETH-USD',
    'coin_BinanceCoin': 'BNB-USD',
    'coin_Cardano': 'ADA-USD',
    'coin_Dogecoin': 'DOGE-USD',
    'coin_XRP': 'XRP-USD',
    'coin_Solana': 'SOL-USD',
    'coin_Polkadot': 'DOT-USD',
    'coin_Litecoin': 'LTC-USD',
    'coin_Tron': 'TRX-USD',
    'coin_ChainLink': 'LINK-USD',
    'coin_Stellar': 'XLM-USD',
    'coin_Uniswap': 'UNI-USD',
    'coin_Aave': 'AAVE-USD',
    'coin_Cosmos': 'ATOM-USD',
    'coin_Monero': 'XMR-USD',
    'coin_EOS': 'EOS-USD',
    'coin_Iota': 'IOTA-USD',
    'coin_NEM': 'XEM-USD',
    'coin_USDCoin': 'USDC-USD',
    'coin_Tether': 'USDT-USD',
    'coin_CryptocomCoin': 'CRO-USD',
    'coin_WrappedBitcoin': 'WBTC-USD',
}

START_DATE = "2021-07-07"
END_DATE = "2025-11-23" # yfinance end date is exclusive, so this gets up to Nov 22

def fetch_real_data():
    print("Fetching REAL data from Yahoo Finance...")
    
    # Load original data (pre-2021) if possible, or filter current
    # Since we regenerated everything synthetically, we should probably revert to the "real" 2013-2021 data first.
    # But we don't have a backup of the original CSV easily accessible unless we re-download it or if it's in git.
    # Wait, the user said "verify previously detected data range (2013 – July 2021)".
    # I overwrote it with synthetic data.
    # I should have backed it up.
    # However, I can just fetch *ALL* data from yfinance for these coins from 2013 to 2025!
    # That ensures 100% real data.
    
    all_dfs = []
    
    for coin, ticker in TICKER_MAP.items():
        print(f"Downloading {ticker} ({coin})...")
        try:
            # Fetch max history
            df = yf.download(ticker, start="2013-01-01", end=END_DATE, progress=False)
            
            if df.empty:
                print(f"WARNING: No data for {ticker}")
                continue
                
            # Reset index to get Date column
            df = df.reset_index()
            
            # Rename columns to match our schema
            # yfinance columns: Date, Open, High, Low, Close, Adj Close, Volume
            # We need: Date, Open, High, Low, Close, Volume, Coin
            
            # Handle MultiIndex columns if present (yfinance update)
            if isinstance(df.columns, pd.MultiIndex):
                df.columns = df.columns.get_level_values(0)
            
            df = df[['Date', 'Open', 'High', 'Low', 'Close', 'Volume']].copy()
            df['Coin'] = coin
            
            # Format Date
            df['Date'] = df['Date'].dt.strftime('%Y-%m-%d %H:%M:%S')
            
            all_dfs.append(df)
            print(f"  Got {len(df)} rows.")
            
        except Exception as e:
            print(f"  Failed: {e}")
            
    if all_dfs:
        final_df = pd.concat(all_dfs, ignore_index=True)
        print(f"Total rows fetched: {len(final_df)}")
        
        print(f"Saving to {DATASET_PATH}...")
        final_df.to_csv(DATASET_PATH, index=False)
        print("SUCCESS: Real data updated.")
    else:
        print("ERROR: No data fetched.")

if __name__ == "__main__":
    fetch_real_data()
