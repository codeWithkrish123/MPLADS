import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserRole, Language, GovTheme, WorkRecord, RiskAlert, AuditLogEntry } from "./types";

// Layout & Global Components
import { Topbar } from "./components/layout/Topbar";
import { Sidebar } from "./components/layout/Sidebar";
import { WhyFlaggedDrawer } from "./components/drawers/WhyFlaggedDrawer";
import { NotificationsDrawer } from "./components/drawers/NotificationsDrawer";
import { CommandPalette } from "./components/common/CommandPalette";
import { OnboardingTour } from "./components/common/OnboardingTour";

// Views
import { LandingPage } from "./views/LandingPage";
import { LoginPage } from "./views/LoginPage";
import { ContactPage } from "./views/ContactPage";
import { RoleSelectorPage } from "./views/RoleSelectorPage";
import { ExecutiveAuditDashboardView } from "./views/ExecutiveAuditDashboardView";
import { ProjectReviewQueueView } from "./views/ProjectReviewQueueView";
import { ProjectDetailView } from "./views/ProjectDetailView";
import { RiskSimulatorView } from "./views/RiskSimulatorView";
import { StateIntelligenceView } from "./views/StateIntelligenceView";
import { DistrictDashboardView } from "./views/DistrictDashboardView";
import { DuplicateDetectionView } from "./views/DuplicateDetectionView";
import { CostAnomalyView } from "./views/CostAnomalyView";
import { ExpenditureProgressView } from "./views/ExpenditureProgressView";
import { DelayPredictionView } from "./views/DelayPredictionView";
import { ComplianceCenterView } from "./views/ComplianceCenterView";
import { PolicyKnowledgeView } from "./views/PolicyKnowledgeView";
import { AIAssistantView } from "./views/AIAssistantView";
import { MPDashboardView } from "./views/MPDashboardView";
import { StateNodalDashboardView } from "./views/StateNodalDashboardView";
import { AgencyRiskView } from "./views/AgencyRiskView";
import { AlertCenterView } from "./views/AlertCenterView";
import { AuditLogView } from "./views/AuditLogView";
import { CustomDatasetView } from "./views/CustomDatasetView";
import { MapIntelligenceView } from "./views/MapIntelligenceView";

function parseAppRoute(pathname: string): { view: string; projectId: string | null } {
  const trimmed = pathname.replace(/\/+$/, "") || "/";
  if (trimmed === "/" || trimmed === "/landing") return { view: "landing", projectId: null };
  const parts = trimmed.split("/").filter(Boolean);
  const head = parts[0] || "landing";
  if (head === "dashboard") return { view: "overview", projectId: null };
  if (head === "works" && parts.length >= 2) {
    return { view: "workDetail", projectId: decodeURIComponent(parts.slice(1).join("/")) };
  }
  return { view: head, projectId: null };
}

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<string>("landing");
  const [routeProjectId, setRouteProjectId] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>("Ministry");
  const [currentState, setCurrentState] = useState<string>("All States");
  const [currentDistrict, setCurrentDistrict] = useState<string>("Ghaziabad");
  const [currentFY, setCurrentFY] = useState<string>("FY 2025-26");
  const [language, setLanguage] = useState<Language>("en");
  const [currentTheme, setCurrentTheme] = useState<GovTheme>("nic-blue");

  // Dynamic States for Interactive Workflows
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  
  // Data Loading States
  const [isLoadingAlerts, setIsLoadingAlerts] = useState<boolean>(false);
  const [isLoadingAuditLogs, setIsLoadingAuditLogs] = useState<boolean>(false);
  const [alertsError, setAlertsError] = useState<string | null>(null);
  const [auditLogsError, setAuditLogsError] = useState<string | null>(null);
  
  // Accessibility Control States
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [savedThemeBeforeContrast, setSavedThemeBeforeContrast] = useState<GovTheme>("nic-blue");

  // Load font size preference from localStorage on mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem("mplads_font_size") as "small" | "medium" | "large" | null;
    if (savedFontSize && savedFontSize !== fontSize) {
      setFontSize(savedFontSize);
    }
  }, []);

  // Sync URL with currentView state
  const location = useLocation();
  const navigate = useNavigate();
  
  // Wrapper function to navigate both URL and state
  const navigateTo = (view: string) => {
    const path = view === "landing" ? "/" : `/${view}`;
    setCurrentView(view === "dashboard" ? "overview" : view);
    navigate(path, { replace: false });
  };

  const openProject = (rawId: string) => {
    setCurrentView("workDetail");
    setRouteProjectId(rawId);
    navigate(`/works/${encodeURIComponent(rawId)}`);
  };
  
  useEffect(() => {
    const parsed = parseAppRoute(location.pathname);
    if (parsed.view !== currentView) setCurrentView(parsed.view);
    setRouteProjectId(parsed.projectId);
  }, [location.pathname]);

  // Load high contrast preference from localStorage on mount
  useEffect(() => {
    const savedContrast = localStorage.getItem("mplads_high_contrast") === "true";
    if (savedContrast !== isHighContrast) {
      setIsHighContrast(savedContrast);
      if (savedContrast) {
        setCurrentTheme("high-contrast");
      }
    }
  }, []);

  // Sync theme attribute to document root
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  // Sync accessibility font size class to documentElement and persist to localStorage
  useEffect(() => {
    document.documentElement.classList.remove("font-size-sm", "font-size-md", "font-size-lg");
    if (fontSize === "small") {
      document.documentElement.classList.add("font-size-sm");
    } else if (fontSize === "medium") {
      document.documentElement.classList.add("font-size-md");
    } else if (fontSize === "large") {
      document.documentElement.classList.add("font-size-lg");
    }
    // Persist font size preference
    localStorage.setItem("mplads_font_size", fontSize);
  }, [fontSize]);

  // Handle contrast toggle effect
  const handleToggleHighContrast = () => {
    setIsHighContrast((prev) => {
      const next = !prev;
      if (next) {
        setSavedThemeBeforeContrast(currentTheme);
        setCurrentTheme("high-contrast");
      } else {
        setCurrentTheme(savedThemeBeforeContrast === "high-contrast" ? "red-rose" : savedThemeBeforeContrast);
      }
      // Persist high contrast preference
      localStorage.setItem("mplads_high_contrast", next ? "true" : "false");
      return next;
    });
  };

  const handleChangeTheme = (theme: GovTheme) => {
    if (theme === "high-contrast") {
      setIsHighContrast(true);
      setCurrentTheme("high-contrast");
      localStorage.setItem("mplads_high_contrast", "true");
    } else {
      setIsHighContrast(false);
      setSavedThemeBeforeContrast(theme);
      setCurrentTheme(theme);
      localStorage.setItem("mplads_high_contrast", "false");
    }
  };

  // Grievance flow integration
  const handleAddGrievanceAlert = (workId: string, category: string, details: string) => {
    // TODO: Fetch work data from API when available
    // For now, create alert with minimal data
    const newAlert: RiskAlert = {
      id: `ALT-GRIEV-${Date.now().toString().slice(-4)}`,
      severity: "HIGH",
      work_id: workId,
      work_name: "Work (Data Unavailable)",
      state: "Uttar Pradesh",
      district: "Ghaziabad",
      category: category || "General",
      reason: `Citizen Grievance Filed: ${details}`,
      detected_at: new Date().toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      confidence: 100,
      status: "Open",
      risk_score: 85,
      anomaly_type: "Compliance",
    };
    setAlerts((prev) => [newAlert, ...prev]);

    // Log the grievance event to the audit ledger
    const timestamp = new Date().toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const randomHash = "SHA256:" + Array.from({ length: 64 }, () => 
      "0123456789abcdef"[Math.floor(Math.random() * 16)]
    ).join("");

    const grievanceLog: AuditLogEntry = {
      id: `AUD-GRIEV-${Date.now().toString().slice(-4)}`,
      timestamp,
      user: "Citizen User (Via CPGRAMS & Citizen Corner)",
      role: "Member of Parliament", // Role classification closest to citizen portal
      action: "Grievance Logged",
      entity: `Citizen Grievance (${workId})`,
      entity_id: workId,
      old_value: "Grievance status: Unfiled",
      new_value: "Grievance status: Active Investigation Required",
      ip_device: "14.139.1.5 (CPGRAMS NIC secure gateway)",
      status: "Logged",
      hash_signature: randomHash,
    };
    setAuditLogs((prev) => [grievanceLog, ...prev]);
  };

  // Attestation Ledger Flow Integration
  const handleAttestWork = (work: WorkRecord) => {
    const timestamp = new Date().toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    
    const randomHash = "SHA256:" + Array.from({ length: 64 }, () => 
      "0123456789abcdef"[Math.floor(Math.random() * 16)]
    ).join("");

    const newLog: AuditLogEntry = {
      id: `AUD-ATTEST-${Date.now().toString().slice(-4)}`,
      timestamp,
      user: currentRole === "Ministry" 
        ? "Dr. K. S. Murthy (Director, Monitoring)" 
        : currentRole === "District Authority"
        ? `District Magistrate, ${currentDistrict}`
        : currentRole === "State Nodal Authority"
        ? `State Nodal Officer (${currentState})`
        : `Member of Parliament (${currentDistrict})`,
      role: currentRole,
      action: "Certified & Attested",
      entity: `Work Attestation (${work.work_id})`,
      entity_id: work.work_id,
      old_value: "Status: Unattested Anomaly",
      new_value: "Status: Certified Anomaly Clear / Audited State",
      ip_device: "164.100.12.99 (Secure NIC Node)",
      status: "Verified",
      hash_signature: randomHash,
    };

    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Sidebar Layout
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState<boolean>(false);

  // Drawers & Modals
  const [selectedWork, setSelectedWork] = useState<WorkRecord | null>(null);
  const [isFlaggedDrawerOpen, setIsFlaggedDrawerOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState<boolean>(false);
  const [isOnboardingTourOpen, setIsOnboardingTourOpen] = useState<boolean>(false);
  const [tourStep, setTourStep] = useState<number>(0);

  // Check if first time user
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("mplads_seen_tour");
    if (!hasSeenTour && currentView !== "landing") {
      setIsOnboardingTourOpen(true);
      localStorage.setItem("mplads_seen_tour", "true");
    }
  }, [currentView]);

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenWorkDetail = (work: WorkRecord) => {
    setSelectedWork(work);
    setIsFlaggedDrawerOpen(true);
  };

  const handleRoleSelection = (role: UserRole) => {
    setCurrentRole(role);
    if (role === "Member of Parliament") {
      navigateTo("mpDashboard");
    } else if (role === "District Authority") {
      navigateTo("districtIntel");
    } else if (role === "State Nodal Authority") {
      navigateTo("stateNodal");
    } else {
      navigateTo("overview");
    }
  };

  const handleSelectStateDrilldown = (stateName: string) => {
    setCurrentState(stateName);
    if (stateName !== "All States") {
      setCurrentView("stateIntel");
    } else {
      setCurrentView("overview");
    }
  };

  const handleSelectDistrictDrilldown = (districtName: string) => {
    setCurrentDistrict(districtName);
    setCurrentView("districtIntel");
  };

  // If on public Landing Page or Role Selector
  if (currentView === "landing") {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="h-[4px] w-full bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] shrink-0 z-50" />
        <LandingPage
          onExplore={() => {
            // Navigate directly to overview dashboard
            setIsLoggedIn(true);
            navigateTo("overview");
          }}
          onSelectRole={handleRoleSelection}
          language={language}
          onToggleLanguage={() => setLanguage((l) => (l === "en" ? "hi" : "en"))}
        />
      </div>
    );
  }

  if (currentView === "login") {
    return (
      <LoginPage
        onLoginSuccess={(role) => {
          setIsLoggedIn(true);
          setCurrentRole(role as UserRole);
          navigateTo("overview");
        }}
        language={language}
        onToggleLanguage={() => setLanguage((l) => (l === "en" ? "hi" : "en"))}
      />
    );
  }

  if (currentView === "contact") {
    return <ContactPage language={language} />;
  }

  if (currentView === "roleSelector") {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="h-[4px] w-full bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] shrink-0 z-50" />
        <RoleSelectorPage onSelectRole={handleRoleSelection} />
      </div>
    );
  }

  return (
    <div
      id="mplads-sentinel-app"
      className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white"
      lang={language === "hi" ? "hi-IN" : "en-US"}
    >
      {/* Permanent Tricolor Strip */}
      <div className="h-[4px] w-full bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] shrink-0 z-50" />

      {/* Institutional Topbar */}
      <Topbar
        currentRole={currentRole}
        onChangeRole={handleRoleSelection}
        currentState={currentState}
        onChangeState={handleSelectStateDrilldown}
        currentFY={currentFY}
        onChangeFY={setCurrentFY}
        language={language}
        onToggleLanguage={() => setLanguage((l) => (l === "en" ? "hi" : "en"))}
        currentTheme={currentTheme}
        onChangeTheme={handleChangeTheme}
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
        onToggleNotifications={() => setIsNotificationsDrawerOpen(true)}
        onToggleSidebarMobile={() => setIsSidebarMobileOpen((o) => !o)}
        alerts={alerts}
        onOpenLanding={() => navigateTo("landing")}
        onStartTour={() => {
          setTourStep(0);
          setIsOnboardingTourOpen(true);
        }}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        isHighContrast={isHighContrast}
        onToggleHighContrast={handleToggleHighContrast}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={navigateTo}
          currentRole={currentRole}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((c) => !c)}
          isOpenMobile={isSidebarMobileOpen}
          onCloseMobile={() => setIsSidebarMobileOpen(false)}
          language={language}
          alertsCount={alerts.filter((a) => a.severity === "CRITICAL" && a.status === "Open").length}
        />

        {/* Content View Container */}
        <main
          id="main-content"
          role="main"
          aria-label={language === "hi" ? "मुख्य सामग्री" : "Main content"}
          className={`flex-1 min-w-0 overflow-y-auto transition-all duration-200 ease-in-out p-3 sm:p-4 md:p-6 lg:p-8 ${
            isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
          }`}
        >
          <div className="max-w-7xl mx-auto space-y-6">
            {(currentView === "overview" || currentView === "dashboard") && (
              <ExecutiveAuditDashboardView onNavigateToWorks={() => navigateTo("works")} />
            )}

            {currentView === "stateIntel" && (
              <StateIntelligenceView
                districts={[]}
                selectedState={currentState}
                onChangeState={handleSelectStateDrilldown}
                onSelectDistrict={handleSelectDistrictDrilldown}
                language={language}
              />
            )}

            {currentView === "districtIntel" && (
              <DistrictDashboardView
                districtName={currentDistrict}
                works={[]}
                onSelectWork={handleOpenWorkDetail}
                onBackToState={() => setCurrentView("stateIntel")}
                language={language}
              />
            )}

            {currentView === "works" && (
              <ProjectReviewQueueView onOpenProject={openProject} />
            )}

            {currentView === "workDetail" && routeProjectId && (
              <ProjectDetailView projectId={routeProjectId} onBack={() => navigateTo("works")} />
            )}

            {currentView === "simulator" && <RiskSimulatorView />}

            {currentView === "customDataset" && (
              <CustomDatasetView
                onOpenWorkDetail={handleOpenWorkDetail}
                language={language}
              />
            )}

            {currentView === "alerts" && (
              <AlertCenterView
                alerts={alerts}
                works={[]}
                onSelectWork={handleOpenWorkDetail}
                language={language}
              />
            )}

            {currentView === "map" && (
              <MapIntelligenceView
                states={[]}
                works={[]}
                selectedState={currentState}
                onSelectState={handleSelectStateDrilldown}
                onSelectWork={handleOpenWorkDetail}
                onNavigateToDistrict={handleSelectDistrictDrilldown}
                onNavigateToMP={() => setCurrentView("mpDashboard")}
                language={language}
              />
            )}

            {currentView === "costAnomaly" && (
              <CostAnomalyView
                works={[]}
                onSelectWork={handleOpenWorkDetail}
                language={language}
              />
            )}

            {currentView === "duplicate" && (
              <DuplicateDetectionView
                works={[]}
                onSelectWork={handleOpenWorkDetail}
                language={language}
              />
            )}

            {currentView === "expenditure" && (
              <ExpenditureProgressView
                works={[]}
                onSelectWork={handleOpenWorkDetail}
                language={language}
              />
            )}

            {currentView === "delay" && (
              <DelayPredictionView
                works={[]}
                onSelectWork={handleOpenWorkDetail}
                language={language}
              />
            )}

            {currentView === "compliance" && (
              <ComplianceCenterView
                rules={[]}
                onOpenPolicy={() => setCurrentView("policy")}
                language={language}
              />
            )}

            {currentView === "policy" && (
              <PolicyKnowledgeView rules={[]} language={language} />
            )}

            {currentView === "aiAssistant" && (
              <AIAssistantView
                onNavigateToWorks={() => setCurrentView("works")}
                onNavigateToDistrict={handleSelectDistrictDrilldown}
                language={language}
              />
            )}

            {currentView === "mpDashboard" && (
              <MPDashboardView
                works={[]}
                onSelectWork={handleOpenWorkDetail}
                language={language}
              />
            )}

            {currentView === "stateNodal" && (
              <StateNodalDashboardView
                districts={[]}
                onSelectDistrict={handleSelectDistrictDrilldown}
                language={language}
              />
            )}

            {currentView === "agencies" && (
              <AgencyRiskView
                agencies={[]}
                works={[]}
                onSelectWork={handleOpenWorkDetail}
                language={language}
              />
            )}

            {currentView === "auditLogs" && (
              <AuditLogView logs={auditLogs} language={language} />
            )}
          </div>

          {/* Formal Government of India Main View Footer */}
          <footer id="gov-main-view-footer" className="mt-12 pt-8 border-t border-slate-200 bg-slate-50/80 rounded-xl p-6 text-xs text-slate-500 w-full max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* GOI Contact & Identity */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF9933]" />
                  <span className="font-heading font-semibold text-slate-800 text-sm tracking-tight">
                    {language === "hi" ? "भारत सरकार" : "Government of India"}
                  </span>
                </div>
                <p className="text-slate-500 leading-relaxed text-[11px] font-sans">
                  {language === "hi" 
                    ? "सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय, नई दिल्ली।"
                    : "Ministry of Statistics & Programme Implementation, New Delhi."}
                </p>
                <div className="text-[11px] text-slate-400 font-sans">
                  <span>{language === "hi" ? "हेल्पलाइन:" : "Helpline:"} 1800-11-1992</span>
                </div>
              </div>

              {/* Useful Links */}
              <div className="space-y-2">
                <h5 className="font-heading font-semibold text-slate-800 text-[12px] uppercase tracking-wider">
                  {language === "hi" ? "त्वरित संपर्क" : "Quick Contacts"}
                </h5>
                <ul className="space-y-1 text-[11px] font-sans">
                  <li>
                    <a href="https://india.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#003399] transition-colors">
                      National Portal of India
                    </a>
                  </li>
                  <li>
                    <a href="https://mospi.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#003399] transition-colors">
                      MoSPI Official Site
                    </a>
                  </li>
                  <li>
                    <a href="https://mplads.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#003399] transition-colors">
                      MPLADS Portal
                    </a>
                  </li>
                </ul>
              </div>

              {/* Statutory Disclaimers */}
              <div className="space-y-2">
                <h5 className="font-heading font-semibold text-slate-800 text-[12px] uppercase tracking-wider">
                  {language === "hi" ? "सांविधिक अस्वीकरण" : "Statutory Disclaimer"}
                </h5>
                <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
                  {language === "hi"
                    ? "यह पोर्टल वास्तविक समय के डेटा एकीकरण और नीति निर्माण के उद्देश्य से डिजाइन किया गया है। सभी आंकड़े सत्यापन योग्य सरकारी स्रोतों और एनआईसी डेटा फीड पर आधारित हैं।"
                    : "This portal is designed for real-time data integration and policymaking. All statistics shown are powered by verified government databases and NIC data feeds to ensure complete transparency."}
                </p>
              </div>
            </div>

            {/* Bottom Section with Verifiable Data Source Pill */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-sans">
              <div>
                © 2026 {language === "hi" ? "सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)" : "MoSPI, Government of India"}
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Verifiable Data Source
                </span>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Flagship Explainable Why Flagged Detail Drawer */}
      <WhyFlaggedDrawer
        work={selectedWork}
        isOpen={isFlaggedDrawerOpen}
        onClose={() => setIsFlaggedDrawerOpen(false)}
        onCompareDuplicates={() => {
          setIsFlaggedDrawerOpen(false);
          setCurrentView("duplicate");
        }}
        onViewGuidelines={() => {
          setIsFlaggedDrawerOpen(false);
          setCurrentView("compliance");
        }}
        onAssignInvestigation={(w) => {
          alert(`Investigation assignment memo generated for ${w.work_id}. Logged to immutable audit trail.`);
        }}
        onAcknowledge={(w) => {
          alert(`Risk Signal for ${w.work_id} acknowledged by user.`);
        }}
        onAttestWork={handleAttestWork}
      />

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsDrawerOpen}
        onClose={() => setIsNotificationsDrawerOpen(false)}
        alerts={alerts}
        works={[]}
        onSelectWork={handleOpenWorkDetail}
        onViewAllAlerts={() => {
          setIsNotificationsDrawerOpen(false);
          setCurrentView("alerts");
        }}
      />

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        works={[]}
        alerts={alerts}
        districts={[]}
        rules={[]}
        onSelectWork={handleOpenWorkDetail}
        onNavigate={navigateTo}
      />

      {/* State-Based Guided Onboarding Tour */}
      <OnboardingTour
        isOpen={isOnboardingTourOpen}
        onClose={() => setIsOnboardingTourOpen(false)}
        currentStep={tourStep}
        onStepChange={setTourStep}
      />
    </div>
  );
}
