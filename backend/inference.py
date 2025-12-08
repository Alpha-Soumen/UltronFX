# inference.py (UltronFX Full API Pack)

import torch
import numpy as np
import joblib
from pathlib import Path
from model import TransformerV3
import random

# Adjust model folder
MODEL_DIR = Path(__file__).resolve().parent / "crypto_model_package"
SCALER_DIR = MODEL_DIR

SEQ_LEN = 72
PRED_LEN = 7
NUM_FEATURES = 17

FEATURE_COLS = [
    'open','high','low','close','volume','ema_10','ema_21','ma_7','ma_30',
    'momentum_rsi','volume_adi','volume_obv','volume_cmf','return_1','pct_change',
    'day_of_week','is_weekend'
]


# ----------------------------------------------------
# SCALER + MODEL LOADING
# ----------------------------------------------------
def infer_coin_list_from_scalers():
    files = sorted([p.name for p in SCALER_DIR.glob("*.pkl")])
    coins = [f.replace("_scaler.pkl", "") for f in files if f.endswith("_scaler.pkl")]
    return coins


def load_scaler(coin_name: str):
    p = SCALER_DIR / f"{coin_name}_scaler.pkl"
    if not p.exists():
        raise FileNotFoundError(f"Scaler not found: {p}")
    return joblib.load(p)


def load_model(seed_choice="best-v3-seed42", device='cpu'):
    weight_file = MODEL_DIR / f"{seed_choice}_state_dict.pth"
    if not weight_file.exists():
        raise FileNotFoundError(f"Missing checkpoint {weight_file}")

    coins = infer_coin_list_from_scalers()
    num_series = len(coins)

    model = TransformerV3(
        num_features=NUM_FEATURES,
        num_series=num_series,
        d_model=256,
        nhead=8,
        num_layers=4,
        pred_len=PRED_LEN,
        lr=3e-4,
        weight_decay=1e-5,
        dropout=0.1
    )

    sd = torch.load(weight_file, map_location=device)
    if isinstance(sd, dict) and "state_dict" in sd:
        # remove Lightning prefix if exists
        sd = {k.replace("model.", ""): v for k, v in sd["state_dict"].items()}

    model.load_state_dict(sd)
    model.to(device)
    model.eval()

    coin_to_id = {c: i for i, c in enumerate(sorted(coins))}
    id_to_coin = {v: k for k, v in coin_to_id.items()}
    return model, coin_to_id, id_to_coin


# ----------------------------------------------------
# PREPROCESSING
# ----------------------------------------------------
def preprocess_window(window):
    if isinstance(window, list):
        arr = np.array(window, dtype=float)
    else:
        arr = np.array(window)

    if arr.shape != (SEQ_LEN, NUM_FEATURES):
        raise ValueError(f"Expected window shape {(SEQ_LEN, NUM_FEATURES)}, got {arr.shape}")

    return arr


# ----------------------------------------------------
# 7-DAY PREDICTION (MAIN)
# ----------------------------------------------------
def predict_7day(model, coin_name, window, device='cpu'):
    scaler = load_scaler(coin_name)
    arr = preprocess_window(window)

    # Fix: Scaler expects 15 features, but we have 17.
    # The last 2 are day_of_week and is_weekend, which are likely not scaled.
    # We split, scale the first 15, and concat back.
    if arr.shape[1] == 17 and scaler.n_features_in_ == 15:
        feats_to_scale = arr[:, :15]
        feats_static = arr[:, 15:]
        scaled_part = scaler.transform(feats_to_scale)
        arr_scaled = np.hstack([scaled_part, feats_static])
    else:
        # Fallback if shapes match or other case
        arr_scaled = scaler.transform(arr)

    x = torch.tensor(arr_scaled, dtype=torch.float32, device=device).unsqueeze(0)

    coins = sorted(infer_coin_list_from_scalers())
    series_id = coins.index(coin_name)
    s = torch.tensor([series_id], dtype=torch.long, device=device)

    with torch.no_grad():
        out = model(x, s).cpu().numpy().reshape(-1)

    close_idx = FEATURE_COLS.index("close")
    
    # Fix: Inverse transform also needs 15 features
    if scaler.n_features_in_ == 15:
        dummy = np.zeros((len(out), 15))
        dummy[:, close_idx] = out
        inv = scaler.inverse_transform(dummy)[:, close_idx]
    else:
        dummy = np.zeros((len(out), len(FEATURE_COLS)))
        dummy[:, close_idx] = out
        inv = scaler.inverse_transform(dummy)[:, close_idx]
        
    return inv.tolist()


# ----------------------------------------------------
# TODAY PREDICTION
# ----------------------------------------------------
def predict_today(model, coin_name, window, device='cpu'):
    """Return only the next day's price."""
    preds = predict_7day(model, coin_name, window, device)
    return preds[0]


# ----------------------------------------------------
# BULK PREDICTION
# ----------------------------------------------------
def predict_bulk(model, coins, windows, device='cpu'):
    results = {}
    for coin in coins:
        if coin not in windows:
            results[coin] = {"error": "No window provided"}
            continue
        try:
            preds = predict_7day(model, coin, windows[coin], device)
            results[coin] = preds
        except Exception as e:
            results[coin] = {"error": str(e)}
    return results


# ----------------------------------------------------
# PREDICT ALL COINS (ZERO WINDOW PLACEHOLDER)
# ----------------------------------------------------
def predict_all(model, all_coins, device='cpu'):
    """WARNING: uses zero window (demo only)"""
    out = {}
    zero = np.zeros((SEQ_LEN, NUM_FEATURES)).tolist()

    for coin in all_coins:
        try:
            out[coin] = predict_7day(model, coin, zero, device)
        except Exception as e:
            out[coin] = {"error": str(e)}
    return out


# ----------------------------------------------------
# HISTORY (REAL DATA FROM CSV)
# ----------------------------------------------------
import pandas as pd
from datetime import datetime

DATASET_PATH = Path(__file__).resolve().parents[1] / "research" / "my_cypto_dataset.csv"
_HISTORY_CACHE = None
_COIN_CACHE = {}

def load_history_data():
    global _HISTORY_CACHE
    if _HISTORY_CACHE is not None:
        return _HISTORY_CACHE
    
    if not DATASET_PATH.exists():
        print(f"Warning: Dataset not found at {DATASET_PATH}")
        return pd.DataFrame()

    df = pd.read_csv(DATASET_PATH)
    # Parse dates: Auto-detect format (handles both DD-MM-YYYY and YYYY-MM-DD)
    df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
    _HISTORY_CACHE = df
    return df

def get_history(coin):
    """Return historical OHLCV data for the coin."""
    df = load_history_data()
    if df.empty:
        return {"error": "Dataset not available"}

    # Check coin cache
    if coin in _COIN_CACHE:
        return _COIN_CACHE[coin]

    # Filter by coin
    coin_df = df[df['Coin'] == coin].copy()
    
    if coin_df.empty:
        return {"error": f"No history found for {coin}"}

    # Sort by date
    coin_df = coin_df.sort_values('Date')

    # Format for ApexCharts (Timestamp in ms, or ISO string)
    # Vectorized approach is much faster than iterrows
    # We need to rename columns to match expected format
    temp_df = coin_df[['Date', 'Open', 'High', 'Low', 'Close', 'Volume']].copy()
    temp_df['x'] = temp_df['Date'].apply(lambda d: d.isoformat())
    temp_df['y'] = temp_df[['Open', 'High', 'Low', 'Close']].values.tolist()
    
    # Rename Volume to lowercase volume
    data = temp_df[['x', 'y', 'Volume']].rename(columns={'Volume': 'volume'}).to_dict('records')
    
    result = {
        "coin": coin,
        "data": data
    }
    _COIN_CACHE[coin] = result
    return result


# ----------------------------------------------------
# RISK SCORE (FAKE MODEL)
# ----------------------------------------------------
def get_risk_score(coin):
    """0-100 random risk score (placeholder)."""
    return random.randint(10, 95)


# ----------------------------------------------------
# TRENDING COINS
# ----------------------------------------------------
def get_trending(model, coins):
    """Demo trending coins."""
    return {
        "top_gainers": random.sample(coins, 5),
        "top_losers": random.sample(coins, 5)
    }


# ----------------------------------------------------
# COMPARE TWO COINS
# ----------------------------------------------------
def compare_two(model, req):
    p1 = predict_7day(model, req.coin1, req.window1)
    p2 = predict_7day(model, req.coin2, req.window2)
    return {req.coin1: p1, req.coin2: p2}


# ----------------------------------------------------
# STATISTICS
# ----------------------------------------------------
def get_stats(model, coins):
    """Fake model quality stats."""
    return {
        "num_coins": len(coins),
        "seq_len": SEQ_LEN,
        "num_features": NUM_FEATURES,
        "prediction_len": PRED_LEN,
        "model_parameters": sum(p.numel() for p in model.parameters()),
    }


# ----------------------------------------------------
# SMOKE TEST
# ----------------------------------------------------
if __name__ == "__main__":
    model, c2id, id2c = load_model()
    print("Loaded coins:", list(c2id.keys()))
    dummy = np.zeros((SEQ_LEN, NUM_FEATURES)).tolist()
    coin = list(c2id.keys())[0]
    preds = predict_7day(model, coin, dummy)
    print("Pred:", preds)
