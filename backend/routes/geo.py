from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from backend.schemas.geo import PlacesResponse, ReverseGeocodeResponse
from backend.services.geo_service import (
    format_location_label,
    nominatim_reverse,
    normalize_serpapi_place,
)
from backend.services.serpapi_service import serpapi_google_maps_places


router = APIRouter(prefix="/geo", tags=["geo"])


@router.get("/places", response_model=PlacesResponse)
async def geo_places(q: str = Query(min_length=3, max_length=120)):
    try:
        raw = await serpapi_google_maps_places(q)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception:
        raise HTTPException(status_code=502, detail="Places provider failed")

    items = []
    for it in raw[:10]:
        s = normalize_serpapi_place(it)
        if s:
            items.append(s)
    return PlacesResponse(items=items)


@router.get("/reverse", response_model=ReverseGeocodeResponse)
async def geo_reverse(lat: float, lon: float):
    try:
        data = await nominatim_reverse(lat=lat, lon=lon)
        label, address, ward = format_location_label(data)
        return ReverseGeocodeResponse(label=label, address=address, ward=ward)
    except Exception:
        raise HTTPException(status_code=502, detail="Reverse geocoding failed")

