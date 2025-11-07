"""AI service for task suggestions"""

from datetime import datetime, timedelta, timezone
from typing import Optional

from sqlmodel import Session, select, func

from app.db import engine
from app.models.task import Task, Priority, Status
from app.schemas.task import TaskCreate

# Optional ML imports (gracefully handle if not available)
try:
    import numpy as np
    from sklearn.linear_model import LogisticRegression
    ML_AVAILABLE = True
except ImportError:
    ML_AVAILABLE = False


async def get_ai_suggestions(
    user_id: int, task_context: Optional[any] = None
) -> dict:
    """
    Get AI suggestions for task priority and optimal time slots
    Uses heuristic approach with optional ML fallback
    """
    with Session(engine) as session:
        # Get user's task history
        statement = select(Task).where(Task.user_id == user_id)
        all_tasks = session.exec(statement).all()

        # Convert task_context to dict if it's a Pydantic model
        context_dict = None
        if task_context:
            if hasattr(task_context, "model_dump"):
                context_dict = task_context.model_dump()
            elif isinstance(task_context, dict):
                context_dict = task_context

        # Calculate suggested priority using heuristic
        priority, priority_reason = _suggest_priority(context_dict, all_tasks)

        # Calculate suggested time slots
        time_slots, reasoning = _suggest_time_slots(user_id, all_tasks, context_dict)

        return {
            "priority": priority,
            "priority_reason": priority_reason,
            "time_slots": time_slots,
            "reasoning": reasoning,
        }


def _suggest_priority(task_context: Optional[dict], all_tasks: list[Task]) -> tuple[str, str]:
    """Suggest priority using heuristic"""
    if not task_context:
        return Priority.MEDIUM.value, "Default medium priority"

    # Simple heuristic: check for urgency keywords
    title = (task_context.get("title") or "").lower()
    description = (task_context.get("description") or "").lower()
    text = f"{title} {description}"

    urgency_keywords = ["urgent", "asap", "important", "critical", "deadline"]
    has_urgency = any(keyword in text for keyword in urgency_keywords)

    # Check user's historical priority distribution
    if all_tasks:
        high_count = sum(1 for t in all_tasks if t.priority == Priority.HIGH)
        total = len(all_tasks)
        high_ratio = high_count / total if total > 0 else 0

        if has_urgency or high_ratio > 0.3:
            return Priority.HIGH.value, "High priority due to urgency keywords or user's preference for high-priority tasks"
        elif high_ratio < 0.1:
            return Priority.LOW.value, "Low priority based on user's historical task distribution"
        else:
            return Priority.MEDIUM.value, "Medium priority based on user's historical patterns"
    else:
        if has_urgency:
            return Priority.HIGH.value, "High priority due to urgency keywords"
        return Priority.MEDIUM.value, "Default medium priority for new users"


def _suggest_time_slots(
    user_id: int, all_tasks: list[Task], task_context: Optional[dict] = None
) -> tuple[list[dict], str]:
    """Suggest optimal time slots using user's historical completion patterns"""
    now = datetime.now(timezone.utc)
    next_72h = now + timedelta(hours=72)

    # Analyze user's completion patterns
    completed_tasks = [t for t in all_tasks if t.status == Status.DONE and t.due_at]

    if not completed_tasks:
        # Default suggestions for new users
        slot1 = now + timedelta(hours=2)
        slot2 = now + timedelta(hours=24)
        return [
            {
                "start": slot1.isoformat(),
                "end": (slot1 + timedelta(hours=1)).isoformat(),
                "confidence": 0.5,
            },
            {
                "start": slot2.isoformat(),
                "end": (slot2 + timedelta(hours=1)).isoformat(),
                "confidence": 0.5,
            },
        ], "Default time slots for new users"

    # Build histogram of completion times by hour
    hour_counts = {}
    for task in completed_tasks:
        if task.due_at:
            hour = task.due_at.hour
            hour_counts[hour] = hour_counts.get(hour, 0) + 1

    # Find top 2 preferred hours
    sorted_hours = sorted(hour_counts.items(), key=lambda x: x[1], reverse=True)
    preferred_hours = [h[0] for h in sorted_hours[:2]] if sorted_hours else [14, 10]  # Default: 2pm, 10am

    # Generate time slots in next 72h
    time_slots = []
    current = now.replace(minute=0, second=0, microsecond=0)

    while current < next_72h and len(time_slots) < 2:
        if current.hour in preferred_hours:
            confidence = hour_counts.get(current.hour, 0) / len(completed_tasks) if completed_tasks else 0.5
            time_slots.append({
                "start": current.isoformat(),
                "end": (current + timedelta(hours=1)).isoformat(),
                "confidence": min(confidence, 0.9),
            })
        current += timedelta(hours=1)

    # If we don't have enough slots, add defaults
    if len(time_slots) < 2:
        slot = now + timedelta(hours=2)
        time_slots.append({
            "start": slot.isoformat(),
            "end": (slot + timedelta(hours=1)).isoformat(),
            "confidence": 0.5,
        })

    reasoning = f"Based on user's historical completion patterns, preferred hours are {preferred_hours}"

    return time_slots[:2], reasoning

