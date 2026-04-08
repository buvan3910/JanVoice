from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, Field


class AIClassifyRequest(BaseModel):
    description: str = Field(min_length=10, max_length=5000)
    language: Optional[str] = Field(default="English", max_length=30)


class AIClassifyResponse(BaseModel):
    department: str
    category: str
    urgency: Literal["Low", "Medium", "High"] = "Medium"
    confidence: float = Field(ge=0.0, le=1.0, default=0.6)
    summary: str = ""
    suggested_title: str = ""


class ChatMessage(BaseModel):
    role: Literal["user", "ai", "system"]
    content: str


class AIChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(min_length=1)
    language: Optional[str] = Field(default="English", max_length=30)


class AIChatResponse(BaseModel):
    reply: str


class ImageAnalysisResponse(BaseModel):
    description: str
    department: str
    category: str
    confidence: Optional[float] = Field(default=0.7, ge=0.0, le=1.0)

