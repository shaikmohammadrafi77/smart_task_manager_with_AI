#!/bin/bash
# Linux/Mac script to setup VAPID keys and create .env files

echo "================================================"
echo "VAPID Keys Setup for Push Notifications"
echo "================================================"
echo ""

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "Error: backend directory not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Navigate to backend
cd backend

# Check if virtual environment exists
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
else
    echo "Warning: Virtual environment not found."
    echo "You may need to create one first: python -m venv venv"
    echo ""
fi

# Check if cryptography is installed
echo "Checking for cryptography library..."
python -c "import cryptography" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Installing cryptography..."
    pip install cryptography
fi

# Generate VAPID keys
echo ""
echo "Generating VAPID keys..."
echo ""
python scripts/generate_vapid_keys.py

if [ $? -ne 0 ]; then
    echo ""
    echo "Error generating VAPID keys!"
    echo "Please make sure Python and cryptography are installed."
    exit 1
fi

echo ""
echo "================================================"
echo "Setup Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Copy the VAPID keys shown above"
echo "2. Create backend/.env file and add:"
echo "   VAPID_PUBLIC_KEY=your-public-key"
echo "   VAPID_PRIVATE_KEY=your-private-key"
echo "3. Create frontend/.env file and add:"
echo "   VITE_VAPID_PUBLIC_KEY=your-public-key"
echo "   VITE_API_BASE=http://localhost:8000/api"
echo "4. Restart both backend and frontend servers"
echo ""

