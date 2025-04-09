from pydantic import BaseModel, Field, root_validator
from typing import List, Dict, Optional, Union, Any
from datetime import datetime

class Goal(BaseModel):
    type: str
    target_amount: float
    timeline: int

class NewsArticleSummary(BaseModel):
    published_at: datetime
    summary: str 
    source_url: str

class NewsArticle(BaseModel):
    title: str
    summary: str
    url: str
    publishedAt: str
    source: str

class NewsArticleCollection(BaseModel):
    articles: List[NewsArticleSummary]
    fetch_timestamp: datetime = Field(default_factory=datetime.now)

class UserProfile(BaseModel):
    age: int
    income: float
    dependents: int
    investment_horizon: int
    existing_investments: Union[List[Dict[str, Any]], Dict[str, Any]]
    risk_tolerance: str
    goals: List[Dict[str, Any]]

    class Config:
        arbitrary_types_allowed = True

class RiskAnalysis(BaseModel):
    risk_score: float
    risk_category: str
    key_factors: List[str]
    recommendations: List[str]
    risk_capacity: float = Field(description="User's ability to take risk (0-100)")
    risk_requirement: float = Field(description="Risk needed to achieve goals (0-100)")
    risk_attitude: str = Field(description="User's psychological risk tolerance")
    risk_mitigation_strategies: List[str] = Field(default_factory=list)

class MarketAnalysis(BaseModel):
    # Allow both list and dictionary for flexibility
    market_trends: Union[List[str], Dict[str, Any]] = Field(default_factory=list)
    key_insights: Union[List[str], Dict[str, Any]] = Field(default_factory=list)
    impact_analysis: Union[List[str], Dict[str, Any]] = Field(default_factory=list)
    sector_performance: Dict[str, str] = Field(default_factory=dict)
    
    # Validator to handle both formats
    @root_validator(pre=True)
    def ensure_proper_types(cls, values):
        # Convert list to dict if needed for compatibility
        for field in ['market_trends', 'key_insights', 'impact_analysis']:
            if field in values and isinstance(values[field], list):
                # If it's a list, keep it as is now that we support both formats
                pass
            elif field in values and values[field] is None:
                values[field] = []
        return values

class InvestmentRecommendation(BaseModel):
    asset_allocation: Dict[str, float]
    specific_recommendations: List[Dict[str, Any]]
    portfolio_projection: Dict[str, Any] = Field(default_factory=dict)
    market_news: List[Dict[str, Any]] = Field(default_factory=list)
    investment_philosophy: str = Field(description="Overall investment approach")
    rebalancing_strategy: str = Field(description="How and when to rebalance portfolio")
    tax_efficiency_considerations: List[str] = Field(default_factory=list)
    monitoring_guidelines: List[str] = Field(default_factory=list)
    contingency_plans: List[str] = Field(default_factory=list)

class WealthManagementResponse(BaseModel):
    risk_analysis: Dict[str, Any]
    market_analysis: MarketAnalysis
    recommendations: InvestmentRecommendation
    timestamp: datetime = Field(default_factory=datetime.now)

class ChatResponse(BaseModel):
    """Response model for financial chat service"""
    answer: str
    recommendations: List[str] = Field(default_factory=list, description="Actionable recommendations based on the analysis")
    supporting_data: List[str] = Field(default_factory=list, description="Supporting data points for the recommendations")
    sources: List[str] = Field(default_factory=list, description="Sources of information used in the analysis")
    timestamp: datetime = Field(default_factory=datetime.now) 