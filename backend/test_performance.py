import urllib.request
import time
import json

def test_perf():
    coin = "coin_Bitcoin"
    url = f"http://127.0.0.1:8000/history/{coin}"
    
    print(f"Testing performance for {coin}...")
    
    # First Request (Cold)
    start = time.time()
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read().decode())
        proc_time = response.headers.get("X-Process-Time")
    end = time.time()
    print(f"1st Request (Cold): Total={end - start:.4f}s, Server={proc_time}s")
    
    # Second Request (Cached)
    start = time.time()
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read().decode())
        proc_time = response.headers.get("X-Process-Time")
    end = time.time()
    print(f"2nd Request (Cached): Total={end - start:.4f}s, Server={proc_time}s")

if __name__ == "__main__":
    test_perf()
