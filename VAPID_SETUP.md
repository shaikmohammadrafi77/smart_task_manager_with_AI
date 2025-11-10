# VAPID Keys Setup Guide

This guide will help you set up VAPID keys for web push notifications.

## What are VAPID Keys?

VAPID (Voluntary Application Server Identification) keys are used to authenticate your application server with push service providers (like Google's FCM, Mozilla's push service, etc.) when sending web push notifications.

## Quick Setup

### Option 1: Using the Script (Recommended)

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies (if not already installed):**
   ```bash
   pip install cryptography pywebpush
   ```

3. **Run the key generation script:**
   
   **Windows:**
   ```bash
   scripts\generate_vapid_keys.bat
   ```
   
   **Linux/Mac:**
   ```bash
   chmod +x scripts/generate_vapid_keys.sh
   ./scripts/generate_vapid_keys.sh
   ```
   
   **Or directly with Python:**
   ```bash
   python scripts/generate_vapid_keys.py
   ```

4. **Copy the generated keys to your `.env` files:**
   
   **Backend `.env` (backend/.env):**
   ```env
   VAPID_PUBLIC_KEY=<generated-public-key>
   VAPID_PRIVATE_KEY=<generated-private-key>
   ```
   
   **Frontend `.env` (frontend/.env):**
   ```env
   VITE_VAPID_PUBLIC_KEY=<generated-public-key>
   ```
   
   **Note:** The public key is the same for both backend and frontend!

5. **Restart your servers:**
   - Restart the backend server
   - Restart the frontend dev server

### Option 2: Manual Generation

If you prefer to generate keys manually, you can use the Python script:

```python
from cryptography.hazmat.primitives.asymmetric import ec
import base64

# Generate keys
private_key = ec.generate_private_key(ec.SECP256R1())
public_key = private_key.public_key()

# Get key numbers
private_key_numbers = private_key.private_numbers()
public_key_numbers = public_key.public_numbers()

# Generate VAPID public key (64 bytes: x + y coordinates)
x_bytes = public_key_numbers.x.to_bytes(32, 'big')
y_bytes = public_key_numbers.y.to_bytes(32, 'big')
public_key_bytes = x_bytes + y_bytes
vapid_public_key = base64.urlsafe_b64encode(public_key_bytes).decode('utf-8').rstrip('=')

# Generate VAPID private key (32 bytes)
private_key_bytes = private_key_numbers.private_value.to_bytes(32, 'big')
vapid_private_key = base64.urlsafe_b64encode(private_key_bytes).decode('utf-8').rstrip('=')

print(f"VAPID_PUBLIC_KEY={vapid_public_key}")
print(f"VAPID_PRIVATE_KEY={vapid_private_key}")
```

## Automatic Key Fetching

The frontend can automatically fetch the VAPID public key from the backend API if it's not configured in the environment variables. The backend exposes an endpoint:

```
GET /notifications/vapid-public-key
```

This allows the frontend to work without requiring VAPID keys in the frontend `.env` file, as long as the backend has them configured.

## Verification

After setting up VAPID keys:

1. **Check the Settings page:**
   - Navigate to Settings in the application
   - The "Configuration Required" message should disappear
   - The "Subscribe to Push Notifications" button should be enabled

2. **Test subscription:**
   - Click "Subscribe to Push Notifications"
   - Your browser should ask for notification permission
   - After granting permission, you should see "✓ Subscribed"

3. **Verify in browser console:**
   - Open browser DevTools
   - Check the Console for any errors
   - Verify that the service worker is registered

## Troubleshooting

### "VAPID keys are not configured" error

- **Check backend `.env`:** Ensure `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` are set
- **Check frontend `.env`:** Ensure `VITE_VAPID_PUBLIC_KEY` is set (or backend API is accessible)
- **Restart servers:** Both backend and frontend need to be restarted after changing `.env` files

### "Service worker is not available" error

- **Check service worker registration:** The service worker should be registered automatically by Vite PWA plugin
- **Check browser console:** Look for service worker registration errors
- **HTTPS required:** Push notifications require HTTPS (or localhost for development)

### "Notification permission denied" error

- **Check browser settings:** Ensure notifications are allowed for your site
- **Reset permissions:** Go to browser settings and reset site permissions
- **Try incognito mode:** Some browsers have stricter permissions in incognito mode

### Keys not working after generation

- **Verify key format:** Keys should be base64 URL-safe encoded strings
- **Check key length:** Public key should be ~87 characters, private key should be ~43 characters
- **Regenerate keys:** If keys are corrupted, generate new ones

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit keys to version control:**
   - Add `.env` to `.gitignore`
   - Never share private keys publicly
   - Use different keys for development and production

2. **Private key security:**
   - The `VAPID_PRIVATE_KEY` should ONLY be in the backend `.env`
   - Never expose the private key to the frontend
   - Keep the private key secure and rotate it periodically

3. **Production setup:**
   - Use environment variables or secrets management in production
   - Consider using a secrets manager (AWS Secrets Manager, HashiCorp Vault, etc.)
   - Rotate keys periodically for security

## Additional Resources

- [Web Push Protocol](https://tools.ietf.org/html/rfc8030)
- [VAPID Specification](https://tools.ietf.org/html/rfc8292)
- [Web Push Libraries](https://github.com/web-push-libs/)

## Support

If you encounter issues:

1. Check the browser console for errors
2. Verify all environment variables are set correctly
3. Ensure both servers are running and accessible
4. Check that the service worker is registered
5. Verify browser support for push notifications

For more help, refer to the main project documentation or open an issue on GitHub.

