"""Unit tests for task service"""

from datetime import datetime, timedelta, timezone
from app.models.task import Task, Priority, Status


def test_task_model():
    """Test task model creation"""
    task = Task(
        user_id=1,
        title="Test Task",
        description="Test description",
        priority=Priority.HIGH,
        status=Status.TODO,
        due_at=datetime.now(timezone.utc) + timedelta(days=1),
    )
    
    assert task.title == "Test Task"
    assert task.priority == Priority.HIGH
    assert task.status == Status.TODO
    assert task.user_id == 1

