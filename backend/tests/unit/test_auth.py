"""Unit tests for authentication"""

import pytest
from app.core.security import get_password_hash, verify_password, create_access_token, decode_token


def test_password_hashing():
    """Test password hashing and verification"""
    password = "test_password_123"
    hashed = get_password_hash(password)
    
    assert hashed != password
    assert verify_password(password, hashed)
    assert not verify_password("wrong_password", hashed)


def test_jwt_token_creation():
    """Test JWT token creation and decoding"""
    data = {"sub": "1", "email": "test@example.com"}
    token = create_access_token(data)
    
    assert token is not None
    assert isinstance(token, str)
    
    decoded = decode_token(token)
    assert decoded is not None
    assert decoded["sub"] == "1"
    assert decoded["email"] == "test@example.com"

