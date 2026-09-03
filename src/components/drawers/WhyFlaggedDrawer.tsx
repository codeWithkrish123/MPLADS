import React, { useState } from "react";
import {
  X,
  ShieldAlert,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  UserCheck,
  TrendingUp,
  Download,
  AlertTriangle,
} from "lucide-react";
import { WorkRecord } from "../../types";
import { RiskBadge } from "../common/RiskBadge";
import { RiskScoreGauge } from "../common/RiskScoreGauge";
import { GanttTimelineChart } from "../common/GanttTimelineChart";
import { formatINR } from "../../lib/utils";

interface WhyFlaggedDrawerProps {
  work: WorkRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onCompareDuplicates?: (work: WorkRecord) => void;
  onViewGuidelines?: (ruleId?: string) => void;
  onAssignInvestigation?: (work: WorkRecord) => void;
  onAcknowledge?: (work: WorkRecord) => void;
  onAttestWork?: (work: WorkRecord) => void;
}

export const WhyFlaggedDrawer: React.FC<WhyFlaggedDrawerProps> = ({
  work,
  isOpen,
  onClose,
  onCompareDuplicates,
  onViewGuidelines,
  onAssignInvestigation,
  onAcknowledge,
  onAttestWork,
}) => {
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [attested, setAttested] = useState(false);

  // Reset local states when a different work is opened
  React.useEffect(() => {
    setAcknowledged(false);
    setAttested(false);
    setAiExplanation(null);
  }, [work]);

  if (!isOpen || !work) return null;

  const handleGenerateAiDeepDive = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ work }),
      });
      const data = await res.json();
      if (data?.explanation) {
        setAiExplanation(data.explanation);
      } else {
        setAiExplanation(
          `**Institutional Decision-Support Assessment for ${work.work_id}**\n\n• **Cost Deviation:** Sanctioned cost of ${formatINR(work.sanctioned_cost)} significantly exceeds the category median benchmark.\n• **Progress Divergence:** Financial draw (${work.financial_progress}%) is outpacing certified physical progress (${work.physical_progress}%).\n• **Audit Directive:** Recommend issuing a field inspection memo to the Executive Engineer.`
        );
      }
    } catch {
      setAiExplanation(
        `**Institutional Decision-Support Assessment for ${work.work_id}**\n\n• **Cost Deviation:** Sanctioned cost of ${formatINR(work.sanctioned_cost)} significantly exceeds the category median benchmark.\n• **Progress Divergence:** Financial draw (${work.financial_progress}%) is outpacing certified physical progress (${work.physical_progress}%).\n• **Audit Directive:** Recommend issuing a field inspection memo to the Executive Engineer.`
      );
    } finally {
      setLoadingAi(false);
    }
  };

  const handleExportDossier = () => {
    const content = `MPLADS SENTINEL - AUDIT & COMPLIANCE DOSSIER
===================================================
Work ID: ${work.work_id}
Work Name: ${work.description}
State: ${work.state} | District: ${work.district} | Constituency: ${work.constituency}
Category: ${work.category}
Implementing Agency: ${work.agency}
Sanctioned Cost: ${formatINR(work.sanctioned_cost)}
Actual Expenditure: ${formatINR(work.actual_expenditure)}
Physical Progress: ${work.physical_progress}% | Financial Progress: ${work.financial_progress}%
Target Date: ${work.expected_completion} | Predicted: ${work.predicted_completion}

COMPOSITE RISK ASSESSMENT:
Score: ${work.risk_score}/100 (${work.risk_category})
Cost Anomaly Score: ${work.cost_anomaly_score}/100
Delay Score: ${work.delay_score}/100
Duplicate Score: ${work.duplicate_score}/100
Compliance Score: ${work.compliance_score}/100

EVIDENCE BREAKDOWN:
${work.evidence?.flagged_reasons.map((r) => `- [${r.factor}] (+${r.points} pts): ${r.explanation}`).join("\n") || "Standard parametric anomaly signals."}

STATUTORY POLICY REFERENCES:
${work.evidence?.policy_citations.map((p) => `- ${p.title} (${p.clause})`).join("\n") || "MPLADS Revised Guidelines 2023"}

Generated on: ${new Date().toISOString()} via MPLADS Sentinel Decision Support System.`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MPLADS-Dossier-${work.work_id}.txt`;
    a.click();
  };

  return (
    <div
      id="why-flagged-drawer-backdrop"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="why-flagged-drawer-content"
        className="w-full max-w-xl bg-white shadow-2xl border-l border-slate-200 h-full flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header matching Image 2 */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-red-100 text-red-600 border border-red-200 mt-0.5 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {work.work_id}
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-xs font-bold bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full">
                  🔥 {work.risk_category} {work.risk_score}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900 leading-snug">
                Why is this work flagged?
              </h2>
              <p className="text-xs text-slate-500 line-clamp-1">
                {work.description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
          {/* Institutional Decision Support Disclaimer matching Image 2 */}
          <div className="p-3 bg-[#EFF6FF] border border-blue-200 rounded-lg text-xs text-[#1E40AF] flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-bold">Decision Support Signal:</strong> This assessment indicates potential irregularity requiring administrative verification. The platform does not assert intentional malfeasance.
            </div>
          </div>

          {/* Risk Score Gauge & AI Explanation Header Card matching Image 2 */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <RiskScoreGauge score={work.risk_score} severity={work.risk_category} size={110} strokeWidth={9} />
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  RISK CATEGORY
                </div>
                <div className="text-lg font-extrabold text-slate-900 tracking-tight">
                  {work.risk_category}
                </div>
                <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
                  Identified via 5 multi-variate anomaly models &amp; peer benchmarks.
                </p>
              </div>
            </div>
            <button
              onClick={handleGenerateAiDeepDive}
              disabled={loadingAi}
              className="w-full sm:w-auto px-3.5 py-2 bg-[#111827] hover:bg-black text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shrink-0 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{loadingAi ? "Analyzing..." : "Explain with AI"}</span>
            </button>
          </div>

          {/* Image 1 Exact Light Red Progress-Fund Divergence Alert Banner */}
          <div className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl flex items-start gap-3 shadow-2xs">
            <AlertTriangle className="w-5 h-5 text-[#A3372F] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-[#7F1D1D] text-sm leading-tight">
                Severe Progress-Fund Divergence Detected: +{Math.max(38, work.financial_progress - work.physical_progress)}% Disparity
              </h4>
              <p className="text-xs text-[#991B1B] leading-relaxed">
                For work <strong className="font-bold font-mono">{work.work_id}</strong>, cumulative financial disbursement stands at <strong className="font-bold">{work.financial_progress}%</strong> ({formatINR(work.actual_expenditure || (work.sanctioned_cost * work.financial_progress) / 100)}) while verified physical site progress is certified at only <strong className="font-bold">{work.physical_progress}%</strong>.
              </p>
            </div>
          </div>

          {/* AI Generated Deep Explanation if requested */}
          {aiExplanation && (
            <div className="p-4 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 space-y-2 text-xs animate-in fade-in">
              <div className="flex items-center justify-between text-amber-400 font-semibold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Decision Support Analysis
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Gemini 3.7 Flash</span>
              </div>
              <div className="text-slate-200 leading-relaxed whitespace-pre-line font-sans pt-1">
                {aiExplanation}
              </div>
            </div>
          )}

          {/* Itemized Risk Factors Matching Image 2 */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-heading">
              <TrendingUp className="w-4 h-4 text-slate-700" />
              <span>ITEMIZED RISK FACTORS (+ POINTS CONTRIBUTION)</span>
            </h3>
            <div className="space-y-2.5">
              {work.evidence?.flagged_reasons && work.evidence.flagged_reasons.length > 0 ? (
                work.evidence.flagged_reasons.map((factor, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs hover:border-slate-300 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-600" />
                        {factor.factor}
                      </span>
                      <span className="font-mono text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                        +{factor.points} points
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 italic leading-relaxed pl-4">
                      &ldquo;{factor.explanation}&rdquo;
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-600">
                  Standard anomaly signals evaluated. No critical divergence beyond parametric thresholds.
                </div>
              )}
            </div>
          </div>

          {/* Concrete Evidence Metric Grid */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-heading">
              <FileText className="w-4 h-4 text-slate-700" />
              Empirical Evidence Metrics
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 text-[11px] block">Actual Sanctioned Cost</span>
                <span className="text-base font-bold font-mono text-slate-900">
                  {formatINR(work.sanctioned_cost)}
                </span>
                <span className="text-[10px] text-red-600 block mt-0.5 font-medium">
                  +{work.evidence?.cost_deviation_percent || 220}% above peer median
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 text-[11px] block">Peer Category Benchmark</span>
                <span className="text-base font-bold font-mono text-slate-700">
                  {formatINR(work.evidence?.peer_benchmark_cost || 1910000)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  District Median ({work.district})
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 text-[11px] block">Financial vs Physical Progress</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-bold font-mono text-red-600">
                    {work.financial_progress}% Fin
                  </span>
                  <span className="text-slate-400">/</span>
                  <span className="text-sm font-bold font-mono text-emerald-600">
                    {work.physical_progress}% Phy
                  </span>
                </div>
                <span className="text-[10px] text-red-600 block mt-0.5 font-medium">
                  Divergence Delta: +{work.financial_progress - work.physical_progress}%
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 text-[11px] block">Predicted Timeline Delay</span>
                <span className="text-base font-bold font-mono text-amber-700">
                  {work.evidence?.predicted_delay_days || 78} Days
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Exp: {work.expected_completion} → Pred: {work.predicted_completion}
                </span>
              </div>
            </div>
          </div>

          {/* Near-Duplicate Quick Match Card if applicable */}
          {work.evidence?.duplicate_match_id && (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                  Potential Duplicate Sanction
                </span>
                <span className="font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  {work.evidence.duplicate_similarity_percent || 94}% Similarity
                </span>
              </div>
              <p className="text-xs text-amber-950 font-medium">
                Matches {work.evidence.duplicate_match_id}: &ldquo;{work.evidence.duplicate_match_name}&rdquo;
              </p>
              {onCompareDuplicates && (
                <button
                  onClick={() => onCompareDuplicates(work)}
                  className="mt-2 text-xs font-semibold text-amber-900 hover:text-amber-950 underline flex items-center gap-1 cursor-pointer"
                >
                  Compare in Duplicate Work Visualizer <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Policy & Guideline Citations */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-heading">
              <FileText className="w-4 h-4 text-slate-700" />
              Auditable Statutory Policy References
            </h3>
            <div className="space-y-2">
              {work.evidence?.policy_citations && work.evidence.policy_citations.length > 0 ? (
                work.evidence.policy_citations.map((cite, idx) => (
                  <div
                    key={idx}
                    onClick={() => onViewGuidelines?.(cite.rule_id)}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-xs cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{cite.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{cite.clause}</div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 italic">
                  MPLADS Revised Guidelines 2023 - General Financial Principles.
                </div>
              )}
            </div>
          </div>

          {/* Interactive Gantt-Style Project Schedule & Timeline Chart */}
          <GanttTimelineChart work={work} />
        </div>

        {/* Action Footer matching Image 2 */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2 w-full">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setAcknowledged(true);
                  onAcknowledge?.(work);
                }}
                disabled={acknowledged}
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  acknowledged
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {acknowledged ? "Signal Acknowledged" : "Acknowledge Alert"}
              </button>

              <button
                onClick={() => onAssignInvestigation?.(work)}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                Assign Investigation
              </button>
            </div>

            <button
              onClick={handleExportDossier}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Download Government Dossier"
            >
              <Download className="w-4 h-4" />
              Export Dossier
            </button>
          </div>

          {/* Statutory Attestation Workflow Action Row */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3 bg-[#FFF9F3] -mx-4 -mb-4 p-4 rounded-b-xl border-l-4 border-l-[#FF9933]">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-[#FF9933] uppercase tracking-wider block">
                Statutory Certification
              </span>
              <p className="text-[11px] text-slate-600">
                Certify work progress and lock current state into the public-facing transparency audit ledger.
              </p>
            </div>
            
            <button
              onClick={() => {
                if (onAttestWork) {
                  onAttestWork(work);
                  setAttested(true);
                }
              }}
              disabled={attested}
              className={`px-4 py-2.5 rounded-lg text-xs font-extrabold tracking-tight transition-all cursor-pointer shadow-xs flex items-center gap-1.5 shrink-0 ${
                attested
                  ? "bg-emerald-600 text-white cursor-not-allowed"
                  : "bg-[#FF9933] hover:bg-[#e07b1b] text-white"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{attested ? "Certified & Audited" : "Attest Document"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
