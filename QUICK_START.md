# Quick Start Guide - Enable Push Notifications

This guide will help you set up VAPID keys and run the application.

## Step 1: Generate VAPID Keys

1. **Open a terminal/command prompt and navigate to the backend folder:**
   ```bash
   cd backend
   ```

2. **Make sure you have the cryptography library installed:**
   ```bash
   pip install cryptography
   ```
   Or if you have a virtual environment activated:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the key generation script:**
   
   **Windows:**
   ```bash
   python scripts\generate_vapid_keys.py
   ```
   
   **Linux/Mac:**
   ```bash
   python scripts/generate_vapid_keys.py
   ```

4. **Copy the generated keys** - You'll see output like this:
   ```
   VITE_VAPID_PUBLIC_KEY=your-public-key-here
   VAPID_PUBLIC_KEY=your-public-key-here
   VAPID_PRIVATE_KEY=your-private-key-here
   ```

## Step 2: Create .env Files

### Backend .env File

1. **Create `backend/.env` file** (copy from example if it exists, or create new):
   ```bash
   # In backend folder
   copy .env.example .env
   # Or create manually
   ```

2. **Add the VAPID keys to `backend/.env`:**
   ```env
   VAPID_PUBLIC_KEY=your-public-key-here
   VAPID_PRIVATE_KEY=your-private-key-here
   FRONTEND_ORIGIN=http://localhost:5173
   DATABASE_URL=sqlite:///./dev.db
   SECRET_KEY=your-secret-key-here
   ```

### Frontend .env File

1. **Create `frontend/.env` file** (copy from example if it exists, or create new):
   ```bash
   # In frontend folder
   copy .env.example .env
   # Or create manually
   ```

2. **Add the VAPID public key to `frontend/.env`:**
   ```env
   VITE_API_BASE=http://localhost:8000/api
   VITE_VAPID_PUBLIC_KEY=your-public-key-here
   ```

   **Note:** Use the same public key that you put in the backend `.env` file!

## Step 3: Run the Application

### Option A: Run Backend and Frontend Separately

**Backend:**
```bash
# Navigate to backend folder
cd backend

# Activate virtual environment (if using one)
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies (if not already installed)
pip install -r requirements.txt

# Run the backend
python -m uvicorn app.main:app --reload --port 8000
```

**Frontend (in a new terminal):**
```bash
# Navigate to frontend folder
cd frontend

# Install dependencies (if not already installed)
npm install

# Run the frontend
npm run dev
```

### Option B: Use Batch Files (Windows)

**Backend:**
```bash
cd backend
run.bat
```

**Frontend:**
```bash
cd frontend
run.bat
```

## Step 4: Verify Push Notifications Work

1. **Open your browser** and go to: `http://localhost:5173`

2. **Login or Register** to create an account

3. **Navigate to Settings** page

4. **Check the Web Push Notifications section:**
   - The warning message should be gone
   - The "Subscribe to Push Notifications" button should be enabled (not grayed out)

5. **Click "Subscribe to Push Notifications":**
   - Your browser will ask for notification permission
   - Click "Allow" or "Allow notifications"
   - You should see a success message
   - The button should change to show "✓ Subscribed"

## Troubleshooting

### "VAPID keys are not configured" still showing?

1. **Check .env files exist:**
   - Make sure `backend/.env` exists and has `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY`
   - Make sure `frontend/.env` exists and has `VITE_VAPID_PUBLIC_KEY`

2. **Restart servers:**
   - Stop both backend and frontend servers
   - Start them again (environment variables are loaded on startup)

3. **Check key format:**
   - Keys should be long strings (public key ~87 characters, private key ~43 characters)
   - No spaces or extra characters
   - Make sure you copied the entire key

4. **Verify keys match:**
   - The `VAPID_PUBLIC_KEY` in backend/.env should be the same as `VITE_VAPID_PUBLIC_KEY` in frontend/.env

### Button still disabled?

1. **Check browser console:**
   - Open browser DevTools (F12)
   - Check the Console tab for errors
   - Look for messages about VAPID keys

2. **Check service worker:**
   - The service worker should be registered automatically
   - Check browser DevTools → Application → Service Workers

3. **Try fetching from API:**
   - The frontend will try to fetch the VAPID key from the backend API if it's not in the environment
   - Make sure the backend is running and accessible at `http://localhost:8000`

### Backend not starting?

1. **Check dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Check Python version:**
   - Requires Python 3.11 or higher
   - Check with: `python --version`

3. **Check database:**
   - The SQLite database will be created automatically
   - Make sure you have write permissions in the backend folder

### Frontend not starting?

1. **Check Node.js version:**
   - Requires Node.js 18 or higher
   - Check with: `node --version`

2. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Clear cache and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## Quick Commands Reference

### Generate VAPID Keys
```bash
cd backend
python scripts/generate_vapid_keys.py
```

### Run Backend
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

### Run Frontend
```bash
cd frontend
npm run dev
```

### Check if servers are running
- Backend: http://localhost:8000/docs (API documentation)
- Frontend: http://localhost:5173 (Application)

## Next Steps

Once push notifications are working:
1. Create some tasks with reminders
2. Set due dates and reminder times
3. You'll receive push notifications when reminders fire
4. Check the Settings page to manage your notification preferences

## Need Help?

- Check the [VAPID_SETUP.md](VAPID_SETUP.md) for detailed VAPID setup
- Check the [README.md](README.md) for general setup instructions
- Check browser console for error messages
- Verify all environment variables are set correctly

