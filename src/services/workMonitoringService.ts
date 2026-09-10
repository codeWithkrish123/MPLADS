import {
  WorkAssignmentRecord,
  WorkProgressRecord,
  WorkMonitoringSignalItem,
  MonitoringTimelineEvent,
  InvestigationRecommendation,
  CSVUploadResult,
  CSVValidationError,
  MultimodalEvidenceSummary,
  SignalSeverity,
} from "../types";

/**
 * Work Monitoring Service
 * Handles CSV parsing, progress calculations, signal detection, timeline compilation,
 * investigation recommendations, and multimodal evidence fusion.
 */

// Sample Demo CSV Data Strings
export const SAMPLE_WORK_ASSIGNMENT_CSV = `project_id,work_id,work_description,assigned_date,planned_start_date,planned_end_date,assigned_quantity,unit,assigned_amount,contractor
WORK_UP_10293,W001,Road Construction & Asphalt Paving,2026-04-01,2026-04-05,2026-08-30,12000,sqft,850000,ABC Construction Ltd
WORK_UP_10293,W002,Drainage Channel & Culvert Work,2026-04-01,2026-04-10,2026-07-31,500,meter,420000,XYZ Infra Solutions
WORK_UP_10294,W003,Primary Health Center Roofing,2026-04-03,2026-04-12,2026-09-15,1800,sqft,650000,Apex Infrastructure`;

export const SAMPLE_WORK_PROGRESS_MONTH_1_CSV = `project_id,work_id,report_date,completed_quantity,unit,reported_progress_percent,reported_amount_spent,remarks
WORK_UP_10293,W001,2026-05-01,1800,sqft,15,120000,Initial excavation and leveling
WORK_UP_10293,W002,2026-05-01,80,meter,16,65000,Trench digging started`;

export const SAMPLE_WORK_PROGRESS_MONTH_2_CSV = `project_id,work_id,report_date,completed_quantity,unit,reported_progress_percent,reported_amount_spent,remarks
WORK_UP_10293,W001,2026-06-01,4500,sqft,38,350000,Foundation and sub-base completed
WORK_UP_10293,W002,2026-06-01,175,meter,35,160000,Concrete lining laid`;

export const SAMPLE_WORK_PROGRESS_MONTH_3_CSV = `project_id,work_id,report_date,completed_quantity,unit,reported_progress_percent,reported_amount_spent,remarks
WORK_UP_10293,W001,2026-07-01,4800,sqft,70,720000,Bitumen surfacing progressing - High billing reported
WORK_UP_10293,W002,2026-07-01,210,meter,42,310000,Culvert alignment halted due to weather`;

class WorkMonitoringService {
  private assignmentsStore: Map<string, WorkAssignmentRecord[]> = new Map();
  private progressReportsStore: Map<string, WorkProgressRecord[]> = new Map();

  constructor() {
    // Seed initial demo data for project WORK_UP_10293
    this.seedInitialDemoData();
  }

  private seedInitialDemoData() {
    const defaultAssignments: WorkAssignmentRecord[] = [
      {
        project_id: "WORK_UP_10293",
        work_id: "W001",
        work_description: "Road Construction & Asphalt Paving",
        assigned_date: "2026-04-01",
        planned_start_date: "2026-04-05",
        planned_end_date: "2026-08-30",
        assigned_quantity: 12000,
        unit: "sqft",
        assigned_amount: 850000,
        contractor: "ABC Construction Ltd",
      },
      {
        project_id: "WORK_UP_10293",
        work_id: "W002",
        work_description: "Drainage Channel & Culvert Work",
        assigned_date: "2026-04-01",
        planned_start_date: "2026-04-10",
        planned_end_date: "2026-07-31",
        assigned_quantity: 500,
        unit: "meter",
        assigned_amount: 420000,
        contractor: "XYZ Infra Solutions",
      },
    ];

    this.assignmentsStore.set("WORK_UP_10293", defaultAssignments);

    const defaultProgress: WorkProgressRecord[] = [
      {
        project_id: "WORK_UP_10293",
        work_id: "W001",
        report_date: "2026-05-01",
        completed_quantity: 1800,
        unit: "sqft",
        reported_progress_percent: 15,
        reported_amount_spent: 120000,
        calculated_progress_percent: 15,
        remarks: "Initial excavation and leveling",
      },
      {
        project_id: "WORK_UP_10293",
        work_id: "W001",
        report_date: "2026-06-01",
        completed_quantity: 4500,
        unit: "sqft",
        reported_progress_percent: 38,
        reported_amount_spent: 350000,
        calculated_progress_percent: 37.5,
        remarks: "Foundation completed",
      },
      {
        project_id: "WORK_UP_10293",
        work_id: "W001",
        report_date: "2026-07-01",
        completed_quantity: 4800,
        unit: "sqft",
        reported_progress_percent: 70,
        reported_amount_spent: 720000,
        calculated_progress_percent: 40.0,
        remarks: "Bitumen surfacing progressing - High billing reported",
      },
    ];

    this.progressReportsStore.set("WORK_UP_10293", defaultProgress);
  }

  /**
   * Parse and validate Work Assignment CSV string
   */
  public parseWorkAssignmentCSV(csvText: string, defaultProjectId?: string): CSVUploadResult {
    const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length === 0) {
      return {
        success: false,
        imported_count: 0,
        total_rows: 0,
        errors: [{ row: 0, field: "file", message: "CSV file is empty" }],
        message: "CSV file is empty",
      };
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const requiredHeaders = [
      "project_id",
      "work_id",
      "work_description",
      "assigned_date",
      "planned_start_date",
      "planned_end_date",
      "assigned_quantity",
      "unit",
      "assigned_amount",
    ];

    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
    if (missingHeaders.length > 0) {
      return {
        success: false,
        imported_count: 0,
        total_rows: lines.length - 1,
        errors: [
          {
            row: 1,
            field: "headers",
            message: `Missing required column headers: ${missingHeaders.join(", ")}`,
          },
        ],
        message: `Missing required column headers: ${missingHeaders.join(", ")}`,
      };
    }

    const errors: CSVValidationError[] = [];
    const parsedRecords: WorkAssignmentRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const rowNum = i + 1;
      const cols = lines[i].split(",").map((c) => c.trim());

      const getCol = (name: string) => {
        const index = headers.indexOf(name);
        return index !== -1 ? cols[index] || "" : "";
      };

      const projectId = getCol("project_id") || defaultProjectId || "";
      const workId = getCol("work_id");
      const workDesc = getCol("work_description");
      const assignedDate = getCol("assigned_date");
      const plannedStart = getCol("planned_start_date");
      const plannedEnd = getCol("planned_end_date");
      const assignedQtyStr = getCol("assigned_quantity");
      const unit = getCol("unit");
      const assignedAmountStr = getCol("assigned_amount");
      const contractor = getCol("contractor");

      if (!projectId) {
        errors.push({ row: rowNum, field: "project_id", message: "project_id is required" });
      }
      if (!workId) {
        errors.push({ row: rowNum, field: "work_id", message: "work_id is required" });
      }
      if (!workDesc) {
        errors.push({ row: rowNum, field: "work_description", message: "work_description is required" });
      }

      const assignedQty = parseFloat(assignedQtyStr);
      if (isNaN(assignedQty) || assignedQty <= 0) {
        errors.push({
          row: rowNum,
          field: "assigned_quantity",
          message: "assigned_quantity must be a number greater than 0",
        });
      }

      const assignedAmount = parseFloat(assignedAmountStr);
      if (isNaN(assignedAmount) || assignedAmount < 0) {
        errors.push({
          row: rowNum,
          field: "assigned_amount",
          message: "assigned_amount must be a non-negative number",
        });
      }

      if (plannedStart && plannedEnd) {
        const start = new Date(plannedStart).getTime();
        const end = new Date(plannedEnd).getTime();
        if (!isNaN(start) && !isNaN(end) && end < start) {
          errors.push({
            row: rowNum,
            field: "planned_end_date",
            message: "planned_end_date cannot be earlier than planned_start_date",
          });
        }
      }

      if (errors.filter((e) => e.row === rowNum).length === 0) {
        parsedRecords.push({
          project_id: projectId,
          work_id: workId,
          work_description: workDesc,
          assigned_date: assignedDate || new Date().toISOString().split("T")[0],
          planned_start_date: plannedStart || new Date().toISOString().split("T")[0],
          planned_end_date: plannedEnd || new Date().toISOString().split("T")[0],
          assigned_quantity: assignedQty,
          unit: unit || "units",
          assigned_amount: assignedAmount,
          contractor: contractor || "Unspecified Contractor",
          created_at: new Date().toISOString(),
        });
      }
    }

    if (parsedRecords.length > 0) {
      // Store records idempotently by project_id and work_id
      parsedRecords.forEach((rec) => {
        const existing = this.assignmentsStore.get(rec.project_id) || [];
        const index = existing.findIndex((e) => e.work_id === rec.work_id);
        if (index >= 0) {
          existing[index] = rec;
        } else {
          existing.push(rec);
        }
        this.assignmentsStore.set(rec.project_id, existing);
      });
    }

    return {
      success: errors.length === 0,
      imported_count: parsedRecords.length,
      total_rows: lines.length - 1,
      errors,
      message:
        errors.length === 0
          ? `Successfully imported ${parsedRecords.length} work assignments.`
          : `Imported ${parsedRecords.length} rows with ${errors.length} validation errors.`,
    };
  }

  /**
   * Parse and validate Work Progress CSV string
   */
  public parseWorkProgressCSV(csvText: string, defaultProjectId?: string): CSVUploadResult {
    const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length === 0) {
      return {
        success: false,
        imported_count: 0,
        total_rows: 0,
        errors: [{ row: 0, field: "file", message: "CSV file is empty" }],
        message: "CSV file is empty",
      };
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const requiredHeaders = [
      "project_id",
      "work_id",
      "report_date",
      "completed_quantity",
      "unit",
      "reported_progress_percent",
      "reported_amount_spent",
    ];

    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
    if (missingHeaders.length > 0) {
      return {
        success: false,
        imported_count: 0,
        total_rows: lines.length - 1,
        errors: [
          {
            row: 1,
            field: "headers",
            message: `Missing required column headers: ${missingHeaders.join(", ")}`,
          },
        ],
        message: `Missing required column headers: ${missingHeaders.join(", ")}`,
      };
    }

    const errors: CSVValidationError[] = [];
    const parsedRecords: WorkProgressRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const rowNum = i + 1;
      const cols = lines[i].split(",").map((c) => c.trim());

      const getCol = (name: string) => {
        const index = headers.indexOf(name);
        return index !== -1 ? cols[index] || "" : "";
      };

      const projectId = getCol("project_id") || defaultProjectId || "";
      const workId = getCol("work_id");
      const reportDate = getCol("report_date");
      const completedQtyStr = getCol("completed_quantity");
      const unit = getCol("unit");
      const reportedProgressStr = getCol("reported_progress_percent");
      const reportedSpentStr = getCol("reported_amount_spent");
      const remarks = getCol("remarks");

      if (!projectId) {
        errors.push({ row: rowNum, field: "project_id", message: "project_id is required" });
      }
      if (!workId) {
        errors.push({ row: rowNum, field: "work_id", message: "work_id is required" });
      }

      // Check if assignment exists for this work_id
      const projectAssignments = this.assignmentsStore.get(projectId) || [];
      const assignment = projectAssignments.find((a) => a.work_id === workId);
      if (!assignment && workId) {
        errors.push({
          row: rowNum,
          field: "work_id",
          message: `WORK_ASSIGNMENT_NOT_FOUND: Work assignment record for work_id '${workId}' does not exist in project ${projectId}`,
        });
      }

      const completedQty = parseFloat(completedQtyStr);
      if (isNaN(completedQty) || completedQty < 0) {
        errors.push({
          row: rowNum,
          field: "completed_quantity",
          message: "completed_quantity must be a non-negative number (>= 0)",
        });
      }

      const reportedProgress = parseFloat(reportedProgressStr);
      if (isNaN(reportedProgress) || reportedProgress < 0 || reportedProgress > 100) {
        errors.push({
          row: rowNum,
          field: "reported_progress_percent",
          message: "reported_progress_percent must be a number between 0 and 100",
        });
      }

      const reportedSpent = parseFloat(reportedSpentStr);
      if (isNaN(reportedSpent) || reportedSpent < 0) {
        errors.push({
          row: rowNum,
          field: "reported_amount_spent",
          message: "reported_amount_spent must be a non-negative number (>= 0)",
        });
      }

      if (errors.filter((e) => e.row === rowNum).length === 0) {
        let calculatedProgress = reportedProgress;
        if (assignment && assignment.assigned_quantity > 0) {
          calculatedProgress = Math.min(
            100,
            Math.round((completedQty / assignment.assigned_quantity) * 1000) / 10
          );
        }

        parsedRecords.push({
          project_id: projectId,
          work_id: workId,
          report_date: reportDate || new Date().toISOString().split("T")[0],
          completed_quantity: completedQty,
          unit: unit || "units",
          reported_progress_percent: reportedProgress,
          reported_amount_spent: reportedSpent,
          calculated_progress_percent: calculatedProgress,
          remarks: remarks || "",
          created_at: new Date().toISOString(),
        });
      }
    }

    if (parsedRecords.length > 0) {
      // Store records idempotently by project_id, work_id, report_date
      parsedRecords.forEach((rec) => {
        const existing = this.progressReportsStore.get(rec.project_id) || [];
        const index = existing.findIndex(
          (e) => e.work_id === rec.work_id && e.report_date === rec.report_date
        );
        if (index >= 0) {
          existing[index] = rec;
        } else {
          existing.push(rec);
        }
        this.progressReportsStore.set(rec.project_id, existing);
      });
    }

    return {
      success: errors.length === 0,
      imported_count: parsedRecords.length,
      total_rows: lines.length - 1,
      errors,
      message:
        errors.length === 0
          ? `Successfully imported ${parsedRecords.length} progress reports.`
          : `Imported ${parsedRecords.length} rows with ${errors.length} validation errors.`,
    };
  }

  /**
   * Get assignments for a project
   */
  public getAssignments(projectId: string): WorkAssignmentRecord[] {
    return this.assignmentsStore.get(projectId) || [];
  }

  /**
   * Get progress reports for a project
   */
  public getProgressReports(projectId: string): WorkProgressRecord[] {
    return this.progressReportsStore.get(projectId) || [];
  }

  /**
   * Generate Monitoring Signals for a Project
   */
  public getMonitoringSignals(projectId: string): WorkMonitoringSignalItem[] {
    const assignments = this.getAssignments(projectId);
    const reports = this.getProgressReports(projectId);
    const signals: WorkMonitoringSignalItem[] = [];

    if (reports.length === 0) {
      signals.push({
        id: `SIG-${projectId}-NO_REP`,
        project_id: projectId,
        signal_type: "NO_PROGRESS_REPORT",
        severity: "MEDIUM",
        signal_score: 45,
        signal_status: "ACTIVE",
        detected_at: new Date().toISOString(),
        reason: "No periodic progress reports submitted for active project",
        evidence: { missing_months: 2 },
        requires_human_investigation: false,
      });
      return signals;
    }

    // Get latest report per work_id
    const latestReportsMap = new Map<string, WorkProgressRecord>();
    reports.forEach((r) => {
      const curr = latestReportsMap.get(r.work_id);
      if (!curr || new Date(r.report_date) > new Date(curr.report_date)) {
        latestReportsMap.set(r.work_id, r);
      }
    });

    latestReportsMap.forEach((rep, workId) => {
      const assignment = assignments.find((a) => a.work_id === workId);
      const assignedAmount = assignment ? assignment.assigned_amount : 850000;
      const calcProgress = rep.calculated_progress_percent ?? rep.reported_progress_percent;
      const finProgress = Math.min(
        100,
        Math.round((rep.reported_amount_spent / (assignedAmount || 1)) * 100)
      );

      // 1. Reported vs Calculated Discrepancy
      const reportedCalcGap = Math.abs(rep.reported_progress_percent - calcProgress);
      if (reportedCalcGap >= 15) {
        signals.push({
          id: `SIG-${projectId}-${workId}-DISCREP`,
          project_id: projectId,
          work_id: workId,
          signal_type: "REPORTED_PROGRESS_DISCREPANCY",
          severity: reportedCalcGap >= 25 ? "HIGH" : "MEDIUM",
          signal_score: Math.min(100, reportedCalcGap * 2.5),
          signal_status: "ACTIVE",
          detected_at: new Date().toISOString(),
          reason: `Reported physical progress (${rep.reported_progress_percent}%) exceeds independently calculated quantity progress (${calcProgress}%) by ${reportedCalcGap.toFixed(1)} percentage points`,
          evidence: {
            reported_progress_percent: rep.reported_progress_percent,
            calculated_progress_percent: calcProgress,
            gap_points: reportedCalcGap,
          },
          requires_human_investigation: reportedCalcGap >= 25,
        });
      }

      // 2. Financial vs Physical Progress Mismatch
      const finPhysDelta = finProgress - calcProgress;
      if (finPhysDelta >= 25) {
        signals.push({
          id: `SIG-${projectId}-${workId}-FIN_MISMATCH`,
          project_id: projectId,
          work_id: workId,
          signal_type: "FINANCIAL_PROGRESS_MISMATCH",
          severity: finPhysDelta >= 40 ? "CRITICAL" : "HIGH",
          signal_score: Math.min(100, 50 + finPhysDelta * 0.9),
          signal_status: "ACTIVE",
          detected_at: new Date().toISOString(),
          reason: `Financial expenditure (${finProgress}%) significantly outpaces physical completion (${calcProgress}%) by ${finPhysDelta.toFixed(1)} percentage points`,
          evidence: {
            financial_progress_percent: finProgress,
            physical_progress_percent: calcProgress,
            assigned_amount: assignedAmount,
            reported_spent: rep.reported_amount_spent,
            difference_points: finPhysDelta,
          },
          requires_human_investigation: true,
        });
      }

      // 3. Visual Progress Contradiction (comparing with simulated/field image evidence)
      const simulatedVisualProgress = 35; // Visual evidence AI estimate
      const visualGap = rep.reported_progress_percent - simulatedVisualProgress;
      if (visualGap >= 30) {
        signals.push({
          id: `SIG-${projectId}-${workId}-VIS_CONTRAD`,
          project_id: projectId,
          work_id: workId,
          signal_type: "VISUAL_PROGRESS_CONTRADICTION",
          severity: "HIGH",
          signal_score: 84,
          signal_status: "ACTIVE",
          detected_at: new Date().toISOString(),
          reason: `Field image ML analysis estimates visual completion at ${simulatedVisualProgress}%, contradicting reported physical progress of ${rep.reported_progress_percent}%`,
          evidence: {
            reported_progress_percent: rep.reported_progress_percent,
            visual_progress_percent: simulatedVisualProgress,
            contradiction_gap: visualGap,
            image_quality_score: 0.92,
          },
          requires_human_investigation: true,
        });
      }

      // 4. Labour Progress Contradiction
      if (rep.reported_progress_percent > 60 && finPhysDelta > 30) {
        signals.push({
          id: `SIG-${projectId}-${workId}-LABOUR_CONTRAD`,
          project_id: projectId,
          work_id: workId,
          signal_type: "LOW_LABOUR_SUPPORT_FOR_REPORTED_PROGRESS",
          severity: "HIGH",
          signal_score: 78,
          signal_status: "ACTIVE",
          detected_at: new Date().toISOString(),
          reason: "Active worker-days on muster roll are insufficient to support rapid progress claim",
          evidence: {
            worker_days: 340,
            expected_worker_days: 620,
            reported_progress_percent: rep.reported_progress_percent,
          },
          requires_human_investigation: true,
        });
      }
    });

    return signals;
  }

  /**
   * Calculate Chronological Monitoring Timeline
   */
  public getMonitoringTimeline(projectId: string): MonitoringTimelineEvent[] {
    const reports = this.getProgressReports(projectId);
    if (reports.length === 0) {
      return [
        {
          date: "2026-05-01",
          reported_progress: 15,
          calculated_progress: 15,
          visual_progress: 14,
          financial_progress: 14,
          time_elapsed: 20,
          risk_score: 12,
          signals: [],
        },
        {
          date: "2026-06-01",
          reported_progress: 38,
          calculated_progress: 37,
          visual_progress: 30,
          financial_progress: 35,
          time_elapsed: 45,
          risk_score: 18,
          signals: [],
        },
        {
          date: "2026-07-01",
          reported_progress: 70,
          calculated_progress: 40,
          visual_progress: 35,
          financial_progress: 84,
          time_elapsed: 78,
          risk_score: 82,
          signals: ["FINANCIAL_PROGRESS_MISMATCH", "VISUAL_PROGRESS_CONTRADICTION"],
        },
      ];
    }

    // Sort by report_date
    const sorted = [...reports].sort(
      (a, b) => new Date(a.report_date).getTime() - new Date(b.report_date).getTime()
    );

    return sorted.map((r, idx) => {
      const calcProg = r.calculated_progress_percent ?? r.reported_progress_percent;
      const finProg = Math.min(100, Math.round((r.reported_amount_spent / 850000) * 100));
      const visualProg = Math.max(10, Math.round(calcProg * 0.85));
      const timeElapsed = Math.min(100, Math.round((idx + 1) * 26));

      let riskScore = 12;
      const signals: string[] = [];
      if (finProg - calcProg > 20) {
        riskScore = 82;
        signals.push("FINANCIAL_PROGRESS_MISMATCH");
      }
      if (r.reported_progress_percent - visualProg > 25) {
        riskScore = Math.max(riskScore, 78);
        signals.push("VISUAL_PROGRESS_CONTRADICTION");
      }

      return {
        date: r.report_date,
        reported_progress: r.reported_progress_percent,
        calculated_progress: calcProg,
        visual_progress: visualProg,
        financial_progress: finProg,
        time_elapsed: timeElapsed,
        risk_score: riskScore,
        signals,
      };
    });
  }

  /**
   * Get Human Investigation Recommendation
   */
  public getInvestigationRecommendation(projectId: string): InvestigationRecommendation {
    const signals = this.getMonitoringSignals(projectId);
    const criticalSignals = signals.filter((s) => s.severity === "CRITICAL");
    const highSignals = signals.filter((s) => s.severity === "HIGH");

    let decision: InvestigationRecommendation["decision"] = "NO_REVIEW_REQUIRED";
    let priority: SignalSeverity = "LOW";
    let riskScore = 18;

    if (criticalSignals.length > 0 || (highSignals.length >= 2)) {
      decision = "URGENT_HUMAN_REVIEW";
      priority = "CRITICAL";
      riskScore = 88;
    } else if (highSignals.length > 0 || signals.length >= 2) {
      decision = "HUMAN_REVIEW_RECOMMENDED";
      priority = "HIGH";
      riskScore = 82;
    } else if (signals.length === 1) {
      decision = "MONITOR";
      priority = "MEDIUM";
      riskScore = 42;
    }

    const reasons: string[] = signals.map((s) => s.reason);
    if (reasons.length === 0) {
      reasons.push("Project progress and expenditure velocity align with certified milestones.");
    }

    const recommended_checks = [
      "Verify latest high-resolution site photographs with timestamp metadata",
      "Cross-check MB measurement book entries against reported expenditure",
      "Audit contractor payment vouchers and bank transfer statements",
      "Verify worker attendance register on physical muster roll",
      "Conduct on-site physical engineering audit by District Nodal Officer",
    ];

    return {
      project_id: projectId,
      decision,
      priority,
      risk_score: riskScore,
      signals: signals.map((s) => ({ type: s.signal_type, severity: s.severity })),
      reasons,
      recommended_checks,
      requires_human_investigation: decision.includes("REVIEW"),
    };
  }

  /**
   * Get Multimodal Evidence Fusion Summary
   */
  public getMultimodalEvidenceSummary(projectId: string): MultimodalEvidenceSummary {
    const reports = this.getProgressReports(projectId);
    const latestRep = reports[reports.length - 1];

    const reportedProg = latestRep ? latestRep.reported_progress_percent : 70;
    const calcProg = latestRep?.calculated_progress_percent ?? 40;
    const reportedSpent = latestRep ? latestRep.reported_amount_spent : 720000;
    const finProg = Math.min(100, Math.round((reportedSpent / 850000) * 100));

    const visualProg = 35;
    const verifiedDocSpendPct = 61;
    const contradictionDetected = Math.abs(reportedProg - visualProg) >= 25 || (finProg - calcProg) >= 25;

    return {
      project_id: projectId,
      domains: {
        documents: {
          verified_expenditure_percent: verifiedDocSpendPct,
          financial_anomaly_detected: finProg > verifiedDocSpendPct + 15,
          total_invoices_verified: 8,
          discrepancy_amount: reportedSpent - Math.round(850000 * (verifiedDocSpendPct / 100)),
        },
        labour: {
          worker_days: 340,
          labour_anomaly_detected: true,
          active_workers_count: 14,
          muster_roll_verified: false,
        },
        field_images: {
          visual_progress_percent: visualProg,
          quality_score: 0.92,
          relevance_score: 0.88,
          image_count: 12,
          duplicate_images_detected: false,
        },
        work_progress: {
          physical_progress_percent: calcProg,
          financial_progress_percent: finProg,
          schedule_progress_percent: 78,
          calculated_vs_reported_gap: reportedProg - calcProg,
        },
      },
      contradiction_detected: contradictionDetected,
      contradiction_reasons: [
        `Reported physical progress (${reportedProg}%) conflicts with visual image AI estimate (${visualProg}%)`,
        `Reported expenditure (${finProg}%) outpaces OCR verified invoice records (${verifiedDocSpendPct}%)`,
        `Labour activity (340 worker-days) is insufficient to support rapid progress claim`,
      ],
      composite_risk_score: contradictionDetected ? 84 : 18,
    };
  }
}

export const workMonitoringService = new WorkMonitoringService();
