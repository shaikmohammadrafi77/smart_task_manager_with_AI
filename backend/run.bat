@echo off
REM Windows batch file to run backend server
cd /d %~dp0
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

