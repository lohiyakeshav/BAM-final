from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
import json
from datetime import datetime
from typing import List, Optional

from app.database.models import Portfolio, User
from app.schemas.portfolio import PortfolioCreate, PortfolioResponse
from app.models.schemas import UserProfile, WealthManagementResponse

def create_portfolio(db: Session, portfolio: PortfolioCreate, user_id: int) -> Portfolio:
    """Create a new portfolio for a user"""
    db_portfolio = Portfolio(
        user_id=user_id,
        user_json=json.dumps(portfolio.user_json),
        portfolio_json=json.dumps(portfolio.portfolio_json),
        created_at=datetime.now()
    )
    db.add(db_portfolio)
    db.commit()
    db.refresh(db_portfolio)
    return db_portfolio

def get_portfolio_by_id(db: Session, portfolio_id: int) -> Portfolio:
    """Get a specific portfolio by ID"""
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found"
        )
    
    return portfolio

def get_user_portfolios(db: Session, user_id: int) -> List[Portfolio]:
    """Get all portfolios for a user"""
    return db.query(Portfolio).filter(Portfolio.user_id == user_id).all()

def get_latest_portfolio(db: Session, user_id: int) -> Optional[Portfolio]:
    """Get the latest portfolio for a user"""
    return db.query(Portfolio)\
        .filter(Portfolio.user_id == user_id)\
        .order_by(Portfolio.created_at.desc())\
        .first()

def update_portfolio(db: Session, portfolio_id: int, portfolio: PortfolioCreate):
    """Update an existing portfolio"""
    db_portfolio = get_portfolio_by_id(db, portfolio_id)
    
    db_portfolio.user_json = json.dumps(portfolio.user_json)
    db_portfolio.portfolio_json = json.dumps(portfolio.portfolio_json)
    
    db.commit()
    db.refresh(db_portfolio)
    
    return db_portfolio

def delete_portfolio(db: Session, portfolio_id: int):
    """Delete a portfolio"""
    portfolio = get_portfolio_by_id(db, portfolio_id)
    
    db.delete(portfolio)
    db.commit()
    
    return {"message": "Portfolio deleted successfully"}

def save_user_portfolio(
    db: Session, 
    user_id: int, 
    user_profile: UserProfile, 
    portfolio_data: WealthManagementResponse
) -> Portfolio:
    """
    Save or update a user's portfolio data.
    If the user already has a portfolio, it will be overwritten.
    """
    # Convert the Pydantic models to dictionaries
    user_json = user_profile.dict()
    portfolio_json = portfolio_data.dict()
    
    # Check if user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if the user has an existing portfolio
    existing_portfolio = db.query(Portfolio).filter(Portfolio.user_id == user_id).first()
    
    if existing_portfolio:
        # Update existing portfolio
        existing_portfolio.user_json = json.dumps(user_json)
        existing_portfolio.portfolio_json = json.dumps(portfolio_json)
        existing_portfolio.created_at = datetime.now()
        
        try:
            db.commit()
            db.refresh(existing_portfolio)
            return existing_portfolio
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update portfolio data"
            )
    else:
        # Create new portfolio
        new_portfolio = Portfolio(
            user_id=user_id,
            user_json=json.dumps(user_json),
            portfolio_json=json.dumps(portfolio_json),
            created_at=datetime.now()
        )
        
        try:
            db.add(new_portfolio)
            db.commit()
            db.refresh(new_portfolio)
            return new_portfolio
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save portfolio data"
            ) 