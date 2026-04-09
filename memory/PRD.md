# JanVoice AI - Project Requirements Document

## Original Problem Statement
AI-powered Civic Grievance Platform with Multimodal Vision-Language capabilities for IMAGE-BASED COMPLAINT ANALYSIS.

## Architecture
- **Frontend**: React + Vite + TailwindCSS (Production build in /root)
- **Backend**: FastAPI + SQLAlchemy (SQLite)
- **AI Integration**: Google Gemini Vision API via emergentintegrations library
- **Image Processing**: Pillow for validation and resizing
- **Geo Services**: OpenStreetMap Nominatim (free fallback)

## User Personas
1. **Citizens**: Upload images of civic issues for auto-analysis and complaint submission
2. **Government Officials**: Review AI-classified complaints with confidence scores

## Core Requirements (Static)
1. Image upload option (JPG, PNG, WEBP)
2. Image preview before upload
3. AI-powered image analysis endpoint
4. Auto-fill form fields (description, department, category)
5. User can edit AI-generated content
6. 5MB file size limit
7. Error handling for unclear images
8. Confidence score display

## What's Been Implemented (Apr 2026)

### Backend
- [x] POST `/api/ai/analyze-image` endpoint
- [x] Image validation (type, size)
- [x] Gemini Vision integration via emergentintegrations
- [x] JSON response with description, department, category, confidence
- [x] Error handling for invalid/unclear images
- [x] Free Nominatim fallback for geo/places API

### Frontend
- [x] "AI ANALYSIS FROM IMAGE" section on Raise Complaint page
- [x] SELECT IMAGE button with file picker
- [x] Image preview with loading indicator
- [x] Auto-fill form fields after analysis
- [x] Success/error message display
- [x] Session persistence fixes (HMR configuration)

### Custom Domain Setup
- [x] Production build files in `/root/`
- [x] index.html with SEO meta tags
- [x] favicon.svg
- [x] API auto-detection for custom domains

## Custom Domain Files (/root/)
```
/root/
├── index.html          # Main entry point with SEO
├── favicon.svg         # App favicon
└── assets/
    ├── index-*.js      # Bundled JavaScript
    └── index-*.css     # Bundled CSS
```

## API Response Format
```json
{
  "description": "There is garbage overflowing on the roadside",
  "department": "Sanitation",
  "category": "Garbage Overflow",
  "confidence": 0.87
}
```

## Fixes Applied
1. Visual error after submit - Removed undefined `aiAssistant.insights` references
2. Login redirect issue - Fixed HMR WebSocket configuration
3. Geo API 503 - Added free Nominatim fallback

## Backlog / Future Features
- P0: None
- P1: 
  - Add image annotation highlighting detected issues
  - Support for multiple image uploads
- P2:
  - Video analysis support
  - Historical image comparison

## Next Tasks
1. ~~Configure custom domain DNS settings~~ (User task)
2. ~~Set up SSL for custom domain~~ (Handled by hosting)
3. Add loading skeleton during image analysis
4. Implement batch image upload
