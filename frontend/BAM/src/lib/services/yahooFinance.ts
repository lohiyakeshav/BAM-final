/**
 * Yahoo Finance API Service
 * 
 * This service provides methods to fetch financial data from Yahoo Finance API
 */

// Base URL for Yahoo Finance API from environment variables or default
const FINANCE_API_URL = import.meta.env.VITE_FINANCE_API_URL || 'https://query1.finance.yahoo.com/v8/finance';

// Types
export interface StockQuote {
  symbol: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketVolume: number;
  marketCap: number;
  shortName: string;
  longName?: string;
}

export interface MarketSummary {
  marketState: string;
  exchangeName: string;
  indices: {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
  }[];
}

/**
 * Get stock quote information for a given symbol
 */
export const getStockQuote = async (symbol: string): Promise<StockQuote | null> => {
  try {
    const response = await fetch(`${FINANCE_API_URL}/chart/${symbol}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${symbol}`);
    }
    
    const data = await response.json();
    const quote = data.chart.result[0].meta;
    const price = data.chart.result[0].meta.regularMarketPrice;
    const previousClose = data.chart.result[0].meta.previousClose;
    
    return {
      symbol,
      regularMarketPrice: price,
      regularMarketChange: price - previousClose,
      regularMarketChangePercent: ((price - previousClose) / previousClose) * 100,
      regularMarketVolume: data.chart.result[0].indicators.quote[0].volume[0] || 0,
      marketCap: quote.marketCap || 0,
      shortName: quote.shortName || symbol,
      longName: quote.longName
    };
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    return null;
  }
};

/**
 * Get market summary data
 */
export const getMarketSummary = async (): Promise<MarketSummary | null> => {
  try {
    const response = await fetch(`${FINANCE_API_URL}/market/get-summary`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch market summary');
    }
    
    const data = await response.json();
    const result = data.marketSummaryResponse.result;
    
    return {
      marketState: result[0].marketState,
      exchangeName: result[0].exchangeName,
      indices: result.map((index: any) => ({
        symbol: index.symbol,
        name: index.shortName,
        price: index.regularMarketPrice?.raw || 0,
        change: index.regularMarketChange?.raw || 0,
        changePercent: index.regularMarketChangePercent?.raw || 0
      }))
    };
  } catch (error) {
    console.error('Error fetching market summary:', error);
    return null;
  }
};

/**
 * Search for stocks, ETFs, mutual funds, etc.
 */
export const searchFinancialInstruments = async (query: string): Promise<any[]> => {
  try {
    const response = await fetch(`${FINANCE_API_URL}/autocomplete?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error('Failed to search for financial instruments');
    }
    
    const data = await response.json();
    return data.ResultSet.Result || [];
  } catch (error) {
    console.error('Error searching for financial instruments:', error);
    return [];
  }
};

/**
 * Get historical data for a symbol
 */
export const getHistoricalData = async (
  symbol: string, 
  interval: '1d' | '1wk' | '1mo' = '1d',
  range: '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '5y' = '1mo'
): Promise<any | null> => {
  try {
    const response = await fetch(`${FINANCE_API_URL}/chart/${symbol}?interval=${interval}&range=${range}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch historical data for ${symbol}`);
    }
    
    const data = await response.json();
    return data.chart.result[0];
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return null;
  }
}; 