import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  element: React.ReactElement;
  fallback?: React.ReactElement;
}

/**
 * ProtectedRoute Component
 * Guards routes that require authentication and optionally role-based access
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  element,
  fallback,
}) => {
  const { isAuthenticated, role } = useAuth();

  // Not authenticated - redirect to signin
  if (!isAuthenticated) {
    return fallback || <Navigate to="/signin" replace />;
  }

  // Check role-based access if specified
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // All checks passed - render the component
  return element;
};
