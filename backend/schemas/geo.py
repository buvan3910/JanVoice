from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class PlaceSuggestion(BaseModel):
    label: str
    place_id: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
    address: Optional[str] = None
    ward: Optional[str] = None


class PlacesResponse(BaseModel):
    items: list[PlaceSuggestion] = Field(default_factory=list)


class ReverseGeocodeResponse(BaseModel):
    label: str
    address: Optional[str] = None
    ward: Optional[str] = None

