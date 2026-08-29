import React from "react";
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
} from "lucide-react";
import { UserRole, Language } from "../../types";
import { cn } from "../../lib/utils";
import { getTranslation } from "../../data/translations";

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
  ];

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
        className={cn(
          "fixed top-[124px] bottom-0 left-0 z-40 transition-all duration-200 ease-in-out flex flex-col justify-between border-r bg-white text-[#0F172A] border-[#E2E8F0] h-[calc(100vh-124px)] shadow-xs",
          isCollapsed ? "w-16" : "w-64",
          isOpenMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Navigation Scrollable Area */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-5 scrollbar-thin">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.03em] text-primary">
                  {section.group}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectView(item.id);
                        if (isOpenMobile) onCloseMobile();
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-[8px] text-xs font-medium transition-all group select-none cursor-pointer",
                        isActive
                          ? "bg-primary-light text-primary font-semibold border-l-2 border-primary"
                          : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F3F4F6] transition-colors duration-200"
                      )}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={cn(
                            "w-4 h-4 shrink-0 transition-colors",
                            isActive
                              ? "text-primary"
                              : "text-[#64748B] group-hover:text-primary"
                          )}
                        />
                        {!isCollapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </div>

                      {!isCollapsed && item.badge && (
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-1.5 py-0.5 rounded-[6px] shrink-0",
                            item.badgeColor || "bg-slate-100 text-[#64748B]"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info & Collapse Toggle */}
        <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-xs transition-colors">
          {!isCollapsed ? (
            <div className="flex flex-col text-[10px]">
              <span className="text-[#0F172A] font-semibold">
                {isHindi ? "एनआईसी प्रहरी (NIC Sentinel) v2.6.4" : "NIC Sentinel v2.6.4"}
              </span>
              <span className="text-[#64748B]">
                {isHindi ? "निर्णय सहायता प्रणाली" : "Decision Support Engine"}
              </span>
            </div>
          ) : (
            <div className="w-full flex justify-center text-[10px] text-[#1D4ED8] font-semibold">
              v2.6
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-[6px] transition-all cursor-pointer text-[#64748B] hover:text-[#0F172A] hover:bg-[#F3F4F6] duration-200"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  );
};
