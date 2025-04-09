from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.main import router as api_router, periodic_news_update
import asyncio
from app.services.news_service import update_news_cache
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get configuration from environment variables
DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

# In development mode, allow all origins for easier testing
if DEBUG:
    ALLOWED_ORIGINS = ["*"]

app = FastAPI(
    title="Wealth Management API",
    description="API for wealth management, financial chat, and news services",
    version="1.0.0",
    debug=DEBUG
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the main API router
app.include_router(api_router)

@app.on_event("startup")
async def startup_event():
    print("Starting up...")
    # Initial cache update
    await update_news_cache()
    # Start the periodic news update task
    asyncio.create_task(periodic_news_update())

@app.on_event("shutdown")
async def shutdown_event():
    print("Shutting down...")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=DEBUG
    ) 