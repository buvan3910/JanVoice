from __future__ import annotations

import os
from typing import Any

import httpx


def _get_serpapi_key() -> str | None:
    return os.getenv("SERPAPI_API_KEY") or None


async def serpapi_google_maps_places(query: str) -> list[dict[str, Any]]:
    """Search for places using SerpAPI or fallback to Nominatim."""
    api_key = _get_serpapi_key()
    
    # If no SerpAPI key, use free Nominatim fallback
    if not api_key:
        return await _nominatim_search(query)

    # SerpAPI: Google Maps engine
    url = "https://serpapi.com/search.json"
    params = {
        "engine": "google_maps",
        "q": query,
        "type": "search",
        "api_key": api_key,
    }

    async with httpx.AsyncClient(timeout=20.0) as client:
        r = await client.get(url, params=params)
        r.raise_for_status()
        data = r.json()

    results = data.get("local_results") or data.get("place_results") or []
    if isinstance(results, dict):
        results = [results]
    if not isinstance(results, list):
        return []
    return results


async def _nominatim_search(query: str) -> list[dict[str, Any]]:
    """Free fallback using OpenStreetMap Nominatim."""
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": query,
        "format": "json",
        "addressdetails": 1,
        "limit": 10,
    }
    headers = {
        "User-Agent": "JanVoice-AI/1.0 (civic complaint app)"
    }
    
    async with httpx.AsyncClient(timeout=15.0) as client:
        r = await client.get(url, params=params, headers=headers)
        r.raise_for_status()
        data = r.json()
    
    # Convert Nominatim format to SerpAPI-like format
    results = []
    for item in data:
        results.append({
            "title": item.get("display_name", "").split(",")[0],
            "address": item.get("display_name", ""),
            "gps_coordinates": {
                "latitude": float(item.get("lat", 0)),
                "longitude": float(item.get("lon", 0))
            },
            "place_id": item.get("place_id"),
            "type": item.get("type", "place")
        })
    
    return results

