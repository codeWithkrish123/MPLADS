import { UserRole } from "../types";

export type AccessLevel = "FULL" | "SCOPED" | "LIMITED" | "RESTRICTED";

export interface ScreenPermission {
  screenName: string;
  viewId: string;
  Ministry: AccessLevel;
  "Member of Parliament": AccessLevel;
  "District Authority": AccessLevel;
  "State Nodal Authority"?: AccessLevel;
  Users: AccessLevel; // Citizen
  description?: string;
}

/**
 * Statutory RBAC Matrix as specified by Government Guidelines:
 * 🟢 FULL: Unrestricted national access, full exports & administrative actions
 * 🔵 SCOPED: Filtered to specific jurisdiction (Constituency for MP, District for DM)
 * 🟡 LIMITED: Read-only summary, high-level indicators, limited public info
 * 🔴 RESTRICTED: No access, hidden from menu or locked with unauthorized notice
 */
export const ROLE_PERMISSIONS_MATRIX: Record<string, ScreenPermission> = {
  overview: {
    screenName: "Dashboard",
    viewId: "overview",
    Ministry: "FULL",
    "Member of Parliament": "SCOPED",
    "District Authority": "SCOPED",
    Users: "LIMITED",
    description: "National & local developmental intelligence overview",
  },
  works: {
    screenName: "Project Summary",
    viewId: "works",
    Ministry: "FULL",
    "Member of Parliament": "SCOPED",
    "District Authority": "SCOPED",
    Users: "LIMITED",
    description: "Detailed work milestones, expenditure, and physical progress",
  },
  customDataset: {
    screenName: "Data Download",
    viewId: "customDataset",
    Ministry: "FULL",
    "Member of Parliament": "SCOPED",
    "District Authority": "SCOPED",
    Users: "RESTRICTED",
    description: "Export project datasets in CSV, Excel, and JSON formats",
  },
  aiAssistant: {
    screenName: "Help & Voice Support",
    viewId: "aiAssistant",
    Ministry: "FULL",
    "Member of Parliament": "FULL",
    "District Authority": "FULL",
    Users: "FULL",
    description: "24x7 AI Assistance and policy knowledge support",
  },
  contact: {
    screenName: "Help & Contact",
    viewId: "contact",
    Ministry: "FULL",
    "Member of Parliament": "FULL",
    "District Authority": "FULL",
    Users: "FULL",
    description: "Official support desk and emergency contacts",
  },
  alerts: {
    screenName: "Project Alerts",
    viewId: "alerts",
    Ministry: "FULL",
    "Member of Parliament": "SCOPED",
    "District Authority": "SCOPED",
    Users: "RESTRICTED",
    description: "Real-time cost overrun, delay, and compliance alerts",
  },
  map: {
    screenName: "Project Map",
    viewId: "map",
    Ministry: "FULL",
    "Member of Parliament": "SCOPED",
    "District Authority": "SCOPED",
    Users: "FULL",
    description: "Geospatial GIS mapping of all sanctioned projects",
  },
  costAnomaly: {
    screenName: "High Cost Prediction",
    viewId: "costAnomaly",
    Ministry: "FULL",
    "Member of Parliament": "SCOPED",
    "District Authority": "SCOPED",
    Users: "RESTRICTED",
    description: "ML cost estimation anomalies and budget variance detection",
  },
  duplicate: {
    screenName: "Double Payment Detection",
    viewId: "duplicate",
    Ministry: "FULL",
    "Member of Parliament": "LIMITED",
    "District Authority": "SCOPED",
    Users: "RESTRICTED",
    description: "Cross-work duplicate detection to prevent redundant payments",
  },
  expenditure: {
    screenName: "Progress Intelligence",
    viewId: "expenditure",
    Ministry: "FULL",
    "Member of Parliament": "SCOPED",
    "District Authority": "SCOPED",
    Users: "LIMITED",
    description: "Financial spending velocity vs actual physical progress",
  },
  delay: {
    screenName: "Delay Prediction",
    viewId: "delay",
    Ministry: "FULL",
    "Member of Parliament": "SCOPED",
    "District Authority": "SCOPED",
    Users: "RESTRICTED",
    description: "Predictive timeline intelligence and completion forecasting",
  },
  stateIntel: {
    screenName: "State-wise Project Tracker",
    viewId: "stateIntel",
    Ministry: "FULL",
    "Member of Parliament": "LIMITED",
    "District Authority": "LIMITED",
    Users: "FULL",
    description: "Comparative state development indicators and cross-state metrics",
  },
  districtIntel: {
    screenName: "District-wise Project Tracker",
    viewId: "districtIntel",
    Ministry: "FULL",
    "Member of Parliament": "LIMITED",
    "District Authority": "FULL",
    Users: "FULL",
    description: "District cell implementation monitor and contractor backlog",
  },
  mpDashboard: {
    screenName: "MP Portal",
    viewId: "mpDashboard",
    Ministry: "LIMITED",
    "Member of Parliament": "FULL",
    "District Authority": "LIMITED",
    Users: "RESTRICTED",
    description: "Member of Parliament constituency entitlement & recommended works",
  },
  stateNodal: {
    screenName: "State Nodal Portal",
    viewId: "stateNodal",
    Ministry: "LIMITED",
    "Member of Parliament": "RESTRICTED",
    "District Authority": "LIMITED",
    Users: "RESTRICTED",
    description: "State planning & rural development inter-departmental velocity",
  },
  agencies: {
    screenName: "Government Construction",
    viewId: "agencies",
    Ministry: "FULL",
    "Member of Parliament": "SCOPED",
    "District Authority": "FULL",
    Users: "LIMITED",
    description: "Implementing agency performance scorecards and risk index",
  },
  compliance: {
    screenName: "Rule Violation Auditor",
    viewId: "compliance",
    Ministry: "FULL",
    "Member of Parliament": "LIMITED",
    "District Authority": "FULL",
    Users: "RESTRICTED",
    description: "Statutory GIGW, MB measurement, and audit compliance ledger",
  },
  auditLogs: {
    screenName: "Audit Ledger",
    viewId: "auditLogs",
    Ministry: "FULL",
    "Member of Parliament": "LIMITED",
    "District Authority": "FULL",
    Users: "RESTRICTED",
    description: "Cryptographic tamper-evident audit logs and attestation ledger",
  },
  policy: {
    screenName: "Official Schema & Guidelines",
    viewId: "policy",
    Ministry: "FULL",
    "Member of Parliament": "LIMITED",
    "District Authority": "FULL",
    Users: "RESTRICTED",
    description: "2023 v4 Guidelines, permissible works catalog and statutory limits",
  },
  workMonitoring: {
    screenName: "CSV Ingestion & Monitoring",
    viewId: "workMonitoring",
    Ministry: "FULL",
    "Member of Parliament": "SCOPED",
    "District Authority": "FULL",
    "State Nodal Authority": "FULL",
    Users: "RESTRICTED",
    description: "CSV Work Assignment, Progress Monitoring, ML Fusion & Signals",
  },
  liveCommand: {
    screenName: "Live Command & Telemetry",
    viewId: "liveCommand",
    Ministry: "FULL",
    "Member of Parliament": "SCOPED",
    "District Authority": "SCOPED",
    "State Nodal Authority": "FULL",
    Users: "LIMITED",
    description: "Real-time telemetry stream, portfolio sweep, and batch CSV ingestion console",
  },
  labour: {
    screenName: "Labour Intelligence",
    viewId: "labour",
    Ministry: "FULL",
    "Member of Parliament": "SCOPED",
    "District Authority": "SCOPED",
    "State Nodal Authority": "FULL",
    Users: "LIMITED",
    description: "Biometric muster roll surveillance, dual attendance detection, and ghost worker reconciliation",
  },
  ghostVerification: {
    screenName: "Ghost Verification",
    viewId: "ghostVerification",
    Ministry: "FULL",
    "Member of Parliament": "SCOPED",
    "District Authority": "FULL",
    "State Nodal Authority": "FULL",
    Users: "LIMITED",
    description: "Multi-stage AI verification pipeline, computer vision, document OCR, and GIS distance validation",
  },
  caseManagement: {
    screenName: "Case Management & Escalation",
    viewId: "caseManagement",
    Ministry: "FULL",
    "Member of Parliament": "SCOPED",
    "District Authority": "FULL",
    "State Nodal Authority": "FULL",
    Users: "LIMITED",
    description: "Institutional escalation workflows, case docketing, and audit notes",
  },
  scenarioSimulation: {
    screenName: "Threat Scenario Simulation",
    viewId: "scenarioSimulation",
    Ministry: "FULL",
    "Member of Parliament": "FULL",
    "District Authority": "FULL",
    "State Nodal Authority": "FULL",
    Users: "FULL",
    description: "Deterministic test sandbox for jury evaluators and synthetic fraud payload injection",
  },
};

/**
 * Returns access level for a role on a given view
 */
export function getRoleAccessLevel(role: UserRole, viewId: string): AccessLevel {
  const perm = ROLE_PERMISSIONS_MATRIX[viewId];
  if (!perm) return "FULL";

  if (role === "Ministry") return perm.Ministry;
  if (role === "State Nodal Authority") return perm["State Nodal Authority"] || perm.Ministry;
  if (role === "Member of Parliament") return perm["Member of Parliament"];
  if (role === "District Authority") return perm["District Authority"];
  if (role === "Users") return perm.Users;
  return "FULL";
}

/**
 * Checks if a view is allowed to be accessed by a role
 */
export function isViewAllowedForRole(role: UserRole, viewId: string): boolean {
  const level = getRoleAccessLevel(role, viewId);
  return level !== "RESTRICTED";
}

/**
 * Returns user-friendly badge label and Tailwind styling for access level
 */
export function getAccessBadge(
  level: AccessLevel,
  role: UserRole
): { text: string; className: string } | null {
  if (level === "RESTRICTED") {
    return {
      text: "Restricted",
      className: "bg-red-50 text-red-700 border border-red-200 text-[10px]",
    };
  }

  if (level === "SCOPED") {
    const scopeName =
      role === "Member of Parliament"
        ? "Constituency"
        : role === "District Authority"
        ? "District"
        : "Scoped";
    return {
      text: scopeName,
      className: "bg-blue-50 text-[#1D4ED8] border border-blue-200 text-[10px]",
    };
  }

  if (level === "LIMITED") {
    return {
      text: role === "Users" ? "Public Info" : "View Only",
      className: "bg-amber-50 text-amber-800 border border-amber-200 text-[10px]",
    };
  }

  return null;
}
