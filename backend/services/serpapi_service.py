from __future__ import annotations

import os
from typing import Any

import httpx


def _get_serpapi_key() -> str | None:
    return os.getenv("SERPAPI_API_KEY") or None


async def serpapi_google_maps_places(query: str) -> list[dict[str, Any]]:
    api_key = _get_serpapi_key()
    if not api_key:
        raise RuntimeError("SERPAPI_API_KEY is not set")

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

