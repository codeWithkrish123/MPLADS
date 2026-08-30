export const APPROVED_TERM_MAP: Record<string, string> = {
  fraud: "statistical anomaly",
  corruption: "unusual pattern",
  guilt: "requires validation",
  crime: "priority indicator",
  wrongdoing: "unusual pattern",
  "fraud prevention": "risk prevention",
  "corruption risk": "governance review",
  "guilt assessment": "case review",
  "crime/wrongdoing": "administrative deviation",
};

export const CITIZEN_COPY = {
  statisticalAnomaly: "Statistical anomaly",
  unusualPattern: "Unusual pattern",
  priorityIndicator: "Priority indicator",
  requiresValidation: "Requires validation",
  riskScore: "Priority score",
  riskLevel: "Priority level",
  riskDistribution: "Priority distribution",
  highRisk: "High priority",
  critical: "Critical priority",
} as const;

export const REASON_CODE_MAP: Record<string, string> = {
  cost_overrun: "Cost variance review",
  delay_risk: "Timeline review",
  duplicate: "Duplicate work review",
  compliance: "Compliance review",
  agency: "Agency review",
  progress_mismatch: "Progress variance review",
  financial_mismatch: "Financial variance review",
};

export interface FactorExplanation {
  title: string;
  description: string;
}

export const FACTOR_EXPLANATIONS: Record<string, FactorExplanation> = {
  COST_PEER_DEVIATION_HIGH: {
    title: "High Cost Peer Deviation",
    description: "Expenditure is significantly above peer average",
  },
  DELAY_MOBILIZATION_HIGH: {
    title: "Significant Delay in Mobilization",
    description: "Time to start expenditure exceeds 90 days",
  },
  STAGNATION_RISK_HIGH: {
    title: "High Project Stagnation",
    description: "Project is inactive for over 180 days without completion",
  },
};

export const LEGAL_DISCLAIMER_TEXT =
  "Legal Disclaimer: Risk scores indicate statistically unusual patterns in available historical records and are intended to support prioritization and human review. They do not independently establish fraud, misconduct, or legal liability.";

export const INSUFFICIENT_DATA_HEADING =
  "Project exists, but there is insufficient analytical data to calculate a reliable risk score.";

export const PROJECT_NOT_FOUND_HEADING =
  "Project ID does not exist in either the analytical cohort or the reference population.";

const BANNED = ["fraud", "corruption", "guilt", "crime", "wrongdoing"];

export function neutralizeText(value: string): string {
  let output = value;
  Object.entries(APPROVED_TERM_MAP).forEach(([key, approved]) => {
    output = output.replace(new RegExp(key, "gi"), approved);
  });
  return output;
}

export function getReasonLabel(code: string): string {
  return REASON_CODE_MAP[code] || titleCaseCode(code);
}

export function getFactorExplanation(code: string): FactorExplanation {
  const exact = FACTOR_EXPLANATIONS[code];
  if (exact) return exact;
  const upper = FACTOR_EXPLANATIONS[code?.toUpperCase?.() ?? ""];
  if (upper) return upper;
  return {
    title: titleCaseCode(code || "Indicator"),
    description: "This indicator highlights a statistically unusual pattern that requires validation.",
  };
}

export function titleCaseCode(code: string): string {
  return String(code || "")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function containsBannedTerm(value: string): boolean {
  const lowered = value.toLowerCase();
  return BANNED.some((term) => lowered.includes(term));
}
