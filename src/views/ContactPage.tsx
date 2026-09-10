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
  ShieldCheck,
  HelpCircle,
  Sparkles,
  Search,
  ExternalLink,
  Award,
  BookOpen,
} from "lucide-react";
import { Language, UserRole } from "../types";
import { getTranslation } from "../data/translations";
import { GovFooter } from "../components/layout/GovFooter";
import { SatyamevJayateLogo } from "../components/gov/SatyamevJayateLogo";

interface ContactPageProps {
  language?: Language;
  currentRole?: UserRole;
}

export const ContactPage: React.FC<ContactPageProps> = ({ language = "en", currentRole = "Ministry" }) => {
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
  const [trackingId, setTrackingId] = useState("");
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
      newErrors.name = isHindi ? "नाम दर्ज करना आवश्यक है" : "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = isHindi ? "ईमेल दर्ज करना आवश्यक है" : "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = isHindi ? "कृपया वैध ईमेल दर्ज करें" : "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = isHindi ? "फोन नंबर दर्ज करना आवश्यक है" : "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = isHindi ? "10 अंकों का वैध फोन नंबर दर्ज करें" : "Enter a valid 10-digit mobile number";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = isHindi ? "विषय दर्ज करना आवश्यक है" : "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = isHindi ? "संदेश दर्ज करना आवश्यक है" : "Detailed description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate official API submission with tracking ID generation
    setTimeout(() => {
      const generatedId = `MPLADS-GRV-${Math.floor(100000 + Math.random() * 900000)}`;
      setIsLoading(false);
      setSubmitted(true);
      setTrackingId(generatedId);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        category: "General",
        message: "",
      });

      // Hide submission toast after 8 seconds
      setTimeout(() => setSubmitted(false), 8000);
    }, 1200);
  };

  const contactChannels = [
    {
      icon: Phone,
      title: isHindi ? "राष्ट्रीय टोल-फ्री हेल्पलाइन" : "National Toll-Free Helpline",
      details: "1800-11-1992",
      subDetails: isHindi ? "24x7 निःशुल्क नागरिक सहायता" : "24x7 Toll-Free Citizen Support Desk",
      color: "from-[#112E51] via-[#1B3A7A] to-[#0B2545]",
      accentColor: "text-[#FF9933]",
      border: "border-blue-900/30",
    },
    {
      icon: Mail,
      title: isHindi ? "आधिकारिक ईमेल सहायता" : "Official Email Desk",
      details: "support-mplads@nic.in",
      subDetails: isHindi ? "24 घंटे में आधिकारिक प्रतिक्रिया" : "Response within 24 business hours",
      color: "from-[#8B0000] via-[#A52A2A] to-[#600000]",
      accentColor: "text-amber-400",
      border: "border-red-900/30",
    },
    {
      icon: MapPin,
      title: isHindi ? "मंत्रालय राष्ट्रीय मुख्यालय" : "MoSPI National HQ",
      details: isHindi ? "खुरशीद लाल भवन, जनपथ" : "Khurshid Lal Bhawan, Janpath",
      subDetails: isHindi ? "नई दिल्ली - 110001 (भारत)" : "New Delhi - 110001 (India)",
      color: "from-[#0F2A6B] via-[#1B3A7A] to-[#0A1A40]",
      accentColor: "text-amber-300",
      border: "border-blue-800/30",
    },
    {
      icon: Globe,
      title: isHindi ? "राष्ट्रीय पोर्टल एवं सेवाएं" : "National Government Portal",
      details: "india.gov.in",
      subDetails: isHindi ? "भारत सरकार का आधिकारिक पोर्टल" : "Official Single-Window Gateway",
      color: "from-[#065F46] via-[#047857] to-[#022C22]",
      accentColor: "text-emerald-300",
      border: "border-emerald-900/30",
    },
  ];

  const departmentalDesks = [
    {
      title: isHindi ? "संसदीय सहायता केंद्र (MP Desk)" : "Parliamentary Support Desk (MP Desk)",
      email: "mp-desk.mplads@nic.in",
      phone: "+91 (011) 2345-6789",
      desc: isHindi
        ? "सांसद महोदयों की सिफारिशों, किश्त निर्गमन एवं निधि पात्रता संबंधी प्रश्नों के लिए।"
        : "Dedicated desk for Members of Parliament regarding fund entitlement & work recommendations.",
      icon: Building2,
    },
    {
      title: isHindi ? "जिलाधिकारी निष्पादन प्रकोष्ठ (DM Desk)" : "District Collector Execution Desk",
      email: "dm-support.mplads@nic.in",
      phone: "+91 (011) 2345-6790",
      desc: isHindi
        ? "कार्य स्वीकृति, एमबी माप सत्यापन, निधि निर्गमन और कार्यान्वयन एजेंसियों के लिए।"
        : "For District Collectors & nodal authorities regarding work sanction, MB measurement & fund release.",
      icon: Users,
    },
    {
      title: isHindi ? "तकनीकी एवं एआई सहायता केंद्र" : "Technical & AI Support Desk",
      email: "tech-help.mplads@nic.in",
      phone: "+91 (011) 2345-6791",
      desc: isHindi
        ? "पोर्टल लॉगिन, एनआईसी सिंगल साइन-ऑन, जीआईएस मानचित्र व एआई मॉडल प्रश्नों के लिए।"
        : "For portal sign-in, NIC SSO, GIS mapping layers, and ML anomaly model inquiries.",
      icon: Headphones,
    },
  ];

  const faqs = [
    {
      q: isHindi
        ? "सांसद निधि योजना के तहत शिकायत या प्रश्न कैसे दर्ज करें?"
        : "How do I lodge a formal query or grievance regarding an MPLADS work?",
      a: isHindi
        ? "आप नीचे दिए गए फॉर्म का उपयोग करके ऑनलाइन शिकायत दर्ज कर सकते हैं या टोल-फ्री नंबर 1800-11-1992 पर संपर्क कर सकते हैं। जमा करने पर आपको एक अद्वितीय ट्रैकिंग नंबर मिलेगा।"
        : "You can submit your grievance using the official form below or call 1800-11-1992. Upon submission, a unique grievance tracking number will be generated.",
    },
    {
      q: isHindi
        ? "पोर्टल पर परियोजनाओं की प्रगति डेटा कब अद्यतन होता है?"
        : "How frequently is the project progress and expenditure data updated?",
      a: isHindi
        ? "जिलाधिकारियों (DM) द्वारा रीयल-टाइम ऑन-साइट भौतिक और वित्तीय आंकड़ों का अद्यतन प्रतिदिन और मासिक किश्त सत्यापन के समय किया जाता है।"
        : "Real-time physical and financial data is updated daily by District Nodal Officers and reconciled upon monthly tranche verification.",
    },
    {
      q: isHindi
        ? "क्या नागरिक अपने क्षेत्र की परियोजनाओं का रिकॉर्ड डाउनलोड कर सकते हैं?"
        : "Can citizens download official project records for their constituency?",
      a: isHindi
        ? "हाँ, नागरिक पारदर्शिता डैशबोर्ड और 'कस्टम डेटासेट' सुविधा के माध्यम से आप अपने जिले या निर्वाचन क्षेत्र की सभी विकास परियोजनाओं का डेटा डाउनलोड कर सकते हैं।"
        : "Yes, using the Public Transparency Dashboard and 'Custom Dataset Download' portal, citizens can view and export records in CSV format.",
    },
    {
      q: isHindi
        ? "सांसद निधि योजना 2023 के आधिकारिक दिशानिर्देश कहाँ से प्राप्त करें?"
        : "Where can I access the official MPLADS 2023 Guidelines?",
      a: isHindi
        ? "दिशानिर्देश एवं नीति ज्ञान केंद्र अनुभाग से आप 2023 v4 योजना दिशानिर्देश और अनुमत कार्यों की कैटलॉग डाउनलोड कर सकते हैं।"
        : "You can review and download the official 2023 Scheme Guidelines directly from the 'Policy & Guidelines' section of this platform.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans select-none">
      {/* 0. Authentic Tricolor Top Ribbon */}
      <div className="india-gov-tricolor-stripe sticky top-0 z-50" />

      {/* 1. Official Government Header Banner */}
      <div className="bg-gradient-to-r from-[#0B2545] via-[#112E51] to-[#1B3A7A] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-blue-900/60 shadow-md">
        {/* Background Decorative Graphic */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <SatyamevJayateLogo size="lg" />
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-extrabold rounded uppercase tracking-wider font-mono">
                {isHindi ? "भारत सरकार — सांख्यिकी मंत्रालय" : "GOVERNMENT OF INDIA — MoSPI"}
              </span>
              <span className="px-2.5 py-0.5 bg-blue-400/20 border border-blue-400/30 text-blue-200 text-[10px] font-extrabold rounded uppercase tracking-wider font-mono">
                24x7 Help Desk
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-white flex items-center gap-3">
              <Headphones className="w-9 h-9 text-amber-400 shrink-0" />
              {currentRole === "Member of Parliament"
                ? (isHindi ? "संसदीय सहायता केंद्र" : "Parliamentary Support Desk")
                : currentRole === "Users"
                ? (isHindi ? "हेल्पलाइन एवं संपर्क डेस्क" : "Helpline & Contact Desk")
                : (isHindi ? "संपर्क केंद्र" : "Contact & Support Desk")}
            </h1>

            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-sans">
              {isHindi
                ? "सांसद निधि योजना (MPLADS) पारदर्शिता पोर्टल सहायता केंद्र। नागरिक, सांसद महोदय एवं जिला अधिकारियों के प्रश्नों, सुझावों व शिकायतों का त्वरित समाधान।"
                : "Official MoSPI single-window support desk. Assistance for Citizens, Members of Parliament, and District Authorities."}
            </p>
          </div>

          {/* Quick Toll Free Badge */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shrink-0 text-center space-y-1 shadow-lg">
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block font-mono">
              {isHindi ? "टोल-फ्री नागरिक हेल्पलाइन" : "TOLL-FREE HELPLINE"}
            </span>
            <a
              href="tel:1800111992"
              className="text-2xl font-black font-mono text-white hover:text-amber-300 transition-colors block"
            >
              1800-11-1992
            </a>
            <span className="text-[10px] text-blue-200 block">
              {isHindi ? "सोमवार - शनिवार 9:00 AM - 6:00 PM IST" : "Mon - Sat 9:00 AM - 6:00 PM IST"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Page Content Container */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-10">
        {/* 4 Premium Official Contact Channel Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactChannels.map((channel, idx) => {
            const Icon = channel.icon;
            return (
              <div
                key={idx}
                className={`bg-gradient-to-br ${channel.color} text-white p-5 rounded-xl border ${channel.border} shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1 group flex flex-col justify-between relative overflow-hidden`}
              >
                <div>
                  <div className="p-2.5 bg-white/15 rounded-lg w-fit mb-3 border border-white/20 group-hover:scale-110 transition-transform">
                    <Icon className={`w-5 h-5 ${channel.accentColor}`} />
                  </div>
                  <h3 className="font-extrabold text-sm text-white font-heading">{channel.title}</h3>
                  <p className="font-mono font-bold text-xs mt-1 text-white/95 tracking-wide">
                    {channel.details}
                  </p>
                </div>
                <p className="text-[11px] text-blue-100/80 mt-3 pt-2 border-t border-white/15">
                  {channel.subDetails}
                </p>
              </div>
            );
          })}
        </div>

        {/* Form & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Official Contact / Grievance Form (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
            <div className="bg-[#112E51] text-white px-6 py-4 flex items-center justify-between border-b border-blue-900/60">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-blue-600/40 rounded border border-blue-400/40">
                  <Send className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold font-heading text-white">
                    {isHindi ? "आधिकारिक प्रश्न या शिकायत दर्ज करें" : "Official Inquiry & Grievance Form"}
                  </h2>
                  <p className="text-[11px] text-blue-200">
                    {isHindi
                      ? "सांख्यिकी मंत्रालय संपर्क केंद्र — 24 घंटे में स्वचालित उत्तर"
                      : "Official MoSPI Portal — Tracked with unique grievance reference number"}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold rounded border border-amber-400/30 uppercase">
                GIGW Form v2.4
              </span>
            </div>

            <div className="p-6 space-y-5 flex-1">
              {/* Success Banner with Generated Tracking ID */}
              {submitted && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-start gap-3.5 animate-in fade-in duration-200 shadow-xs">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-emerald-950">
                        {isHindi ? "संदेश सफलतापूर्वक दर्ज किया गया!" : "Inquiry Submitted Successfully!"}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-700 text-white font-mono font-bold text-[10px] rounded uppercase">
                        {trackingId}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 font-medium">
                      {isHindi
                        ? `आपकी शिकायत संख्या ${trackingId} पंजीकृत हो गई है। हमारी नोडल टीम 24 घंटे में ईमेल पर उत्तर प्रदान करेगी।`
                        : `Your ticket reference ${trackingId} has been registered. Our nodal team will respond within 24 business hours.`}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                      {isHindi ? "पूरा नाम *" : "Full Name *"}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={isHindi ? "उदा. राजेश कुमार" : "e.g. Rajesh Kumar"}
                      className={`w-full bg-white border rounded-lg px-3.5 py-2.5 text-xs text-slate-900 outline-none transition-all font-sans ${
                        errors.name
                          ? "border-red-500 bg-red-50/50"
                          : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-600 text-[11px] font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                      {isHindi ? "ईमेल पता *" : "Official Email Address *"}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={isHindi ? "उदा. name@gov.in" : "e.g. officer@nic.in"}
                      className={`w-full bg-white border rounded-lg px-3.5 py-2.5 text-xs text-slate-900 outline-none transition-all font-sans ${
                        errors.email
                          ? "border-red-500 bg-red-50/50"
                          : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-600 text-[11px] font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 2: Phone & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                      {isHindi ? "मोबाइल नंबर *" : "Mobile Phone Number *"}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={isHindi ? "10 अंकों का फोन नंबर" : "10-digit mobile number"}
                      className={`w-full bg-white border rounded-lg px-3.5 py-2.5 text-xs text-slate-900 outline-none transition-all font-sans ${
                        errors.phone
                          ? "border-red-500 bg-red-50/50"
                          : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-[11px] font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                      {isHindi ? "विषय श्रेणी *" : "Inquiry Category *"}
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer font-sans"
                    >
                      <option value="General">{isHindi ? "सामान्य प्रश्न (General Inquiry)" : "General Inquiry"}</option>
                      <option value="Grievance">{isHindi ? "नागरिक शिकायत (Public Grievance)" : "Public Grievance"}</option>
                      <option value="MPLADS_Works">{isHindi ? "परियोजना प्रगति (Project Progress)" : "Project Progress Inquiry"}</option>
                      <option value="Technical">{isHindi ? "तकनीकी व लॉगिन समस्या (Technical Support)" : "Technical & SSO Support"}</option>
                      <option value="Suggestion">{isHindi ? "पोर्टल सुझाव (Platform Feedback)" : "Platform Suggestion"}</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Subject */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                    {isHindi ? "विषय *" : "Subject Line *"}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder={isHindi ? "संक्षेप में विषय लिखें..." : "Brief summary of your query or grievance..."}
                    className={`w-full bg-white border rounded-lg px-3.5 py-2.5 text-xs text-slate-900 outline-none transition-all font-sans ${
                      errors.subject
                        ? "border-red-500 bg-red-50/50"
                        : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                  {errors.subject && (
                    <p className="text-red-600 text-[11px] font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.subject}
                    </p>
                  )}
                </div>

                {/* Row 4: Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                    {isHindi ? "विस्तृत विवरण *" : "Detailed Description / Message *"}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={
                      isHindi
                        ? "विस्तार से अपना संदेश, कार्य संख्या या शिकायत विवरण लिखें..."
                        : "Please describe your query, work ID, district, or grievance details..."
                    }
                    rows={5}
                    className={`w-full bg-white border rounded-lg px-3.5 py-2.5 text-xs text-slate-900 outline-none transition-all resize-none font-sans ${
                      errors.message
                        ? "border-red-500 bg-red-50/50"
                        : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                  {errors.message && (
                    <p className="text-red-600 text-[11px] font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#112E51] via-[#1B3A7A] to-[#0F2A6B] hover:from-[#0F2A6B] hover:to-[#0B192C] text-white font-extrabold text-xs py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  {isLoading
                    ? isHindi
                      ? "जमा किया जा रहा है..."
                      : "Submitting Inquiry..."
                    : isHindi
                    ? "आधिकारिक शिकायत दर्ज करें"
                    : "Submit Official Inquiry"}
                </button>
              </form>
            </div>
          </div>

          {/* Departmental Desks & FAQs Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Departmental Support Desks */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 font-heading uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-3">
                <Building2 className="w-4 h-4 text-blue-600" />
                {isHindi ? "विभागीय सहायता प्रकोष्ठ" : "Departmental Support Desks"}
              </h3>

              <div className="space-y-3.5">
                {departmentalDesks.map((desk, idx) => {
                  const Icon = desk.icon;
                  return (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                        <Icon className="w-4 h-4 text-blue-700 shrink-0" />
                        <span>{desk.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{desk.desc}</p>
                      <div className="text-[11px] font-mono text-blue-800 font-semibold pt-1 border-t border-slate-200/60 flex flex-col gap-0.5">
                        <span>📧 {desk.email}</span>
                        <span>📞 {desk.phone}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FAQs Accordion Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 font-heading uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-3">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                {isHindi ? "अक्सर पूछे जाने वाले प्रश्न (FAQs)" : "Frequently Asked Questions"}
              </h3>

              <div className="space-y-2.5">
                {faqs.map((faq, idx) => (
                  <details key={idx} className="group border border-slate-200 rounded-lg bg-slate-50/60 overflow-hidden">
                    <summary className="cursor-pointer font-bold text-slate-900 text-xs py-2.5 px-3 hover:bg-blue-50/60 transition-colors flex items-center justify-between">
                      <span>{faq.q}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-open:rotate-90 transition-transform shrink-0" />
                    </summary>
                    <p className="text-[11px] text-slate-600 leading-relaxed px-3 pb-3 pt-1 border-t border-slate-200/60 bg-white">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            {/* Office Hours & Location Card */}
            <div className="bg-[#0B2545] text-white rounded-xl border border-blue-900 p-5 space-y-3 shadow-md">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {isHindi ? "कार्यालय कार्य समय" : "National Office Hours"}
              </h4>
              <div className="space-y-2 text-xs font-sans">
                <div className="flex justify-between border-b border-blue-800/80 pb-1.5">
                  <span className="text-blue-200">{isHindi ? "सोमवार - शुक्रवार" : "Mon - Fri"}</span>
                  <span className="font-mono font-bold text-white">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between border-b border-blue-800/80 pb-1.5">
                  <span className="text-blue-200">{isHindi ? "शनिवार" : "Saturday"}</span>
                  <span className="font-mono font-bold text-white">9:30 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">{isHindi ? "रविवार / राष्ट्रीय अवकाश" : "Sunday / Govt Holidays"}</span>
                  <span className="font-bold text-red-300">{isHindi ? "अवकाश (Closed)" : "Closed"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Component */}
      <GovFooter language={language as Language} />
    </div>
  );
};
