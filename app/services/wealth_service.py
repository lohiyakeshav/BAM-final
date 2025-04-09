from crewai import Agent, Task, Crew, Process, LLM
from crewai.tools import tool
from typing import Dict, List, Any, Optional
import os
import json
import asyncio
from datetime import datetime
from ..models.schemas import (
    UserProfile, 
    RiskAnalysis, 
    InvestmentRecommendation,
    WealthManagementResponse,
    NewsArticleCollection,
    MarketAnalysis
)
from ..database.models import Feedback
from ..database.connection import get_db
from dotenv import load_dotenv
import google.generativeai as genai
import re

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-pro')

# Initialize LLM
llm = LLM(
    model='gemini/gemini-2.0-flash',
    api_key=os.environ["GEMINI_API_KEY"]
)

# Create agents
risk_analyzer = Agent(
    role='Risk Analysis Expert',
    goal='Analyze user risk profile and provide comprehensive risk assessment',
    backstory="""You are an experienced risk analyst with deep understanding of 
                Indian financial markets. You evaluate user profiles to determine 
                appropriate risk levels and investment capacity.""",
    verbose=True,
    llm=llm
)

news_analyzer = Agent(
    role='Financial News Analyst',
    goal='Analyze market news and identify relevant trends for investment decisions',
    backstory="""You are a financial news analyst specializing in Indian markets.
                You understand how market news impacts different investment strategies
                and can identify key trends that should influence investment decisions.""",
    verbose=True,
    llm=llm
)

investment_advisor = Agent(
    role='Investment Advisor',
    goal='Provide personalized investment recommendations and portfolio projections based on risk analysis and market conditions',
    backstory="""You are a certified financial advisor with expertise in Indian markets. 
                You create customized investment strategies considering risk profiles, 
                market conditions, and personal goals. You have deep knowledge of 
                market trends, economic indicators, and can make data-driven projections.
                You focus on long-term wealth creation while managing risk effectively.""",
    verbose=True,
    llm=llm
)

# Create tasks
risk_analysis_task = Task(
    description="""
        Analyze the investor's risk profile comprehensively.
        
        User Profile:
        {user_data}
        
        Required Analysis:
        1. Calculate a risk score (0-100) considering:
           - Age factor: Younger investors can take more risks
           - Income stability: Higher stable income enables more risk
           - Dependencies: More dependents reduce risk capacity
           - Investment horizon: Longer horizon allows more risk
           - Current portfolio: Assess existing risk exposure
           - Stated preferences: Consider user's risk tolerance
           - Debt obligations: Higher debt reduces risk capacity
           - Emergency funds: Inadequate emergency funds reduce risk capacity
           - Insurance coverage: Inadequate insurance reduces risk capacity
        
        2. Determine risk category:
           - Conservative (0-30)
           - Moderate (31-70)
           - Aggressive (71-100)
        
        3. Calculate risk capacity (0-100) based on:
           - Financial situation
           - Time horizon
           - Income stability
           - Emergency fund adequacy
           - Insurance coverage
        
        4. Calculate risk requirement (0-100) based on:
           - Financial goals
           - Required returns
           - Time horizon
           - Inflation expectations
        
        5. Assess risk attitude based on:
           - Stated preferences
           - Investment experience
           - Reaction to market volatility
           - Financial knowledge
        
        6. Identify key risk factors and their impact
        
        7. Provide risk management recommendations
        
        8. Suggest risk mitigation strategies

        9. Be very confident, specific and direct in your analysis
        
        Return a JSON object with the following structure:
        {{
            "risk_analysis": {{
                "risk_score": 65.0,
                "risk_category": "Moderate",
                "risk_capacity": 70.0,
                "risk_requirement": 60.0,
                "risk_attitude": "Balanced",
                "key_factors": ["Age", "Income Stability", "Investment Horizon"],
                "recommendations": ["Diversify portfolio", "Consider tax-efficient investments"],
                "risk_mitigation_strategies": [
                    "Maintain emergency fund",
                    "Regular portfolio rebalancing",
                    "Diversification across asset classes"
                ]
            }}
        }}
    """,
    expected_output="JSON formatted risk analysis with score, category, factors, and recommendations",
    agent=risk_analyzer
)

analyze_news_task = Task(
    description="""
        Analyze the provided market news and identify key trends and insights
        that could impact investment decisions.
        
        News Data:
        {market_news}
        
        Focus on:
        1. Market-moving news
        2. Sector-specific developments
        3. Economic indicators
        4. Policy changes
        5. Market sentiment
        6. Global market trends
        7. Industry-specific growth patterns
        
        Return a JSON object with the following structure:
        {{
            "market_analysis": {{
                "market_trends": ["Bullish market sentiment", "Tech sector growth"],
                "key_insights": ["Interest rates expected to rise", "Strong corporate earnings"],
                "impact_analysis": ["Positive for growth stocks", "Negative for bonds"],
                "sector_performance": {{
                    "technology": "strong",
                    "financials": "moderate",
                    "healthcare": "growing"
                }}
            }}
        }}
        
        Note: The field structure of market_trends, key_insights, and impact_analysis should be
        an array of strings (not objects/dictionaries), and sector_performance should be an 
        object with sector names as keys and performance descriptions as values.
    """,
    expected_output="JSON formatted market analysis with trends, insights, and impact analysis",
    agent=news_analyzer
)

recommend_investments_task = Task(
    description="""
        Based on the risk analysis and market news analysis, provide personalized
        investment recommendations and portfolio projections. Consider:
        - Risk analysis results
        - Market trends and insights
        - User's financial goals
        - Tax saving requirements and tax bracket
        - Asset allocation strategy
        - Historical market performance
        - Current market conditions
        - Sector-specific growth opportunities
        - Global economic trends
        - Debt obligations and repayment strategy
        - Emergency fund status
        - Insurance coverage adequacy
        - User's risk profile
        - User's investment goals
        
        For each recommended investment, provide:
        1. Expected return range based on historical data and current market conditions
        2. Risk-adjusted return projections
        3. Time horizon for achieving target returns
        4. Key factors that could impact the returns
        5. Alternative investment options
        
        Also provide:
        1. Clear investment philosophy
        2. Rebalancing strategy with specific triggers
        3. Tax efficiency considerations
        4. Portfolio monitoring guidelines
        5. Contingency plans for market downturns
        
        ** Be mindful of the user's risk profile and market news and provide the recommendations accordingly. Don't be too rigid with the asset allocation and diversification. **
        **Be realistic with the portfolio recommendations and projections, for example if the user cannot afford a real estate investment then don't recommend it but if REITS are affordable then recommend it.**

        Return a JSON object with the following structure:
        {{
            "risk_analysis": {{"The same risk analysis data as provided in the input"}}
            "recommendations": {{
                "asset_allocation": {{
                    "equity": 60,
                    "debt": 30,
                    "gold": 5,
                    "real_estate": 5
                }},
                "investment_philosophy": "Long-term wealth creation through diversified investments",
                "rebalancing_strategy": "Quarterly rebalancing with 5% threshold triggers",
                "tax_efficiency_considerations": [
                    "Utilize tax-advantaged accounts",
                    "Consider tax-loss harvesting",
                    "Hold investments for long-term capital gains"
                ],
                "monitoring_guidelines": [
                    "Review portfolio quarterly",
                    "Monitor market trends monthly",
                    "Reassess risk profile annually"
                ],
                "contingency_plans": [
                    "Maintain 6 months emergency fund",
                    "Have stop-loss orders for volatile positions",
                    "Diversify across uncorrelated assets"
                ],
                "specific_recommendations": [
                    {{
                        "type": "equity",
                        "instrument": "Index Fund",
                        "allocation": 30,
                        "reasoning": "Long-term growth potential",
                        "projected_return": {{
                            "min": 10.0,
                            "max": 15.0,
                            "time_horizon": "5 years",
                            "key_drivers": ["Market growth", "Sector performance"]
                        }},
                        "risk_factors": ["Market volatility", "Economic cycles"],
                        "alternatives": ["Sector-specific ETFs", "Large-cap funds"]
                    }}
                ],
                "portfolio_projection": {{
                    "total_investment": 1000000,
                    "projected_value": {{
                        "min": 1500000,
                        "max": 2000000,
                        "time_horizon": "5 years",
                        "confidence_level": "medium"
                    }},
                    "key_assumptions": [
                        "Market growth continues at current pace",
                        "Interest rates remain stable",
                        "No major economic disruptions"
                    ]
                }}
            }}
        }}
    """,
    expected_output="Detailed investment recommendations with asset allocation, specific suggestions, and portfolio projections in json format",
    agent=investment_advisor,
    context=[risk_analysis_task, analyze_news_task]
)

# Create crew
wealth_crew = Crew(
    agents=[risk_analyzer, news_analyzer, investment_advisor],
    tasks=[risk_analysis_task, analyze_news_task, recommend_investments_task],
    verbose=1,
    process=Process.sequential
)

def _convert_datetime_to_str(obj: Any) -> Any:
    """Recursively convert datetime objects to ISO format strings"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    elif isinstance(obj, dict):
        return {k: _convert_datetime_to_str(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [_convert_datetime_to_str(item) for item in obj]
    return obj

def _prepare_news_data(news_articles: List[Any]) -> str:
    """Prepare news data for the task by limiting to top 20 articles and formatting as JSON"""
    # Take top 20 articles
    top_articles = news_articles[:20] if news_articles else []
    
    # Prepare articles data with proper datetime handling
    articles_data = []
    for article in top_articles:
        # Get article data with appropriate attribute/key access
        if isinstance(article, dict):
            summary = article.get("summary", "No summary available")
            url = article.get("source_url", article.get("url", ""))
            published = article.get("published_at", article.get("publishedAt", datetime.now()))
            source = article.get("source", "Unknown")
        else:
            summary = getattr(article, "summary", "No summary available")
            url = getattr(article, "source_url", getattr(article, "url", ""))
            published = getattr(article, "published_at", getattr(article, "publishedAt", datetime.now()))
            source = getattr(article, "source", "Unknown")
        
        # Ensure published date is a string
        if isinstance(published, datetime):
            published = published.isoformat()
            
        # Add to articles data
        articles_data.append({
            "summary": summary,
            "url": url,
            "publishedAt": published,
            "source": source
        })
    
    # Convert to JSON string
    return json.dumps({"articles": articles_data})

def _clean_json_response(result_content: str) -> str:
    """
    Clean and extract valid JSON from crew output.
    
    Args:
        result_content: The raw output from crew.kickoff()
        
    Returns:
        A cleaned JSON string ready for parsing
    """
    # If it's not already valid JSON (doesn't start with '{')
    if not result_content.strip().startswith('{'):
        # First, clean any triple backticks which are common in Crew outputs
        result_content = re.sub(r'```(?:json)?\s*|\s*```', '', result_content)
        
        # Then try to extract a JSON object using regex
        json_match = re.search(r'\{.*\}', result_content, re.DOTALL)
        if json_match:
            result_content = json_match.group()
    
    # Additional cleaning to handle potential JSON issues
    result_content = result_content.strip()
    
    return result_content

async def get_wealth_management_advice(
    user_profile: UserProfile,
    market_news: Optional[NewsArticleCollection] = None
) -> WealthManagementResponse:
    """Get personalized wealth management advice using AI agents"""
    loop = None
    try:
        # Convert user data to dict and ensure all datetime objects are strings
        user_data_dict = _convert_datetime_to_str(user_profile.dict())
        
        # Create inputs dictionary with user data
        inputs = {
            'user_data': json.dumps(user_data_dict)
        }
        
        # If market news is provided, add it to the inputs
        if market_news and market_news.articles:
            formatted_news = _prepare_news_data(market_news.articles)
            inputs['market_news'] = formatted_news
        else:
            # Provide empty news data
            inputs['market_news'] = json.dumps({"articles": []})

        # Create a new event loop for this call
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        # Run the crew with the input parameters
        result = wealth_crew.kickoff(inputs=inputs)

        # Extract the content from CrewOutput
        if hasattr(result, 'content'):
            result_content = result.content
        else:
            result_content = str(result)

        # Clean and prepare the JSON response
        cleaned_json = _clean_json_response(result_content)

        # Parse the JSON content
        try:
            recommendations_data = json.loads(cleaned_json)
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON: {str(e)}")
            print(f"Raw response: {result_content}")
            print(f"Cleaned JSON: {cleaned_json}")
            # Return default response if parsing fails
            return WealthManagementResponse(
                risk_analysis={
                    "risk_score": 50.0,
                    "risk_category": "Moderate",
                    "risk_capacity": 50.0,
                    "risk_requirement": 50.0,
                    "risk_attitude": "Balanced",
                    "key_factors": ["Default risk factor"],
                    "recommendations": ["Default recommendation"],
                    "risk_mitigation_strategies": ["Default strategy"]
                },
                market_analysis=MarketAnalysis(
                    market_trends=["Default market trend"],
                    key_insights=["Default market insight"],
                    impact_analysis=["Default market impact"],
                    sector_performance={
                        "default": "moderate"
                    }
                ),
                recommendations=InvestmentRecommendation(
                    asset_allocation={
                        "equity": 50,
                        "debt": 30,
                        "gold": 10,
                        "real_estate": 10
                    },
                    investment_philosophy="Default investment philosophy",
                    rebalancing_strategy="Default rebalancing strategy",
                    tax_efficiency_considerations=["Default tax consideration"],
                    monitoring_guidelines=["Default monitoring guideline"],
                    contingency_plans=["Default contingency plan"],
                    specific_recommendations=[
                        {
                            "type": "equity",
                            "instrument": "Default Fund",
                            "allocation": 50,
                            "reasoning": "Default reasoning"
                        }
                    ],
                    portfolio_projection={
                        "total_investment": user_profile.income * 0.3,
                        "projected_value": {
                            "min": user_profile.income * 0.3 * 1.5,
                            "max": user_profile.income * 0.3 * 2.0,
                            "time_horizon": "5 years",
                            "confidence_level": "medium"
                        }
                    }
                )
            )

        # Extract the data from the response
        risk_analysis_data = recommendations_data.get('risk_analysis', {})
        market_analysis_data = recommendations_data.get('market_analysis', {})
        recommendations_data = recommendations_data.get('recommendations', {})

        # Create the response
        return WealthManagementResponse(
            risk_analysis=risk_analysis_data,
            market_analysis=market_analysis_data,
            recommendations=recommendations_data
        )

    except Exception as e:
        print(f"Error in wealth management advice: {str(e)}")
        raise Exception(f"Error processing wealth management advice: {str(e)}")
    finally:
        if loop:
            loop.close()

# def get_wealth_advice(
#     age: int,
#     income: float,
#     dependents: int,
#     investment_horizon: int,
#     existing_investments: List[Dict[str, Any]],
#     risk_tolerance: str,
#     goals: List[Dict[str, Any]]
# ) -> str:
#     """
#     Get personalized wealth management advice using Gemini AI.
#     """
#     try:
#         # Format the input data
#         input_data = {
#             "age": age,
#             "income": income,
#             "dependents": dependents,
#             "investment_horizon": investment_horizon,
#             "existing_investments": existing_investments,
#             "risk_tolerance": risk_tolerance,
#             "goals": goals
#         }

#         # Create the prompt
#         prompt = f"""
#         As a financial advisor, analyze this client's financial situation and provide personalized advice:
        
#         Client Profile:
#         - Age: {age}
#         - Annual Income: ${income:,.2f}
#         - Number of Dependents: {dependents}
#         - Investment Horizon: {investment_horizon} years
#         - Risk Tolerance: {risk_tolerance}
        
#         Current Investments:
#         {json.dumps(existing_investments, indent=2)}
        
#         Financial Goals:
#         {json.dumps(goals, indent=2)}
        
#         Please provide:
#         1. Risk assessment
#         2. Investment recommendations
#         3. Asset allocation strategy
#         4. Specific action items
#         5. Timeline for achieving goals
        
#         Format the response as a JSON object with these sections.
#         """

#         # Generate the response
#         response = model.generate_content(prompt)
        
#         # Return the response text
#         return response.text

#     except Exception as e:
#         return f"Error generating advice: {str(e)}" 