import React, { useState } from "react";
import { X } from "lucide-react";
import { LoginPage } from "../../views/LoginPage";
import { Language } from "../../types";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: string) => void;
  language?: Language;
  onToggleLanguage?: () => void;
}

/**
 * LoginModal Component
 * 
 * Wraps LoginPage in a modal dialog for use in other pages
 * 
 * Usage:
 * ```
 * const [showLogin, setShowLogin] = useState(false);
 * 
 * <LoginModal
 *   isOpen={showLogin}
 *   onClose={() => setShowLogin(false)}
 *   onLoginSuccess={(role) => {
 *     console.log('Logged in as:', role);
 *     // Navigate to dashboard
 *   }}
 * />
 * ```
 */
export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  language = "en",
  onToggleLanguage,
}) => {
  const handleLoginSuccess = (role: string) => {
    onLoginSuccess(role);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full max-h-screen overflow-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-[100] bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Login Page */}
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          language={language}
          onToggleLanguage={onToggleLanguage}
        />
      </div>
    </div>
  );
};

export default LoginModal;
