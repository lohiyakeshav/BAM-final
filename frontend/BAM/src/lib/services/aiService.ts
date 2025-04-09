/**
 * AI Service - Handles AI-driven content generation
 * 
 * This service interfaces with our backend API for:
 * 1. Personalized investment report generation
 * 2. Financial news summarization
 * 3. Natural language query responses
 */

const API_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:4gDp-rI4';

// Types
export interface UserProfile {
  id?: number;
  name?: string;
  email?: string;
  riskAppetite: 'Conservative' | 'Moderate' | 'Aggressive';
  investmentHorizon: number; // in years
  incomeLevel: number; // annual income in INR
}

export interface InvestmentReport {
  id?: number;
  created_at?: string;
  risk_appetite: string;
  investment_horizon: number;
  income_level: number;
  asset_allocation: string;
  performance_projection: string;
  risk_assessment: string;
  user_id?: number;
}

export interface NewsArticle {
  id?: number;
  created_at?: string;
  news_source: string;
  content: string;
  summary: string;
}

export interface QueryResponse {
  id?: number;
  created_at?: string;
  query: string;
  response: string;
  user_id?: number;
}

export interface Feedback {
  id?: number;
  created_at?: string;
  feedback_description: string;
  user_id?: number;
}

// Report Generation Functions
export const generateInvestmentReport = async (
  userProfile: UserProfile
): Promise<InvestmentReport> => {
  try {
    const response = await fetch(`${API_URL}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        risk_appetite: userProfile.riskAppetite,
        investment_horizon: userProfile.investmentHorizon,
        income_level: userProfile.incomeLevel,
        user_id: userProfile.id || 1, // Default to user 1 if no ID provided
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate investment report');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating investment report:', error);
    
    // Return mock data if API fails
    return {
      risk_appetite: userProfile.riskAppetite,
      investment_horizon: userProfile.investmentHorizon,
      income_level: userProfile.incomeLevel,
      asset_allocation: JSON.stringify({
        equity: userProfile.riskAppetite === 'Aggressive' ? 70 : userProfile.riskAppetite === 'Moderate' ? 50 : 30,
        debt: userProfile.riskAppetite === 'Aggressive' ? 20 : userProfile.riskAppetite === 'Moderate' ? 40 : 50,
        gold: userProfile.riskAppetite === 'Aggressive' ? 5 : userProfile.riskAppetite === 'Moderate' ? 5 : 10,
        cash: userProfile.riskAppetite === 'Aggressive' ? 5 : userProfile.riskAppetite === 'Moderate' ? 5 : 10,
      }),
      performance_projection: JSON.stringify({
        year1: userProfile.riskAppetite === 'Aggressive' ? 12 : userProfile.riskAppetite === 'Moderate' ? 9 : 6,
        year3: userProfile.riskAppetite === 'Aggressive' ? 15 : userProfile.riskAppetite === 'Moderate' ? 10 : 7,
        year5: userProfile.riskAppetite === 'Aggressive' ? 18 : userProfile.riskAppetite === 'Moderate' ? 12 : 8,
      }),
      risk_assessment: JSON.stringify({
        volatility: userProfile.riskAppetite === 'Aggressive' ? 'High' : userProfile.riskAppetite === 'Moderate' ? 'Medium' : 'Low',
        drawdown: userProfile.riskAppetite === 'Aggressive' ? '20-30%' : userProfile.riskAppetite === 'Moderate' ? '10-20%' : '5-10%',
        recoveryPeriod: userProfile.riskAppetite === 'Aggressive' ? '1-2 years' : userProfile.riskAppetite === 'Moderate' ? '6-12 months' : '3-6 months',
      }),
    };
  }
};

export const getUserReports = async (userId: number): Promise<InvestmentReport[]> => {
  try {
    const response = await fetch(`${API_URL}/report?user_id=${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch user reports');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user reports:', error);
    return [];
  }
};

// News Summarization Functions
export const submitNewsForSummarization = async (
  newsContent: string, 
  source: string
): Promise<NewsArticle> => {
  try {
    const response = await fetch(`${API_URL}/news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        news_source: source,
        content: newsContent,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit news for summarization');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting news for summarization:', error);
    
    // Return mock data if API fails
    return {
      news_source: source,
      content: newsContent,
      summary: 'Unable to generate summary at this time. Please try again later.',
    };
  }
};

export const getRecentNewsSummaries = async (limit: number = 10): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(`${API_URL}/news?limit=${limit}`);

    if (!response.ok) {
      throw new Error('Failed to fetch recent news summaries');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching recent news summaries:', error);
    return [];
  }
};

// Query Response Functions
export const submitQuery = async (
  queryText: string,
  userId: number
): Promise<QueryResponse> => {
  try {
    const response = await fetch(`${API_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: queryText,
        user_id: userId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit query');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting query:', error);
    
    // Return mock data if API fails
    return {
      query: queryText,
      response: 'I apologize, but I am unable to process your query at this time. Please try again later.',
      user_id: userId,
    };
  }
};

export const getUserQueryHistory = async (userId: number): Promise<QueryResponse[]> => {
  try {
    const response = await fetch(`${API_URL}/query?user_id=${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch user query history');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user query history:', error);
    return [];
  }
};

// Feedback Functions
export const submitReportFeedback = async (
  reportId: number, 
  feedbackText: string
): Promise<Feedback> => {
  try {
    const response = await fetch(`${API_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        feedback_description: feedbackText,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit report feedback');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting report feedback:', error);
    throw error;
  }
};

export const submitQueryFeedback = async (
  queryId: number, 
  feedbackText: string
): Promise<Feedback> => {
  try {
    const response = await fetch(`${API_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        feedback_description: feedbackText,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit query feedback');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting query feedback:', error);
    throw error;
  }
}; 