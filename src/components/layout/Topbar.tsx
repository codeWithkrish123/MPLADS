import React, { useState } from "react";
import {
  Shield,
  Search,
  Bell,
  Globe,
  User,
  CheckCircle,
  Activity,
  Menu,
  HelpCircle,
  Palette,
  PhoneCall,
  Volume2,
  Users,
  Building2,
  Megaphone,
  Eye,
  Contrast,
  Type,
  LogOut
} from "lucide-react";
import { UserRole, Language, GovTheme, RiskAlert, User as UserType } from "../../types";
import { cn } from "../../lib/utils";
import { getTranslation } from "../../data/translations";
import { StateEmblem } from "../gov/StateEmblem";
import { SatyamevJayateLogo } from "../gov/SatyamevJayateLogo";

interface TopbarProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  currentState: string;
  onChangeState: (state: string) => void;
  currentFY: string;
  onChangeFY: (fy: string) => void;
  language: Language;
  onToggleLanguage: () => void;
  currentTheme?: GovTheme;
  onChangeTheme?: (theme: GovTheme) => void;
  onOpenSearch: () => void;
  onToggleNotifications: () => void;
  onToggleSidebarMobile: () => void;
  alerts: RiskAlert[];
  onOpenLanding?: () => void;
  onStartTour?: () => void;
  fontSize: "small" | "medium" | "large";
  onChangeFontSize: (size: "small" | "medium" | "large") => void;
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
  onLogout?: () => void;
  user?: UserType | null;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentRole,
  onChangeRole,
  currentState,
  onChangeState,
  currentFY,
  onChangeFY,
  language,
  onToggleLanguage,
  currentTheme = "nic-blue",
  onChangeTheme,
  onOpenSearch,
  onToggleNotifications,
  onToggleSidebarMobile,
  alerts,
  onOpenLanding,
  onStartTour,
  fontSize,
  onChangeFontSize,
  isHighContrast,
  onToggleHighContrast,
  onLogout,
  user,
}) => {
  const t = getTranslation(language);
  const criticalCount = alerts.filter((a) => a.severity === "CRITICAL" && a.status === "Open").length;
  const isHindi = language === "hi";

  return (
    <div className="sticky top-0 z-50 w-full flex flex-col shadow-xs bg-white">
      {/* 0. Authentic Tricolor Top Stripe */}
      <div className="india-gov-tricolor-stripe" />

      {/* 1. Official Government Top Utility Bar - RESPONSIVE */}
      <div className="bg-[#0B192C] text-slate-100 text-[10px] sm:text-[11px] py-2 px-3 sm:px-4 md:px-6 flex flex-col sm:flex-row flex-wrap items-center justify-between gap-2 sm:gap-3 font-sans select-none border-b border-slate-700">
        {/* Left: Official Emblem & Ministry Title - RESPONSIVE */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 sm:gap-2 pr-2 sm:pr-3 border-r border-slate-600 min-w-0">
            <img 
              src={new URL("../../assets/images/Emblem_of_India.svg", import.meta.url).href}
              alt="Emblem of India"
              className="h-6 sm:h-7 md:h-8 w-6 sm:w-7 md:w-8 object-contain opacity-100 hover:opacity-100 transition-all drop-shadow-md shrink-0"
            />
            <div className="flex flex-col text-[9px] sm:text-[10px] md:text-[11px] leading-tight min-w-0">
              <span className="font-bold text-white truncate text-[9px] sm:text-[10px] md:text-[11px]">
                {isHindi ? "भारत सरकार" : "GOV OF INDIA"}
              </span>
              <span className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-300 font-medium truncate">
                {isHindi ? "सांख्यिकी" : "MoSPI"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Citizen Helpline, Font Resizer, Accessibility - RESPONSIVE */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 text-[9px] sm:text-[10px] md:text-[11px] w-full sm:w-auto justify-end sm:justify-start">
          {/* Citizen Helpline Number - Hidden on mobile */}
          <a
            href="tel:1800111992"
            className="hidden lg:flex items-center gap-0.5 sm:gap-1 text-amber-400 hover:text-amber-300 font-semibold text-[9px] sm:text-[10px] md:text-[11px] whitespace-nowrap"
            title="Toll Free Citizen Helpline Number"
          >
            <PhoneCall className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
            <span className="hidden xl:inline">{isHindi ? "हेल्पलाइन: 1800-11-1992" : "Helpline: 1800-11-1992"}</span>
          </a>

          {/* GIGW Accessibility Control Widget - RESPONSIVE */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-900 border border-slate-700 rounded px-1.5 sm:px-2 py-0.5 sm:py-1 select-none">
            <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-wider pr-1 sm:pr-1.5 border-r border-slate-800">
              {isHindi ? "A" : "A"}
            </span>
            
            {/* Font Size Cycle Control - RESPONSIVE */}
            <button
              onClick={() => {
                if (fontSize === "small") onChangeFontSize("medium");
                else if (fontSize === "medium") onChangeFontSize("large");
                else onChangeFontSize("small");
              }}
              className="px-1 sm:px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold hover:bg-slate-800 text-slate-200 transition-colors flex items-center gap-0.5 sm:gap-1 min-h-[32px] sm:min-h-[36px] min-w-[32px] sm:min-w-[36px] justify-center"
              title={isHindi ? "फ़ॉन्ट आकार बदलें" : "Cycle Font Size (Small / Medium / Large)"}
              aria-label="Font size control"
            >
              <Type className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF9933] shrink-0" />
              <span className="font-mono text-[8px] sm:text-[9px] uppercase hidden sm:inline">
                {fontSize === "small" ? "A-" : fontSize === "medium" ? "A" : "A+"}
              </span>
            </button>

            <span className="text-slate-700 hidden sm:inline">|</span>

            {/* High Contrast Toggle Control - RESPONSIVE */}
            <button
              onClick={onToggleHighContrast}
              className={cn(
                "px-1 sm:px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold transition-all flex items-center gap-0.5 sm:gap-1 cursor-pointer min-h-[32px] sm:min-h-[36px] min-w-[32px] sm:min-w-[36px] justify-center",
                isHighContrast
                  ? "bg-[#FF9933] text-slate-950 font-black shadow-xs"
                  : "hover:bg-slate-800 text-slate-300"
              )}
              title={isHighContrast ? (isHindi ? "सामान्य थीम" : "Normal Theme") : (isHindi ? "उच्च कंट्रास्ट" : "High Contrast")}
              aria-label="Contrast control"
            >
              <Contrast className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF9933] shrink-0" />
              <span className="hidden sm:inline">{isHindi ? "C" : "C"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Header Navbar - RESPONSIVE */}
      <header
        id="mplads-sentinel-topbar"
        className="border-b border-[#E2E8F0] shadow-xs h-auto sm:h-16 flex items-center justify-between px-2.5 sm:px-4 md:px-6 py-3 sm:py-0 gap-2 sm:gap-3 transition-colors duration-200 bg-white text-[#0F172A] flex-wrap"
      >
        {/* Brand & Mobile Hamburger - RESPONSIVE */}
        <div className="flex items-center gap-2 sm:gap-3 order-1 min-w-0">
          <button
            onClick={onToggleSidebarMobile}
            className="lg:hidden p-2 rounded-lg transition-all text-[#64748B] hover:text-[#0F172A] hover:bg-[#F3F4F6] duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5 sm:w-5 sm:h-5" />
          </button>

          <div
            onClick={onOpenLanding}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none hover:opacity-90 transition-opacity min-w-0"
          >
            {/* GIGW National Emblem Visual Motif - RESPONSIVE */}
            <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-[#FFFACD] via-[#FFE8B6] to-[#FFD700] shadow-md border border-[#F0E68C] hover:shadow-lg transition-all shrink-0">
              <SatyamevJayateLogo size="sm" className="shrink-0 transition-transform group-hover:scale-110 duration-200 w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            
            <div className="flex flex-col border-l border-slate-200 pl-1.5 sm:pl-2.5 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-black tracking-tight text-xs sm:text-sm md:text-base font-heading text-slate-900 leading-none truncate">
                  {language === "hi" ? "सांसद" : "MPLADS"} <span className="text-[#B48A30] font-black hidden sm:inline">{language === "hi" ? "प्रहरी" : "SENTINEL"}</span>
                </span>
                <span className="hidden md:inline-block px-1 sm:px-1.5 py-0.5 text-[7px] sm:text-[8px] font-extrabold uppercase rounded-[3px] sm:rounded-[4px] font-sans border bg-slate-100 text-slate-700 border-slate-200 shrink-0">
                  GOV.IN
                </span>
              </div>
              <span className="text-[7px] sm:text-[8px] md:text-[9px] font-bold text-slate-500 uppercase tracking-wider leading-none mt-0.5 truncate">
                {isHindi ? "सांख्यिकी" : "MoSPI"}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Search Button - RESPONSIVE */}
        <button
          onClick={onOpenSearch}
          className="md:hidden p-2 rounded-lg transition-all text-[#64748B] hover:text-[#0F172A] hover:bg-[#F3F4F6] duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center order-3 sm:order-2 ml-auto sm:ml-0"
          title="Search"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Center Search Trigger - Hidden on mobile, visible on md+ */}
        <div className="hidden md:flex items-center flex-1 max-w-sm lg:max-w-md mx-2 lg:mx-4 min-w-0 order-2 md:order-3">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs sm:text-sm transition-all bg-[#F8FAFC] hover:bg-white text-[#64748B] hover:text-[#0F172A] hover:border-primary cursor-pointer min-w-0"
          >
            <span className="flex items-center gap-2 truncate pr-2">
              <Search className="w-4 h-4 text-primary shrink-0" />
              <span className="truncate text-xs sm:text-sm">{t.topbar?.searchPlaceholder || (isHindi ? "खोजें..." : "Search...")}</span>
            </span>
            <kbd className="hidden lg:inline-block font-sans text-[10px] px-1.5 py-0.5 rounded-[6px] border bg-white border-[#E2E8F0] text-[#64748B] shrink-0">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Controls & Selectors - RESPONSIVE */}
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 text-xs shrink-0 order-4 md:order-4 flex-wrap justify-end w-full sm:w-auto md:w-auto">

          {/* State Selector - Hidden on mobile/tablet, visible on xl */}
          <div className="hidden xl:flex items-center">
            <select
              id="state-selector"
              value={currentState}
              onChange={(e) => onChangeState(e.target.value)}
              className="text-xs rounded-lg px-2.5 py-2 border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] outline-none cursor-pointer font-medium transition-colors focus:border-primary ring-offset-0 min-h-[44px]"
              aria-label={isHindi ? "राज्य चुनें" : "Select State"}
            >
              <option value="All States">{isHindi ? "सभी राज्य" : "All States"}</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Bihar">Bihar</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
            </select>
          </div>

          {/* Financial Year Selector - Hidden on mobile/tablet, visible on lg */}
          <div className="hidden lg:flex items-center">
            <select
              id="fy-selector"
              value={currentFY}
              onChange={(e) => onChangeFY(e.target.value)}
              className="text-xs rounded-lg px-2.5 py-2 border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] outline-none cursor-pointer font-medium transition-colors focus:border-primary ring-offset-0 min-h-[44px]"
              aria-label={isHindi ? "वित्तीय वर्ष चुनें" : "Select Financial Year"}
            >
              <option value="FY 2025-26">FY 2025-26</option>
              <option value="FY 2024-25">FY 2024-25</option>
              <option value="FY 2023-24">FY 2023-24</option>
            </select>
          </div>

          {/* Role Selector - Always visible, responsive styling */}
          <div className="flex items-center">
            <select
              id="role-selector"
              value={currentRole}
              onChange={(e) => onChangeRole(e.target.value as UserRole)}
              className="text-[11px] sm:text-xs font-semibold rounded-lg px-2 sm:px-2.5 py-2 border border-primary/30 bg-primary-light text-primary outline-none cursor-pointer transition-colors focus:border-primary ring-offset-0 min-h-[44px]"
              aria-label={isHindi ? "भूमिका चुनें" : "Select Role"}
            >
              <option value="Ministry">{t.roles?.ministry || "Ministry"}</option>
              <option value="State Nodal Authority">{t.roles?.stateNodal || "State"}</option>
              <option value="District Authority">{t.roles?.districtAuth || "District"}</option>
              <option value="Member of Parliament">{t.roles?.mp || "MP"}</option>
            </select>
          </div>

          {/* Dynamic Theme Selector - Hidden on mobile, visible on sm+ */}
          {onChangeTheme && (
            <div className="hidden sm:flex items-center">
              <select
                id="theme-selector"
                value={currentTheme}
                onChange={(e) => onChangeTheme(e.target.value as GovTheme)}
                className="text-xs font-semibold rounded-lg px-2.5 py-2 border border-primary/30 bg-primary-light text-primary outline-none cursor-pointer transition-colors focus:border-primary ring-offset-0 min-h-[44px]"
                title="Select Portal Theme / पोर्टल थीम चुनें"
                aria-label={isHindi ? "थीम चुनें" : "Theme"}
              >
                <option value="nic-blue">🏛️ Blue</option>
                <option value="red-rose">🌹 Rose</option>
                <option value="digital-emerald">🌲 Emerald</option>
                <option value="finance-indigo">💳 Indigo</option>
              </select>
            </div>
          )}

          {/* Language Switcher - Responsive sizing */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2 sm:px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs font-semibold transition-all cursor-pointer bg-[#F8FAFC] text-[#0F172A] hover:bg-[#F3F4F6] duration-200 min-h-[44px]"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline">{language === "en" ? "हि" : "EN"}</span>
          </button>

          {/* Guided Tour Trigger - Hidden on mobile */}
          {onStartTour && (
            <button
              onClick={onStartTour}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-[#E2E8F0] text-xs font-medium transition-all cursor-pointer bg-[#F8FAFC] hover:bg-[#F3F4F6] text-[#0F172A] duration-200 min-h-[44px]"
              title="Start Onboarding Tour"
            >
              <HelpCircle className="w-4 h-4 text-primary" />
              <span className="hidden md:inline">{isHindi ? "मार्गदर्शन" : "Tour"}</span>
            </button>
          )}

          {/* Notifications Tray Trigger */}
          <button
            onClick={onToggleNotifications}
            className="relative p-2 rounded-lg transition-all text-[#64748B] hover:text-[#0F172A] hover:bg-[#F3F4F6] duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Risk Signals & Alerts"
          >
            <Bell className="w-5 h-5" />
            {criticalCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#DC2626] rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Citizen / Official User Avatar & Logout - Hidden on mobile */}
          <div className="hidden sm:flex items-center gap-1.5 md:gap-2 pl-2 border-l border-[#E2E8F0]">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-primary-border flex items-center justify-center bg-primary-light text-primary shrink-0">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="hidden lg:flex flex-col text-[11px] sm:text-xs min-w-0">
              <span className="font-semibold leading-tight text-[#0F172A] truncate">
                {user?.email ? user.email.split('@')[0].substring(0, 8) : (isHindi ? "नागरिक" : "User")}
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-[#64748B] truncate">
                {user?.role || "GOV-ID"}
              </span>
            </div>
            
            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="ml-1 pl-1.5 md:pl-2 border-l border-[#E2E8F0] p-2 rounded-lg transition-all text-[#64748B] hover:text-red-600 hover:bg-red-50 duration-200 flex items-center gap-1 min-h-[44px] min-w-[44px]"
                title={isHindi ? "लॉग आउट करें" : "Sign out"}
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 3. Rolling Notice Ticker Ribbon - RESPONSIVE */}
      <div className="bg-[#F8FAFC] text-[#0F172A] text-[10px] sm:text-xs py-1.5 px-2 sm:px-4 md:px-6 flex items-center border-b border-[#E2E8F0] overflow-hidden select-none gap-2 sm:gap-3">
        <div className="flex items-center gap-1 shrink-0 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#1D4ED8] text-white rounded-md sm:rounded-lg text-[8px] sm:text-[10px] uppercase tracking-wider font-semibold">
          <Megaphone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white shrink-0" />
          <span className="hidden sm:inline">{isHindi ? "ताज़ा सूचना" : "NOTICE"}</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap flex-1">
          <div className="animate-marquee font-normal text-[#64748B] text-[9px] sm:text-[11px]">
            <span>
              {isHindi
                ? "📢 सांसद निधि पारदर्शिता पोर्टल में आपका स्वागत है — सड़क, स्कूल, पेयजल निर्माण की स्थिति देखें।"
                : "📢 Welcome to MPLADS Transparency Portal — Track development projects in real-time. Helpline: 1800-11-1992"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

