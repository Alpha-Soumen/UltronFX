# 🛠️ UltronFX Developer Tools

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=for-the-badge&logo=python)
![Status](https://img.shields.io/badge/Status-Operational-green?style=for-the-badge)

## 📖 Overview
This document provides a technical reference for the **Development & Maintenance Scripts** located in the `backend/` directory. These tools are essential for testing, debugging, and managing the UltronFX platform.

> [!NOTE]
> All commands should be run from the `backend/` directory with the virtual environment activated.
> ```bash
> cd backend
> .\venv\Scripts\activate
> ```

---

## 🧪 1. Testing Scripts
*Automated tests to ensure core functionality works as expected.*

| Script | Description | Usage |
| :--- | :--- | :--- |
| **`test_login.py`** | **Auth Check**. Simulates a login request to `localhost:8000/token` to verify that the API issues valid JWT tokens. | `python test_login.py` |
| **`test_live_predict.py`** | **Inference Check**. Sends a dummy prediction request to the AI model to ensure the `predict_7day` function is reachable and error-free. | `python test_live_predict.py` |
| **`test_performance.py`** | **Speed Test**. Measures the latency (response time) of the API. Useful for benchmarking optimization. | `python test_performance.py` |
| **`test_auth_flow.py`** | **Full Flow**. Tests the entire user journey: Signup -> Login -> Access Protected Route. | `python test_auth_flow.py` |

---

## ✅ 2. Verification Scripts
*Tools to validate system integrity and data consistency.*

| Script | Description | Usage |
| :--- | :--- | :--- |
| **`verify_api.py`** | **Health Check**. Hits every endpoint (`/health`, `/market-overview`, `/predict`) to ensure the API is fully responsive. | `python verify_api.py` |
| **`verify_data_integrity.py`** | **Data Audit**. Scans the CSV datasets for missing values, duplicates, or corrupted rows. | `python verify_data_integrity.py` |
| **`verify_predictions.py`** | **Accuracy Check**. Compares model predictions against recent actual prices to calculate current error rates. | `python verify_predictions.py` |

---

## 🐞 3. Debugging Tools
*Utilities for diagnosing issues during development.*

| Script | Description | Usage |
| :--- | :--- | :--- |
| **`debug_dates.py`** | **Time Debugger**. Checks how the system parses dates to fix timezone mismatches between API data and the model. | `python debug_dates.py` |
| **`debug_insights.py`** | **Logic Inspector**. Prints the internal logic used to generate "Market Insights" (e.g., why is the market "Bullish"?). | `python debug_insights.py` |
| **`inspect_scaler.py`** | **Artifact Viewer**. Loads a `.pkl` scaler file and prints its min/max values. Useful for checking if normalization is correct. | `python inspect_scaler.py` |

---

## 🧹 4. Data Preparation
*Scripts for cleaning and extending datasets.*

| Script | Description | Usage |
| :--- | :--- | :--- |
| **`fix_csv_dates.py`** | **Format Fixer**. Standardizes date formats in CSV files to `YYYY-MM-DD`. | `python fix_csv_dates.py` |
| **`generate_data_2025.py`** | **Future Proofing**. Generates synthetic placeholder data for testing future date handling. | `python generate_data_2025.py` |
| **`extend_real_data.py`** | **Data Fetcher**. Downloads the latest OHLCV data from CoinGecko to append to your training set. | `python extend_real_data.py` |

---

## ⚙️ 5. Setup & Administration
*Scripts for initializing the environment and managing users.*

| Script | Description | Usage |
| :--- | :--- | :--- |
| **`create_admin.py`** | **Admin Creator**. Creates a default Super Admin account (`admin@ultronfx.com` / `admin123`). | `python create_admin.py` |
| **`add_users.py`** | **Bulk User Add**. Adds multiple test users to `users.json` for load testing. | `python add_users.py` |
| **`check_env.py`** | **Environment Check**. Verifies that all required Python packages and system variables are correctly set. | `python check_env.py` |
| **`run.ps1`** | **Auto-Setup & Run**. A robust PowerShell script that fixes `requirements.txt`, creates `venv`, installs dependencies, and starts the server. | `.\run.ps1` |
