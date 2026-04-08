from __future__ import annotations

import json
import os
from typing import Any

import httpx


def _get_gemini_key() -> str | None:
    return os.getenv("GEMINI_API_KEY") or None


def _get_gemini_model() -> str:
    return os.getenv("GEMINI_MODEL") or "gemini-1.5-flash"


async def gemini_generate_text(prompt: str) -> str:
    """
    Minimal Gemini REST call using Google Generative Language API.
    Keeps the dependency footprint small (httpx only).
    """
    api_key = _get_gemini_key()
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not set")

    model = _get_gemini_model()
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

    payload: dict[str, Any] = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.2, "maxOutputTokens": 512},
    }

    async with httpx.AsyncClient(timeout=20.0) as client:
        r = await client.post(url, params={"key": api_key}, json=payload)
        r.raise_for_status()
        data = r.json()

    try:
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception:
        return json.dumps(data)


def extract_json_object(text: str) -> dict[str, Any] | None:
    """
    Gemini sometimes wraps JSON in prose or ```json fences.
    This finds the first top-level JSON object by brace matching.
    """
    if not text:
        return None

    s = text.strip()
    if "```" in s:
        # Strip code fences (best-effort)
        s = s.replace("```json", "").replace("```", "").strip()

    start = s.find("{")
    if start == -1:
        return None

    depth = 0
    for i in range(start, len(s)):
        if s[i] == "{":
            depth += 1
        elif s[i] == "}":
            depth -= 1
            if depth == 0:
                chunk = s[start : i + 1]
                try:
                    return json.loads(chunk)
                except Exception:
                    return None
    return None

