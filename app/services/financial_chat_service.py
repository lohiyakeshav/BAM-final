from crewai import Agent, Task, Crew, Process, LLM
from typing import List, Dict, Any, Optional
import os
from dotenv import load_dotenv
from ..models.schemas import ChatResponse
from datetime import datetime
import json
import asyncio
from ..tools.search_query import CustomSearchTool
from crewai.tools import tool
from ..database.connection import get_db
from ..database.models import User, Portfolio
from sqlalchemy.orm import Session
from ..services.portfolio_service import get_user_portfolios

# Load environment variables
load_dotenv()

# Initialize LLM
llm = LLM(
    model='gemini/gemini-2.0-flash',
    api_key=os.getenv("GEMINI_API_KEY")
)

@tool("view_user_portfolio")
def view_user_portfolio(user_id: int) -> str:
    """
    View the investment portfolio data for a specific user.
    Returns a JSON string with the portfolio details.
    """
    try:
        db = next(get_db())
        portfolio = db.query(Portfolio).filter(Portfolio.user_id == user_id).first()
        
        if not portfolio:
            return json.dumps({
                "error": "No portfolio found for this user",
                "portfolio": None
            })
        
        # Convert portfolio data to JSON
        portfolio_data = {
            "id": portfolio.id,
            "user_id": portfolio.user_id,
            "asset_allocation": json.loads(portfolio.portfolio_json).get('asset_allocation', {}),
            "performance_projection": json.loads(portfolio.portfolio_json).get('performance_projection', {}),
            "risk_assessment": json.loads(portfolio.portfolio_json).get('risk_analysis', {}),
            "created_at": portfolio.created_at.isoformat(),
            # "updated_at": portfolio.updated_at.isoformat() if portfolio.updated_at else None
        }
        
        return json.dumps({
            "portfolio": portfolio_data
        })
    except Exception as e:
        return json.dumps({
            "error": str(e),
            "portfolio": None
        })

# Define the financial research tool
@tool("financial_research")
def financial_research_tool(query: str) -> str:
    """
    Perform financial research using the custom search tool.
    Returns a JSON string with research findings specific to Indian financial markets.
    """
    try:
        # Initialize the search tool
        search_tool = CustomSearchTool()
        
        # Perform the search using the tool's _run method
        results = search_tool._run(
            query=query,
            limit=5,  # Get top 5 results
            lang="en",
            timeout=60000
        )
        
        # Process and format the results
        formatted_results = {
            "research": {
                "sources": [],
                "key_findings": [],
                "data_points": []
            }
        }
        
        if isinstance(results, list):
            for result in results:
                if isinstance(result, dict):
                    formatted_results["research"]["sources"].append(result.get("url", ""))
                    formatted_results["research"]["key_findings"].append(result.get("content", ""))
                    formatted_results["research"]["data_points"].append({
                        "url": result.get("url", ""),
                        "content": result.get("content", "")
                    })
        
        # Convert to JSON string
        return json.dumps(formatted_results)
    except Exception as e:
        return json.dumps({
            "research": {
                "sources": [],
                "key_findings": [],
                "data_points": []
            }
        })

# Create agents
researcher = Agent(
    role='Indian Financial Market Researcher',
    goal='Gather and analyze financial information specific to Indian markets',
    backstory="""You are an expert financial researcher specializing in Indian markets 
                with deep knowledge of SEBI regulations, Indian market dynamics, and 
                local financial terminology. You use various tools to collect and 
                verify financial information relevant to Indian investors.
                If the user has asked a query that doesn't need to be searched then prevent a tool call.""",
    tools=[financial_research_tool, view_user_portfolio],
    verbose=True,
    llm=llm
)

advisor = Agent(
    role='Indian Financial Advisor',
    goal='Provide accurate and helpful financial advice based on Indian market research',
    backstory="""You are a certified financial advisor with expertise in Indian 
                personal finance and investments. You understand SEBI regulations, 
                Indian tax laws, and local market conditions. You analyze research 
                data to provide clear, actionable advice suitable for Indian investors.""",
    tools=[view_user_portfolio],
    verbose=True,
    llm=llm
)

# Create tasks
research_task = Task(
    description="""
        Research the financial query using available tools, focusing on Indian markets.
        
        Query: {query}
        
        Requirements:
        1. Use the financial research tool to find relevant Indian market information
        2. Gather data from Indian financial sources
        3. Verify the accuracy of information against Indian market data
        4. Organize findings by topic, considering Indian market context
        
        Return a JSON object with the following structure:
        {{
            "research": {{
                "sources": ["Source 1", "Source 2"],
                "key_findings": ["Finding 1", "Finding 2"],
                "data_points": ["Data 1", "Data 2"]
            }}
        }}
    """,
    expected_output="Research findings with sources and data points specific to Indian markets",
    agent=researcher
)

advice_task = Task(
    description="""
        Provide financial advice based on the research findings, focusing on Indian markets. Return dynamic answers that can be easily understood by a layperson.
        
        Query: {query}
        
        Requirements:
        1. Analyze the research findings in Indian market context
        2. Provide clear, actionable advice suitable for Indian investors
        3. Support recommendations with Indian market data
        4. Consider Indian tax implications and regulations
        5. Format the response professionally
        6. If the user has asked a query that doesn't need to be searched then prevent a tool call.
        7. **If the user asked a normal question or greeting then answer that you are not able to assist with that since you are a financial analyst in the same given json format.**
        **Return a JSON object with the following structure:**
        {{
            "advice": {{
                "analysis": "Detailed analysis of the situation in Indian context",
                "recommendations": ["Recommendation 1", "Recommendation 2"],
                "supporting_data": ["Data point 1", "Data point 2"],
                "sources": ["Source 1", "Source 2"]
            }}
        }}
    """,
    expected_output="Comprehensive financial advice with supporting data specific to Indian markets",
    agent=advisor,
    context=[research_task]
)

# Create crew
chat_crew = Crew(
    agents=[researcher, advisor],
    tasks=[research_task, advice_task],
    verbose=1,
    process=Process.sequential
)

async def get_financial_advice(query: str, user_id: Optional[int] = None) -> ChatResponse:
    """Get financial advice based on user query and portfolio data"""
    try:
        # Create inputs dictionary with the query
        inputs = {
            'query': query
        }
        
        # If user_id is provided, get their portfolio data
        if user_id:
            try:
                db = next(get_db())
                portfolio = db.query(Portfolio).filter(Portfolio.user_id == user_id).first()
                if portfolio:
                    portfolio_data = {
                        "asset_allocation": json.loads(portfolio.portfolio_json).get('asset_allocation', {}),
                        "risk_assessment": json.loads(portfolio.portfolio_json).get('risk_analysis', {}),
                        "performance_projection": json.loads(portfolio.portfolio_json).get('performance_projection', {})
                    }
                    inputs['portfolio_data'] = json.dumps(portfolio_data)
            except Exception as e:
                print(f"Error getting portfolio data: {str(e)}")
                # Continue without portfolio data if there's an error

        # Create a new event loop for this call
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        try:
            # Run the crew with the input parameters
            result = chat_crew.kickoff(inputs=inputs)

            # Extract the content from CrewOutput
            if hasattr(result, 'content'):
                result_content = result.content
            else:
                result_content = str(result)

            # Parse the JSON content
            try:
                # Try to extract JSON from the string if it's not already valid JSON
                if not result_content.strip().startswith('{'):
                    import re
                    json_match = re.search(r'\{.*\}', result_content, re.DOTALL)
                    if json_match:
                        result_content = json_match.group()
                
                advice_data = json.loads(result_content)
                
                # Create the response
                return ChatResponse(
                    answer=advice_data.get('advice', {}).get('analysis', 'No advice available'),
                    sources=advice_data.get('advice', {}).get('sources', []),
                    timestamp=datetime.now()
                )
            except json.JSONDecodeError as e:
                print(f"Error parsing JSON: {str(e)}")
                print(f"Raw response: {result_content}")
                return ChatResponse(
                    answer="I apologize, but I'm having trouble processing your request. Please try again.",
                    sources=[],
                    timestamp=datetime.now()
                )
        finally:
            if loop:
                loop.close()

    except Exception as e:
        print(f"Error in financial advice: {str(e)}")
        return ChatResponse(
            answer="I apologize, but I'm having trouble processing your request. Please try again.",
            sources=[],
            timestamp=datetime.now()
        ) 