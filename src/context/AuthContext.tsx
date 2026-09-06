/// <reference types="vite/client" />
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-load token from localStorage on mount for session persistence
  // This allows users to stay logged in across page refreshes
  // Token is validated with backend before use to ensure it's not stale/expired
  useEffect(() => {
    const loadSavedSession = async () => {
      const savedToken = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('auth_user');

      if (savedToken && savedUser) {
        console.log('[AuthContext] Found saved token in storage, validating with backend...');
        
        try {
          // Validate token with backend by fetching user profile
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
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
            console.log(`✅ [AuthContext] Token validated! Session restored for ${userData.email}`);
            
            setToken(savedToken);
            setUser(userData);
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
    };

    loadSavedSession();
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
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
      console.log(`[AuthContext] Attempting real backend login for ${email} with role ${role}`);
      
      // REAL BACKEND API CALL - NOT MOCK
      const response = await authApi.login(email, password, role);

      if (response && response.token && response.user) {
        console.log(`✅ [AuthContext] Real backend login successful!`);
        console.log(`[AuthContext] Token: ${response.token.substring(0, 20)}...`);
        console.log(`[AuthContext] User: ${response.user.email}`);
        
        // ✅ FIX: Set token and user in state (was missing!)
        setToken(response.token);
        setUser(response.user);
        
        // Also store in localStorage for persistence
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
        
        console.log(`[AuthContext] Authentication state updated`);
        return true;
      } else {
        throw new Error('Invalid response from backend');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed - Backend unavailable or credentials invalid';
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
