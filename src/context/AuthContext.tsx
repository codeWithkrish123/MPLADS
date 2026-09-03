/// <reference types="vite/client" />
import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    if (savedToken) {
      setToken(savedToken);
      // Use saved user data if available, don't make API call
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (err) {
          console.error('Failed to parse saved user:', err);
        }
      }
    }
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
      // DEMO MODE: Mock authentication (no backend API call)
      // In production, replace this with actual API call
      
      // Simulate successful login
      const mockToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email: email,
        role: role,
        name: role === "Member of Parliament" ? "Hon. MP" : 
              role === "District Authority" ? "District Magistrate" :
              role === "State Nodal Authority" ? "State Nodal Officer" :
              "Ministry Official",
        department: role,
      };

      // Store token
      localStorage.setItem('auth_token', mockToken);
      setToken(mockToken);

      // Store user data
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      setUser(mockUser);

      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during login';
      setError(errorMessage);
      console.error('Login error:', err);
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
