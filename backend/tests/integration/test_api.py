"""Integration tests for API endpoints"""

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from app.main import app
from app.db import get_session
from app.models.user import User
from app.core.security import get_password_hash


@pytest.fixture
def test_db():
    """Create test database"""
    engine = create_engine("sqlite:///:memory:")
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture
def client(test_db):
    """Create test client"""
    def override_get_session():
        yield test_db
    
    app.dependency_overrides[get_session] = override_get_session
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def test_user(test_db):
    """Create test user"""
    user = User(
        email="test@example.com",
        password_hash=get_password_hash("password123"),
        name="Test User",
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    return user


def test_register(client):
    """Test user registration"""
    response = client.post(
        "/auth/register",
        json={
            "email": "newuser@example.com",
            "password": "password123",
            "name": "New User",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["name"] == "New User"


def test_login(client, test_user):
    """Test user login"""
    response = client.post(
        "/auth/login",
        json={
            "email": "test@example.com",
            "password": "password123",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data


def test_get_me(client, test_user):
    """Test getting current user"""
    # Login first
    login_response = client.post(
        "/auth/login",
        json={
            "email": "test@example.com",
            "password": "password123",
        },
    )
    token = login_response.json()["access_token"]
    
    # Get current user
    response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"

