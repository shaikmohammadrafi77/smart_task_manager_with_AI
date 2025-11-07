"""Notification model"""

from datetime import datetime, timezone
from typing import Optional
from enum import Enum

from sqlmodel import SQLModel, Field, Relationship, Column, String, JSON


class Channel(str, Enum):
    """Notification channel"""

    WEB_PUSH = "web_push"
    EMAIL = "email"


class Notification(SQLModel, table=True):
    """Notification model"""

    __tablename__ = "notifications"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    task_id: Optional[int] = Field(default=None, foreign_key="tasks.id")
    channel: Channel = Field(index=True)
    scheduled_for: datetime = Field(index=True)
    delivered_at: Optional[datetime] = Field(default=None)
    payload_json: Optional[dict] = Field(default=None, sa_column=Column(JSON))

    # Relationships
    user: "User" = Relationship(back_populates="notifications")
    task: Optional["Task"] = Relationship(back_populates="notifications")

