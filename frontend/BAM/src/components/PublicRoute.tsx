import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useEffect, useState, useRef } from 'react';
import { Loader } from "@/components/ui/loader";

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, checkAuth } = useAuth();
  const location = useLocation();
  const [checking, setChecking] = useState(false);
  const [ready, setReady] = useState(false);
  const from = location.state?.from?.pathname || '/dashboard';
  const authCheckCompleted = useRef(false);

  useEffect(() => {
    // This helps ensure proper mounting and state update sequence
    const timer = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only check auth if we have a token but no user and haven't completed an auth check
    const checkAuthentication = async () => {
      const hasToken = !!localStorage.getItem('auth_token');
      
      if (hasToken && !user && !authCheckCompleted.current) {
        setChecking(true);
        try {
          await checkAuth();
          authCheckCompleted.current = true;
        } catch (error) {
          console.error("Auth check failed:", error);
        } finally {
          setChecking(false);
        }
      }
    };
    
    if (ready) {
      checkAuthentication();
    }
  }, [user, checkAuth, ready]);

  // Show a loading state briefly while checking authentication
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-12 w-24" />
      </div>
    );
  }

  // Wait for component to be ready
  if (!ready) {
    return null;
  }

  // If user is authenticated, redirect to dashboard
  if (user) {
    return <Navigate to={from} replace />;
  }

  // If not authenticated, render the public route
  return <>{children}</>;
} 