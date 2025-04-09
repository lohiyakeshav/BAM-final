/**
 * Authentication Service
 * 
 * This service handles all authentication-related operations including:
 * - User registration (signup)
 * - User login
 * - Current user retrieval
 * - Token management
 */

import { apiRequest, API_ENDPOINTS } from '../utils/api';

const BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:s7IzlYOb';
const TIMEOUT = 5000; // 5 seconds timeout

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  authToken: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

// Helper function to handle fetch with timeout
const fetchWithTimeout = async (url: string, options: RequestInit) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your internet connection.');
    }
    throw error;
  }
};

// Token Management
const getStoredToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const setStoredToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

const removeStoredToken = (): void => {
  localStorage.removeItem('auth_token');
};

// Helper function to check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    // JWT tokens consist of three parts: header, payload, signature
    // We need to decode the payload part (second part)
    const payload = token.split('.')[1];
    if (!payload) return true;
    
    // Decode the Base64 string
    const decoded = JSON.parse(atob(payload));
    
    // Check if the token has an expiration claim
    if (!decoded.exp) return false;
    
    // Compare the expiration time with the current time
    // exp is in seconds, Date.now() is in milliseconds
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    
    return currentTime >= expirationTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // If there's an error, consider the token expired
  }
};

// API Calls
export const login = async (credentials: LoginCredentials): Promise<User> => {
  const response = await apiRequest<LoginResponse>(
    API_ENDPOINTS.LOGIN,
    'POST',
    credentials
  );

  if (response.error || !response.data) {
    throw new Error(response.error || 'Login failed');
  }

  // Store token in localStorage
  localStorage.setItem('auth_token', response.data.access_token);
  
  // Get user profile
  return getCurrentUser();
};

export const register = async (credentials: RegisterCredentials): Promise<User> => {
  try {
    // Check if password meets minimum length requirements
    if (credentials.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Ensure email is in valid format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(credentials.email)) {
      throw new Error('Please enter a valid email address');
    }

    console.log('Sending registration request with credentials:', {
      ...credentials,
      password: '***' // Mask password in logs
    });
    
    const response = await apiRequest<User>(
      API_ENDPOINTS.REGISTER,
      'POST',
      credentials
    );

    console.log('Registration response received:', {
      status: response.status,
      data: response.data ? 'data present' : 'no data',
      error: response.error || 'no error'
    });

    if (response.status === 500) {
      console.error('Server error during registration. Raw response:', response.rawResponse);
      throw new Error('The server encountered an error. Please try again later or contact support.');
    }

    if (response.error || !response.data) {
      throw new Error(response.error || 'Registration failed');
    }

    // Login after successful registration
    try {
      await login({
        username: credentials.username,
        password: credentials.password
      });
    } catch (loginError) {
      console.warn("Registration successful but auto-login failed:", loginError);
      // Continue with registration response even if login fails
    }

    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof Error && error.message.includes("Unexpected token")) {
      throw new Error("Server returned an invalid response. Your account may have been created, please try logging in.");
    }
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User> => {
  console.log('Fetching current user profile from endpoint:', API_ENDPOINTS.GET_USER);
  
  try {
    const response = await apiRequest<User>(
      API_ENDPOINTS.GET_USER,
      'GET'
    );

    if (response.error || !response.data) {
      console.error('Failed to get user profile:', response.error);
      console.error('Response status:', response.status);
      console.error('Raw response:', response.rawResponse);
      throw new Error(response.error || 'Failed to get user profile');
    }

    console.log('User profile retrieved successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    throw error;
  }
};

export const logout = (): void => {
  localStorage.removeItem('auth_token');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    return false;
  }
  
  // Check if token is expired
  if (isTokenExpired(token)) {
    // If expired, remove the token
    localStorage.removeItem('auth_token');
    return false;
  }
  
  return true;
};

// Helper function to get auth headers for API calls
export const getAuthHeaders = (): HeadersInit => {
  const token = getStoredToken();
  return token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  } : {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  };
}; 