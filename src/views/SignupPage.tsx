import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Landmark, MapPin, Award, CheckCircle2, ArrowRight } from "lucide-react";
import { GovernmentCarousel } from "../components/common/GovernmentCarousel";
import { CaptchaInput } from "../components/common/CaptchaInput";
import { INDIAN_STATES_AND_CONSTITUENCIES, ALL_INDIAN_STATES } from "../data/indianStatesAndConstituencies";
import emblemOfIndia from "../assets/images/Emblem_of_India.svg";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";

export type SignupRole = "Public Citizen" | "Ministry Official" | "District Authority" | "Member of Parliament";

interface RoleOption {
  id: SignupRole;
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  needsOfficialId: boolean;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: "Public Citizen",
    title: "Public Citizen",
    description: "Track funds & raise grievances",
    icon: Users,
    needsOfficialId: false,
  },
  {
    id: "Ministry Official",
    title: "Ministry Official",
    description: "MoSPI administrative access",
    icon: Landmark,
    needsOfficialId: false,
  },
  {
    id: "District Authority",
    title: "District Authority",
    description: "Sanction & monitor works",
    icon: MapPin,
    needsOfficialId: true,
  },
  {
    id: "Member of Parliament",
    title: "Member of Parliament",
    description: "Recommend & review works",
    icon: Award,
    needsOfficialId: true,
  },
];

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/overview", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Form State
  const [selectedRole, setSelectedRole] = useState<SignupRole>("Public Citizen");
  const [fullName, setFullName] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [stateName, setStateName] = useState<string>("Maharashtra");
  const [constituency, setConstituency] = useState<string>("Nagpur");
  const [officialId, setOfficialId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [captchaInput, setCaptchaInput] = useState<string>("");
  const [captchaGeneratedCode, setCaptchaGeneratedCode] = useState<string>("");
  const [agreedTerms, setAgreedTerms] = useState<boolean>(false);

  // Form Validation & Success Feedback State
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Handle State Change -> Auto update Constituencies dropdown
  const handleStateChange = (newState: string) => {
    setStateName(newState);
    const availableConstituencies = INDIAN_STATES_AND_CONSTITUENCIES[newState] || [];
    if (availableConstituencies.length > 0) {
      setConstituency(availableConstituencies[0]);
    } else {
      setConstituency("");
    }
  };

  // Selected Role Option details
  const activeRoleOption = ROLE_OPTIONS.find((r) => r.id === selectedRole);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!mobileNumber.trim()) {
      errors.mobileNumber = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(mobileNumber.trim())) {
      errors.mobileNumber = "Enter a valid 10-digit mobile number";
    }

    if (!email.trim()) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Enter a valid email address";
    }

    if (!stateName) {
      errors.stateName = "State selection is required";
    }

    if (!constituency) {
      errors.constituency = "Constituency selection is required";
    }

    if (activeRoleOption?.needsOfficialId && !officialId.trim()) {
      errors.officialId = "Official ID / Designation is required for this role";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!captchaInput.trim()) {
      errors.captcha = "Captcha code is required";
    } else if (captchaInput.trim().toLowerCase() !== captchaGeneratedCode.toLowerCase()) {
      errors.captcha = "Incorrect Captcha code";
    }

    if (!agreedTerms) {
      errors.terms = "You must agree to the Terms of Use and Privacy Policy";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const roleMap: Record<SignupRole, UserRole> = {
      "Public Citizen": "Users",
      "Ministry Official": "Ministry",
      "District Authority": "District Authority",
      "Member of Parliament": "Member of Parliament",
    };
    const targetRole = roleMap[selectedRole] || "Ministry";

    try {
      await login(email, password || "Password@123", targetRole);
      setSubmitSuccess(true);
    } catch (err) {
      console.error("[SignupPage] Session init error:", err);
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Authentic Indian Tricolor Accent Strip (Saffron, White, Green) */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] shrink-0 z-50 shadow-sm" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto">
        {/* LEFT PANEL — CAROUSEL (~45% Width Desktop) */}
        <div className="w-full lg:w-[45%] lg:min-h-[calc(100vh-44px)] shrink-0">
          <GovernmentCarousel
            heading="Bringing transparency to every constituency"
            description="Register based on your role to access the right dashboard and permissions."
            trustPoints={[
              { text: "Track works across all 543 Parliamentary Constituencies", icon: "check" },
              { text: "Role-based dashboards for every stakeholder", icon: "check" },
              { text: "GIGW compliant and STQC certified platform", icon: "check" },
            ]}
          />
        </div>

        {/* RIGHT PANEL — SIGNUP FORM (~55% Width Desktop) */}
        <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-8 md:p-12 bg-white">
          <div className="w-full max-w-xl space-y-6">
            {/* Government Official Header Badge & Title */}
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <img src={emblemOfIndia} alt="National Emblem of India" className="h-7 w-auto object-contain" />
                  <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-[#0B3D91] text-[10px] font-extrabold rounded font-mono uppercase tracking-wider">
                    NATIONAL E-GOVERNANCE GATEWAY
                  </span>
                </div>
                {/* Micro Tricolor Pill */}
                <div className="flex h-1.5 w-8 rounded-full overflow-hidden shrink-0 border border-slate-200">
                  <div className="flex-1 bg-[#FF9933]" />
                  <div className="flex-1 bg-white" />
                  <div className="flex-1 bg-[#138808]" />
                </div>
              </div>
              <h2
                className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight pt-1"
                style={{ fontFamily: "'Lora', serif" }}
              >
                Citizen Registration
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-sans">
                Select your role to register on the official e-SAKSHI MPLADS portal.
              </p>
            </div>

            {/* Registration Success Banner */}

            {submitSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center space-y-4 animate-fadeIn">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-slate-900">Registration Successful!</h3>
                  <p className="text-xs text-slate-600">
                    Your account request for <span className="font-semibold text-slate-800">{fullName}</span> ({selectedRole}) has been registered.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => navigate("/login")}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-md shadow-sm transition-colors"
                  >
                    Proceed to Login
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* ROLE SELECTOR (2x2 Grid) */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-800">
                    Register as <span className="text-red-600">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Register as role selector">
                    {ROLE_OPTIONS.map((role) => {
                      const isSelected = selectedRole === role.id;
                      const Icon = role.icon;
                      return (
                        <div
                          key={role.id}
                          role="radio"
                          aria-checked={isSelected}
                          tabIndex={0}
                          onClick={() => setSelectedRole(role.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSelectedRole(role.id);
                            }
                          }}
                          className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all duration-150 flex flex-col justify-between min-h-[92px] focus:outline-none focus:ring-2 focus:ring-blue-600 ${isSelected
                              ? "border-blue-600 bg-blue-50/70 ring-1 ring-blue-600 shadow-sm"
                              : "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/50"
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                                }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-slate-900 leading-tight">
                              {role.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight mt-2 pl-0.5">
                            {role.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* FORM FIELDS */}

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className={`w-full h-10 px-3 text-xs bg-white text-slate-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${formErrors.fullName ? "border-red-500" : "border-slate-300"
                      }`}
                  />
                  {formErrors.fullName && <p className="text-[11px] text-red-600">{formErrors.fullName}</p>}
                </div>

                {/* Mobile Number & Email Address (Side-by-Side) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Mobile Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      required
                      className={`w-full h-10 px-3 text-xs bg-white text-slate-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${formErrors.mobileNumber ? "border-red-500" : "border-slate-300"
                        }`}
                    />
                    {formErrors.mobileNumber && <p className="text-[11px] text-red-600">{formErrors.mobileNumber}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.gov.in"
                      required
                      className={`w-full h-10 px-3 text-xs bg-white text-slate-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${formErrors.email ? "border-red-500" : "border-slate-300"
                        }`}
                    />
                    {formErrors.email && <p className="text-[11px] text-red-600">{formErrors.email}</p>}
                  </div>
                </div>

                {/* State & Constituency (Side-by-Side) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      State <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={stateName}
                      onChange={(e) => handleStateChange(e.target.value)}
                      required
                      className="w-full h-10 px-3 text-xs bg-white text-slate-900 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    >
                      {ALL_INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Constituency <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={constituency}
                      onChange={(e) => setConstituency(e.target.value)}
                      required
                      className="w-full h-10 px-3 text-xs bg-white text-slate-900 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    >
                      {(INDIAN_STATES_AND_CONSTITUENCIES[stateName] || []).map((constItem) => (
                        <option key={constItem} value={constItem}>
                          {constItem}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Conditional Field: Official ID / Designation (Shown for MP & District Authority) */}
                {activeRoleOption?.needsOfficialId && (
                  <div className="space-y-1 animate-fadeIn">
                    <label className="block text-xs font-semibold text-slate-700">
                      Official ID / Designation <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={officialId}
                      onChange={(e) => setOfficialId(e.target.value)}
                      placeholder={
                        selectedRole === "Member of Parliament"
                          ? "e.g. Lok Sabha MP / Rajya Sabha MP ID"
                          : "e.g. District Collectorate / DM Official Code"
                      }
                      required
                      className={`w-full h-10 px-3 text-xs bg-white text-slate-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${formErrors.officialId ? "border-red-500" : "border-slate-300"
                        }`}
                    />
                    {formErrors.officialId && <p className="text-[11px] text-red-600">{formErrors.officialId}</p>}
                  </div>
                )}

                {/* Password & Confirm Password (Side-by-Side) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Create Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      required
                      minLength={8}
                      className={`w-full h-10 px-3 text-xs bg-white text-slate-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${formErrors.password ? "border-red-500" : "border-slate-300"
                        }`}
                    />
                    {formErrors.password && <p className="text-[11px] text-red-600">{formErrors.password}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Confirm Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      required
                      className={`w-full h-10 px-3 text-xs bg-white text-slate-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${formErrors.confirmPassword ? "border-red-500" : "border-slate-300"
                        }`}
                    />
                    {formErrors.confirmPassword && (
                      <p className="text-[11px] text-red-600">{formErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Captcha Component */}
                <CaptchaInput
                  value={captchaInput}
                  onChange={setCaptchaInput}
                  onCaptchaCodeGenerated={setCaptchaGeneratedCode}
                  error={formErrors.captcha}
                />

                {/* Terms Agreement Checkbox */}
                <div className="space-y-1 pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 font-sans select-none">
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span>
                      I agree to the{" "}
                      <a href="#terms" onClick={(e) => e.preventDefault()} className="text-blue-600 underline font-medium hover:text-blue-800">
                        Terms of Use
                      </a>{" "}
                      and{" "}
                      <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-blue-600 underline font-medium hover:text-blue-800">
                        Privacy Policy
                      </a>{" "}
                      of this portal
                    </span>
                  </label>
                  {formErrors.terms && <p className="text-[11px] text-red-600">{formErrors.terms}</p>}
                </div>

                {/* Primary Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !agreedTerms}
                    className="w-full py-2.5 px-4 bg-[#2563EB] hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm rounded-[6px] shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                  >
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </button>
                </div>

                {/* Below Button Login Link */}
                <div className="text-center pt-2">
                  <p className="text-xs text-slate-600">
                    Already registered?{" "}
                    <Link to="/login" className="text-blue-600 font-semibold underline hover:text-blue-800">
                      Login here
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER BAR */}
      <footer className="w-full bg-[#F9FAFB] border-t border-slate-200 py-3.5 px-4 sm:px-8 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 z-40 font-sans">
        <div>© 2026 Ministry of Statistics & PI, Government of India</div>
        <div>Designed, Developed & Hosted by NIC</div>
      </footer>
    </div>
  );
};
