import sys
from pathlib import Path

# Add the parent directory to the path for module resolution
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Import database and routes
from backend.database import init_db
from backend.routes.ai import router as ai_router
from backend.routes.complaints import router as complaints_router
from backend.routes.geo import router as geo_router

# Create the main app
app = FastAPI(title="JanVoice AI Backend", version="0.2.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Include JanVoice routers
api_router.include_router(complaints_router)
api_router.include_router(ai_router)
api_router.include_router(geo_router)

# Health check endpoint
@api_router.get("/health")
async def health():
    return {"status": "ok"}

@api_router.get("/")
async def root():
    return {"message": "JanVoice AI API", "version": "0.2.0"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
def startup_event():
    init_db()
    logger.info("Database initialized")
