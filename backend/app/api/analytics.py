"""Analytics endpoints"""

from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func, and_

from app.db import get_session
from app.models.user import User
from app.models.task import Task, Status
from app.api.auth import get_current_user_dependency

router = APIRouter()


@router.get("/summary")
async def get_analytics_summary(
    user: User = Depends(get_current_user_dependency),
    session: Session = Depends(get_session),
) -> dict:
    """Get analytics summary for the user"""
    now = datetime.now(timezone.utc)

    # Total tasks
    total_statement = select(func.count(Task.id)).where(Task.user_id == user.id)
    total_tasks = session.exec(total_statement).one() or 0

    # Completed tasks
    completed_statement = select(func.count(Task.id)).where(
        Task.user_id == user.id, Task.status == Status.DONE
    )
    completed_tasks = session.exec(completed_statement).one() or 0

    # Overdue tasks
    overdue_statement = select(func.count(Task.id)).where(
        Task.user_id == user.id,
        Task.due_at < now,
        Task.status != Status.DONE,
    )
    overdue_tasks = session.exec(overdue_statement).one() or 0

    # Tasks per day (last 14 days)
    fourteen_days_ago = now - timedelta(days=14)
    tasks_per_day_statement = (
        select(
            func.date(Task.created_at).label("date"),
            func.count(Task.id).label("count"),
        )
        .where(
            Task.user_id == user.id,
            Task.created_at >= fourteen_days_ago,
        )
        .group_by(func.date(Task.created_at))
        .order_by(func.date(Task.created_at))
    )

    tasks_per_day = {}
    for row in session.exec(tasks_per_day_statement).all():
        date_str = row.date.isoformat() if hasattr(row.date, "isoformat") else str(row.date)
        tasks_per_day[date_str] = row.count

    # Upcoming deadlines (next 7 days)
    seven_days_from_now = now + timedelta(days=7)
    upcoming_statement = (
        select(Task)
        .where(
            Task.user_id == user.id,
            Task.due_at >= now,
            Task.due_at <= seven_days_from_now,
            Task.status != Status.DONE,
        )
        .order_by(Task.due_at)
        .limit(10)
    )

    upcoming_tasks = session.exec(upcoming_statement).all()
    upcoming_deadlines = [
        {
            "id": task.id,
            "title": task.title,
            "due_at": task.due_at.isoformat() if task.due_at else None,
            "priority": task.priority.value,
        }
        for task in upcoming_tasks
    ]

    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "overdue_tasks": overdue_tasks,
        "completion_rate": (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0,
        "tasks_per_day": tasks_per_day,
        "upcoming_deadlines": upcoming_deadlines,
    }

