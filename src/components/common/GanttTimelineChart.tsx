import React, { useState } from "react";
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Info,
  DollarSign,
} from "lucide-react";
import { WorkRecord } from "../../types";
import { formatINR } from "../../lib/utils";

interface GanttTimelineChartProps {
  work: WorkRecord;
}

interface MilestonePhase {
  id: string;
  name: string;
  category: "Sanction" | "Procurement" | "Civil Works" | "Inspection" | "Disbursement" | "Delivery";
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  plannedCostLakhs?: number;
  actualCostLakhs?: number;
  status: "COMPLETED" | "ACTIVE" | "DELAYED" | "CRITICAL_SLIP" | "PENDING";
  progressPercent: number;
  notes: string;
}

export const GanttTimelineChart: React.FC<GanttTimelineChartProps> = ({ work }) => {
  const [activeHoverMilestone, setActiveHoverMilestone] = useState<MilestonePhase | null>(null);

  // Derive dynamic schedule milestones based on work attributes
  const sanctionedCostL = (work.sanctioned_cost / 100000).toFixed(1);
  const actualCostL = (work.actual_expenditure / 100000).toFixed(1);
  const delayDays = work.evidence?.predicted_delay_days || 78;

  const milestones: MilestonePhase[] = [
    {
      id: "M1",
      name: "1. Administrative Sanction & Allocation",
      category: "Sanction",
      plannedStart: "2024-04-10",
      plannedEnd: "2024-05-15",
      actualStart: "2024-04-12",
      actualEnd: "2024-05-20",
      plannedCostLakhs: Number(sanctionedCostL) * 0.3,
      actualCostLakhs: Number(actualCostL) * 0.35,
      status: "COMPLETED",
      progressPercent: 100,
      notes: `Sanction Order Approved. 1st Tranche released (₹${(Number(sanctionedCostL) * 0.3).toFixed(1)}L).`,
    },
    {
      id: "M2",
      name: "2. Technical Tender & Agency Work Order",
      category: "Procurement",
      plannedStart: "2024-05-20",
      plannedEnd: "2024-06-30",
      actualStart: "2024-05-25",
      actualEnd: "2024-07-15",
      plannedCostLakhs: 0,
      actualCostLakhs: 0,
      status: "COMPLETED",
      progressPercent: 100,
      notes: `Allocated to ${work.agency}. Notice Inviting Tender (NIT) finalized.`,
    },
    {
      id: "M3",
      name: "3. Site Commencement & Foundation Phase",
      category: "Civil Works",
      plannedStart: work.start_date || "2024-07-01",
      plannedEnd: "2024-10-31",
      actualStart: work.start_date || "2024-07-10",
      actualEnd: "2024-11-15",
      plannedCostLakhs: Number(sanctionedCostL) * 0.3,
      actualCostLakhs: Number(actualCostL) * 0.35,
      status: "COMPLETED",
      progressPercent: 100,
      notes: "Groundbreaking completed. Initial layout survey verified by Junior Engineer.",
    },
    {
      id: "M4",
      name: "4. Mid-Term Inspection & Measurement Book (MB)",
      category: "Inspection",
      plannedStart: "2024-11-01",
      plannedEnd: "2025-01-15",
      actualStart: "2024-11-20",
      actualEnd: undefined,
      status: work.physical_progress < 50 ? "DELAYED" : "ACTIVE",
      progressPercent: work.physical_progress,
      notes: `Physical verification certified at ${work.physical_progress}%. Geotagged photographic audit pending.`,
    },
    {
      id: "M5",
      name: "5. 2nd Tranche Release & Fund Utilization",
      category: "Disbursement",
      plannedStart: "2025-01-15",
      plannedEnd: "2025-03-31",
      actualStart: "2025-01-20",
      actualEnd: undefined,
      plannedCostLakhs: Number(sanctionedCostL) * 0.4,
      actualCostLakhs: Number(actualCostL) * 0.3,
      status: work.financial_progress > work.physical_progress + 20 ? "DELAYED" : "ACTIVE",
      progressPercent: work.financial_progress,
      notes: `Financial draw reached ${work.financial_progress}%. Disparity with physical progress (+${work.financial_progress - work.physical_progress}% delta).`,
    },
    {
      id: "M6",
      name: "6. Scheduled Project Commissioning",
      category: "Delivery",
      plannedStart: "2025-04-01",
      plannedEnd: work.expected_completion,
      status: "PENDING",
      progressPercent: 0,
      notes: `Target Handover Date: ${work.expected_completion}. Subject to final inspection and CAG audit sign-off.`,
    },
    {
      id: "M7",
      name: `7. AI Predicted Timeline Slip (+${delayDays} Days)`,
      category: "Delivery",
      plannedStart: work.expected_completion,
      plannedEnd: work.predicted_completion || "2026-03-15",
      status: "CRITICAL_SLIP",
      progressPercent: 0,
      notes: `Forecasted completion shifted to ${work.predicted_completion || "Overdue"}. Root cause: slow MB submissions & material turnaround.`,
    },
  ];

  const getStatusColor = (status: MilestonePhase["status"]) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-500 text-white border-emerald-600";
      case "ACTIVE":
        return "bg-blue-600 text-white border-blue-700";
      case "DELAYED":
        return "bg-amber-500 text-white border-amber-600";
      case "CRITICAL_SLIP":
        return "bg-rose-500 text-white border-rose-600";
      default:
        return "bg-slate-300 text-slate-700 border-slate-400";
    }
  };

  const getStatusBadge = (status: MilestonePhase["status"]) => {
    switch (status) {
      case "COMPLETED":
        return <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">DONE</span>;
      case "ACTIVE":
        return <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold font-mono">ACTIVE</span>;
      case "DELAYED":
        return <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold font-mono">LAGGING</span>;
      case "CRITICAL_SLIP":
        return <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold font-mono">FORECAST SLIP</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold font-mono">QUEUED</span>;
    }
  };

  return (
    <div id="gantt-timeline-chart-widget" className="space-y-4 pt-3 border-t border-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Gantt Schedule &amp; Expenditure Timeline
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500">
          Planned vs Verified Actuals
        </span>
      </div>

      {/* Progress Disparity Summary Bar */}
      <div className="p-3 bg-slate-900 text-slate-100 rounded-xl space-y-2 text-xs">
        <div className="flex items-center justify-between font-mono">
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Physical Progress: <strong className="text-emerald-400">{work.physical_progress}%</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-red-400" />
            Financial Draw: <strong className="text-red-400">{work.financial_progress}%</strong>
          </span>
        </div>

        {/* Dual Track Progression Bar */}
        <div className="space-y-1">
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(work.physical_progress, 100)}%` }}
              title={`Physical Progress: ${work.physical_progress}%`}
            />
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
            <div
              className="bg-red-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(work.financial_progress, 100)}%` }}
              title={`Financial Expenditure: ${work.financial_progress}%`}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
          <span>Sanction: ₹{sanctionedCostL}L</span>
          <span className="text-amber-300 font-bold">
            Disparity: +{work.financial_progress - work.physical_progress}% Advance Draw
          </span>
          <span>Expended: ₹{actualCostL}L</span>
        </div>
      </div>

      {/* Gantt Interactive Milestone Chart */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5 shadow-2xs">
        {milestones.map((m, index) => {
          const isHovered = activeHoverMilestone?.id === m.id;
          return (
            <div
              key={m.id}
              onMouseEnter={() => setActiveHoverMilestone(m)}
              onMouseLeave={() => setActiveHoverMilestone(null)}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                isHovered
                  ? "bg-white border-slate-400 shadow-xs ring-1 ring-slate-300"
                  : "bg-white/80 border-slate-200 hover:border-slate-300"
              }`}
            >
              {/* Milestone Header */}
              <div className="flex items-center justify-between gap-2 mb-1.5 text-xs">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <span className="font-mono text-[11px] text-slate-500">[{m.id}]</span>
                  <span>{m.name}</span>
                </div>
                {getStatusBadge(m.status)}
              </div>

              {/* Horizontal Milestone Bar Representation */}
              <div className="relative w-full bg-slate-200 h-3 rounded-full overflow-hidden my-1">
                {m.status === "CRITICAL_SLIP" ? (
                  <div
                    className="h-full bg-rose-500/80 repeating-linear-gradient rounded-full animate-pulse"
                    style={{ width: "100%" }}
                  />
                ) : (
                  <div
                    className={`h-full transition-all duration-300 ${
                      m.status === "COMPLETED"
                        ? "bg-emerald-500"
                        : m.status === "DELAYED"
                        ? "bg-amber-500"
                        : "bg-blue-600"
                    }`}
                    style={{ width: `${Math.max(m.progressPercent, 12)}%` }}
                  />
                )}
              </div>

              {/* Dates & Metrics */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Planned: {m.plannedStart} → {m.plannedEnd}
                </span>
                {m.actualStart && (
                  <span className="text-slate-700 font-medium">
                    Actual: {m.actualStart} {m.actualEnd ? `→ ${m.actualEnd}` : "(Ongoing)"}
                  </span>
                )}
              </div>

              {/* Interactive Tooltip Context on Hover */}
              {isHovered && (
                <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600 bg-slate-50 p-2 rounded animate-in fade-in duration-150">
                  <p className="font-medium text-slate-800">{m.notes}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
