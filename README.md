# 🚀 UltronFX: Next-Gen AI Crypto Forecasting

![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi)
![PyTorch](https://img.shields.io/badge/PyTorch-2.1-EE4C2C?style=for-the-badge&logo=pytorch)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 📖 Overview

**UltronFX** is an institutional-grade cryptocurrency forecasting platform that leverages advanced Deep Learning (Transformer V3) to predict market movements with high accuracy.

Built with a **"Futuristic Fintech"** design philosophy, it combines a stunning glassmorphic UI with a powerful Python backend to deliver real-time insights, 7-day price forecasts, and automated market sentiment analysis.

---

## 📌 Table of Contents

*   [Overview](#-overview)
*   [Key Features](#-key-features)
*   [System Interface](#-system-interface)
*   [Documentation](#-documentation)
*   [User Manual & Run Instructions](#-user-manual--run-instructions)
*   [Project Structure](#-project-structure)
*   [Contributing](#-contributing)
*   [Acknowledgements](#-acknowledgements)
*   [Developed by](#-developed-by)

---

## ✨ Key Features

### 🧠 AI-Powered Intelligence
*   **Transformer V3 Model**: A custom neural network trained on years of OHLCV data to predict 7-day price trends.
*   **Multi-Factor Analysis**: Considers Price, Volume, RSI, MACD, and Moving Averages.
*   **Live Sentiment**: AI-driven analysis of market mood (Bullish/Bearish).

### 💻 Premium Frontend
*   **Interactive Dashboard**: Real-time charts (ApexCharts), live tickers, and risk scores.
*   **Crypto Academy**: A complete educational platform with structured courses (Beginner to Advanced).
*   **Crypto Directory**: A Wikipedia-style database for coin details.
*   **Glassmorphism UI**: A sleek, dark-mode interface built with Tailwind CSS 4.

### 🛡️ Robust Backend
*   **FastAPI Architecture**: High-performance, asynchronous API.
*   **Live Data Engine**: Fetches real-time market data from CoinGecko/Binance.
*   **Secure Auth**: JWT-based authentication with Role-Based Access Control (RBAC).

---

## 📸 System Interface

### 🖥️ Dashboard & Command Center
The central hub for real-time market monitoring. It aggregates AI predictions, live prices, and sentiment analysis into a single glassmorphic view.

![Main Dashboard](./web%20screenshots/Screenshot%202025-12-08%20110111.png)

<br/>

### 📊 Dashboard View


| **Dark Mode** | **Export Section** |
| :---: | :---: |
| ![Dark Mode](./web%20screenshots/Screenshot%202025-12-08%20110102.png) | ![Export Section](./web%20screenshots/Screenshot%202025-11-29%20202745.png) |


<br/>

### 📱 Responsive Design & Features
Engineered to work seamlessly across all devices, maintaining functionality and aesthetics.

| **User Management** | **System Status Panel** | **Account Settings** |
| :---: | :---: | :---: |
| ![User Management](./web%20screenshots/Screenshot%202025-12-08%20110420.png) | ![System Status Panel](./web%20screenshots/Screenshot%202025-12-08%20110414.png) | ![Account Settings](./web%20screenshots/Screenshot%202025-12-08%20110226.png) |

<br/>

### 🖼️ Component Gallery
Additional views of the system's modular components and design system.

| | | |
|:---:|:---:|:---:|
| ![Comp 1](./web%20screenshots/Screenshot%202025-11-29%20202854.png) | ![Comp 2](./web%20screenshots/Screenshot%202025-11-29%20202808.png) | ![Comp 3](./web%20screenshots/Screenshot%202025-11-29%20202801.png) |
| ![Comp 4](./web%20screenshots/Screenshot%202025-12-08%20110151.png) | ![Comp 5](./web%20screenshots/Screenshot%202025-11-29%20202646.png) | ![Comp 6](./web%20screenshots/Screenshot%202025-11-29%20202814.png) |
| ![Comp 7](./web%20screenshots/Screenshot%202025-11-29%20193124.png) | ![Comp 8](./web%20screenshots/Screenshot%202025-12-08%20110209.png) | ![Comp 9](./web%20screenshots/Screenshot%202025-11-30%20233828.png) |
| ![Comp 10](./web%20screenshots/Screenshot%202025-11-29%20194858.png) | ![Comp 11](./web%20screenshots/Screenshot%202025-11-29%20193540.png) | |

---

## 📚 Documentation

We have detailed documentation for every part of the system:

| Document | Description |
| :--- | :--- |
| [**Frontend Docs**](./docs/FRONTEND_DOCUMENTATION.md) | Architecture, Components, and Design System. |
| [**Backend Docs**](./docs/BACKEND_DOCUMENTATION.md) | API Endpoints, Data Pipeline, and Security. |
| [**AI Model Docs**](./docs/AI_MODEL_DOCUMENTATION.md) | Neural Network Architecture and Inference Logic. |
| [**Research Docs**](./docs/RESEARCH_DOCUMENTATION.md) | Training Experiments, Datasets, and Notebooks. |
| [**Dev Tools**](./docs/DEV_TOOLS_DOCUMENTATION.md) | Scripts for Testing, Debugging, and Maintenance. |

---

## 📖 User Manual & Run Instructions

This section guides you through setting up and running **UltronFX** locally.

### 1. Prerequisites
Ensure you have the following installed:
*   **Python 3.10+**
*   **Node.js 18+**
*   **Git**

### 2. Installation & Setup

**Step A: Clone the Repository**
```bash
git clone https://github.com/Alpha-Soumen/UltronFX.git
cd UltronFX
```

**Step B: Backend Setup (The Brain)**
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate   # Windows (PowerShell)
 # .\venv\Scripts\activate : File ... Activate.ps1 cannot be loaded because running scripts is disabled on this system.
# If you see this error while activating the virtual environment
Get-ExecutionPolicy # Check your current execution policy
Set-ExecutionPolicy RemoteSigned -Scope Process # Allow local scripts for the current session Run this command in PowerShell
# source venv/bin/activate # Mac/Linux
pip install -r requirements.txt
```
### ✔ Why this is safe?

* **RemoteSigned** → Allows *local scripts* like `Activate.ps1` to run
* **-Scope Process** → Only affects the *current PowerShell window*
* **Auto-reverts** when the terminal is closed
* Keeps system security intact

* 
**Step C: Frontend Setup (The Interface)**
  
✅**Pre-Installation Checklist (Before Running `npm install`)**

Open a **new terminal** and run:

This section ensures the frontend installs cleanly without errors.

---

**1️⃣ Verify Node.js Version**

UltronFX requires **Node.js 18+**.

Check your installed version:

```powershell
node -v
```

If it's older than 18, download the latest LTS:
👉 [https://nodejs.org](https://nodejs.org)

---

**2️⃣ Verify npm Version**

Check npm version:

```powershell
npm -v
```

If npm is outdated, update it:

```powershell
npm install -g npm
```

---

**3️⃣ Ensure You Are Inside the Correct Directory**

Before running `npm install`, navigate to the *frontend folder*:

```powershell
cd frontend
```

Run this to confirm:

```powershell
pwd   # shows current directory
```

You should see something like:

```
.../UltronFX/frontend
  npm install
```

---

**4️⃣ Remove Old / Corrupted Node Modules (If Exists)**

If you already tried installing once, delete old modules:

```powershell
rmdir /s /q node_modules
```

Also remove the existing lock file:

```powershell
del package-lock.json
```

This prevents dependency conflicts.

---

**5️⃣ Install Dependencies Fresh**

Now your environment is clean and safe to install:

```powershell
npm install
```

---

⭐ **Optional — Windows PowerShell Fix (Rare Cases)**

If npm fails with permission issues:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope Process
```

---

### 3. Running the Application

**Option A: ⚡ One-Click Start (Windows)**
Run the included PowerShell script to start both servers automatically:
```powershell
.\run.ps1
```

**Option B: Manual Start**
You need to run **two servers** simultaneously in separate terminals.

**Terminal 1: Backend**
```bash
cd backend
.\venv\Scripts\activate
uvicorn app:app --reload --port 8000
```
*   *Verify*: Open `http://localhost:8000/health`

**Terminal 2: Frontend**
```bash
cd frontend
npm run dev
```
*   *Access*: Open `http://localhost:5173`

### 4. Login Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| **User** | `user1@ultronfx.com` | `user123` |
| **Admin** | `admin@ultronfx.com` | `admin123` |

### 5. Troubleshooting
*   **`uvicorn` not found?** Ensure you activated the virtual environment (`.\venv\Scripts\activate`).
*   **Missing dependencies?** Run `pip install -r requirements.txt` again.
*   **Port in use?** The terminals will suggest an alternative port (e.g., 5174), check the output.

For detailed debugging, see the [**Developer Tools Documentation**](./docs/DEV_TOOLS_DOCUMENTATION.md).

---

## 📂 Project Structure

```text
UltronFX/
├── backend/                # FastAPI Server & AI Logic
│   ├── crypto_model_package/   # 🧠 Trained Model Artifacts (CRITICAL)
│   ├── app.py                  # API Entry Point
│   ├── model.py                # Transformer Architecture
│   └── ...
├── frontend/               # React Application
│   ├── src/
│   │   ├── pages/              # Dashboard, Academy, etc.
│   │   ├── components/         # Reusable UI Elements
│   │   └── ...
├── research/               # 🧪 Experimental Lab (Notebooks & Datasets)
└── ...
```

---

## 🤝 Contributing

Contributions are welcome! Please read the [Dev Tools Documentation](./docs/DEV_TOOLS_DOCUMENTATION.md) to understand how to run tests and verify your changes.

## 🙏 Acknowledgements

This project was developed under the **Infosys Springboard** internship program.

I would like to express my sincere gratitude to the organization for providing me with the opportunity to work on this meaningful project.

*   🌟 **Mentor**: **Pranathi** — for her continuous guidance, support, and valuable feedback throughout the internship.
*   🚀 **Coordinator**: **Bhargav Sai Reddy Vanga** — for his encouragement and assistance.

Their support played a crucial role in the successful completion of my internship journey.

---

## �‍💻 Developed by

**Soumen Bhunia**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/soumen-bhunia/)

---

## �📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
