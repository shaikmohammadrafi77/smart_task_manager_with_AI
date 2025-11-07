"""AI suggestion endpoints"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional

from app.api.auth import get_current_user_dependency
from app.models.user import User
from app.services.ai_service import get_ai_suggestions

router = APIRouter()


class TaskContext(BaseModel):
    """Task context for AI suggestions"""

    title: Optional[str] = None
    description: Optional[str] = None
    estimated_duration_minutes: Optional[int] = None


class AISuggestionResponse(BaseModel):
    """AI suggestion response"""

    suggested_priority: str
    priority_reason: str
    suggested_time_slots: list[dict]
    reasoning: str


@router.post("/suggest", response_model=AISuggestionResponse)
async def suggest_task_priority_and_time(
    task_context: Optional[TaskContext] = None,
    user: User = Depends(get_current_user_dependency),
) -> AISuggestionResponse:
    """Get AI suggestions for task priority and optimal time slots"""
    suggestions = await get_ai_suggestions(user.id, task_context)

    return AISuggestionResponse(
        suggested_priority=suggestions["priority"],
        priority_reason=suggestions["priority_reason"],
        suggested_time_slots=suggestions["time_slots"],
        reasoning=suggestions["reasoning"],
    )

