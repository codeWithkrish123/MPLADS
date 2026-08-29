import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  Users,
  FileText,
  Globe,
  MessageSquare,
  Headphones,
} from "lucide-react";
import { Language } from "../types";
import { getTranslation } from "../data/translations";
import { GovFooter } from "../components/layout/GovFooter";

interface ContactPageProps {
  language?: Language;
}

export const ContactPage: React.FC<ContactPageProps> = ({ language = "en" }) => {
  const isHindi = language === "hi";
  const t = getTranslation(language as Language);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "General",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = isHindi ? "नाम आवश्यक है" : "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = isHindi ? "ईमेल आवश्यक है" : "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = isHindi ? "वैध ईमेल दर्ज करें" : "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = isHindi ? "फोन नंबर आवश्यक है" : "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = isHindi ? "10 अंकों का वैध फोन नंबर दर्ज करें" : "Enter a valid 10-digit phone number";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = isHindi ? "विषय आवश्यक है" : "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = isHindi ? "संदेश आवश्यक है" : "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        category: "General",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const contactChannels = [
    {
      icon: Phone,
      title: isHindi ? "टोल-फ्री हेल्पलाइन" : "Toll-Free Helpline",
      details: "1800-11-1992",
      desc: isHindi
        ? "सोमवार-शुक्रवार 9 AM - 6 PM (IST)"
        : "Monday-Friday 9 AM - 6 PM (IST)",
    },
    {
      icon: Mail,
      title: isHindi ? "ईमेल सहायता" : "Email Support",
      details: "support-mplads@nic.in",
      desc: isHindi ? "24 घंटे के भीतर प्रतिक्रिया" : "Response within 24 hours",
    },
    {
      icon: Globe,
      title: isHindi ? "वेब पोर्टल" : "Web Portal",
      details: isHindi ? "राष्ट्रीय पोर्टल" : "National Portal",
      desc: isHindi ? "india.gov.in पर MPLADS खोजें" : "Search MPLADS on india.gov.in",
    },
    {
      icon: Users,
      title: isHindi ? "भौतिक पता" : "Office Address",
      details: isHindi ? "खुरशीद लाल भवन, जनपथ" : "Khurshid Lal Bhawan, Janpath",
      desc: isHindi
        ? "नई दिल्ली - 110001"
        : "New Delhi - 110001",
    },
  ];

  const faqs = [
    {
      q: isHindi
        ? "मैं अपना खाता कैसे रीसेट कर सकता हूं?"
        : "How do I reset my account?",
      a: isHindi
        ? "लॉगिन पेज पर 'पासवर्ड भूल गए' लिंक पर क्लिक करें और अपने पंजीकृत ईमेल का उपयोग करके रीसेट करें।"
        : "Click 'Forgot Password' on the login page and reset using your registered email.",
    },
    {
      q: isHindi
        ? "मैं अपनी शिकायत दर्ज कैसे कर सकता हूं?"
        : "How do I file a complaint?",
      a: isHindi
        ? "पोर्टल में 'नागरिक कोने' अनुभाग में जाएं और अपनी शिकायत विस्तार से दर्ज करें।"
        : "Go to 'Citizen Corner' section in the portal and file your complaint in detail.",
    },
    {
      q: isHindi
        ? "क्या मैं अपने जिले के लिए डेटा डाउनलोड कर सकता हूं?"
        : "Can I download data for my district?",
      a: isHindi
        ? "हां, 'कस्टम डेटासेट' स्टूडियो से आप फ़िल्टर और डाउनलोड कर सकते हैं।"
        : "Yes, use 'Custom Dataset Studio' to filter and download your district data.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Tricolor Stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808]" />

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Headphones className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 font-heading">
              {isHindi ? "हमसे संपर्क करें" : "Contact Us"}
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {isHindi
                ? "आपके प्रश्नों, सुझावों और शिकायतों के लिए हम यहां हैं। आपकी प्रतिक्रिया हमें बेहतर सेवा प्रदान करने में मदद करती है।"
                : "We're here for your questions, suggestions, and grievances. Your feedback helps us serve better."}
            </p>
          </div>

          {/* Contact Channels Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactChannels.map((channel, idx) => {
              const Icon = channel.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 text-center"
                >
                  <Icon className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-900 mb-2">{channel.title}</h3>
                  <p className="font-mono font-bold text-blue-600 mb-2">{channel.details}</p>
                  <p className="text-sm text-slate-600">{channel.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Main Contact Form */}
          <div className="grid md:grid-cols-3 gap-12">
            {/* Form */}
            <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2 font-heading">
                {isHindi ? "हमें संदेश भेजें" : "Send us a Message"}
              </h2>
              <p className="text-slate-600 text-sm mb-8">
                {isHindi
                  ? "आपकी शिकायत या सुझाव साझा करें। हम 24 घंटे में प्रतिक्रिया देंगे।"
                  : "Share your grievance or suggestion. We'll respond within 24 hours."}
              </p>

              {submitted && (
                <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-emerald-900">
                      {isHindi ? "संदेश सफलतापूर्वक भेजा गया!" : "Message sent successfully!"}
                    </p>
                    <p className="text-sm text-emerald-800 mt-1">
                      {isHindi
                        ? "धन्यवाद। हम जल्द ही आपसे संपर्क करेंगे।"
                        : "Thank you. We'll get back to you soon."}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      {isHindi ? "पूरा नाम" : "Full Name"}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={isHindi ? "आपका नाम दर्ज करें" : "Enter your name"}
                      className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-colors ${
                        errors.name
                          ? "border-red-500 bg-red-50"
                          : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      {isHindi ? "ईमेल" : "Email"}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={isHindi ? "आपका ईमेल दर्ज करें" : "Enter your email"}
                      className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-colors ${
                        errors.email
                          ? "border-red-500 bg-red-50"
                          : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      {isHindi ? "फोन नंबर" : "Phone Number"}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={isHindi ? "10 अंकों का फोन नंबर" : "10-digit phone number"}
                      className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-colors ${
                        errors.phone
                          ? "border-red-500 bg-red-50"
                          : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      {isHindi ? "श्रेणी" : "Category"}
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      {[
                        { value: "General", label: isHindi ? "सामान्य" : "General" },
                        { value: "Grievance", label: isHindi ? "शिकायत" : "Grievance" },
                        { value: "Suggestion", label: isHindi ? "सुझाव" : "Suggestion" },
                        { value: "Technical", label: isHindi ? "तकनीकी" : "Technical" },
                      ].map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    {isHindi ? "विषय" : "Subject"}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder={isHindi ? "विषय दर्ज करें" : "Enter subject"}
                    className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-colors ${
                      errors.subject
                        ? "border-red-500 bg-red-50"
                        : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    }`}
                  />
                  {errors.subject && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    {isHindi ? "संदेश" : "Message"}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={isHindi ? "विस्तार से अपना संदेश दर्ज करें" : "Enter your message in detail"}
                    rows={5}
                    className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-colors resize-none ${
                      errors.message
                        ? "border-red-500 bg-red-50"
                        : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    }`}
                  />
                  {errors.message && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  {isLoading
                    ? isHindi
                      ? "भेजा जा रहा है..."
                      : "Sending..."
                    : isHindi
                    ? "संदेश भेजें"
                    : "Send Message"}
                </button>
              </form>
            </div>

            {/* Sidebar - FAQ & Info */}
            <div className="space-y-8">
              {/* FAQ */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  {isHindi ? "सामान्य प्रश्न" : "FAQs"}
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq, idx) => (
                    <details key={idx} className="group">
                      <summary className="cursor-pointer font-medium text-slate-900 text-sm hover:text-blue-600 transition-colors">
                        {faq.q}
                      </summary>
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  {isHindi ? "कार्य समय" : "Office Hours"}
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-700">
                    <span className="font-semibold">{isHindi ? "सोमवार-शुक्रवार:" : "Mon-Fri:"}</span>
                    <span className="text-slate-600"> 9:00 AM - 6:00 PM</span>
                  </p>
                  <p className="text-slate-700">
                    <span className="font-semibold">{isHindi ? "शनिवार:" : "Saturday:"}</span>
                    <span className="text-slate-600"> 10:00 AM - 4:00 PM</span>
                  </p>
                  <p className="text-slate-700">
                    <span className="font-semibold">{isHindi ? "रविवार:" : "Sunday:"}</span>
                    <span className="text-slate-600 text-red-600"> {isHindi ? "बंद" : "Closed"}</span>
                  </p>
                  <p className="text-xs text-slate-600 mt-3 pt-3 border-t">
                    {isHindi
                      ? "राष्ट्रीय छुट्टियों पर कार्यालय बंद रहेगा।"
                      : "Office closed on national holidays."}
                  </p>
                </div>
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
