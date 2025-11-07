"""Database configuration and session management"""

from sqlmodel import SQLModel, create_engine, Session

from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
    echo=settings.APP_ENV == "dev",
)


def get_session() -> Session:
    """Dependency for getting database session"""
    with Session(engine) as session:
        yield session


async def init_db() -> None:
    """Initialize database tables"""
    SQLModel.metadata.create_all(engine)

