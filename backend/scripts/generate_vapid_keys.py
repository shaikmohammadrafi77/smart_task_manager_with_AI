"""Generate VAPID keys for web push notifications"""

import base64
from cryptography.hazmat.primitives.asymmetric import ec


def generate_vapid_keys():
    """Generate VAPID public and private keys in the correct format for web-push"""
    # Generate a new EC private key using SECP256R1 (P-256)
    private_key = ec.generate_private_key(ec.SECP256R1())
    
    # Get the public key
    public_key = private_key.public_key()
    
    # Get the key numbers
    private_key_numbers = private_key.private_numbers()
    public_key_numbers = public_key.public_numbers()
    
    # VAPID public key: Concatenate x and y coordinates (each 32 bytes, total 64 bytes)
    # Pad to 32 bytes if needed
    x_bytes = public_key_numbers.x.to_bytes(32, 'big')
    y_bytes = public_key_numbers.y.to_bytes(32, 'big')
    public_key_bytes = x_bytes + y_bytes
    
    # Encode as base64 URL-safe string (no padding)
    vapid_public_key = base64.urlsafe_b64encode(public_key_bytes).decode('utf-8').rstrip('=')
    
    # VAPID private key: The private value as 32 bytes
    private_key_bytes = private_key_numbers.private_value.to_bytes(32, 'big')
    
    # Encode as base64 URL-safe string (no padding)
    vapid_private_key = base64.urlsafe_b64encode(private_key_bytes).decode('utf-8').rstrip('=')
    
    return vapid_public_key, vapid_private_key


if __name__ == "__main__":
    print("Generating VAPID keys for web push notifications...")
    print("-" * 60)
    
    try:
        public_key, private_key = generate_vapid_keys()
        
        print("\n✅ VAPID Keys Generated Successfully!")
        print("\n" + "=" * 60)
        print("PUBLIC KEY (for frontend .env):")
        print("=" * 60)
        print(f"VITE_VAPID_PUBLIC_KEY={public_key}")
        print("\n" + "=" * 60)
        print("PRIVATE KEY (for backend .env):")
        print("=" * 60)
        print(f"VAPID_PRIVATE_KEY={private_key}")
        print("\n" + "=" * 60)
        print("PUBLIC KEY (for backend .env - same as frontend):")
        print("=" * 60)
        print(f"VAPID_PUBLIC_KEY={public_key}")
        print("\n" + "=" * 60)
        print("\n📝 Instructions:")
        print("1. Copy VITE_VAPID_PUBLIC_KEY to frontend/.env")
        print("2. Copy VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY to backend/.env")
        print("3. Restart both frontend and backend servers")
        print("4. Push notifications will now work!")
        print("\n" + "=" * 60)
        print("\n💡 Tip: The frontend can also fetch the public key from the API")
        print("   endpoint: GET /notifications/vapid-public-key")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Error generating VAPID keys: {e}")
        print("\nPlease install cryptography: pip install cryptography")
        print("Run: pip install cryptography")
        import sys
        sys.exit(1)

