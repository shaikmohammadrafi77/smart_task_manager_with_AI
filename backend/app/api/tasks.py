"""Task endpoints"""

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select, or_, and_

from app.db import get_session
from app.models.user import User
from app.models.task import Task, Priority, Status
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.api.auth import get_current_user_dependency
from app.services.task_service import create_task_with_reminder, update_task_with_reminder, delete_task_with_reminder

router = APIRouter()


@router.get("", response_model=list[TaskResponse])
async def list_tasks(
    status_filter: Optional[Status] = Query(None, alias="status"),
    priority: Optional[Priority] = Query(None),
    due_from: Optional[datetime] = Query(None),
    due_to: Optional[datetime] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    user: User = Depends(get_current_user_dependency),
    session: Session = Depends(get_session),
) -> list[TaskResponse]:
    """List tasks with filters and pagination"""
    statement = select(Task).where(Task.user_id == user.id)

    if status_filter:
        statement = statement.where(Task.status == status_filter)
    if priority:
        statement = statement.where(Task.priority == priority)
    if due_from:
        statement = statement.where(Task.due_at >= due_from)
    if due_to:
        statement = statement.where(Task.due_at <= due_to)

    statement = statement.order_by(Task.created_at.desc())
    statement = statement.offset((page - 1) * size).limit(size)

    tasks = session.exec(statement).all()
    return [TaskResponse.model_validate(task) for task in tasks]


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    user: User = Depends(get_current_user_dependency),
    session: Session = Depends(get_session),
) -> TaskResponse:
    """Create a new task"""
    # Validate remind_at <= due_at
    if task_data.remind_at and task_data.due_at:
        if task_data.remind_at > task_data.due_at:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="remind_at must be before or equal to due_at",
            )

    task = await create_task_with_reminder(session, user.id, task_data)
    return TaskResponse.model_validate(task)


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    user: User = Depends(get_current_user_dependency),
    session: Session = Depends(get_session),
) -> TaskResponse:
    """Get a task by ID"""
    statement = select(Task).where(Task.id == task_id, Task.user_id == user.id)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return TaskResponse.model_validate(task)


@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    user: User = Depends(get_current_user_dependency),
    session: Session = Depends(get_session),
) -> TaskResponse:
    """Update a task"""
    statement = select(Task).where(Task.id == task_id, Task.user_id == user.id)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    # Validate remind_at <= due_at if both are being updated
    due_at = task_data.due_at if task_data.due_at is not None else task.due_at
    remind_at = task_data.remind_at if task_data.remind_at is not None else task.remind_at

    if remind_at and due_at and remind_at > due_at:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="remind_at must be before or equal to due_at",
        )

    task = await update_task_with_reminder(session, task, task_data)
    return TaskResponse.model_validate(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    user: User = Depends(get_current_user_dependency),
    session: Session = Depends(get_session),
) -> None:
    """Delete a task"""
    statement = select(Task).where(Task.id == task_id, Task.user_id == user.id)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    await delete_task_with_reminder(session, task)

