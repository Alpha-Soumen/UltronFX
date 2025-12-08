import urllib.request
import json

def test_history():
    url = "http://127.0.0.1:8000/history/coin_Bitcoin"
    print(f"Testing {url}...")
    try:
        with urllib.request.urlopen(url) as response:
            if response.status == 200:
                data = json.loads(response.read().decode())
                if "data" in data and len(data["data"]) > 0:
                    print("Success! Received history data.")
                    print(f"First point: {data['data'][0]}")
                    print(f"Total points: {len(data['data'])}")
                else:
                    print("Failed: No data received or empty list.")
            else:
                print(f"Failed: HTTP {response.status}")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    test_history()
