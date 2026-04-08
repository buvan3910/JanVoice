from __future__ import annotations

from contextlib import contextmanager
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker


BACKEND_DIR = Path(__file__).resolve().parent
DB_PATH = BACKEND_DIR / "app.db"

SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH.as_posix()}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def init_db() -> None:
    from backend.models.complaint import Complaint  # noqa: F401

    Base.metadata.create_all(bind=engine)


@contextmanager
def get_db_session() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
