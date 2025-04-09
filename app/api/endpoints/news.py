from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from app.models.schemas import NewsArticleCollection
from app.services.news_service import get_news_summaries, fetch_financial_news

router = APIRouter()

@router.get("", response_model=NewsArticleCollection)
async def get_news(
    query: Optional[str] = Query(None, description="Optional search query"),
    language: str = Query("en", description="Language code"),
    latest: bool = Query(False, description="Whether to fetch the latest news directly")
) -> NewsArticleCollection:
    """
    Get news articles with optional filtering.
    
    - If latest=True, fetches and returns the most recent financial news
    - If query is provided, returns news articles matching the query
    - If no query is provided and latest=False, returns cached news summaries
    """
    try:
        if latest:
            # Fetch the latest news directly from the service
            news_data = await fetch_financial_news()
            return NewsArticleCollection.parse_raw(news_data)
        else:
            # Get cached news with optional filtering
            return get_news_summaries(query, language)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 