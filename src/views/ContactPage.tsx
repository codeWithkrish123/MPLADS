import React, { useState } from "react";
import { CheckCircle2, ShieldCheck, Award } from "lucide-react";
import { GovernmentCarousel } from "../components/common/GovernmentCarousel";
import { CaptchaInput } from "../components/common/CaptchaInput";

export interface ContactPageProps {
  language?: string;
}

export const ContactPage: React.FC<ContactPageProps> = () => {
  // Form State
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [subject, setSubject] = useState<string>("Fund utilisation query");
  const [message, setMessage] = useState<string>("");
  const [captchaInput, setCaptchaInput] = useState<string>("");
  const [captchaGeneratedCode, setCaptchaGeneratedCode] = useState<string>("");

  // Validation & Submission State
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!email.trim()) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Enter a valid email address";
    }

    if (mobileNumber.trim() && !/^[0-9]{10}$/.test(mobileNumber.trim())) {
      errors.mobileNumber = "Enter a valid 10-digit mobile number";
    }

    if (!subject) {
      errors.subject = "Subject selection is required";
    }

    if (!message.trim()) {
      errors.message = "Message details are required";
    } else if (message.trim().length < 10) {
      errors.message = "Please provide at least 10 characters detailing your query";
    }

    if (!captchaInput.trim()) {
      errors.captcha = "Captcha code is required";
    } else if (captchaInput.trim().toLowerCase() !== captchaGeneratedCode.toLowerCase()) {
      errors.captcha = "Incorrect Captcha code";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate query submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1200);
  };

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setMobileNumber("");
    setSubject("Fund utilisation query");
    setMessage("");
    setCaptchaInput("");
    setSubmitSuccess(false);
    setFormErrors({});
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white">
      {/* Top 4px Gradient Bar */}
      <div className="h-[4px] w-full bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#16A34A] shrink-0 z-50" />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto">
        {/* LEFT PANEL — CAROUSEL (~45% Width Desktop) */}
        <div className="w-full lg:w-[45%] lg:min-h-[calc(100vh-44px)] shrink-0">
          <GovernmentCarousel
            heading="We're here to help"
            description="Reach out for queries on fund utilisation, project status, grievances, or technical support with the MPLADS portal."
            trustPoints={[
              { text: "MoSPI, Khurshid Lal Bhawan, Janpath, New Delhi - 110001", icon: "mappin" },
              { text: "Toll Free: 1800-11-1992", icon: "phone" },
              { text: "support-mplads@nic.in", icon: "mail" },
              { text: "Mon - Fri, 9:30 AM - 6:00 PM", icon: "clock" },
            ]}
          />
        </div>

        {/* RIGHT PANEL — CONTACT FORM (~55% Width Desktop) */}
        <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-8 md:p-12 bg-white">
          <div className="w-full max-w-xl space-y-6">
            {/* Form Heading & Subtext */}
            <div>
              <h2
                className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight"
                style={{ fontFamily: "'Lora', serif" }}
              >
                Contact Us
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-sans">
                Fill in the form below and our team will respond within 3 working days.
              </p>
            </div>

            {/* Submission Success Screen */}
            {submitSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center space-y-4 animate-fadeIn">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-slate-900">Query Submitted Successfully!</h3>
                  <p className="text-xs text-slate-600">
                    Thank you, <span className="font-semibold text-slate-800">{fullName}</span>. Your ticket reference for <span className="font-semibold text-slate-800">"{subject}"</span> has been dispatched to MoSPI support.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={resetForm}
                    className="inline-flex items-center justify-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-md shadow-sm transition-colors"
                  >
                    Submit Another Query
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    className={`w-full h-10 px-3 text-xs bg-white text-slate-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                      formErrors.fullName ? "border-red-500" : "border-slate-300"
                    }`}
                  />
                  {formErrors.fullName && <p className="text-[11px] text-red-600">{formErrors.fullName}</p>}
                </div>

                {/* Email Address & Mobile Number (Side-by-Side) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className={`w-full h-10 px-3 text-xs bg-white text-slate-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                        formErrors.email ? "border-red-500" : "border-slate-300"
                      }`}
                    />
                    {formErrors.email && <p className="text-[11px] text-red-600">{formErrors.email}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Mobile Number <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className={`w-full h-10 px-3 text-xs bg-white text-slate-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                        formErrors.mobileNumber ? "border-red-500" : "border-slate-300"
                      }`}
                    />
                    {formErrors.mobileNumber && <p className="text-[11px] text-red-600">{formErrors.mobileNumber}</p>}
                  </div>
                </div>

                {/* Subject Dropdown */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Subject <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="w-full h-10 px-3 text-xs bg-white text-slate-900 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  >
                    <option value="Fund utilisation query">Fund utilisation query</option>
                    <option value="Report an anomaly / grievance">Report an anomaly / grievance</option>
                    <option value="Technical support">Technical support</option>
                    <option value="RTI request">RTI request</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Message Textarea (~4 rows) */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Message <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your query in detail"
                    required
                    className={`w-full p-3 text-xs bg-white text-slate-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-y ${
                      formErrors.message ? "border-red-500" : "border-slate-300"
                    }`}
                  />
                  {formErrors.message && <p className="text-[11px] text-red-600">{formErrors.message}</p>}
                </div>

                {/* Captcha Input Component */}
                <CaptchaInput
                  value={captchaInput}
                  onChange={setCaptchaInput}
                  onCaptchaCodeGenerated={setCaptchaGeneratedCode}
                  error={formErrors.captcha}
                />

                {/* Primary Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 bg-[#2563EB] hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-sm rounded-[6px] shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                  >
                    {isSubmitting ? "Submitting Query..." : "Submit Query"}
                  </button>
                </div>

                {/* Below Button Pill Badges */}
                <div className="flex items-center justify-center gap-3 pt-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[11px] font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>GIGW Compliant</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-medium">
                    <Award className="w-3.5 h-3.5" />
                    <span>STQC Certified</span>
                  </div>
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
