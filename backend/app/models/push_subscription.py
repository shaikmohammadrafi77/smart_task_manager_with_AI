"""Push subscription model for Web Push"""

from datetime import datetime, timezone
from typing import Optional

from sqlmodel import SQLModel, Field, Relationship


class PushSubscription(SQLModel, table=True):
    """Web Push subscription model"""

    __tablename__ = "push_subscriptions"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    endpoint: str = Field(max_length=500)
    p256dh: str = Field(max_length=200)
    auth: str = Field(max_length=100)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relationships
    user: "User" = Relationship(back_populates="push_subscriptions")

