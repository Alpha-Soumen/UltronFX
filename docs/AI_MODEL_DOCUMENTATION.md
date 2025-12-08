# 🤖 UltronFX AI Model Package

![PyTorch](https://img.shields.io/badge/PyTorch-2.1-EE4C2C?style=for-the-badge&logo=pytorch)
![Status](https://img.shields.io/badge/Status-Production-green?style=for-the-badge)

## 📖 Overview
The **Crypto Model Package** is the production artifact store for the UltronFX AI. It contains the serialized knowledge of the system, including the trained Neural Network weights and the data normalization scalers required for inference.

**Path**: `./crypto_model_package/`

---

## 🧠 Model Architecture: Transformer V3

The core model is a custom **Time-Series Transformer** designed specifically for financial forecasting. It adapts the self-attention mechanism to identify complex temporal dependencies in market data.

### Technical Specifications
| Parameter | Value | Description |
| :--- | :--- | :--- |
| **Architecture** | Transformer Encoder | Based on "Attention Is All You Need" (Vaswani et al.). |
| **Input Window** | 72 Days | The model looks back at the last 72 days of data. |
| **Forecast Horizon** | 7 Days | The model predicts the next 7 days of closing prices. |
| **d_model** | 256 | Dimension of the internal vector representation. |
| **n_heads** | 8 | Number of parallel attention heads. |
| **num_layers** | 4 | Number of stacked Transformer encoder layers. |
| **Dropout** | 0.1 | Regularization rate to prevent overfitting. |

---

## 📂 Package Contents

This directory MUST contain the following files for the backend to function:

```text
crypto_model_package/
├── best-v3-seed42_state_dict.pth   # 🧠 The Trained Model Weights (PyTorch)
├── coin_Bitcoin_scaler.pkl         # ⚖️ Scikit-Learn Scaler for Bitcoin
├── coin_Ethereum_scaler.pkl        # ⚖️ Scikit-Learn Scaler for Ethereum
├── ... (other coin scalers)
└── pred_results.json               # 📊 Validation metrics from training
```

> [!IMPORTANT]
> **Do not rename or delete these files.** The `inference.py` script relies on the naming convention `coin_{Name}_scaler.pkl` to dynamically load supported assets.

---

## 🔄 Inference Workflow

How the model turns raw data into a prediction:

```mermaid
sequenceDiagram
    participant API as API Request
    participant Scaler as Data Scaler
    participant Model as Transformer V3
    participant Output as JSON Response

    API->>Scaler: Raw Prices (e.g., $50,000)
    Note over Scaler: MinMax Scaling (0-1)
    Scaler->>Model: Normalized Tensor [0.85, 0.86...]
    Note over Model: Self-Attention & Feed Forward
    Model->>Scaler: Prediction Tensor [0.88, 0.89...]
    Note over Scaler: Inverse Transform
    Scaler->>Output: Predicted Prices ($52,000...)
```

---

## 🛠️ Maintenance

### Updating the Model
To deploy a new version of the AI:

1.  **Train** the new model in the `./research/` environment.
2.  **Export** the `state_dict.pth` and all `_scaler.pkl` files.
3.  **Replace** the existing files in this directory.
4.  **Restart** the Backend service.

### Adding New Assets
To add support for a new cryptocurrency (e.g., Solana):
1.  Train the model on Solana data.
2.  Generate `coin_Solana_scaler.pkl`.
3.  Place the file in this directory.
4.  The backend will automatically detect and support `SOL` on the next restart.
