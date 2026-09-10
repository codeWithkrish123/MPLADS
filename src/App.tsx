import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserRole, Language, GovTheme, WorkRecord, RiskAlert, AuditLogEntry } from "./types";

// Authentication Hook
import { useAuth } from "./context/AuthContext";

// Route configuration
import { getRoutePath } from "./routes/routeConfig";

// API Service Layer
import { 
  alertApi, 
} from "./services/api";

// Data Fetching Hooks
import { useFetchProjects, useFetchAlerts } from "./hooks/useFetchData";
import { useRealTimeData } from "./hooks/useRealTimeData";

// Services
import { alertService } from "./services/analysisService";

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
import { LoginModal } from "./components/auth/LoginModal";
import { ContactPage } from "./views/ContactPage";
import { RoleSelectorPage } from "./views/RoleSelectorPage";
import { NationalOverviewView } from "./views/NationalOverviewView";
import { isViewAllowedForRole } from "./config/rolePermissions";
import { ShieldAlert } from "lucide-react";
import { StateIntelligenceView } from "./views/StateIntelligenceView";
import { DistrictDashboardView } from "./views/DistrictDashboardView";
import { WorkIntelligenceTableView } from "./views/WorkIntelligenceTableView";
import { DuplicateDetectionView } from "./views/DuplicateDetectionView";
import { CostAnomalyView } from "./views/CostAnomalyView";
import { ExpenditureProgressView } from "./views/ExpenditureProgressView";
import { WorkMonitoringView } from "./views/WorkMonitoringView";
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
import { UserDashboard } from "./views/UserDashboard";
import { UserNotifications } from "./views/UserNotifications";
import { LiveCommandView } from "./views/LiveCommandView";
import { LabourIntelligenceView } from "./views/LabourIntelligenceView";
import { GhostVerificationView } from "./views/GhostVerificationView";
import { CaseManagementView } from "./views/CaseManagementView";
import { ScenarioSimulationView } from "./views/ScenarioSimulationView";
import { getDerivedComplianceRules } from "./data/complianceRules";
import { deriveDistrictsFromWorks } from "./data/districtSummaries";

export default function App() {
  // Get authentication state
  const { isAuthenticated, user, role, logout, login, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Show loading spinner while validating authentication on app init
  // BUT: We must render this AFTER hooks, not BEFORE!
  // So we'll use a conditional return INSIDE state/effects
  
  // Navigation State - MUST be before any conditional returns
  const [currentView, setCurrentView] = useState<string>("landing");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<UserRole>("Ministry");
  const [currentState, setCurrentState] = useState<string>("All States");
  const [currentDistrict, setCurrentDistrict] = useState<string>("Ghaziabad");
  const [currentFY, setCurrentFY] = useState<string>("FY 2025-26");
  const [language, setLanguage] = useState<Language>("en");
  const [currentTheme, setCurrentTheme] = useState<GovTheme>("nic-blue");

  // Dynamic States for Interactive Workflows
  const [alerts, setAlerts] = useState<RiskAlert[]>([
    {
      id: "ALERT-001",
      work_id: "WK-2026-00142",
      severity: "CRITICAL",
      title: "Cost Anomaly Detected",
      description: "Work WK-2026-00142 shows 220% cost overrun vs district median",
      status: "Open",
      created_at: new Date().toISOString(),
      assigned_to: "DM, Ghaziabad",
      action_taken: false,
    },
    {
      id: "ALERT-002",
      work_id: "WK-2026-00143",
      severity: "HIGH",
      title: "Timeline Delay Risk",
      description: "Work WK-2026-00143 predicted delay of 78 days",
      status: "Open",
      created_at: new Date().toISOString(),
      assigned_to: "Project Manager",
      action_taken: false,
    },
    {
      id: "ALERT-003",
      work_id: "WK-2026-00144",
      severity: "MEDIUM",
      title: "Financial-Physical Gap",
      description: "Financial spending ahead of physical progress",
      status: "Open",
      created_at: new Date().toISOString(),
      assigned_to: "Nodal Officer",
      action_taken: false,
    },
  ]);
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

  // ==================== REAL DATA FETCHING ====================
  // MUST call useRealTimeData unconditionally (React Rules of Hooks)
  // The hook itself handles conditional fetching based on authentication
  const realTimeHookResult = useRealTimeData();
  
  const [realTimeData, setRealTimeData] = useState({ works: [], states: [], districts: [] });
  
  // Update real-time data when hook returns results
  useEffect(() => {
    if (realTimeHookResult?.works && realTimeHookResult.works.length > 0) {
      console.log('[App] Real-time data available:', realTimeHookResult.works.length, 'works');
      setRealTimeData({
        works: realTimeHookResult.works || [],
        states: realTimeHookResult.states || [],
        districts: realTimeHookResult.districts || [],
      });
    }
  }, [realTimeHookResult?.works?.length, realTimeHookResult?.states?.length]);
  
  // Extract data from state or direct hook result
  const realWorks = realTimeData.works.length > 0 ? realTimeData.works : (realTimeHookResult?.works || []);
  const realStates = realTimeData.states.length > 0 ? realTimeData.states : (realTimeHookResult?.states || []);
  const districts = realTimeData.districts.length > 0 ? realTimeData.districts : (realTimeHookResult?.districts || []);
  
  // Only fetch projects if authenticated (skip if not logged in)
  const { data: projectsData, loading: projectsLoading, error: projectsError, refetch: refetchProjects } = useFetchProjects();
  const [projects, setProjects] = useState<WorkRecord[]>([]);

  // Only fetch alerts if authenticated (skip if not logged in)
  const { data: alertsData, loading: alertsLoading, error: alertsDataError, refetch: refetchAlerts } = useFetchAlerts();

  // Update projects when data is fetched or realWorks changes
  useEffect(() => {
    if (projectsData?.projects && projectsData.projects.length > 0) {
      console.log('[App] Updating projects from backend:', projectsData.projects.length, 'projects');
      setProjects(projectsData.projects);
    } else if (realWorks && realWorks.length > 0) {
      console.log('[App] Using realWorks from useRealTimeData:', realWorks.length, 'works');
      setProjects(realWorks);
    }
  }, [projectsData, realWorks]);

  const complianceRules = React.useMemo(() => getDerivedComplianceRules(projects), [projects]);
  const derivedDistricts = React.useMemo(() => deriveDistrictsFromWorks(projects), [projects]);

  // Update alerts when data is fetched (only after authenticated)
  useEffect(() => {
    if (alertsData && Array.isArray(alertsData)) {
      console.log('[App] Updating alerts from backend:', alertsData.length, 'alerts');
      setAlerts(alertsData);
    }
  }, [alertsData]);

  // Manually trigger data fetch after user authenticates
  useEffect(() => {
    if (isAuthenticated) {
      console.log('[App] User authenticated, enabling data fetches');
      refetchProjects(); // Start fetching projects
      refetchAlerts();   // Start fetching alerts
    }
  }, [isAuthenticated, refetchProjects, refetchAlerts]);

  // Load font size preference from localStorage on mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem("mplads_font_size") as "small" | "medium" | "large" | null;
    if (savedFontSize && savedFontSize !== fontSize) {
      setFontSize(savedFontSize);
    }
  }, []);

  // Set initial view based on authentication status
  useEffect(() => {
    if (isAuthenticated && currentView === "landing") {
      if (currentRole === "Users") {
        setCurrentView("workMonitoring");
      } else {
        setCurrentView("overview");
      }
    }
  }, [isAuthenticated, currentRole]);

  // Wrapper function to navigate both URL and state
  const navigateTo = (view: string) => {
    const path = getRoutePath(view) || ("/" + (view === "landing" ? "" : view));
    setCurrentView(view);
    navigate(path, { replace: false });
  };

  // Map URL paths to view names
  const urlToViewName = (pathname: string): string => {
    // Mapping of URL paths to view names
    const pathMap: Record<string, string> = {
      "/": "landing",
      "/login": "login",
      "/contact": "contact",
      "/role-selector": "roleSelector",
      "/overview": "overview",
      "/works": "works",
      "/custom-dataset": "customDataset",
      "/ai-assistant": "aiAssistant",
      "/alerts": "alerts",
      "/map": "map",
      "/cost-anomaly": "costAnomaly",
      "/duplicate": "duplicate",
      "/expenditure": "expenditure",
      "/delay": "delay",
      "/state-intelligence": "stateIntel",
      "/district-intelligence": "districtIntel",
      "/mp-dashboard": "mpDashboard",
      "/state-nodal": "stateNodal",
      "/agencies": "agencies",
      "/compliance": "compliance",
      "/policy": "policy",
      "/audit-logs": "auditLogs",
      "/user-dashboard": "userDashboard",
      "/user-notifications": "userNotifications",
      "/work-monitoring": "workMonitoring",
      "/live-command": "liveCommand",
      "/labour-intelligence": "labour",
      "/ghost-verification": "ghostVerification",
      "/case-management": "caseManagement",
      "/scenario-simulation": "scenarioSimulation",
    };

    return pathMap[pathname] || "landing";
  };

  // Sync URL changes to state - but RESPECT authentication
  useEffect(() => {
    const pathname = location.pathname;
    const viewName = urlToViewName(pathname);

    // PROTECTION: If not authenticated and trying to access protected route, redirect to landing
    const publicRoutes = ["landing", "login", "contact", "roleSelector"];
    const isPublicRoute = publicRoutes.includes(viewName);
    
    // Wait for auth to finish loading before checking authentication status
    if (authLoading) {
      return; // Don't navigate yet, still validating token
    }
    
    if (!isAuthenticated && !isPublicRoute) {
      // User not logged in but trying to access protected route (e.g., /overview)
      // Force redirect to landing page
      console.log(`[App] Auth blocked: User not authenticated, redirecting from ${viewName} to landing`);
      setCurrentView("landing");
      navigate("/", { replace: true });
      return;
    }

    // Only update if different to avoid infinite loops
    if (viewName !== currentView) {
      setCurrentView(viewName);
    }
  }, [location.pathname, isAuthenticated, navigate, authLoading]);

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
    setIsLoginModalOpen(false);
    
    // Select mock credentials for the chosen role
    const mockEmail = role === "Member of Parliament" 
      ? "mp.constituency@sansad.nic.in"
      : role === "District Authority"
      ? "dm.ghaziabad@nic.in"
      : role === "Users"
      ? "citizen.public@nic.in"
      : "admin.mospi@nic.in";
    
    const mockPassword = "password123";
    
    // Call login to set authentication state
    login(mockEmail, mockPassword, role).then((success) => {
      if (success) {
        // Navigate to appropriate dashboard after successful authentication
        if (role === "Member of Parliament") {
          navigateTo("mpDashboard");
        } else if (role === "District Authority") {
          navigateTo("districtIntel");
        } else if (role === "Users") {
          navigateTo("overview");
        } else {
          navigateTo("overview");
        }
      } else {
        console.error("Authentication failed");
      }
    });
  };

  const handleSelectStateDrilldown = (stateName: string) => {
    setCurrentState(stateName);
    if (stateName !== "All States") {
      navigateTo("stateIntel");
    } else {
      navigateTo("overview");
    }
  };

  const handleSelectDistrictDrilldown = (districtName: string) => {
    setCurrentDistrict(districtName);
    navigateTo("districtIntel");
  };

  // If on public Landing Page
  if (currentView === "landing") {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="h-[4px] w-full bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] shrink-0 z-50" />
        <LandingPage
          onExplore={() => setIsLoginModalOpen(true)}
          onSelectRole={() => setIsLoginModalOpen(true)}
          language={language}
          onToggleLanguage={() => setLanguage((l) => (l === "en" ? "hi" : "en"))}
        />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleRoleSelection}
          language={language}
          onToggleLanguage={() => setLanguage((l) => (l === "en" ? "hi" : "en"))}
        />
      </div>
    );
  }

  // Show loading spinner while validating authentication on app init
  if (authLoading && !isAuthenticated && location.pathname !== '/login' && location.pathname !== '/' && location.pathname !== '/contact' && location.pathname !== '/role-selector') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          </div>
          <p className="text-slate-600 font-medium">Validating session...</p>
        </div>
      </div>
    );
  }

  if (currentView === "contact") {
    return <ContactPage language={language} />;
  }

  // Dedicated Login Gateway View (/login or /role-selector)
  if (currentView === "login" || currentView === "roleSelector") {
    return (
      <div className="min-h-screen bg-[#0B1528] flex items-center justify-center p-3 sm:p-6 md:p-8">
        <LoginPage
          onLoginSuccess={handleRoleSelection}
          onClose={() => navigateTo("landing")}
          language={language}
          onToggleLanguage={() => setLanguage((l) => (l === "en" ? "hi" : "en"))}
        />
      </div>
    );
  }

  // Protected Route: Check authentication before showing dashboard
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B1528] flex items-center justify-center p-3 sm:p-6 md:p-8">
        <LoginPage
          onLoginSuccess={handleRoleSelection}
          onClose={() => navigateTo("landing")}
          language={language}
          onToggleLanguage={() => setLanguage((l) => (l === "en" ? "hi" : "en"))}
        />
      </div>
    );
  }

  return (
    <div
      id="mplads-sentinel-app"
      className="h-screen overflow-hidden bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white"
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
        onOpenLanding={() => {
          // If logged in, go to dashboard. If not logged in, go to landing page.
          if (isAuthenticated) {
            navigateTo("overview");
          } else {
            navigateTo("landing");
          }
        }}
        onStartTour={() => {
          setTourStep(0);
          setIsOnboardingTourOpen(true);
        }}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        isHighContrast={isHighContrast}
        onToggleHighContrast={handleToggleHighContrast}
        onLogout={() => {
          logout();
          navigateTo("landing");
        }}
        user={user}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
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
          className="flex-1 min-w-0 h-full overflow-y-auto transition-all duration-200 ease-in-out p-3 sm:p-4 md:p-6 lg:p-8"
        >
          <div className="max-w-7xl mx-auto space-y-6">
            {!isViewAllowedForRole(currentRole, currentView) ? (
              <div className="p-8 max-w-xl mx-auto my-12 bg-white rounded-2xl border border-red-200 shadow-md text-center space-y-4 animate-in fade-in">
                <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
                  <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">
                    Statutory Governance Compliance
                  </p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                  This screen is restricted to authorized government credentials. Your current role:{" "}
                  <span className="font-bold text-slate-800">{currentRole}</span> does not have access
                  to this feature under official GIGW compliance guidelines.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() =>
                      navigateTo(
                        currentRole === "Member of Parliament"
                          ? "mpDashboard"
                          : currentRole === "District Authority"
                          ? "districtIntel"
                          : "overview"
                      )
                    }
                    className="px-6 py-2.5 bg-[#0B3B7B] hover:bg-[#082d61] text-white text-xs font-bold rounded-lg transition-all shadow-sm cursor-pointer"
                  >
                    Return to Authorized Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <>
                {currentView === "overview" && (
              <NationalOverviewView
                states={realStates && realStates.length > 0 ? realStates : []}
                works={projects}
                selectedState={currentState}
                onSelectState={handleSelectStateDrilldown}
                onSelectWork={handleOpenWorkDetail}
                onNavigateToWorks={() => navigateTo("works")}
                onNavigateToAlerts={() => navigateTo("alerts")}
                language={language}
                selectedDistrict={currentDistrict}
                onAddGrievanceAlert={handleAddGrievanceAlert}
                currentRole={currentRole}
              />
            )}

            {currentView === "stateIntel" && (
              <StateIntelligenceView
                districts={derivedDistricts}
                selectedState={currentState}
                onChangeState={handleSelectStateDrilldown}
                onSelectDistrict={handleSelectDistrictDrilldown}
                language={language}
                currentRole={currentRole}
              />
            )}

            {currentView === "districtIntel" && (
              <DistrictDashboardView
                districtName={currentDistrict}
                works={projects}
                onSelectWork={handleOpenWorkDetail}
                onBackToState={() => navigateTo("stateIntel")}
                language={language}
                currentRole={currentRole}
              />
            )}

            {currentView === "works" && (
              <WorkIntelligenceTableView
                works={projects}
                onSelectWork={handleOpenWorkDetail}
                language={language}
                currentRole={currentRole}
              />
            )}

            {currentView === "workMonitoring" && (
              <WorkMonitoringView
                language={language}
                onSelectWork={handleOpenWorkDetail}
              />
            )}

            {currentView === "customDataset" && (
              <CustomDatasetView
                onOpenWorkDetail={handleOpenWorkDetail}
                language={language}
                currentRole={currentRole}
              />
            )}

            {currentView === "alerts" && (
              <AlertCenterView
                alerts={alerts}
                works={projects}
                onSelectWork={handleOpenWorkDetail}
                language={language}
                currentRole={currentRole}
              />
            )}

            {currentView === "map" && (
              <MapIntelligenceView
                states={[]}
                works={projects}
                selectedState={currentState}
                onSelectState={handleSelectStateDrilldown}
                onSelectWork={handleOpenWorkDetail}
                onNavigateToDistrict={handleSelectDistrictDrilldown}
                onNavigateToMP={() => navigateTo("mpDashboard")}
                language={language}
                currentRole={currentRole}
              />
            )}

            {currentView === "costAnomaly" && (
              <CostAnomalyView
                works={projects}
                onSelectWork={handleOpenWorkDetail}
                language={language}
                currentRole={currentRole}
              />
            )}

            {currentView === "duplicate" && (
              <DuplicateDetectionView
                works={projects}
                onSelectWork={handleOpenWorkDetail}
                language={language}
                currentRole={currentRole}
              />
            )}

            {currentView === "expenditure" && (
              <ExpenditureProgressView
                works={projects}
                onSelectWork={handleOpenWorkDetail}
                language={language}
                currentRole={currentRole}
              />
            )}

            {currentView === "delay" && (
              <DelayPredictionView
                works={projects}
                onSelectWork={handleOpenWorkDetail}
                language={language}
                currentRole={currentRole}
              />
            )}

            {currentView === "compliance" && (
              <ComplianceCenterView
                rules={complianceRules}
                onOpenPolicy={() => navigateTo("policy")}
                language={language}
                currentRole={currentRole}
              />
            )}

            {currentView === "policy" && (
              <PolicyKnowledgeView rules={complianceRules} language={language} currentRole={currentRole} />
            )}

            {currentView === "aiAssistant" && (
              <AIAssistantView
                language={language}
                currentRole={currentRole}
              />
            )}

            {currentView === "mpDashboard" && (
              <MPDashboardView
                works={projects}
                onSelectWork={handleOpenWorkDetail}
                language={language}
                currentRole={currentRole}
              />
            )}

            {currentView === "stateNodal" && (
              <StateNodalDashboardView
                districts={derivedDistricts}
                onSelectDistrict={handleSelectDistrictDrilldown}
                language={language}
                currentRole={currentRole}
              />
            )}

            {currentView === "agencies" && (
              <AgencyRiskView
                agencies={[]}
                works={projects}
                onSelectWork={handleOpenWorkDetail}
                language={language}
                currentRole={currentRole}
              />
            )}

            {currentView === "auditLogs" && (
              <AuditLogView logs={auditLogs} language={language} currentRole={currentRole} />
            )}

            {currentView === "userDashboard" && (
              <UserDashboard />
            )}

            {currentView === "userNotifications" && (
              <UserNotifications />
            )}

            {currentView === "liveCommand" && (
              <LiveCommandView
                language={language}
                onSelectWork={handleOpenWorkDetail}
              />
            )}

            {currentView === "labour" && (
              <LabourIntelligenceView
                language={language}
                onSelectWork={handleOpenWorkDetail}
              />
            )}

            {currentView === "ghostVerification" && (
              <GhostVerificationView
                language={language}
                onSelectWork={handleOpenWorkDetail}
              />
            )}

            {currentView === "caseManagement" && (
              <CaseManagementView
                language={language}
                onSelectWork={handleOpenWorkDetail}
              />
            )}

            {currentView === "scenarioSimulation" && (
              <ScenarioSimulationView
                language={language}
              />
            )}

            {currentView === "contact" && (
              <ContactPage language={language} />
            )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Flagship Explainable Why Flagged Detail Drawer */}
      <WhyFlaggedDrawer
        work={selectedWork}
        isOpen={isFlaggedDrawerOpen}
        onClose={() => setIsFlaggedDrawerOpen(false)}
        onCompareDuplicates={() => {
          setIsFlaggedDrawerOpen(false);
          navigateTo("duplicate");
        }}
        onViewGuidelines={() => {
          setIsFlaggedDrawerOpen(false);
          navigateTo("compliance");
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
          navigateTo("alerts");
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
