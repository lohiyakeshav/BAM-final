from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.schemas import UserProfile, WealthManagementResponse
from app.services.wealth_service import get_wealth_management_advice, _convert_datetime_to_str
from app.services.news_service import get_news_summaries
from app.database.connection import get_db
from app.dependencies.auth import get_current_user
from app.database.models import User
from app.schemas.portfolio import PortfolioCreate
from app.services.portfolio_service import create_portfolio

router = APIRouter()

@router.post("/advice", response_model=WealthManagementResponse)
async def get_wealth_management_advice_endpoint(
    user_profile: UserProfile,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> WealthManagementResponse:
    """
    Generate personalized wealth management advice based on user profile and market conditions.
    
    The response includes:
    - Risk analysis
    - Market analysis
    - Investment recommendations
    - Timestamp of the analysis
    """
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