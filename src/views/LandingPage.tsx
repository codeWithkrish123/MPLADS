import React, { useState } from "react";
import {
  Shield,
  ArrowRight,
  Database,
  ChevronRight,
  TrendingUp,
  MapPin,
  Building2,
  Globe2,
  Landmark,
  CheckCircle2,
  Lock,
  User,
  KeyRound,
  FileText,
  BellRing,
  Globe,
  Award,
  Search,
  X,
  BarChart3,
  Camera,
  AlertTriangle,
  Download,
  Info,
  FileSpreadsheet,
  Eye,
  ExternalLink,
  HelpCircle,
  PhoneCall,
  Mail,
  Filter,
  Megaphone,
  Fingerprint,
  Smartphone,
  RefreshCw,
} from "lucide-react";
import { UserRole, Language } from "../types";
import { getTranslation } from "../data/translations";
import { GovFooter } from "../components/layout/GovFooter";
import { StateEmblem } from "../components/gov/StateEmblem";

const portalHeroImg = "/src/assets/images/mplads_portal_hero_1787771510954.jpg";

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
  const [rightPreviewTab, setRightPreviewTab] = useState<"overview" | "alerts" | "workflow">("overview");
  const [isSignInModalOpen, setIsSignInModalOpen] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"all" | "guidelines" | "circulars" | "reports">("all");

  const currentLang: Language = language === "hi" ? "hi" : "en";
  const isHindi = currentLang === "hi";
  const t = getTranslation(currentLang);

  const roles = [
    {
      id: "Ministry" as UserRole,
      title: isHindi ? "सांख्यिकी एवं का.का. मंत्रालय" : "Ministry of Statistics & PI",
      subtitle: isHindi ? "केंद्रीय मुख्यालय पोर्टल" : "Union HQ Portal",
      defaultUser: "admin.mospi@nic.in",
      icon: Building2,
      badge: isHindi ? "राष्ट्रीय मुख्यालय" : "National HQ",
    },
    {
      id: "Member of Parliament" as UserRole,
      title: isHindi ? "संसद सदस्य (सांसद)" : "Member of Parliament",
      subtitle: isHindi ? "लोक सभा / राज्य सभा" : "Lok Sabha / Rajya Sabha",
      defaultUser: "mp.constituency@sansad.nic.in",
      icon: Landmark,
      badge: isHindi ? "संसदीय क्षेत्र" : "Constituency",
    },
    {
      id: "District Authority" as UserRole,
      title: isHindi ? "जिला प्राधिकारी / डीएम" : "District Authority / DM",
      subtitle: isHindi ? "योजना व कार्यान्वयन कक्ष" : "Planning & Execution Cell",
      defaultUser: "dm.ghaziabad@nic.in",
      icon: MapPin,
      badge: isHindi ? "जिला प्रकोष्ठ" : "District Cell",
    },
    {
      id: "State Nodal Authority" as UserRole,
      title: isHindi ? "राज्य नोडल प्राधिकरण" : "State Nodal Authority",
      subtitle: isHindi ? "राज्य योजना विभाग" : "State Planning Department",
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
      setCaptchaError(isHindi ? "गलत कैप्चा कोड! कृपया पुनः प्रयास करें।" : "Invalid CAPTCHA code! Please try again.");
      regenerateCaptcha();
      return;
    }
    onSelectRole(selectedRole);
  };

  // Font size multiplier class
  const getFontSizeClass = () => {
    if (fontSize === "large") return "text-[105%]";
    if (fontSize === "xlarge") return "text-[112%]";
    return "text-[100%]";
  };

  return (
    <div
      id="landing-page"
      className={`min-h-screen flex flex-col font-sans transition-all ${getFontSizeClass()} ${
        isHighContrast
          ? "bg-[#091526] text-amber-100 selection:bg-amber-400 selection:text-black"
          : "bg-[#F4F7FA] text-[#1E293B] selection:bg-[#0F4C81] selection:text-white"
      }`}
    >
      {/* Unified Sticky Header Container */}
      <div className={`sticky top-0 z-50 shadow-sm transition-colors ${isHighContrast ? "bg-[#0A1A2F] border-b border-amber-500/40" : "bg-white border-b border-[#D9E2EC]"}`}>
        
        {/* Top National Flag & Institutional Header Bar with GIGW Accessibility Controls */}
        <div className="bg-[#0B223D] text-white text-xs py-1.5 px-4 sm:px-8 flex flex-wrap items-center justify-between border-b border-white/10 gap-2">
          {/* Left: Emblem & Gov Name */}
          <div className="flex items-center gap-3">
            {/* National Flag Badge */}
            <div className="flex h-3.5 w-5 rounded-xs overflow-hidden border border-white/30 shrink-0 shadow-2xs">
              <div className="w-1/3 bg-[#F37023]" />
              <div className="w-1/3 bg-white" />
              <div className="w-1/3 bg-[#138808]" />
            </div>
            <span className="font-semibold tracking-wide text-white">
              {isHindi ? "भारत सरकार | GOVERNMENT OF INDIA" : "भारत सरकार | GOVERNMENT OF INDIA"}
            </span>
            <span className="hidden md:inline text-blue-200/50">|</span>
            <span className="hidden md:inline text-blue-100 font-medium text-[11px]">
              {isHindi ? "सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)" : "Ministry of Statistics and Programme Implementation (MoSPI)"}
            </span>
          </div>

          {/* Right: Accessibility Toolbar & Language Switcher */}
          <div className="flex items-center gap-3 text-[11px] text-blue-100 font-medium">
            {/* Accessibility Font Resizer */}
            <div className="hidden sm:flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded border border-white/20 text-[11px]">
              <span className="text-blue-200 text-[10px] uppercase font-bold mr-1">Font:</span>
              <button
                onClick={() => setFontSize("normal")}
                className={`px-1 rounded ${fontSize === "normal" ? "bg-amber-400 text-slate-900 font-bold" : "hover:text-white"}`}
                title="Normal Font Size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize("large")}
                className={`px-1 rounded ${fontSize === "large" ? "bg-amber-400 text-slate-900 font-bold" : "hover:text-white"}`}
                title="Large Font Size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize("xlarge")}
                className={`px-1 rounded ${fontSize === "xlarge" ? "bg-amber-400 text-slate-900 font-bold" : "hover:text-white"}`}
                title="Extra Large Font Size"
              >
                A++
              </button>
            </div>

            {/* High Contrast Toggle */}
            <button
              onClick={() => setIsHighContrast(!isHighContrast)}
              className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-bold transition-colors cursor-pointer ${
                isHighContrast
                  ? "bg-amber-400 text-slate-900 border-amber-300"
                  : "bg-white/10 text-blue-100 border-white/20 hover:bg-white/20"
              }`}
              title="High Contrast Mode"
            >
              <Eye className="w-3 h-3" />
              <span>{isHighContrast ? "Standard Contrast" : "High Contrast"}</span>
            </button>

            {/* Language Switcher */}
            {onToggleLanguage && (
              <button
                onClick={onToggleLanguage}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded border text-xs font-bold transition-colors cursor-pointer bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-500/50 shadow-2xs"
                title="Switch Language / भाषा बदलें"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>{isHindi ? "English" : "हिन्दी (Hindi)"}</span>
              </button>
            )}

            <button
              onClick={() => {
                const el = document.getElementById("features");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="hidden lg:inline-block text-blue-100 hover:text-white hover:underline cursor-pointer"
            >
              {isHindi ? "मुख्य सामग्री पर जाएं" : "Skip to main content"}
            </button>
          </div>
        </div>

        {/* Main Government Portal Branding & Navigation Header */}
        <header className={`py-4 px-4 sm:px-8 border-b border-[#E5E7EB] ${isHighContrast ? "bg-[#0B1E36] text-white" : "bg-white"}`}>
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Emblem & Portal Title */}
            <div className="flex items-center gap-3.5 shrink-0 w-full lg:w-auto justify-between lg:justify-start">
              <div className="flex items-center gap-3.5">
                {/* GIGW Vector Emblem Component */}
                <StateEmblem size="md" theme="gold" className="shrink-0" />
                
                <div className="flex flex-col select-none border-l border-slate-200 pl-3.5">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wide leading-none font-sans">
                    {isHindi ? "भारत सरकार" : "Government of India"}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 font-semibold leading-none mt-1 font-sans">
                    {isHindi ? "सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय" : "Ministry of Statistics & Programme Implementation"}
                  </span>
                  <span className="text-xl font-extrabold text-[#0B3C83] tracking-tight leading-none mt-1.5 font-sans">
                    {isHindi ? "सांसद निधि" : "MPLADS"}
                  </span>
                </div>
              </div>
            </div>

            {/* Horizontal Nav menu items matching the image exactly */}
            <nav className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-bold text-slate-700">
              <a href="#landing-page" className="text-[#0B3C83] relative py-1 px-3 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-[#0B3C83]">
                {isHindi ? "मुख्य पृष्ठ" : "Home"}
              </a>
              <a
                href="#features"
                className="hover:text-[#0B3C83] rounded-md px-3 py-1 transition-all duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {isHindi ? "सांसद निधि के बारे में" : "About MPLADS"}
              </a>
              <button
                onClick={onExplore}
                className="hover:text-[#0B3C83] rounded-md px-3 py-1 transition-all duration-200 text-left cursor-pointer font-bold"
              >
                {isHindi ? "डैशबोर्ड" : "Dashboard"}
              </button>
              <a
                href="#features"
                className="hover:text-[#0B3C83] rounded-md px-3 py-1 transition-all duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {isHindi ? "विशेषताएं" : "Features"}
              </a>
              <button
                onClick={onExplore}
                className="hover:text-[#0B3C83] rounded-md px-3 py-1 transition-all duration-200 text-left cursor-pointer font-bold"
              >
                {isHindi ? "रिपोर्ट्स" : "Reports"}
              </button>
              <a
                href="#features"
                className="hover:text-[#0B3C83] rounded-md px-3 py-1 transition-all duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {isHindi ? "दिशा-निर्देश" : "Guidelines"}
              </a>
              <a
                href="#contact-us"
                className="hover:text-[#0B3C83] rounded-md px-3 py-1 transition-all duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contact-us")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {isHindi ? "संपर्क करें" : "Contact Us"}
              </a>
            </nav>

            {/* Right side login button styled exactly like the uploaded image */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsSignInModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#0B3C83] hover:bg-[#093069] text-white rounded-[6px] text-xs sm:text-sm font-bold font-sans tracking-wide transition-colors cursor-pointer shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>{isHindi ? "लॉगिन" : "Login"}</span>
              </button>
            </div>

          </div>
        </header>
      </div>

      {/* Official Government Ticker Marquee */}
      <div className={`border-b py-2 px-4 sm:px-8 text-xs sm:text-sm flex items-center gap-3 ${
        isHighContrast ? "bg-[#051120] border-amber-500/30 text-amber-200" : "bg-[#0F4C81]/5 border-[#D9E2EC] text-[#1E293B]"
      }`}>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#0B3C83] text-white font-bold text-xs uppercase rounded shrink-0 shadow-2xs">
          <BellRing className="w-3.5 h-3.5 text-amber-300" /> {isHindi ? "परिपत्र" : "Circular"}
        </div>
        <div className="truncate font-medium flex-1">
          <span className="font-bold text-[#0B3C83] mr-1">
            {isHindi ? "वित्तीय वर्ष 2025-26 निर्देश:" : "FY 2025-26 Guidelines:"}
          </span>
          {isHindi
            ? "संशोधित सांख्यिकी मंत्रालय किश्त जारी करने एवं अनिवार्य जियोटैगिंग दिशा-निर्देश (v4.2) सभी 543 संसदीय क्षेत्रों में लागू हैं।"
            : "Revised MoSPI Tranche Release & Mandatory Geotagging Guidelines (v4.2) are active across all 543 Parliamentary Constituencies."}
        </div>
        <a
          href="#features"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#0B3C83] hover:underline shrink-0"
        >
          <span>{isHindi ? "डाउनलोड (PDF)" : "Download PDF"}</span>
          <Download className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Hero Header Section matching the image perfectly */}
      <section 
        className="relative min-h-[460px] lg:min-h-[500px] flex items-center py-12 px-4 sm:px-8 bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.99) 0%, rgba(255, 255, 255, 0.95) 45%, rgba(255, 255, 255, 0.6) 70%, rgba(255, 255, 255, 0.1) 100%), url(${portalHeroImg})` 
        }}
      >
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Column: Headline, Tricolor strip and Actions */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5.5xl font-extrabold text-[#0B3C83] tracking-tight leading-[1.12]">
              {isHindi ? "पारदर्शी सांसद निधि कार्यान्वयन के लिए एआई-संचालित निगरानी" : "AI-Powered Monitoring for Transparent MPLADS Implementation"}
            </h1>
            
            {/* Orange-White-Green Tricolor Accent Underline strip */}
            <div className="flex h-[4px] w-40 rounded-full overflow-hidden">
              <div className="w-1/3 bg-[#FF9933]" />
              <div className="w-1/3 bg-white border-y border-slate-200" />
              <div className="w-1/3 bg-[#138808]" />
            </div>

            <p className="text-sm sm:text-base md:text-lg text-slate-600 font-medium max-w-xl leading-relaxed">
              {isHindi 
                ? "उन्नत एआई विश्लेषण और डेटा-संचालित अंतर्दृष्टि का उपयोग करके सांसद निधि परियोजनाओं में विसंगतियों का पता लगाएं, धोखाधड़ी को रोकें और दक्षता में सुधार करें।" 
                : "Detect anomalies, prevent fraud, and improve efficiency in MPLADS projects using advanced AI analytics and data-driven insights."}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onExplore}
                className="px-6 py-3 bg-[#0B3C83] hover:bg-[#093069] text-white font-bold text-sm sm:text-base rounded-[6px] shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Database className="w-4 h-4 text-amber-300" />
                <span>{isHindi ? "डैशबोर्ड का अन्वेषण करें" : "Explore Dashboard"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("features");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3 bg-white hover:bg-slate-50 text-[#0B3C83] border border-slate-300 font-bold text-sm sm:text-base rounded-[6px] shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Info className="w-4 h-4" />
                <span>{isHindi ? "और जानें" : "Learn More"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Floating glassmorphic card matching image exactly */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-[#0F2D59]/90 border border-white/10 rounded-xl p-6 sm:p-7 text-white space-y-6 shadow-xl">
              {/* Feature 1 */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center shrink-0 bg-white/5">
                  <Shield className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-white">
                    {isHindi ? "स्मार्ट विसंगति जांच" : "Smart Anomaly Detection"}
                  </h4>
                  <p className="text-xs text-blue-100/80 mt-1 leading-relaxed">
                    {isHindi ? "एआई असामान्य पैटर्न और संदिग्ध गतिविधियों का पता लगाता है।" : "AI detects unusual patterns and suspicious activities."}
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4 items-start border-t border-white/5 pt-4">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center shrink-0 bg-white/5">
                  <BarChart3 className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-white">
                    {isHindi ? "वास्तविक समय निगरानी" : "Real-time Monitoring"}
                  </h4>
                  <p className="text-xs text-blue-100/80 mt-1 leading-relaxed">
                    {isHindi ? "वास्तविक समय में परियोजना प्रगति, निधि उपयोग और देरी को ट्रैक करें।" : "Track project progress, fund utilization and delays in real-time."}
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-4 items-start border-t border-white/5 pt-4">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center shrink-0 bg-white/5">
                  <TrendingUp className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-white">
                    {isHindi ? "डेटा-संचालित अंतर्दृष्टि" : "Data-Driven Insights"}
                  </h4>
                  <p className="text-xs text-blue-100/80 mt-1 leading-relaxed">
                    {isHindi ? "पूर्वानुमानित विश्लेषण और रिपोर्ट के साथ सूचित निर्णय लें।" : "Make informed decisions with predictive analytics and reports."}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Beautiful continuous GIGW metric banner strip below the hero image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-10 relative z-20 mb-12">
        <div className="bg-[#0B3C83] rounded-xl text-white py-6 px-4 shadow-xl border border-[#0B3C83]/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10 text-center">
            
            {/* Metric 1 */}
            <div className="flex flex-col items-center justify-center px-4 space-y-1">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-1 shadow-sm">
                <Landmark className="w-5 h-5 text-[#0B3C83]" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white">₹ 4,851 Cr</div>
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-100">
                {isHindi ? "कुल जारी राशि" : "Total Funds Released"}
              </div>
              <div className="text-[9px] text-blue-200/80 font-medium">({isHindi ? "सभी राज्य" : "All States"})</div>
            </div>
            
            {/* Metric 2 */}
            <div className="flex flex-col items-center justify-center px-4 pt-4 md:pt-0 space-y-1">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-1 shadow-sm">
                <FileText className="w-5 h-5 text-[#0B3C83]" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white">1,24,578</div>
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-100">
                {isHindi ? "कुल स्वीकृत कार्य" : "Total Works Approved"}
              </div>
              <div className="text-[9px] text-blue-200/80 font-medium">({isHindi ? "सभी राज्य" : "All States"})</div>
            </div>

            {/* Metric 3 */}
            <div className="flex flex-col items-center justify-center px-4 pt-4 md:pt-0 space-y-1">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-1 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-[#0B3C83]" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white">92,345</div>
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-100">
                {isHindi ? "कार्य पूर्ण" : "Works Completed"}
              </div>
              <div className="text-[9px] text-blue-200/80 font-medium">({isHindi ? "सभी राज्य" : "All States"})</div>
            </div>

            {/* Metric 4 */}
            <div className="flex flex-col items-center justify-center px-4 pt-4 md:pt-0 space-y-1">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-1 shadow-sm">
                <AlertTriangle className="w-5 h-5 text-[#0B3C83]" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white">1,280</div>
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-100">
                {isHindi ? "विसंगतियां पाईं" : "Anomalies Detected"}
              </div>
              <div className="text-[9px] text-blue-200/80 font-medium">({isHindi ? "इस महीने" : "This Month"})</div>
            </div>

            {/* Metric 5 */}
            <div className="flex flex-col items-center justify-center px-4 pt-4 md:pt-0 space-y-1">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-1 shadow-sm">
                <TrendingUp className="w-5 h-5 text-[#0B3C83]" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white">76 %</div>
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-100">
                {isHindi ? "औसत उपयोग दर" : "Average Utilization"}
              </div>
              <div className="text-[9px] text-blue-200/80 font-medium">({isHindi ? "सभी राज्य" : "All States"})</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section matching the image perfectly */}
      <section id="features" className="scroll-mt-32 max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 inline-block relative pb-2">
            {isHindi ? "प्रमुख विशेषताएं" : "Key Features"}
            <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0B3C83]" />
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Anomaly Detection */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5 hover:shadow-md transition-all">
            <div className="space-y-3.5">
              <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-[#0B3C83]">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {isHindi ? "विसंगति जांच" : "Anomaly Detection"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
                {isHindi 
                  ? "एआई मॉडल फंड उपयोग, परियोजना लागत, देरी और अन्य विसंगतियों की पहचान करते हैं।" 
                  : "AI models identify irregularities in fund utilization, project costs, delays and more."}
              </p>
            </div>
            <button
              onClick={onExplore}
              className="text-xs font-bold text-[#0B3C83] hover:underline flex items-center gap-1 cursor-pointer pt-2 self-start"
            >
              <span>{isHindi ? "और पढ़ें" : "Read More"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Fraud Prevention */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5 hover:shadow-md transition-all">
            <div className="space-y-3.5">
              <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-[#0B3C83]">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {isHindi ? "धोखाधड़ी रोकथाम" : "Fraud Prevention"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
                {isHindi 
                  ? "दोहरे काम, नकली विक्रेताओं, बढ़ी हुई लागत और अन्य संदिग्ध पैटर्न का स्वतः पता लगाएं।" 
                  : "Detect duplicate works, fake vendors, inflated costs and other suspicious patterns."}
              </p>
            </div>
            <button
              onClick={() => onSelectRole("Ministry")}
              className="text-xs font-bold text-[#0B3C83] hover:underline flex items-center gap-1 cursor-pointer pt-2 self-start"
            >
              <span>{isHindi ? "और पढ़ें" : "Read More"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Performance Insights */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5 hover:shadow-md transition-all">
            <div className="space-y-3.5">
              <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-[#0B3C83]">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {isHindi ? "प्रदर्शन अंतर्दृष्टि" : "Performance Insights"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
                {isHindi 
                  ? "जिला, राज्य और राष्ट्रीय स्तर के प्रदर्शन की निगरानी के लिए विजुअल डैशबोर्ड और विस्तृत रिपोर्ट।" 
                  : "Visual dashboards and reports to monitor district, state and national performance."}
              </p>
            </div>
            <button
              onClick={onExplore}
              className="text-xs font-bold text-[#0B3C83] hover:underline flex items-center gap-1 cursor-pointer pt-2 self-start"
            >
              <span>{isHindi ? "और पढ़ें" : "Read More"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: Real-time Alerts */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5 hover:shadow-md transition-all">
            <div className="space-y-3.5">
              <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-[#0B3C83]">
                <BellRing className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {isHindi ? "वास्तविक समय अलर्ट" : "Real-time Alerts"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
                {isHindi 
                  ? "परियोजना में देरी, बजट अधिकता और अन्य महत्वपूर्ण मुद्दों के लिए तत्काल अलर्ट प्राप्त करें।" 
                  : "Get instant alerts for delays, budget overruns, and other critical issues."}
              </p>
            </div>
            <button
              onClick={onExplore}
              className="text-xs font-bold text-[#0B3C83] hover:underline flex items-center gap-1 cursor-pointer pt-2 self-start"
            >
              <span>{isHindi ? "और पढ़ें" : "Read More"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Latest Update Bar styled exactly like the uploaded GIGW screen */}
        <div className="bg-[#E9F0FA] border border-[#CBDDF2] rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#0B3C83] mt-8 shadow-2xs">
          <div className="flex items-center gap-3 w-full">
            <div className="w-9 h-9 rounded-full bg-[#D4E4F7] flex items-center justify-center text-[#0B3C83] shrink-0">
              <Megaphone className="w-5 h-5" />
            </div>
            <div className="font-sans font-medium text-xs sm:text-sm leading-relaxed text-slate-700">
              <span className="font-bold text-[#0B3C83] mr-1">{isHindi ? "नवीनतम अपडेट:" : "Latest Update:"}</span>
              {isHindi 
                ? "बेहतर पारदर्शिता और वास्तविक समय की अंतर्दृष्टि के लिए MPLADS eSAKSHI सार्वजनिक डैशबोर्ड को नया रूप दिया गया है।" 
                : "MPLADS eSAKSHI Public Dashboard has been revamped for better transparency and real-time insights."}
            </div>
          </div>
          <a 
            href="#features" 
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="font-bold text-xs sm:text-sm hover:underline shrink-0 text-[#0B3C83] whitespace-nowrap self-end sm:self-center"
          >
            {isHindi ? "और जानें →" : "Know More →"}
          </a>
        </div>
      </section>



      {/* Floating / Pop-Up SSO Sign-In Modal */}
      {isSignInModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-300 overflow-hidden space-y-0 relative my-8">
            
            {/* Top Saffron-White-Green Tricolor Strip */}
            <div className="flex h-2.5 w-full">
              <div className="w-1/3 bg-[#FF9933]" />
              <div className="w-1/3 bg-white" />
              <div className="w-1/3 bg-[#138808]" />
            </div>

            {/* Modal Header: State Seal & National SSO Branding */}
            <div className="bg-[#0B3C83] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Official Ashoka Emblem SVG element */}
                <StateEmblem size="sm" theme="gold" className="shrink-0 scale-110" />
                
                <div className="border-l border-white/20 pl-3">
                  <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider leading-none font-sans">
                    {isHindi ? "राष्ट्रीय सूचना विज्ञान केंद्र (NIC)" : "National Informatics Centre"}
                  </div>
                  <h3 className="text-lg font-bold tracking-tight mt-1 leading-tight font-serif" style={{ fontFamily: "Lora, Georgia, serif" }}>
                    {isHindi ? "राष्ट्रीय एकल साइन-ऑन (सत्यापित लॉगिन)" : "National Single Sign-On Gateway (Identity Verified)"}
                  </h3>
                  <p className="text-xs text-blue-200 mt-0.5 font-sans">
                    {isHindi ? "संसद सदस्य स्थानीय क्षेत्र विकास योजना (MPLADS)" : "Member of Parliament Local Area Development Scheme (MPLADS)"}
                  </p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setIsSignInModalOpen(false)}
                className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer shrink-0"
                aria-label="Close Login Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Two-Column Grid Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
              
              {/* Column 1: Credentials and Verification Inputs (Left, 7/12 width) */}
              <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
                
                {/* Verify Identity Header */}
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[11px] font-bold text-[#FF9933] uppercase tracking-wider block font-sans">
                    {isHindi ? "सुरक्षित पहचान सत्यापन" : "SECURE IDENTITY VERIFICATION"}
                  </span>
                  <h4 className="text-base font-bold text-slate-800 font-serif" style={{ fontFamily: "Lora, Georgia, serif" }}>
                    {isHindi ? "अपने अधिकृत क्रेडेंशियल्स दर्ज करें" : "Enter Authorized Gateway Credentials"}
                  </h4>
                </div>

                {/* Role Selection Grid */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-extrabold uppercase tracking-wide text-[#0B3C83] font-sans">
                      {isHindi ? "शासकीय भूमिका का चयन करें:" : "Select Governance Role:"}
                    </label>
                    <span className="text-[9px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-sans">
                      {isHindi ? "अधिकृत पहुंच" : "Authorized Only"}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map((r) => {
                      const isSelected = selectedRole === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => handleRoleChange(r.id, r.defaultUser)}
                          className={`p-2.5 rounded-lg border text-left flex items-start gap-2.5 transition-all cursor-pointer relative overflow-hidden ${
                            isSelected
                              ? "bg-[#EBF3FC] border-[#0B3C83] text-[#0B3C83] font-bold ring-2 ring-[#0B3C83]/20"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute right-[-4px] top-[-4px] w-5 h-5 bg-[#0B3C83] text-white flex items-center justify-center rounded-bl-lg transform rotate-45">
                              <CheckCircle2 className="w-3 h-3 -rotate-45" />
                            </div>
                          )}
                          <div className={`p-1.5 rounded shrink-0 mt-0.5 ${isSelected ? "bg-[#0B3C83] text-white" : "bg-slate-100 text-slate-500"}`}>
                            <r.icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="text-xs truncate font-sans">
                            <div className={`font-bold truncate ${isSelected ? "text-[#0B3C83]" : "text-slate-800"}`}>
                              {r.title}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate mt-0.5">{r.badge}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Federated Login Tab Selector */}
                <div className="flex border-b border-slate-200 bg-slate-50 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => { setAuthMethod("govid"); setCaptchaError(""); }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer font-sans ${
                      authMethod === "govid"
                        ? "bg-white text-[#0B3C83] shadow-xs ring-1 ring-slate-100"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isHindi ? "पासवर्ड लॉगिन" : "GovID"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMethod("parichay"); setCaptchaError(""); }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer font-sans ${
                      authMethod === "parichay"
                        ? "bg-white text-[#0B3C83] shadow-xs ring-1 ring-slate-100"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span>{isHindi ? "परिचय SSO" : "Parichay SSO"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMethod("otp"); setCaptchaError(""); }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer font-sans ${
                      authMethod === "otp"
                        ? "bg-white text-[#0B3C83] shadow-xs ring-1 ring-slate-100"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{isHindi ? "ओटीपी" : "OTP Login"}</span>
                  </button>
                </div>

                {/* Main Credentials Forms with Captcha */}
                <form onSubmit={handleSignIn} className="space-y-4">
                  
                  {/* Credentials Inputs */}
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                    {authMethod === "govid" && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1 font-sans">
                            <User className="w-3.5 h-3.5 text-slate-500" />
                            <span>{isHindi ? "सरकारी ईमेल / उपयोगकर्ता आईडी" : "GovID / Official Email"}</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={govIdInput}
                            onChange={(e) => setGovIdInput(e.target.value)}
                            placeholder="username@nic.in"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium focus:ring-2 focus:ring-[#0B3C83] outline-none transition-all shadow-2xs font-sans"
                          />
                          <p className="text-[10px] text-slate-400 mt-1 font-sans">
                            {isHindi ? "केवल अधिकृत @nic.in या @gov.in ईमेल मान्य हैं" : "Only authorized @nic.in or @gov.in emails are permitted"}
                          </p>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1 font-sans">
                              <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                              <span>{isHindi ? "पासकोड कुंजी" : "Passcode Key"}</span>
                            </label>
                          </div>
                          <input
                            type="password"
                            required
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium focus:ring-2 focus:ring-[#0B3C83] outline-none transition-all shadow-2xs font-sans"
                          />
                        </div>
                      </>
                    )}

                    {authMethod === "parichay" && (
                      <>
                        <div className="bg-blue-50/50 border border-blue-100 p-2.5 rounded-lg text-slate-600 text-[11px] leading-relaxed flex gap-2 font-sans">
                          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            {isHindi 
                              ? "मेरी पहचान (National SSO) के माध्यम से लॉगिन करें। अपनी एकीकृत परिकल्पना विवरण दर्ज करें।" 
                              : "Sign in with MeriPehchan National Single Sign-On (SSO). Enter your centralized federated account details."}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1 font-sans">
                            <User className="w-3.5 h-3.5 text-slate-500" />
                            <span>{isHindi ? "मेरी पहचान उपयोगकर्ता आईडी" : "Parichay ID / Mobile"}</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={govIdInput}
                            onChange={(e) => setGovIdInput(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium focus:ring-2 focus:ring-[#0B3C83] outline-none transition-all shadow-2xs font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1 font-sans">
                            <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                            <span>{isHindi ? "पासवर्ड" : "Password"}</span>
                          </label>
                          <input
                            type="password"
                            required
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium focus:ring-2 focus:ring-[#0B3C83] outline-none transition-all shadow-2xs font-sans"
                          />
                        </div>
                      </>
                    )}

                    {authMethod === "otp" && (
                      <>
                        <div className="bg-[#E9F0FA] border border-[#CBDDF2] p-2.5 rounded-lg text-[#0B3C83] text-[11px] leading-relaxed flex gap-2 font-sans">
                          <Smartphone className="w-4 h-4 text-[#0B3C83] shrink-0 mt-0.5" />
                          <div>
                            {isHindi 
                              ? "आपके पंजीकृत मोबाइल नंबर पर सुरक्षित एक-बारीय पिन (OTP) भेजा जाएगा।" 
                              : "A secure One-Time Password will be sent to the registered mobile number synced with your NIC credentials."}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1 font-sans">
                            <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                            <span>{isHindi ? "पंजीकृत मोबाइल नंबर" : "Registered Mobile Number"}</span>
                          </label>
                          <div className="flex gap-2">
                            <div className="bg-slate-200 border border-slate-300 rounded-md px-2.5 py-2 text-xs font-bold text-slate-600 flex items-center justify-center shrink-0 font-sans font-sans">
                              +91
                            </div>
                            <input
                              type="tel"
                              required
                              defaultValue="9876543210"
                              className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium focus:ring-2 focus:ring-[#0B3C83] outline-none transition-all shadow-2xs font-sans font-sans"
                            />
                            <button
                              type="button"
                              onClick={() => alert(isHindi ? "सुरक्षित ओटीपी पंजीकृत मोबाइल पर भेज दिया गया है!" : "Secure OTP sent to the registered mobile number!")}
                              className="px-3 bg-slate-200 hover:bg-slate-300 border border-slate-300 rounded-md text-xs font-bold text-slate-700 transition-all cursor-pointer font-sans"
                            >
                              {isHindi ? "ओटीपी भेजें" : "Send OTP"}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1 font-sans">
                            {isHindi ? "6-अंकीय ओटीपी दर्ज करें" : "Enter 6-Digit One-Time Password"}
                          </label>
                          <input
                            type="text"
                            maxLength={6}
                            required
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-medium focus:ring-2 focus:ring-[#0B3C83] outline-none transition-all shadow-2xs text-center font-mono tracking-widest text-lg"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Security Verification: CAPTCHA */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1 font-sans">
                      <Shield className="w-3.5 h-3.5 text-[#0B3C83]" />
                      <span>{isHindi ? "सुरक्षा सत्यापन (कैप्चा कोड दर्ज करें)" : "Security Verification (Enter CAPTCHA)"}</span>
                    </label>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      {/* Captcha Generation graphic Box */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 select-none border-2 border-dashed border-slate-300 font-mono text-xl font-extrabold tracking-widest text-[#0B3C83] px-5 py-2.5 rounded-md flex items-center justify-center relative overflow-hidden shadow-inner h-[40px]">
                          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.05)_25%,rgba(0,0,0,0.05)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.05)_75%)] bg-[size:10px_10px]" />
                          <span className="relative z-10 italic scale-110 drop-shadow-[0_1.5px_1.5px_rgba(255,255,255,0.8)]">{captchaCode}</span>
                        </div>
                        <button
                          type="button"
                          onClick={regenerateCaptcha}
                          className="p-2.5 hover:bg-slate-100 border border-slate-200 rounded-md transition-all text-[#0B3C83] cursor-pointer shrink-0"
                          title="Refresh CAPTCHA"
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
                        placeholder={isHindi ? "कैप्चा कोड दर्ज करें" : "Enter Verification Code"}
                        className="flex-1 px-3 py-2.5 bg-white border border-slate-300 rounded-md text-xs font-mono font-bold focus:ring-2 focus:ring-[#0B3C83] outline-none transition-all shadow-2xs"
                      />
                    </div>
                    
                    {captchaError && (
                      <p className="text-xs text-red-600 font-bold mt-1.5 flex items-center gap-1 font-sans font-sans">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{captchaError}</span>
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 font-sans">
                    <button
                      type="button"
                      onClick={() => setIsSignInModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-md transition-colors cursor-pointer"
                    >
                      {isHindi ? "रद्द करें" : "Cancel"}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#0B3C83] hover:bg-[#093069] text-white text-xs font-bold rounded-md shadow-sm transition-all flex items-center gap-1.5 cursor-pointer hover:shadow-md"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-300" />
                      <span>{isHindi ? `${selectedRole} के रूप में प्रवेश करें` : `Sign In as ${selectedRole}`}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </form>
              </div>

              {/* Column 2: Instructional Guidance, Help Manual & Important Notices (Right, 5/12 width) */}
              <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-50/70 space-y-6">
                
                {/* Heading */}
                <div className="space-y-1 border-b border-slate-200 pb-3">
                  <span className="text-[10px] font-extrabold text-[#138808] uppercase tracking-wider block font-sans">
                    {isHindi ? "सहायता एवं निर्देश" : "INSTRUCTIONAL GUIDANCE"}
                  </span>
                  <h4 className="text-base font-bold text-[#0B3C83] font-serif" style={{ fontFamily: "Lora, Georgia, serif" }}>
                    {isHindi ? "महत्वपूर्ण हेल्प डेस्क लिंक्स" : "Official Manual & Support"}
                  </h4>
                </div>

                {/* Helpful Links styled in CPGRAMS & e-Filing Portal Style */}
                <div className="space-y-3">
                  <div className="p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 transition-all shadow-2xs">
                    <h5 className="text-xs font-extrabold text-[#0B3C83] uppercase tracking-wider mb-1 font-sans">
                      {isHindi ? "सहायता मैनुअल" : "Help Manual / User Guide"}
                    </h5>
                    <p className="text-[11px] text-slate-500 mb-2 leading-relaxed font-sans">
                      {isHindi ? "पोर्टल संचालन के लिए व्यापक उपयोगकर्ता मार्गदर्शिका (PDF)" : "Comprehensive instructions for district authorities, state nodals, and MPs."}
                    </p>
                    <a
                      href="#download-manual"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Help Manual PDF document compilation requested. Downloading from national cache...");
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF9933] hover:underline uppercase font-sans"
                    >
                      <Download className="w-3 h-3" />
                      <span>{isHindi ? "डाउनलोड (2.4 MB)" : "Download PDF User Guide"}</span>
                    </a>
                  </div>

                  {/* Forgot Password Link Section */}
                  <div className="p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 transition-all shadow-2xs">
                    <h5 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1 font-sans">
                      {isHindi ? "क्रेडेंशियल्स रिकवरी" : "Forgot Password / Reset Pin"}
                    </h5>
                    <p className="text-[11px] text-slate-500 mb-2 leading-relaxed font-sans font-sans">
                      {isHindi ? "पंजीकृत ईमेल या मोबाइल नंबर पर रीसेट लिंक प्राप्त करें" : "Sync-linked credential recovery portal via official NIC Active Directory."}
                    </p>
                    <a
                      href="#forgot-password"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(isHindi ? "क्रेडेंशियल रिकवरी के लिए पासवर्ड रीसेट ईमेल अधिकृत पते पर भेजा गया!" : "An Active Directory recovery link has been dispatched to your linked GovID email address.");
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0B3C83] hover:underline font-sans"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>{isHindi ? "पासवर्ड भूल गए / रीसेट करें" : "Recover Account Credentials"}</span>
                    </a>
                  </div>
                </div>

                {/* Statutory Notices Block */}
                <div className="space-y-3.5">
                  <div className="p-3.5 bg-amber-50/60 border-l-4 border-l-[#FF9933] rounded-r-lg space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 font-sans">
                      <Shield className="w-4 h-4 text-[#FF9933]" />
                      <span>{isHindi ? "सुरक्षा एवं अनुपालन सलाह" : "Security & GIGW Compliance"}</span>
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-1 leading-relaxed font-sans">
                      <li>{isHindi ? "यूआरएल में हमेशा 'https://' की जांच करें।" : "Ensure you verify URL authenticity before typing passwords."}</li>
                      <li>{isHindi ? "अपना गुप्त पासकोड या ओटीपी किसी के साथ साझा न करें।" : "Never share OTP, passwords, or security keys with anyone."}</li>
                      <li>{isHindi ? "सत्र पूर्ण होने पर हमेशा 'लॉग आउट' बटन दबाएं।" : "Force close session by clicking Log Out before leaving."}</li>
                    </ul>
                  </div>

                  <div className="p-3.5 bg-emerald-50/60 border-l-4 border-l-[#138808] rounded-r-lg space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 font-sans">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>{isHindi ? "डिजिटल सत्यापन सूचना" : "Citizen Identity Verification"}</span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed font-sans">
                      {isHindi 
                        ? "जीआईजीडब्ल्यू निर्देशों के अनुसार, सभी सार्वजनिक प्रतिक्रियाएं और शिकायतें राष्ट्रीय डेटा रजिस्ट्री के साथ ई-केवाईसी द्वारा सत्यापित की जाती हैं।" 
                        : "As required by GIGW Guidelines, grievance lodging or project tracking is open to verified common citizens without account login through the public Citizen Corner."}
                    </p>
                  </div>
                </div>

                {/* Audit and Legal Security Warning (NIC Stamp) */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-2 text-[9px] text-slate-400 font-semibold font-sans">
                  <span>NIC Gateway v3.12-secure</span>
                  <span>SSL/TLS 1.3 Certified</span>
                </div>

              </div>

            </div>

            {/* Audit & Legal Security Banner Footer */}
            <div className="bg-slate-900 text-slate-400 text-[10px] p-4 font-sans leading-relaxed border-t border-slate-800">
              <p className="text-center">
                {isHindi 
                  ? "यह एनआईसी (NIC) द्वारा सुरक्षित एक अधिकृत सरकारी प्रणाली है। सभी गतिविधियां मॉनिटर और रिकॉर्ड की जा रही हैं। किसी भी उल्लंघन पर आईटी अधिनियम, 2000 के तहत दंड लगाया जा सकता है।" 
                  : "WARNING: This is a secure computer system of the Government of India. All actions are logged and audited in accordance with statutory compliance guidelines. Unauthorized usage will be prosecuted under section 66 of the Information Technology Act."}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Official Government Footer */}
      <div id="contact-us">
        <GovFooter language={currentLang} />
      </div>
    </div>
  );
};
