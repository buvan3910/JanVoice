from __future__ import annotations

from dataclasses import dataclass

from backend.services.classifier import classify_complaint
from backend.services.gemini_service import extract_json_object, gemini_generate_text


@dataclass(frozen=True)
class ClassifyOut:
    department: str
    category: str
    urgency: str
    confidence: float
    summary: str
    suggested_title: str


async def classify_with_gemini(description: str, language: str | None = None) -> ClassifyOut | None:
    lang = language or "English"
    prompt = f"""
You are an assistant for a civic grievance app called JanVoice.
Classify the user's complaint into a department and category, and estimate urgency.

Return ONLY a JSON object with exactly these keys:
- department (string)
- category (string)
- urgency (one of: Low, Medium, High)
- confidence (number 0.0-1.0)
- summary (string, 1 sentence)
- suggested_title (string, short)

User language: {lang}
Complaint description:
\"\"\"{description}\"\"\"
""".strip()

    text = await gemini_generate_text(prompt)
    obj = extract_json_object(text)
    if not obj:
        return None

    try:
        department = str(obj.get("department") or "").strip()
        category = str(obj.get("category") or "").strip()
        urgency = str(obj.get("urgency") or "Medium").strip()
        confidence = float(obj.get("confidence") or 0.6)
        summary = str(obj.get("summary") or "").strip()
        suggested_title = str(obj.get("suggested_title") or "").strip()
    except Exception:
        return None

    if not department or not category:
        return None

    if urgency not in {"Low", "Medium", "High"}:
        urgency = "Medium"
    if confidence < 0:
        confidence = 0.0
    if confidence > 1:
        confidence = 1.0

    return ClassifyOut(
        department=department,
        category=category,
        urgency=urgency,
        confidence=confidence,
        summary=summary,
        suggested_title=suggested_title,
    )


async def classify(description: str, language: str | None = None) -> ClassifyOut:
    """
    Gemini-first, keyword-rule fallback.
    """
    try:
        out = await classify_with_gemini(description, language=language)
        if out:
            return out
    except Exception:
        pass

    rule = classify_complaint(description)
    return ClassifyOut(
        department=rule.department,
        category=rule.category,
        urgency="Medium",
        confidence=0.55,
        summary=f"Reported civic issue routed to {rule.department}.",
        suggested_title=f"{rule.department}: {description.strip()[:40]}".strip(),
    )


async def chat(messages: list[dict[str, str]], language: str | None = None) -> str:
    """
    Simple Gemini-backed chat. If Gemini key is missing, returns a helpful fallback.
    """
    lang = language or "English"
    transcript = []
    for m in messages[-8:]:
        role = m.get("role", "user")
        content = (m.get("content") or "").strip()
        if not content:
            continue
        transcript.append(f"{role.upper()}: {content}")

    prompt = f"""
You are JanVoice AI assistant for a civic grievance portal.
Be concise, helpful, and ask 1 clarifying question if needed.
User language: {lang}

Conversation:
{chr(10).join(transcript)}
""".strip()

    try:
        return (await gemini_generate_text(prompt)).strip()
    except Exception:
        # No key / API failure fallback
        last_user = next((m["content"] for m in reversed(messages) if m.get("role") == "user"), "")
        base = "I can help refine your complaint. " if lang != "Kannada" else "ನಿಮ್ಮ ದೂರನ್ನು ಪರಿಷ್ಕರಿಸಲು ನಾನು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ. "
        return (base + f"Please add location, when it started, and any evidence. You wrote: {last_user}").strip()

