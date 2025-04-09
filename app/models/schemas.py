from pydantic import BaseModel, Field
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
    market_trends: Dict[str, Any] = Field(default_factory=dict)
    key_insights: Dict[str, Any] = Field(default_factory=dict)
    impact_analysis: Dict[str, Any] = Field(default_factory=dict)
    sector_performance: Dict[str, str] = Field(default_factory=dict)

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
    sources: List[str] = Field(default_factory=list)
    timestamp: datetime = Field(default_factory=datetime.now) 