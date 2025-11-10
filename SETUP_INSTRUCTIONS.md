# Setup Instructions - Enable Push Notifications

## 🚀 Quick Setup (3 Steps)

### Step 1: Generate VAPID Keys

**Windows:**
```bash
# From project root
setup_vapid_keys.bat
```

**Linux/Mac:**
```bash
# From project root
chmod +x setup_vapid_keys.sh
./setup_vapid_keys.sh
```

**Or manually:**
```bash
cd backend
python scripts/generate_vapid_keys.py
```

You'll see output like:
```
VITE_VAPID_PUBLIC_KEY=ABC123...
VAPID_PUBLIC_KEY=ABC123...
VAPID_PRIVATE_KEY=XYZ789...
```

### Step 2: Create .env Files

#### Backend .env (backend/.env)

Create `backend/.env` file with:
```env
APP_ENV=dev
SECRET_KEY=change_me_to_a_secure_random_string
DATABASE_URL=sqlite:///./dev.db
FRONTEND_ORIGIN=http://localhost:5173

# Paste the generated keys here:
VAPID_PUBLIC_KEY=ABC123... (paste your public key)
VAPID_PRIVATE_KEY=XYZ789... (paste your private key)
```

#### Frontend .env (frontend/.env)

Create `frontend/.env` file with:
```env
VITE_API_BASE=http://localhost:8000/api

# Paste the same public key here:
VITE_VAPID_PUBLIC_KEY=ABC123... (paste your public key - same as backend)
```

### Step 3: Run the Application

#### Start Backend

**Windows:**
```bash
cd backend
run.bat
```

**Or manually:**
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

Backend will run at: http://localhost:8000

#### Start Frontend (in a new terminal)

**Windows:**
```bash
cd frontend
run.bat
```

**Or manually:**
```bash
cd frontend
npm run dev
```

Frontend will run at: http://localhost:5173

## ✅ Verify It Works

1. Open browser: http://localhost:5173
2. Login or Register
3. Go to **Settings** page
4. Check **Web Push Notifications** section:
   - ✅ Warning message should be GONE
   - ✅ Button should be ENABLED (not grayed out)
5. Click **"Subscribe to Push Notifications"**
   - Browser will ask for permission
   - Click **"Allow"**
   - You should see "✓ Subscribed"

## 🔧 Troubleshooting

### Issue: "VAPID keys are not configured" still showing

**Solution:**
1. Make sure `.env` files exist in both `backend/` and `frontend/` folders
2. Check that keys are copied correctly (no spaces, complete keys)
3. **Restart both servers** (environment variables load on startup)
4. Clear browser cache and refresh

### Issue: Button is still disabled

**Solution:**
1. Open browser DevTools (F12)
2. Check Console for errors
3. Verify backend is running: http://localhost:8000/docs
4. Check that `VITE_VAPID_PUBLIC_KEY` in frontend/.env matches `VAPID_PUBLIC_KEY` in backend/.env

### Issue: "Service worker is not available"

**Solution:**
1. Make sure you're using HTTPS or localhost (required for service workers)
2. Check browser DevTools → Application → Service Workers
3. Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. Clear browser cache

### Issue: Python command not found

**Solution:**
1. Make sure Python is installed: `python --version`
2. If using virtual environment, activate it first:
   ```bash
   cd backend
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # Linux/Mac
   ```
3. Install cryptography: `pip install cryptography`

### Issue: Backend won't start

**Solution:**
1. Install dependencies: `pip install -r requirements.txt`
2. Check Python version (needs 3.11+)
3. Make sure port 8000 is not in use

### Issue: Frontend won't start

**Solution:**
1. Install dependencies: `npm install`
2. Check Node.js version (needs 18+)
3. Clear cache: `rm -rf node_modules package-lock.json && npm install`

## 📝 Example .env Files

### backend/.env
```env
APP_ENV=dev
SECRET_KEY=my-secret-key-change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
DATABASE_URL=sqlite:///./dev.db
FRONTEND_ORIGIN=http://localhost:5173
VAPID_PUBLIC_KEY=your-generated-public-key-here
VAPID_PRIVATE_KEY=your-generated-private-key-here
```

### frontend/.env
```env
VITE_API_BASE=http://localhost:8000/api
VITE_VAPID_PUBLIC_KEY=your-generated-public-key-here
```

## 🎯 What to Expect

**Before setup:**
- ❌ Warning message: "Configuration Required"
- ❌ Button disabled (grayed out)
- ❌ Cannot subscribe to push notifications

**After setup:**
- ✅ No warning message
- ✅ Button enabled (blue, clickable)
- ✅ Can subscribe to push notifications
- ✅ Browser asks for notification permission
- ✅ Shows "✓ Subscribed" after subscribing

## 📚 Additional Resources

- Detailed VAPID setup: [VAPID_SETUP.md](VAPID_SETUP.md)
- Quick start guide: [QUICK_START.md](QUICK_START.md)
- Full documentation: [README.md](README.md)

## 💡 Tips

1. **Keep keys secure**: Never commit `.env` files to git
2. **Use different keys**: Use different keys for development and production
3. **Test in browser**: Push notifications only work in supported browsers (Chrome, Firefox, Edge, Safari)
4. **HTTPS required**: In production, HTTPS is required for push notifications (localhost works for development)

## 🆘 Still Having Issues?

1. Check all steps above
2. Verify .env files are in the correct locations
3. Make sure both servers are running
4. Check browser console for errors
5. Verify keys are complete and correct
6. Try regenerating keys if they don't work

Good luck! 🚀

