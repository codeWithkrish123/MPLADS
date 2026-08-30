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
} from "lucide-react";
import { WorkRecord, Language } from "../types";
import { formatINR } from "../lib/utils";
import { getTranslation } from "../data/translations";
import { EmptyState } from "../components/common/EmptyState";

interface ExpenditureProgressViewProps {
  works: WorkRecord[];
  onSelectWork: (work: WorkRecord) => void;
  language?: Language;
}

export const ExpenditureProgressView: React.FC<ExpenditureProgressViewProps> = ({
  works,
  onSelectWork,
  language = "en",
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-red-100 text-red-900 text-[11px] font-bold rounded font-mono uppercase">
              {isHindi ? "विचलन मॉडल" : "Divergence Model"}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {isHindi ? "किश्त बनाम मील का पत्थर सत्यापन" : "Tranche vs Milestone Verification"}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-blue-600" />
            {isHindi ? "व्यय बनाम भौतिक प्रगति विचलन" : "Expenditure vs Physical Progress Divergence"}
          </h1>
          <p className="text-xs text-slate-600">
            {isHindi
              ? "प्रमाणित ऑन-साइट इंजीनियरिंग मील के पत्थरों के विरुद्ध रीयल-टाइम फंड आहरण गति की निगरानी।"
              : "Real-time surveillance monitoring fund drawdown velocities against certified on-site engineering milestones."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedWorkId}
            onChange={(e) => setSelectedWorkId(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
          >
            {works.slice(0, 6).map((w) => (
              <option key={w.work_id} value={w.work_id}>
                {w.work_id} — {w.description.slice(0, 30)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Critical Alert Warning matching Image 1 */}
      <div className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl flex items-start gap-3 shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-[#A3372F] shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-[#7F1D1D] text-sm leading-tight">
            {isHindi
              ? `गंभीर प्रगति-फंड विचलन पाया गया: +${divergenceDelta}% असमानता`
              : `Severe Progress-Fund Divergence Detected: +${divergenceDelta}% Disparity`}
          </div>
          <p className="text-[#991B1B] leading-relaxed">
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
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {isHindi ? "वित्तीय उपयोग आहरण" : "Financial Utilization Drawdown"}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-red-700">
              {currentWork.financial_progress}%
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({formatINR(currentWork.actual_expenditure)})
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-red-600 rounded-full" style={{ width: `${currentWork.financial_progress}%` }} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {isHindi ? "प्रमाणित भौतिक मील का पत्थर" : "Certified Physical Milestone"}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-700">
              {currentWork.physical_progress}%
            </span>
            <span className="text-xs text-slate-500">
              {isHindi ? "जियोटैग व सत्यापित" : "Geotagged & Verified"}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${currentWork.physical_progress}%` }} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {isHindi ? "विचलन अंतर (वित्तीय - भौतिक)" : "Divergence Gap (Financial - Physical)"}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-red-600">
              +{divergenceDelta}%
            </span>
            <span className="text-xs font-mono font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
              {isHindi ? "गंभीर सीमा (>25%)" : "CRITICAL THRESHOLD (>25%)"}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(divergenceDelta * 2, 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Trajectory Timeline Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {isHindi ? "संचयी प्रगति पथ (द्वि-अक्ष समयरेखा)" : "Cumulative Milestone Trajectory (Dual-Axis Timeline)"}
            </h3>
            <p className="text-xs text-slate-500">
              {isHindi ? "सत्यापित चरण समापन के विरुद्ध संचयी किश्त जारी करने की तुलना" : "Comparing cumulative tranche release against verified stage completion"}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-600" />
              <span className="text-slate-700">{isHindi ? "वित्तीय प्रगति %" : "Financial Progress %"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600" />
              <span className="text-slate-700">{isHindi ? "भौतिक प्रगति %" : "Physical Progress %"}</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Comparison Over Months */}
        <div className="space-y-4 pt-2">
          {monthlyTimeline.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span>{item.month}</span>
                <div className="flex items-center gap-4 font-mono text-[11px]">
                  <span className="text-emerald-700">{isHindi ? "भौतिक:" : "Phy:"} {item.physical}%</span>
                  <span className="text-red-700">{isHindi ? "वित्तीय:" : "Fin:"} {item.financial}%</span>
                  <span className="text-slate-400 font-normal">{isHindi ? "अंतर:" : "Gap:"} +{item.financial - item.physical}%</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 rounded-full" style={{ width: `${item.financial}%` }} />
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${item.physical}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statutory Guidance */}
      <div className="bg-slate-900 text-slate-100 rounded-xl p-5 shadow-lg border border-slate-800 space-y-3 text-xs">
        <div className="flex items-center justify-between text-amber-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            {isHindi ? "निर्णय सहायता निर्देश" : "Decision Support Directive"}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {isHindi ? "नियम संदर्भ: 2023 दिशानिर्देश पैरा 4.1" : "Rule Reference: 2023 Guidelines Para 4.1"}
          </span>
        </div>
        <p className="text-slate-300 leading-relaxed">
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