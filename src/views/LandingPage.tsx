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
  KeyRound,
  FileText,
  BellRing,
  Globe,
  Search,
  X,
  BarChart3,
  AlertTriangle,
  Download,
  Info,
  Eye,
  Megaphone,
  Fingerprint,
  Smartphone,
  RefreshCw,
  MapPin,
  Building2,
  Globe2,
  Mail,
  Phone,
  ExternalLink,
  HelpCircle,
  Headphones,
} from "lucide-react";
import { UserRole, Language } from "../types";
import { StateEmblem } from "../components/gov/StateEmblem";
import { SatyamevJayateLogo } from "../components/gov/SatyamevJayateLogo";
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
  const [selectedRole, setSelectedRole] = useState<UserRole>("Ministry");
  const [govIdInput, setGovIdInput] = useState<string>("admin.mospi@nic.in");
  const [passcode, setPasscode] = useState<string>("••••••••••••");
  const [otpInput, setOtpInput] = useState<string>("948201");
  const [authMethod, setAuthMethod] = useState<"govid" | "parichay" | "otp">("govid");
  const [captchaCode, setCaptchaCode] = useState<string>("7P9xE");
  const [captchaInput, setCaptchaInput] = useState<string>("");
  const [captchaError, setCaptchaError] = useState<string>("");
  const [isSignInModalOpen, setIsSignInModalOpen] = useState<boolean>(false);

  const isHindi = language === "hi";

  const regenerateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
    setCaptchaInput("");
    setCaptchaError("");
  };

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

  const handleRoleChange = (role: UserRole, defaultUser: string) => {
    setSelectedRole(role);
    setGovIdInput(defaultUser);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaInput.trim().toLowerCase() !== captchaCode.toLowerCase()) {
      setCaptchaError(
        isHindi
          ? "गलत कैप्चा कोड! कृपया पुनः प्रयास करें।"
          : "Invalid CAPTCHA code! Please try again."
      );
      regenerateCaptcha();
      return;
    }
    // Close modal and navigate
    setIsSignInModalOpen(false);
    onSelectRole(selectedRole);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-[#1E293B]">

      {/* ─────────────────────────────────────────────
          HEADER — Government branding + Nav + Login
      ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b-2 border-[#1B3A7A]">
        <div className="max-w-[1320px] mx-auto px-6 py-3 flex items-center justify-between gap-6">

          {/* Left: Emblem + Logo + Title */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex flex-col items-center">
              <img 
                src={new URL("../assets/images/Emblem_of_India.svg", import.meta.url).href}
                alt="Emblem of India"
                className="h-16 w-16 object-contain"
              />
              <div className="text-[9px] font-bold text-[#1B3A7A] mt-0.5 leading-none">
                {isHindi ? "सत्यमेव जयते" : ""}
              </div>
            </div>
            
            {/* MPLADS Logo */}
            <img 
              src={mpladsLogo}
              alt="MPLADS Logo"
              className="h-16 w-16 object-contain"
            />
            
            <div className="border-l-2 border-slate-300 pl-3">
              <div className="text-[13px] font-bold text-slate-900 leading-tight">
                {isHindi ? "भारत सरकार" : "Government of India"}
              </div>
              <div className="text-[10px] text-slate-600 leading-tight">
                {isHindi
                  ? "सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय"
                  : "Ministry of Statistics & Programme Implementation"}
              </div>
              <div className="text-[18px] font-extrabold text-[#1B3A7A] leading-tight mt-0.5">
                MPLADS
              </div>
            </div>
          </div>

          {/* Center: Nav */}
          <nav className="hidden lg:flex items-center gap-6 flex-1 ml-8">
            <a
              href="#top"
              className="text-[13px] font-semibold text-[#1B3A7A] hover:text-[#0F2A6B] transition-colors outline-none focus:outline-none"
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
            <button
              onClick={() => setIsSignInModalOpen(true)}
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
                  className="text-[36px] sm:text-[44px] lg:text-[52px] font-black text-[#0F2A6B] leading-[1.08] tracking-tight"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic",
                    fontWeight: 700,
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
                  onClick={() => setIsSignInModalOpen(true)}
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
          KEY FEATURES — 4 white cards in a row
      ───────────────────────────────────────────── */}
      <section id="features" className="scroll-mt-24 bg-white py-12 px-4">
        <div className="max-w-[1320px] mx-auto">

          {/* Section heading */}
          <div className="text-center mb-10">
            <h2 className="inline-block text-[28px] font-black text-[#0F2A6B] relative pb-3">
              {isHindi ? "प्रमुख विशेषताएं" : "Key Features"}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60px] h-[3px] bg-[#1B3A7A] rounded-full" />
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Card 1: Anomaly Detection */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-[#4B5EAA]" />
              </div>
              <h3 className="font-bold text-[15px] text-slate-900 mb-2">
                {isHindi ? "विसंगति जांच" : "Anomaly Detection"}
              </h3>
              <p className="text-[13px] text-slate-500 leading-relaxed flex-1">
                {isHindi
                  ? "एआई मॉडल फंड उपयोग, परियोजना लागत, देरी और अन्य विसंगतियों की पहचान करते हैं।"
                  : "AI models identify irregularities in fund utilization, project costs, delays and more."}
              </p>
              <button
                onClick={onExplore}
                className="mt-5 flex items-center gap-1.5 text-[13px] font-bold text-[#1B3A7A] hover:underline cursor-pointer self-start"
              >
                {isHindi ? "और पढ़ें" : "Read More"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: Fraud Prevention */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-[#22A861]" />
              </div>
              <h3 className="font-bold text-[15px] text-slate-900 mb-2">
                {isHindi ? "धोखाधड़ी रोकथाम" : "Fraud Prevention"}
              </h3>
              <p className="text-[13px] text-slate-500 leading-relaxed flex-1">
                {isHindi
                  ? "दोहरे काम, नकली विक्रेताओं, बढ़ी हुई लागत और अन्य संदिग्ध पैटर्न का स्वतः पता लगाएं।"
                  : "Detect duplicate works, fake vendors, inflated costs and other suspicious patterns."}
              </p>
              <button
                onClick={() => onSelectRole("Ministry")}
                className="mt-5 flex items-center gap-1.5 text-[13px] font-bold text-[#1B3A7A] hover:underline cursor-pointer self-start"
              >
                {isHindi ? "और पढ़ें" : "Read More"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 3: Performance Insights */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-[#7C5CBF]" />
              </div>
              <h3 className="font-bold text-[15px] text-slate-900 mb-2">
                {isHindi ? "प्रदर्शन अंतर्दृष्टि" : "Performance Insights"}
              </h3>
              <p className="text-[13px] text-slate-500 leading-relaxed flex-1">
                {isHindi
                  ? "जिला, राज्य और राष्ट्रीय स्तर के प्रदर्शन की निगरानी के लिए विजुअल डैशबोर्ड।"
                  : "Visual dashboards and reports to monitor district, state and national performance."}
              </p>
              <button
                onClick={onExplore}
                className="mt-5 flex items-center gap-1.5 text-[13px] font-bold text-[#1B3A7A] hover:underline cursor-pointer self-start"
              >
                {isHindi ? "और पढ़ें" : "Read More"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 4: Real-time Alerts */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center mb-4">
                <BellRing className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <h3 className="font-bold text-[15px] text-slate-900 mb-2">
                {isHindi ? "वास्तविक समय अलर्ट" : "Real-time Alerts"}
              </h3>
              <p className="text-[13px] text-slate-500 leading-relaxed flex-1">
                {isHindi
                  ? "परियोजना में देरी, बजट अधिकता और अन्य महत्वपूर्ण मुद्दों के लिए तत्काल अलर्ट।"
                  : "Get instant alerts for delays, budget overruns, and other critical issues."}
              </p>
              <button
                onClick={onExplore}
                className="mt-5 flex items-center gap-1.5 text-[13px] font-bold text-[#1B3A7A] hover:underline cursor-pointer self-start"
              >
                {isHindi ? "और पढ़ें" : "Read More"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ── Latest Update bar ── */}
          <div className="mt-8 bg-[#EEF3FB] border border-[#CCDAF5] rounded-xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1B3A7A]/15 flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5 text-[#1B3A7A]" />
              </div>
              <p className="text-[13.5px] text-slate-700 leading-relaxed">
                <span className="font-bold text-[#1B3A7A] mr-1">
                  {isHindi ? "नवीनतम अपडेट:" : "Latest Update:"}
                </span>
                {isHindi
                  ? "बेहतर पारदर्शिता और वास्तविक समय की अंतर्दृष्टि के लिए MPLADS eSAKSHI सार्वजनिक डैशबोर्ड को नया रूप दिया गया है।"
                  : "MPLADS eSAKSHI Public Dashboard has been revamped for better transparency and real-time insights."}
              </p>
            </div>
            <button
              onClick={onExplore}
              className="shrink-0 font-bold text-[13.5px] text-[#1B3A7A] hover:underline flex items-center gap-1 cursor-pointer"
            >
              {isHindi ? "और जानें" : "Know More"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────
          ABOUT MPLADS SECTION
      ───────────────────────────────────────────── */}
      <section id="about" className="scroll-mt-24 bg-gradient-to-b from-[#F0F7FF] to-white py-16 px-4">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="inline-block text-[32px] font-bold text-[#0F2A6B] relative pb-3">
              {isHindi ? "MPLADS के बारे में" : "About MPLADS"}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80px] h-[3px] bg-[#FF6B00] rounded-full" />
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left: Overview */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-[18px] font-bold text-[#1B3A7A] mb-3">
                  {isHindi ? "क्या है MPLADS?" : "What is MPLADS?"}
                </h3>
                <p className="text-[14px] text-slate-700 leading-relaxed mb-3">
                  {isHindi
                    ? "सांसद स्थानीय क्षेत्र विकास योजना (MPLADS) भारत में एक महत्वपूर्ण कार्यक्रम है जो प्रत्येक सदस्य को अपने संसदीय क्षेत्र में विकास परियोजनाओं के लिए निधि आवंटित करने की अनुमति देता है।"
                    : "MPLADS (Member of Parliament Local Area Development Scheme) is a key program in India that allocates funds to each Member of Parliament for development projects in their constituencies."}
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-[18px] font-bold text-[#047A1E] mb-3">
                  {isHindi ? "मुख्य उद्देश्य" : "Key Objectives"}
                </h3>
                <ul className="space-y-2 text-[14px] text-slate-700">
                  <li className="flex gap-2">
                    <span className="text-[#FF6B00] font-bold">•</span>
                    <span>{isHindi ? "स्थानीय विकास परियोजनाओं को वित्त पोषण करना" : "Finance local development projects"}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#FF6B00] font-bold">•</span>
                    <span>{isHindi ? "पारदर्शी कार्यान्वयन सुनिश्चित करना" : "Ensure transparent implementation"}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#FF6B00] font-bold">•</span>
                    <span>{isHindi ? "समुदाय की भागीदारी को प्रोत्साहित करना" : "Encourage community participation"}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#FF6B00] font-bold">•</span>
                    <span>{isHindi ? "जवाबदेहिता और निगरानी में सुधार" : "Improve accountability and monitoring"}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Statistics & Impact */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#1B3A7A] to-[#0F2A6B] rounded-xl p-6 shadow-md text-white">
                <h3 className="text-[18px] font-bold mb-4">
                  {isHindi ? "प्रभाव और आंकड़े" : "Impact & Statistics"}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-[24px] font-bold">₹ 4,851 Cr</div>
                    <div className="text-[12px] text-blue-200">{isHindi ? "कुल जारी" : "Total Released"}</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-[24px] font-bold">1,24,578</div>
                    <div className="text-[12px] text-blue-200">{isHindi ? "कार्य स्वीकृत" : "Works Approved"}</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-[24px] font-bold">92,345</div>
                    <div className="text-[12px] text-blue-200">{isHindi ? "पूर्ण कार्य" : "Completed"}</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="text-[24px] font-bold">76 %</div>
                    <div className="text-[12px] text-blue-200">{isHindi ? "उपयोग दर" : "Utilization"}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-[18px] font-bold text-[#FF6B00] mb-3">
                  {isHindi ? "लाभार्थी" : "Beneficiaries"}
                </h3>
                <p className="text-[14px] text-slate-700 mb-3">
                  {isHindi
                    ? "राष्ट्रीय, राज्य और जिला स्तर पर सभी हितधारक जो MPLADS कार्यान्वयन में शामिल हैं।"
                    : "All stakeholders at national, state, and district levels involved in MPLADS implementation."}
                </p>
                <div className="space-y-1 text-[13px] text-slate-700">
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

          {/* Support Ticket CTA Section */}
          <div className="bg-gradient-to-r from-[#1B3A7A] to-[#0F2A6B] rounded-2xl p-12 text-white text-center border border-slate-200 shadow-xl">
            <div className="inline-block mb-4 px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
              <span className="text-[12px] font-bold uppercase tracking-wider text-blue-100">
                {isHindi ? "तत्काल कार्रवाई" : "IMMEDIATE ACTION"}
              </span>
            </div>
            <h3 className="text-[28px] md:text-[32px] font-black mb-3 leading-tight">
              {isHindi ? "समस्या की रिपोर्ट करें या शिकायत दर्ज करें" : "Report an Issue or File a Grievance"}
            </h3>
            <p className="text-blue-100 text-[15px] mb-8 max-w-2xl mx-auto">
              {isHindi
                ? "अपने सभी समस्याओं, सुझावों और शिकायतों के लिए सहायता टिकट खोलें। आप ट्रैकिंग नंबर प्राप्त करेंगे।"
                : "Open a support ticket for all your issues, suggestions, and grievances. Get a tracking number for follow-up."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  const contactPageLink = "/contact";
                  window.location.href = contactPageLink;
                }}
                className="px-10 py-4 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-5 h-5" />
                {isHindi ? "सहायता टिकट खोलें" : "Open Support Ticket"}
              </button>
              <button 
                onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-4 bg-white/20 hover:bg-white/30 border border-white text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 backdrop-blur-sm flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-5 h-5" />
                {isHindi ? "FAQ देखें" : "View FAQs"}
              </button>
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
      <footer className="mt-12 bg-white">
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
      </footer>

      {/* ─────────────────────────────────────────────
          LOGIN MODAL — full SSO sign-in overlay
      ───────────────────────────────────────────── */}
      {isSignInModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-300 overflow-hidden my-8">

            {/* Tricolor top strip */}
            <div className="flex h-2.5 w-full">
              <div className="w-1/3 bg-[#FF6B00]" />
              <div className="w-1/3 bg-white border-y border-slate-100" />
              <div className="w-1/3 bg-[#047A1E]" />
            </div>

            {/* Modal header */}
            <div className="bg-[#1B3A7A] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SatyamevJayateLogo size="sm" />
                <div className="border-l border-white/20 pl-3">
                  <div className="text-[10px] uppercase font-bold text-blue-300 tracking-wider">
                    National Informatics Centre — NIC
                  </div>
                  <h3 className="text-[16px] font-bold tracking-tight mt-0.5">
                    {isHindi ? "सरकारी लॉगिन पोर्टल" : "Government Single Sign-On Gateway"}
                  </h3>
                  <p className="text-[11px] text-blue-200">
                    {isHindi
                      ? "सांसद स्थानीय क्षेत्र विकास योजना (MPLADS)"
                      : "Member of Parliament Local Area Development Scheme"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSignInModalOpen(false)}
                className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Two-column body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">

              {/* Left: credentials form (7 cols) */}
              <div className="lg:col-span-7 p-6 space-y-5">

                <div className="border-b border-slate-100 pb-3">
                  <p className="text-[10px] font-bold text-[#FF6B00] uppercase tracking-wider">
                    {isHindi ? "सुरक्षित पहचान सत्यापन" : "SECURE IDENTITY VERIFICATION"}
                  </p>
                  <h4 className="text-[15px] font-bold text-slate-800 mt-0.5">
                    {isHindi ? "अपने अधिकृत क्रेडेंशियल्स दर्ज करें" : "Enter Authorized Gateway Credentials"}
                  </h4>
                </div>

                {/* Role selector */}
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold uppercase tracking-wide text-[#1B3A7A]">
                    {isHindi ? "शासकीय भूमिका चुनें:" : "Select Governance Role:"}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map((r) => {
                      const isSelected = selectedRole === r.id;
                      return (
                        <button
                          key={r.id}
                          onClick={() => handleRoleChange(r.id, r.defaultUser)}
                          className={`p-2.5 rounded-lg border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#EBF2FD] border-[#1B3A7A] ring-2 ring-[#1B3A7A]/20"
                              : "bg-white border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <div
                            className={`p-1.5 rounded shrink-0 mt-0.5 ${
                              isSelected ? "bg-[#1B3A7A] text-white" : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <r.icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="text-[11px] min-w-0">
                            <div
                              className={`font-bold truncate ${
                                isSelected ? "text-[#1B3A7A]" : "text-slate-800"
                              }`}
                            >
                              {r.title}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{r.badge}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Auth method tabs */}
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  {(["govid", "parichay", "otp"] as const).map((method) => (
                    <button
                      key={method}
                      onClick={() => setAuthMethod(method)}
                      className={`flex-1 py-1.5 text-[11px] font-bold rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        authMethod === method
                          ? "bg-white text-[#1B3A7A] shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {method === "govid" && <Lock className="w-3.5 h-3.5" />}
                      {method === "parichay" && <Fingerprint className="w-3.5 h-3.5" />}
                      {method === "otp" && <Smartphone className="w-3.5 h-3.5" />}
                      <span>
                        {method === "govid" ? "GovID" : method === "parichay" ? "Parichay SSO" : "OTP Login"}
                      </span>
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    {authMethod === "govid" && (
                      <>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1 block">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            {isHindi ? "सरकारी ईमेल / यूज़र आईडी" : "GovID / Official Email"}
                          </label>
                          <input
                            type="text"
                            required
                            value={govIdInput}
                            onChange={(e) => setGovIdInput(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-[12px] focus:ring-2 focus:ring-[#1B3A7A] outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1 block">
                            <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                            {isHindi ? "पासकोड" : "Passcode"}
                          </label>
                          <input
                            type="password"
                            required
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-[12px] focus:ring-2 focus:ring-[#1B3A7A] outline-none"
                          />
                        </div>
                      </>
                    )}
                    {authMethod === "parichay" && (
                      <>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1 block">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            Parichay ID / Mobile
                          </label>
                          <input
                            type="text"
                            required
                            value={govIdInput}
                            onChange={(e) => setGovIdInput(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-[12px] focus:ring-2 focus:ring-[#1B3A7A] outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1 block">
                            <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                            Password
                          </label>
                          <input
                            type="password"
                            required
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-[12px] focus:ring-2 focus:ring-[#1B3A7A] outline-none"
                          />
                        </div>
                      </>
                    )}
                    {authMethod === "otp" && (
                      <>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1 block">
                            <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                            {isHindi ? "पंजीकृत मोबाइल नंबर" : "Registered Mobile Number"}
                          </label>
                          <div className="flex gap-2">
                            <span className="bg-slate-200 border border-slate-300 rounded-md px-2.5 py-2 text-[11px] font-bold text-slate-600 flex items-center">
                              +91
                            </span>
                            <input
                              type="tel"
                              required
                              defaultValue="9876543210"
                              className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-md text-[12px] focus:ring-2 focus:ring-[#1B3A7A] outline-none"
                            />
                            <button
                              type="button"
                              className="px-3 bg-slate-200 hover:bg-slate-300 border border-slate-300 rounded-md text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
                            >
                              {isHindi ? "ओटीपी भेजें" : "Send OTP"}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 mb-1 block">
                            {isHindi ? "6-अंकीय ओटीपी" : "6-Digit OTP"}
                          </label>
                          <input
                            type="text"
                            maxLength={6}
                            required
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-[14px] font-mono tracking-widest text-center focus:ring-2 focus:ring-[#1B3A7A] outline-none"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* CAPTCHA */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1 block">
                      <Shield className="w-3.5 h-3.5 text-[#1B3A7A]" />
                      {isHindi ? "सुरक्षा सत्यापन (कैप्चा)" : "Security Verification (CAPTCHA)"}
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 select-none border-2 border-dashed border-slate-300 font-mono text-xl font-extrabold tracking-widest text-[#1B3A7A] px-5 h-10 rounded-md flex items-center justify-center italic">
                          {captchaCode}
                        </div>
                        <button
                          type="button"
                          onClick={regenerateCaptcha}
                          className="p-2 hover:bg-slate-100 border border-slate-200 rounded-md text-[#1B3A7A] cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={captchaInput}
                        onChange={(e) => {
                          setCaptchaInput(e.target.value);
                          setCaptchaError("");
                        }}
                        placeholder={isHindi ? "कैप्चा कोड दर्ज करें" : "Enter code above"}
                        className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-md text-[12px] font-mono focus:ring-2 focus:ring-[#1B3A7A] outline-none"
                      />
                    </div>
                    {captchaError && (
                      <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {captchaError}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsSignInModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[12px] font-bold rounded-md cursor-pointer"
                    >
                      {isHindi ? "रद्द करें" : "Cancel"}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#1B3A7A] hover:bg-[#142d63] text-white text-[12px] font-bold rounded-md shadow flex items-center gap-1.5 cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-300" />
                      {isHindi ? "प्रवेश करें" : `Sign In as ${selectedRole}`}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Right: Help panel (5 cols) */}
              <div className="lg:col-span-5 p-6 bg-slate-50 space-y-5">
                <div className="border-b border-slate-200 pb-3">
                  <p className="text-[10px] font-extrabold text-[#047A1E] uppercase tracking-wider">
                    {isHindi ? "सहायता एवं निर्देश" : "INSTRUCTIONAL GUIDANCE"}
                  </p>
                  <h4 className="text-[15px] font-bold text-[#1B3A7A] mt-0.5">
                    {isHindi ? "महत्वपूर्ण लिंक्स" : "Official Manual & Support"}
                  </h4>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <h5 className="text-[11px] font-extrabold text-[#1B3A7A] uppercase tracking-wider mb-1">
                      {isHindi ? "सहायता मैनुअल" : "Help Manual / User Guide"}
                    </h5>
                    <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                      {isHindi
                        ? "सभी भूमिकाओं के लिए व्यापक उपयोगकर्ता मार्गदर्शिका"
                        : "Comprehensive instructions for all user roles."}
                    </p>
                    <a
                      href="#"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF6B00] hover:underline"
                    >
                      <Download className="w-3 h-3" />
                      {isHindi ? "डाउनलोड करें" : "Download PDF Guide"}
                    </a>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <h5 className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider mb-1">
                      {isHindi ? "पासवर्ड रीसेट" : "Forgot Password / Reset"}
                    </h5>
                    <a
                      href="#"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1B3A7A] hover:underline"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      {isHindi ? "क्रेडेंशियल्स रिकवरी" : "Recover Account Credentials"}
                    </a>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50 border-l-4 border-[#FF6B00] rounded-r-lg">
                  <p className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5 mb-1.5">
                    <Shield className="w-4 h-4 text-[#FF6B00]" />
                    {isHindi ? "सुरक्षा सलाह" : "Security Advisory"}
                  </p>
                  <ul className="text-[11px] text-slate-700 space-y-1 list-disc list-inside leading-relaxed">
                    <li>{isHindi ? "URL में 'https://' की जांच करें।" : "Verify URL authenticity before entering passwords."}</li>
                    <li>{isHindi ? "OTP किसी के साथ साझा न करें।" : "Never share OTP or passwords with anyone."}</li>
                    <li>{isHindi ? "काम पूरा होने पर Log Out करें।" : "Always Log Out after your session ends."}</li>
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span>NIC Gateway v3.12</span>
                  <span>TLS 1.3 Secured</span>
                </div>
              </div>

            </div>

            {/* Modal footer */}
            <div className="bg-slate-900 text-slate-400 text-[10px] px-6 py-3 text-center border-t border-slate-800 leading-relaxed">
              {isHindi
                ? "यह एनआईसी द्वारा सुरक्षित एक अधिकृत सरकारी प्रणाली है। सभी गतिविधियां रिकॉर्ड की जा रही हैं।"
                : "WARNING: This is a secure Government of India system. All actions are logged and audited per IT Act, 2000."}
            </div>
          </div>
        </div>
      )}



    </div>
  );
};
