/**
 * ML Sentinel Copy & Terminology Mapping
 * 
 * COMPLIANCE CRITICAL: Central mapping for all user-facing text.
 * Maintains approved terminology and prevents banned words.
 * 
 * Single source of truth - changes here affect entire system
 */

/**
 * TERMINOLOGY POLICY
 * 
 * Banned Words → Approved Replacements:
 * - "Fraud" → "Statistical anomaly"
 * - "Corruption" → "Unusual pattern"
 * - "Guilt" → "Priority indicator"
 * - "Crime" / "Wrongdoing" → "Requires validation"
 * 
 * All UI labels, tooltips, status badges must use approved terms
 */

export const approvedTerminology = {
  // Instead of "Fraud"
  ANOMALY: "Statistical anomaly",
  UNUSUAL_PATTERN: "Unusual pattern detected",
  
  // Instead of "Corruption"
  PATTERN_DETECTED: "Pattern detected",
  DEVIATION: "Significant deviation",
  
  // Instead of "Guilt"
  PRIORITY_INDICATOR: "Priority indicator",
  FLAGGED_FOR_REVIEW: "Flagged for review",
  
  // Instead of "Crime/Wrongdoing"
  REQUIRES_VALIDATION: "Requires validation",
  NEEDS_INVESTIGATION: "Requires further investigation",
  
  // Risk-related
  HIGH_RISK: "High priority",
  CRITICAL_RISK: "Critical priority",
  MEDIUM_RISK: "Medium priority",
  LOW_RISK: "Low priority"
};

/**
 * REASON CODE MAPPING
 * 
 * Maps ML-generated reason codes to human-readable explanations
 * These explain WHY a project was flagged for review
 */
export const reasonCodesMap: Record<string, {
  title: string;
  description: string;
  icon: string;
}> = {
  // Cost-related anomalies
  COST_PEER_DEVIATION_HIGH: {
    title: "High Cost Peer Deviation",
    description: "Expenditure is significantly above peer average. The project's spending pattern differs notably from similar projects in the same category.",
    icon: "TrendingUp"
  },
  COST_VARIANCE_HIGH: {
    title: "High Cost Variance",
    description: "Cost variance exceeds normal threshold. Actual expenditure significantly deviates from sanctioned amount.",
    icon: "AlertTriangle"
  },
  COST_ESCALATION: {
    title: "Cost Escalation Detected",
    description: "Project costs have escalated beyond initial estimates. Review procurement and execution contracts.",
    icon: "TrendingUp"
  },

  // Delay-related anomalies
  DELAY_MOBILIZATION_HIGH: {
    title: "Significant Delay in Mobilization",
    description: "Time to start expenditure exceeds 90 days. Project mobilization appears delayed compared to similar projects.",
    icon: "Clock"
  },
  PROGRESS_STAGNATION: {
    title: "Progress Stagnation",
    description: "Project progress has remained static for extended period. No advancement recorded in recent monitoring cycles.",
    icon: "Pause"
  },
  COMPLETION_OVERDUE: {
    title: "Completion Overdue",
    description: "Project completion date has passed but work status shows incomplete. Review project status and expected completion date.",
    icon: "Clock"
  },

  // Utilization-related
  STAGNATION_RISK_HIGH: {
    title: "High Project Stagnation",
    description: "Project is inactive for over 180 days without completion. No recorded activity or expenditure in recent period.",
    icon: "Pause"
  },
  UNDER_UTILIZATION: {
    title: "Under-Utilization Detected",
    description: "Fund utilization is below 30% of sanctioned amount. Review project implementation status and fund release schedule.",
    icon: "TrendingDown"
  },
  OVER_UTILIZATION: {
    title: "Over-Utilization Detected",
    description: "Fund utilization exceeds 100% of sanctioned amount. Review and validate additional expenditure authorization.",
    icon: "AlertTriangle"
  },

  // Data quality issues
  INCOMPLETE_DATA: {
    title: "Incomplete Data",
    description: "Required project information is missing or incomplete. Additional data needed for accurate assessment.",
    icon: "AlertCircle"
  },
  INCONSISTENT_DATES: {
    title: "Inconsistent Timeline Data",
    description: "Project timeline dates show logical inconsistencies. Review sanction date, start date, and completion date.",
    icon: "Calendar"
  },
  DATA_QUALITY_LOW: {
    title: "Low Data Quality",
    description: "Project data quality score is below acceptable threshold. Verify and correct project information.",
    icon: "AlertCircle"
  },

  // Performance-related
  LOW_PHYSICAL_PROGRESS: {
    title: "Low Physical Progress",
    description: "Physical progress percentage is significantly below financial expenditure. Verify progress reporting accuracy.",
    icon: "TrendingDown"
  },
  HIGH_FINANCIAL_PHYSICAL_GAP: {
    title: "High Financial-Physical Gap",
    description: "Significant divergence between financial and physical progress. Review work quality and progress reporting.",
    icon: "TrendingDown"
  },

  // Categorical anomalies
  CATEGORY_OUTLIER: {
    title: "Category Outlier",
    description: "Project metrics are statistical outliers compared to similar projects in same category.",
    icon: "Zap"
  },
  STATE_OUTLIER: {
    title: "State-Level Outlier",
    description: "Project shows unusual patterns compared to other projects in the same state.",
    icon: "Zap"
  }
};

/**
 * RISK LEVEL DESCRIPTIONS
 * User-friendly descriptions for each risk level
 */
export const riskLevelDescriptions: Record<string, {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
}> = {
  CRITICAL: {
    label: "Critical Priority",
    description: "Requires immediate attention and detailed investigation",
    color: "red",
    bgColor: "bg-red-50",
    textColor: "text-red-900"
  },
  HIGH: {
    label: "High Priority",
    description: "Should be reviewed soon and may require corrective action",
    color: "orange",
    bgColor: "bg-orange-50",
    textColor: "text-orange-900"
  },
  MEDIUM: {
    label: "Medium Priority",
    description: "Recommended for regular monitoring and review",
    color: "amber",
    bgColor: "bg-amber-50",
    textColor: "text-amber-900"
  },
  LOW: {
    label: "Low Priority",
    description: "Appears to be on track with normal monitoring",
    color: "green",
    bgColor: "bg-green-50",
    textColor: "text-green-900"
  }
};

/**
 * INVESTIGATION CHECKLIST TEMPLATES
 * What auditors should check for each anomaly type
 */
export const investigationChecklistMap: Record<string, string[]> = {
  COST_PEER_DEVIATION_HIGH: [
    "Review project procurement documentation",
    "Compare unit rates with peer projects",
    "Verify contractor selection process",
    "Check for scope changes or variations",
    "Validate market rate compliance"
  ],
  DELAY_MOBILIZATION_HIGH: [
    "Review project mobilization timeline",
    "Check for administrative delays",
    "Verify land/site availability at project start",
    "Review contractor appointment documentation",
    "Identify bottlenecks in project setup"
  ],
  PROGRESS_STAGNATION: [
    "Contact implementing agency for status",
    "Verify on-site progress through photos/reports",
    "Check for contractual disputes",
    "Review fund release schedule",
    "Identify implementation challenges"
  ],
  STAGNATION_RISK_HIGH: [
    "Immediate contact with implementing agency required",
    "Review project viability assessment",
    "Check for project abandonment status",
    "Verify fund utilization history",
    "Consider revival or closure options"
  ],
  UNDER_UTILIZATION: [
    "Review fund release schedule",
    "Check for implementation delays",
    "Verify project capacity constraints",
    "Review contractor performance",
    "Assess revised project timeline"
  ]
};

/**
 * ERROR MESSAGE TEMPLATES
 * Standard error messages for user-facing errors
 */
export const errorMessages = {
  PROJECT_NOT_FOUND: "Project not found in the system. Please verify the project ID.",
  INSUFFICIENT_DATA: "This project has incomplete historical data and cannot be fully analyzed.",
  INVALID_PROJECT_ID: "Invalid project ID format.",
  API_ERROR: "Unable to connect to analysis service. Please try again.",
  SEARCH_ERROR: "Search service is temporarily unavailable.",
  FILTER_ERROR: "Unable to apply filters. Please try again.",
  NETWORK_ERROR: "Network connection error. Please check your connection and try again.",
  TIMEOUT: "Request took too long. Please try again.",
  UNAUTHORIZED: "You don't have permission to access this resource."
};

/**
 * EMPTY STATE MESSAGES
 * Messages shown when no data is available
 */
export const emptyStateMessages = {
  NO_PROJECTS: "No projects found matching your criteria.",
  NO_SEARCH_RESULTS: "No projects match your search query.",
  NO_ANOMALIES: "No anomalies detected in this project.",
  NO_INVESTIGATIONS: "No active investigations for this project.",
  NO_RECOMMENDATIONS: "No specific recommendations at this time."
};

/**
 * Helper to get safe terminology
 * Ensures no banned words appear in output
 */
export function getSafeTerminology(key: keyof typeof approvedTerminology): string {
  return approvedTerminology[key] || "Flagged for review";
}

/**
 * Helper to get reason code explanation
 */
export function getReasonCodeExplanation(reasonCode: string) {
  return reasonCodesMap[reasonCode] || {
    title: "Requires Review",
    description: "This project has been flagged for further review and validation.",
    icon: "AlertCircle"
  };
}

/**
 * Helper to get risk level details
 */
export function getRiskLevelDetails(riskLevel: string) {
  return riskLevelDescriptions[riskLevel] || riskLevelDescriptions.LOW;
}
