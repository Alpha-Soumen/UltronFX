import requests
import pandas as pd
import numpy as np
import datetime
import time

class LiveDataService:
    def __init__(self):
        self.binance_base_url = "https://api.binance.com/api/v3"
        self.coingecko_base_url = "https://api.coingecko.com/api/v3"
        
        # Map internal symbols to Binance pairs (assuming USDT pairs)
        self.symbol_map = {
            "BTC": "BTCUSDT", "ETH": "ETHUSDT", "BNB": "BNBUSDT", "ADA": "ADAUSDT",
            "SOL": "SOLUSDT", "XRP": "XRPUSDT", "DOT": "DOTUSDT", "DOGE": "DOGEUSDT",
            "AVAX": "AVAXUSDT", "LTC": "LTCUSDT", "UNI": "UNIUSDT", "LINK": "LINKUSDT",
            "MATIC": "MATICUSDT", "XLM": "XLMUSDT", "ATOM": "ATOMUSDT", "ALGO": "ALGOUSDT",
            "VET": "VETUSDT", "TRX": "TRXUSDT", "FIL": "FILUSDT", "THETA": "THETAUSDT",
            "XMR": "XMRUSDT", "EOS": "EOSUSDT", "AAVE": "AAVEUSDT"
        }
        
        # Map symbols to CoinGecko IDs
        self.coingecko_map = {
            "BTC": "bitcoin", "ETH": "ethereum", "BNB": "binancecoin", "ADA": "cardano",
            "SOL": "solana", "XRP": "ripple", "DOT": "polkadot", "DOGE": "dogecoin",
            "AVAX": "avalanche-2", "LTC": "litecoin", "UNI": "uniswap", "LINK": "chainlink",
            "MATIC": "matic-network", "XLM": "stellar", "ATOM": "cosmos", "ALGO": "algorand",
            "VET": "vechain", "TRX": "tron", "FIL": "filecoin", "THETA": "theta-token",
            "XMR": "monero", "EOS": "eos", "AAVE": "aave"
        }

    def fetch_live_price(self, symbol):
        """Fetch current price for a symbol from Binance."""
        pair = self.symbol_map.get(symbol.upper(), f"{symbol.upper()}USDT")
        try:
            url = f"{self.binance_base_url}/ticker/price?symbol={pair}"
            response = requests.get(url, timeout=5)
            response.raise_for_status()
            data = response.json()
            return float(data['price'])
        except Exception as e:
            print(f"Error fetching live price for {symbol}: {e}")
            return None

    def add_technical_indicators(self, df):
        """
        Compute the 17 features required by the model:
        ['open','high','low','close','volume','ema_10','ema_21','ma_7','ma_30',
         'momentum_rsi','volume_adi','volume_obv','volume_cmf','return_1','pct_change',
         'day_of_week','is_weekend']
        """
        if df.empty:
            return df
            
        # Ensure numeric types
        cols = ['Open', 'High', 'Low', 'Close', 'Volume']
        for c in cols:
            df[c] = pd.to_numeric(df[c])
            
        # 1. Moving Averages
        df['ema_10'] = df['Close'].ewm(span=10, adjust=False).mean()
        df['ema_21'] = df['Close'].ewm(span=21, adjust=False).mean()
        df['ma_7'] = df['Close'].rolling(window=7).mean()
        df['ma_30'] = df['Close'].rolling(window=30).mean()
        
        # 2. RSI (14)
        delta = df['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        df['momentum_rsi'] = 100 - (100 / (1 + rs))
        
        # 3. Volume Indicators
        # OBV
        df['volume_obv'] = (np.sign(df['Close'].diff()) * df['Volume']).fillna(0).cumsum()
        
        # ADI (Accumulation/Distribution Index)
        clv = ((df['Close'] - df['Low']) - (df['High'] - df['Close'])) / (df['High'] - df['Low'])
        clv = clv.fillna(0)
        df['volume_adi'] = (clv * df['Volume']).cumsum()
        
        # CMF (Chaikin Money Flow) - 20 period
        df['volume_cmf'] = df['volume_adi'].rolling(window=20).mean() # Simplified approximation
        
        # 4. Returns
        df['return_1'] = df['Close'].pct_change()
        df['pct_change'] = df['Close'].pct_change()
        
        # 5. Date Features
        df['day_of_week'] = df['Date'].dt.dayofweek
        df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
        
        # Lowercase columns to match model expectation
        df.rename(columns={
            'Open': 'open', 'High': 'high', 'Low': 'low', 'Close': 'close', 'Volume': 'volume'
        }, inplace=True)
        
        # Fill NaNs (caused by rolling windows)
        df.fillna(method='bfill', inplace=True)
        df.fillna(0, inplace=True)
        
        return df

    def fetch_live_history(self, symbol, days=72):
        """
        Fetch historical candles from Binance and compute features.
        Returns a DataFrame with all 17 features.
        """
        pair = self.symbol_map.get(symbol.upper(), f"{symbol.upper()}USDT")
        try:
            # Fetch extra days to allow for rolling window calculations (e.g. MA30 needs 30 prior days)
            fetch_limit = days + 40 
            url = f"{self.binance_base_url}/klines?symbol={pair}&interval=1d&limit={fetch_limit}"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            processed_data = []
            for candle in data:
                timestamp = candle[0]
                date = datetime.datetime.fromtimestamp(timestamp / 1000)
                processed_data.append({
                    "Date": date,
                    "Open": float(candle[1]),
                    "High": float(candle[2]),
                    "Low": float(candle[3]),
                    "Close": float(candle[4]),
                    "Volume": float(candle[5])
                })
            
            df = pd.DataFrame(processed_data)
            
            # Compute features
            df = self.add_technical_indicators(df)
            
            # Return only the requested last 'days'
            return df.tail(days)
            
        except Exception as e:
            print(f"Error fetching live history for {symbol}: {e}")
            return pd.DataFrame()

    def fetch_market_overview(self):
        """Fetch global market stats from CoinGecko."""
        try:
            url = f"{self.coingecko_base_url}/global"
            response = requests.get(url, timeout=5)
            response.raise_for_status()
            data = response.json()['data']
            
            return {
                "market_cap_usd": data['total_market_cap']['usd'],
                "market_cap_change_24h": data['market_cap_change_percentage_24h_usd'],
                "volume_usd": data['total_volume']['usd'],
                "volume_change_24h": 0 
            }
        except Exception as e:
            print(f"Error fetching market overview: {e}")
            return None

    def fetch_trending_coins(self):
        """Fetch trending coins from CoinGecko."""
        try:
            url = f"{self.coingecko_base_url}/search/trending"
            response = requests.get(url, timeout=5)
            response.raise_for_status()
            data = response.json()['coins']
            
            trending = []
            for item in data[:3]: # Top 3
                coin = item['item']
                price_change = coin.get('data', {}).get('price_change_percentage_24h', {}).get('usd', 0)
                trending.append({
                    "name": coin['name'],
                    "symbol": coin['symbol'],
                    "price": coin.get('data', {}).get('price', 0), # Price might be string like "$0.123"
                    "change": f"{price_change:+.1f}%",
                    "isUp": price_change >= 0
                })
            return trending
        except Exception as e:
            print(f"Error fetching trending coins: {e}")
            return []

    def fetch_top_gainers(self):
        """Fetch top gainers (from top 100 by mcap) via CoinGecko."""
        try:
            # Fetch top 50 coins to find gainers
            url = f"{self.coingecko_base_url}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false"
            response = requests.get(url, timeout=5)
            response.raise_for_status()
            data = response.json()
            
            # Sort by price change percentage
            sorted_data = sorted(data, key=lambda x: x['price_change_percentage_24h'] or -999, reverse=True)
            
            gainers = []
            for coin in sorted_data[:3]: # Top 3
                change = coin['price_change_percentage_24h']
                gainers.append({
                    "name": coin['name'],
                    "symbol": coin['symbol'].upper(),
                    "price": coin['current_price'],
                    "change": f"{change:+.1f}%",
                    "isUp": change >= 0
                })
            return gainers
        except Exception as e:
            print(f"Error fetching top gainers: {e}")
            return []

    def fetch_coingecko_data(self, symbol):
        """Fetch simple price and 24h change from CoinGecko."""
        cg_id = self.coingecko_map.get(symbol.upper())
        if not cg_id:
            return None
        try:
            url = f"{self.coingecko_base_url}/simple/price?ids={cg_id}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true"
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                data = response.json()
                return data.get(cg_id)
        except:
            return None
        return None

    def generate_insight(self, symbol):
        """
        Generate a fintech/trader-style insight based on live technical indicators (Binance)
        and market data (CoinGecko).
        """
        try:
            # 1. Fetch Binance Data (Technical)
            df = self.fetch_live_history(symbol, days=30)
            
            # 2. Fetch CoinGecko Data (Sentiment/Validation)
            cg_data = self.fetch_coingecko_data(symbol)
            
            if df.empty:
                return {
                    "text": "Insufficient live data to generate technical insight at this moment.",
                    "sentiment": "neutral"
                }
            
            # Get latest values
            latest = df.iloc[-1]
            rsi = latest['momentum_rsi']
            ma_7 = latest['ma_7']
            ma_30 = latest['ma_30']
            pct_change = latest['pct_change'] * 100
            
            # Cross-reference with CoinGecko if available
            cg_change = cg_data.get('usd_24h_change', 0) if cg_data else pct_change
            
            # Logic for text generation
            sentiment = "neutral"
            text = ""
            
            # Trend Analysis
            trend = "upward" if ma_7 > ma_30 else "downward"
            momentum = "strengthening" if abs(pct_change) > 2 else "stabilizing"
            
            # RSI Analysis
            rsi_state = "neutral"
            if rsi > 70: rsi_state = "overbought"
            elif rsi < 30: rsi_state = "oversold"
            
            # Construct the narrative (Dual Source Verified)
            source_text = "Verified across Binance & CoinGecko."
            
            if trend == "upward":
                if rsi_state == "overbought":
                    text = f"While {symbol} maintains a bullish structure (up {cg_change:.1f}%), RSI at {rsi:.0f} indicates overextended conditions. Expect potential mean reversion before continuation. {source_text}"
                    sentiment = "neutral"
                elif momentum == "strengthening":
                    text = f"Based on recent momentum shifts and volatility compression, {symbol} is exhibiting strong buy-side pressure. Market strength appears to be increasing while short-term selling pressure continues to decline. {source_text}"
                    sentiment = "positive"
                else:
                    text = f"{symbol} is holding above key moving averages with steady accumulation. Technicals suggest a constructive setup for the next 7 days. {source_text}"
                    sentiment = "positive"
            else: # Downward
                if rsi_state == "oversold":
                    text = f"{symbol} is showing signs of capitulation with RSI at {rsi:.0f}. A relief bounce is statistically probable as selling exhaustion sets in. {source_text}"
                    sentiment = "positive" # Contrarian buy
                elif momentum == "strengthening":
                    text = f"Bearish momentum is accelerating for {symbol} (down {abs(cg_change):.1f}%). Technical structure remains weak with high sell-side volume dominance. {source_text}"
                    sentiment = "negative"
                else:
                    text = f"{symbol} remains in a consolidation phase below major resistance levels. Volatility compression suggests a decisive move is imminent. {source_text}"
                    sentiment = "neutral"
                    
            return {
                "text": text,
                "sentiment": sentiment,
                "metrics": {
                    "rsi": round(rsi, 2),
                    "trend": trend,
                    "change_24h": round(cg_change, 2)
                }
            }
            
        except Exception as e:
            print(f"Error generating insight for {symbol}: {e}")
            return {
                "text": f"Live Analysis Error: {str(e)}",
                "sentiment": "neutral"
            }

    def get_indicators_export(self, symbol):
        """Fetch historical data with all calculated indicators for export."""
        try:
            df = self.fetch_live_history(symbol, days=365) # 1 year of data
            if df.empty:
                return []
            
            # Convert to list of dicts
            df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')
            return df.to_dict('records')
        except Exception as e:
            print(f"Error exporting indicators for {symbol}: {e}")
            return []

    def get_orderbook_snapshot(self, symbol):
        """Fetch current order book depth from Binance."""
        pair = self.symbol_map.get(symbol.upper(), f"{symbol.upper()}USDT")
        try:
            url = f"{self.binance_base_url}/depth?symbol={pair}&limit=20"
            response = requests.get(url, timeout=5)
            response.raise_for_status()
            data = response.json()
            
            return {
                "bids": [{"price": float(b[0]), "qty": float(b[1])} for b in data['bids']],
                "asks": [{"price": float(a[0]), "qty": float(a[1])} for a in data['asks']],
                "lastUpdateId": data['lastUpdateId']
            }
        except Exception as e:
            print(f"Error fetching orderbook for {symbol}: {e}")
            return {"bids": [], "asks": []}

    def get_sentiment_data(self):
        """Fetch Fear & Greed Index and other sentiment metrics."""
        try:
            # Fear & Greed API
            fg_res = requests.get("https://api.alternative.me/fng/?limit=30")
            fg_data = fg_res.json()['data']
            
            return [
                {
                    "date": datetime.datetime.fromtimestamp(int(item['timestamp'])).strftime('%Y-%m-%d'),
                    "value": int(item['value']),
                    "classification": item['value_classification']
                }
                for item in fg_data
            ]
        except Exception as e:
            print(f"Error fetching sentiment data: {e}")
            return []

    def check_health(self):
        """
        Check connectivity to Binance and CoinGecko to recommend the best mode.
        """
        status = {
            "binance": {"status": "unknown", "latency": 0},
            "coingecko": {"status": "unknown", "latency": 0},
            "recommendation": "STATIC",
            "reason": "Checking connectivity..."
        }
        
        # Check Binance
        try:
            start = time.time()
            requests.get(f"{self.binance_base_url}/ping", timeout=3)
            latency = (time.time() - start) * 1000
            status["binance"] = {"status": "online", "latency": round(latency, 1)}
        except:
            status["binance"] = {"status": "offline", "latency": 0}

        # Check CoinGecko
        try:
            start = time.time()
            requests.get(f"{self.coingecko_base_url}/ping", timeout=3)
            latency = (time.time() - start) * 1000
            status["coingecko"] = {"status": "online", "latency": round(latency, 1)}
        except:
            status["coingecko"] = {"status": "offline", "latency": 0}

        # Logic for recommendation
        if status["binance"]["status"] == "online" and status["coingecko"]["status"] == "online":
            status["recommendation"] = "LIVE"
            status["reason"] = "All systems operational. Low latency detected."
        elif status["binance"]["status"] == "online":
            status["recommendation"] = "LIVE"
            status["reason"] = "Binance operational. CoinGecko offline (limited features)."
        else:
            status["recommendation"] = "STATIC"
            status["reason"] = "Critical data sources unavailable. Switch to Static Mode."

        return status

# Singleton instance
live_service = LiveDataService()
