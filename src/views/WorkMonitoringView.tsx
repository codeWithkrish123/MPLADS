import React, { useState } from "react";
import {
  FileSpreadsheet,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  Clock,
  DollarSign,
  CheckCircle2,
  Upload,
  Calendar,
  Layers,
  FileCheck,
  Building2,
  Users,
  Eye,
  Info,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  HelpCircle,
  Sliders,
} from "lucide-react";
import { workMonitoringService } from "../services/workMonitoringService";
import { CSVWorkMonitoringUploadModal } from "../components/modals/CSVWorkMonitoringUploadModal";
import { Language, WorkRecord } from "../types";
import { formatINR } from "../lib/utils";

interface WorkMonitoringViewProps {
  language?: Language;
  onSelectWork?: (work: WorkRecord) => void;
}

export const WorkMonitoringView: React.FC<WorkMonitoringViewProps> = ({
  language = "en",
  onSelectWork,
}) => {
  const isHindi = language === "hi";
  const [selectedProjectId, setSelectedProjectId] = useState<string>("WORK_UP_10293");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"overview" | "timeline" | "signals" | "fusion" | "records">("overview");

  // Fetch current monitoring data from service
  const assignments = workMonitoringService.getAssignments(selectedProjectId);
  const progressReports = workMonitoringService.getProgressReports(selectedProjectId);
  const signals = workMonitoringService.getMonitoringSignals(selectedProjectId);
  const timeline = workMonitoringService.getMonitoringTimeline(selectedProjectId);
  const investigation = workMonitoringService.getInvestigationRecommendation(selectedProjectId);
  const fusion = workMonitoringService.getMultimodalEvidenceSummary(selectedProjectId);

  const latestReport = progressReports[progressReports.length - 1];
  const reportedPhysicalPct = latestReport ? latestReport.reported_progress_percent : 70;
  const calculatedPhysicalPct = latestReport?.calculated_progress_percent ?? 40;
  const reportedSpent = latestReport ? latestReport.reported_amount_spent : 720000;
  const totalAssignedAmount = assignments.reduce((acc, a) => acc + a.assigned_amount, 0) || 1270000;
  const financialPct = Math.min(100, Math.round((reportedSpent / totalAssignedAmount) * 100));
  const timeElapsedPct = 78;

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case "URGENT_HUMAN_REVIEW":
        return {
          bg: "bg-red-100 text-red-900 border-red-300",
          label: isHindi ? "अति आवश्यक मानव समीक्षा" : "URGENT HUMAN REVIEW REQUIRED",
          icon: ShieldAlert,
        };
      case "HUMAN_REVIEW_RECOMMENDED":
        return {
          bg: "bg-amber-100 text-amber-900 border-amber-300",
          label: isHindi ? "मानव जांच की अनुशंसा की गई" : "HUMAN INVESTIGATION RECOMMENDED",
          icon: AlertTriangle,
        };
      case "MONITOR":
        return {
          bg: "bg-blue-100 text-blue-900 border-blue-300",
          label: isHindi ? "सक्रिय निगरानी की सलाह" : "MONITOR CLOSELY",
          icon: Info,
        };
      default:
        return {
          bg: "bg-emerald-100 text-emerald-900 border-emerald-300",
          label: isHindi ? "सामान्य - कोई समीक्षा आवश्यक नहीं" : "NO REVIEW REQUIRED",
          icon: CheckCircle2,
        };
    }
  };

  const decisionMeta = getDecisionBadge(investigation.decision);

  return (
    <div id="work-monitoring-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-900 text-[11px] font-extrabold rounded font-mono uppercase tracking-wider">
              {isHindi ? "सीआईएफ - कार्य प्रगति निगरानी इंजन" : "CIF — Work Ingestion & Monitoring"}
            </span>

            {/* LIVE MONITORING SENSOR ANIMATED BADGE */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50/90 border border-emerald-300 rounded-full shadow-2xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-extrabold text-emerald-950 uppercase tracking-wide">
                {isHindi ? "लाइव निगरानी सेंसर" : "LIVE MONITORING SENSOR"}
              </span>
              <span className="bg-emerald-800 text-white text-[10px] px-2 py-0.5 rounded font-extrabold font-mono uppercase tracking-wider shadow-2xs">
                NIC-SECURE
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Sliders className="w-7 h-7 text-blue-600" />
            {isHindi
              ? "कार्य आवंटन व प्रगति निगरानी"
              : "Work Progress & Monitoring"}
          </h1>
          <p className="text-xs text-slate-600">
            {isHindi
              ? "सीएसवी प्रगति रिपोर्ट की स्वतंत्र भौतिक, वित्तीय, चित्र एवं श्रम साक्ष्यों से तुलना व सत्यापन।"
              : "Cross-validating periodic CSV progress claims against physical, financial, image ML, and labour evidence."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
          >
            <option value="WORK_UP_10293">Project: WORK_UP_10293 (Road & Drain)</option>
            <option value="WORK_UP_10294">Project: WORK_UP_10294 (Health Center)</option>
          </select>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-lg transition-colors shadow-sm flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {isHindi ? "सीएसवी अपलोड करें" : "Ingest CSV Records"}
            </button>
        </div>
      </div>

      {/* 4 KPI Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Physical Progress */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs relative overflow-hidden card-hover-effect">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isHindi ? "भौतिक प्रगति (Physical)" : "Physical Progress"}
            </span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{calculatedPhysicalPct}%</span>
            <span className="text-xs text-slate-500">
              (Reported: <span className="font-bold text-amber-600">{reportedPhysicalPct}%</span>)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Gap:{" "}
            <span className="font-bold text-red-600">
              {(reportedPhysicalPct - calculatedPhysicalPct).toFixed(1)}% points
            </span>
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${calculatedPhysicalPct}%` }}
            />
          </div>
        </div>

        {/* Financial Expenditure */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs relative overflow-hidden card-hover-effect">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isHindi ? "वित्तीय व्यय (Financial)" : "Financial Expenditure"}
            </span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{financialPct}%</span>
            <span className="text-xs text-slate-500 font-mono">({formatINR(reportedSpent)})</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Budget: <span className="font-semibold text-slate-700">{formatINR(totalAssignedAmount)}</span>
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${financialPct}%` }}
            />
          </div>
        </div>

        {/* Time Elapsed */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isHindi ? "बीता हुआ समय (Time)" : "Time Elapsed"}
            </span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{timeElapsedPct}%</span>
            <span className="text-xs text-slate-500">
              Deviation:{" "}
              <span className="font-bold text-red-600">{(timeElapsedPct - calculatedPhysicalPct)}%</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Planned End: <span className="font-semibold text-slate-700">2026-08-30</span>
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all"
              style={{ width: `${timeElapsedPct}%` }}
            />
          </div>
        </div>

        {/* Risk Score */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isHindi ? "समग्र जोखिम स्कोर" : "Composite Risk Score"}
            </span>
            <ShieldAlert className="w-5 h-5 text-red-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-600">{investigation.risk_score}</span>
            <span className="text-xs font-bold px-2 py-0.5 bg-red-100 text-red-800 rounded uppercase">
              {investigation.priority}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Active Signals: <span className="font-bold text-slate-900">{signals.length}</span>
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-red-600 h-full rounded-full transition-all"
              style={{ width: `${investigation.risk_score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Human Investigation Verdict Banner */}
      <div className={`p-5 rounded-xl border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${decisionMeta.bg}`}>
        <div className="flex items-start gap-3">
          <decisionMeta.icon className="w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold tracking-wider uppercase">
                {isHindi ? "मानव जांच अनुशंसक" : "HUMAN INVESTIGATION ENGINE VERDICT"}
              </span>
              <span className="px-2 py-0.5 bg-white/70 text-slate-900 font-bold rounded text-[11px] font-mono">
                {decisionMeta.label}
              </span>
            </div>
            <p className="text-xs font-medium mt-1">
              {investigation.reasons[0] || "Multiple cross-domain evidence contradictions detected."}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <button
            onClick={() => setActiveTab("fusion")}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            {isHindi ? "साक्ष्य संलयन देखें" : "View Multimodal Evidence"}
          </button>
        </div>
      </div>

      {/* View Section Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 gap-2 pt-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "overview"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          {isHindi ? "ओवरव्यू व अनुशंसित जांच" : "Overview & Recommended Checks"}
        </button>
        <button
          onClick={() => setActiveTab("timeline")}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "timeline"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Calendar className="w-4 h-4" />
          {isHindi ? "कालक्रमिक प्रगति व जोखिम टाइमलाइन" : "Progress & Risk Timeline"}
        </button>
        <button
          onClick={() => setActiveTab("signals")}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "signals"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          {isHindi ? `व्याख्यात्मक संकेत (${signals.length})` : `Explainable Signals (${signals.length})`}
        </button>
        <button
          onClick={() => setActiveTab("fusion")}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "fusion"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          {isHindi ? "बहुआयामी साक्ष्य संलयन" : "Multimodal Evidence Fusion"}
        </button>
      </div>

      {/* Tab 1: Overview & Recommended Checks */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Actionable Recommended Checks Checklist */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              {isHindi ? "मानव लेखापरीक्षक हेतु अनुशंसित कदम" : "Actionable Recommended Checks for Human Auditor"}
            </h3>
            <p className="text-xs text-slate-600">
              {isHindi
                ? "सिस्टम ने धोखाधड़ी की घोषणा किए बिना ऑडिट हेतु निम्नलिखित विशिष्ट बिंदुओं की पहचान की है:"
                : "System generated explicit audit instructions to verify claims without making direct fraud accusations:"}
            </p>

            <div className="space-y-2.5">
              {investigation.recommended_checks.map((check, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-3 hover:bg-slate-100/70 transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-medium text-slate-800">{check}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Evidence Summary */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-slate-600" />
              {isHindi ? "साक्ष्य सारांश" : "Evidence Domain Summary"}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between">
                <span className="font-semibold text-blue-900">Work Progress CSV</span>
                <span className="font-mono font-bold text-blue-700">{calculatedPhysicalPct}% calculated</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
                <span className="font-semibold text-emerald-900">Document OCR Invoices</span>
                <span className="font-mono font-bold text-emerald-700">61% verified spend</span>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 flex items-center justify-between">
                <span className="font-semibold text-purple-900">Field Image ML</span>
                <span className="font-mono font-bold text-purple-700">35% visual estimate</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between">
                <span className="font-semibold text-amber-900">Muster Roll Labour</span>
                <span className="font-mono font-bold text-amber-700">340 worker-days</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Chronological Progress & Risk Timeline */}
      {activeTab === "timeline" && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                {isHindi ? "प्रगति एवं जोखिम समयरेखा (Monthly Escalation)" : "Progress Velocity & Risk Score Escalation Timeline"}
              </h3>
              <p className="text-xs text-slate-500">
                {isHindi
                  ? "प्रत्येक प्रगति रिपोर्ट माह के बाद जोखिम परिवर्तन एवं संकेतकों की ट्रैकिंग"
                  : "Tracks how reported physical progress, financial spent, and composite risk evolve over report dates."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {timeline.map((event, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border relative transition-all ${
                  event.risk_score >= 70
                    ? "bg-red-50/50 border-red-200"
                    : event.risk_score >= 40
                    ? "bg-amber-50/50 border-amber-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 mb-3">
                  <span className="text-xs font-bold text-slate-900 font-mono">{event.date}</span>
                  <span
                    className={`text-[11px] font-black px-2 py-0.5 rounded ${
                      event.risk_score >= 70
                        ? "bg-red-600 text-white"
                        : event.risk_score >= 40
                        ? "bg-amber-500 text-white"
                        : "bg-emerald-600 text-white"
                    }`}
                  >
                    Risk Score: {event.risk_score}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Reported Progress:</span>
                    <span className="font-bold text-slate-900">{event.reported_progress}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Calculated Physical:</span>
                    <span className="font-bold text-blue-700">{event.calculated_progress}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Financial Progress:</span>
                    <span className="font-bold text-emerald-700">{event.financial_progress}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Visual Image Progress:</span>
                    <span className="font-bold text-purple-700">{event.visual_progress}%</span>
                  </div>
                </div>

                {event.signals.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] font-bold uppercase text-red-700 block mb-1">
                      Active Signals:
                    </span>
                    {event.signals.map((sig, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-block text-[10px] font-bold bg-red-100 text-red-900 px-2 py-0.5 rounded mr-1 mb-1 font-mono"
                      >
                        {sig}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Explainable Signals */}
      {activeTab === "signals" && (
        <div className="space-y-4">
          {signals.map((sig) => (
            <div
              key={sig.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 text-[11px] font-extrabold rounded font-mono uppercase ${
                      sig.severity === "CRITICAL"
                        ? "bg-red-600 text-white"
                        : sig.severity === "HIGH"
                        ? "bg-red-100 text-red-900 border border-red-300"
                        : "bg-amber-100 text-amber-900 border border-amber-300"
                    }`}
                  >
                    {sig.severity}
                  </span>
                  <span className="text-sm font-bold text-slate-900 font-mono">{sig.signal_type}</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">Score: {sig.signal_score} / 100</span>
              </div>

              <p className="text-xs font-semibold text-slate-800">{sig.reason}</p>

              <div className="p-3 bg-slate-900 text-slate-200 rounded-lg text-xs font-mono">
                <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">
                  Mathematical Evidence Breakdown:
                </span>
                <pre className="whitespace-pre-wrap">{JSON.stringify(sig.evidence, null, 2)}</pre>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Multimodal Evidence Fusion */}
      {activeTab === "fusion" && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b pb-4 border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                {isHindi ? "बहुआयामी साक्ष्य संलयन इंजन" : "Multimodal Evidence Fusion Analysis"}
              </h3>
              <p className="text-xs text-slate-500">
                {isHindi
                  ? "दस्तावेज़ OCR, श्रम मस्टर रोल, क्षेत्र चित्रों व सीएसवी प्रगति का एकीकृत विश्लेषण।"
                  : "Cross-corroborates Document OCR, Muster Roll, Field Image ML, and CSV Work Progress."}
              </p>
            </div>
            <span className="px-3 py-1 bg-purple-100 text-purple-900 font-mono font-bold text-xs rounded-full">
              Composite Risk: {fusion.composite_risk_score} / 100
            </span>
          </div>

          {fusion.contradiction_detected && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2">
              <span className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                MULTIMODAL CONTRADICTION DETECTED
              </span>
              <ul className="list-disc list-inside text-xs text-red-800 space-y-1 font-medium">
                {fusion.contradiction_reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 4 Domain Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 text-xs space-y-2">
              <span className="font-bold text-blue-900 block uppercase">1. CSV Work Progress</span>
              <p className="text-slate-700">Physical: <span className="font-bold text-blue-700">{fusion.domains.work_progress.physical_progress_percent}%</span></p>
              <p className="text-slate-700">Financial: <span className="font-bold text-emerald-700">{fusion.domains.work_progress.financial_progress_percent}%</span></p>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs space-y-2">
              <span className="font-bold text-emerald-900 block uppercase">2. Document OCR</span>
              <p className="text-slate-700">Verified Spend: <span className="font-bold text-emerald-700">{fusion.domains.documents.verified_expenditure_percent}%</span></p>
              <p className="text-slate-700">Verified Invoices: <span className="font-bold text-slate-900">{fusion.domains.documents.total_invoices_verified}</span></p>
            </div>

            <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200 text-xs space-y-2">
              <span className="font-bold text-purple-900 block uppercase">3. Field Image ML</span>
              <p className="text-slate-700">Visual Progress: <span className="font-bold text-purple-700">{fusion.domains.field_images.visual_progress_percent}%</span></p>
              <p className="text-slate-700">Quality Score: <span className="font-bold text-slate-900">{fusion.domains.field_images.quality_score}</span></p>
            </div>

            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-xs space-y-2">
              <span className="font-bold text-amber-900 block uppercase">4. Labour Intelligence</span>
              <p className="text-slate-700">Worker Days: <span className="font-bold text-amber-800">{fusion.domains.labour.worker_days}</span></p>
              <p className="text-slate-700">Anomaly: <span className="font-bold text-red-600">Yes (Low Support)</span></p>
            </div>
          </div>
        </div>
      )}

      {/* CSV Ingestion Modal Component */}
      <CSVWorkMonitoringUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => {
          setIsUploadModalOpen(false);
        }}
        projectId={selectedProjectId}
        language={language}
      />
    </div>
  );
};
