@echo off
REM Windows batch file to seed database
cd /d %~dp0
python scripts/seed.py
pause

