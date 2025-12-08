import requests
import pandas as pd

BASE_URL = "http://127.0.0.1:8000"
COIN = "BTC"

def test_endpoint(name, url):
    print(f"Testing {name} ({url})...")
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print(f"✅ Success! Received list with {len(data)} items.")
                if len(data) > 0:
                    print(f"   Sample: {data[0]}")
            elif isinstance(data, dict):
                print(f"✅ Success! Received dict with keys: {list(data.keys())}")
            else:
                print(f"✅ Success! Received: {type(data)}")
        else:
            print(f"❌ Failed! Status: {response.status_code}, Error: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    print("-" * 30)

print("Verifying Export Endpoints...")

# Fetch valid coin
try:
    res = requests.get(f"{BASE_URL}/coins")
    coins = res.json()['coins']
    if not coins:
        print("❌ No coins found!")
        exit()
    COIN = coins[0]
    print(f"Using coin: {COIN}")
except Exception as e:
    print(f"❌ Error fetching coins: {e}")
    exit()

# 1. Indicators
test_endpoint("Indicators", f"{BASE_URL}/export/indicators/{COIN}")

# 2. Sentiment
test_endpoint("Sentiment", f"{BASE_URL}/export/sentiment")

# 3. Order Book
test_endpoint("Order Book", f"{BASE_URL}/export/orderbook/{COIN}")
