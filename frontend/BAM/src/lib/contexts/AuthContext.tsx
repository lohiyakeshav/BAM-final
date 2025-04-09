import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  getCurrentUser, 
  login as authLogin, 
  register as authRegister, 
  logout as authLogout, 
  LoginCredentials, 
  RegisterCredentials,
  isAuthenticated
} from '../services/authService';

// Custom event for logout
export const AUTH_EVENTS = {
  LOGOUT: 'auth:logout'
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Set up a periodic auth check to prevent random logouts
  useEffect(() => {
    // Initial auth check
    initAuth();
    
    // Set up periodic auth verification (every 5 minutes)
    const authCheckInterval = setInterval(() => {
      if (isAuthenticated()) {
        checkAuth().catch(err => {
          console.error('Periodic auth check failed:', err);
        });
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => {
      clearInterval(authCheckInterval);
    };
  }, []);
  
  // Check authentication status on mount
  const initAuth = async () => {
    setIsLoading(true);
    try {
      if (isAuthenticated()) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Initial auth check error:', error);
      // If there's an error, clear any invalid tokens
      authLogout();
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  const checkAuth = async (): Promise<boolean> => {
    if (!isAuthenticated()) {
      setUser(null);
      return false;
    }

    setIsLoading(true);
    try {
      const user = await getCurrentUser();
      console.log('User data retrieved in checkAuth:', user);
      setUser(user);
      return true;
    } catch (error) {
      console.error('Auth check error:', error);
      setError(error instanceof Error ? error.message : 'Authentication check failed');
      // On error, clear token and set user to null
      authLogout();
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setError(null);
    setIsLoading(true);
    try {
      const user = await authLogin(credentials);
      setUser(user);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setError(null);
    setIsLoading(true);
    try {
      const user = await authRegister(credentials);
      setUser(user);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during registration');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear authentication
    authLogout();
    
    // Clear user data
    setUser(null);
    setError(null);
    
    // Clear local chat data
    localStorage.removeItem('chat-messages');
    
    // Clear investment report data
    localStorage.removeItem('investment-report');
    
    // Dispatch a custom event to notify other contexts
    window.dispatchEvent(new Event(AUTH_EVENTS.LOGOUT));
  };

  // Don't render children until we've finished checking the auth state
  if (!isInitialized) {
    return null; // Or return a loading component
  }

  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 