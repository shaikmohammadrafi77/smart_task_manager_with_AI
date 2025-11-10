@echo off
REM Windows batch file to generate VAPID keys
cd /d %~dp0\..

echo Generating VAPID keys for web push notifications...
echo.

REM Activate virtual environment if it exists
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
)

REM Run the Python script
python scripts\generate_vapid_keys.py

echo.
pause

