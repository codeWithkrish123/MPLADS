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
  RefreshCw,
  User,
  Building2,
} from "lucide-react";
import { Language } from "../types";
import { StateEmblem } from "../components/gov/StateEmblem";
import { SatyamevJayateLogo } from "../components/gov/SatyamevJayateLogo";
import { GovFooter } from "../components/layout/GovFooter";
import { useAuth } from "../context/AuthContext";

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
  const { login, isLoading: authLoading, error: authError, clearError } = useAuth();

  // Form State
  const [email, setEmail] = useState("admin.mospi@nic.in");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("ministry");
  const [captchaCode, setCaptchaCode] = useState("7P9xE");
  const [captchaInput, setCaptchaInput] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const roles = [
    { id: "ministry", label: isHindi ? "सांख्यिकी मंत्रालय" : "Ministry of Statistics & PI", icon: Building2, description: "National HQ" },
    { id: "mp", label: isHindi ? "संसद सदस्य" : "Member of Parliament", icon: User, description: "Constituency" },
    { id: "district", label: isHindi ? "जिला प्राधिकार" : "District Authority / DM", icon: Shield, description: "District Cell" },
    { id: "state_nodal", label: isHindi ? "राज्य नोडल अधिकारी" : "State Nodal Authority", icon: Shield, description: "State Level" },
    { id: "agency", label: isHindi ? "कार्यान्वयन एजेंसी" : "Implementing Agency", icon: Shield, description: "Implementing Agencies" },
  ];

  // Regenerate CAPTCHA
  const regenerateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput("");
    setErrors((prev) => ({ ...prev, captcha: "" }));
  };

  // Validate Form
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!email.trim()) {
      newErrors.email = isHindi ? "ईमेल आवश्यक है" : "Email is required";
    } else if (!email.match(/@(nic\.in|gov\.in)$/)) {
      newErrors.email = isHindi ? "केवल @nic.in या @gov.in ईमेल की अनुमति है" : "Only @nic.in or @gov.in emails allowed";
    }

    if (!password) {
      newErrors.password = isHindi ? "पासवर्ड आवश्यक है" : "Password is required";
    } else if (password.length < 6) {
      newErrors.password = isHindi ? "पासवर्ड कम से कम 6 वर्ण हो" : "Password must be at least 6 characters";
    }

    if (!captchaInput.trim()) {
      newErrors.captcha = isHindi ? "CAPTCHA आवश्यक है" : "CAPTCHA is required";
    } else if (captchaInput.toUpperCase() !== captchaCode) {
      newErrors.captcha = isHindi ? "CAPTCHA सही नहीं है" : "CAPTCHA is incorrect";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Login - Connected to Backend
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    clearError();

    try {
      console.log(`🔐 Attempting login with:`, { email, role: selectedRole });

      // Call backend login with selected role via AuthContext
      const success = await login(email, password, selectedRole);

      if (success) {
        console.log(`✅ Login successful for ${email} with role ${selectedRole}`);
        setLoginSuccess(true);
        setErrors({});

        // Clear form
        setCaptchaInput("");
        regenerateCaptcha();

        // Call parent callback after a short delay to show success message
        setTimeout(() => {
          onLoginSuccess(selectedRole);
        }, 800);
      } else {
        console.warn(`❌ Login failed: ${authError}`);
        setErrors({ form: authError || (isHindi ? "लॉगिन विफल रहा" : "Login failed") });
        setLoginSuccess(false);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setErrors({ form: error.message || (isHindi ? "एक त्रुटि हुई" : "An error occurred") });
      setLoginSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Tricolor Stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808]" />

      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-blue-900 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Emblem & Branding */}
            <div className="flex items-center gap-4">
              <SatyamevJayateLogo size="sm" />
              <div className="border-l border-slate-400 pl-4">
                <h1 className="text-lg font-bold text-white font-heading">
                  NATIONAL INFORMATICS CENTRE — NIC
                </h1>
                <p className="text-xs text-gray-300 mt-1">
                  Government Single Sign-On Gateway
                </p>
                <p className="text-xs text-gray-400">
                  Member of Parliament Local Area Development Scheme
                </p>
              </div>
            </div>

            {/* Right: Language Toggle */}
            <div className="flex items-center gap-4">
              {onToggleLanguage && (
                <button
                  onClick={onToggleLanguage}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
                >
                  {isHindi ? "English" : "हिन्दी"}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Login Form */}
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-2 font-heading">
                {isHindi ? "सुरक्षित पहचान सत्यापन" : "SECURE IDENTITY VERIFICATION"}
              </h2>
              <p className="text-slate-600 text-sm mb-6 font-semibold">
                {isHindi ? "अधिकृत गेटवे क्रेडेंशियल दर्ज करें" : "Enter Authorized Gateway Credentials"}
              </p>

              {/* Success Message */}
              {loginSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 mb-6">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-green-900">{isHindi ? "लॉगिन सफल" : "Login Successful"}</p>
                    <p className="text-xs text-green-800 mt-1">
                      {isHindi ? "आप सफलतापूर्वक लॉग इन हो गए हैं" : "You have successfully logged in"}
                    </p>
                  </div>
                </div>
              )}

              {/* Form-level Error */}
              {errors.form && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-6">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-red-900">{isHindi ? "लॉगिन विफल" : "Login Failed"}</p>
                    <p className="text-xs text-red-800 mt-1">{errors.form}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">
                    {isHindi ? "शासन भूमिका चुनें:" : "SELECT GOVERNANCE ROLE:"}
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => {
                          setSelectedRole(role.id);
                          setErrors((prev) => ({ ...prev, form: "" }));
                        }}
                        className={`p-4 rounded-lg border-2 transition-all text-sm font-medium text-left flex items-start gap-3 ${
                          selectedRole === role.id
                            ? "border-blue-600 bg-blue-50 text-blue-900"
                            : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                        }`}
                      >
                        <role.icon className="w-5 h-5 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-semibold">{role.label}</div>
                          <div className="text-xs text-slate-600 mt-1">{role.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    {isHindi ? "सरकारी / आधिकारिक ईमेल" : "GOVID / OFFICIAL EMAIL"}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      placeholder="admin.mospi@nic.in"
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

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    {isHindi ? "पासकोड" : "PASSCODE"}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors((prev) => ({ ...prev, password: "" }));
                      }}
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

                {/* CAPTCHA Section */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">
                    {isHindi ? "सुरक्षा सत्यापन (CAPTCHA)" : "SECURITY VERIFICATION (CAPTCHA)"}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {/* CAPTCHA Display */}
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center min-h-20">
                      <div className="text-center">
                        <div className="text-3xl font-bold font-mono text-slate-700 tracking-widest mb-2 select-none">
                          {captchaCode}
                        </div>
                        <button
                          type="button"
                          onClick={regenerateCaptcha}
                          className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 mx-auto"
                        >
                          <RefreshCw className="w-3 h-3" />
                          {isHindi ? "नया" : "New"}
                        </button>
                      </div>
                    </div>

                    {/* CAPTCHA Input */}
                    <div>
                      <input
                        type="text"
                        value={captchaInput}
                        onChange={(e) => {
                          setCaptchaInput(e.target.value);
                          setErrors((prev) => ({ ...prev, captcha: "" }));
                        }}
                        placeholder={isHindi ? "ऊपर कोड दर्ज करें" : "Enter code above"}
                        maxLength={5}
                        className={`w-full px-3 py-3 border rounded-lg outline-none transition-colors text-center font-semibold tracking-widest ${
                          errors.captcha
                            ? "border-red-500 bg-red-50"
                            : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        }`}
                      />
                      {errors.captcha && (
                        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.captcha}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sign In Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading || authLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Lock className="w-5 h-5" />
                    {isLoading || authLoading
                      ? isHindi
                        ? "साइन इन जारी है..."
                        : "Signing in..."
                      : isHindi
                      ? "मंत्रालय के रूप में साइन इन करें"
                      : "Sign In as Ministry"}
                  </button>
                </div>

                {/* Help Section */}
                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs text-slate-600 mb-3">
                    {isHindi ? "समस्या?" : "Need Help?"}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="#reset"
                      className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1"
                    >
                      <HelpCircle className="w-3 h-3" />
                      {isHindi ? "पासवर्ड रीसेट" : "Reset Password"}
                    </a>
                    <a
                      href="tel:1800111992"
                      className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      {isHindi ? "सहायता: 1800-11-1992" : "Help: 1800-11-1992"}
                    </a>
                  </div>
                </div>
              </form>
            </div>

            {/* Right: Information Section */}
            <div className="space-y-6">
              {/* Information Panel */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  {isHindi ? "निर्देशात्मक मार्गदर्शन" : "INSTRUCTIONAL GUIDANCE"}
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">
                      {isHindi ? "सहायता मैनुअल / उपयोगकर्ता मार्गदर्शन" : "HELP MANUAL / USER GUIDE"}
                    </h4>
                    <p className="text-xs text-slate-600 mb-3">
                      {isHindi
                        ? "सभी उपयोगकर्ता भूमिकाओं के लिए व्यापक निर्देश।"
                        : "Comprehensive instructions for all user roles."}
                    </p>
                    <button className="text-orange-600 hover:text-orange-700 text-xs font-semibold flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      {isHindi ? "पीडीएफ गाइड डाउनलोड करें" : "Download PDF Guide"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Advisory */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h4 className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {isHindi ? "सुरक्षा सलाह" : "Security Advisory"}
                </h4>
                <ul className="text-xs text-amber-900 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 mt-1 shrink-0" />
                    {isHindi
                      ? "साइट की प्रामाणिकता की पुष्टि करने से पहले पासवर्ड दर्ज करें।"
                      : "Verify URL authenticity before entering passwords."}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 mt-1 shrink-0" />
                    {isHindi
                      ? "कभी भी OTP या पासवर्ड किसी के साथ साझा न करें।"
                      : "Never share OTP or passwords with anyone."}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3 h-3 mt-1 shrink-0" />
                    {isHindi
                      ? "सत्र समाप्ति के बाद हमेशा लॉगआउट करें।"
                      : "Always log out after your session ends."}
                  </li>
                </ul>
              </div>

              {/* Version Info */}
              <div className="text-center text-xs text-slate-600 space-y-2">
                <p>NIC Gateway v3.12</p>
                <p>TLS 1.3 Secured</p>
                <p className="text-xs text-slate-500 italic">
                  {isHindi
                    ? "चेतावनी: यह एक सुरक्षित सरकार भारत प्रणाली है। सभी कार्यों को IT अधिनियम 2000 के तहत लॉग और ऑडिट किया जाता है।"
                    : "WARNING: This is a secure Government of India system. All actions are logged and audited per IT Act, 2000."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <GovFooter language={language as Language} />
    </div>
  );
};
