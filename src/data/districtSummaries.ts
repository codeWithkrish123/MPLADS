import { DistrictSummary, WorkRecord } from "../types";

export const DEFAULT_DISTRICT_SUMMARIES: DistrictSummary[] = [
  {
    rank: 1,
    district: "Ghaziabad",
    state: "Uttar Pradesh",
    works_count: 342,
    expenditure_cr: 18.45,
    risk_score: 82,
    risk_category: "CRITICAL",
    high_risk_works: 28,
    completion_rate: 64,
    delayed_works: 42,
    cost_anomaly_score: 85,
    delay_risk_score: 78,
    progress_mismatch_score: 82,
    duplicate_similarity_score: 65,
    compliance_score: 72,
    trend: [50, 55, 58, 60, 62, 64],
  },
  {
    rank: 2,
    district: "Varanasi",
    state: "Uttar Pradesh",
    works_count: 289,
    expenditure_cr: 15.20,
    risk_score: 74,
    risk_category: "HIGH",
    high_risk_works: 19,
    completion_rate: 71,
    delayed_works: 26,
    cost_anomaly_score: 72,
    delay_risk_score: 68,
    progress_mismatch_score: 70,
    duplicate_similarity_score: 45,
    compliance_score: 78,
    trend: [60, 63, 66, 68, 70, 71],
  },
  {
    rank: 3,
    district: "Dahod",
    state: "Gujarat",
    works_count: 215,
    expenditure_cr: 11.80,
    risk_score: 90,
    risk_category: "CRITICAL",
    high_risk_works: 31,
    completion_rate: 45,
    delayed_works: 58,
    cost_anomaly_score: 92,
    delay_risk_score: 88,
    progress_mismatch_score: 90,
    duplicate_similarity_score: 78,
    compliance_score: 55,
    trend: [35, 38, 40, 42, 44, 45],
  },
  {
    rank: 4,
    district: "Lucknow",
    state: "Uttar Pradesh",
    works_count: 310,
    expenditure_cr: 19.60,
    risk_score: 42,
    risk_category: "MEDIUM",
    high_risk_works: 8,
    completion_rate: 82,
    delayed_works: 14,
    cost_anomaly_score: 40,
    delay_risk_score: 38,
    progress_mismatch_score: 42,
    duplicate_similarity_score: 25,
    compliance_score: 88,
    trend: [70, 74, 78, 80, 81, 82],
  },
  {
    rank: 5,
    district: "Pune",
    state: "Maharashtra",
    works_count: 275,
    expenditure_cr: 16.50,
    risk_score: 38,
    risk_category: "LOW",
    high_risk_works: 4,
    completion_rate: 89,
    delayed_works: 9,
    cost_anomaly_score: 32,
    delay_risk_score: 30,
    progress_mismatch_score: 35,
    duplicate_similarity_score: 18,
    compliance_score: 94,
    trend: [80, 82, 85, 87, 88, 89],
  },
  {
    rank: 6,
    district: "Patna",
    state: "Bihar",
    works_count: 198,
    expenditure_cr: 10.40,
    risk_score: 68,
    risk_category: "HIGH",
    high_risk_works: 16,
    completion_rate: 58,
    delayed_works: 32,
    cost_anomaly_score: 70,
    delay_risk_score: 65,
    progress_mismatch_score: 68,
    duplicate_similarity_score: 52,
    compliance_score: 68,
    trend: [48, 50, 52, 55, 57, 58],
  },
  {
    rank: 7,
    district: "Jaipur",
    state: "Rajasthan",
    works_count: 240,
    expenditure_cr: 14.10,
    risk_score: 48,
    risk_category: "MEDIUM",
    high_risk_works: 9,
    completion_rate: 76,
    delayed_works: 18,
    cost_anomaly_score: 45,
    delay_risk_score: 42,
    progress_mismatch_score: 48,
    duplicate_similarity_score: 30,
    compliance_score: 84,
    trend: [68, 70, 72, 74, 75, 76],
  },
  {
    rank: 8,
    district: "Bengaluru Urban",
    state: "Karnataka",
    works_count: 320,
    expenditure_cr: 21.00,
    risk_score: 35,
    risk_category: "LOW",
    high_risk_works: 3,
    completion_rate: 91,
    delayed_works: 7,
    cost_anomaly_score: 30,
    delay_risk_score: 28,
    progress_mismatch_score: 32,
    duplicate_similarity_score: 15,
    compliance_score: 96,
    trend: [82, 85, 88, 89, 90, 91],
  },
];

export function deriveDistrictsFromWorks(works: WorkRecord[]): DistrictSummary[] {
  if (!works || works.length === 0) {
    return DEFAULT_DISTRICT_SUMMARIES;
  }

  const grouped = new Map<string, WorkRecord[]>();
  for (const w of works) {
    const distName = w.district || "Ghaziabad";
    if (!grouped.has(distName)) {
      grouped.set(distName, []);
    }
    grouped.get(distName)!.push(w);
  }

  const derivedList: DistrictSummary[] = [];
  let rank = 1;

  grouped.forEach((distWorks, districtName) => {
    const stateName = distWorks[0]?.state || "Uttar Pradesh";
    const worksCount = distWorks.length;
    const totalExp =
      distWorks.reduce((acc, w) => acc + (w.actual_expenditure || (w.sanctioned_cost ? w.sanctioned_cost * 0.8 : 1500000)), 0) / 10000000;
    const avgRisk = Math.round(distWorks.reduce((acc, w) => acc + (w.risk_score || 50), 0) / worksCount);
    const highRiskCount = distWorks.filter((w) => (w.risk_score || 0) >= 70).length;
    const delayedCount = distWorks.filter((w) => w.status === "Delayed" || w.status === "delayed").length;
    const avgCompletion = Math.round(distWorks.reduce((acc, w) => acc + (w.physical_progress || 60), 0) / worksCount);
    const complianceScore = Math.max(45, 100 - avgRisk);

    let riskCategory: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" = "MEDIUM";
    if (avgRisk >= 75) riskCategory = "CRITICAL";
    else if (avgRisk >= 60) riskCategory = "HIGH";
    else if (avgRisk >= 40) riskCategory = "MEDIUM";
    else riskCategory = "LOW";

    derivedList.push({
      rank: rank++,
      district: districtName,
      state: stateName,
      works_count: worksCount,
      expenditure_cr: Number(totalExp.toFixed(2)),
      risk_score: avgRisk,
      risk_category: riskCategory,
      high_risk_works: highRiskCount,
      completion_rate: avgCompletion,
      delayed_works: delayedCount,
      cost_anomaly_score: Math.min(100, avgRisk + 5),
      delay_risk_score: Math.min(100, avgRisk + 2),
      progress_mismatch_score: Math.min(100, avgRisk - 4),
      duplicate_similarity_score: Math.max(10, avgRisk - 15),
      compliance_score: complianceScore,
      trend: [65, 68, 72, 78, 82, avgCompletion],
    });
  });

  // Ensure default districts are included if grouped count is small
  const existingNames = new Set(derivedList.map((d) => d.district.toLowerCase()));
  for (const def of DEFAULT_DISTRICT_SUMMARIES) {
    if (!existingNames.has(def.district.toLowerCase())) {
      derivedList.push({ ...def, rank: rank++ });
    }
  }

  return derivedList;
}
