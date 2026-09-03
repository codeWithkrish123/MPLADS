/**
 * Centralized Route Configuration for MPLADS Sentinel
 * Maps all application routes with metadata for navigation, breadcrumbs, and permissions
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
  roles?: UserRole[]; // Roles allowed to access this route
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
    icon: "FileSpreadsheet",
    group: "Aam Nagarik Services & Projects",
    groupHi: "आम नागरिक सेवाएँ और प्रोजेक्ट्स",
    badge: "12.8k",
    description: "Comprehensive table view of all flagged and active projects",
    descriptionHi: "सभी फ्लैग किए गए और सक्रिय परियोजनाओं का व्यापक तालिका दृश्य",
  },
  customDataset: {
    path: "/custom-dataset",
    name: "customDataset",
    label: "Download Project Records",
    labelHi: "प्रोजेक्ट रिकॉर्ड डाउनलोड करें",
    requiresAuth: true,
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
    icon: "Clock",
    group: "AI Anomaly Detection",
    groupHi: "AI विसंगति पहचान",
    badge: "Forecast",
    description: "Predictive analytics for project delay identification",
    descriptionHi: "परियोजना देरी पहचान के लिए भविष्यवाणीपूर्ण विश्लेषण",
  },

  // Jurisdiction & Workspace Routes
  stateIntel: {
    path: "/state-intelligence",
    name: "stateIntel",
    label: "State Intelligence",
    labelHi: "राज्य खुफिया",
    requiresAuth: true,
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
    icon: "History",
    group: "Governance & Audit",
    groupHi: "शासन और ऑडिट",
    description: "Immutable audit trail of system actions and user activities",
    descriptionHi: "सिस्टम कार्यों और उपयोगकर्ता गतिविधियों का अपरिवर्तनीय ऑडिट ट्रेल",
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
