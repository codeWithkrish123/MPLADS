import React, { useEffect } from "react";
import { LoginPage } from "../../views/LoginPage";
import { Language, UserRole } from "../../types";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole) => void;
  language?: Language;
  onToggleLanguage?: () => void;
}

/**
 * LoginModal Component
 *
 * Renders the NIC Single Sign-On Gateway as a centered modal dialog
 * on a darkened, subtly blurred portal backdrop matching the government portal design.
 */
export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  language = "en",
  onToggleLanguage,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="National Single Sign-On Gateway"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto bg-[#0B1528]/80 backdrop-blur-sm transition-all duration-200"
      onClick={(e) => {
        // Close if backdrop clicked directly
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-5xl my-auto animate-in fade-in zoom-in-95 duration-200">
        <LoginPage
          onLoginSuccess={(role) => {
            onLoginSuccess(role);
            onClose();
          }}
          onClose={onClose}
          language={language}
          onToggleLanguage={onToggleLanguage}
        />
      </div>
    </div>
  );
};

export default LoginModal;
