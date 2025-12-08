import joblib
from pathlib import Path
import sklearn

print(f"Sklearn version: {sklearn.__version__}")

scaler_path = Path("../crypto_model_package/coin_Bitcoin_scaler.pkl")
if not scaler_path.exists():
    print(f"Scaler not found at {scaler_path}")
    exit(1)

try:
    scaler = joblib.load(scaler_path)
    print(f"Scaler type: {type(scaler)}")
    if hasattr(scaler, "n_features_in_"):
        print(f"n_features_in_: {scaler.n_features_in_}")
    else:
        print("Scaler does not have n_features_in_ attribute")
        
    if hasattr(scaler, "center_"):
        print(f"center_ shape: {scaler.center_.shape}")
    if hasattr(scaler, "scale_"):
        print(f"scale_ shape: {scaler.scale_.shape}")
        
except Exception as e:
    print(f"Error loading scaler: {e}")
