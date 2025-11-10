@echo off
REM Windows batch file to start both backend and frontend
echo ================================================
echo Starting Smart Task Organizer Application
echo ================================================
echo.

REM Check if .env files exist
if not exist "backend\.env" (
    echo Warning: backend/.env file not found!
    echo Please create it with VAPID keys.
    echo See SETUP_INSTRUCTIONS.md for details.
    echo.
)

if not exist "frontend\.env" (
    echo Warning: frontend/.env file not found!
    echo Please create it with VAPID keys.
    echo See SETUP_INSTRUCTIONS.md for details.
    echo.
)

echo Starting Backend Server...
echo Backend will run at: http://localhost:8000
echo.
start "Backend Server" cmd /k "cd backend && run.bat"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
echo Frontend will run at: http://localhost:5173
echo.
start "Frontend Server" cmd /k "cd frontend && run.bat"

echo.
echo ================================================
echo Application Started!
echo ================================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
echo Press any key to exit this window (servers will keep running)...
pause >nul

