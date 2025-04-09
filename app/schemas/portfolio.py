from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from datetime import datetime
from app.models.schemas import UserProfile, WealthManagementResponse

class PortfolioBase(BaseModel):
    user_json: Dict[str, Any]  
    portfolio_json: Dict[str, Any]  

class PortfolioCreate(PortfolioBase):
    pass

class PortfolioResponse(PortfolioBase):
    id: int
    user_id: int
    created_at: Optional[datetime] = None
    # updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 