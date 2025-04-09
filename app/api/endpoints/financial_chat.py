from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from app.services.financial_chat_service import get_financial_advice
from app.models.schemas import ChatResponse
from app.dependencies.auth import get_current_user
from app.database.models import User

router = APIRouter()

class ChatRequest(BaseModel):
    """Request model for financial chat"""
    query: str
    user_id: Optional[int] = None

@router.post("", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest,
    current_user: User = Depends(get_current_user)
) -> ChatResponse:
    """
    Chat with a financial advisor AI agent.
    
    The agent can:
    - Answer questions about financial markets
    - Provide investment advice
    - Explain financial concepts
    - Analyze market trends
    - Give personal finance recommendations
    - View and analyze your investment portfolio
    
    The response includes:
    - A detailed answer to your query
    - Sources used for the information
    - Timestamp of the response
    """
    try:
        # Use the authenticated user's ID
        request.user_id = current_user.id
        return await get_financial_advice(request.query, request.user_id)
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing your query: {str(e)}"
        ) 