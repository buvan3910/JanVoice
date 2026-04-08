from __future__ import annotations

import json

from fastapi import APIRouter, HTTPException

from backend.database import get_db_session
from backend.schemas.complaint import (
    ComplaintListResponse,
    ComplaintResponse,
    ComplaintSubmitRequest,
)
from backend.services.complaints_service import (
    create_complaint,
    get_complaint_by_id,
    list_complaints,
)

router = APIRouter(tags=["complaints"])


def _to_response(model) -> ComplaintResponse:
    attachments = {}
    try:
        attachments = json.loads(model.attachments_json or "{}")
    except Exception:
        attachments = {}

    return ComplaintResponse(
        id=model.id,
        public_id=model.public_id,
        title=model.title,
        description=model.description,
        department=model.department,
        category=model.category,
        location=model.location,
        urgency=model.urgency,
        language=model.language,
        status=model.status,
        created_at=model.created_at,
        attachments=attachments,
    )


@router.post("/submit-complaint", response_model=ComplaintResponse)
def submit_complaint(payload: ComplaintSubmitRequest):
    with get_db_session() as db:
        complaint = create_complaint(db, payload)
        return _to_response(complaint)


@router.get("/complaints", response_model=ComplaintListResponse)
def get_complaints():
    with get_db_session() as db:
        items = [_to_response(c) for c in list_complaints(db)]
        return ComplaintListResponse(items=items)


@router.get("/complaints/{complaint_id}", response_model=ComplaintResponse)
def get_complaint(complaint_id: int):
    with get_db_session() as db:
        c = get_complaint_by_id(db, complaint_id)
        if not c:
            raise HTTPException(status_code=404, detail="Complaint not found")
        return _to_response(c)
