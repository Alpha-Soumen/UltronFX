# app.py (UltronFX Full API Pack)

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import uvicorn
import time
import pandas as pd
import datetime
from fastapi.middleware.cors import CORSMiddleware

from inference import (
    load_model,
    predict_7day,
    predict_today,
    predict_bulk,
    predict_all,
    get_history,
    get_risk_score,
    get_trending,
    compare_two,
    get_stats,
    infer_coin_list_from_scalers
)
from auth import router as auth_router

app = FastAPI(
    title="UltronFX Full API Pack",
    description="Crypto 7-Day Forecast API using TransformerV3",
    version="2.0"
)

# Include Auth Router
app.include_router(auth_router, tags=["authentication"])

from feedback import router as feedback_router
app.include_router(feedback_router, tags=["feedback"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://127.0.0.1:5176"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    print(f"Request: {request.url.path} took {process_time:.4f}s")
    return response

# ------------- Startup ------------------

MODEL, COIN_TO_ID, ID_TO_COIN = load_model(device="cpu")
COIN_LIST = sorted(infer_coin_list_from_scalers())
START_TIME = time.time()


# ------------- Models --------------------

class PredictRequest(BaseModel):
    coin: str
    window: List[List[float]]   # seq_len x features


class CompareRequest(BaseModel):
    coin1: str
    coin2: str
    window1: List[List[float]]
    window2: List[List[float]]


class BulkRequest(BaseModel):
    coins: List[str]
    windows: Dict[str, List[List[float]]]


# ------------- Endpoints ---------------------

from live_data_service import live_service

# Global Data Mode: 'STATIC' or 'LIVE'
DATA_MODE = "STATIC"

class ModeRequest(BaseModel):
    mode: str

# ------------- Endpoints ---------------------

@app.get("/admin/mode")
def get_mode():
    return {"mode": DATA_MODE}

@app.post("/admin/mode")
def set_mode(req: ModeRequest):
    global DATA_MODE
    if req.mode.upper() not in ["STATIC", "LIVE"]:
        raise HTTPException(400, "Mode must be 'STATIC' or 'LIVE'")
    DATA_MODE = req.mode.upper()
    return {"status": "success", "mode": DATA_MODE}

@app.get("/admin/health")
def get_health():
    """
    Get system health and mode recommendation.
    """
    return live_service.check_health()

@app.get("/market-overview")
def market_overview():
    if DATA_MODE == "LIVE":
        data = live_service.fetch_market_overview()
        if data:
            # Fetch trending and gainers
            trending = live_service.fetch_trending_coins()
            gainers = live_service.fetch_top_gainers()
            
            data['trending'] = trending
            data['top_gainers'] = gainers
            return data
    
    # Static fallback (simulated data matching frontend)
    return {
        "market_cap_usd": 3040000000000,
        "market_cap_change_24h": 3.1,
        "volume_usd": 111650000000,
        "volume_change_24h": -5.2,
        "trending": [
            { "name": "Ergo", "symbol": "ERG", "price": 0.5409, "change": "+19.7%", "isUp": True },
            { "name": "Firo", "symbol": "FIRO", "price": 2.63, "change": "+26.2%", "isUp": True },
            { "name": "Zcash", "symbol": "ZEC", "price": 572.81, "change": "+13.8%", "isUp": True },
        ],
        "top_gainers": [
            { "name": "Pippin", "symbol": "PIP", "price": 0.05792, "change": "+155.4%", "isUp": True },
            { "name": "Tensor", "symbol": "TNSR", "price": 0.1805, "change": "+71.9%", "isUp": True },
            { "name": "Artificial Liquid", "symbol": "ALI", "price": 0.003298, "change": "+44.1%", "isUp": True },
        ]
    }

@app.get("/coins")
def list_coins():
    return {"coins": COIN_LIST}


@app.post("/predict")
def predict(req: PredictRequest):
    if req.coin not in COIN_LIST:
        raise HTTPException(400, f"Unknown coin: {req.coin}")
    
    window = req.window
    
    # LIVE MODE LOGIC: Fetch fresh 72-day window
    if DATA_MODE == "LIVE":
        try:
            # Fetch last 72 days with all features computed
            df = live_service.fetch_live_history(req.coin, days=72)
            
            if not df.empty and len(df) >= 72:
                # Ensure columns are in the exact order expected by the model
                feature_cols = [
                    'open','high','low','close','volume','ema_10','ema_21','ma_7','ma_30',
                    'momentum_rsi','volume_adi','volume_obv','volume_cmf','return_1','pct_change',
                    'day_of_week','is_weekend'
                ]
                
                # Select and convert to list of lists
                # df[feature_cols] might have some NaNs if not fully filled, but add_technical_indicators handles bfill/fillna(0)
                live_window = df[feature_cols].values.tolist()
                
                if len(live_window) == 72:
                    print(f"LIVE PREDICTION: Using real-time data for {req.coin}")
                    window = live_window
                else:
                    print(f"LIVE PREDICTION WARNING: Insufficient live data ({len(live_window)} rows). Using static fallback.")
            else:
                print(f"LIVE PREDICTION WARNING: Failed to fetch live data. Using static fallback.")
                
        except Exception as e:
            print(f"LIVE PREDICTION ERROR: {e}. Using static fallback.")

    preds = predict_7day(MODEL, req.coin, window)
    return {"coin": req.coin, "pred_7": preds}


@app.post("/predict/today")
def predict_single_today(req: PredictRequest):
    if req.coin not in COIN_LIST:
        raise HTTPException(400, f"Unknown coin: {req.coin}")
        
    window = req.window
    
    # LIVE MODE LOGIC: Fetch fresh 72-day window
    if DATA_MODE == "LIVE":
        try:
            df = live_service.fetch_live_history(req.coin, days=72)
            if not df.empty and len(df) >= 72:
                feature_cols = [
                    'open','high','low','close','volume','ema_10','ema_21','ma_7','ma_30',
                    'momentum_rsi','volume_adi','volume_obv','volume_cmf','return_1','pct_change',
                    'day_of_week','is_weekend'
                ]
                live_window = df[feature_cols].values.tolist()
                if len(live_window) == 72:
                    window = live_window
        except Exception as e:
            print(f"LIVE PREDICTION ERROR: {e}")

    pred = predict_today(MODEL, req.coin, window)
    return {"coin": req.coin, "today_prediction": pred}


@app.post("/predict/bulk")
def bulk(req: BulkRequest):
    return predict_bulk(MODEL, req.coins, req.windows)


@app.get("/predict/all")
def pred_all():
    return predict_all(MODEL, COIN_LIST)


@app.get("/model/info")
def model_info():
    return {
        "model": "TransformerV3",
        "input_dim": 8,
        "output_dim": 1,
        "seq_len": 72,
        "status": "Loaded",
        "data_mode": DATA_MODE
    }


@app.get("/history/{coin}")
def history(coin: str):
    if coin not in COIN_LIST:
        raise HTTPException(400, f"Unknown coin: {coin}")
    
    if DATA_MODE == "LIVE":
        df = live_service.fetch_live_history(coin)
        if not df.empty:
            # Convert to same format as get_history
            # get_history returns {"data": [{"x": date, "y": [open, high, low, close], "volume": vol}, ...]}
            result = []
            for _, row in df.iterrows():
                result.append({
                    "x": row['Date'].strftime('%Y-%m-%d'),
                    "y": [row['Open'], row['High'], row['Low'], row['Close']],
                    "volume": row['Volume']
                })
            return {"coin": coin, "data": result, "source": "LIVE"}
            
    # Static Mode (Default)
    return get_history(coin)


@app.get("/risk/{coin}")
def risk(coin: str):
    if coin not in COIN_LIST:
        raise HTTPException(400, f"Unknown coin: {coin}")
    return {"coin": coin, "risk_score": get_risk_score(coin)}


@app.get("/insights/{coin}")
def get_insights(coin: str):
    """
    Get AI-generated market insights based on live data.
    """
    if coin not in COIN_LIST:
        raise HTTPException(400, f"Unknown coin: {coin}")
        
    if DATA_MODE == "LIVE":
        return live_service.generate_insight(coin)
    
    # Static Fallback
    return {
        "text": f"Based on historical patterns, {coin} shows strong accumulation in the $2000-$2200 range. Institutional interest remains high with steady volume growth.",
        "sentiment": "positive",
        "metrics": {"rsi": 55.4, "trend": "upward", "change_24h": 1.2}
    }


@app.get("/export/indicators/{coin}")
def export_indicators(coin: str):
    """Export technical indicators (RSI, MACD, etc.)"""
    if coin not in COIN_LIST:
        raise HTTPException(400, f"Unknown coin: {coin}")

    if DATA_MODE == "LIVE":
        return live_service.get_indicators_export(coin)
    
    # Static Mode: Fetch history and compute indicators
    hist = get_history(coin) # {"data": [{"x":..., "y":...}]}
    if not hist or "data" not in hist:
        return []
    
    # Convert to DataFrame for calculation
    data = []
    for row in hist["data"]:
        data.append({
            "Date": pd.to_datetime(row["x"]),
            "Open": row["y"][0],
            "High": row["y"][1],
            "Low": row["y"][2],
            "Close": row["y"][3],
            "Volume": row["volume"]
        })
    df = pd.DataFrame(data)
    df = live_service.add_technical_indicators(df)
    
    # Format for export
    df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')
    return df.to_dict('records')


@app.get("/export/sentiment")
def export_sentiment():
    """Export market sentiment data."""
    if DATA_MODE == "LIVE":
        return live_service.get_sentiment_data()
    
    # Static Mock Data
    return [
        {"date": "2025-10-25", "value": 65, "classification": "Greed"},
        {"date": "2025-10-24", "value": 62, "classification": "Greed"},
        {"date": "2025-10-23", "value": 55, "classification": "Neutral"},
        {"date": "2025-10-22", "value": 48, "classification": "Neutral"},
        {"date": "2025-10-21", "value": 40, "classification": "Fear"},
    ]


@app.get("/export/orderbook/{coin}")
def export_orderbook(coin: str):
    """Export order book snapshot."""
    if coin not in COIN_LIST:
        raise HTTPException(400, f"Unknown coin: {coin}")

    if DATA_MODE == "LIVE":
        return live_service.get_orderbook_snapshot(coin)
    
    # Static Mock Data
    return {
        "bids": [{"price": 95000.5, "qty": 0.5}, {"price": 95000.0, "qty": 1.2}, {"price": 94995.0, "qty": 2.5}],
        "asks": [{"price": 95005.0, "qty": 0.8}, {"price": 95010.0, "qty": 1.5}, {"price": 95015.0, "qty": 3.0}],
        "lastUpdateId": 123456789
    }


@app.get("/trending")
def trending():
    return get_trending(MODEL, COIN_LIST)


@app.post("/predict/compare")
def compare(req: CompareRequest):
    return compare_two(MODEL, req)


@app.get("/health")
def health():
    uptime = time.time() - START_TIME
    return {"status": "OK", "uptime_sec": uptime, "mode": DATA_MODE}


@app.get("/version")
def version():
    return {"api_version": "2.0", "model_version": "TransformerV3"}


@app.get("/stats")
def stats():
    return get_stats(MODEL, COIN_LIST)


@app.get("/logs")
def logs():
    return {"logs": ["logging system can be added here"]}


# --------------- Main -----------------------

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
