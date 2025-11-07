"""Reminder job that fires when task reminder time is reached"""

from datetime import datetime, timezone

from sqlmodel import Session, select

from app.db import engine
from app.models.task import Task
from app.models.notification import Notification, Channel
from app.services.notification_service import send_web_push, send_email_notification


def send_reminder(task_id: int) -> None:
    """Send reminder for a task"""
    with Session(engine) as session:
        # Get task
        statement = select(Task).where(Task.id == task_id)
        task = session.exec(statement).first()

        if not task:
            return  # Task doesn't exist

        # Create notification record
        notification = Notification(
            user_id=task.user_id,
            task_id=task.id,
            channel=Channel.WEB_PUSH,  # We'll try web push first
            scheduled_for=task.remind_at or task.due_at or datetime.now(timezone.utc),
            payload_json={
                "title": f"Reminder: {task.title}",
                "body": task.description or "Task reminder",
                "task_id": task.id,
            },
        )
        session.add(notification)
        session.commit()
        session.refresh(notification)

        # Send web push if subscription exists
        send_web_push(task.user_id, notification)

        # Send email notification
        send_email_notification(task.user_id, task, notification)

        # Mark as delivered
        notification.delivered_at = datetime.now(timezone.utc)
        session.add(notification)
        session.commit()

