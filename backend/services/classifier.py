from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class ClassificationResult:
    category: str
    department: str


_RULES: list[tuple[str, list[str], str]] = [
    ("Roads / Infrastructure", ["road", "pothole", "street", "bridge"], "Roads Department"),
    ("Water & Sanitation", ["water", "pipe", "leak", "sewage", "drain"], "Water Department"),
    (
        "Electricity",
        ["electricity", "power", "current", "bescom", "blackout", "transformer"],
        "Electricity Board",
    ),
    ("Waste Management", ["garbage", "waste", "bin", "trash"], "Waste Management"),
    ("Public Safety", ["crime", "theft", "harassment", "assault", "police"], "Police Department"),
]


def classify_complaint(text: str) -> ClassificationResult:
    t = (text or "").lower()
    for category, keywords, dept in _RULES:
        if any(k in t for k in keywords):
            return ClassificationResult(category=category, department=dept)
    return ClassificationResult(category="General", department="Municipal Services")
