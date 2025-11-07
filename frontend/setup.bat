@echo off
REM Windows batch file for frontend setup
cd /d %~dp0

echo Installing dependencies...
call npm install

echo Copying .env.example to .env...
if not exist .env (
    copy .env.example .env
    echo Please edit .env with your settings
) else (
    echo .env already exists
)

echo.
echo Setup complete!
echo.
echo To start the dev server, run:
echo   run.bat
echo.
pause

