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
  Type
} from "lucide-react";
import { UserRole, Language, GovTheme, RiskAlert } from "../../types";
import { cn } from "../../lib/utils";
import { getTranslation } from "../../data/translations";
import { StateEmblem } from "../gov/StateEmblem";

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
}) => {
  const t = getTranslation(language);
  const criticalCount = alerts.filter((a) => a.severity === "CRITICAL" && a.status === "Open").length;
  const isHindi = language === "hi";

  return (
    <div className="sticky top-0 z-50 w-full flex flex-col shadow-xs bg-white">
      {/* 0. Authentic Tricolor Top Stripe */}
      <div className="india-gov-tricolor-stripe" />

      {/* 1. Official Government Top Utility Bar */}
      <div className="bg-[#0B192C] text-slate-100 text-[11px] py-1.5 px-3 sm:px-6 flex flex-col sm:flex-row flex-wrap items-center justify-between gap-2 font-sans select-none border-b border-slate-800">
        {/* Left: Official Emblem & Ministry Title */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-700">
            <img 
              src={new URL("../../assets/images/Emblem_of_India.svg", import.meta.url).href}
              alt="Emblem of India"
              className="h-6 w-6 object-contain"
            />
            <div className="flex flex-col text-[10px] leading-none">
              <span className="font-semibold text-white">
                {isHindi ? "भारत सरकार | NATIONAL PORTAL OF INDIA" : "GOVERNMENT OF INDIA | INDIA.GOV.IN"}
              </span>
              <span className="text-[9px] text-slate-300">
                {isHindi ? "सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)" : "Ministry of Statistics & Programme Implementation"}
              </span>
            </div>
          </div>

          <span className="hidden md:inline-block px-1.5 py-0.5 bg-[#E31E24] text-white rounded text-[9px] font-bold uppercase tracking-wider">
            BETA PORTAL
          </span>
        </div>

        {/* Right: Citizen Helpline, Font Resizer A- A A+, Quick Links */}
        <div className="flex items-center gap-3 text-[11px]">
          {/* Citizen Helpline Number */}
          <a
            href="tel:1800111992"
            className="hidden md:flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold text-[10px] sm:text-[11px]"
            title="Toll Free Citizen Helpline Number"
          >
            <PhoneCall className="w-3 h-3 text-amber-400" />
            <span>{isHindi ? "हेल्पलाइन: 1800-11-1992" : "Helpline: 1800-11-1992"}</span>
          </a>

          {/* GIGW Accessibility Control Widget */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 select-none">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider pr-1.5 border-r border-slate-800">
              {isHindi ? "पहुंच" : "Access"}
            </span>
            
            {/* Font Size Cycle Control */}
            <button
              onClick={() => {
                if (fontSize === "small") onChangeFontSize("medium");
                else if (fontSize === "medium") onChangeFontSize("large");
                else onChangeFontSize("small");
              }}
              className="px-2 py-0.5 rounded text-[10px] font-bold hover:bg-slate-800 text-slate-200 transition-colors flex items-center gap-1"
              title={isHindi ? "फ़ॉन्ट आकार बदलें" : "Cycle Font Size (Small / Medium / Large)"}
            >
              <Type className="w-3 h-3 text-[#FF9933]" />
              <span className="font-mono text-[10px] uppercase">
                {fontSize === "small" ? "A-" : fontSize === "medium" ? "A" : "A+"}
              </span>
            </button>

            <span className="text-slate-700">|</span>

            {/* High Contrast Toggle Control */}
            <button
              onClick={onToggleHighContrast}
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer",
                isHighContrast
                  ? "bg-[#FF9933] text-slate-950 font-black shadow-xs"
                  : "hover:bg-slate-800 text-slate-300"
              )}
              title={isHighContrast ? "सामान्य थीम सक्षम करें" : "उच्च कंट्रास्ट थीम सक्षम करें"}
            >
              <Contrast className="w-3 h-3 text-[#FF9933] shrink-0" />
              <span>{isHindi ? "कंट्रास्ट" : "Contrast"}</span>
            </button>
          </div>

          {/* Quick Government Portal Links */}
          <div className="hidden xl:flex items-center gap-2 text-[10px] text-slate-300">
            <a href="https://uidai.gov.in" target="_blank" rel="noreferrer" className="hover:text-white hover:underline">
              UIDAI (Aadhaar)
            </a>
            <span>•</span>
            <a href="https://digilocker.gov.in" target="_blank" rel="noreferrer" className="hover:text-white hover:underline">
              DigiLocker
            </a>
            <span>•</span>
            <a href="https://passportindia.gov.in" target="_blank" rel="noreferrer" className="hover:text-white hover:underline">
              Passport Seva
            </a>
            <span>•</span>
            <a href="https://parivahan.gov.in" target="_blank" rel="noreferrer" className="hover:text-white hover:underline">
              Parivahan
            </a>
            <span>•</span>
            <a href="https://cpgrams.gov.in" target="_blank" rel="noreferrer" className="hover:text-white hover:underline">
              CPGRAMS
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Header Navbar */}
      <header
        id="mplads-sentinel-topbar"
        className="border-b border-[#E2E8F0] shadow-xs h-16 flex items-center justify-between px-3 sm:px-6 transition-colors duration-200 bg-white text-[#0F172A]"
      >
        {/* Brand & Mobile Hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleSidebarMobile}
            className="lg:hidden p-2 rounded-[8px] transition-all text-[#64748B] hover:text-[#0F172A] hover:bg-[#F3F4F6] duration-200"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={onOpenLanding}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {/* GIGW National Emblem Visual Motif */}
            <StateEmblem size="sm" theme="gold" className="shrink-0 transition-transform group-hover:scale-105 duration-200" />
            
            <div className="flex flex-col border-l border-slate-200 pl-2.5">
              <div className="flex items-center gap-1.5">
                <span className="font-black tracking-tight text-sm sm:text-base font-heading text-slate-900 leading-none">
                  {language === "hi" ? "सांसद निधि" : "MPLADS"} <span className="text-[#B48A30] font-black">{language === "hi" ? "प्रहरी" : "SENTINEL"}</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[8px] font-extrabold uppercase rounded-[4px] font-sans border bg-slate-100 text-slate-700 border-slate-200">
                  GOV.IN
                </span>
              </div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider leading-none mt-1">
                {isHindi ? "सांख्यिकी और कार्यक्रम मंत्रालय" : "MoSPI • Central Portal"}
              </span>
            </div>
          </div>
        </div>

        {/* Center Search Trigger */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-3 xl:mx-6 min-w-0">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 border border-[#E2E8F0] rounded-[8px] text-xs transition-all bg-[#F8FAFC] hover:bg-white text-[#64748B] hover:text-[#0F172A] hover:border-primary cursor-pointer min-w-0"
          >
            <span className="flex items-center gap-2 truncate pr-2">
              <Search className="w-4 h-4 text-primary shrink-0" />
              <span className="truncate">{t.topbar?.searchPlaceholder || (isHindi ? "कार्य, जिला, सांसद या नियम खोजें..." : "Search Works, Districts, Rules...")}</span>
            </span>
            <kbd className="hidden sm:inline-block font-sans text-[10px] px-1.5 py-0.5 rounded-[6px] border bg-white border-[#E2E8F0] text-[#64748B] shrink-0">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Controls & Selectors */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs shrink-0">
          {/* Mobile Search Button */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-[8px] transition-all text-[#64748B] hover:text-[#0F172A] hover:bg-[#F3F4F6] duration-200"
            title="Search"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* State Selector */}
          <div className="hidden xl:flex items-center">
            <select
              id="state-selector"
              value={currentState}
              onChange={(e) => onChangeState(e.target.value)}
              className="text-xs rounded-[8px] px-2.5 py-2 border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] outline-none cursor-pointer font-medium transition-colors focus:border-primary ring-offset-0 min-h-[44px]"
              aria-label={isHindi ? "राज्य चुनें" : "Select State"}
            >
              <option value="All States">National (All States)</option>
              <option value="Uttar Pradesh">Uttar Pradesh (UP)</option>
              <option value="Maharashtra">Maharashtra (MH)</option>
              <option value="Bihar">Bihar (BR)</option>
              <option value="Tamil Nadu">Tamil Nadu (TN)</option>
              <option value="Rajasthan">Rajasthan (RJ)</option>
              <option value="Karnataka">Karnataka (KA)</option>
              <option value="West Bengal">West Bengal (WB)</option>
              <option value="Gujarat">Gujarat (GJ)</option>
            </select>
          </div>

          {/* Financial Year Selector */}
          <div className="hidden lg:flex items-center">
            <select
              id="fy-selector"
              value={currentFY}
              onChange={(e) => onChangeFY(e.target.value)}
              className="text-xs rounded-[8px] px-2.5 py-2 border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] outline-none cursor-pointer font-medium transition-colors focus:border-primary ring-offset-0 min-h-[44px]"
              aria-label={isHindi ? "वित्तीय वर्ष चुनें" : "Select Financial Year"}
            >
              <option value="FY 2025-26">FY 2025-26 (Active)</option>
              <option value="FY 2024-25">FY 2024-25</option>
              <option value="FY 2023-24">FY 2023-24</option>
            </select>
          </div>

          {/* Role Selector */}
          <div className="flex items-center">
            <select
              id="role-selector"
              value={currentRole}
              onChange={(e) => onChangeRole(e.target.value as UserRole)}
              className="text-xs font-semibold rounded-[8px] px-2.5 py-1.5 border border-primary/30 bg-primary-light text-primary outline-none cursor-pointer transition-colors focus:border-primary ring-offset-0"
              aria-label={isHindi ? "भूमिका चुनें" : "Select Role"}
            >
              <option value="Ministry">{t.roles.ministry}</option>
              <option value="State Nodal Authority">{t.roles.stateNodal}</option>
              <option value="District Authority">{t.roles.districtAuth}</option>
              <option value="Member of Parliament">{t.roles.mp}</option>
            </select>
          </div>

          {/* Dynamic Theme Selector (Red Rose, NIC Blue, etc) */}
          {onChangeTheme && (
            <div className="hidden sm:flex items-center">
              <select
                id="theme-selector"
                value={currentTheme}
                onChange={(e) => onChangeTheme(e.target.value as GovTheme)}
                className="text-xs font-semibold rounded-[8px] px-2.5 py-1.5 border border-primary/30 bg-primary-light text-primary outline-none cursor-pointer transition-colors focus:border-primary ring-offset-0"
                title="Select Portal Theme / पोर्टल थीम चुनें"
                aria-label={isHindi ? "पोर्टल थीम चुनें" : "Select Portal Theme"}
              >
                <option value="red-rose">🌹 Rose Theme</option>
                <option value="nic-blue">🏛️ NIC Blue</option>
                <option value="digital-emerald">🌲 Emerald</option>
                <option value="finance-indigo">💳 Indigo</option>
                <option value="high-contrast">👁️ Contrast</option>
              </select>
            </div>
          )}

          {/* Language Switcher EN / HI */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[#E2E8F0] text-xs font-semibold transition-all cursor-pointer bg-[#F8FAFC] text-[#0F172A] hover:bg-[#F3F4F6] duration-200"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="w-4 h-4 text-primary" />
            <span>{language === "en" ? "हिन्दी" : "English"}</span>
          </button>

          {/* Guided Tour Trigger */}
          {onStartTour && (
            <button
              onClick={onStartTour}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[#E2E8F0] text-xs font-medium transition-all cursor-pointer bg-[#F8FAFC] hover:bg-[#F3F4F6] text-[#0F172A] duration-200"
              title="Start Onboarding Tour"
            >
              <HelpCircle className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">{isHindi ? "मार्गदर्शन" : "Tour"}</span>
            </button>
          )}

          {/* Notifications Tray Trigger */}
          <button
            onClick={onToggleNotifications}
            className="relative p-2 rounded-[8px] transition-all text-[#64748B] hover:text-[#0F172A] hover:bg-[#F3F4F6] duration-200"
            title="Risk Signals & Alerts"
          >
            <Bell className="w-4 h-4" />
            {criticalCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#DC2626] rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Citizen / Official User Avatar */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-full border border-primary-border flex items-center justify-center bg-primary-light text-primary">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden 2xl:flex flex-col text-[11px]">
              <span className="font-semibold leading-tight text-[#0F172A]">
                {isHindi ? "आम नागरिक / अधिकारी" : "Citizen / Official"}
              </span>
              <span className="text-[9px] font-mono text-[#64748B]">
                GOV-SECURE-ID
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Rolling Notice Ticker Ribbon */}
      <div className="bg-[#F8FAFC] text-[#0F172A] text-xs py-1.5 px-3 flex items-center border-b border-[#E2E8F0] overflow-hidden select-none">
        <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 bg-[#1D4ED8] text-white rounded-[6px] text-[10px] uppercase tracking-wider font-semibold mr-3">
          <Megaphone className="w-3.5 h-3.5 text-white shrink-0" />
          <span>{isHindi ? "ताज़ा सूचना" : "IMPORTANT NOTICE"}</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap flex-1">
          <div className="animate-marquee font-normal text-[#64748B] text-[11px]">
            <span>
              {isHindi
                ? "📢 सांसद निधि (MPLADS) आम नागरिक पारदर्शिता पोर्टल में आपका स्वागत है — अपने क्षेत्र में चल रहे सड़क, स्कूल, पेयजल एवं अस्पताल निर्माण कार्यों की स्थिति, स्वीकृत बजट तथा जीपीएस फोटो देखें। टोल-फ्री सहायता: 1800-11-1992 | "
                : "📢 Welcome to the MPLADS Citizens Transparency Portal — Track drinking water, roads, school & hospital development projects in your constituency with geo-tagged photos and sanction details in real-time. Helpline: 1800-11-1992 | "}
            </span>
            <span>
              {isHindi
                ? "नवीनीकरण FY 2025-26: समस्त विकास कार्यों की वित्तीय एवं भौतिक प्रगति MoSPI द्वारा 100% डिजिटल रूप से ट्रैक की जा रही है। किसी भी अनियमितता की रिपोर्ट सीपीजीआरएएमएस (CPGRAMS) पर करें।"
                : "FY 2025-26 Update: 100% of MPLADS fund allocations are digitally monitored by MoSPI. Report any cost or physical delays via CPGRAMS Portal."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

