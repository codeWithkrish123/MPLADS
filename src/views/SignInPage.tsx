import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  X,
  Download,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Language } from "../types";
import { getTranslation } from "../data/translations";

interface SignInPageProps {
  onSignIn?: (credentials: { email: string; passcode: string; role: string }) => void;
  language?: Language;
  onToggleLanguage?: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onSignIn,
  language = "en",
  onToggleLanguage,
}) => {
  const lang: Language = (language as Language) || "en";
  const isHindi = lang === "hi";
  const t = getTranslation(lang);

  // Form states
  const [selectedRole, setSelectedRole] = useState("ministry");
  const [email, setEmail] = useState("admin.mospi@nic.in");
  const [passcode, setPasscode] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [captchaImage, setCaptchaImage] = useState("7P9xE");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoCheckResult, setAutoCheckResult] = useState<{
    status: "checking" | "passed" | "failed" | null;
    message: string;
  }>({ status: null, message: "" });

  // Validate form
  const validateForm = () => {
    if (!email.trim()) {
      setSubmitError(isHindi ? "ईमेल दर्ज करें" : "Please enter your email");
      return false;
    }
    if (!passcode.trim()) {
      setSubmitError(isHindi ? "पासकोड दर्ज करें" : "Please enter your passcode");
      return false;
    }
    if (!captchaCode.trim()) {
      setSubmitError(isHindi ? "कैप्चा दर्ज करें" : "Please enter CAPTCHA code");
      return false;
    }
    return true;
  };

  // Handle sign in
  const handleSignIn = async () => {
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Call parent callback
      if (onSignIn) {
        onSignIn({
          email,
          passcode,
          role: selectedRole,
        });
      }
    } catch (error) {
      setSubmitError(isHindi ? "साइन इन विफल रहा" : "Sign in failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Refresh CAPTCHA
  const handleRefreshCaptcha = () => {
    const codes = ["7P9xE", "A4B2Z", "K8M3N", "Q1R7S", "T9U2V"];
    setCaptchaImage(codes[Math.floor(Math.random() * codes.length)]);
    setCaptchaCode("");
  };

  // Automated Smart Check - automatically verifies everything
  const handleAutoSmartCheck = async () => {
    setAutoCheckResult({ status: "checking", message: isHindi ? "जाँच की जा रही है..." : "Checking..." });

    try {
      // Simulate checking process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check email validity
      if (!email.trim()) {
        setAutoCheckResult({
          status: "failed",
          message: isHindi ? "❌ ईमेल पता आवश्यक है" : "❌ Email address is required",
        });
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setAutoCheckResult({
          status: "failed",
          message: isHindi ? "❌ वैध ईमेल प्रारूप नहीं है" : "❌ Invalid email format",
        });
        return;
      }

      // Check passcode
      if (!passcode.trim()) {
        setAutoCheckResult({
          status: "failed",
          message: isHindi ? "❌ पासकोड आवश्यक है" : "❌ Passcode is required",
        });
        return;
      }

      // Auto-fill and verify CAPTCHA
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCaptchaCode(captchaImage); // Auto-fill CAPTCHA with correct code

      // Final verification
      await new Promise((resolve) => setTimeout(resolve, 500));

      setAutoCheckResult({
        status: "passed",
        message: isHindi
          ? "✅ सभी जाँचें सफल! अब साइन इन करें।"
          : "✅ All checks passed! Ready to sign in.",
      });

      // Auto-submit after 1 second
      setTimeout(() => {
        handleSignIn();
      }, 1000);
    } catch (error) {
      setAutoCheckResult({
        status: "failed",
        message: isHindi ? "❌ जाँच विफल रही" : "❌ Check failed",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Tricolor Stripe */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-green-600"></div>

      {/* Header */}
      <div className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center font-bold text-lg">
            🇮🇳
          </div>
          <div>
            <div className="text-sm font-bold uppercase tracking-wide">
              {isHindi ? "राष्ट्रीय सूचना केंद्र" : "NATIONAL INFORMATICS CENTRE"}
            </div>
            <div className="text-lg font-bold">
              {isHindi
                ? "राष्ट्रीय एकल साइन-ऑन गेटवे (पहचान सत्यापित)"
                : "National Single Sign-On Gateway (Identity Verified)"}
            </div>
            <div className="text-xs text-blue-200">
              {isHindi
                ? "संसदीय क्षेत्र विकास योजना (एमपीएलएडीएस)"
                : "Member of Parliament Local Area Development Scheme (MPLADS)"}
            </div>
          </div>
        </div>
        <button
          onClick={onToggleLanguage}
          className="text-white hover:text-blue-200 font-semibold text-sm"
        >
          {isHindi ? "EN" : "हिं"}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-120px)]">
        {/* Left Column - Form */}
        <div className="flex-1 bg-white border-r border-gray-200 p-8">
          <div className="max-w-md space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-sm font-bold text-orange-600 uppercase tracking-widest mb-2">
                {isHindi ? "सुरक्षित पहचान सत्यापन" : "SECURE IDENTITY VERIFICATION"}
              </h1>
              <h2 className="text-2xl font-bold text-gray-900">
                {isHindi ? "प्राधिकृत गेटवे साक्षमान दर्ज करें" : "Enter Authorized Gateway Credentials"}
              </h2>
            </div>

            {/* Select Governance Role */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-blue-700 uppercase tracking-wide">
                {isHindi ? "शासन भूमिका चुनें:" : "SELECT GOVERNANCE ROLE:"}
              </label>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    id: "ministry",
                    label: isHindi ? "मंत्रालय" : "Ministry of Statistics & PI",
                    sublabel: isHindi ? "राष्ट्रीय कार्यालय" : "National HQ",
                    icon: "🏛️",
                  },
                  {
                    id: "district",
                    label: isHindi ? "जिला प्राधिकार" : "District Authority / DM",
                    sublabel: isHindi ? "जिला स्तर" : "District Cell",
                    icon: "📍",
                  },
                  {
                    id: "mp",
                    label: isHindi ? "सांसद" : "Member of Parliament",
                    sublabel: isHindi ? "संसदीय क्षेत्र" : "Constituency",
                    icon: "🏛️",
                  },
                  {
                    id: "state",
                    label: isHindi ? "राज्य नोडल" : "State Nodal Authority",
                    sublabel: isHindi ? "राज्य स्तर" : "State Level",
                    icon: "🗺️",
                  },
                ].map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-3 rounded border-2 transition-all text-left ${
                      selectedRole === role.id
                        ? "border-blue-700 bg-blue-50"
                        : "border-gray-300 bg-gray-50 hover:border-blue-400"
                    }`}
                  >
                    <div className="text-lg">{role.icon}</div>
                    <div className="font-bold text-xs text-gray-900">{role.label}</div>
                    <div className="text-[10px] text-gray-600">{role.sublabel}</div>
                  </button>
                ))}
              </div>

              {selectedRole === "ministry" && (
                <div className="mt-2 inline-block bg-yellow-100 text-yellow-900 text-[10px] font-bold px-3 py-1 rounded">
                  {isHindi ? "केवल प्राधिकृत" : "AUTHORIZED ONLY"}
                </div>
              )}
            </div>

            {/* Auth Methods Tabs */}
            <div className="flex gap-6 border-b border-gray-300 pt-4">
              {[
                { id: "govid", label: "GovID", icon: "🔐" },
                { id: "parichay", label: "Parichay SSO", icon: "🆔" },
                { id: "otp", label: "OTP Login", icon: "📱" },
              ].map((method) => (
                <button
                  key={method.id}
                  className="pb-3 px-2 text-xs font-bold text-blue-700 border-b-2 border-blue-700"
                >
                  {method.icon} {method.label}
                </button>
              ))}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-gray-700 mb-2">
                <Mail className="w-4 h-4" />
                {isHindi ? "गवID / आधिकारिक ईमेल" : "GovID / Official Email"}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                disabled={isSubmitting}
              />
              <p className="text-[10px] text-gray-500 mt-1">
                {isHindi
                  ? "केवल @nic.in या @gov.in ईमेल अनुमत हैं"
                  : "Only authorized @nic.in or @gov.in emails are permitted"}
              </p>
            </div>

            {/* Passcode */}
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-gray-700 mb-2">
                <Lock className="w-4 h-4" />
                {isHindi ? "पासकोड की" : "Passcode Key"}
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isSubmitting}
                >
                  {showPasscode ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* CAPTCHA */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                {isHindi ? "सुरक्षा सत्यापन (कैप्चा दर्ज करें)" : "Security Verification (Enter CAPTCHA)"}
              </label>

              <div className="flex gap-3 mb-3">
                <div className="bg-yellow-100 border-2 border-yellow-300 px-4 py-2 rounded font-bold text-lg text-gray-800 font-mono">
                  {captchaImage}
                </div>
                <button
                  onClick={handleRefreshCaptcha}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 transition-colors"
                  disabled={isSubmitting}
                  title="Refresh CAPTCHA"
                >
                  🔄
                </button>
              </div>

              <input
                type="text"
                value={captchaCode}
                onChange={(e) => setCaptchaCode(e.target.value.toUpperCase())}
                placeholder={isHindi ? "सत्यापन कोड दर्ज करें" : "Enter Verification Code"}
                className="w-full px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                disabled={isSubmitting}
              />
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="text-xs text-red-700 font-medium">{submitError}</span>
              </div>
            )}

            {/* Automated Smart Check Result */}
            {autoCheckResult.status && (
              <div
                className={`p-3 border rounded flex items-start gap-2 ${
                  autoCheckResult.status === "checking"
                    ? "bg-blue-50 border-blue-200"
                    : autoCheckResult.status === "passed"
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                {autoCheckResult.status === "checking" && (
                  <div className="w-4 h-4 text-blue-600 animate-spin">⟳</div>
                )}
                {autoCheckResult.status === "passed" && (
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                )}
                {autoCheckResult.status === "failed" && (
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <span
                  className={`text-xs font-medium ${
                    autoCheckResult.status === "checking"
                      ? "text-blue-700"
                      : autoCheckResult.status === "passed"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {autoCheckResult.message}
                </span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2 pt-4 flex-col">
              {/* Automated Smart Check Button */}
              <button
                onClick={handleAutoSmartCheck}
                disabled={isSubmitting || autoCheckResult.status === "checking"}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white font-bold rounded flex items-center justify-center gap-2 transition-all border border-blue-800"
              >
                {autoCheckResult.status === "checking" ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    {isHindi ? "जाँच जारी है..." : "Checking..."}
                  </>
                ) : (
                  <>
                    ⚡ {isHindi ? "स्वचालित स्मार्ट जाँच" : "Automated Smart Check"}
                  </>
                )}
              </button>

              {/* Cancel & Sign In Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setEmail("");
                    setPasscode("");
                    setCaptchaCode("");
                    setSubmitError("");
                    setAutoCheckResult({ status: null, message: "" });
                  }}
                  className="flex-1 px-4 py-2 bg-white border-2 border-gray-400 text-gray-900 font-bold rounded hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                {isHindi ? "रद्द करें" : "Cancel"}
              </button>
              <button
                onClick={handleSignIn}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold rounded flex items-center justify-center gap-2 transition-colors"
              >
                <Lock className="w-4 h-4" />
                {isSubmitting
                  ? isHindi
                    ? "सत्यापित हो रहा है..."
                    : "Verifying..."
                  : isHindi
                  ? "मंत्रालय के रूप में साइन इन करें"
                  : "Sign In as Ministry"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Instructions & Support */}
        <div className="flex-1 bg-gray-50 p-8 border-l border-gray-200 overflow-y-auto">
          <div className="max-w-md space-y-6">
            {/* Instructional Guidance */}
            <div>
              <h3 className="text-xs font-bold text-green-700 uppercase tracking-wide mb-3">
                {isHindi ? "शिक्षात्मक मार्गदर्शन" : "INSTRUCTIONAL GUIDANCE"}
              </h3>
              <h4 className="text-lg font-bold text-gray-900 mb-3">
                {isHindi ? "आधिकारिक मैनुअल & समर्थन" : "Official Manual & Support"}
              </h4>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-bold text-sm"
              >
                <Download className="w-4 h-4" />
                {isHindi ? "PDF उपयोगकर्ता मार्गदर्शन डाउनलोड करें" : "DOWNLOAD PDF USER GUIDE"}
              </a>
            </div>

            {/* Help Manual */}
            <div className="bg-white border border-gray-300 rounded-lg p-4 space-y-2">
              <h4 className="text-xs font-bold text-blue-700 uppercase">
                {isHindi ? "सहायता मैनुअल / उपयोगकर्ता मार्गदर्शन" : "HELP MANUAL / USER GUIDE"}
              </h4>
              <p className="text-xs text-gray-700">
                {isHindi
                  ? "जिला अधिकारियों, राज्य नोडलों और सांसदों के लिए व्यापक निर्देश।"
                  : "Comprehensive instructions for district authorities, state nodals, and MPs."}
              </p>
            </div>

            {/* Forgot Password */}
            <div className="bg-white border border-gray-300 rounded-lg p-4 space-y-2">
              <h4 className="text-xs font-bold text-orange-600 uppercase">
                {isHindi ? "पासवर्ड भूल गए / पिन रीसेट करें" : "FORGOT PASSWORD / RESET PIN"}
              </h4>
              <p className="text-xs text-gray-700 mb-2">
                {isHindi
                  ? "आधिकारिक NIC सक्रिय निर्देशिका के माध्यम से सिंक्रोनाइज़्ड साक्षमान पुनर्प्राप्ति पोर्टल।"
                  : "Sync-linked credential recovery portal via official NIC Active Directory."}
              </p>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold text-xs"
              >
                🔗 {isHindi ? "खाता साक्षमान पुनर्प्राप्त करें" : "Recover Account Credentials"}
              </a>
            </div>

            {/* Security & GIGW Compliance */}
            <div className="bg-orange-50 border-l-4 border-orange-600 p-4 space-y-2">
              <h4 className="text-xs font-bold text-orange-900 uppercase">
                {isHindi ? "सुरक्षा & GIGW अनुपालन" : "Security & GIGW Compliance"}
              </h4>
              <ul className="text-xs text-orange-900 space-y-1">
                <li>• {isHindi ? "पासवर्ड दर्ज करने से पहले URL प्रामाणिकता सत्यापित करें।" : "Ensure you verify URL authenticity before typing passwords."}</li>
                <li>• {isHindi ? "किसी के साथ OTP, पासवर्ड या सुरक्षा कुंजी साझा न करें।" : "Never share OTP, passwords, or security keys with anyone."}</li>
                <li>• {isHindi ? "जाने से पहले 'लॉगआउट' क्लिक करके सत्र को बंद करने के लिए बल दें।" : "Force close session by clicking Log Out before leaving."}</li>
              </ul>
            </div>

            {/* Citizen Identity Verification */}
            <div className="bg-green-50 border-l-4 border-green-600 p-4 space-y-2">
              <h4 className="text-xs font-bold text-green-900 uppercase flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                {isHindi ? "नागरिक पहचान सत्यापन" : "Citizen Identity Verification"}
              </h4>
              <p className="text-xs text-green-900">
                {isHindi
                  ? "GIGW दिशानिर्देशों के अनुसार, याचिका दाखिल करना या परियोजना ट्रैकिंग सार्वजनिक नागरिक कोने के माध्यम से सत्यापित सामान्य नागरिकों के लिए खुली है।"
                  : "As required by GIGW Guidelines, grievance lodging or project tracking is open to verified common citizens without account login through the public Citizen Corner."}
              </p>
            </div>

            {/* Footer */}
            <div className="text-xs text-gray-600 border-t border-gray-300 pt-4 space-y-1">
              <div>NIC Gateway v3.12-secure</div>
              <div className="text-right">SSL/TLS 1.3 Certified</div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Footer Warning */}
      <div className="bg-gray-900 text-white text-xs p-3 text-center">
        {isHindi
          ? "चेतावनी: यह भारत सरकार की एक सुरक्षित कंप्यूटर प्रणाली है। सभी कार्यों को सांविधिक अनुपालन दिशानिर्देशों के अनुसार लॉग किया जाता है और ऑडिट किया जाता है। अनाधिकृत उपयोग सूचना प्रौद्योगिकी अधिनियम की धारा 66 के तहत अभियोजन किया जाएगा।"
          : "WARNING: This is a secure computer system of the Government of India. All actions are logged and audited in accordance with statutory compliance guidelines. Unauthorized usage will be prosecuted under section 66 of the Information Technology Act."}
      </div>
    </div>
  );
};
