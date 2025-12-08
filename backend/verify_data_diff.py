import requests
import time
import json

BASE_URL = "http://127.0.0.1:8000"

def verify_diff():
    print("--- VERIFYING DATA DIFFERENCES ---\n")

    # 1. Get STATIC Data
    print("1. Switching to STATIC mode...")
    requests.post(f"{BASE_URL}/admin/mode", json={"mode": "STATIC"})
    static_res = requests.get(f"{BASE_URL}/market-overview").json()
    print("   [STATIC] Market Cap:", static_res['market_cap_usd'])
    print("   [STATIC] Trending Top 1:", static_res['trending'][0]['name'])
    
    # 2. Get LIVE Data
    print("\n2. Switching to LIVE mode...")
    requests.post(f"{BASE_URL}/admin/mode", json={"mode": "LIVE"})
    time.sleep(1) # Give it a moment
    live_res = requests.get(f"{BASE_URL}/market-overview").json()
    print("   [LIVE]   Market Cap:", live_res['market_cap_usd'])
    print("   [LIVE]   Trending Top 1:", live_res['trending'][0]['name'])

    # 3. Compare
    print("\n--- COMPARISON RESULTS ---")
    
    # Market Cap Diff
    mcap_diff = live_res['market_cap_usd'] - static_res['market_cap_usd']
    print(f"Market Cap Difference: ${mcap_diff:,.2f}")
    if mcap_diff != 0:
        print("✅ Market Cap is DIFFERENT.")
    else:
        print("❌ Market Cap is IDENTICAL (Failed).")

    # Trending Diff
    static_trend = static_res['trending'][0]['name']
    live_trend = live_res['trending'][0]['name']
    print(f"Trending Coin #1: '{static_trend}' (Static) vs '{live_trend}' (Live)")
    if static_trend != live_trend:
        print("✅ Trending list is DIFFERENT.")
    else:
        print("❌ Trending list is IDENTICAL (Failed).")

    # 4. Cleanup
    print("\n4. Switching back to STATIC mode...")
    requests.post(f"{BASE_URL}/admin/mode", json={"mode": "STATIC"})
    print("   Done.")

if __name__ == "__main__":
    try:
        verify_diff()
    except Exception as e:
        print(f"Error: {e}")
