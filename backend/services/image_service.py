from __future__ import annotations

import base64
import os
from dataclasses import dataclass
from io import BytesIO
from typing import Optional

from PIL import Image
from dotenv import load_dotenv

load_dotenv()


@dataclass(frozen=True)
class ImageAnalysisResult:
    description: str
    department: str
    category: str
    confidence: float = 0.0


MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}


def validate_image(image_bytes: bytes, content_type: str) -> tuple[bool, str]:
    """Validate image size and type."""
    if len(image_bytes) > MAX_IMAGE_SIZE:
        return False, "Image size exceeds 5MB limit"
    
    if content_type not in ALLOWED_MIME_TYPES:
        return False, f"Invalid image type. Allowed: JPG, PNG, WEBP"
    
    try:
        img = Image.open(BytesIO(image_bytes))
        img.verify()
        return True, ""
    except Exception as e:
        return False, f"Invalid image file: {str(e)}"


def resize_image_if_needed(image_bytes: bytes, max_size: int = 1024) -> bytes:
    """Resize image if too large for API."""
    try:
        img = Image.open(BytesIO(image_bytes))
        if max(img.size) > max_size:
            ratio = max_size / max(img.size)
            new_size = (int(img.size[0] * ratio), int(img.size[1] * ratio))
            img = img.resize(new_size, Image.Resampling.LANCZOS)
        
        # Convert to RGB if necessary (e.g., RGBA or P mode)
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')
        
        buffer = BytesIO()
        img.save(buffer, format='JPEG', quality=85)
        return buffer.getvalue()
    except Exception:
        return image_bytes


async def analyze_image_with_gemini(image_base64: str) -> ImageAnalysisResult:
    """
    Analyze an image using Gemini Vision via emergentintegrations.
    Returns description, department, and category.
    """
    from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent
    
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    if not api_key:
        raise RuntimeError("EMERGENT_LLM_KEY is not set")
    
    chat = LlmChat(
        api_key=api_key,
        session_id=f"image-analysis-{os.urandom(8).hex()}",
        system_message="""You are a civic complaint analyzer. When given an image, you must:
1. Describe the issue visible in the image in detail
2. Identify which government department should handle this
3. Categorize the type of issue

Always respond with ONLY a JSON object in this exact format:
{
  "description": "Detailed description of the issue visible in the image",
  "department": "Name of the relevant government department",
  "category": "Category of the issue",
  "confidence": 0.85
}

Common departments: Sanitation, Roads Department, Water Department, Electricity Board, Police Department, Municipal Services, Health Department, Environment Department
Common categories: Garbage Overflow, Pothole, Water Leakage, Street Light Issue, Illegal Dumping, Road Damage, Sewage Problem, Public Safety, Noise Pollution"""
    ).with_model("gemini", "gemini-2.5-flash")
    
    image_content = ImageContent(image_base64=image_base64)
    
    user_message = UserMessage(
        text="Analyze this image and identify any civic issues. Describe what you see and suggest the appropriate government department and category for this complaint. Respond only with the JSON object.",
        file_contents=[image_content]
    )
    
    response = await chat.send_message(user_message)
    
    # Parse response
    import json
    
    # Try to extract JSON from response
    response_text = response.strip()
    
    # Handle code blocks
    if "```json" in response_text:
        response_text = response_text.split("```json")[1].split("```")[0].strip()
    elif "```" in response_text:
        response_text = response_text.split("```")[1].split("```")[0].strip()
    
    # Find JSON object
    start = response_text.find("{")
    end = response_text.rfind("}") + 1
    
    if start != -1 and end > start:
        json_str = response_text[start:end]
        try:
            data = json.loads(json_str)
            return ImageAnalysisResult(
                description=data.get("description", "Unable to detect issue clearly"),
                department=data.get("department", "Municipal Services"),
                category=data.get("category", "General"),
                confidence=float(data.get("confidence", 0.7))
            )
        except json.JSONDecodeError:
            pass
    
    # Fallback if JSON parsing fails
    return ImageAnalysisResult(
        description=response_text[:500] if response_text else "Unable to detect issue clearly",
        department="Municipal Services",
        category="General",
        confidence=0.5
    )


async def analyze_image(image_bytes: bytes, content_type: str) -> ImageAnalysisResult:
    """
    Main entry point for image analysis.
    Validates, resizes if needed, and sends to Gemini Vision.
    """
    # Validate
    valid, error = validate_image(image_bytes, content_type)
    if not valid:
        raise ValueError(error)
    
    # Resize if needed
    processed_bytes = resize_image_if_needed(image_bytes)
    
    # Convert to base64
    image_base64 = base64.b64encode(processed_bytes).decode("utf-8")
    
    # Analyze with Gemini
    try:
        result = await analyze_image_with_gemini(image_base64)
        return result
    except Exception as e:
        # Return fallback result
        return ImageAnalysisResult(
            description=f"Unable to detect issue clearly: {str(e)}",
            department="Municipal Services",
            category="General",
            confidence=0.0
        )
