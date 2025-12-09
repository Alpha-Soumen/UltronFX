# 📖 UltronFX User Manual & Run Instructions

Welcome to the **UltronFX** setup guide. This document will walk you through the process of installing, configuring, and running the platform on your local machine.

---

## 🛠️ 1. Prerequisites

Before you begin, ensure you have the following software installed on your computer:

*   **Python**: Version 3.10 or higher. [Download Here](https://www.python.org/downloads/)
*   **Node.js**: Version 18 or higher. [Download Here](https://nodejs.org/)
*   **Git**: For cloning the repository. [Download Here](https://git-scm.com/)

> **Note**: This guide assumes you are using **Windows (PowerShell)**. If you are on Mac/Linux, replace `.\venv\Scripts\activate` with `source venv/bin/activate`.

---

## 📥 2. Installation

### Step A: Clone the Repository
Open your terminal (PowerShell or Command Prompt) and run:

```bash
git clone https://github.com/Alpha-Soumen/UltronFX.git
cd UltronFX
```

### Step B: Backend Setup (The Brain)
The backend runs the AI and API.

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```

2.  Create a virtual environment (to keep dependencies isolated):
    ```bash
    python -m venv venv
    ```

3.  Activate the virtual environment:
    ```bash
    .\venv\Scripts\activate
    ```
    *(You should see `(venv)` appear at the start of your command line)*

4.  Install the required libraries:
    ```bash
    pip install -r requirements.txt
    ```
    *(This may take a few minutes as it downloads PyTorch and other AI tools)*

### Step C: Frontend Setup (The Interface)
The frontend is the website you interact with.

1.  Open a **new terminal window** (keep the backend one open).
2.  Navigate to the frontend folder:
    ```bash
    cd frontend
    ```

3.  Install the dependencies:
    ```bash
    npm install
    ```

---

## 🚀 3. Running the Application

### Option A: ⚡ One-Click Start (Recommended)
We have included a PowerShell script that automates the process.
1.  Open PowerShell in the main `UltronFX` folder.
2.  Run:
    ```powershell
    .\run.ps1
    ```
3.  This will open two new windows (one for Backend, one for Frontend) and start the system.

### Option B: Manual Start
If you prefer to run **both** servers manually:

### Start the Backend
In your **Backend Terminal** (where `(venv)` is active):
```bash
uvicorn app:app --reload --port 8000
```
*   **Success**: You should see `Application startup complete`.
*   **Check**: Open `http://localhost:8000/health` in your browser. It should say `{"status": "ok"}`.

### Start the Frontend
In your **Frontend Terminal**:
```bash
npm run dev
```
*   **Success**: You should see `Local: http://localhost:5173`.

---

## 🖥️ 4. Using the Platform

1.  Open your browser and go to: **`http://localhost:5173`**
2.  You will be redirected to the **Login Page**.
3.  Use the following default credentials:

| Role | Email | Password |
| :--- | :--- | :--- |
| **User** | `user1@ultronfx.com` | `password123` |
| **Admin** | `admin@ultronfx.com` | `admin123` |

### Key Features to Try:
*   **Dashboard**: Check the "7-Day Forecast" for Bitcoin.
*   **Academy**: Go to the "Learning Hub" and browse the courses.
*   **Directory**: Search for "Ethereum" to see its details.

---

## ❓ 5. Troubleshooting

### "Command not found: uvicorn"
*   **Cause**: You forgot to activate the virtual environment.
*   **Fix**: Run `.\venv\Scripts\activate` inside the `backend/` folder, then try again.

### "ModuleNotFoundError: No module named 'torch'"
*   **Cause**: Dependencies were not installed correctly.
*   **Fix**: Ensure `(venv)` is active, then run `pip install -r requirements.txt` again.

### "Failed to fetch" on the Website
*   **Cause**: The Backend server is not running.
*   **Fix**: Ensure the black terminal window running `uvicorn` is open and has no errors.

### "Vite Error: Missing ./pages/LearningHub"
*   **Cause**: Old code referencing a deleted file.
*   **Fix**: This should be fixed in the latest version, but if it happens, check `App.jsx` and remove `import LearningHub ...`.

---

## 📞 Support

If you encounter issues not listed here, please check the [Dev Tools Documentation](./DEV_TOOLS_DOCUMENTATION.md) for advanced debugging commands.
