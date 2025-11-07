"""Task service with reminder scheduling"""

from datetime import datetime, timezone

from sqlmodel import Session, select

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate
from app.core.scheduler import scheduler
from app.jobs.reminder_job import send_reminder


async def create_task_with_reminder(
    session: Session, user_id: int, task_data: TaskCreate
) -> Task:
    """Create a task and schedule reminder if needed"""
    task = Task(
        user_id=user_id,
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        due_at=task_data.due_at,
        remind_at=task_data.remind_at,
    )
    session.add(task)
    session.commit()
    session.refresh(task)

    # Schedule reminder if remind_at is set and in the future
    if task.remind_at and task.remind_at > datetime.now(timezone.utc):
        job_id = f"reminder:{task.id}"
        scheduler.add_job(
            send_reminder,
            "date",
            run_date=task.remind_at,
            id=job_id,
            args=[task.id],
            replace_existing=True,
        )

    return task


async def update_task_with_reminder(
    session: Session, task: Task, task_data: TaskUpdate
) -> Task:
    """Update a task and reschedule reminder if needed"""
    # Update fields
    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description
    if task_data.priority is not None:
        task.priority = task_data.priority
    if task_data.due_at is not None:
        task.due_at = task_data.due_at
    if task_data.remind_at is not None:
        task.remind_at = task_data.remind_at
    if task_data.status is not None:
        task.status = task_data.status

    task.updated_at = datetime.now(timezone.utc)
    session.add(task)
    session.commit()
    session.refresh(task)

    # Remove old reminder job
    job_id = f"reminder:{task.id}"
    try:
        scheduler.remove_job(job_id)
    except Exception:
        pass  # Job might not exist

    # Schedule new reminder if needed
    if task.remind_at and task.remind_at > datetime.now(timezone.utc):
        scheduler.add_job(
            send_reminder,
            "date",
            run_date=task.remind_at,
            id=job_id,
            args=[task.id],
            replace_existing=True,
        )

    return task


async def delete_task_with_reminder(session: Session, task: Task) -> None:
    """Delete a task and remove its reminder job"""
    # Remove reminder job
    job_id = f"reminder:{task.id}"
    try:
        scheduler.remove_job(job_id)
    except Exception:
        pass  # Job might not exist

    session.delete(task)
    session.commit()


async def rebuild_reminder_jobs() -> None:
    """Rebuild reminder jobs from existing tasks on startup"""
    from app.db import engine
    from sqlmodel import Session, select

    with Session(engine) as session:
        statement = select(Task).where(
            Task.remind_at.isnot(None),
            Task.remind_at > datetime.now(timezone.utc),
        )
        tasks = session.exec(statement).all()

        for task in tasks:
            job_id = f"reminder:{task.id}"
            scheduler.add_job(
                send_reminder,
                "date",
                run_date=task.remind_at,
                id=job_id,
                args=[task.id],
                replace_existing=True,
            )

