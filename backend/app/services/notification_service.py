"""Notification service for web push and email"""

from sqlmodel import Session, select

from app.db import engine
from app.models.user import User
from app.models.task import Task
from app.models.notification import Notification
from app.models.push_subscription import PushSubscription
from app.core.email import send_email


def send_web_push(user_id: int, notification: Notification) -> None:
    """Send web push notification"""
    with Session(engine) as session:
        # Get user's push subscriptions
        statement = select(PushSubscription).where(PushSubscription.user_id == user_id)
        subscriptions = session.exec(statement).all()

        if not subscriptions:
            return  # No subscriptions

        # For now, we'll just log - full web push implementation would use pywebpush
        # This requires VAPID keys and proper web push library
        print(f"[WEB PUSH] Would send to {len(subscriptions)} subscriptions for notification {notification.id}")
        # TODO: Implement actual web push using pywebpush library


def send_email_notification(user_id: int, task: Task, notification: Notification) -> None:
    """Send email notification for a task"""
    with Session(engine) as session:
        statement = select(User).where(User.id == user_id)
        user = session.exec(statement).first()

        if not user:
            return

        subject = f"Reminder: {task.title}"
        body = f"""
        <h2>Task Reminder</h2>
        <p><strong>{task.title}</strong></p>
        {f'<p>{task.description}</p>' if task.description else ''}
        <p>Due: {task.due_at.strftime('%Y-%m-%d %H:%M') if task.due_at else 'No deadline'}</p>
        <p>Priority: {task.priority.value}</p>
        """

        send_email(user.email, subject, body)

