import json
import urllib.request
import urllib.error
import time
import random

BASE_URL = "http://127.0.0.1:8000"

def test_get(endpoint):
    url = f"{BASE_URL}{endpoint}"
    print(f"Testing GET {endpoint}...", end=" ")
    try:
        with urllib.request.urlopen(url) as response:
            if response.status == 200:
                data = json.loads(response.read().decode())
                print("OK")
                return data
            else:
                print(f"FAILED (Status: {response.status})")
                return None
    except urllib.error.URLError as e:
        print(f"FAILED ({e})")
        return None

def test_post(endpoint, payload):
    url = f"{BASE_URL}{endpoint}"
    print(f"Testing POST {endpoint}...", end=" ")
    try:
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                data = json.loads(response.read().decode())
                print("OK")
                return data
            else:
                print(f"FAILED (Status: {response.status})")
                return None
    except urllib.error.URLError as e:
        print(f"FAILED ({e})")
        return None

def main():
    print("Waiting for server to be ready...")
    for i in range(10):
        try:
            with urllib.request.urlopen(f"{BASE_URL}/health") as response:
                if response.status == 200:
                    print("Server is ready!")
                    break
        except:
            time.sleep(2)
            print(".", end="", flush=True)
    else:
        print("\nServer failed to start.")
        return

    # 1. GET /coins
    coins_data = test_get("/coins")
    if not coins_data: return
    coins = coins_data.get("coins", [])
    if not coins:
        print("No coins found!")
        return
    print(f"Found coins: {coins}")
    
    test_coin = coins[0]
    
    # 2. GET /health
    test_get("/health")
    
    # 3. GET /version
    test_get("/version")
    
    # 4. GET /model/info
    test_get("/model/info")
    
    # 5. GET /stats
    test_get("/stats")
    
    # 6. GET /trending
    test_get("/trending")
    
    # 7. GET /history/{coin}
    test_get(f"/history/{test_coin}")
    
    # 8. GET /risk/{coin}
    test_get(f"/risk/{test_coin}")
    
    # Prepare dummy window (72x17)
    dummy_window = [[random.random() for _ in range(17)] for _ in range(72)]
    
    # 9. POST /predict
    predict_payload = {"coin": test_coin, "window": dummy_window}
    test_post("/predict", predict_payload)
    
    # 10. POST /predict/today
    test_post("/predict/today", predict_payload)
    
    # 11. POST /predict/bulk
    bulk_payload = {
        "coins": [test_coin],
        "windows": {test_coin: dummy_window}
    }
    test_post("/predict/bulk", bulk_payload)
    
    # 12. GET /predict/all
    test_get("/predict/all")
    
    # 13. POST /predict/compare
    if len(coins) >= 2:
        coin2 = coins[1]
        compare_payload = {
            "coin1": test_coin,
            "coin2": coin2,
            "window1": dummy_window,
            "window2": dummy_window
        }
        test_post("/predict/compare", compare_payload)
    else:
        print("Skipping compare test (not enough coins)")

if __name__ == "__main__":
    main()
