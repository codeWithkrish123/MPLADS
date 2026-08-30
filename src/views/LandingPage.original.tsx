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
    },
  ];

  // ORIGINAL DESIGN - KEPT FOR REFERENCE AND FUTURE USE
  // This was the original complex role selector with detailed authentication forms
  // Replaced with government portal standards (IGOD/PFMS patterns)
  
  return (
    <div className={`min-h-screen ${isHighContrast ? "bg-black text-white" : "bg-white"}`}>
      <p className="p-4 text-center text-slate-600">
        Original landing page design has been replaced with government portal standards.
        See LandingPage.tsx for the new design.
      </p>
    </div>
  );
};
