"""User model"""

from datetime import datetime, timezone
from typing import Optional

from sqlmodel import SQLModel, Field, Relationship


class User(SQLModel, table=True):
    """User model"""

    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    password_hash: str = Field(max_length=255)
    name: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relationships
    tasks: list["Task"] = Relationship(back_populates="user")
    notifications: list["Notification"] = Relationship(back_populates="user")
    push_subscriptions: list["PushSubscription"] = Relationship(back_populates="user")

