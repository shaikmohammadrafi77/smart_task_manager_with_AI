"""Main FastAPI application entry point"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.scheduler import scheduler
from app.db import init_db

app = FastAPI(
    title="Smart AI Task Organizer API",
    description="AI-powered task management API",
    version="0.1.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.FRONTEND_ORIGIN.split(",") if settings.FRONTEND_ORIGIN else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event() -> None:
    """Initialize database and scheduler on startup"""
    await init_db()
    scheduler.start()
    # Rebuild reminder jobs from existing tasks
    from app.services.task_service import rebuild_reminder_jobs
    await rebuild_reminder_jobs()


@app.on_event("shutdown")
async def shutdown_event() -> None:
    """Shutdown scheduler on app close"""
    scheduler.shutdown()


@app.get("/health")
async def health_check() -> dict[str, str]:
    """Health check endpoint"""
    return {"status": "ok", "version": "0.1.0"}


# Include routers
from app.api import auth, tasks, analytics, ai, notifications

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
app.include_router(ai.router, prefix="/ai", tags=["ai"])
app.include_router(notifications.router, prefix="/notifications", tags=["notifications"])

