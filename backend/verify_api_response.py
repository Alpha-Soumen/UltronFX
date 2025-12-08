import urllib.request
import json
import datetime

URL = "http://127.0.0.1:8000/history/coin_Bitcoin"

def verify_api():
    print(f"Fetching data from {URL}...")
    try:
        with urllib.request.urlopen(URL) as response:
            data = json.loads(response.read().decode())
            
        if "data" not in data:
            print("Error: 'data' key not found in response")
            return
            
        history = data["data"]
        if not history:
            print("Error: History data is empty")
            return
            
        last_point = history[-1]
        print(f"Last Point Raw: {last_point}")
        
        last_date_str = last_point["x"]
        if last_date_str == "NaT":
             print("Error: Date is NaT (Not a Time)")
             # Print previous points to see where it breaks
             print("Previous 5 points:")
             for p in history[-5:]:
                 print(p)
             return

        # Format is ISO string, e.g., "2025-12-14T00:00:00"
        last_date = datetime.datetime.fromisoformat(last_date_str)
        
        print(f"Total Data Points: {len(history)}")
        print(f"Last Data Point Date: {last_date.date()}")
        
        if last_date.year == 2025 and last_date.month == 12:
            print("SUCCESS: API is serving data up to Dec 2025!")
        else:
            print(f"WARNING: Data might be outdated. Last date: {last_date.date()}")
            
    except Exception as e:
        print(f"Request Failed: {e}")

if __name__ == "__main__":
    verify_api()
