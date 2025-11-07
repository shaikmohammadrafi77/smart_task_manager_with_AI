"""Authentication schemas"""

from pydantic import BaseModel, EmailStr


class UserRegister(BaseModel):
    """User registration request"""

    email: EmailStr
    password: str
    name: str


class UserLogin(BaseModel):
    """User login request"""

    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Token response"""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    """Refresh token request"""

    refresh_token: str


class UserResponse(BaseModel):
    """User response"""

    id: int
    email: str
    name: str
    created_at: str

    class Config:
        from_attributes = True

