import React, { useState } from "react";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Shield,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Phone,
  ExternalLink,
} from "lucide-react";
import { Language } from "../types";
import { getTranslation } from "../data/translations";
import { StateEmblem } from "../components/gov/StateEmblem";
import { GovFooter } from "../components/layout/GovFooter";

interface LoginPageProps {
  onLoginSuccess: (role: string) => void;
  language?: Language;
  onToggleLanguage?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  language = "en",
  onToggleLanguage,
}) => {
  const isHindi = language === "hi";
  const t = getTranslation(language as Language);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Ministry");
  const [useOTP, setUseOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { id: "Ministry", label: isHindi ? "सांख्यिकी मंत्रालय" : "Ministry of Statistics", icon: Shield },
    { id: "State", label: isHindi ? "राज्य नोडल अधिकारी" : "State Nodal Authority", icon: Shield },
    { id: "District", label: isHindi ? "जिला अधिकारी" : "District Authority", icon: Shield },
    { id: "MP", label: isHindi ? "संसद सदस्य" : "Member of Parliament", icon: Shield },
    { id: "Citizen", label: isHindi ? "आम नागरिक" : "Citizen", icon: Shield },
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!useOTP) {
      if (!email.trim()) {
        newErrors.email = isHindi ? "ईमेल आवश्यक है" : "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = isHindi ? "वैध ईमेल दर्ज करें" : "Please enter a valid email";
      }

      if (!password) {
        newErrors.password = isHindi ? "पासवर्ड आवश्यक है" : "Password is required";
      } else if (password.length < 6) {
        newErrors.password = isHindi ? "पासवर्ड कम से कम 6 वर्ण हो" : "Password must be at least 6 characters";
      }
    } else {
      if (!otp.trim()) {
        newErrors.otp = isHindi ? "OTP आवश्यक है" : "OTP is required";
      } else if (otp.length !== 6) {
        newErrors.otp = isHindi ? "OTP 6 अंकों का होना चाहिए" : "OTP must be 6 digits";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(selectedRole);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Tricolor Stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808]" />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Emblem & Branding */}
            <div className="flex items-center gap-4">
              <StateEmblem size="sm" theme="gold" />
              <div className="border-l border-slate-300 pl-4">
                <h1 className="text-lg font-bold text-slate-900 font-heading">
                  {isHindi ? "सांसद निधि" : "MPLADS"} <span className="text-amber-600">{isHindi ? "प्रहरी" : "SENTINEL"}</span>
                </h1>
                <p className="text-xs text-slate-600 mt-1">
                  {isHindi
                    ? "सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय"
                    : "Ministry of Statistics & Programme Implementation"}
                </p>
              </div>
            </div>

            {/* Right: Language & Help */}
            <div className="flex items-center gap-4">
              {onToggleLanguage && (
                <button
                  onClick={onToggleLanguage}
                  className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  {isHindi ? "English" : "हिन्दी"}
                </button>
              )}
              <a
                href="#help"
                className="text-slate-600 hover:text-slate-900 flex items-center gap-1 text-sm font-medium"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">{isHindi ? "सहायता" : "Help"}</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Branding & Information */}
          <div className="hidden md:block space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4 font-heading">
                {isHindi
                  ? "सांसद निधि पारदर्शिता पोर्टल में आपका स्वागत है"
                  : "Welcome to MPLADS Transparency Portal"}
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                {isHindi
                  ? "सभी 543 संसद क्षेत्रों में सार्वजनिक विकास कार्यों की वास्तविक समय निगरानी और पारदर्शिता।"
                  : "Real-time monitoring and transparency of public development works across all 543 parliamentary constituencies."}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                {
                  title: isHindi ? "AI-संचालित निगरानी" : "AI-Powered Monitoring",
                  desc: isHindi ? "विसंगति पहचान और जोखिम विश्लेषण" : "Anomaly detection & risk analysis",
                },
                {
                  title: isHindi ? "वास्तविक समय डेटा" : "Real-time Data",
                  desc: isHindi ? "तात्कालिक प्रगति और खर्च ट्रैकिंग" : "Instant progress & expenditure tracking",
                },
                {
                  title: isHindi ? "नागरिक सुविधा" : "Citizen Portal",
                  desc: isHindi ? "जनता के लिए स्वतंत्र परामर्श और शिकायत निवारण" : "Free citizen guidance & grievance redressal",
                },
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                    <p className="text-sm text-slate-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* GIGW Compliance */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-900">
                  {isHindi ? "सरकार के लिए डिजिटल भारत अनुपालन" : "Digital India Compliant"}
                </p>
                <p className="text-xs text-blue-800 mt-1">
                  {isHindi
                    ? "सर्वोच्च सुरक्षा और डेटा गोपनीयता मानकों के साथ निर्मित।"
                    : "Built with highest security & data privacy standards."}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Login Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-2 font-heading">
              {isHindi ? "सुरक्षित प्रवेश" : "Secure Sign In"}
            </h3>
            <p className="text-slate-600 text-sm mb-8">
              {isHindi
                ? "अपने सरकारी क्रेडेंशियल के साथ लॉगिन करें"
                : "Sign in with your official credentials"}
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  {isHindi ? "भूमिका चुनें" : "Select Your Role"}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-3 rounded-lg border-2 transition-all text-sm font-medium text-left ${
                        selectedRole === role.id
                          ? "border-blue-600 bg-blue-50 text-blue-900"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span className="text-xs sm:text-sm">{role.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Authentication Method Toggle */}
              <div className="flex gap-4 bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setUseOTP(false)}
                  className={`flex-1 py-2 px-3 rounded-md font-medium text-sm transition-all ${
                    !useOTP
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-700 hover:text-slate-900"
                  }`}
                >
                  {isHindi ? "पासवर्ड" : "Password"}
                </button>
                <button
                  type="button"
                  onClick={() => setUseOTP(true)}
                  className={`flex-1 py-2 px-3 rounded-md font-medium text-sm transition-all ${
                    useOTP
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-700 hover:text-slate-900"
                  }`}
                >
                  OTP
                </button>
              </div>

              {/* Email/OTP Field */}
              {!useOTP ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      {isHindi ? "सरकारी ईमेल" : "Official Email"}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@mospi.gov.in"
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none transition-colors ${
                          errors.email
                            ? "border-red-500 bg-red-50"
                            : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      {isHindi ? "पासवर्ड" : "Password"}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-10 py-2.5 border rounded-lg outline-none transition-colors ${
                          errors.password
                            ? "border-red-500 bg-red-50"
                            : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.password}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    {isHindi ? "OTP दर्ज करें" : "Enter OTP"}
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-colors text-center text-2xl font-mono tracking-widest ${
                      errors.otp
                        ? "border-red-500 bg-red-50"
                        : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    }`}
                  />
                  {errors.otp && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.otp}
                    </p>
                  )}
                  <p className="text-xs text-slate-600 mt-2">
                    {isHindi
                      ? "OTP आपके पंजीकृत मोबाइल पर भेजा गया है"
                      : "OTP has been sent to your registered mobile"}
                  </p>
                </div>
              )}

              {/* Security Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-900">
                  {isHindi
                    ? "कभी भी अपने पासवर्ड या OTP किसी को साझा न करें। सत्र समाप्ति के बाद सेशन बंद करें।"
                    : "Never share your password or OTP with anyone. Always log out after your session."}
                </p>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                {isLoading
                  ? isHindi
                    ? "प्रवेश जारी है..."
                    : "Signing in..."
                  : isHindi
                  ? "सुरक्षित रूप से प्रवेश करें"
                  : "Sign In Securely"}
              </button>

              {/* Help Links */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-3 text-center">
                <a
                  href="#reset"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center gap-1"
                >
                  <HelpCircle className="w-4 h-4" />
                  {isHindi ? "पासवर्ड रीसेट" : "Reset Password"}
                </a>
                <a
                  href="tel:1800111992"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center gap-1"
                >
                  <Phone className="w-4 h-4" />
                  {isHindi ? "सहायता लाइन" : "Help: 1800-11-1992"}
                </a>
              </div>
            </form>

            {/* Additional Info */}
            <div className="mt-8 p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-2 font-semibold">
                {isHindi ? "पहली बार यहां? " : "New here? "}
                <a href="#register" className="text-blue-600 hover:text-blue-700 font-semibold">
                  {isHindi ? "पंजीकरण करें" : "Register now"}
                </a>
              </p>
              <p className="text-xs text-slate-500">
                {isHindi
                  ? "सरकारी कर्मचारियों के लिए: GoID SSO, Parichay, या OTP के साथ लॉगिन करें।"
                  : "For government staff: Login with GoID SSO, Parichay, or OTP."}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <GovFooter language={language as Language} />
    </div>
  );
};
