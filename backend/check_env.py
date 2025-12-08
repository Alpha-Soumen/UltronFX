import sys
import datetime

print(f"Python {sys.version}")
try:
    import yfinance as yf
    print("yfinance available")
except ImportError:
    print("yfinance NOT available")

try:
    import requests
    print("requests available")
    try:
        r = requests.get("https://api.coingecko.com/api/v3/ping", timeout=5)
        print(f"CoinGecko Ping: {r.status_code}")
    except Exception as e:
        print(f"CoinGecko Ping Failed: {e}")
except ImportError:
    print("requests NOT available")

print(f"System Date: {datetime.datetime.now()}")
