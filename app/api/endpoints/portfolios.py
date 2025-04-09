from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.connection import get_db
from app.schemas.portfolio import PortfolioCreate, PortfolioResponse
from app.services.portfolio_service import (
    create_portfolio,
    get_user_portfolios,
    get_latest_portfolio,
    get_portfolio_by_id, 
    update_portfolio,
    delete_portfolio
)
from app.dependencies.auth import get_current_user
from app.database.models import User

router = APIRouter()

@router.post("", response_model=PortfolioResponse, status_code=status.HTTP_201_CREATED)
async def create_user_portfolio(
    portfolio: PortfolioCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new portfolio for the current user"""
    return create_portfolio(db, portfolio, current_user.id)

@router.get("", response_model=List[PortfolioResponse])
async def get_portfolios(
    current: bool = Query(False, description="Get only the latest portfolio"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get user portfolios with filtering options
    
    - If current=True, returns only the latest portfolio
    - Otherwise, returns all portfolios for the current user
    """
    if current:
        # Get only the latest portfolio
        portfolio = get_latest_portfolio(db, current_user.id)
        if not portfolio:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No portfolio found for current user"
            )
        return [portfolio]  # Return as a list with one item to match response model
    else:
        # Get all portfolios
        return get_user_portfolios(db, current_user.id)

@router.get("/{portfolio_id}", response_model=PortfolioResponse)
async def get_portfolio(
    portfolio_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific portfolio by ID"""
    portfolio = get_portfolio_by_id(db, portfolio_id)
    
    # Only allow users to see their own portfolios
    if portfolio.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this portfolio"
        )
    
    return portfolio

@router.put("/{portfolio_id}", response_model=PortfolioResponse)
async def update_user_portfolio(
    portfolio_id: int,
    portfolio: PortfolioCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a specific portfolio"""
    # Verify portfolio ownership
    existing_portfolio = get_portfolio_by_id(db, portfolio_id)
    if existing_portfolio.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this portfolio"
        )
    
    return update_portfolio(db, portfolio_id, portfolio)

@router.delete("/{portfolio_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_portfolio(
    portfolio_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a specific portfolio"""
    # Verify portfolio ownership
    existing_portfolio = get_portfolio_by_id(db, portfolio_id)
    if existing_portfolio.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this portfolio"
        )
    
    delete_portfolio(db, portfolio_id)
    return None 