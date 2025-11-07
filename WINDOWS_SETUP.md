# Windows Setup Guide

This guide helps you set up the Smart AI Task Organizer on Windows.

## Prerequisites

- Python 3.11+ (not 3.13 - see note below)
- Node.js 18+
- Git for Windows

## Important Notes

### Python Version
**Use Python 3.11 or 3.12**, not 3.13. Python 3.13 may have compatibility issues with some packages.

### scikit-learn (Optional)
scikit-learn requires Microsoft Visual C++ Build Tools to compile on Windows. The AI features work without it using heuristics only.

**Option 1: Skip scikit-learn (Recommended for quick start)**
- The app works fine without it
- AI suggestions use heuristics only

**Option 2: Install Visual C++ Build Tools**
1. Download from: https://visualstudio.microsoft.com/visual-cpp-build-tools/
2. Install "Desktop development with C++"
3. Then run: `pip install scikit-learn==1.4.0 numpy==1.26.3`

## Backend Setup

### Method 1: Using Batch Files (Easiest)

1. **Open Command Prompt or PowerShell in the `backend` folder**

2. **Run setup:**
   ```cmd
   setup.bat
   ```

3. **Activate virtual environment:**
   ```cmd
   venv\Scripts\activate
   ```

4. **Create .env file:**
   ```cmd
   copy .env.example .env
   ```
   (Edit .env with your settings if needed)

5. **Seed database:**
   ```cmd
   seed.bat
   ```

6. **Start server:**
   ```cmd
   run.bat
   ```

### Method 2: Manual Setup

1. **Create virtual environment:**
   ```cmd
   python -m venv venv
   ```

2. **Activate it:**
   ```cmd
   venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```cmd
   pip install -r requirements.txt
   ```
   
   If scikit-learn fails, install without it:
   ```cmd
   pip install fastapi uvicorn[standard] sqlmodel alembic python-jose[cryptography] passlib[bcrypt] python-multipart pydantic pydantic-settings apscheduler pyjwt python-dotenv email-validator pytest pytest-cov pytest-asyncio httpx
   ```

4. **Create .env:**
   ```cmd
   copy .env.example .env
   ```

5. **Seed database:**
   ```cmd
   python scripts\seed.py
   ```

6. **Start server:**
   ```cmd
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## Frontend Setup

### Method 1: Using Batch Files

1. **Open Command Prompt in the `frontend` folder**

2. **Run setup:**
   ```cmd
   setup.bat
   ```

3. **Start dev server:**
   ```cmd
   run.bat
   ```

### Method 2: Manual Setup

1. **Install dependencies:**
   ```cmd
   npm install
   ```

2. **Create .env:**
   ```cmd
   copy .env.example .env
   ```

3. **Start dev server:**
   ```cmd
   npm run dev
   ```

## Running the Application

1. **Start Backend** (in `backend` folder):
   ```cmd
   run.bat
   ```
   Server runs at: http://localhost:8000

2. **Start Frontend** (in `frontend` folder, new terminal):
   ```cmd
   run.bat
   ```
   App runs at: http://localhost:5173

## Demo Credentials

After running the seed script:
- **Email:** `demo@example.com`
- **Password:** `demo123`

## Troubleshooting

### "cp is not recognized"
- Use `copy` instead of `cp` on Windows
- Or use the provided `.bat` files

### "make is not recognized"
- Use the `.bat` files provided
- Or run commands directly (see above)

### "ModuleNotFoundError: No module named 'app'"
- Make sure you're in the `backend` directory
- Activate the virtual environment first
- Use `python scripts\seed.py` (not from root)

### scikit-learn installation fails
- This is optional! The app works without it
- AI features use heuristics instead of ML
- To install: Get Visual C++ Build Tools first

### Port already in use
- Change ports in `.env` files
- Or stop the process using the port

## Alternative: Use Docker

If you have Docker Desktop installed:

```cmd
docker-compose -f infra\docker-compose.yml up --build
```

This avoids all Windows-specific issues!

