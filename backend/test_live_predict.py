import requests
import time

BASE_URL = "http://127.0.0.1:8000"

def test_live_prediction():
    print("1. Switching to LIVE mode...")
    res = requests.post(f"{BASE_URL}/admin/mode", json={"mode": "LIVE"})
    print(f"   Response: {res.json()}")
    
    print("\n2. Requesting prediction for coin_Bitcoin (should trigger live fetch)...")
    # Send dummy window, backend should ignore it and fetch live
    dummy_window = [[0]*17] * 72
    payload = {
        "coin": "coin_Bitcoin",
        "window": dummy_window
    }
    
    start = time.time()
    res = requests.post(f"{BASE_URL}/predict", json=payload)
    duration = time.time() - start
    
    if res.status_code == 200:
        print(f"   Success! Prediction took {duration:.2f}s")
        print(f"   Result: {res.json()['pred_7']}")
    else:
        print(f"   Failed: {res.text}")

    print("\n3. Switching back to STATIC mode...")
    requests.post(f"{BASE_URL}/admin/mode", json={"mode": "STATIC"})
    print("   Done.")

if __name__ == "__main__":
    try:
        test_live_prediction()
    except Exception as e:
        print(f"Error: {e}")
