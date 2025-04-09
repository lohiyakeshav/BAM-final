from fastapi import APIRouter
import os
from dotenv import load_dotenv
import asyncio
from datetime import datetime

# Import routers from the consolidated structure
from app.api.endpoints.auth import router as auth_router
from app.api.endpoints.portfolios import router as portfolios_router
from app.api.endpoints.feedback import router as feedback_router
from app.api.endpoints.news import router as news_router
from app.api.endpoints.financial_chat import router as chat_router
from app.api.endpoints.wealth_management import router as wealth_router
from app.api.endpoints.market_data import router as market_data_router

# Import services for startup tasks
from app.services.news_service import update_news_cache

# Load environment variables
load_dotenv()

# Create main API router
router = APIRouter(
    prefix="/api",
)

# Root endpoint
@router.get("/")
async def root():
    return {
        "message": "Welcome to the Wealth Management API",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }

# Include all feature-specific routers
router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
router.include_router(portfolios_router, prefix="/portfolios", tags=["Portfolios"])
router.include_router(feedback_router, prefix="/feedback", tags=["Feedback"])
router.include_router(news_router, prefix="/news", tags=["News"])
router.include_router(chat_router, prefix="/chat", tags=["Financial Chat"])
router.include_router(wealth_router, prefix="/wealth", tags=["Wealth Management"])
router.include_router(market_data_router, prefix="/market-data", tags=["Market Data"])

# Background task to update news cache periodically
async def periodic_news_update():
    while True:
        try:
            await update_news_cache()
            print(f"News cache updated at {datetime.now()}")
        except Exception as e:
            print(f"Error in periodic news update: {str(e)}")
        await asyncio.sleep(600)  # Sleep for 10 minutes

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.api.main:router",
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 