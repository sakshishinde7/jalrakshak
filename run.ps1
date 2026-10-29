# JALRAKSHAK PowerShell Launcher
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Launching JALRAKSHAK (FastAPI Backend + React Frontend)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$root = $PSScriptRoot

# 1. Start Backend in separate window
Write-Host "[1/2] Starting Backend on http://localhost:8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; python -m uvicorn app.main:app --reload --port 8000"

Start-Sleep -Seconds 2

# 2. Start Frontend in separate window
Write-Host "[2/2] Starting Frontend on http://localhost:5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\frontend'; npm run dev"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "  Both services are starting!" -ForegroundColor Green
Write-Host "  - Frontend Website:   http://localhost:5173" -ForegroundColor Green
Write-Host "  - Backend Swagger API: http://localhost:8000/docs" -ForegroundColor Green
Write-Host "  - Health Check:       http://localhost:8000/api/health" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green

