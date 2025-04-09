// API utilities for making requests to the backend

// Base API URL from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  GET_USER: '/api/auth/me',
  
  // Chat endpoints
  CHAT: '/api/chat',
  
  // News endpoints
  NEWS: '/api/news',
  
  // Wealth management
  WEALTH_MANAGEMENT: '/api/wealth/advice',
  
  // Feedback endpoint
  FEEDBACK: '/api/feedback',
  
  // Portfolios endpoints
  PORTFOLIOS: '/api/portfolios',
  LATEST_PORTFOLIO: '/api/portfolios?current=true',
  
  // Market data
  MARKET_DATA: '/api/market-data',
};

// Interface for API response
interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
  rawResponse?: string; // For debugging
}

// Utility function for making API requests
export async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> {
  try {
    // Get auth token from localStorage if it exists
    const token = localStorage.getItem('auth_token');
    
    // For debugging - log the request details
    if (endpoint === API_ENDPOINTS.REGISTER || endpoint.startsWith(API_ENDPOINTS.NEWS)) {
      console.log(`API request to ${endpoint}:`, {
        url: `${API_BASE_URL}${endpoint}`,
        method,
        body: body ? JSON.stringify(body).substring(0, 100) + '...' : 'none',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
    }
    
    // Build request options
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...headers,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    };

    // Make request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    // For debugging - log the response status and headers
    if (endpoint === API_ENDPOINTS.REGISTER || endpoint.startsWith(API_ENDPOINTS.NEWS)) {
      console.log(`API response from ${endpoint}:`, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()]),
      });
    }
    
    // Check content type
    const contentType = response.headers.get("content-type");
    let textResponse = '';
    
    // Only try to parse as JSON if content type includes 'application/json'
    let data = null;
    if (response.status !== 204) {
      textResponse = await response.text();
      
      if (contentType && contentType.includes("application/json")) {
        try {
          data = JSON.parse(textResponse);
        } catch (err) {
          console.error("Failed to parse JSON response:", err);
          console.error("Raw response text:", textResponse);
          data = { detail: "Invalid JSON response from server" };
        }
      } else {
        // Handle non-JSON response
        console.error("Received non-JSON response:", textResponse.substring(0, 100) + "...");
        data = { detail: "Unexpected response format from server" };
      }
    }
    
    // Return formatted response with raw text for debugging
    return {
      data: response.ok ? data : undefined,
      error: !response.ok ? (data?.detail || `Error ${response.status}: ${response.statusText}`) : undefined,
      status: response.status,
      rawResponse: textResponse
    };
  } catch (error) {
    console.error('API request error:', error);
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
} 