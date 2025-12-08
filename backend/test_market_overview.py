import requests
import time
import json

BASE_URL = "http://127.0.0.1:8000"

def test_market_overview():
    print("1. Switching to LIVE mode...")
    requests.post(f"{BASE_URL}/admin/mode", json={"mode": "LIVE"})
    
    print("\n2. Fetching Market Overview (expecting live trending/gainers)...")
    start = time.time()
    res = requests.get(f"{BASE_URL}/market-overview")
    duration = time.time() - start
    
    if res.status_code == 200:
        data = res.json()
        print(f"   Success! Fetch took {duration:.2f}s")
        
        trending = data.get('trending', [])
        gainers = data.get('top_gainers', [])
        
        print(f"   Trending Count: {len(trending)}")
        if trending:
            print(f"   Sample Trending: {trending[0]['name']} ({trending[0]['change']})")
            
        print(f"   Gainers Count: {len(gainers)}")
        if gainers:
            print(f"   Sample Gainer: {gainers[0]['name']} ({gainers[0]['change']})")
            
        if len(trending) > 0 and len(gainers) > 0:
            print("\n   ✅ VERIFICATION PASSED: Live data present.")
        else:
            print("\n   ❌ VERIFICATION FAILED: Missing trending/gainers.")
    else:
        print(f"   Failed: {res.text}")

    print("\n3. Switching back to STATIC mode...")
    requests.post(f"{BASE_URL}/admin/mode", json={"mode": "STATIC"})
    print("   Done.")

if __name__ == "__main__":
    try:
        test_market_overview()
    except Exception as e:
        print(f"Error: {e}")
