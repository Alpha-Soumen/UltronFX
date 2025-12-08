Write-Host "Starting UltronFX System..." -ForegroundColor Cyan

$root = Get-Location

# 1. Start Backend Server
Write-Host "Launching Backend (FastAPI)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; if (Test-Path 'venv') { .\venv\Scripts\activate; uvicorn app:app --host 0.0.0.0 --port 8000 --reload } else { Write-Host 'Virtual Environment not found! Please run setup first.' -ForegroundColor Red }"

# Wait for backend to initialize
Start-Sleep -Seconds 3

# 2. Start Frontend Server
Write-Host "Launching Frontend (Vite)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\frontend'; npm run dev"

Write-Host "------------------------------------------------" -ForegroundColor Cyan
Write-Host "UltronFX is running!" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:8000" -ForegroundColor Gray
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Gray
Write-Host "------------------------------------------------" -ForegroundColor Cyan
