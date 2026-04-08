from __future__ import annotations

from datetime import datetime
from typing import Any, Literal, Optional

from pydantic import BaseModel, Field


ComplaintStatus = Literal["Pending", "In Progress", "Resolved", "Forwarded"]
UrgencyLevel = Literal["Low", "Medium", "High"]


class AttachmentMeta(BaseModel):
    name: str
    size: Optional[str] = None
    type: Optional[str] = None


class Attachments(BaseModel):
    photos: list[AttachmentMeta] = Field(default_factory=list)
    videos: list[AttachmentMeta] = Field(default_factory=list)


class ComplaintSubmitRequest(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    description: str = Field(min_length=10, max_length=5000)

    department: Optional[str] = None
    category: Optional[str] = None

    location: str = Field(min_length=2, max_length=160)
    urgency: UrgencyLevel = "Medium"
    language: str = Field(default="English", max_length=30)

    attachments: Optional[Attachments] = None


class ComplaintResponse(BaseModel):
    id: int
    public_id: str

    title: str
    description: str
    department: str
    category: str

    location: str
    urgency: UrgencyLevel
    language: str

    status: ComplaintStatus
    created_at: datetime

    attachments: dict[str, Any] = Field(default_factory=dict)


class ComplaintListResponse(BaseModel):
    items: list[ComplaintResponse]
