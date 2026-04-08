from backend.routes.ai import router as ai_router
from backend.routes.complaints import router as complaints_router
from backend.routes.geo import router as geo_router

__all__ = ["complaints_router", "ai_router", "geo_router"]

