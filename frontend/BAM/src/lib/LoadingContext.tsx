import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Loader } from "@/components/ui/loader";

interface LoadingContextType {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  showLoading: () => {},
  hideLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pendingLoading, setPendingLoading] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  
  // Safety mechanism to prevent infinite loading
  const maxLoadingTimeRef = useRef<number | null>(null);
  
  useEffect(() => {
    return () => {
      // Clear any pending timeouts when unmounting
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      if (maxLoadingTimeRef.current) {
        window.clearTimeout(maxLoadingTimeRef.current);
      }
    };
  }, []);
  
  const showLoading = () => {
    // Cancel any pending hide operations
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Set pending loading flag
    setPendingLoading(true);
    
    // Add a small delay before showing loader to prevent flashing for quick operations
    timeoutRef.current = window.setTimeout(() => {
      if (pendingLoading) {
        setIsLoading(true);
        
        // Set a maximum loading time of 10 seconds as a failsafe
        maxLoadingTimeRef.current = window.setTimeout(() => {
          hideLoading();
        }, 10000);
      }
    }, 300);
  };
  
  const hideLoading = () => {
    // Cancel show loading operation if it's pending
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Cancel max loading time timeout
    if (maxLoadingTimeRef.current) {
      window.clearTimeout(maxLoadingTimeRef.current);
      maxLoadingTimeRef.current = null;
    }
    
    setPendingLoading(false);
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <Loader className="h-12 w-24" />
            <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}; 