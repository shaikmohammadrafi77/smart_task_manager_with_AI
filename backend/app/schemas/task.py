"""Task schemas"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.models.task import Priority, Status


class TaskCreate(BaseModel):
    """Task creation request"""

    title: str
    description: Optional[str] = None
    priority: Priority = Priority.MEDIUM
    due_at: Optional[datetime] = None
    remind_at: Optional[datetime] = None


class TaskUpdate(BaseModel):
    """Task update request"""

    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[Priority] = None
    due_at: Optional[datetime] = None
    remind_at: Optional[datetime] = None
    status: Optional[Status] = None


class TaskResponse(BaseModel):
    """Task response"""

    id: int
    user_id: int
    title: str
    description: Optional[str]
    priority: Priority
    due_at: Optional[datetime]
    remind_at: Optional[datetime]
    status: Status
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

