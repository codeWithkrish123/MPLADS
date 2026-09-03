import { ComplianceRule } from "../types";

export const REAL_RULES: ComplianceRule[] = [
  {
    "rule_id": "RULE-001",
    "title": "Cost Deviation from District Median",
    "category": "Financial",
    "affected_works": 0,
    "severity": "CRITICAL",
    "status": "Active Policy",
    "policy_version": "2.1",
    "effective_date": "2024-01-01",
    "source_document": "MPLADS Guidelines 2023, Para 4.1",
    "policy_statement": "Sanctioned expenditure must not exceed +50% of the district median peer estimate for identical work categories.",
    "threshold_description": "> 50% deviation from peer median cost",
    "detection_logic": "cost > (peer_median * 1.5)"
  },
  {
    "rule_id": "RULE-002",
    "title": "Statutory 1-Year Completion Timeline",
    "category": "Implementation",
    "affected_works": 0,
    "severity": "HIGH",
    "status": "Active Policy",
    "policy_version": "2.1",
    "effective_date": "2024-01-01",
    "source_document": "MPLADS Guidelines 2023, Para 3.8",
    "policy_statement": "Works sanctioned under MPLADS must be completed within 12 months of sanction order issuance.",
    "threshold_description": "> 365 days from sanction date without completion",
    "detection_logic": "days_since_sanction > 365 AND status != 'Completed'"
  },
  {
    "rule_id": "RULE-003",
    "title": "Financial Draw vs Physical Progress Mismatch",
    "category": "Compliance",
    "affected_works": 0,
    "severity": "CRITICAL",
    "status": "Active Policy",
    "policy_version": "2.0",
    "effective_date": "2024-01-01",
    "source_document": "GFR 2017 Rule 229 & MPLADS Rule 5.3",
    "policy_statement": "Expenditure drawn must closely mirror verified physical progress. A delta > 40% constitutes financial anomaly.",
    "threshold_description": "Financial progress > Physical progress + 40%",
    "detection_logic": "(financial_progress - physical_progress) > 40"
  },
  {
    "rule_id": "RULE-004",
    "title": "Annexure-VIII Prohibited Work Category Match",
    "category": "Compliance",
    "affected_works": 42,
    "severity": "HIGH",
    "status": "Active Policy",
    "policy_version": "2.2",
    "effective_date": "2024-01-01",
    "source_document": "MPLADS Annexure-VIII (Inadmissible Works)",
    "policy_statement": "Works must conform to permissible community infrastructure. Vague descriptions with < 20% semantic similarity to approved works require audit verification.",
    "threshold_description": "Semantic similarity < 20% to permissible activities",
    "detection_logic": "nlp_similarity < 0.20"
  },
  {
    "rule_id": "RULE-005",
    "title": "Geospatial Duplicate Work Detection",
    "category": "Procurement",
    "affected_works": 0,
    "severity": "HIGH",
    "status": "Active Policy",
    "policy_version": "2.0",
    "effective_date": "2024-01-01",
    "source_document": "MPLADS Anti-Duplication Directives 2024",
    "policy_statement": "Works within 200 meters of another project with >80% semantic match require immediate human verification before fund release.",
    "threshold_description": "Distance < 200m AND Similarity > 80%",
    "detection_logic": "geo_dist < 200 AND text_sim > 0.80"
  }
];
