"""Authentication endpoints"""

from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlmodel import Session, select
from typing import Optional

from app.db import get_session
from app.models.user import User
from app.schemas.auth import UserRegister, UserLogin, TokenResponse, RefreshTokenRequest, UserResponse
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token,
)

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, session: Session = Depends(get_session)) -> UserResponse:
    """Register a new user"""
    # Check if user exists
    statement = select(User).where(User.email == user_data.email)
    existing_user = session.exec(statement).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create user
    user = User(
        email=user_data.email,
        password_hash=get_password_hash(user_data.password),
        name=user_data.name,
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    return UserResponse(
        id=user.id or 0,
        email=user.email,
        name=user.name,
        created_at=user.created_at.isoformat(),
    )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, session: Session = Depends(get_session)) -> TokenResponse:
    """Login and get access/refresh tokens"""
    statement = select(User).where(User.email == credentials.email)
    user = session.exec(statement).first()

    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token = create_access_token({"sub": str(user.id), "email": user.email})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(request: RefreshTokenRequest) -> TokenResponse:
    """Refresh access token using refresh token"""
    payload = decode_token(request.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    user_id = payload.get("sub")
    email = payload.get("email", "")

    access_token = create_access_token({"sub": user_id, "email": email})
    refresh_token = create_refresh_token({"sub": user_id})

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
    )


async def get_current_user_dependency(
    authorization: Optional[str] = Header(None, alias="Authorization"),
    session: Session = Depends(get_session),
) -> User:
    """Get current user from JWT token"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication scheme",
            )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header",
        )

    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    statement = select(User).where(User.id == int(user_id))
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    user: User = Depends(get_current_user_dependency),
) -> UserResponse:
    """Get current user information"""
    return UserResponse(
        id=user.id or 0,
        email=user.email,
        name=user.name,
        created_at=user.created_at.isoformat(),
    )

