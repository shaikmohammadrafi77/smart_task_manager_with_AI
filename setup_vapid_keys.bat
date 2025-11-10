@echo off
REM Windows batch file to setup VAPID keys and create .env files
echo ================================================
echo VAPID Keys Setup for Push Notifications
echo ================================================
echo.

REM Check if backend directory exists
if not exist "backend" (
    echo Error: backend directory not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

REM Navigate to backend
cd backend

REM Check if virtual environment exists
if exist "venv\Scripts\activate.bat" (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
) else (
    echo Warning: Virtual environment not found.
    echo You may need to create one first: python -m venv venv
    echo.
)

REM Check if cryptography is installed
echo Checking for cryptography library...
python -c "import cryptography" 2>nul
if errorlevel 1 (
    echo Installing cryptography...
    pip install cryptography
)

REM Generate VAPID keys
echo.
echo Generating VAPID keys...
echo.
python scripts\generate_vapid_keys.py

if errorlevel 1 (
    echo.
    echo Error generating VAPID keys!
    echo Please make sure Python and cryptography are installed.
    pause
    exit /b 1
)

echo.
echo ================================================
echo Setup Complete!
echo ================================================
echo.
echo Next steps:
echo 1. Copy the VAPID keys shown above
echo 2. Create backend/.env file and add:
echo    VAPID_PUBLIC_KEY=your-public-key
echo    VAPID_PRIVATE_KEY=your-private-key
echo 3. Create frontend/.env file and add:
echo    VITE_VAPID_PUBLIC_KEY=your-public-key
echo    VITE_API_BASE=http://localhost:8000/api
echo 4. Restart both backend and frontend servers
echo.
pause

