@echo off
REM Windows batch file for backend setup
cd /d %~dp0

echo Creating virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing dependencies (without scikit-learn)...
pip install --upgrade pip
pip install fastapi==0.109.0
pip install uvicorn[standard]==0.27.0
pip install sqlmodel==0.0.16
pip install alembic==1.13.1
pip install python-jose[cryptography]==3.3.0
pip install passlib[bcrypt]==1.7.4
pip install python-multipart==0.0.6
pip install pydantic==2.5.3
pip install pydantic-settings==2.1.0
pip install apscheduler==3.10.4
pip install pyjwt==2.8.0
pip install python-dotenv==1.0.0
pip install email-validator==2.1.0
pip install pytest==7.4.4
pip install pytest-cov==4.1.0
pip install pytest-asyncio==0.23.3
pip install httpx==0.26.0

echo.
echo Optional: Install scikit-learn for ML features (requires Visual C++ Build Tools)
echo Run: pip install scikit-learn==1.4.0 numpy==1.26.3
echo.

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
echo To activate virtual environment, run:
echo   venv\Scripts\activate
echo.
echo To start the server, run:
echo   run.bat
echo.
pause

