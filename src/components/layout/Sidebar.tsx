import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileSpreadsheet,
  AlertTriangle,
  Map,
  BarChart3,
  Copy,
  Clock,
  ShieldCheck,
  BookOpen,
  Building2,
  MapPin,
  Landmark,
  Bot,
  History,
  ChevronLeft,
  ChevronRight,
  Globe,
  Sliders,
  Database,
  HelpCircle,
  Users,
  Shield,
  Radio,
  Cpu,
  FileText
} from "lucide-react";
import { UserRole, Language } from "../../types";
import { cn } from "../../lib/utils";
import { getTranslation } from "../../data/translations";
import { ROUTE_CONFIG, getRouteByName } from "../../routes/routeConfig";
import {
  isViewAllowedForRole,
  getRoleAccessLevel,
  getAccessBadge,
} from "../../config/rolePermissions";

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  currentRole: UserRole;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  language: Language;
  alertsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  currentRole,
  isCollapsed,
  onToggleCollapse,
  isOpenMobile,
  onCloseMobile,
  language,
  alertsCount = 5,
}) => {
  const t = getTranslation(language);
  const isHindi = language === "hi";
  const location = useLocation();

  /**
   * Builds the navigation sections customized specifically to each role:
   * - Ministry: MoSPI National HQ, AI Anomaly, All-India Trackers, Audit Ledger
   * - Member of Parliament: MP Constituency Workspace, Recommended Works, Fund Entitlement, Local Alerts
   * - District Authority: District Collector Workspace, Sanction & Fund Release, MB Measurement, Vendor Audit
   * - Public Citizen: Public Citizen Transparency Services, GIS Map, Grievance Portal & Support
   */
  const getNavSections = () => {
    let rawSections = [];

    if (currentRole === "Member of Parliament") {
      rawSections = [
        {
          group: isHindi ? "सांसद निर्वाचन क्षेत्र कार्यस्थान" : "MP Constituency Workspace",
          items: [
            { id: "mpDashboard", label: isHindi ? "सांसद पोर्टल एवं निधि पात्रता" : "MP Portal & Fund Entitlement", icon: Landmark },
            { id: "works", label: isHindi ? "निर्वाचन क्षेत्र परियोजनाएं" : "Constituency Projects", icon: FileSpreadsheet },
            { id: "liveCommand", label: isHindi ? "लाइव कमान व टेलीमेट्री" : "Live Command & Telemetry", icon: Radio, badge: "Live", badgeColor: "bg-emerald-600 text-white font-bold" },
            { id: "workMonitoring", label: isHindi ? "कार्य आवंटन व प्रगति निगरानी" : "Work Progress & Monitoring", icon: Sliders, badge: "AI Verification", badgeColor: "bg-blue-600 text-white" },
            { id: "customDataset", label: isHindi ? "परियोजना डेटा डाउनलोड" : "Download Constituency Records", icon: Database },
          ],
        },
        {
          group: isHindi ? "निर्वाचन क्षेत्र विश्लेषिकी व अलर्ट" : "Constituency GIS & Risk Signals",
          items: [
            { id: "map", label: isHindi ? "निर्वाचन क्षेत्र जीआईएस मानचित्र" : "Constituency GIS Map", icon: Map },
            { id: "alerts", label: isHindi ? "स्थानीय विसंगति अलर्ट" : "Local Project Anomaly Alerts", icon: AlertTriangle, badge: alertsCount > 0 ? `${alertsCount}` : undefined, badgeColor: "bg-[#DC2626] text-white" },
            { id: "labour", label: isHindi ? "श्रमिक मस्टर रोल निगरानी" : "Labour & Muster Roll...", icon: Users, badge: "Aadhaar", badgeColor: "bg-purple-600 text-white font-bold" },
            { id: "ghostVerification", label: isHindi ? "साक्ष्य व सांठगांठ जांच" : "Evidence & Collusion...", icon: Shield, badge: "Collusion", badgeColor: "bg-red-600 text-white font-bold" },
            { id: "expenditure", label: isHindi ? "व्यय गतिशीलता बनाम प्रगति" : "Progress vs Spent Velocity", icon: Sliders },
          ],
        },
        {
          group: isHindi ? "नागरिक सेवाएँ व दिशानिर्देश" : "Citizen Assistance & Policy",
          items: [
            { id: "aiAssistant", label: isHindi ? "24x7 एआई व आवाज सहायता" : "AI Help & Voice Support", icon: Bot },
            { id: "policy", label: isHindi ? "सांसद निधि दिशानिर्देश 2023" : "MPLADS 2023 Guidelines", icon: BookOpen },
            { id: "contact", label: isHindi ? "संसदीय सहायता केंद्र" : "Parliamentary Support Desk", icon: HelpCircle },
          ],
        },
      ];
    } else if (currentRole === "District Authority") {
      rawSections = [
        {
          group: isHindi ? "जिला कलेक्टर निष्पादन डेस्क" : "District DM Execution Desk",
          items: [
            { id: "districtIntel", label: isHindi ? "जिला कलेक्टर डैशबोर्ड" : "District Collector Workspace", icon: MapPin },
            { id: "works", label: isHindi ? "कार्य स्वीकृति व निधि निर्गमन" : "Work Sanction & Fund Release", icon: FileSpreadsheet },
            { id: "liveCommand", label: isHindi ? "लाइव कमान व टेलीमेट्री" : "Live Command & Telemetry", icon: Radio, badge: "Live", badgeColor: "bg-emerald-600 text-white font-bold" },
            { id: "workMonitoring", label: isHindi ? "कार्य आवंटन व प्रगति निगरानी" : "Work Progress & Monitoring", icon: Sliders, badge: "AI Verification", badgeColor: "bg-blue-600 text-white" },
            { id: "agencies", label: isHindi ? "कार्यान्वयन एजेंसियां (एमबी मापन)" : "Implementing Agencies (MB Score)", icon: Building2 },
            { id: "customDataset", label: isHindi ? "जिला रिकॉर्ड डाउनलोड" : "Download District Records", icon: Database },
          ],
        },
        {
          group: isHindi ? "जिला जोखिम एवं सत्यापन" : "District Risk & Verification",
          items: [
            { id: "alerts", label: isHindi ? "जिला परियोजना अलर्ट" : "District Anomaly Alerts", icon: AlertTriangle, badge: alertsCount > 0 ? `${alertsCount}` : undefined, badgeColor: "bg-[#DC2626] text-white" },
            { id: "duplicate", label: isHindi ? "दोहरे भुगतान सत्यापन" : "Double Payment Verification", icon: Copy },
            { id: "costAnomaly", label: isHindi ? "उच्च लागत भविष्यवाणी ऑडिट" : "High Cost Prediction Audit", icon: BarChart3 },
            { id: "delay", label: isHindi ? "ठेकेदार विलंब निगरानी" : "Contractor Delay Monitor", icon: Clock },
            { id: "labour", label: isHindi ? "श्रमिक मस्टर रोल निगरानी" : "Labour & Muster Roll...", icon: Users, badge: "Aadhaar", badgeColor: "bg-purple-600 text-white font-bold" },
            { id: "ghostVerification", label: isHindi ? "साक्ष्य व सांठगांठ जांच" : "Evidence & Collusion...", icon: Shield, badge: "Collusion", badgeColor: "bg-red-600 text-white font-bold" },
          ],
        },
        {
          group: isHindi ? "जिला लेखापरीक्षा एवं नियम" : "District Audit & Rules",
          items: [
            { id: "compliance", label: isHindi ? "नियम उल्लंघन लेखापरीक्षक" : "Rule Violation Auditor", icon: ShieldCheck },
            { id: "auditLogs", label: isHindi ? "प्रमाणन एवं लेखा बही" : "District Audit & Attestation Ledger", icon: History },
            { id: "policy", label: isHindi ? "आधिकारिक योजना दिशानिर्देश" : "Official Scheme Schema", icon: BookOpen },
          ],
        },
      ];
    } else if (currentRole === "State Nodal Authority") {
      rawSections = [
        {
          group: isHindi ? "राज्य नोडल प्राधिकरण मुख्यालय" : "State Nodal Secretariat",
          items: [
            { id: "stateNodal", label: isHindi ? "राज्य नोडल डैशबोर्ड" : "State Nodal Workspace", icon: Globe },
            { id: "stateIntel", label: isHindi ? "राज्य जिला ट्रैकर" : "State-Wide Progress Tracker", icon: MapPin },
            { id: "works", label: isHindi ? "राज्य परियोजनाएं" : "State Projects Tracker", icon: FileSpreadsheet },
            { id: "liveCommand", label: isHindi ? "लाइव कमान व टेलीमेट्री" : "Live Command & Telemetry", icon: Radio, badge: "Live", badgeColor: "bg-emerald-600 text-white font-bold" },
            { id: "workMonitoring", label: isHindi ? "कार्य आवंटन व प्रगति निगरानी" : "Work Progress & Monitoring", icon: Sliders, badge: "AI Verification", badgeColor: "bg-blue-600 text-white" },
          ],
        },
        {
          group: isHindi ? "राज्य जोखिम एवं अनुपालन" : "State Risk & Compliance",
          items: [
            { id: "alerts", label: isHindi ? "राज्य परियोजना अलर्ट" : "State Irregularity Alerts", icon: AlertTriangle, badge: alertsCount > 0 ? `${alertsCount}` : undefined, badgeColor: "bg-[#DC2626] text-white" },
            { id: "agencies", label: isHindi ? "राज्य निर्माण एजेंसियां" : "Executing Agency Ratings", icon: Building2 },
            { id: "labour", label: isHindi ? "श्रमिक मस्टर रोल निगरानी" : "Labour & Muster Roll...", icon: Users, badge: "Aadhaar", badgeColor: "bg-purple-600 text-white font-bold" },
            { id: "ghostVerification", label: isHindi ? "साक्ष्य व सांठगांठ जांच" : "Evidence & Collusion...", icon: Shield, badge: "Collusion", badgeColor: "bg-red-600 text-white font-bold" },
            { id: "compliance", label: isHindi ? "राज्य अनुपालन लेखापरीक्षा" : "State Audit Ledger", icon: ShieldCheck },
          ],
        },
      ];
    } else if (currentRole === "Users") {
      rawSections = [
        {
          group: isHindi ? "नागरिक पारदर्शिता सेवाएं" : "Public Citizen Transparency Services",
          items: [
            { id: "overview", label: isHindi ? "सार्वजनिक डैशबोर्ड" : "Public Transparency Dashboard", icon: LayoutDashboard },
            { id: "works", label: isHindi ? "ऑल इंडिया प्रोजेक्ट्स ट्रैकर" : "All India Works Tracker", icon: FileSpreadsheet },
            { id: "liveCommand", label: isHindi ? "लाइव कमान व टेलीमेट्री" : "Live Command & Telemetry", icon: Radio, badge: "Live", badgeColor: "bg-emerald-600 text-white font-bold" },
            { id: "labour", label: isHindi ? "श्रमिक मस्टर रोल निगरानी" : "Labour & Muster Roll...", icon: Users, badge: "Aadhaar", badgeColor: "bg-purple-600 text-white font-bold" },
            { id: "ghostVerification", label: isHindi ? "साक्ष्य व सांठगांठ जांच" : "Evidence & Collusion...", icon: Shield, badge: "Collusion", badgeColor: "bg-red-600 text-white font-bold" },
            { id: "map", label: isHindi ? "इंटरएक्टिव जीआईएस मैप" : "Interactive GIS Project Map", icon: Map },
          ],
        },
        {
          group: isHindi ? "नागरिक सहायता एवं सेवाएं" : "Citizen Assistance & Support",
          items: [
            { id: "aiAssistant", label: isHindi ? "24x7 सहायता चैटबॉट और आवाज" : "Help Chatbot & Voice Support", icon: Bot },
            { id: "policy", label: isHindi ? "नागरिक अधिकार व दिशानिर्देश" : "Citizen Guidelines & Entitlements", icon: BookOpen },
            { id: "contact", label: isHindi ? "हेल्पलाइन एवं संपर्क डेस्क" : "Helpline & Contact Desk", icon: HelpCircle },
          ],
        },
      ];
    } else {
      // Default: Ministry (MoSPI National HQ)
      rawSections = [
        {
          group: isHindi ? "सांख्यिकी मंत्रालय राष्ट्रीय मुख्यालय" : "MAIN PORTALS & PROJECT LISTS",
          items: [
            { id: "overview", label: isHindi ? "राष्ट्रीय गुप्तचर अवलोकन" : "National Intelligence Overview", icon: LayoutDashboard },
            { id: "works", label: isHindi ? "ऑल इंडिया प्रोजेक्ट्स ट्रैकर" : "All India Projects Tracker", icon: FileSpreadsheet },
            { id: "liveCommand", label: isHindi ? "लाइव कमान व टेलीमेट्री" : "Live Command & Telemetry", icon: Radio, badge: "Live", badgeColor: "bg-emerald-600 text-white font-bold" },
            { id: "workMonitoring", label: isHindi ? "कार्य आवंटन व प्रगति निगरानी" : "Work Progress & Monitoring", icon: Sliders, badge: "AI Verification", badgeColor: "bg-blue-600 text-white" },
            { id: "alerts", label: isHindi ? "प्रोजेक्ट विसंगति अलर्ट" : "Project Irregularity Alerts", icon: AlertTriangle, badge: alertsCount > 0 ? `${alertsCount}` : undefined, badgeColor: "bg-[#DC2626] text-white" },
            { id: "map", label: isHindi ? "राष्ट्रीय जीआईएस मानचित्र" : "National GIS Project Map", icon: Map },
          ],
        },
        {
          group: isHindi ? "एआई विसंगति व धोखाधड़ी जांच" : "AUTOMATED SMART CHECKS",
          items: [
            { id: "costAnomaly", label: isHindi ? "उच्च लागत भविष्यवाणी" : "Check High Cost Projects", icon: BarChart3, badge: "+220%", badgeColor: "bg-amber-100 text-amber-800 font-bold" },
            { id: "duplicate", label: isHindi ? "दोहरे भुगतान की पहचान" : "Check Double Payments", icon: Copy, badge: "AI 94%", badgeColor: "bg-blue-100 text-blue-800 font-bold" },
            { id: "expenditure", label: isHindi ? "प्रगति बनाम व्यय गतिशीलता" : "Check Progress vs Spent...", icon: Sliders, badge: "Delta" },
            { id: "delay", label: isHindi ? "विलंब भविष्यवाणी" : "Check Delay Predictions", icon: Clock, badge: "Forecast" },
            { id: "labour", label: isHindi ? "श्रमिक मस्टर रोल निगरानी" : "Labour & Muster Roll...", icon: Users, badge: "Aadhaar", badgeColor: "bg-purple-600 text-white font-bold" },
            { id: "ghostVerification", label: isHindi ? "साक्ष्य व सांठगांठ जांच" : "Evidence & Collusion...", icon: Shield, badge: "Collusion", badgeColor: "bg-red-600 text-white font-bold" },
          ],
        },
        {
          group: isHindi ? "क्षेत्रीय व राज्य अवलोकन" : "Jurisdiction & Workspaces",
          items: [
            { id: "stateIntel", label: isHindi ? "राज्य-वार प्रगति ट्रैकर" : "State-Wise Progress Tracker", icon: Globe },
            { id: "districtIntel", label: isHindi ? "जिला-वार प्रगति ट्रैकर" : "District-Wise Progress Tracker", icon: MapPin },
            { id: "mpDashboard", label: isHindi ? "सांसद पोर्टल (समीक्षा)" : "Member of Parliament Portal", icon: Landmark },
            { id: "agencies", label: isHindi ? "सरकारी निर्माण एजेंसियां" : "Government Executing Agencies", icon: Building2 },
          ],
        },
        {
          group: isHindi ? "शासकीय नियम व लेखा परीक्षा" : "OFFICIAL RULES & ACTIVITY LOGS",
          items: [
            { id: "caseManagement", label: isHindi ? "मामला प्रबंधन व वृद्धि" : "Case Management & Es...", icon: FileText, badge: "Cases", badgeColor: "bg-amber-100 text-amber-800 border border-amber-300 font-bold" },
            { id: "scenarioSimulation", label: isHindi ? "खतरा परिदृश्य अनुकरण" : "Scenario Simulation ...", icon: Cpu, badge: "Simulator", badgeColor: "bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold" },
            { id: "compliance", label: isHindi ? "नियम उल्लंघन लेखापरीक्षक" : "Rule Violation Auditor", icon: ShieldCheck },
            { id: "policy", label: isHindi ? "आधिकारिक दिशानिर्देश 2023" : "Official Scheme Guidel... 2023 v4", icon: BookOpen },
            { id: "auditLogs", label: isHindi ? "अपरिवर्तनीय लेखा बही" : "Statutory Audit & CAG Ledger", icon: History },
          ],
        },
        {
          group: isHindi ? "नागरिक एवं समर्थन" : "Citizen & Export Services",
          items: [
            { id: "customDataset", label: isHindi ? "परियोजना रिकॉर्ड डाउनलोड" : "Download Project Records", icon: Database },
            { id: "aiAssistant", label: isHindi ? "24x7 एआई सहायक" : "Help Chatbot & Voice Support", icon: Bot },
            { id: "contact", label: isHindi ? "संपर्क केंद्र" : "Contact & Support Desk", icon: HelpCircle },
          ],
        },
      ];
    }

    // Filter items based on statutory RBAC permissions
    return rawSections
      .map((section) => {
        const allowedItems = section.items
          .filter((item) => isViewAllowedForRole(currentRole, item.id))
          .map((item) => {
            const accessLevel = getRoleAccessLevel(currentRole, item.id);
            const accessBadge = getAccessBadge(accessLevel, currentRole);

            // Determine effective badge: alertsCount or RBAC scope badge
            let badgeText = item.badge;
            let badgeColor = item.badgeColor;

            if (!badgeText && accessBadge) {
              badgeText = accessBadge.text;
              badgeColor = accessBadge.className;
            }

            return {
              ...item,
              badge: badgeText,
              badgeColor: badgeColor,
            };
          });

        return {
          ...section,
          items: allowedItems,
        };
      })
      .filter((section) => section.items.length > 0);
  };

  const navSections = getNavSections();

  /**
   * Helper to convert route name to kebab-case URL path
   */
  const getRoutePath = (routeId: string): string => {
    const routeConfig = getRouteByName(routeId);
    if (routeConfig) {
      return routeConfig.path;
    }
    // Fallback: convert camelCase to kebab-case
    return "/" + routeId.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "");
  };

  /**
   * Helper to check if route is currently active
   */
  const isRouteActive = (routeId: string): boolean => {
    const routePath = getRoutePath(routeId);
    return location.pathname === routePath || currentView === routeId;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Element */}
      <aside
        id="mplads-sentinel-sidebar"
        role="navigation"
        aria-label={language === "hi" ? "मुख्य नेविगेशन" : "Main Navigation"}
        className={cn(
          "transition-all duration-200 ease-in-out flex flex-col justify-between border-r bg-gradient-to-b from-[#F8FAFC] to-[#FFFFFF] text-[#0F172A] border-[#E2E8F0] shadow-sm shrink-0",
          "fixed inset-y-0 left-0 z-50 lg:static lg:h-full lg:z-auto",
          isCollapsed ? "w-20" : "w-64",
          isOpenMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Active Role Indicator Card */}
        {!isCollapsed && (
          <div className="mx-3 mt-3 p-2.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#0B2545] text-[#FCD34D] flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider leading-none">
                  Active Role
                </span>
                <span className="text-xs font-bold text-slate-800 truncate block mt-0.5">
                  {currentRole === "Users" ? "Public Citizen" : currentRole}
                </span>
              </div>
            </div>
            <span
              className={cn(
                "text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider",
                currentRole === "Ministry"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : currentRole === "State Nodal Authority"
                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                  : currentRole === "Member of Parliament"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : currentRole === "District Authority"
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              )}
            >
              {currentRole === "Ministry"
                ? "National"
                : currentRole === "State Nodal Authority"
                ? "State"
                : currentRole === "Member of Parliament"
                ? "MP"
                : currentRole === "District Authority"
                ? "District"
                : "Citizen"}
            </span>
          </div>
        )}

        {/* Navigation Scrollable Area */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5 scrollbar-thin">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1.5">
              {!isCollapsed && (
                <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#1B3A7A] border-l-2 border-[#FF6B00]">
                  {section.group}
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isRouteActive(item.id);
                  const routePath = getRoutePath(item.id);

                  return (
                    <Link
                      key={item.id}
                      to={routePath}
                      onClick={() => {
                        onSelectView(item.id);
                        if (isOpenMobile) onCloseMobile();
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all group select-none cursor-pointer",
                        isActive
                          ? "bg-gradient-to-r from-[#1B3A7A] to-[#0F2A6B] text-white shadow-xs border-l-2 border-[#FF6B00]"
                          : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#EEF3FB] transition-all duration-150"
                      )}
                      title={item.label}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <Icon
                          className={cn(
                            "w-4 h-4 shrink-0 transition-colors",
                            isActive
                              ? "text-[#FF9933]"
                              : "text-[#64748B] group-hover:text-[#1B3A7A]"
                          )}
                        />
                        {!isCollapsed && (
                          <span className="truncate text-left">{item.label}</span>
                        )}
                      </div>

                      {!isCollapsed && item.badge && (
                        <span
                          className={cn(
                            "text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 whitespace-nowrap ml-1.5",
                            item.badgeColor || "bg-slate-100 text-slate-600"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info & Collapse Toggle */}
        <div className="p-3 border-t border-[#E2E8F0] bg-gradient-to-r from-[#1B3A7A] to-[#0F2A6B] flex items-center justify-between text-xs transition-all shadow-xs">
          {!isCollapsed ? (
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[11px] text-white font-bold truncate">
                {isHindi ? "सांसद निधि प्रहरी" : "MPLADS SENTINEL"}
              </span>
              <span className="text-[10px] text-blue-200 truncate">
                {isHindi ? "v2.6.4 - निर्णय सहायता" : "v2.6.4 - DSE"}
              </span>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="text-[9px] text-[#FF9933] font-bold">v2.6</div>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex ml-2 p-1.5 rounded-md transition-all cursor-pointer text-blue-200 hover:text-white hover:bg-white/10 duration-200 shrink-0"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
