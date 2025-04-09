import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { AUTH_EVENTS } from './AuthContext';

// Interface for user profile
export interface UserProfile {
  age: number;
  income: number;
  dependents: number;
  investment_horizon: number;
  existing_investments: {
    [key: string]: number;
  };
  risk_tolerance: 'low' | 'medium' | 'high';
  goals: Array<{
    type: string;
    target_amount: number;
    timeline: number;
  }>;
}

// Interface for investment report
export interface InvestmentReport {
  risk_analysis: {
    risk_score: number;
    risk_category: string;
    risk_capacity?: number;
    risk_requirement?: number;
    risk_attitude?: string;
    key_factors: string[];
    recommendations: string[];
    risk_mitigation_strategies?: string[];
  };
  market_analysis: {
    market_trends: string[];
    key_insights: string[];
    impact_analysis: string[];
  };
  recommendations: {
    asset_allocation: {
      [key: string]: number;
    };
    specific_recommendations: any[];
    market_news: Array<{
      title: string;
      summary: string;
      url: string;
      publishedAt: string;
      source: string;
    }>;
  };
  timestamp: string;
}

// Interface for the context
interface InvestmentReportContextType {
  report: InvestmentReport | null;
  setReport: React.Dispatch<React.SetStateAction<InvestmentReport | null>>;
  isGenerating: boolean;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  clearReport: () => void;
}

// Default user profile
const defaultProfile: UserProfile = {
  age: 30,
  income: 75000,
  dependents: 0,
  investment_horizon: 10,
  existing_investments: {
    stocks: 10000,
    bonds: 5000,
    real_estate: 0,
    gold: 2000,
    cash: 20000
  },
  risk_tolerance: 'medium',
  goals: [
    {
      type: 'retirement',
      target_amount: 1000000,
      timeline: 30
    }
  ]
};

// Create context with default values
const InvestmentReportContext = createContext<InvestmentReportContextType | undefined>(undefined);

interface InvestmentReportProviderProps {
  children: ReactNode;
}

export const InvestmentReportProvider: React.FC<InvestmentReportProviderProps> = ({ children }) => {
  // Initialize state
  const [report, setReport] = useState<InvestmentReport | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Load saved report from localStorage on initial load
  useEffect(() => {
    try {
      const savedReport = localStorage.getItem('investment-report');
      if (savedReport && user) {
        setReport(JSON.parse(savedReport));
      }
    } catch (error) {
      console.error('Error loading saved investment report:', error);
    }
  }, [user]);
  
  // Listen for logout events
  useEffect(() => {
    const handleLogout = () => {
      setReport(null);
      setProfile(defaultProfile);
    };
    
    window.addEventListener(AUTH_EVENTS.LOGOUT, handleLogout);
    
    return () => {
      window.removeEventListener(AUTH_EVENTS.LOGOUT, handleLogout);
    };
  }, []);
  
  // Save report to localStorage whenever it changes
  useEffect(() => {
    if (report && user) {
      localStorage.setItem('investment-report', JSON.stringify(report));
    }
  }, [report, user]);
  
  // Function to clear report
  const clearReport = () => {
    setReport(null);
    setProfile(defaultProfile);
  };
  
  // Context value
  const contextValue: InvestmentReportContextType = {
    report,
    setReport,
    isGenerating,
    setIsGenerating,
    profile,
    setProfile,
    error,
    setError,
    clearReport
  };
  
  return (
    <InvestmentReportContext.Provider value={contextValue}>
      {children}
    </InvestmentReportContext.Provider>
  );
};

// Custom hook to use the investment report context
export const useInvestmentReport = () => {
  const context = useContext(InvestmentReportContext);
  if (context === undefined) {
    throw new Error('useInvestmentReport must be used within an InvestmentReportProvider');
  }
  return context;
}; 