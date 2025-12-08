# 🧪 UltronFX Research Lab

![Jupyter](https://img.shields.io/badge/Jupyter-Lab-F37626?style=for-the-badge&logo=jupyter)
![Pandas](https://img.shields.io/badge/Pandas-2.0-150458?style=for-the-badge&logo=pandas)
![Status](https://img.shields.io/badge/Status-Experimental-yellow?style=for-the-badge)

## 📖 Overview
The **Research Folder** is the experimental sandbox for the UltronFX project. It serves as the staging ground for model development, hyperparameter tuning, and backtesting. Code and models in this directory are **not** part of the live production pipeline until manually deployed.

**Path**: `./research/`

---

## 📂 Contents

| File | Description |
| :--- | :--- |
| **`final.ipynb`** | The master Jupyter Notebook containing the full training pipeline, from data loading to model export. |
| **`my_cypto_dataset.csv`** | The historical OHLCV (Open, High, Low, Close, Volume) dataset used for training. |

---

## 📊 Dataset Specifications

The model requires a specific data structure to train effectively.

| Column | Type | Description |
| :--- | :--- | :--- |
| `Date` | DateTime | The timestamp of the record. |
| `Open` | Float | Opening price of the day. |
| `High` | Float | Highest price of the day. |
| `Low` | Float | Lowest price of the day. |
| `Close` | Float | Closing price (Target Variable). |
| `Volume` | Float | Total trading volume. |
| `CoinName` | String | Identifier for the asset (e.g., "Bitcoin"). |

---

## ⚙️ Training Pipeline

The `final.ipynb` notebook implements the following workflow:

1.  **Data Ingestion**: Loads the CSV and filters for selected assets.
2.  **Feature Engineering**:
    *   Calculates Technical Indicators: RSI (14), MACD, EMA (10, 21).
    *   Generates Time Features: Day of Week, Month.
3.  **Preprocessing**:
    *   Applies `MinMaxScaler` to normalize all features to `[0, 1]`.
    *   Creates sliding windows (Sequence Length: 72, Prediction Length: 7).
4.  **Model Training**:
    *   Initializes `TransformerV3`.
    *   Optimizes using `AdamW` with Learning Rate Scheduling.
    *   Loss Function: `MSELoss` (Mean Squared Error).
5.  **Evaluation**:
    *   Calculates **MAE** (Mean Absolute Error) and **RMSE** (Root Mean Squared Error).
    *   Visualizes Predicted vs. Actual prices.
6.  **Export**:
    *   Saves the best model state to `.pth`.
    *   Saves scalers to `.pkl`.

---

## 📈 Performance Metrics

When evaluating model performance in the notebook, look for:

*   **MAE (Mean Absolute Error)**: The average dollar difference between predicted and actual price. Lower is better.
*   **R² Score**: Indicates how well the model captures the variance in the data. Closer to 1.0 is better.

---

## 🧪 How to Experiment

1.  **Install Jupyter**: `pip install jupyterlab`
2.  **Launch**: `jupyter lab`
3.  **Open**: `final.ipynb`
4.  **Modify**: Change hyperparameters (e.g., `d_model`, `dropout`) in the configuration cell.
5.  **Run**: Execute all cells to retrain and observe the impact on the validation metrics.
