"""Task model"""

from datetime import datetime, timezone
from typing import Optional
from enum import Enum

from sqlmodel import SQLModel, Field, Relationship, Column, String


class Priority(str, Enum):
    """Task priority levels"""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class Status(str, Enum):
    """Task status"""

    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class Task(SQLModel, table=True):
    """Task model"""

    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=2000)
    priority: Priority = Field(default=Priority.MEDIUM)
    due_at: Optional[datetime] = Field(default=None, index=True)
    remind_at: Optional[datetime] = Field(default=None, index=True)
    status: Status = Field(default=Status.TODO, index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relationships
    user: "User" = Relationship(back_populates="tasks")
    notifications: list["Notification"] = Relationship(back_populates="task")

