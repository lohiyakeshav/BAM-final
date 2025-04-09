from fastapi import APIRouter, HTTPException, Query, BackgroundTasks, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv
import asyncio
from datetime import datetime, timedelta
from contextlib import asynccontextmanager

# from app.services.market_data_service import MarketDataService
from app.services.news_service import get_news_summaries, update_news_cache
from app.services.financial_chat_service import get_financial_advice
from app.services.wealth_service import get_wealth_management_advice, _convert_datetime_to_str #get_wealth_advice
from app.models.schemas import (
    UserProfile, 
    NewsArticleCollection,
    ChatResponse,
    WealthManagementResponse
)

from app.api.v1.main import router as v1_router
from app.database.connection import get_db
from app.dependencies.auth import get_current_user
from app.database.models import User
from app.services.portfolio_service import create_portfolio
from app.schemas.portfolio import PortfolioCreate
from sqlalchemy.orm import Session

# Load environment variables
load_dotenv()

# Create router
router = APIRouter(
    prefix="/api",
)

# Include v1 API router
router.include_router(v1_router)

# market_data_service = MarketDataService()

# Background task to update news cache periodically
async def periodic_news_update():
    while True:
        try:
            await update_news_cache()
            print(f"News cache updated at {datetime.now()}")
        except Exception as e:
            print(f"Error in periodic news update: {str(e)}")
        await asyncio.sleep(600)  # Sleep for 10 minutes

@router.get("/")
async def root():
    return {
        "message": "Welcome to the Wealth Management API",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }

@router.get("/news")
async def get_news_endpoint(
    query: str = Query(None, description="Optional search query"),
    language: str = Query("en", description="Language code")
) -> NewsArticleCollection:
    try:
        return get_news_summaries(query, language)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ChatRequest(BaseModel):
    query: str

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest,
    current_user: User = Depends(get_current_user)
) -> ChatResponse:
    try:
        # Get financial advice with the user's query and ID
        response = await get_financial_advice(request.query, current_user.id)
        return response
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/wealth-management")
async def get_wealth_management_advice_endpoint(
    user_profile: UserProfile,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> WealthManagementResponse:
    try:
        # Get latest market news from the cached summaries
        market_news = get_news_summaries()
        
        # Get wealth management advice
        advice = await get_wealth_management_advice(user_profile, market_news)
        
        # Create response with proper timestamp
        response = WealthManagementResponse(
            risk_analysis=advice.risk_analysis,
            market_analysis=advice.market_analysis,
            recommendations=advice.recommendations,
            timestamp=datetime.now()
        )
        
        # Convert response to dict and ensure all datetime objects are properly serialized
        response_dict = _convert_datetime_to_str(response.dict())
        
        # Create portfolio record with both input and output data
        portfolio_data = PortfolioCreate(
            user_json=_convert_datetime_to_str(user_profile.dict()),
            portfolio_json=response_dict
        )
        
        # Save to database with user's ID
        create_portfolio(db, portfolio_data, current_user.id)
        
        return response
    except Exception as e:
        print(f"Error in wealth management endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/market-data")
async def get_market_data():
    """Get real-time market data"""
    try:
        pass
        # market_data = await market_data_service.get_market_data()
        # return market_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.api.main:router",
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 