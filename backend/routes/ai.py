from __future__ import annotations

from fastapi import APIRouter, File, UploadFile, HTTPException

from backend.schemas.ai import AIChatRequest, AIChatResponse, AIClassifyRequest, AIClassifyResponse, ImageAnalysisResponse
from backend.services.ai_service import chat, classify
from backend.services.image_service import analyze_image, ALLOWED_MIME_TYPES, MAX_IMAGE_SIZE


router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/classify", response_model=AIClassifyResponse)
async def ai_classify(payload: AIClassifyRequest):
    out = await classify(payload.description, language=payload.language)
    return AIClassifyResponse(
        department=out.department,
        category=out.category,
        urgency=out.urgency,
        confidence=out.confidence,
        summary=out.summary,
        suggested_title=out.suggested_title,
    )


@router.post("/chat", response_model=AIChatResponse)
async def ai_chat(payload: AIChatRequest):
    reply = await chat([m.model_dump() for m in payload.messages], language=payload.language)
    return AIChatResponse(reply=reply)


@router.post("/analyze-image", response_model=ImageAnalysisResponse)
async def analyze_image_endpoint(image: UploadFile = File(...)):
    """
    Analyze an uploaded image to detect civic issues.
    Returns description, department, and category.
    
    Accepts: JPG, PNG, WEBP (max 5MB)
    """
    # Validate content type
    content_type = image.content_type or ""
    if content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid image type '{content_type}'. Allowed: JPG, PNG, WEBP"
        )
    
    # Read image bytes
    try:
        image_bytes = await image.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read image: {str(e)}")
    
    # Check size
    if len(image_bytes) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=400, detail="Image size exceeds 5MB limit")
    
    # Analyze
    try:
        result = await analyze_image(image_bytes, content_type)
        return ImageAnalysisResponse(
            description=result.description,
            department=result.department,
            category=result.category,
            confidence=result.confidence
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image analysis failed: {str(e)}")

