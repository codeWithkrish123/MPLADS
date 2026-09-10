/// <reference types="vite/client" />
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';
import { apiGateway } from '../services/apiGateway';
import config from '../config/featureFlags';

export interface User {
  id: string;
  email: string;
  role: string;
  department?: string;
  name?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Methods
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true to show loading spinner during initial validation
  const [error, setError] = useState<string | null>(null);

  // Auto-load token from localStorage on mount for session persistence
  // This allows users to stay logged in across page refreshes
  // Token is validated with backend before use to ensure it's not stale/expired
  useEffect(() => {
    const loadSavedSession = async () => {
      try {
        const savedToken = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('auth_user');

        if (savedToken && savedUser) {
          if (config.useMockData) {
            console.log('[AuthContext] Mock mode active: restoring session directly from localStorage');
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            return;
          }

          console.log('[AuthContext] Found saved token in storage, validating with backend...');
          
          try {
            // Validate token with backend by fetching user profile
            const apiUrl = import.meta.env.VITE_API_URL || 'https://mplads-backend-gateway.aditya93193.workers.dev/api';
            const response = await fetch(`${apiUrl}/auth/profile`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${savedToken}`,
              },
            });

            if (response.ok) {
              // Token is valid - restore session
              const userData = await response.json();
              const profileUser = userData.user || userData;
              console.log(`✅ [AuthContext] Token validated! Session restored for ${profileUser.email}`);
              
              setToken(savedToken);
              setUser(profileUser);
            } else {
              // Token is invalid (expired, revoked, etc.)
              console.warn('[AuthContext] Token validation failed (status:', response.status, ') - clearing session');
              localStorage.removeItem('auth_token');
              localStorage.removeItem('auth_user');
              setToken(null);
              setUser(null);
            }
          } catch (error) {
            console.error('[AuthContext] Error validating token:', error);
            // Clear invalid token to force fresh login
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            setToken(null);
            setUser(null);
          }
        } else {
          console.log('[AuthContext] No saved session found');
        }
      } finally {
        // CRITICAL: Mark loading as complete so app knows validation finished
        setIsLoading(false);
      }
    };

    loadSavedSession();
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://mplads-backend-gateway.aditya93193.workers.dev/api';
      const response = await fetch(`${apiUrl}/auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        // Token is invalid, clear it
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
        return;
      }

      const data = await response.json();
      if (data.success || data.id) {
        setUser(data);
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      // Clear invalid token
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
    }
  };

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`[AuthContext] Attempting login for ${email} with role ${role}`);
      console.log(`[AuthContext] Using mode: ${config.useMockData ? '📦 MOCK DATA' : '🔌 REAL API'}`);
      
      // CLEAR OLD CACHE BEFORE LOGIN
      console.log('[AuthContext] Clearing old dashboard cache for fresh data...');
      localStorage.removeItem('dashboard_cache');
      localStorage.removeItem('projects_cache');
      localStorage.removeItem('alerts_cache');
      localStorage.removeItem('signals_cache');
      localStorage.removeItem('command_center_cache');
      Object.keys(localStorage).forEach(key => {
        if (key.includes('cache') || key.includes('ml_') || key.includes('sentinel')) {
          localStorage.removeItem(key);
        }
      });
      console.log('[AuthContext] ✅ Old caches cleared - will load fresh data');
      
      // Use apiGateway (routes to mock or real)
      const response = await apiGateway.login(email, password, role);
      const res = response as any;
      
      const token = res?.token || res?.data?.token;
      const user = res?.user || res?.data?.user;

      if (token && user) {
        console.log(`✅ [AuthContext] Login successful!`);
        
        // Set token and user with selected role in state
        const userWithRole = {
          ...user,
          role: role || user.role || "Ministry",
        };
        setToken(token);
        setUser(userWithRole);
        
        // Store in localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(userWithRole));
        
        console.log(`[AuthContext] Authentication state updated - ready for data`);
        return true;
      } else {
        throw new Error(res?.message || res?.error || 'Invalid response from authentication');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      console.error(`❌ [AuthContext] Login error:`, errorMessage);
      setError(errorMessage);
      setToken(null);
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: !!token && !!user,
    isLoading,
    error,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
