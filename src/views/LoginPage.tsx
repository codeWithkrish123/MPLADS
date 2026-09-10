import React, { useState, useEffect } from "react";
import {
  Building2,
  Landmark,
  MapPin,
  Users,
  Lock,
  ArrowRight,
  RefreshCw,
  Download,
  KeyRound,
  ShieldAlert,
  CheckCircle2,
  X,
  Smartphone,
  Check,
  AlertCircle
} from "lucide-react";
import emblemOfIndia from "../assets/images/Emblem_of_India.svg";
import { UserRole, Language } from "../types";
import { useAuth } from "../context/AuthContext";

interface LoginPageProps {
  onLoginSuccess?: (role: UserRole) => void;
  onClose?: () => void;
  language?: Language;
  onToggleLanguage?: () => void;
}

type AuthMethod = "govid" | "otp";

interface RoleOption {
  id: UserRole;
  title: string;
  subtitle: string;
  scopeBadge: string;
  scopeType: "National" | "Constituency" | "District" | "Public";
  icon: React.ComponentType<{ className?: string }>;
  defaultEmail: string;
  defaultMobile: string;
}

const ROLES: RoleOption[] = [
  {
    id: "Ministry",
    title: "Ministry of Statistics & PI",
    subtitle: "National HQ",
    scopeBadge: "National Scope",
    scopeType: "National",
    icon: Building2,
    defaultEmail: "admin.mospi@nic.in",
    defaultMobile: "9876543210",
  },
  {
    id: "Member of Parliament",
    title: "Member of Parliament",
    subtitle: "Constituency",
    scopeBadge: "Constituency Scope",
    scopeType: "Constituency",
    icon: Landmark,
    defaultEmail: "mp.constituency@sansad.nic.in",
    defaultMobile: "9876543211",
  },
  {
    id: "District Authority",
    title: "District Authority / DM",
    subtitle: "District Cell",
    scopeBadge: "District Scope",
    scopeType: "District",
    icon: MapPin,
    defaultEmail: "dm.ghaziabad@nic.in",
    defaultMobile: "9876543212",
  },
  {
    id: "Users",
    title: "Public Citizen",
    subtitle: "Citizen Portal & Public Access",
    scopeBadge: "Public Scope",
    scopeType: "Public",
    icon: Users,
    defaultEmail: "citizen.public@nic.in",
    defaultMobile: "9876543213",
  },
];

const SAMPLE_CAPTCHAS = ["7P9xE", "K4m8Q", "9R2xW", "3B7tZ", "H5v8Y", "6M2pN"];

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onClose,
  language = "en",
  onToggleLanguage,
}) => {
  const { login } = useAuth();

  // Active Role state (default: Ministry)
  const [selectedRoleId, setSelectedRoleId] = useState<UserRole>("Ministry");

  // Authentication method: only "govid" or "otp"
  const [authMethod, setAuthMethod] = useState<AuthMethod>("govid");

  // Form Fields
  const [email, setEmail] = useState<string>("admin.mospi@nic.in");
  const [password, setPassword] = useState<string>("password123");
  const [mobile, setMobile] = useState<string>("9876543210");
  const [otpCode, setOtpCode] = useState<string>("123456");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpTimer, setOtpTimer] = useState<number>(0);

  // CAPTCHA State
  const [captchaText, setCaptchaText] = useState<string>("7P9xE");
  const [captchaInput, setCaptchaInput] = useState<string>("7P9xE"); // pre-filled for smooth testing

  // UI status
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoNotice, setInfoNotice] = useState<string | null>(null);

  // Refresh CAPTCHA
  const handleRefreshCaptcha = () => {
    const nextList = SAMPLE_CAPTCHAS.filter((c) => c !== captchaText);
    const randomCode = nextList[Math.floor(Math.random() * nextList.length)] || "7P9xE";
    setCaptchaText(randomCode);
    setCaptchaInput(randomCode);
    setErrorMessage(null);
  };

  // When role changes, prefill appropriate credentials
  const handleSelectRole = (role: RoleOption) => {
    setSelectedRoleId(role.id);
    setEmail(role.defaultEmail);
    setMobile(role.defaultMobile);
    setPassword("password123");
    setErrorMessage(null);
  };

  // OTP Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtpTimer(45);
    setOtpCode("123456");
    setInfoNotice("Mock OTP generated: 123456 (valid for 10 minutes)");
    setTimeout(() => setInfoNotice(null), 5000);
  };

  // Handle Form Submission with Mock Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate CAPTCHA
    if (!captchaInput.trim()) {
      setErrorMessage("Please enter the security verification code.");
      return;
    }
    if (captchaInput.trim().toLowerCase() !== captchaText.toLowerCase()) {
      setErrorMessage("Incorrect verification code. Please retry or click reload.");
      return;
    }

    // Validate OTP if on OTP tab
    if (authMethod === "otp" && (!otpCode.trim() || otpCode.length < 4)) {
      setErrorMessage("Please enter the 6-digit OTP sent to your registered mobile.");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedRole = ROLES.find((r) => r.id === selectedRoleId) || ROLES[0];
      const loginEmail = authMethod === "govid" ? email : `${mobile}@nic.in`;

      // Call AuthContext login with role
      const success = await login(loginEmail, password || "password123", selectedRole.id);

      if (success) {
        // Also persist role explicitly for immediate UI updates
        localStorage.setItem("mplads_user_role", selectedRole.id);

        if (onLoginSuccess) {
          onLoginSuccess(selectedRole.id);
        }
      } else {
        setErrorMessage("Authentication failed. Please verify your credentials.");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setErrorMessage(err.message || "An unexpected error occurred during login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentRole = ROLES.find((r) => r.id === selectedRoleId) || ROLES[0];

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/80 font-sans text-slate-800 animate-in fade-in zoom-in-95 duration-200">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP TRICOLOR ACCENT STRIP (Saffron, White, Green)
      ───────────────────────────────────────────────────────────── */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* ─────────────────────────────────────────────────────────────
          2. AUTHORITATIVE DEEP NAVY E-GOV HEADER BAR WITH ASHOKA EMBLEM
      ───────────────────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-r from-[#0A2740] via-[#0F2A6B] to-[#1B3A7A] text-white px-6 py-4.5 flex items-center justify-between border-b border-[#1B3A7A]/60 shadow-md">
        <div className="flex items-center gap-4">
          {/* Ashoka Lion Emblem */}
          <div className="flex flex-col items-center justify-center shrink-0 p-1.5 bg-white/10 rounded-xl border border-white/15 backdrop-blur-xs shadow-inner">
            <img
              src={emblemOfIndia}
              alt="National Emblem of India"
              className="h-11 w-auto object-contain filter brightness-0 invert drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
            />
            <span className="text-[8px] font-extrabold tracking-widest text-[#FF9933] mt-0.5 uppercase" style={{ color: "#FF9933" }}>
              सत्यमेव जयते
            </span>
          </div>

          {/* Institutional Titles with Explicit White Text */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#FF9933]/20 border border-[#FF9933]/40 text-[#FF9933] text-[10px] font-extrabold rounded font-mono uppercase tracking-wider">
                NATIONAL INFORMATICS CENTRE
              </span>
              <span className="text-[11px] !text-slate-300 font-mono font-medium" style={{ color: "#CBD5E1" }}>
                Govt. of India
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-black !text-white tracking-tight leading-tight mt-1" style={{ color: "#FFFFFF" }}>
              National Single Sign-On Gateway (Identity Verified)
            </h1>
            <p className="text-xs md:text-sm !text-blue-100 font-medium mt-0.5" style={{ color: "#DBEAFE" }}>
              Member of Parliament Local Area Development Scheme (e-SAKSHI / MPLADS)
            </p>
          </div>
        </div>

        {/* Header Right: Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 transition-all border border-white/20 focus:outline-none cursor-pointer shadow-2xs"
            title="Close Gateway"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white" style={{ color: "#FFFFFF" }} />
          </button>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN BODY — 2-COLUMN SPLIT LAYOUT
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* ── LEFT COLUMN: SECURE AUTHENTICATION (7 Cols) ── */}
        <div className="lg:col-span-7 p-6 sm:p-7 md:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Eyebrow & Main Title */}
            <div>
              <span className="text-[11px] font-bold tracking-wider text-[#EA580C] uppercase block">
                Secure Identity Verification
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5 tracking-tight">
                Enter Authorized Gateway Credentials
              </h2>
            </div>

            {/* Role Selection Header */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Select Governance Role:
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-amber-50 text-amber-800 border border-amber-300 uppercase">
                Authorized Only
              </span>
            </div>

            {/* 4 Roles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ROLES.map((role) => {
                const IconComponent = role.icon;
                const isSelected = selectedRoleId === role.id;

                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleSelectRole(role)}
                    className={`relative p-3 rounded-xl text-left transition-all border flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? "border-[#2563EB] bg-[#EFF6FF] shadow-xs ring-1 ring-[#2563EB]"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70"
                    }`}
                  >
                    {/* Role Icon */}
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-[#1E3A8A] text-white shadow-xs"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Role Title & Subtitle */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-bold leading-snug truncate ${
                          isSelected ? "text-[#1E3A8A]" : "text-slate-800"
                        }`}
                      >
                        {role.title}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        {role.subtitle}
                      </p>
                    </div>

                    {/* Selected Checkmark Badge in Top Right */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-[#2563EB] text-white rounded-full flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Login Method Tab Selector: GovID vs OTP Login */}
            <div className="bg-slate-100/90 p-1 rounded-xl flex items-center gap-1 border border-slate-200/70 mt-1">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod("govid");
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  authMethod === "govid"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200/60 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-slate-600" />
                <span>GovID</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMethod("otp");
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  authMethod === "otp"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200/60 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-slate-600" />
                <span>OTP Login</span>
              </button>
            </div>

            {/* Credential Fields Box */}
            <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-xl p-4 space-y-3.5">
              {authMethod === "govid" ? (
                <>
                  {/* Field 1: GovID / Official Email */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                      <span>👤</span>
                      <span>GovID / Official Email</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin.mospi@nic.in"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium"
                    />
                    <p className="text-[11px] text-slate-500 mt-1 font-medium italic">
                      Only authorized @nic.in or @gov.in emails are permitted
                    </p>
                  </div>

                  {/* Field 2: Passcode Key */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                      <span>🔑</span>
                      <span>Passcode Key</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all tracking-widest"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* OTP Mode: Mobile Number */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                      <span>📱</span>
                      <span>Registered Official Mobile</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2 text-xs font-bold text-slate-500">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="9876543210"
                          className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 font-medium"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpTimer > 0}
                        className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                      >
                        {otpTimer > 0 ? `Resend (${otpTimer}s)` : "Get OTP"}
                      </button>
                    </div>
                  </div>

                  {/* OTP Code Input */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                      <span>🔑</span>
                      <span>One-Time Password (OTP)</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter 6-digit OTP (e.g. 123456)"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 tracking-wider text-center font-bold"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      {otpSent
                        ? "OTP sent to your registered official mobile (Mock: 123456)"
                        : "Click 'Get OTP' to receive verification code"}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* CAPTCHA Verification */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                <span>🛡️</span>
                <span>Security Verification (Enter CAPTCHA)</span>
              </label>

              <div className="flex items-center gap-2">
                {/* Visual Distorted CAPTCHA Box */}
                <div
                  aria-label={`CAPTCHA code: ${captchaText}`}
                  className="px-4 py-2 bg-gradient-to-r from-blue-50 via-slate-100 to-indigo-50 border border-slate-300 rounded-lg select-none font-mono text-lg tracking-[0.35em] font-black italic text-slate-800 flex items-center justify-center relative overflow-hidden shadow-2xs shrink-0"
                  style={{ minWidth: "120px" }}
                >
                  {/* Subtle diagonal strike line for realism */}
                  <div className="absolute inset-0 pointer-events-none opacity-25 bg-[repeating-linear-gradient(45deg,#000,#000_1px,transparent_1px,transparent_6px)]" />
                  <span className="relative z-10">{captchaText}</span>
                </div>

                {/* Reload CAPTCHA button */}
                <button
                  type="button"
                  onClick={handleRefreshCaptcha}
                  className="p-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-600 transition-colors shrink-0 cursor-pointer"
                  title="Refresh CAPTCHA"
                  aria-label="Refresh CAPTCHA"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                {/* Verification Code Input */}
                <input
                  type="text"
                  required
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="Enter Verification Code"
                  className="flex-1 min-w-0 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Error or Notice Alert */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-r-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {infoNotice && (
              <div className="p-2.5 bg-blue-50 border-l-4 border-blue-500 text-blue-700 text-xs rounded-r-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-500" />
                <span>{infoNotice}</span>
              </div>
            )}

            {/* Action Buttons: Cancel and Dynamic Sign In Button */}
            <div className="flex items-center justify-end gap-3 pt-3">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#0B3B7B] hover:bg-[#082d61] text-white text-xs font-bold rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>
                  {isSubmitting
                    ? "Verifying Credentials..."
                    : selectedRoleId === "Users"
                    ? "Proceed as Citizen →"
                    : selectedRoleId === "Member of Parliament"
                    ? "Sign In as Member of Parliament →"
                    : selectedRoleId === "District Authority"
                    ? "Sign In as District Authority →"
                    : "Sign In as Ministry →"}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* ── RIGHT COLUMN: INSTRUCTIONAL GUIDANCE & SUPPORT (5 Cols) ── */}
        <div className="lg:col-span-5 p-6 sm:p-7 md:p-8 bg-[#FAFCFF] flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header: Instructional Guidance */}
            <div>
              <span className="text-[11px] font-bold tracking-wider text-[#15803D] uppercase block">
                Instructional Guidance
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 tracking-tight">
                Official Manual & Support
              </h3>
            </div>

            {/* Item 1: Help Manual / User Guide */}
            <div className="pt-1">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Help Manual / User Guide
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Comprehensive instructions for district authorities, state nodals, and MPs.
              </p>
              <button
                type="button"
                onClick={() => {
                  setInfoNotice("MPLADS Official Manual v4.2 downloaded to your browser.");
                  setTimeout(() => setInfoNotice(null), 4000);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97706] hover:text-[#B45309] hover:underline mt-2 cursor-pointer uppercase tracking-wide"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF User Guide</span>
              </button>
            </div>

            {/* Item 2: Forgot Password / Reset PIN */}
            <div className="pt-2 border-t border-slate-200/70">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Forgot Password / Reset PIN
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Sync-linked credential recovery portal via official NIC Active Directory.
              </p>
              <button
                type="button"
                onClick={() => {
                  setInfoNotice("Password recovery link dispatched to official NIC email.");
                  setTimeout(() => setInfoNotice(null), 4000);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] hover:underline mt-2 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Recover Account Credentials</span>
              </button>
            </div>

            {/* Notice Card 1: Security & GIGW Compliance (Amber border) */}
            <div className="border-l-4 border-amber-500 bg-amber-50/50 rounded-r-lg p-3.5 my-2">
              <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs mb-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Security & GIGW Compliance</span>
              </div>
              <ul className="text-[11px] text-slate-700 space-y-1 pl-4 list-disc marker:text-amber-500">
                <li>Ensure you verify URL authenticity before typing passwords.</li>
                <li>Never share OTP, passwords, or security keys with anyone.</li>
                <li>Force close session by clicking Log Out before leaving.</li>
              </ul>
            </div>

            {/* Notice Card 2: Citizen Identity Verification (Green border) */}
            <div className="border-l-4 border-emerald-600 bg-emerald-50/50 rounded-r-lg p-3.5 my-2">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Citizen Identity Verification</span>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                As required by GIGW Guidelines, grievance lodging or project tracking is open to
                verified common citizens without account login through the public Citizen Corner.
              </p>
            </div>
          </div>

          {/* Bottom Right: Version & SSL Badges */}
          <div className="pt-4 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>NIC Gateway v3.12-secure</span>
            <span>SSL/TLS 1.3 Certified</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. BOTTOM STATUTORY WARNING BANNER
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#0B1120] text-slate-400 text-center py-2.5 px-6 border-t border-slate-800">
        <p className="text-[10px] md:text-[11px] font-normal leading-relaxed">
          WARNING: This is a secure computer system of the Government of India. All actions are
          logged and audited in accordance with statutory compliance guidelines. Unauthorized usage
          will be prosecuted under section 66 of the Information Technology Act.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
