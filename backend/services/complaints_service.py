from __future__ import annotations

import json
import random
from datetime import datetime

from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from backend.models.complaint import Complaint
from backend.schemas.complaint import ComplaintSubmitRequest
from backend.services.classifier import classify_complaint


def _new_public_id() -> str:
    return f"JV-{random.randint(10000, 99999)}"


def create_complaint(db: Session, payload: ComplaintSubmitRequest) -> Complaint:
    classification = classify_complaint(payload.description)

    department = (payload.department or "").strip() or classification.department
    category = (payload.category or "").strip() or classification.category

    attachments = payload.attachments.model_dump() if payload.attachments else {}

    c = Complaint(
        public_id=_new_public_id(),
        title=payload.title.strip(),
        description=payload.description.strip(),
        department=department,
        category=category,
        location=payload.location.strip(),
        urgency=payload.urgency,
        language=payload.language,
        status="Pending",
        attachments_json=json.dumps(attachments),
        created_at=datetime.utcnow(),
    )
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


def list_complaints(db: Session) -> list[Complaint]:
    stmt = select(Complaint).order_by(desc(Complaint.created_at))
    return list(db.execute(stmt).scalars().all())


def get_complaint_by_id(db: Session, complaint_id: int) -> Complaint | None:
    return db.get(Complaint, complaint_id)
