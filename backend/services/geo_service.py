from __future__ import annotations

from typing import Any

import httpx

from backend.schemas.geo import PlaceSuggestion


def _pick_lat_lon(item: dict[str, Any]) -> tuple[float | None, float | None]:
    gps = item.get("gps_coordinates") or {}
    lat = gps.get("latitude") if isinstance(gps, dict) else None
    lon = gps.get("longitude") if isinstance(gps, dict) else None
    try:
        lat = float(lat) if lat is not None else None
        lon = float(lon) if lon is not None else None
    except Exception:
        lat, lon = None, None
    return lat, lon


def normalize_serpapi_place(item: dict[str, Any]) -> PlaceSuggestion | None:
    title = (item.get("title") or item.get("name") or "").strip()
    address = (item.get("address") or item.get("formatted_address") or "").strip()
    label = title if title else address
    if title and address:
        label = f"{title} — {address}"

    lat, lon = _pick_lat_lon(item)
    place_id = (item.get("place_id") or item.get("data_id") or item.get("dataId") or None)
    if place_id is not None:
        place_id = str(place_id)

    if not label:
        return None

    return PlaceSuggestion(
        label=label,
        place_id=place_id,
        lat=lat,
        lon=lon,
        address=address or None,
        ward=None,
    )


async def nominatim_reverse(lat: float, lon: float) -> dict[str, Any]:
    # Nominatim requires a User-Agent identifying the application.
    url = "https://nominatim.openstreetmap.org/reverse"
    params = {"format": "jsonv2", "lat": lat, "lon": lon, "zoom": 18, "addressdetails": 1}
    headers = {"User-Agent": "JanVoiceAI/0.1 (local dev)"}

    async with httpx.AsyncClient(timeout=20.0, headers=headers) as client:
        r = await client.get(url, params=params)
        r.raise_for_status()
        return r.json()


def format_location_label(data: dict[str, Any]) -> tuple[str, str | None, str | None]:
    display = (data.get("display_name") or "").strip()
    addr = data.get("address") or {}

    # Ward is not standardized in OSM; best-effort pick of locality fields
    ward = None
    for k in ("suburb", "neighbourhood", "city_district", "county", "city", "town", "village"):
        v = addr.get(k)
        if v:
            ward = str(v)
            break

    address_line = None
    if isinstance(addr, dict) and addr:
        parts = []
        for k in ("road", "suburb", "city", "state", "postcode"):
            if addr.get(k):
                parts.append(str(addr[k]))
        address_line = ", ".join(parts) if parts else None

    label = display or address_line or "Selected location"
    return label, address_line, ward

