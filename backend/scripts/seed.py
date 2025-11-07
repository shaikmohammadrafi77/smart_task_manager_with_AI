"""Seed script to create demo user and tasks"""

import sys
from pathlib import Path

# Add parent directory to path so we can import app
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from datetime import datetime, timedelta, timezone
from sqlmodel import Session, select

from app.db import engine, init_db
from app.models.user import User
from app.models.task import Task, Priority, Status
from app.core.security import get_password_hash
import asyncio


def seed_database():
    """Create demo user and tasks"""
    with Session(engine) as session:
        # Check if demo user exists
        statement = select(User).where(User.email == "demo@example.com")
        user = session.exec(statement).first()

        if not user:
            # Create demo user
            user = User(
                email="demo@example.com",
                password_hash=get_password_hash("demo123"),
                name="Demo User",
            )
            session.add(user)
            session.commit()
            session.refresh(user)
            print(f"Created demo user: {user.email}")

        # Create sample tasks
        now = datetime.now(timezone.utc)
        
        tasks_data = [
            {
                "title": "Complete project documentation",
                "description": "Write comprehensive docs for the project",
                "priority": Priority.HIGH,
                "due_at": now + timedelta(days=2),
                "remind_at": now + timedelta(days=1),
                "status": Status.TODO,
            },
            {
                "title": "Review code changes",
                "description": "Review pull requests from team",
                "priority": Priority.MEDIUM,
                "due_at": now + timedelta(days=1),
                "remind_at": now + timedelta(hours=12),
                "status": Status.IN_PROGRESS,
            },
            {
                "title": "Team meeting",
                "description": "Weekly team sync meeting",
                "priority": Priority.LOW,
                "due_at": now + timedelta(days=3),
                "remind_at": now + timedelta(days=2, hours=12),
                "status": Status.TODO,
            },
            {
                "title": "Update dependencies",
                "description": "Update npm and pip packages",
                "priority": Priority.MEDIUM,
                "due_at": now + timedelta(days=5),
                "remind_at": now + timedelta(days=4),
                "status": Status.TODO,
            },
            {
                "title": "Write tests",
                "description": "Add unit tests for new features",
                "priority": Priority.HIGH,
                "due_at": now + timedelta(days=1),
                "remind_at": now + timedelta(hours=6),
                "status": Status.DONE,
            },
        ]

        for task_data in tasks_data:
            # Check if task already exists
            statement = select(Task).where(
                Task.user_id == user.id,
                Task.title == task_data["title"],
            )
            existing = session.exec(statement).first()

            if not existing:
                task = Task(user_id=user.id or 0, **task_data)
                session.add(task)
                print(f"Created task: {task_data['title']}")

        session.commit()
        print("Database seeded successfully!")
        print(f"\nDemo credentials:")
        print(f"Email: demo@example.com")
        print(f"Password: demo123")


if __name__ == "__main__":
    asyncio.run(init_db())
    seed_database()
