# How to Run UltronFX

This project consists of a Python Backend (FastAPI) and a React Frontend (Vite). You need to run both simultaneously in separate terminal instances.

## Prerequisites
- Python 3.8+
- Node.js & npm

## 1. Start the Backend
Open a terminal in VS Code and run:

```powershell
# 1. Navigate to the backend directory
cd backend

# 2. Activate Virtual Environment (Recommended)
# If you have a venv, e.g., .venv or venv:
# .\venv\Scripts\activate

# 3. Install Dependencies (First time only)
# pip install -r requirements.txt

# 4. Start the Server
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```
*The backend will start at `http://localhost:8000`*

## 2. Start the Frontend
Open a **second** terminal in VS Code (click `+` in the terminal panel) and run:

```powershell
# 1. Navigate to the frontend directory
cd frontend

# 2. Install Dependencies (First time only)
# npm install

# 3. Start the Development Server
npm run dev
```
*The frontend will usually start at `http://localhost:5173`*

## 3. Access the Application
Open your browser and go to the URL shown in the Frontend terminal (usually `http://localhost:5173`).
