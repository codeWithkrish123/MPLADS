import React, { useState } from "react";
import {
  X,
  Menu,
  User,
  LogOut,
  Globe,
  Type,
  Contrast,
  Bell,
  ChevronDown,
} from "lucide-react";
import { UserRole, Language, RiskAlert } from "../../types";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  language: Language;
  onToggleLanguage: () => void;
  onOpenSearch: () => void;
  onToggleNotifications: () => void;
  alerts: RiskAlert[];
  fontSize: "small" | "medium" | "large";
  onChangeFontSize: (size: "small" | "medium" | "large") => void;
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
  onLogout?: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  currentRole,
  onChangeRole,
  language,
  onToggleLanguage,
  fontSize,
  onChangeFontSize,
  isHighContrast,
  onToggleHighContrast,
  onLogout,
}) => {
  const isHindi = language === "hi";
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const roles: UserRole[] = [
    "Ministry",
    "Member of Parliament",
    "District Authority",
    "State Nodal Authority",
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sliding Menu */}
      <div className="fixed top-0 left-0 bottom-0 w-full max-w-xs bg-white shadow-2xl z-50 lg:hidden overflow-y-auto">
        {/* Header with Close Button */}
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-slate-200 bg-white">
          <h3 className="font-bold text-slate-900">
            {isHindi ? "मेनू" : "Menu"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-slate-700" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="p-4 space-y-4">
          {/* Role Selector */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="w-full flex items-center justify-between font-bold text-slate-900 p-2"
            >
              <span className="text-sm">{isHindi ? "भूमिका:" : "Role:"} {currentRole}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showRoleMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {showRoleMenu && (
              <div className="mt-3 space-y-1 pt-3 border-t border-slate-300">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      onChangeRole(role);
                      setShowRoleMenu(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      role === currentRole
                        ? "bg-blue-600 text-white font-bold"
                        : "text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Accessibility Options */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm">
              {isHindi ? "पहुंच विकल्प" : "Accessibility"}
            </h4>

            {/* Font Size */}
            <button
              onClick={() => {
                if (fontSize === "small") onChangeFontSize("medium");
                else if (fontSize === "medium") onChangeFontSize("large");
                else onChangeFontSize("small");
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-slate-100 rounded-lg transition-colors text-left"
            >
              <Type className="w-5 h-5 text-slate-600" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-900">
                  {isHindi ? "फ़ॉन्ट आकार" : "Font Size"}
                </div>
                <div className="text-xs text-slate-500">
                  {fontSize === "small" ? "A-" : fontSize === "medium" ? "A" : "A+"}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {/* Contrast */}
            <button
              onClick={onToggleHighContrast}
              className="w-full flex items-center gap-3 p-3 hover:bg-slate-100 rounded-lg transition-colors text-left"
            >
              <Contrast className="w-5 h-5 text-slate-600" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-900">
                  {isHindi ? "कंट्रास्ट" : "Contrast"}
                </div>
                <div className="text-xs text-slate-500">
                  {isHighContrast ? "ON" : "OFF"}
                </div>
              </div>
            </button>

            {/* Language */}
            <button
              onClick={onToggleLanguage}
              className="w-full flex items-center gap-3 p-3 hover:bg-slate-100 rounded-lg transition-colors text-left"
            >
              <Globe className="w-5 h-5 text-slate-600" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-900">
                  {isHindi ? "भाषा" : "Language"}
                </div>
                <div className="text-xs text-slate-500">
                  {isHindi ? "हिंदी" : "English"}
                </div>
              </div>
            </button>
          </div>

          {/* Account Actions */}
          <div className="space-y-2 pt-4 border-t border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm">
              {isHindi ? "खाता" : "Account"}
            </h4>

            <button className="w-full flex items-center gap-3 p-3 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              <User className="w-5 h-5" />
              <span className="font-medium">
                {isHindi ? "प्रोफाइल" : "Profile"}
              </span>
            </button>

            <button
              onClick={() => {
                onLogout?.();
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{isHindi ? "लॉगआउट" : "Logout"}</span>
            </button>
          </div>

          {/* Footer Links */}
          <div className="pt-6 border-t border-slate-200 space-y-2">
            <a
              href="https://uidai.gov.in"
              target="_blank"
              rel="noreferrer"
              className="block text-sm text-blue-600 hover:underline"
            >
              Aadhaar
            </a>
            <a
              href="https://digilocker.gov.in"
              target="_blank"
              rel="noreferrer"
              className="block text-sm text-blue-600 hover:underline"
            >
              DigiLocker
            </a>
            <div className="text-xs text-slate-500 pt-4">
              {isHindi ? "संस्करण 1.0" : "Version 1.0"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
