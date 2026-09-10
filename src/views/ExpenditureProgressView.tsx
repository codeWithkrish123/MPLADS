import React, { useState } from "react";
import {
  Sliders,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  Building2,
  Calendar,
  Sparkles,
  Info,
  ShieldAlert,
  Download,
} from "lucide-react";
import { WorkRecord, Language, UserRole } from "../types";
import { formatINR } from "../lib/utils";
import { getTranslation } from "../data/translations";
import { EmptyState } from "../components/common/EmptyState";
import { exportToCSV } from "../utils/exportUtils";

interface ExpenditureProgressViewProps {
  works: WorkRecord[];
  onSelectWork: (work: WorkRecord) => void;
  language?: Language;
  currentRole?: UserRole;
}

export const ExpenditureProgressView: React.FC<ExpenditureProgressViewProps> = ({
  works,
  onSelectWork,
  language = "en",
  currentRole = "Ministry",
}) => {
  const currentLang: Language = (language || "en") as Language;
  const isHindi = currentLang === "hi";
  const t = getTranslation(currentLang);
  
  // Fallback data
  const fallbackWork = {
    work_id: "UP-GZB-2024-001",
    financial_progress: 65,
    physical_progress: 45,
    actual_expenditure: 2500000,
    description: "Road construction project",
  };
  
  const [selectedWorkId, setSelectedWorkId] = useState(works[0]?.work_id || fallbackWork.work_id);
  const currentWork = works.find((w) => w.work_id === selectedWorkId) || works[0] || fallbackWork;

  const monthlyTimeline = [
    { month: isHindi ? "माह 1 (अप्रैल)" : "Month 1 (Apr)", physical: 5, financial: 20 },
    { month: isHindi ? "माह 3 (जून)" : "Month 3 (Jun)", physical: 15, financial: 35 },
    { month: isHindi ? "माह 6 (सितंबर)" : "Month 6 (Sep)", physical: 25, financial: 55 },
    { month: isHindi ? "माह 9 (दिसंबर)" : "Month 9 (Dec)", physical: 35, financial: 70 },
    { month: isHindi ? "माह 12 (मार्च)" : "Month 12 (Mar)", physical: 43, financial: 81 },
  ];

  const divergenceDelta = currentWork.financial_progress - currentWork.physical_progress;

  const handleExportExpenditureReport = () => {
    exportToCSV("MPLADS_Expenditure_vs_Progress_Trajectory.csv", [
      {
        work_id: currentWork.work_id,
        financial_progress_pct: currentWork.financial_progress,
        physical_progress_pct: currentWork.physical_progress,
        divergence_gap_pct: divergenceDelta,
        actual_expenditure_inr: currentWork.actual_expenditure,
        statutory_status: divergenceDelta > 25 ? "TRANCHE_SUSPENDED_RULE_4_1" : "COMPLIANT",
      },
    ]);
  };

  return (
    <div id="expenditure-progress-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Show empty state if no works */}
      {(!works || works.length === 0) && (
        <EmptyState
          title={isHindi ? "कोई कार्य नहीं मिला" : "No Works Found"}
          description={isHindi ? "डेटाबेस में कोई परियोजना उपलब्ध नहीं है। कृपया बाद में पुनः प्रयास करें।" : "No projects available in the database. Please try again later."}
        />
      )}

      {works && works.length > 0 && (
        <>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-red-100 text-red-950 border border-red-300 text-[11px] font-extrabold rounded-md font-mono uppercase tracking-wider">
              {isHindi ? "विचलन मॉडल" : "Divergence Model"}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {isHindi ? "किश्त बनाम मील का पत्थर सत्यापन" : "Tranche vs Milestone Verification"}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Sliders className="w-7 h-7 text-[#1B3A7A]" />
            {currentRole === "Member of Parliament"
              ? (isHindi ? "व्यय गतिशीलता बनाम प्रगति" : "Progress vs Spent Velocity")
              : (isHindi ? "प्रगति बनाम व्यय गतिशीलता" : "Progress vs Spent Velocity")}
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            {isHindi
              ? "प्रमाणित ऑन-साइट इंजीनियरिंग मील के पत्थरों के विरुद्ध रीयल-टाइम फंड आहरण गति की निगरानी।"
              : "Real-time surveillance monitoring fund drawdown velocities against certified on-site engineering milestones."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedWorkId}
            onChange={(e) => setSelectedWorkId(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#1B3A7A] cursor-pointer shadow-2xs"
          >
            {works.slice(0, 6).map((w) => (
              <option key={w.work_id} value={w.work_id}>
                {w.work_id} — {w.description.slice(0, 30)}...
              </option>
            ))}
          </select>
          <button
            onClick={handleExportExpenditureReport}
            className="px-3.5 py-2 bg-[#1B3A7A] hover:bg-[#0F2A6B] text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-[#FF9933]" />
            <span>{isHindi ? "रिपोर्ट डाउनलोड करें" : "Download Report"}</span>
          </button>
        </div>
      </div>

      {/* Critical Alert Warning */}
      <div className="p-4 bg-gradient-to-r from-red-50 via-red-50/90 to-amber-50/80 border-2 border-red-300 rounded-2xl flex items-start gap-3.5 shadow-xs">
        <div className="p-2 bg-red-600 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="text-xs space-y-1">
          <div className="font-black text-red-950 text-sm leading-tight flex items-center gap-2">
            <span>
              {isHindi
                ? `गंभीर प्रगति-फंड विचलन पाया गया: +${divergenceDelta}% असमानता`
                : `Severe Progress-Fund Divergence Detected: +${divergenceDelta}% Disparity`}
            </span>
            <span className="px-2 py-0.5 bg-red-700 text-white text-[10px] font-mono font-bold rounded uppercase">
              AUTOMATED DISBURSAL PAUSE
            </span>
          </div>
          <p className="text-red-900 leading-relaxed font-medium">
            {isHindi ? (
              <>
                कार्य <strong className="font-bold font-mono">{currentWork.work_id}</strong> के लिए, संचयी वित्तीय संवितरण <strong className="font-bold">{currentWork.financial_progress}%</strong> ({formatINR(currentWork.actual_expenditure)}) पर है, जबकि सत्यापित भौतिक स्थल प्रगति केवल <strong className="font-bold">{currentWork.physical_progress}%</strong> प्रमाणित है।
              </>
            ) : (
              <>
                For work <strong className="font-bold font-mono">{currentWork.work_id}</strong>, cumulative financial disbursement stands at <strong className="font-bold">{currentWork.financial_progress}%</strong> ({formatINR(currentWork.actual_expenditure)}) while verified physical site progress is certified at only <strong className="font-bold">{currentWork.physical_progress}%</strong>.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Progress Metric Compare Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-2 hover:border-slate-300 transition-all">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            {isHindi ? "वित्तीय उपयोग आहरण" : "Financial Utilization Drawdown"}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-red-700">
              {currentWork.financial_progress}%
            </span>
            <span className="text-xs text-slate-500 font-mono font-semibold">
              ({formatINR(currentWork.actual_expenditure)})
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-700 rounded-full transition-all duration-700"
              style={{ width: `${currentWork.financial_progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-2 hover:border-slate-300 transition-all">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            {isHindi ? "प्रमाणित भौतिक मील का पत्थर" : "Certified Physical Milestone"}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-emerald-700">
              {currentWork.physical_progress}%
            </span>
            <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {isHindi ? "जियोटैग व सत्यापित" : "Geotagged & Verified"}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full transition-all duration-700"
              style={{ width: `${currentWork.physical_progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-2 hover:border-slate-300 transition-all">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            {isHindi ? "विचलन अंतर (वित्तीय - भौतिक)" : "Divergence Gap (Financial - Physical)"}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-red-600">
              +{divergenceDelta}%
            </span>
            <span className="text-[11px] font-mono font-extrabold text-red-800 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
              {isHindi ? "गंभीर सीमा (>25%)" : "CRITICAL THRESHOLD (>25%)"}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-600 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(divergenceDelta * 2, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Trajectory Timeline Chart — Animated Progress Bars */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <div>
            <h3 className="text-sm font-black text-[#0A2740] uppercase tracking-wider">
              {isHindi ? "संचयी प्रगति पथ (द्वि-अक्ष समयरेखा)" : "CUMULATIVE MILESTONE TRAJECTORY (DUAL-AXIS TIMELINE)"}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {isHindi ? "सत्यापित चरण समापन के विरुद्ध संचयी किश्त जारी करने की तुलना" : "Comparing cumulative tranche release against verified stage completion"}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-red-600 shadow-2xs" />
              <span className="text-slate-800">{isHindi ? "वित्तीय प्रगति %" : "Financial Progress %"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 shadow-2xs" />
              <span className="text-slate-800">{isHindi ? "भौतिक प्रगति %" : "Physical Progress %"}</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Comparison Over Months with Smooth Animated Widths */}
        <div className="space-y-5 pt-2">
          {monthlyTimeline.map((item, idx) => (
            <div key={idx} className="space-y-2 p-3 bg-slate-50/60 border border-slate-200/70 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-900">
                <span className="font-mono">{item.month}</span>
                <div className="flex items-center gap-4 font-mono text-[11.5px]">
                  <span className="text-emerald-700 font-bold">{isHindi ? "भौतिक:" : "Phy:"} {item.physical}%</span>
                  <span className="text-red-700 font-bold">{isHindi ? "वित्तीय:" : "Fin:"} {item.financial}%</span>
                  <span className="text-slate-500 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
                    {isHindi ? "अंतर:" : "Gap:"} +{item.financial - item.physical}%
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                {/* Financial bar */}
                <div className="w-full h-3 bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-red-700 rounded-full transition-all duration-1000 ease-out shadow-2xs"
                    style={{ width: `${item.financial}%` }}
                  />
                </div>
                {/* Physical bar */}
                <div className="w-full h-3 bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full transition-all duration-1000 ease-out shadow-2xs"
                    style={{ width: `${item.physical}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Redesigned Statutory Guidance / Executive Directive Banner (Image 4 Fix) */}
      <div className="bg-gradient-to-r from-amber-50/90 via-slate-50 to-blue-50/80 border-l-4 border-l-[#FF9933] border-y border-r border-slate-200 rounded-2xl p-6 shadow-md space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#1B3A7A] text-white rounded-xl shadow-xs">
              <ShieldAlert className="w-5 h-5 text-[#FF9933]" />
            </div>
            <h3 className="text-sm font-black text-[#0A2740] uppercase tracking-wider">
              {isHindi ? "निर्णय सहायता निर्देश" : "DECISION SUPPORT DIRECTIVE"}
            </h3>
          </div>
          <span className="text-[11px] font-mono font-extrabold text-[#1B3A7A] bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs self-start sm:self-auto">
            {isHindi ? "नियम संदर्भ: 2023 दिशानिर्देश पैरा 4.1" : "RULE REFERENCE: 2023 GUIDELINES PARA 4.1"}
          </span>
        </div>
        <p className="text-slate-800 text-xs leading-relaxed font-semibold">
          {isHindi
            ? "जब वित्तीय उपयोग भौतिक उपलब्धि से 25% से अधिक हो जाता है, तो प्रणाली स्वचालित रूप से आगामी किश्तों के हस्तांतरण को रोक देती है। कार्यान्वयन एजेंसी को उपयोग प्रमाण पत्र (UC) और निष्पादन इंजीनियर द्वारा प्रमाणित जियोटैग किए गए एमबी (माप पुस्तक) फोटो जमा करने होंगे।"
            : "When financial utilization exceeds physical milestone progress by >25%, the system automatically suspends next tranche transfer. The implementing agency must submit Utilization Certificate (UC) and geotagged MB (Measurement Book) photographs certified by the Executive Engineer."}
        </p>
      </div>
        </>
      )}
    </div>
  );
};