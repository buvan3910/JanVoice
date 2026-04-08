# JanVoice AI - Multimodal Vision-Language Feature PRD

## Original Problem Statement
Enhancement to add Multimodal Vision-Language AI Feature for IMAGE-BASED COMPLAINT ANALYSIS using Vision-Language Model (VLM).

## Architecture
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: FastAPI + SQLAlchemy (SQLite)
- **AI Integration**: Google Gemini Vision API via emergentintegrations library
- **Image Processing**: Pillow for validation and resizing

## User Personas
1. **Citizens**: Upload images of civic issues (garbage, potholes, water leaks) for auto-analysis
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

## What's Been Implemented (Jan 2026)

### Backend
- [x] POST `/api/ai/analyze-image` endpoint
- [x] Image validation (type, size)
- [x] Gemini Vision integration via emergentintegrations
- [x] JSON response with description, department, category, confidence
- [x] Error handling for invalid/unclear images

### Frontend
- [x] "AI ANALYSIS FROM IMAGE" section on Raise Complaint page
- [x] SELECT IMAGE button with file picker
- [x] Image preview with loading indicator
- [x] Auto-fill form fields after analysis
- [x] Success/error message display
- [x] 5MB limit enforcement client-side

## API Response Format
```json
{
  "description": "There is garbage overflowing on the roadside",
  "department": "Sanitation",
  "category": "Garbage Overflow",
  "confidence": 0.87
}
```

## Backlog / Future Features
- P0: None
- P1: 
  - Add image annotation highlighting detected issues
  - Support for multiple image uploads
- P2:
  - Video analysis support
  - Historical image comparison

## Next Tasks
1. Add more comprehensive error messages for different failure modes
2. Add loading skeleton during image analysis
3. Implement batch image upload
