import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * useLoginModal Hook
 * 
 * Manages login modal state and authentication flow
 * 
 * Usage:
 * ```
 * const { showLogin, setShowLogin, handleLoginSuccess } = useLoginModal();
 * ```
 */
export function useLoginModal() {
  const [showLogin, setShowLogin] = useState(false);
  const { isAuthenticated, user, login } = useAuth();

  const openLogin = useCallback(() => {
    setShowLogin(true);
  }, []);

  const closeLogin = useCallback(() => {
    setShowLogin(false);
  }, []);

  const handleLoginSuccess = useCallback(
    (role: string) => {
      console.log('✅ Login successful with role:', role);
      setShowLogin(false);
      // You can add additional logic here
      // e.g., navigate to dashboard, show notification, etc.
    },
    []
  );

  return {
    showLogin,
    setShowLogin,
    openLogin,
    closeLogin,
    handleLoginSuccess,
    isAuthenticated,
    user,
  };
}
