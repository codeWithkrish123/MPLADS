import React, { useState } from "react";
import {
  Search,
  Bell,
  User,
  Menu,
  Type,
  Contrast,
  PhoneCall,
  Eye,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { UserRole, Language, RiskAlert } from "../../types";
import { getTranslation } from "../../data/translations";
import { SatyamevJayateLogo } from "../gov/SatyamevJayateLogo";

interface TopbarFixedProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  language: Language;
  onToggleLanguage: () => void;
  onOpenSearch: () => void;
  onToggleSidebarMobile: () => void;
  onToggleNotifications: () => void;
  alerts: RiskAlert[];
  fontSize: "small" | "medium" | "large";
  onChangeFontSize: (size: "small" | "medium" | "large") => void;
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
  onOpenLanding?: () => void;
  onLogout?: () => void;
}

export const TopbarFixed: React.FC<TopbarFixedProps> = ({
  currentRole,
  onChangeRole,
  language,
  onToggleLanguage,
  onOpenSearch,
  onToggleSidebarMobile,
  onToggleNotifications,
  alerts,
  fontSize,
  onChangeFontSize,
  isHighContrast,
  onToggleHighContrast,
  onOpenLanding,
  onLogout,
}) => {
  const isHindi = language === "hi";
  const criticalCount = alerts.filter((a) => a.severity === "CRITICAL").length;
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const roles: UserRole[] = ["Ministry", "Member of Parliament", "District Authority", "State Nodal Authority"];

  return (
    <div className="w-full sticky top-0 z-50 flex flex-col bg-white shadow-md">
      {/* ===== TRICOLOR STRIPE ===== */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* ===== TOP UTILITY BAR ===== */}
      <div className="bg-[#0B192C] text-white text-sm px-4 md:px-6 py-2 flex items-center justify-between flex-wrap gap-3">
        {/* Left: Emblem & Ministry Info */}
        <div className="flex items-center gap-3">
          <img 
            src={new URL("../../assets/images/Emblem_of_India.svg", import.meta.url).href}
            alt="Emblem"
            className="h-6 w-6 object-contain opacity-80 hover:opacity-100 transition-opacity"
          />
          <div className="border-r border-slate-600 pr-3">
            <div className="text-xs font-bold">
              {isHindi ? "भारत सरकार" : "GOVERNMENT OF INDIA"}
            </div>
            <div className="text-[11px] text-slate-300">
              {isHindi ? "सांख्यिकी एवं कार्यक्रम मंत्रालय" : "Ministry of Statistics & PI"}
            </div>
          </div>
        </div>

        {/* Center: Helpline */}
        <a 
          href="tel:1800111992" 
          className="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold text-xs"
        >
          <PhoneCall className="w-4 h-4" />
          <span>1800-11-1992</span>
        </a>

        {/* Right: Accessibility & Links */}
        <div className="flex items-center gap-4">
          {/* Font Size */}
          <button
            onClick={() => {
              if (fontSize === "small") onChangeFontSize("medium");
              else if (fontSize === "medium") onChangeFontSize("large");
              else onChangeFontSize("small");
            }}
            className="flex items-center gap-1 hover:text-orange-400 transition-colors text-xs"
            title={isHindi ? "फ़ॉन्ट आकार" : "Font Size"}
          >
            <Type className="w-4 h-4" />
            <span>{fontSize === "small" ? "A-" : fontSize === "medium" ? "A" : "A+"}</span>
          </button>

          {/* Contrast */}
          <button
            onClick={onToggleHighContrast}
            className={`flex items-center gap-1 transition-colors text-xs ${
              isHighContrast ? "text-orange-400" : "hover:text-orange-400"
            }`}
            title={isHindi ? "कंट्रास्ट" : "Contrast"}
          >
            <Contrast className="w-4 h-4" />
            <span>{isHindi ? "कंट्रास्ट" : "Contrast"}</span>
          </button>

          {/* Language */}
          <button
            onClick={onToggleLanguage}
            className="hover:text-orange-400 transition-colors text-xs font-bold"
            title={isHindi ? "भाषा बदलें" : "Change Language"}
          >
            {isHindi ? "EN" : "हि"}
          </button>

          {/* Quick Links */}
          <div className="hidden lg:flex items-center gap-2 text-[10px] border-l border-slate-600 pl-3">
            <a href="https://uidai.gov.in" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition-colors">
              Aadhaar
            </a>
            <span>•</span>
            <a href="https://digilocker.gov.in" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition-colors">
              DigiLocker
            </a>
          </div>
        </div>
      </div>

      {/* ===== MAIN HEADER ===== */}
      <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        {/* LEFT: Logo & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebarMobile}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-700"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={onOpenLanding}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <SatyamevJayateLogo size="sm" className="shrink-0 group-hover:scale-110 transition-transform" />
            
            <div className="border-l border-slate-300 pl-3">
              <div className="font-black text-sm md:text-base text-slate-900 leading-tight">
                {isHindi ? "सांसद निधि" : "MPLADS"} <span className="text-orange-600">{isHindi ? "प्रहरी" : "SENTINEL"}</span>
              </div>
              <div className="text-xs text-slate-600">{isHindi ? "पारदर्शी निगरानी" : "Transparent Monitoring"}</div>
            </div>
          </div>
        </div>

        {/* CENTER: Search (Hidden on Mobile) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-600 text-sm"
          >
            <Search className="w-4 h-4 shrink-0" />
            <span className="truncate">{isHindi ? "खोज..." : "Search..."}</span>
            <kbd className="ml-auto text-xs bg-white px-2 py-1 rounded border border-slate-300 text-slate-500">⌘K</kbd>
          </button>
        </div>

        {/* RIGHT: Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile Search */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-700"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button
            onClick={onToggleNotifications}
            className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-700"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {criticalCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {criticalCount > 9 ? "9+" : criticalCount}
              </span>
            )}
          </button>

          {/* Role Selector */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1 px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors text-sm font-semibold text-slate-900"
            >
              <span className="hidden sm:inline">{currentRole}</span>
              <ChevronDown className="w-4 h-4 text-slate-600" />
            </button>
            
            {showRoleMenu && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg z-50">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      onChangeRole(role);
                      setShowRoleMenu(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition-colors ${
                      role === currentRole ? "bg-slate-50 font-bold text-blue-700" : "text-slate-700"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile */}
          <button
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-700"
            title="Profile"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-slate-700 hover:text-red-700"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
