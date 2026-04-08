from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from backend.database import Base


class Complaint(Base):
    __tablename__ = "complaints"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    public_id: Mapped[str] = mapped_column(String(32), unique=True, index=True)

    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text)

    category: Mapped[str] = mapped_column(String(80))
    department: Mapped[str] = mapped_column(String(120))

    location: Mapped[str] = mapped_column(String(160))
    urgency: Mapped[str] = mapped_column(String(20))
    language: Mapped[str] = mapped_column(String(30))

    status: Mapped[str] = mapped_column(String(30), default="Pending")

    attachments_json: Mapped[str] = mapped_column(Text, default="{}")

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False), default=datetime.utcnow, index=True
    )
