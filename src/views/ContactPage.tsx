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
  ChevronRight,
  MapPinIcon,
  PhoneIcon,
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
      color: "from-[#1B3A7A] to-[#0F2A6B]",
    },
    {
      icon: Mail,
      title: isHindi ? "ईमेल सहायता" : "Email Support",
      details: "support-mplads@nic.in",
      desc: isHindi ? "24 घंटे के भीतर प्रतिक्रिया" : "Response within 24 hours",
      color: "from-[#E31E24] to-[#C41612]",
    },
    {
      icon: MapPin,
      title: isHindi ? "मुख्य कार्यालय" : "Head Office",
      details: isHindi ? "खुरशीद लाल भवन, जनपथ" : "Khurshid Lal Bhawan, Janpath",
      desc: isHindi ? "नई दिल्ली - 110001" : "New Delhi - 110001",
      color: "from-[#FF9933] to-[#E67E22]",
    },
    {
      icon: Globe,
      title: isHindi ? "वेब पोर्टल" : "National Portal",
      details: "india.gov.in",
      desc: isHindi ? "राष्ट्रीय पोर्टल" : "Official Portal",
      color: "from-[#16A34A] to-[#059669]",
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
        : "How do I file a grievance?",
      a: isHindi
        ? "पोर्टल में 'नागरिक कोने' अनुभाग में जाएं और अपनी शिकायत विस्तार से दर्ज करें। आपको ट्रैकिंग ID मिलेगा।"
        : "Go to 'Citizen Corner' in the portal and file your grievance in detail. You'll receive a tracking ID.",
    },
    {
      q: isHindi
        ? "क्या मैं अपने जिले के लिए डेटा डाउनलोड कर सकता हूं?"
        : "Can I download district data?",
      a: isHindi
        ? "हां, 'कस्टम डेटासेट' स्टूडियो से आप फ़िल्टर और डाउनलोड कर सकते हैं।"
        : "Yes, use 'Custom Dataset Studio' to filter and download your district data.",
    },
    {
      q: isHindi
        ? "क्या मुझे तकनीकी सहायता मिल सकती है?"
        : "Where can I get technical support?",
      a: isHindi
        ? "तकनीकी समस्याओं के लिए हमें support-mplads@nic.in पर ईमेल करें या 1800-11-1992 पर कॉल करें।"
        : "Email us at support-mplads@nic.in or call 1800-11-1992 for technical issues.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Tricolor Top Stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] sticky top-0 z-50" />

      {/* Hero Section with Government Theme */}
      <div className="bg-gradient-to-r from-[#1B3A7A] to-[#0F2A6B] text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <Headphones className="w-8 h-8 text-[#FF9933]" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight">
            {isHindi ? "हमसे संपर्क करें" : "Contact Us"}
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            {isHindi
              ? "आपके प्रश्नों, सुझावों और शिकायतों के लिए हम 24/7 यहां हैं। आपकी प्रतिक्रिया हमें बेहतर सेवा प्रदान करने में मदद करती है।"
              : "We're here for your questions, suggestions, and grievances 24/7. Your feedback helps us serve better."}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Contact Channels Grid - Premium Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactChannels.map((channel, idx) => {
              const Icon = channel.icon;
              return (
                <div
                  key={idx}
                  className={`bg-gradient-to-br ${channel.color} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 text-white group cursor-pointer`}
                >
                  <div className="bg-white/10 p-3 rounded-lg w-fit mb-4 group-hover:bg-white/20 transition-colors">
                    <Icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-bold text-base mb-2 font-heading">{channel.title}</h3>
                  <p className="font-mono font-bold text-sm mb-2 text-white/90">{channel.details}</p>
                  <p className="text-xs text-white/75 leading-relaxed">{channel.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Main Form Section */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#1B3A7A] to-[#0F2A6B] px-8 py-6">
                <h2 className="text-2xl font-bold text-white font-heading">
                  {isHindi ? "अपना संदेश भेजें" : "Send Your Message"}
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  {isHindi ? "हम 24 घंटे में जवाब देंगे" : "We'll respond within 24 hours"}
                </p>
              </div>

              <div className="p-8">
                {submitted && (
                  <div className="mb-6 bg-emerald-50 border-l-4 border-emerald-500 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-emerald-900">
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

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        {isHindi ? "पूरा नाम *" : "Full Name *"}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={isHindi ? "आपका नाम दर्ज करें" : "Enter your name"}
                        className={`w-full px-4 py-2.5 border-2 rounded-lg outline-none transition-all font-sans ${
                          errors.name
                            ? "border-red-500 bg-red-50"
                            : "border-slate-200 focus:border-[#1B3A7A] focus:bg-blue-50"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        {isHindi ? "ईमेल *" : "Email *"}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={isHindi ? "आपका ईमेल दर्ज करें" : "Enter your email"}
                        className={`w-full px-4 py-2.5 border-2 rounded-lg outline-none transition-all font-sans ${
                          errors.email
                            ? "border-red-500 bg-red-50"
                            : "border-slate-200 focus:border-[#1B3A7A] focus:bg-blue-50"
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
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        {isHindi ? "फोन नंबर *" : "Phone Number *"}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={isHindi ? "10 अंकों का फोन नंबर" : "10-digit phone number"}
                        className={`w-full px-4 py-2.5 border-2 rounded-lg outline-none transition-all font-sans ${
                          errors.phone
                            ? "border-red-500 bg-red-50"
                            : "border-slate-200 focus:border-[#1B3A7A] focus:bg-blue-50"
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        {isHindi ? "श्रेणी *" : "Category *"}
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg outline-none focus:border-[#1B3A7A] focus:bg-blue-50 transition-all font-sans"
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
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      {isHindi ? "विषय *" : "Subject *"}
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder={isHindi ? "विषय दर्ज करें" : "Enter subject"}
                      className={`w-full px-4 py-2.5 border-2 rounded-lg outline-none transition-all font-sans ${
                        errors.subject
                          ? "border-red-500 bg-red-50"
                          : "border-slate-200 focus:border-[#1B3A7A] focus:bg-blue-50"
                      }`}
                    />
                    {errors.subject && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">
                      {isHindi ? "संदेश *" : "Message *"}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={isHindi ? "विस्तार से अपना संदेश दर्ज करें..." : "Enter your message in detail..."}
                      rows={5}
                      className={`w-full px-4 py-2.5 border-2 rounded-lg outline-none transition-all resize-none font-sans ${
                        errors.message
                          ? "border-red-500 bg-red-50"
                          : "border-slate-200 focus:border-[#1B3A7A] focus:bg-blue-50"
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
                    className="w-full bg-gradient-to-r from-[#1B3A7A] to-[#0F2A6B] hover:from-[#0F2A6B] hover:to-[#061A45] disabled:from-slate-300 disabled:to-slate-300 text-white font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
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
            </div>

            {/* Sidebar - Info & FAQs */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4 font-heading flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#FF9933]" />
                  {isHindi ? "कार्य समय" : "Office Hours"}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">{isHindi ? "सोमवार-शुक्रवार" : "Mon-Fri"}</span>
                    <span className="font-bold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">{isHindi ? "शनिवार" : "Saturday"}</span>
                    <span className="font-bold">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-slate-700">
                    <span className="text-slate-300">{isHindi ? "रविवार" : "Sunday"}</span>
                    <span className="font-bold text-red-400">{isHindi ? "बंद" : "Closed"}</span>
                  </div>
                  <p className="text-xs text-slate-400 pt-3 border-t border-slate-700">
                    {isHindi
                      ? "राष्ट्रीय छुट्टियों पर बंद"
                      : "Closed on national holidays"}
                  </p>
                </div>
              </div>

              {/* FAQs */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 font-heading flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#1B3A7A]" />
                  {isHindi ? "अक्सर पूछे जाने वाले प्रश्न" : "FAQs"}
                </h3>
                <div className="space-y-3">
                  {faqs.map((faq, idx) => (
                    <details key={idx} className="group">
                      <summary className="cursor-pointer font-semibold text-slate-900 text-xs hover:text-[#1B3A7A] transition-colors py-2 px-2 rounded hover:bg-slate-50">
                        {faq.q}
                      </summary>
                      <p className="text-xs text-slate-600 leading-relaxed px-2 pb-2">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg p-6">
                <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {isHindi ? "आपातकालीन संपर्क" : "Emergency Contact"}
                </h4>
                <p className="text-sm text-red-800 mb-3">
                  {isHindi
                    ? "तत्काल सहायता के लिए:"
                    : "For immediate assistance:"}
                </p>
                <a href="tel:18001119992" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                  <PhoneIcon className="w-4 h-4" />
                  1800-11-1992
                </a>
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
