/**
 * Centralized Route Configuration for MPLADS Sentinel
 * Maps all application routes with metadata for navigation, breadcrumbs, and permissions
 * 
 * ROLE-BASED ACCESS CONTROL:
 * - Ministry: National-level, all pages
 * - State Nodal Authority: State-level, state/district/agency pages
 * - District Authority: District-level, district/agency pages
 * - Member of Parliament: Constituency-level, MP dashboard
 * - Users (Public): Public data only, limited project info
 */

import { UserRole } from "../types";

export interface RouteConfig {
  path: string;
  name: string;
  label: string;
  labelHi: string;
  component?: string; // For reference
  icon?: string; // Icon identifier for sidebar
  group?: string;
  groupHi?: string;
  requiresAuth?: boolean;
  roles?: UserRole[]; // Roles allowed to access this route (empty = all authenticated users)
  badge?: string;
  badgeColor?: string;
  description?: string;
  descriptionHi?: string;
}

export const ROUTE_CONFIG: Record<string, RouteConfig> = {
  // Public Routes
  landing: {
    path: "/",
    name: "landing",
    label: "Landing",
    labelHi: "होम पेज",
    requiresAuth: false,
  },
  login: {
    path: "/login",
    name: "login",
    label: "Sign In",
    labelHi: "साइन इन",
    requiresAuth: false,
  },
  signup: {
    path: "/signup",
    name: "signup",
    label: "Register",
    labelHi: "पंजीकरण करें",
    requiresAuth: false,
  },

  contact: {
    path: "/contact",
    name: "contact",
    label: "Contact Us",
    labelHi: "हमसे संपर्क करें",
    requiresAuth: false,
  },
  roleSelector: {
    path: "/role-selector",
    name: "roleSelector",
    label: "Select Role",
    labelHi: "भूमिका चुनें",
    requiresAuth: false,
  },

  // Protected: Main Dashboard Routes
  overview: {
    path: "/overview",
    name: "overview",
    label: "National Overview",
    labelHi: "राष्ट्रीय अवलोकन",
    requiresAuth: true,
    roles: ["Ministry", "State Nodal Authority", "District Authority", "Member of Parliament"],
    icon: "LayoutDashboard",
    group: "Aam Nagarik Services & Projects",
    groupHi: "आम नागरिक सेवाएँ और प्रोजेक्ट्स",
    description: "Real-time overview of all MPLADS projects across India",
    descriptionHi: "पूरे भारत में सभी एमपीएलएडीएस परियोजनाओं का वास्तविक समय अवलोकन",
  },
  works: {
    path: "/works",
    name: "works",
    label: "Project Intelligence",
    labelHi: "प्रोजेक्ट इंटेलिजेंस",
    requiresAuth: true,
    roles: ["Ministry", "State Nodal Authority", "District Authority", "Member of Parliament", "Users"],
    icon: "FileSpreadsheet",
    group: "Aam Nagarik Services & Projects",
    groupHi: "आम नागरिक सेवाएँ और प्रोजेक्ट्स",
    badge: "12.8k",
    description: "Comprehensive table view of all flagged and active projects",
    descriptionHi: "सभी फ्लैग किए गए और सक्रिय परियोजनाओं का व्यापक तालिका दृश्य",
  },
  workMonitoring: {
    path: "/work-monitoring",
    name: "workMonitoring",
    label: "CSV Work Ingestion & Monitoring",
    labelHi: "सीएसवी कार्य आवंटन व प्रगति निगरानी",
    requiresAuth: true,
    roles: ["Ministry", "State Nodal Authority", "District Authority", "Member of Parliament", "Users"],
    icon: "TrendingUp",
    group: "Aam Nagarik Services & Projects",
    groupHi: "आम नागरिक सेवाएँ और प्रोजेक्ट्स",
    badge: "AI Verification",
    badgeColor: "bg-blue-600 text-white",
    description: "CSV Progress Verification, ML Image, Document OCR, Labour Fusion & Investigation Engine",
    descriptionHi: "सीएसवी प्रगति सत्यापन, छवि एमएल, दस्तावेज़ ओसीआर और बहुआयामी साक्ष्य संलयन",
  },
  liveCommand: {
    path: "/live-command",
    name: "liveCommand",
    label: "Live Command & Telemetry",
    labelHi: "लाइव कमान व टेलीमेट्री",
    requiresAuth: true,
    roles: ["Ministry", "State Nodal Authority", "District Authority", "Member of Parliament", "Users"],
    icon: "Radio",
    group: "Aam Nagarik Services & Projects",
    groupHi: "आम नागरिक सेवाएँ और प्रोजेक्ट्स",
    badge: "Live",
    badgeColor: "bg-emerald-600 text-white",
    description: "Continuous autonomous surveillance of MPLADS fund velocity and satellite feeds",
    descriptionHi: "एमपीएलएडीएस फंड वेग और उपग्रह फीड की निरंतर स्वायत्त निगरानी",
  },
  labour: {
    path: "/labour-intelligence",
    name: "labour",
    label: "Labour Intelligence",
    labelHi: "श्रमिक बुद्धिमत्ता",
    requiresAuth: true,
    roles: ["Ministry", "State Nodal Authority", "District Authority", "Member of Parliament"],
    icon: "Users",
    group: "AI Anomaly Detection",
    groupHi: "AI विसंगति पहचान",
    badge: "Aadhaar",
    badgeColor: "bg-purple-600 text-white",
    description: "AI-powered biometric muster roll analysis and ghost worker detection",
    descriptionHi: "एआई-संचालित बायोमेट्रिक मस्टर रोल विश्लेषण और फर्जी मजदूर पहचान",
  },
  ghostVerification: {
    path: "/ghost-verification",
    name: "ghostVerification",
    label: "Ghost Verification",
    labelHi: "भूतिया संपत्ति सत्यापन",
    requiresAuth: true,
    roles: ["Ministry", "State Nodal Authority", "District Authority", "Member of Parliament"],
    icon: "ShieldCheck",
    group: "AI Anomaly Detection",
    groupHi: "AI विसंगति पहचान",
    badge: "Collusion",
    badgeColor: "bg-red-600 text-white",
    description: "Multi-spectral computer vision, document OCR, and satellite spatial validation",
    descriptionHi: "बहु-स्पेक्ट्रमी कंप्यूटर विज़न, दस्तावेज़ ओसीआर, और उपग्रह स्थानिक सत्यापन",
  },
  customDataset: {
    path: "/custom-dataset",
    name: "customDataset",
    label: "Download Project Records",
    labelHi: "प्रोजेक्ट रिकॉर्ड डाउनलोड करें",
    requiresAuth: true,
    roles: ["Ministry", "State Nodal Authority", "District Authority"],
    icon: "Database",
    group: "Aam Nagarik Services & Projects",
    groupHi: "आम नागरिक सेवाएँ और प्रोजेक्ट्स",
    badge: "New",
    badgeColor: "bg-blue-50 text-[#1D4ED8] border border-blue-200",
    description: "Create and download custom datasets for analysis",
    descriptionHi: "विश्लेषण के लिए कस्टम डेटासेट बनाएं और डाउनलोड करें",
  },
  aiAssistant: {
    path: "/ai-assistant",
    name: "aiAssistant",
    label: "Help Chatbot & Voice Support",
    labelHi: "सहायता चैटबॉट और वॉइस समर्थन",
    requiresAuth: true,
    roles: ["Ministry", "State Nodal Authority", "District Authority", "Member of Parliament", "Users"],
    icon: "Bot",
    group: "Aam Nagarik Services & Projects",
    groupHi: "आम नागरिक सेवाएँ और प्रोजेक्ट्स",
    badge: "24x7 Help",
    badgeColor: "bg-blue-50 text-[#1D4ED8] border border-blue-200",
    description: "AI-powered assistant for 24/7 support and guidance",
    descriptionHi: "24/7 समर्थन और मार्गदर्शन के लिए AI-संचालित सहायक",
  },

  // Primary Intelligence Routes
  alerts: {
    path: "/alerts",
    name: "alerts",
    label: "Risk Alerts & Insights",
    labelHi: "जोखिम चेतावनियाँ और अंतर्दृष्टि",
    requiresAuth: true,
    roles: ["Ministry", "State Nodal Authority", "District Authority", "Member of Parliament"],
    icon: "AlertTriangle",
    group: "Primary Intelligence",
    groupHi: "प्राथमिक इंटेलिजेंस",
    badge: "5",
    badgeColor: "bg-[#DC2626] text-white",
    description: "Real-time alerts for anomalies and compliance issues",
    descriptionHi: "विसंगतियों और अनुपालन मुद्दों के लिए वास्तविक समय सतर्कताएँ",
  },
  map: {
    path: "/map",
    name: "map",
    label: "Map Intelligence",
    labelHi: "मानचित्र खुफिया",
    requiresAuth: true,
    roles: ["Ministry", "State Nodal Authority", "District Authority", "Member of Parliament", "Users"],
    icon: "Map",
    group: "Primary Intelligence",
    groupHi: "प्राथमिक इंटेलिजेंस",
    description: "Geographic visualization of projects and anomalies",
    descriptionHi: "परियोजनाओं और विसंगतियों की भौगोलिक दृश्यमान",
  },

  // AI Anomaly Detection Routes
  costAnomaly: {
    path: "/cost-anomaly",
    name: "costAnomaly",
    label: "Cost Anomaly & Benchmarks",
    labelHi: "लागत विसंगति और बेंचमार्क",
    requiresAuth: true,
    roles: ["Ministry", "State Nodal Authority", "District Authority"],
    icon: "BarChart3",
    group: "AI Anomaly Detection",
    groupHi: "AI विसंगति पहचान",
    badge: "+220%",
    description: "Identify cost overruns and budget anomalies",
    descriptionHi: "लागत अधिक व्यय और बजट विसंगतियों की पहचान करें",
  },
  duplicate: {
    path: "/duplicate",
    name: "duplicate",
    label: "Duplicate Detection",
    labelHi: "डुप्लिकेट पहचान",
    requiresAuth: true,
    roles: ["Ministry", "State Nodal Authority", "District Authority"],
    icon: "Copy",
    group: "AI Anomaly Detection",
    groupHi: "AI विसंगति पहचान",
    badge: "AI 94%",
    description: "AI-powered detection of duplicate and overlapping projects",
    descriptionHi: "डुप्लिकेट और ओवरलैपिंग परियोजनाओं की AI-संचालित पहचान",
  },
  expenditure: {
    path: "/expenditure",
    name: "expenditure",
    label: "Expenditure vs Progress",
    labelHi: "व्यय बनाम प्रगति",
    requiresAuth: true,
    roles: ["Ministry", "State Nodal Authority", "District Authority"],
    icon: "Sliders",
    group: "AI Anomaly Detection",
    groupHi: "AI विसंगति पहचान",
    badge: "Delta",
    description: "Compare expenditure patterns against project progress",
    descriptionHi: "परियोजना प्रगति के खिलाफ व्यय पैटर्न की तुलना करें",
  },
  delay: {
    path: "/delay",
    name: "delay",
    label: "Delay Prediction",
    labelHi: "देरी पूर्वानुमान",
    requiresAuth: true,
    roles: ["Ministry", "State Nodal Authority", "District Authority"],
    icon: "Clock",
    group: "AI Anomaly Detection",
    groupHi: "AI विसंगति पहचान",
    badge: "Forecast",
    description: "Predictive analytics for project delay identification",
    descriptionHi: "परियोजना देरी पहचान के लिए भविष्यवाणीपूर्ण विश्लेषण",
  },
  caseManagement: {
    path: "/case-management",
    name: "caseManagement",
    label: "Case Management & Escalation",
    labelHi: "मामला प्रबंधन व वृद्धि",
    requiresAuth: true,
    roles: ["Ministry", "State Nodal Authority", "District Authority", "Member of Parliament", "Users"],
    icon: "FileText",
    group: "Governance & Audit",
    groupHi: "शासन और लेखा परीक्षा",
    badge: "Cases",
    badgeColor: "bg-amber-100 text-amber-800 border border-amber-300 font-bold",
    description: "Institutional escalation workflows, case docketing, and audit notes",
    descriptionHi: "संस्थागत वृद्धि कार्यप्रवाह, मामला डॉकेटिंग, और लेखा परीक्षा नोट्स",
  },
  scenarioSimulation: {
    path: "/scenario-simulation",
    name: "scenarioSimulation",
    label: "Threat Scenario Simulation",
    labelHi: "खतरा परिदृश्य अनुकरण",
    requiresAuth: true,
    roles: ["Ministry", "State Nodal Authority", "District Authority", "Member of Parliament", "Users"],
    icon: "Cpu",
    group: "Governance & Audit",
    groupHi: "शासन और लेखा परीक्षा",
    badge: "Simulator",
    badgeColor: "bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold",
    description: "Deterministic test sandbox for jury evaluators and synthetic fraud payload injection",
    descriptionHi: "जूरी मूल्यांकनकर्ताओं और कृत्रिम धोखाधड़ी पेलोड इंजेक्शन के लिए निश्चित परीक्षण सैंडबॉक्स",
  },

  // Jurisdiction & Workspace Routes
  stateIntel: {
    path: "/state-intelligence",
    name: "stateIntel",
    label: "State Intelligence",
    labelHi: "राज्य खुफिया",
    requiresAuth: true,
    roles: ["Ministry", "State Nodal Authority"],
    icon: "Globe",
    group: "Jurisdiction & Workspaces",
    groupHi: "न्यायक्षेत्र और कार्यस्थान",
    description: "State-level dashboard with district-wise breakdown",
    descriptionHi: "राज्य स्तरीय डैशबोर्ड जिला-वार विभाजन के साथ",
  },
  districtIntel: {
    path: "/district-intelligence",
    name: "districtIntel",
    label: "District Dashboard",
    labelHi: "जिला डैशबोर्ड",
    requiresAuth: true,
    roles: ["Ministry", "State Nodal Authority", "District Authority"],
    icon: "MapPin",
    group: "Jurisdiction & Workspaces",
    groupHi: "न्यायक्षेत्र और कार्यस्थान",
    badge: "Ghaziabad",
    description: "District-level project tracking and performance metrics",
    descriptionHi: "जिला स्तरीय परियोजना ट्रैकिंग और प्रदर्शन मेट्रिक्स",
  },
  mpDashboard: {
    path: "/mp-dashboard",
    name: "mpDashboard",
    label: "MP Constituency Dashboard",
    labelHi: "सांसद निर्वाचन क्षेत्र डैशबोर्ड",
    requiresAuth: true,
    icon: "Landmark",
    group: "Jurisdiction & Workspaces",
    groupHi: "न्यायक्षेत्र और कार्यस्थान",
    roles: ["Member of Parliament"],
    description: "Member of Parliament constituency-specific dashboard",
    descriptionHi: "सांसद निर्वाचन क्षेत्र-विशिष्ट डैशबोर्ड",
  },
  stateNodal: {
    path: "/state-nodal",
    name: "stateNodal",
    label: "State Nodal Dashboard",
    labelHi: "राज्य नोडल डैशबोर्ड",
    requiresAuth: true,
    icon: "LayoutDashboard",
    group: "Jurisdiction & Workspaces",
    groupHi: "न्यायक्षेत्र और कार्यस्थान",
    roles: ["State Nodal Authority"],
    description: "State nodal officer comprehensive dashboard",
    descriptionHi: "राज्य नोडल अधिकारी व्यापक डैशबोर्ड",
  },
  agencies: {
    path: "/agencies",
    name: "agencies",
    label: "Agency Risk Dashboard",
    labelHi: "एजेंसी जोखिम डैशबोर्ड",
    requiresAuth: true,
    roles: ["Ministry", "State Nodal Authority", "District Authority"],
    icon: "Building2",
    group: "Jurisdiction & Workspaces",
    groupHi: "न्यायक्षेत्र और कार्यस्थान",
    description: "Implementation agency performance and risk assessment",
    descriptionHi: "कार्यान्वयन एजेंसी प्रदर्शन और जोखिम मूल्यांकन",
  },

  // Governance & Audit Routes
  compliance: {
    path: "/compliance",
    name: "compliance",
    label: "Compliance Center",
    labelHi: "अनुपालन केंद्र",
    requiresAuth: true,
    roles: ["Ministry", "State Nodal Authority", "District Authority"],
    icon: "ShieldCheck",
    group: "Governance & Audit",
    groupHi: "शासन और ऑडिट",
    description: "Policy compliance and governance framework",
    descriptionHi: "नीति अनुपालन और शासन ढांचा",
  },
  policy: {
    path: "/policy",
    name: "policy",
    label: "Policy Knowledge Base",
    labelHi: "नीति ज्ञान आधार",
    requiresAuth: true,
    roles: ["Ministry", "State Nodal Authority", "District Authority"],
    icon: "BookOpen",
    group: "Governance & Audit",
    groupHi: "शासन और ऑडिट",
    badge: "2023 v4",
    description: "Centralized policy guidelines and compliance documents",
    descriptionHi: "केंद्रीकृत नीति दिशानिर्देश और अनुपालन दस्तावेज",
  },
  auditLogs: {
    path: "/audit-logs",
    name: "auditLogs",
    label: "Audit Logs & History",
    labelHi: "ऑडिट लॉग और इतिहास",
    requiresAuth: true,
    roles: ["Ministry"],
    icon: "History",
    group: "Governance & Audit",
    groupHi: "शासन और ऑडिट",
    description: "Immutable audit trail of system actions and user activities",
    descriptionHi: "सिस्टम कार्यों और उपयोगकर्ता गतिविधियों का अपरिवर्तनीय ऑडिट ट्रेल",
  },

  // Users (Public) Role Specific Pages
  userDashboard: {
    path: "/user-dashboard",
    name: "userDashboard",
    label: "My Projects",
    labelHi: "मेरी परियोजनाएं",
    requiresAuth: true,
    roles: ["Users"],
    icon: "LayoutDashboard",
    group: "Public Services",
    groupHi: "सार्वजनिक सेवाएं",
    description: "View MPLADS projects in your area and track progress",
    descriptionHi: "अपने क्षेत्र में एमपीएलएडीएस परियोजनाएं देखें और प्रगति ट्रैक करें",
  },
  userNotifications: {
    path: "/user-notifications",
    name: "userNotifications",
    label: "Project Updates",
    labelHi: "परियोजना अपडेट",
    requiresAuth: true,
    roles: ["Users"],
    icon: "Bell",
    group: "Public Services",
    groupHi: "सार्वजनिक सेवाएं",
    description: "Receive updates on nearby projects and completion status",
    descriptionHi: "निकटवर्ती परियोजनाओं और पूर्णता स्थिति पर अपडेट प्राप्त करें",
  },
};

/**
 * Get all routes organized by group
 */
export const getRoutesByGroup = () => {
  const grouped: Record<string, RouteConfig[]> = {};

  Object.values(ROUTE_CONFIG).forEach((route) => {
    if (route.group) {
      if (!grouped[route.group]) {
        grouped[route.group] = [];
      }
      grouped[route.group].push(route);
    }
  });

  return grouped;
};

/**
 * Get route config by name
 */
export const getRouteByName = (name: string): RouteConfig | undefined => {
  return ROUTE_CONFIG[name];
};

/**
 * Get route path by name
 */
export const getRoutePath = (name: string): string => {
  const route = ROUTE_CONFIG[name];
  return route?.path || "/";
};

/**
 * Check if route requires authentication
 */
export const isProtectedRoute = (name: string): boolean => {
  const route = ROUTE_CONFIG[name];
  return route?.requiresAuth ?? false;
};

/**
 * Check if user can access route
 */
export const canAccessRoute = (routeName: string, userRole?: UserRole): boolean => {
  const route = ROUTE_CONFIG[routeName];
  if (!route) return false;

  // If route has specific role restrictions
  if (route.roles && route.roles.length > 0) {
    return userRole ? route.roles.includes(userRole) : false;
  }

  return true;
};
