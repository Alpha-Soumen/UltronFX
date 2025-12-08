import requests
import datetime

def check_live_price():
    print("Fetching live Bitcoin price from CoinGecko...")
    try:
        url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
        resp = requests.get(url, timeout=10)
        data = resp.json()
        
        live_price = data['bitcoin']['usd']
        print(f"Live Price (CoinGecko): ${live_price:,.2f}")
        
        # Compare with our dataset's latest "Real" point (Nov 22)
        # We know from previous step it was around $98k range in yfinance fetch log?
        # Wait, the previous log said "Bitcoin price matches real-world values (~$98k-$99k range)".
        # But the integrity check showed $83k for Nov 23.
        # This implies the "Real" data might have stopped earlier or the synthetic extension pulled it down?
        # Or maybe yfinance data for "Nov 23" (which is today/tomorrow) isn't fully in yet?
        # Let's just print the live price for comparison.
        
    except Exception as e:
        print(f"Failed to fetch live price: {e}")

if __name__ == "__main__":
    check_live_price()
