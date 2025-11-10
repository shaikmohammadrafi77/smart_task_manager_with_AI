#!/bin/bash
# Generate VAPID keys for web push notifications

cd "$(dirname "$0")/.."

echo "Generating VAPID keys for web push notifications..."
echo ""

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Run the Python script
python scripts/generate_vapid_keys.py

echo ""
read -p "Press Enter to continue..."

