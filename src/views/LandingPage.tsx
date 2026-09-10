import React, { useState, useEffect } from "react";
import {
  Shield,
  ArrowRight,
  Database,
  TrendingUp,
  Landmark,
  CheckCircle2,
  Lock,
  User,
  UserPlus,
  FileText,
  BellRing,
  Globe,
  Search,
  BarChart3,
  AlertTriangle,
  Download,
  Info,
  Eye,
  Megaphone,
  MapPin,
  Building2,
  Globe2,
  Mail,
  Phone,
  Clock,
  ExternalLink,
  HelpCircle,
} from "lucide-react";
import { UserRole, Language } from "../types";
import { StateEmblem } from "../components/gov/StateEmblem";
import { SatyamevJayateLogo } from "../components/gov/SatyamevJayateLogo";
import { motion } from "motion/react";
import mpladsLogo from "../assets/MPLADS_logo.jpg";

const portalHeroImg = new URL("../assets/images/parliament-hero-premium.webp", import.meta.url).href;

interface LandingPageProps {
  onExplore: () => void;
  onSelectRole: (role: UserRole) => void;
  language?: Language;
  onToggleLanguage?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExplore,
  onSelectRole,
  language = "en",
  onToggleLanguage,
}) => {
  const isHindi = language === "hi";

  const roles = [
    {
      id: "Ministry" as UserRole,
      title: isHindi ? "सांख्यिकी मंत्रालय" : "Ministry of Statistics & PI",
      subtitle: isHindi ? "केंद्रीय मुख्यालय" : "Union HQ Portal",
      defaultUser: "admin.mospi@nic.in",
      icon: Building2,
      badge: isHindi ? "राष्ट्रीय मुख्यालय" : "National HQ",
    },
    {
      id: "Member of Parliament" as UserRole,
      title: isHindi ? "संसद सदस्य" : "Member of Parliament",
      subtitle: isHindi ? "लोक सभा / राज्य सभा" : "Lok Sabha / Rajya Sabha",
      defaultUser: "mp.constituency@sansad.nic.in",
      icon: Landmark,
      badge: isHindi ? "संसदीय क्षेत्र" : "Constituency",
    },
    {
      id: "District Authority" as UserRole,
      title: isHindi ? "जिला प्राधिकारी" : "District Authority / DM",
      subtitle: isHindi ? "योजना व कार्यान्वयन" : "Planning & Execution",
      defaultUser: "dm.ghaziabad@nic.in",
      icon: MapPin,
      badge: isHindi ? "जिला प्रकोष्ठ" : "District Cell",
    },
    {
      id: "State Nodal Authority" as UserRole,
      title: isHindi ? "राज्य नोडल प्राधिकरण" : "State Nodal Authority",
      subtitle: isHindi ? "राज्य योजना विभाग" : "State Planning Dept",
      defaultUser: "nodal.planning@state.gov.in",
      icon: Globe2,
      badge: isHindi ? "राज्य स्तर" : "State Level",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-[#1E293B]">

      {/* ─────────────────────────────────────────────
          HEADER — Government branding + Nav + Login
      ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b-2 border-[#1B3A7A]">
        <div className="max-w-[1320px] mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3 md:gap-6 flex-wrap md:flex-nowrap">

          {/* Left: Emblem + Logo + Title */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0 min-w-0">
            <div className="flex flex-col items-center shrink-0">
              <img 
                src={new URL("../assets/images/Emblem_of_India.svg", import.meta.url).href}
                alt="Emblem of India"
                className="h-12 md:h-16 w-12 md:w-16 object-contain"
              />
              <div className="text-[7px] md:text-[9px] font-bold text-[#1B3A7A] mt-0.5 leading-none">
                {isHindi ? "सत्यमेव जयते" : ""}
              </div>
            </div>
            
            {/* MPLADS Logo */}
            <img 
              src={mpladsLogo}
              alt="MPLADS Logo"
              className="h-12 md:h-16 w-12 md:w-16 object-contain"
            />
            
            <div className="border-l-2 border-slate-300 pl-2 md:pl-3 min-w-0">
              <div className="text-[11px] md:text-[13px] font-bold text-slate-900 leading-tight">
                {isHindi ? "भारत सरकार" : "Government of India"}
              </div>
              <div className="text-[8px] md:text-[10px] text-slate-600 leading-tight">
                {isHindi
                  ? "सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय"
                  : "Ministry of Statistics & Programme Implementation"}
              </div>
              <div className="text-[14px] md:text-[18px] font-extrabold text-[#1B3A7A] leading-tight mt-0.5">
                MPLADS
              </div>
            </div>
          </div>

          {/* Center: Nav - Hidden on mobile */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 flex-1 ml-4 xl:ml-8">
            <a
              href="#top"
              className="text-[12px] md:text-[13px] font-semibold text-[#1B3A7A] hover:text-[#0F2A6B] transition-colors outline-none focus:outline-none"
            >
              {isHindi ? "मुख्य पृष्ठ" : "Home"}
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-[13px] font-semibold text-slate-700 hover:text-[#1B3A7A] transition-colors outline-none focus:outline-none"
            >
              {isHindi ? "MPLADS के बारे में" : "About MPLADS"}
            </a>
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-[13px] font-semibold text-slate-700 hover:text-[#1B3A7A] transition-colors outline-none focus:outline-none"
            >
              {isHindi ? "विशेषताएं" : "Features"}
            </a>
            <a
              href="#reports"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("reports")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-[13px] font-semibold text-slate-700 hover:text-[#1B3A7A] transition-colors outline-none focus:outline-none"
            >
              {isHindi ? "रिपोर्ट्स" : "Reports"}
            </a>
            <a
              href="#guidelines"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("guidelines")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-[13px] font-semibold text-slate-700 hover:text-[#1B3A7A] transition-colors outline-none focus:outline-none"
            >
              {isHindi ? "दिशा-निर्देश" : "Guidelines"}
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-[13px] font-semibold text-slate-700 hover:text-[#1B3A7A] transition-colors outline-none focus:outline-none"
            >
              {isHindi ? "संपर्क करें" : "Contact Us"}
            </a>
          </nav>

          {/* Right: Language + Login */}
          <div className="flex items-center gap-3 shrink-0">
            {onToggleLanguage && (
              <button
                onClick={onToggleLanguage}
                className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1B3A7A] transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{isHindi ? "EN" : "हि"}</span>
              </button>
            )}
            <a
              href="/signup"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, "", "/signup");
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-bold rounded-md shadow transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isHindi ? "पंजीकरण" : "Sign Up"}</span>
            </a>
            <button
              onClick={() => onSelectRole("Ministry")}
              className="flex items-center gap-2 px-4 py-2 bg-[#1B3A7A] hover:bg-[#142d63] text-white text-[13px] font-bold rounded-md shadow transition-colors cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>{isHindi ? "लॉगिन" : "Login"}</span>
            </button>



          </div>

        </div>
      </header>

      {/* ─────────────────────────────────────────────
          HERO — Simple static Parliament background
          Left: headline + tricolor + desc + CTA buttons
          Right: floating dark navy feature card
      ───────────────────────────────────────────── */}
      <section
        id="top"
        className="relative w-full overflow-hidden"
        style={{ minHeight: "520px", perspective: "1000px" }}
      >
        {/* Full-width Parliament background image - simple static */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${portalHeroImg})`,
            backgroundSize: "cover",
            filter: "brightness(0.85) contrast(1.1)",
          }}
        />

        {/* Simple white gradient overlay from left */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to right, 
              rgba(255,255,255,0.98) 0%, 
              rgba(255,255,255,0.90) 20%, 
              rgba(255,255,255,0.70) 40%,
              rgba(255,255,255,0.30) 60%,
              rgba(255,255,255,0) 85%
            )`,
          }}
        />

        {/* Subtle vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 1000px 700px at 20% 50%, transparent 40%, rgba(0,0,0,0.1) 100%)`,
          }}
        />

        {/* Content layer with 3D perspective */}
        <div className="relative z-10 max-w-[1320px] mx-auto px-6 py-16 flex items-center min-h-[520px]">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* LEFT COLUMN: Premium headline with sophisticated styling */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-7">
              <div className="space-y-4">
                <h1 
                  className="text-[32px] sm:text-[40px] lg:text-[48px] font-black text-[#0F2A6B] leading-[1.08] tracking-tight"
                  style={{
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                    fontStyle: "normal",
                    fontWeight: 900,
                    textShadow: `
                      0 2px 4px rgba(255,255,255,0.9),
                      0 4px 12px rgba(15, 42, 107, 0.2),
                      0 8px 24px rgba(255, 255, 255, 0.7),
                      0 -1px 3px rgba(255,255,255,0.4) inset
                    `,
                  }}
                >
                  {isHindi
                    ? "पारदर्शी सांसद निधि कार्यान्वयन के लिए एआई-संचालित निगरानी"
                    : "AI-Powered Monitoring for Transparent MPLADS Implementation"}
                </h1>

                {/* Premium Tricolor bar with sophisticated glow */}
                <div className="flex h-2.5 w-60 rounded-full overflow-hidden" style={{
                  boxShadow: `
                    0 0 30px rgba(255, 107, 0, 0.5),
                    0 0 60px rgba(4, 122, 30, 0.25),
                    0 8px 20px rgba(27, 58, 122, 0.3),
                    0 -2px 10px rgba(255,255,255,0.95) inset,
                    0 0 0 1px rgba(255,255,255,0.3)
                  `,
                  filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.15))"
                }}>
                  <div className="flex-1 bg-[#FF6B00]" />
                  <div className="flex-1 bg-white" />
                  <div className="flex-1 bg-[#047A1E]" />
                </div>
              </div>

              {/* Premium description */}
              <p 
                className="text-[16px] text-slate-700 leading-relaxed max-w-[540px] font-semibold"
                style={{
                  textShadow: "0 1px 3px rgba(255,255,255,0.8), 0 0 10px rgba(0,0,0,0.05)",
                }}
              >
                {isHindi
                  ? "उन्नत एआई विश्लेषण और डेटा-संचालित अंतर्दृष्टि का उपयोग करके सांसद निधि परियोजनाओं में विसंगतियों का पता लगाएं, धोखाधड़ी को रोकें और दक्षता में सुधार करें।"
                  : "Detect anomalies, prevent fraud, and improve efficiency in MPLADS projects using advanced AI analytics and data-driven insights."}
              </p>

              {/* Premium CTA buttons */}
              <div className="flex flex-wrap items-center gap-5 pt-4">
                <button
                  onClick={() => onSelectRole("Ministry")}
                  className="flex items-center gap-2.5 px-8 py-4 text-white font-bold text-[15px] rounded-xl transition-all duration-300 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #1B3A7A 0%, #0F2A6B 100%)",
                    boxShadow: `
                      0 10px 30px rgba(27, 58, 122, 0.45),
                      0 0 0 1px rgba(255,255,255,0.2) inset,
                      0 -3px 8px rgba(0,0,0,0.15) inset
                    `,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px) scale(1.06)";
                    e.currentTarget.style.boxShadow = `
                      0 14px 40px rgba(27, 58, 122, 0.55),
                      0 0 0 1px rgba(255,255,255,0.25) inset,
                      0 -3px 10px rgba(0,0,0,0.2) inset
                    `;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow = `
                      0 10px 30px rgba(27, 58, 122, 0.45),
                      0 0 0 1px rgba(255,255,255,0.2) inset,
                      0 -3px 8px rgba(0,0,0,0.15) inset
                    `;
                  }}
                >
                  <Database className="w-5 h-5 text-amber-300" />
                  <span>{isHindi ? "डैशबोर्ड का अन्वेषण करें" : "Explore Dashboard"}</span>
                </button>


                <button
                  onClick={() =>
                    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="flex items-center gap-2.5 px-8 py-4 text-[#1B3A7A] font-bold text-[15px] rounded-xl border-2 border-slate-300 transition-all duration-300 cursor-pointer"
                  style={{
                    background: "rgba(255, 255, 255, 0.88)",
                    boxShadow: `
                      0 10px 28px rgba(0,0,0,0.15),
                      0 0 0 1px rgba(255,255,255,0.9) inset
                    `,
                    backdropFilter: "blur(4px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.95)";
                    e.currentTarget.style.boxShadow = `
                      0 14px 36px rgba(0,0,0,0.18),
                      0 0 0 1px rgba(255,255,255,1) inset
                    `;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.88)";
                    e.currentTarget.style.boxShadow = `
                      0 10px 28px rgba(0,0,0,0.15),
                      0 0 0 1px rgba(255,255,255,0.9) inset
                    `;
                  }}
                >
                  <Info className="w-5 h-5" />
                  <span>{isHindi ? "और जानें" : "Learn More"}</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Floating dark feature card with 3D depth */}
            <div className="lg:col-span-5 xl:col-span-5 lg:col-start-8 xl:col-start-8 flex justify-end">
              <div
                className="w-full max-w-[340px] rounded-2xl p-7 text-white space-y-0 shadow-2xl transform transition-transform duration-300 hover:scale-105"
                style={{
                  backgroundColor: "rgba(13, 30, 64, 0.92)",
                  boxShadow: "0 20px 50px rgba(13, 30, 64, 0.4), 0 10px 30px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)"
                }}
              >
                {/* Feature row 1 */}
                <div className="flex gap-4 items-start py-5">
                  <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center shrink-0 bg-gradient-to-br from-white/20 to-white/5 shadow-lg">
                    <Shield className="w-6 h-6 text-blue-300" />
                  </div>
                  <div>
                    <div className="font-bold text-[15px] text-white leading-snug">
                      {isHindi ? "स्मार्ट विसंगति जांच" : "Smart Anomaly Detection"}
                    </div>
                    <p className="text-[12px] text-blue-200/90 mt-2 leading-relaxed font-medium">
                      {isHindi
                        ? "एआई असामान्य पैटर्न और संदिग्ध गतिविधियों का पता लगाता है।"
                        : "AI detects unusual patterns and suspicious activities."}
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/15" />

                {/* Feature row 2 */}
                <div className="flex gap-4 items-start py-5">
                  <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center shrink-0 bg-gradient-to-br from-white/20 to-white/5 shadow-lg">
                    <BarChart3 className="w-6 h-6 text-cyan-300" />
                  </div>
                  <div>
                    <div className="font-bold text-[15px] text-white leading-snug">
                      {isHindi ? "वास्तविक समय निगरानी" : "Real-time Monitoring"}
                    </div>
                    <p className="text-[12px] text-blue-200/90 mt-2 leading-relaxed font-medium">
                      {isHindi
                        ? "परियोजना प्रगति, निधि उपयोग और देरी को ट्रैक करें।"
                        : "Track project progress, fund utilization and delays in real-time."}
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/15" />

                {/* Feature row 3 */}
                <div className="flex gap-4 items-start py-4">
                  <div className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center shrink-0 bg-white/10">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-[14px] text-white leading-snug">
                      {isHindi ? "डेटा-संचालित अंतर्दृष्टि" : "Data-Driven Insights"}
                    </div>
                    <p className="text-[12px] text-blue-200/80 mt-1 leading-relaxed">
                      {isHindi
                        ? "पूर्वानुमानित विश्लेषण और रिपोर्ट के साथ सूचित निर्णय लें।"
                        : "Make informed decisions with predictive analytics and reports."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          STATS BAR — dark navy, 5 metrics with white circle icons
      ───────────────────────────────────────────── */}
      <div className="bg-[#F8FAFD] py-6 px-4">
        <div className="max-w-[1320px] mx-auto">
          <div
            className="rounded-2xl py-7 px-6 shadow-lg"
            style={{ backgroundColor: "#152F6B" }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-white">

              {/* Stat 1 */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0">
                  <Landmark className="w-6 h-6 text-[#152F6B]" />
                </div>
                <div>
                  <div className="text-[22px] font-black leading-none tabular-nums">
                    ₹ 4,851 Cr
                  </div>
                  <div className="text-[11px] text-blue-200 mt-1 leading-tight font-medium">
                    {isHindi ? "कुल जारी राशि" : "Total Funds Released"}
                    <br />
                    <span className="text-blue-300/70">
                      ({isHindi ? "सभी राज्य" : "All States"})
                    </span>
                  </div>
                </div>
              </div>

              <div className="hidden md:block w-px self-stretch bg-white/15" />

              {/* Stat 2 */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-[#152F6B]" />
                </div>
                <div>
                  <div className="text-[22px] font-black leading-none tabular-nums">
                    1,24,578
                  </div>
                  <div className="text-[11px] text-blue-200 mt-1 leading-tight font-medium">
                    {isHindi ? "कुल स्वीकृत कार्य" : "Total Works Approved"}
                    <br />
                    <span className="text-blue-300/70">
                      ({isHindi ? "सभी राज्य" : "All States"})
                    </span>
                  </div>
                </div>
              </div>

              <div className="hidden md:block w-px self-stretch bg-white/15" />

              {/* Stat 3 */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-[#F59E0B]" />
                </div>
                <div>
                  <div className="text-[22px] font-black leading-none tabular-nums">
                    92,345
                  </div>
                  <div className="text-[11px] text-blue-200 mt-1 leading-tight font-medium">
                    {isHindi ? "कार्य पूर्ण" : "Works Completed"}
                    <br />
                    <span className="text-blue-300/70">
                      ({isHindi ? "सभी राज्य" : "All States"})
                    </span>
                  </div>
                </div>
              </div>

              <div className="hidden md:block w-px self-stretch bg-white/15" />

              {/* Stat 4 */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
                </div>
                <div>
                  <div className="text-[22px] font-black leading-none tabular-nums">
                    1,280
                  </div>
                  <div className="text-[11px] text-blue-200 mt-1 leading-tight font-medium">
                    {isHindi ? "विसंगतियां पाईं" : "Anomalies Detected"}
                    <br />
                    <span className="text-blue-300/70">
                      ({isHindi ? "इस महीने" : "This Month"})
                    </span>
                  </div>
                </div>
              </div>

              <div className="hidden md:block w-px self-stretch bg-white/15" />

              {/* Stat 5 */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6 text-[#152F6B]" />
                </div>
                <div>
                  <div className="text-[22px] font-black leading-none tabular-nums">
                    76 %
                  </div>
                  <div className="text-[11px] text-blue-200 mt-1 leading-tight font-medium">
                    {isHindi ? "औसत उपयोग दर" : "Average Utilization"}
                    <br />
                    <span className="text-blue-300/70">
                      ({isHindi ? "सभी राज्य" : "All States"})
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          KEY FEATURES — 4 white cards with motion
      ───────────────────────────────────────────── */}
      <section id="features" className="scroll-mt-24 bg-white py-16 px-4">
        <div className="max-w-[1320px] mx-auto">

          {/* Section heading */}
          <div className="text-center mb-12">
            <h2 className="inline-block text-[30px] font-black text-[#0F2A6B] relative pb-3 tracking-tight">
              {isHindi ? "प्रमुख विशेषताएं" : "Key Platform Features"}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70px] h-[3.5px] bg-gradient-to-r from-[#FF9933] to-[#138808] rounded-full" />
            </h2>
            <p className="text-xs text-slate-500 max-w-xl mx-auto mt-2 font-medium">
              {isHindi
                ? "पारदर्शिता, धोखाधड़ी रोकथाम और रीयल-टाइम अवसंरचना ट्रैकिंग के लिए उन्नत AI और ML एल्गोरिदम।"
                : "Advanced AI & ML algorithms for transparency, fraud prevention, and real-time civil infrastructure tracking."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Card 1: Anomaly Detection */}
            <div className="bg-white border border-slate-200/90 hover:border-[#1B3A7A] rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col group cursor-pointer">
              <div className="w-12 h-12 bg-blue-50 border border-blue-200/80 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#1B3A7A] transition-colors">
                <Search className="w-6 h-6 text-[#1B3A7A] group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-extrabold text-[16px] text-slate-900 mb-2 group-hover:text-[#1B3A7A] transition-colors">
                {isHindi ? "विसंगति जांच" : "Anomaly Detection"}
              </h3>
              <p className="text-[13px] text-slate-600 leading-relaxed flex-1 font-medium">
                {isHindi
                  ? "एआई मॉडल फंड उपयोग, परियोजना लागत, देरी और अन्य विसंगतियों की पहचान करते हैं।"
                  : "AI models identify irregularities in fund utilization, project costs, delays and more."}
              </p>
              <button
                onClick={onExplore}
                className="mt-5 flex items-center gap-1.5 text-[13px] font-bold text-[#1B3A7A] group-hover:text-[#FF9933] transition-colors cursor-pointer self-start"
              >
                {isHindi ? "और पढ़ें" : "Read More"}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Card 2: Fraud Prevention */}
            <div className="bg-white border border-slate-200/90 hover:border-emerald-600 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col group cursor-pointer">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors">
                <Shield className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-extrabold text-[16px] text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                {isHindi ? "धोखाधड़ी रोकथाम" : "Fraud Prevention"}
              </h3>
              <p className="text-[13px] text-slate-600 leading-relaxed flex-1 font-medium">
                {isHindi
                  ? "दोहरे काम, नकली विक्रेताओं, बढ़ी हुई लागत और अन्य संदिग्ध पैटर्न का स्वतः पता लगाएं।"
                  : "Detect duplicate works, fake vendors, inflated costs and other suspicious patterns."}
              </p>
              <button
                onClick={() => onSelectRole("Ministry")}
                className="mt-5 flex items-center gap-1.5 text-[13px] font-bold text-[#1B3A7A] group-hover:text-[#FF9933] transition-colors cursor-pointer self-start"
              >
                {isHindi ? "और पढ़ें" : "Read More"}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Card 3: Performance Insights */}
            <div className="bg-white border border-slate-200/90 hover:border-purple-600 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col group cursor-pointer">
              <div className="w-12 h-12 bg-purple-50 border border-purple-200/80 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                <BarChart3 className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-extrabold text-[16px] text-slate-900 mb-2 group-hover:text-purple-700 transition-colors">
                {isHindi ? "प्रदर्शन अंतर्दृष्टि" : "Performance Insights"}
              </h3>
              <p className="text-[13px] text-slate-600 leading-relaxed flex-1 font-medium">
                {isHindi
                  ? "जिला, राज्य और राष्ट्रीय स्तर के प्रदर्शन की निगरानी के लिए विजुअल डैशबोर्ड।"
                  : "Visual dashboards and reports to monitor district, state and national performance."}
              </p>
              <button
                onClick={onExplore}
                className="mt-5 flex items-center gap-1.5 text-[13px] font-bold text-[#1B3A7A] group-hover:text-[#FF9933] transition-colors cursor-pointer self-start"
              >
                {isHindi ? "और पढ़ें" : "Read More"}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Card 4: Real-time Alerts */}
            <div className="bg-white border border-slate-200/90 hover:border-amber-500 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col group cursor-pointer">
              <div className="w-12 h-12 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-amber-500 transition-colors">
                <BellRing className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-extrabold text-[16px] text-slate-900 mb-2 group-hover:text-amber-700 transition-colors">
                {isHindi ? "वास्तविक समय अलर्ट" : "Real-time Alerts"}
              </h3>
              <p className="text-[13px] text-slate-600 leading-relaxed flex-1 font-medium">
                {isHindi
                  ? "परियोजना में देरी, बजट अधिकता और अन्य महत्वपूर्ण मुद्दों के लिए तत्काल अलर्ट।"
                  : "Get instant alerts for delays, budget overruns, and other critical issues."}
              </p>
              <button
                onClick={onExplore}
                className="mt-5 flex items-center gap-1.5 text-[13px] font-bold text-[#1B3A7A] group-hover:text-[#FF9933] transition-colors cursor-pointer self-start"
              >
                {isHindi ? "और पढ़ें" : "Read More"}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* ── Latest Update bar ── */}
          <div className="mt-10 bg-gradient-to-r from-[#EEF3FB] via-[#F4F7FC] to-[#EFF6FE] border border-[#CCDAF5] rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1B3A7A]/10 border border-[#1B3A7A]/20 flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5 text-[#1B3A7A]" />
              </div>
              <p className="text-[13.5px] text-slate-700 leading-relaxed font-medium">
                <span className="font-black text-[#1B3A7A] mr-1">
                  {isHindi ? "नवीनतम अपडेट:" : "Latest Update:"}
                </span>
                {isHindi
                  ? "बेहतर पारदर्शिता और वास्तविक समय की अंतर्दृष्टि के लिए MPLADS eSAKSHI सार्वजनिक डैशबोर्ड को नया रूप दिया गया है।"
                  : "MPLADS eSAKSHI Public Dashboard has been revamped for better transparency and real-time insights."}
              </p>
            </div>
            <button
              onClick={onExplore}
              className="shrink-0 font-bold text-[13.5px] text-[#1B3A7A] hover:text-[#0F2A6B] hover:underline flex items-center gap-1 cursor-pointer"
            >
              {isHindi ? "और जानें" : "Know More"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────
          ABOUT MPLADS SECTION — Image 5 Redesign Fix
      ───────────────────────────────────────────── */}
      <section id="about" className="scroll-mt-24 bg-gradient-to-b from-slate-50 via-blue-50/20 to-white py-16 px-4">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="inline-block text-[32px] font-black text-[#0F2A6B] relative pb-3 tracking-tight">
              {isHindi ? "MPLADS के बारे में" : "About MPLADS Scheme"}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80px] h-[3.5px] bg-[#FF9933] rounded-full" />
            </h2>
            <p className="text-xs text-slate-500 max-w-xl mx-auto mt-2 font-medium">
              {isHindi
                ? "संसदीय क्षेत्रों में टिकाऊ सामुदायिक परिसंपत्तियों के निर्माण के लिए भारत सरकार की महत्वाकांक्षी योजना।"
                : "Government of India flagship program allocating developmental funds to Members of Parliament for sustainable community infrastructure."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left: Overview & Key Objectives Cards */}
            <div className="space-y-6 flex flex-col justify-between">
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 hover:border-blue-300 transition-all hover:shadow-md">
                <h3 className="text-[18px] font-black text-[#1B3A7A] mb-3 flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-[#FF9933]" />
                  {isHindi ? "क्या है MPLADS?" : "What is MPLADS?"}
                </h3>
                <p className="text-[14px] text-slate-700 leading-relaxed font-medium">
                  {isHindi
                    ? "सांसद स्थानीय क्षेत्र विकास योजना (MPLADS) भारत में एक महत्वपूर्ण कार्यक्रम है जो प्रत्येक सदस्य को अपने संसदीय क्षेत्र में विकास परियोजनाओं के लिए निधि आवंटित करने की अनुमति देता है।"
                    : "MPLADS (Member of Parliament Local Area Development Scheme) is a key program in India that allocates funds to each Member of Parliament for development projects in their constituencies."}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 hover:border-emerald-300 transition-all hover:shadow-md">
                <h3 className="text-[18px] font-black text-[#047A1E] mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#047A1E]" />
                  {isHindi ? "मुख्य उद्देश्य" : "Key Objectives"}
                </h3>
                <ul className="space-y-2.5 text-[14px] text-slate-700 font-medium">
                  <li className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF9933] shrink-0" />
                    <span>{isHindi ? "स्थानीय विकास परियोजनाओं को वित्त पोषण करना" : "Finance local development projects & essential works"}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#1B3A7A] shrink-0" />
                    <span>{isHindi ? "पारदर्शी कार्यान्वयन सुनिश्चित करना" : "Ensure transparent implementation with GIS geotagging"}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#047A1E] shrink-0" />
                    <span>{isHindi ? "समुदाय की भागीदारी को प्रोत्साहित करना" : "Encourage community participation & public audit"}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
                    <span>{isHindi ? "जवाबदेहिता और निगरानी में सुधार" : "Improve accountability with AI fraud surveillance"}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Statistics & Impact Card — Revamped Light e-Gov Header (Image 5 Fix) */}
            <div className="space-y-6 flex flex-col justify-between">
              {/* Premium Light e-Gov Statistics Grid instead of harsh dark box */}
              <div className="bg-gradient-to-br from-[#0A2740] via-[#0F2A6B] to-[#1B3A7A] rounded-2xl p-6 shadow-lg text-white border border-blue-900 relative overflow-hidden">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/15">
                  <h3 className="text-[18px] font-black text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#FF9933]" />
                    {isHindi ? "राष्ट्रीय प्रभाव और आंकड़े" : "Impact & National Statistics"}
                  </h3>
                  <span className="px-2.5 py-0.5 bg-white/10 text-slate-200 text-[10px] font-mono font-bold rounded-md border border-white/20">
                    LIVE DATA
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 hover:bg-white/15 border border-white/15 p-4 rounded-xl backdrop-blur-xs transition-colors">
                    <div className="text-[26px] font-black font-mono text-[#FF9933]">₹ 4,851 Cr</div>
                    <div className="text-[12px] text-slate-200 font-bold mt-1">{isHindi ? "कुल जारी" : "Total Released"}</div>
                  </div>
                  <div className="bg-white/10 hover:bg-white/15 border border-white/15 p-4 rounded-xl backdrop-blur-xs transition-colors">
                    <div className="text-[26px] font-black font-mono text-white">1,24,578</div>
                    <div className="text-[12px] text-slate-200 font-bold mt-1">{isHindi ? "कार्य स्वीकृत" : "Works Approved"}</div>
                  </div>
                  <div className="bg-white/10 hover:bg-white/15 border border-white/15 p-4 rounded-xl backdrop-blur-xs transition-colors">
                    <div className="text-[26px] font-black font-mono text-emerald-400">92,345</div>
                    <div className="text-[12px] text-slate-200 font-bold mt-1">{isHindi ? "पूर्ण कार्य" : "Completed"}</div>
                  </div>
                  <div className="bg-white/10 hover:bg-white/15 border border-white/15 p-4 rounded-xl backdrop-blur-xs transition-colors">
                    <div className="text-[26px] font-black font-mono text-amber-300">76 %</div>
                    <div className="text-[12px] text-slate-200 font-bold mt-1">{isHindi ? "उपयोग दर" : "Utilization"}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 hover:border-amber-300 transition-all hover:shadow-md">
                <h3 className="text-[18px] font-black text-[#FF6B00] mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#FF6B00]" />
                  {isHindi ? "लाभार्थी हितधारक" : "Key Stakeholders & Beneficiaries"}
                </h3>
                <p className="text-[14px] text-slate-700 mb-3 font-medium">
                  {isHindi
                    ? "राष्ट्रीय, राज्य और जिला स्तर पर सभी हितधारक जो MPLADS कार्यान्वयन में शामिल हैं।"
                    : "All stakeholders at national, state, and district levels involved in MPLADS implementation."}
                </p>
                <div className="space-y-1.5 text-[13px] text-slate-700 font-medium">
                  <p><strong>{isHindi ? "संसद सदस्य" : "Members of Parliament"}:</strong> {isHindi ? "निधि आवंटन और परियोजना चयन" : "Fund allocation & project selection"}</p>
                  <p><strong>{isHindi ? "जिला प्राधिकरण" : "District Authorities"}:</strong> {isHindi ? "कार्यान्वयन और निगरानी" : "Implementation & monitoring"}</p>
                  <p><strong>{isHindi ? "समुदाय" : "Community"}:</strong> {isHindi ? "परियोजना लाभ प्राप्त करना" : "Receiving project benefits"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          REPORTS SECTION
      ───────────────────────────────────────────── */}
      <section id="reports" className="scroll-mt-24 bg-white py-16 px-4">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="inline-block text-[32px] font-bold text-[#0F2A6B] relative pb-3">
              {isHindi ? "MPLADS रिपोर्ट्स" : "MPLADS Reports"}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80px] h-[3px] bg-[#047A1E] rounded-full" />
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#EBF2FD] to-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-[#1B3A7A] rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-[16px] font-bold text-slate-900 mb-2">
                {isHindi ? "राज्य-वार विश्लेषण" : "State-wise Analysis"}
              </h3>
              <p className="text-[13px] text-slate-600 mb-4">
                {isHindi
                  ? "प्रत्येक राज्य में MPLADS कार्यान्वयन का विस्तृत विश्लेषण, परियोजनाओं की संख्या और निधि वितरण।"
                  : "Detailed analysis of MPLADS implementation in each state with project counts and fund distribution."}
              </p>
              <a href="#" className="text-[13px] font-bold text-[#1B3A7A] hover:underline">
                {isHindi ? "रिपोर्ट देखें →" : "View Report →"}
              </a>
            </div>

            <div className="bg-gradient-to-br from-[#F0F9F5] to-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-[#047A1E] rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-[16px] font-bold text-slate-900 mb-2">
                {isHindi ? "जिला प्रदर्शन" : "District Performance"}
              </h3>
              <p className="text-[13px] text-slate-600 mb-4">
                {isHindi
                  ? "जिले स्तर पर परियोजना पूर्ण होने की दर, विलंब विश्लेषण और प्रदर्शन मेट्रिक्स।"
                  : "District-level project completion rates, delay analysis and performance metrics."}
              </p>
              <a href="#" className="text-[13px] font-bold text-[#047A1E] hover:underline">
                {isHindi ? "रिपोर्ट देखें →" : "View Report →"}
              </a>
            </div>

            <div className="bg-gradient-to-br from-[#FFF9F0] to-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-[#FF6B00] rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-[16px] font-bold text-slate-900 mb-2">
                {isHindi ? "कार्यान्वयन रुझान" : "Implementation Trends"}
              </h3>
              <p className="text-[13px] text-slate-600 mb-4">
                {isHindi
                  ? "समय के साथ परियोजना प्रवृत्तियों, बजट उपयोग और विसंगति पैटर्न का विश्लेषण।"
                  : "Analysis of project trends over time, budget utilization and anomaly patterns."}
              </p>
              <a href="#" className="text-[13px] font-bold text-[#FF6B00] hover:underline">
                {isHindi ? "रिपोर्ट देखें →" : "View Report →"}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          GUIDELINES SECTION
      ───────────────────────────────────────────── */}
      <section id="guidelines" className="scroll-mt-24 bg-gradient-to-b from-[#F8F9FF] to-white py-16 px-4">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="inline-block text-[32px] font-bold text-[#0F2A6B] relative pb-3">
              {isHindi ? "MPLADS दिशा-निर्देश" : "MPLADS Guidelines"}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80px] h-[3px] bg-[#1B3A7A] rounded-full" />
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-[16px] font-bold text-[#1B3A7A] mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#047A1E]" />
                {isHindi ? "अनुमोदन प्रक्रिया" : "Approval Process"}
              </h3>
              <ol className="space-y-3 text-[13px] text-slate-700 list-decimal list-inside">
                <li>{isHindi ? "संसद सदस्य द्वारा परियोजना प्रस्ताव जमा करना" : "Project proposal submission by MP"}</li>
                <li>{isHindi ? "जिला प्राधिकरण द्वारा तकनीकी मूल्यांकन" : "Technical evaluation by district authority"}</li>
                <li>{isHindi ? "बजट और योजना समीक्षा" : "Budget and planning review"}</li>
                <li>{isHindi ? "अनुमोदन और संवितरण" : "Approval and disbursement"}</li>
                <li>{isHindi ? "कार्यान्वयन और निगरानी" : "Implementation and monitoring"}</li>
              </ol>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-[16px] font-bold text-[#1B3A7A] mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#FF6B00]" />
                {isHindi ? "अनुपालन आवश्यकताएं" : "Compliance Requirements"}
              </h3>
              <ul className="space-y-3 text-[13px] text-slate-700">
                <li className="flex gap-2">
                  <span className="text-[#FF6B00] font-bold">✓</span>
                  <span>{isHindi ? "पारदर्शी निविदा प्रक्रिया का पालन करना" : "Follow transparent tender process"}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#FF6B00] font-bold">✓</span>
                  <span>{isHindi ? "मासिक प्रगति रिपोर्ट प्रस्तुत करना" : "Submit monthly progress reports"}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#FF6B00] font-bold">✓</span>
                  <span>{isHindi ? "तीसरे पक्ष द्वारा ऑडिट सुनिश्चित करना" : "Ensure third-party audit"}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#FF6B00] font-bold">✓</span>
                  <span>{isHindi ? "सार्वजनिक सूचना प्रकटीकरण बनाए रखना" : "Maintain public information disclosure"}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-[#EEF3FB] border border-[#CCDAF5] rounded-xl p-6">
            <h3 className="text-[16px] font-bold text-[#1B3A7A] mb-3">
              {isHindi ? "अतिरिक्त संसाधन" : "Additional Resources"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[13px]">
              <a href="#" className="text-[#1B3A7A] hover:underline font-medium">{isHindi ? "आधिकारिक दिशा-निर्देश दस्तावेज़" : "Official Guidelines Document"}</a>
              <a href="#" className="text-[#1B3A7A] hover:underline font-medium">{isHindi ? "सर्वश्रेष्ठ प्रथाएं हैंडबुक" : "Best Practices Handbook"}</a>
              <a href="#" className="text-[#1B3A7A] hover:underline font-medium">{isHindi ? "अनुपालन चेकलिस्ट" : "Compliance Checklist"}</a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          CONTACT US SECTION - Professional Government Theme
      ══════════════════════════════════════════════════════════════════════════ */}
      <section id="contact" className="scroll-mt-24 bg-gradient-to-b from-slate-50 to-slate-100 py-20 px-4 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-50 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-30" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-50 rounded-full translate-x-1/4 translate-y-1/4 opacity-30" />
        
        <div className="max-w-[1320px] mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="px-4 py-1.5 bg-gradient-to-r from-[#FF6B00]/10 to-[#FF6B00]/5 border border-[#FF6B00]/30 rounded-full text-[#FF6B00] text-[11px] font-bold uppercase tracking-wider">
                {isHindi ? "हमें संपर्क करें" : "CONTACT US"}
              </span>
            </div>
            <h2 className="text-[42px] md:text-[48px] font-black text-slate-900 mb-4 leading-tight">
              {isHindi ? "24/7 सहायता और सेवाएं" : "24/7 Support & Services"}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {isHindi
                ? "आपके प्रश्नों, सुझावों और शिकायतों के लिए हम सदैव उपलब्ध हैं। आपकी प्रतिक्रिया हमें बेहतर सेवा प्रदान करने में सहायता करती है।"
                : "We're here 24/7 for your questions, suggestions, and grievances. Your feedback helps us serve better."}
            </p>
          </div>

          {/* Main Contact Grid - 4 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            
            {/* Card 1: Toll-Free Helpline */}
            <div className="group h-full">
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-8 border border-slate-100 h-full flex flex-col">
                <div className="w-14 h-14 bg-gradient-to-br from-[#1B3A7A] to-[#0F2A6B] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-[16px] font-bold text-slate-900 mb-2">
                  {isHindi ? "टोल-फ्री हेल्पलाइन" : "Toll-Free Helpline"}
                </h3>
                <p className="text-[14px] text-slate-500 mb-4 flex-grow">
                  {isHindi ? "सोमवार - शुक्रवार" : "Monday - Friday"}
                </p>
                <div className="space-y-2">
                  <p className="text-[18px] font-bold text-[#1B3A7A] font-mono">1800-11-1992</p>
                  <p className="text-[12px] text-slate-400">9:00 AM - 6:00 PM IST</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-[11px] text-slate-500">
                    {isHindi ? "तत्काल सहायता के लिए कॉल करें" : "Call for instant assistance"}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Email Support */}
            <div className="group h-full">
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-8 border border-slate-100 h-full flex flex-col">
                <div className="w-14 h-14 bg-gradient-to-br from-[#FF6B00] to-[#E55A00] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-[16px] font-bold text-slate-900 mb-2">
                  {isHindi ? "ईमेल सहायता" : "Email Support"}
                </h3>
                <p className="text-[14px] text-slate-500 mb-4 flex-grow">
                  {isHindi ? "24 घंटे के भीतर प्रतिक्रिया" : "Response within 24 hours"}
                </p>
                <div className="space-y-2">
                  <a href="mailto:support-mplads@nic.in" className="text-[14px] font-bold text-[#FF6B00] hover:text-[#E55A00] font-mono break-all">
                    support-mplads@nic.in
                  </a>
                  <p className="text-[12px] text-slate-400">
                    {isHindi ? "तकनीकी सहायता" : "Technical Support"}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-[11px] text-slate-500">
                    {isHindi ? "ईमेल भेजें और प्रतीक्षा करें" : "Send email and get response"}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Head Office */}
            <div className="group h-full">
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-8 border border-slate-100 h-full flex flex-col">
                <div className="w-14 h-14 bg-gradient-to-br from-[#047A1E] to-[#035A14] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-[16px] font-bold text-slate-900 mb-2">
                  {isHindi ? "मुख्य कार्यालय" : "Head Office"}
                </h3>
                <p className="text-[14px] text-slate-500 mb-4 flex-grow">
                  {isHindi ? "MoSPI, नई दिल्ली" : "MoSPI, New Delhi"}
                </p>
                <div className="space-y-2 text-[13px] text-slate-700">
                  <p className="font-semibold">
                    {isHindi ? "खुरशीद लाल भवन" : "Khurshid Lal Bhawan,"}
                  </p>
                  <p>{isHindi ? "जनपथ, नई दिल्ली - 110001" : "Janpath, New Delhi - 110001"}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-[11px] text-slate-500">
                    {isHindi ? "व्यक्तिगत भेंट के लिए" : "For in-person visits"}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4: Visit Portal */}
            <div className="group h-full">
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-8 border border-slate-100 h-full flex flex-col">
                <div className="w-14 h-14 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-[16px] font-bold text-slate-900 mb-2">
                  {isHindi ? "वेब पोर्टल" : "Web Portal"}
                </h3>
                <p className="text-[14px] text-slate-500 mb-4 flex-grow">
                  {isHindi ? "डिजिटल सहायता" : "Digital Assistance"}
                </p>
                <div className="space-y-2">
                  <a href="https://india.gov.in" target="_blank" rel="noreferrer" className="text-[14px] font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1">
                    india.gov.in <ExternalLink className="w-4 h-4" />
                  </a>
                  <p className="text-[12px] text-slate-400">
                    {isHindi ? "राष्ट्रीय पोर्टल" : "National Portal"}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-[11px] text-slate-500">
                    {isHindi ? "ऑनलाइन सहायता" : "24/7 online access"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Support Ticket CTA Section - Ultra-Premium Official Government Redesign */}
          <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-blue-900/60 bg-gradient-to-br from-[#06152B] via-[#0B2146] to-[#040E1E] text-white">
            {/* National Tricolor Top Stripe */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

            {/* Subtle Decorative Radial Glow & Background Watermark */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="p-8 sm:p-12 lg:p-14 relative z-10">
              {/* Header Official Header Tag */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-amber-400 font-bold uppercase">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>भारत सरकार • GOVERNMENT OF INDIA</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300">MoSPI CPGRAMS INTEGRATED</span>
                </div>
                <span className="px-3 py-1 bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-mono font-bold rounded-full uppercase tracking-wider">
                  Official Redressal Portal
                </span>
              </div>

              {/* 2-Column Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Left Column: Information & Overview */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-[#FF9933]/20 to-amber-500/10 border border-[#FF9933]/40 rounded-full">
                    <AlertTriangle className="w-4 h-4 text-[#FF9933]" />
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      {isHindi ? "🎯 लोक शिकायत एवं निवारण कक्ष" : "🎯 PUBLIC GRIEVANCE & COMPLAINT DESK"}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    {isHindi ? "समस्या की रिपोर्ट करें या शिकायत दर्ज करें" : "Report an Issue or File a Statutory Grievance"}
                  </h3>

                  <p className="text-sm md:text-base text-blue-100/90 leading-relaxed font-medium">
                    {isHindi
                      ? "परियोजना में देरी, बजट विसंगतियों या घटिया निर्माण के लिए सीधे शिकायत दर्ज करें। प्रत्येक शिकायत को MoSPI और CPGRAMS सिस्टम में एक अद्वितीय डिजिटल संदर्भ संख्या प्राप्त होती है।"
                      : "Lodge official complaints regarding project delay, expenditure mismatch, or substandard construction. Every grievance receives a unique cryptographic tracking reference under MoSPI Revised Guidelines 2023."}
                  </p>

                  {/* 3 Callout Metrics Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                    <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10 space-y-1 hover:border-amber-400/40 transition-colors">
                      <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>INSTANT SLA</span>
                      </div>
                      <p className="text-xs font-bold text-white">100% Tracking</p>
                      <p className="text-[10px] text-slate-400">CPGRAMS Docket ID</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10 space-y-1 hover:border-blue-400/40 transition-colors">
                      <div className="flex items-center gap-2 text-blue-300 text-xs font-bold font-mono">
                        <FileText className="w-3.5 h-3.5" />
                        <span>EVIDENCE HASH</span>
                      </div>
                      <p className="text-xs font-bold text-white">SHA-256 Ledger</p>
                      <p className="text-[10px] text-slate-400">IT Act Authenticated</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10 space-y-1 hover:border-emerald-400/40 transition-colors">
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>SUPPORT 24/7</span>
                      </div>
                      <p className="text-xs font-bold text-white">DM Escalation</p>
                      <p className="text-[10px] text-slate-400">Direct Nodal Audit</p>
                    </div>
                  </div>
                </div>

                {/* Right Column: High-Contrast Official Action Box */}
                <div className="lg:col-span-5 bg-gradient-to-b from-slate-900/90 to-slate-950/90 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-slate-700/80 shadow-2xl space-y-6">
                  <div className="space-y-2 border-b border-slate-800 pb-4">
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-amber-400 block">
                      STATUTORY ACTION DESK
                    </span>
                    <h4 className="text-base font-extrabold text-white">
                      Lodge Official Complaint / Inquiry
                    </h4>
                    <p className="text-xs text-slate-400">
                      Submit direct public tickets or track existing grievance status via CPGRAMS portal.
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <button 
                      onClick={() => {
                        window.location.href = "/contact";
                      }}
                      className="w-full py-3.5 px-6 bg-gradient-to-r from-[#FF9933] via-amber-500 to-[#e07b1b] hover:from-[#e07b1b] hover:to-[#c8690e] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-lg hover:shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer border border-amber-300/40 active:scale-98"
                    >
                      <AlertTriangle className="w-4 h-4 text-white" />
                      <span>{isHindi ? "शिकायत टिकट खोलें" : "Lodge Official Public Ticket"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                      className="w-full py-3 px-6 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                      <span>{isHindi ? "अक्सर पूछे जाने वाले प्रश्न (FAQ)" : "Search Guidelines & FAQs"}</span>
                    </button>
                  </div>

                  {/* Toll-Free Helpline Footer Bar */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[11px]">Toll-Free Helpline:</span>
                    </div>
                    <span className="font-bold text-amber-400 text-xs">1800-11-1992 (MoSPI Node)</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div id="faq" className="mt-16 bg-white rounded-2xl p-10 border border-slate-200 shadow-md">
            <h3 className="text-[28px] font-bold text-slate-900 mb-8 text-center">
              {isHindi ? "अक्सर पूछे जाने वाले प्रश्न (FAQ)" : "Frequently Asked Questions (FAQs)"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 text-[15px]">
                  {isHindi ? "❓ मुझे डेटा कैसे डाउनलोड करना है?" : "❓ How do I download data?"}
                </h4>
                <p className="text-slate-600 text-[13px] leading-relaxed">
                  {isHindi
                    ? "डैशबोर्ड पर 'कस्टम डेटासेट' विकल्प से आप फिल्टर लगाकर डेटा डाउनलोड कर सकते हैं।"
                    : "Use the 'Custom Dataset' option on the dashboard to filter and download your data."}
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 text-[15px]">
                  {isHindi ? "❓ शिकायत दर्ज करने के बाद क्या होता है?" : "❓ What happens after filing a complaint?"}
                </h4>
                <p className="text-slate-600 text-[13px] leading-relaxed">
                  {isHindi
                    ? "आपको एक ट्रैकिंग नंबर दिया जाएगा जिससे आप अपनी शिकायत की स्थिति ट्रैक कर सकते हैं।"
                    : "You'll receive a tracking number to monitor the status of your complaint."}
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 text-[15px]">
                  {isHindi ? "❓ क्या मैं AI असिस्टेंट से बात कर सकता हूँ?" : "❓ Can I chat with the AI Assistant?"}
                </h4>
                <p className="text-slate-600 text-[13px] leading-relaxed">
                  {isHindi
                    ? "हां, डैशबोर्ड में 'मदद चैटबॉट' सेक्शन से आप 24/7 AI असिस्टेंट से बात कर सकते हैं।"
                    : "Yes, use the 'Help Chatbot' section for 24/7 AI Assistant support."}
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 text-[15px]">
                  {isHindi ? "❓ तकनीकी समस्या होने पर क्या करूं?" : "❓ What if I have a technical issue?"}
                </h4>
                <p className="text-slate-600 text-[13px] leading-relaxed">
                  {isHindi
                    ? "support-mplads@nic.in पर ईमेल करें या 1800-11-1992 पर कॉल करें।"
                    : "Email support-mplads@nic.in or call 1800-11-1992 for technical support."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          PROFESSIONAL FOOTER — Landing Page Only
      ───────────────────────────────────────────── */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-12 bg-white"
      >
        {/* Tricolor Top Gradient Line */}
        <div className="h-1 w-full bg-gradient-to-r from-[#FF6B00] via-white to-[#047A1E]" />
        
        {/* Main Footer Content with Light Tricolor Gradient Background */}
        <div className="bg-gradient-to-br from-[#FFF9F0] via-[#F5FAFD] to-[#F0F9F5] py-12 px-6">
          <div className="max-w-[1320px] mx-auto">
            
            {/* 4-Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              
              {/* Column 1: Government Branding */}
              <div className="space-y-3">
                <h3 
                  style={{ fontFamily: "'Noto Sans', sans-serif" }}
                  className="text-[15px] font-bold text-[#1B3A7A] uppercase tracking-wide leading-tight"
                >
                  {isHindi ? "भारत सरकार" : "Government of India"}
                </h3>
                <p 
                  style={{ fontFamily: "'Noto Sans', sans-serif" }}
                  className="text-[13px] text-slate-700 leading-relaxed"
                >
                  {isHindi
                    ? "सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय"
                    : "Ministry of Statistics & Programme Implementation"}
                </p>
                <p className="text-[12px] text-slate-600 leading-relaxed">
                  {isHindi
                    ? "सभी संसदीय क्षेत्रों में पारदर्शी MPLADS कार्यान्वयन सुनिश्चित करना।"
                    : "Ensuring transparent MPLADS implementation across all constituencies."}
                </p>
              </div>
              
              {/* Column 2: Quick Links */}
              <div className="space-y-3">
                <h3 
                  style={{ fontFamily: "'Noto Sans', sans-serif" }}
                  className="text-[15px] font-bold text-[#047A1E] uppercase tracking-wide leading-tight"
                >
                  {isHindi ? "त्वरित लिंक" : "Quick Links"}
                </h3>
                <ul 
                  style={{ fontFamily: "'Noto Sans', sans-serif" }}
                  className="space-y-2 text-[13px]"
                >
                  <li>
                    <a href="#" className="text-slate-700 hover:text-[#1B3A7A] transition-colors font-medium">
                      {isHindi ? "राष्ट्रीय पोर्टल" : "National Portal"}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-slate-700 hover:text-[#1B3A7A] transition-colors font-medium">
                      {isHindi ? "आधिकारिक MPLADS" : "Official MPLADS"}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-slate-700 hover:text-[#1B3A7A] transition-colors font-medium">
                      {isHindi ? "दिशा-निर्देश" : "Guidelines"}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-slate-700 hover:text-[#1B3A7A] transition-colors font-medium">
                      {isHindi ? "FAQ" : "FAQs"}
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Column 3: Contact Information */}
              <div className="space-y-3">
                <h3 
                  style={{ fontFamily: "'Noto Sans', sans-serif" }}
                  className="text-[15px] font-bold text-[#FF6B00] uppercase tracking-wide leading-tight"
                >
                  {isHindi ? "संपर्क करें" : "Contact Us"}
                </h3>
                <ul 
                  style={{ fontFamily: "'Noto Sans', sans-serif" }}
                  className="space-y-2 text-[13px] text-slate-700"
                >
                  <li className="flex items-start gap-2">
                    <span className="font-bold min-w-fit">{isHindi ? "फोन:" : "Phone:"}</span>
                    <span>1800-11-1992</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold min-w-fit">{isHindi ? "ईमेल:" : "Email:"}</span>
                    <a href="mailto:support@mplads.gov.in" className="text-[#1B3A7A] hover:underline">
                      support@mplads.gov.in
                    </a>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold min-w-fit">{isHindi ? "पता:" : "Address:"}</span>
                    <span>National Informatics Centre, New Delhi</span>
                  </li>
                </ul>
              </div>
              
              {/* Column 4: Certifications */}
              <div className="space-y-3">
                <h3 
                  style={{ fontFamily: "'Noto Sans', sans-serif" }}
                  className="text-[15px] font-bold text-slate-800 uppercase tracking-wide leading-tight"
                >
                  {isHindi ? "प्रमाणपत्र" : "Certifications"}
                </h3>
                <div className="space-y-2 flex flex-col">
                  <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-2 rounded border border-blue-200 w-fit">
                    <Shield className="w-4 h-4 text-[#1B3A7A]" />
                    <span className="text-[12px] font-bold text-[#1B3A7A]">ISO 27001</span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-green-50 px-3 py-2 rounded border border-green-200 w-fit">
                    <CheckCircle2 className="w-4 h-4 text-[#047A1E]" />
                    <span className="text-[12px] font-bold text-[#047A1E]">
                      {isHindi ? "GOV.IN सर्टीफाइड" : "GOV.IN Certified"}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-amber-50 px-3 py-2 rounded border border-amber-200 w-fit">
                    <Lock className="w-4 h-4 text-[#FF6B00]" />
                    <span className="text-[12px] font-bold text-[#FF6B00]">TLS 1.3</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tricolor Divider Line */}
            <div className="my-8 h-0.5 bg-gradient-to-r from-[#FF6B00] via-white to-[#047A1E] opacity-60" />
            
            {/* Bottom Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-600"
              style={{ fontFamily: "'Noto Sans', sans-serif" }}>
              <div className="text-center md:text-left">
                © 2026 {isHindi ? "सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय" : "Ministry of Statistics & Programme Implementation"}, 
                {isHindi ? " भारत सरकार। सर्वाधिकार सुरक्षित।" : " Government of India. All Rights Reserved."}
              </div>
              <div className="flex gap-4 flex-wrap justify-center">
                <a href="#" className="text-slate-600 hover:text-[#1B3A7A] transition-colors font-medium">
                  {isHindi ? "गोपनीयता नीति" : "Privacy Policy"}
                </a>
                <span className="text-slate-400">|</span>
                <a href="#" className="text-slate-600 hover:text-[#1B3A7A] transition-colors font-medium">
                  {isHindi ? "शर्तें और शिर्तें" : "Terms & Conditions"}
                </a>
                <span className="text-slate-400">|</span>
                <a href="#" className="text-slate-600 hover:text-[#1B3A7A] transition-colors font-medium">
                  {isHindi ? "पहुंचवि" : "Accessibility"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>

    </div>
  );
};
