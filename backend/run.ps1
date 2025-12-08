Write-Host "=== UltronFX Backend Auto Runner ===" -ForegroundColor Cyan

# Define backend path
$BACKEND_PATH = "C:\My Projects\ML\UltronFX\backend"
Set-Location $BACKEND_PATH
Write-Host "=> Working directory: $BACKEND_PATH`n"

# -----------------------------
# STEP 1 — Fix requirements.txt
# -----------------------------
Write-Host "=> Cleaning requirements.txt (removing pickle5)..." -ForegroundColor Yellow

Copy-Item requirements.txt requirements.txt.bak -ErrorAction SilentlyContinue

# Rewrite the file without pickle5
(Get-Content requirements.txt) |
    Where-Object { $_ -notmatch "pickle5" } |
    Set-Content requirements.txt

Write-Host "=> Updated requirements.txt"
Get-Content requirements.txt
Write-Host ""

# -----------------------------
# STEP 2 — Create virtual env
# -----------------------------
if (!(Test-Path "$BACKEND_PATH\venv")) {
    Write-Host "=> Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
} else {
    Write-Host "=> Virtual environment already exists." -ForegroundColor Green
}

Write-Host "=> Activating virtual environment..."
& "$BACKEND_PATH\venv\Scripts\Activate.ps1"


# -----------------------------
# STEP 3 — Upgrade pip safely
# -----------------------------
Write-Host "=> Upgrading pip + setuptools + wheel..." -ForegroundColor Yellow
.\venv\Scripts\python.exe -m pip install --upgrade pip setuptools wheel


# -----------------------------
# STEP 4 — Install dependencies
# -----------------------------
Write-Host "=> Installing dependencies from requirements.txt..." -ForegroundColor Yellow
.\venv\Scripts\pip.exe install -r requirements.txt


# -----------------------------
# STEP 5 — Ensure uvicorn exists
# -----------------------------
Write-Host "=> Ensuring uvicorn is installed..." -ForegroundColor Yellow
.\venv\Scripts\pip.exe install "uvicorn[standard]"


# -----------------------------
# STEP 6 — Start backend server
# -----------------------------
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " UltronFX Backend is starting...          " -ForegroundColor Green
Write-Host " Open your browser at:" -ForegroundColor Cyan
Write-Host "   http://127.0.0.1:8000/docs" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Use safe Windows command:
.\venv\Scripts\python.exe -m uvicorn app:app --reload
