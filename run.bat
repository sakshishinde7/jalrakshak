@echo off
title JALRAKSHAK - Launcher
echo ========================================================
echo   Launching JALRAKSHAK (FastAPI Backend + React Frontend)
echo ========================================================
echo.

:: 1. Start Backend in a new window
echo [1/2] Starting Backend (FastAPI on http://localhost:8000)...
start "JALRAKSHAK Backend (Port 8000)" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --reload --port 8000"

:: 2. Wait 2 seconds
timeout /t 2 /nobreak >nul

:: 3. Start Frontend in a new window
echo [2/2] Starting Frontend (Vite on http://localhost:5173)...
start "JALRAKSHAK Frontend (Port 5173)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================================
echo   Both services are starting!
echo.
echo   - Frontend Website:   http://localhost:5173
echo   - Backend Swagger API: http://localhost:8000/docs
echo   - Health Check:       http://localhost:8000/api/health
echo ========================================================
echo.
pause

