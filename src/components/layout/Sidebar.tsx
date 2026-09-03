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
} from "lucide-react";
import { UserRole, Language } from "../../types";
import { cn } from "../../lib/utils";
import { getTranslation } from "../../data/translations";
import { ROUTE_CONFIG, getRouteByName } from "../../routes/routeConfig";

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

  const navSections = [
    {
      group: isHindi ? "आम नागरिक सेवाएँ और प्रोजेक्ट्स" : "Aam Nagarik Services & Projects",
      groupColor: "text-[#64748B] font-semibold",
      items: [
        { id: "overview", label: t.nav.overview, icon: LayoutDashboard, badge: undefined },
        { id: "works", label: t.nav.works, icon: FileSpreadsheet, badge: "12.8k" },
        { id: "customDataset", label: t.nav.customDataset || "Download Project Records", icon: Database, badge: isHindi ? "नया" : "New", badgeColor: "bg-blue-50 text-[#1D4ED8] border border-blue-200" },
        { id: "aiAssistant", label: t.nav.aiAssistant || "Help Chatbot & Voice Support", icon: Bot, badge: "24x7 Help", badgeColor: "bg-blue-50 text-[#1D4ED8] border border-blue-200" },
      ],
    },
    {
      group: t.groups?.primaryIntel || "Primary Intelligence",
      items: [
        { id: "alerts", label: t.nav.alerts, icon: AlertTriangle, badge: alertsCount > 0 ? `${alertsCount}` : undefined, badgeColor: "bg-[#DC2626] text-white" },
        { id: "map", label: t.nav.map, icon: Map, badge: undefined },
      ],
    },
    {
      group: t.groups?.aiAnomaly || "AI Anomaly Detection",
      items: [
        { id: "costAnomaly", label: t.nav.costAnomaly || "Cost Anomaly & Benchmarks", icon: BarChart3, badge: "+220%" },
        { id: "duplicate", label: t.nav.duplicate, icon: Copy, badge: "AI 94%" },
        { id: "expenditure", label: t.nav.expenditure || "Expenditure vs Progress", icon: Sliders, badge: "Delta" },
        { id: "delay", label: t.nav.delay, icon: Clock, badge: isHindi ? "पूर्वानुमान" : "Forecast" },
      ],
    },
    {
      group: t.groups?.jurisdiction || "Jurisdiction & Workspaces",
      items: [
        { id: "stateIntel", label: t.nav.stateIntel, icon: Globe, badge: undefined },
        { id: "districtIntel", label: t.nav.districtIntel, icon: MapPin, badge: isHindi ? "गाज़ियाबाद" : "Ghaziabad" },
        { id: "mpDashboard", label: t.nav.mpDashboard, icon: Landmark, badge: undefined },
        { id: "stateNodal", label: t.nav.stateNodal, icon: LayoutDashboard, badge: undefined },
        { id: "agencies", label: t.nav.agencies, icon: Building2, badge: undefined },
      ],
    },
    {
      group: t.groups?.governance || "Governance & Audit",
      items: [
        { id: "compliance", label: t.nav.compliance, icon: ShieldCheck, badge: undefined },
        { id: "policy", label: t.nav.policy, icon: BookOpen, badge: "2023 v4" },
        { id: "auditLogs", label: t.nav.auditLogs, icon: History, badge: undefined },
      ],
    },
    {
      group: isHindi ? "समर्थन और सेटिंग्स" : "Support & Settings",
      items: [
        { id: "contact", label: isHindi ? "हमसे संपर्क करें" : "Contact Us", icon: HelpCircle, badge: undefined },
      ],
    },
  ];

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
          "fixed top-[124px] bottom-0 left-0 z-40 transition-all duration-200 ease-in-out flex flex-col justify-between border-r bg-gradient-to-b from-[#F8FAFC] to-[#FFFFFF] text-[#0F172A] border-[#E2E8F0] h-[calc(100vh-124px)] shadow-sm",
          isCollapsed ? "w-20" : "w-64",
          isOpenMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Navigation Scrollable Area */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-2">
              {!isCollapsed && (
                <div className="px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.05em] text-[#1B3A7A] border-l-2 border-[#FF6B00]">
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
                        // Close mobile/tablet sidebar after navigation
                        if (isOpenMobile) onCloseMobile();
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-[8px] text-xs font-semibold transition-all group select-none",
                        isActive
                          ? "bg-gradient-to-r from-[#1B3A7A] to-[#0F2A6B] text-white shadow-sm border-l-2 border-[#FF6B00]"
                          : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#EEF3FB] transition-all duration-200"
                      )}
                      title={item.label}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Icon
                          className={cn(
                            "w-5 h-5 shrink-0 transition-colors",
                            isActive
                              ? "text-[#FF6B00]"
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
                            "text-[10px] font-bold px-2 py-1 rounded-[6px] shrink-0 whitespace-nowrap",
                            item.badgeColor || "bg-slate-200 text-slate-700"
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
        <div className="p-4 border-t border-[#E2E8F0] bg-gradient-to-r from-[#1B3A7A] to-[#0F2A6B] flex items-center justify-between text-xs transition-all shadow-sm">
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
              <div className="text-[9px] text-[#FF6B00] font-bold">v2.6</div>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex ml-2 p-1.5 rounded-[6px] transition-all cursor-pointer text-blue-200 hover:text-white hover:bg-white/10 duration-200 shrink-0"
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
