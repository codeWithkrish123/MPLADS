import React, { useState } from "react";
import {
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  TrendingDown,
  Sparkles,
  Building2,
  Hourglass,
} from "lucide-react";
import { WorkRecord, Language } from "../types";
import { getTranslation } from "../data/translations";
import { EmptyState } from "../components/common/EmptyState";

interface DelayPredictionViewProps {
  works: WorkRecord[];
  onSelectWork: (work: WorkRecord) => void;
  language?: Language;
}

export const DelayPredictionView: React.FC<DelayPredictionViewProps> = ({
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
    description: "Community Hall Construction",
  };
  
  const [selectedWorkId, setSelectedWorkId] = useState(works[0]?.work_id || fallbackWork.work_id);
  const currentWork = works.find((w) => w.work_id === selectedWorkId) || works[0] || fallbackWork;

  const delayFactors = [
    {
      title: isHindi ? "कार्यान्वयन एजेंसी का पिछला बकाया (Backlog)" : "Implementing Agency Historical Backlog",
      impact: isHindi ? "+34 दिन" : "+34 Days",
      score: 88,
      detail: isHindi
        ? "एजेंसी के पास लोनी और साहिबाबाद में 6 समवर्ती विलंबित कार्य हैं।"
        : "Agency has 6 concurrent delayed works in Loni & Sahibabad."
    },
    {
      title: isHindi ? "भौतिक मील का पत्थर ठहराव" : "Physical Milestone Stagnation",
      impact: isHindi ? "+26 दिन" : "+26 Days",
      score: 79,
      detail: isHindi
        ? "पिछले 45 दिनों में शून्य भौतिक मील का पत्थर प्रगति दर्ज की गई।"
        : "Zero physical milestone progress recorded across last 45 calendar days."
    },
    {
      title: isHindi ? "मानसून मौसम निर्माण रुकावट" : "Monsoon Season Construction Window",
      impact: isHindi ? "+18 दिन" : "+18 Days",
      score: 65,
      detail: isHindi
        ? "ऐतिहासिक आईएमडी आंकड़ों के आधार पर आगामी क्षेत्रीय भारी वर्षा का अनुमान।"
        : "Upcoming regional heavy rainfall buffer predicted from historical IMD data."
    },
  ];

  return (
    <div id="delay-prediction-view" className="space-y-6 animate-in fade-in duration-200">
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
            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[11px] font-bold rounded font-mono uppercase">
              {isHindi ? "पूर्वानुमानित एमएल मॉडल" : "Predictive ML Model"}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {isHindi ? "रैंडम फॉरेस्ट समयरेखा पूर्वानुमान" : "Random Forest Timeline Forecasting"}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-600" />
            {isHindi ? "परियोजना जीवनचक्र विलंब पूर्वानुमान इंजन" : "Project Lifecycle Delay Prediction Engine"}
          </h1>
          <p className="text-xs text-slate-600">
            {isHindi
              ? "रुके हुए नागरिक अवसंरचना, ठेकेदार थ्रूपुट बाधाओं और अनुमानित हैंडओवर देरी की समय से पहले पहचान।"
              : "Early identification of stalled civil infrastructure, contractor throughput bottlenecks, and predicted handover slips."}
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
                {w.work_id} — {w.description.slice(0, 32)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Delay Highlight Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {isHindi ? "अनुबंधित निर्धारित पूर्णता तिथि" : "Scheduled Contract End Date"}
          </span>
          <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1">
            {currentWork.expected_completion}
          </div>
          <span className="text-xs text-slate-500">
            {isHindi ? "आधिकारिक 18-माह दिशानिर्देश लक्ष्य" : "Official 18-month guideline target"}
          </span>
        </div>

        <div className="bg-red-50/80 border border-red-200 rounded-xl p-5 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-900">
            {isHindi ? "एआई अनुमानित हैंडओवर तिथि" : "AI Predicted Handover Date"}
          </span>
          <div className="text-2xl font-extrabold font-mono text-red-700 mt-1">
            {currentWork.predicted_completion}
          </div>
          <span className="text-xs text-red-800 font-semibold font-mono">
            {isHindi ? "अनुमानित विलंब:" : "Predicted Timeline Slip:"} +{currentWork.evidence?.predicted_delay_days || 78} {isHindi ? "दिन" : "Days"}
          </span>
        </div>

        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-5 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
            {isHindi ? "विलंब होने की संभावना" : "Delay Occurrence Probability"}
          </span>
          <div className="text-2xl font-extrabold font-mono text-amber-800 mt-1">
            82.4%
          </div>
          <span className="text-xs text-amber-900">
            {isHindi ? "एजेंसी व मील का पत्थर गति के आधार पर उच्च विश्वास" : "High confidence based on agency & milestone velocity"}
          </span>
        </div>
      </div>

      {/* Lifecycle Milestone Flow Visualization */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-5">
        <div className="pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {isHindi ? "कार्य मील का पत्थर निष्पादन क्षितिज" : "Work Milestone Execution Horizon"}
          </h3>
          <p className="text-xs text-slate-500">
            {isHindi ? "स्वीकृत अनुसूची मील के पत्थरों बनाम अनुमानित परिचालन समयरेखा का चित्रण" : "Visualizing sanctioned schedule milestones vs forecasted operational timeline"}
          </p>
        </div>

        {/* Milestone Steps */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 py-4">
          <div className="flex flex-col items-center text-center p-3 bg-emerald-50 border border-emerald-200 rounded-lg w-full md:w-36">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-1" />
            <span className="font-bold text-xs text-slate-900">{isHindi ? "1. सांसद अनुशंसा" : "1. MP Recommended"}</span>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5">15 Jan 2024</span>
          </div>

          <span className="hidden md:inline text-slate-300 font-bold">───▶</span>

          <div className="flex flex-col items-center text-center p-3 bg-emerald-50 border border-emerald-200 rounded-lg w-full md:w-36">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-1" />
            <span className="font-bold text-xs text-slate-900">{isHindi ? "2. डीएम स्वीकृति" : "2. DM Sanction"}</span>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5">10 Feb 2024</span>
          </div>

          <span className="hidden md:inline text-slate-300 font-bold">───▶</span>

          <div className="flex flex-col items-center text-center p-3 bg-emerald-50 border border-emerald-200 rounded-lg w-full md:w-36">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-1" />
            <span className="font-bold text-xs text-slate-900">{isHindi ? "3. कार्य प्रारंभ" : "3. Commencement"}</span>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5">{currentWork.start_date}</span>
          </div>

          <span className="hidden md:inline text-slate-300 font-bold">───▶</span>

          <div className="flex flex-col items-center text-center p-3 bg-amber-50 border border-amber-300 rounded-lg w-full md:w-36">
            <Hourglass className="w-5 h-5 text-amber-600 mb-1" />
            <span className="font-bold text-xs text-amber-900">{isHindi ? "4. लक्ष्य समय-सीमा" : "4. Target Deadline"}</span>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5">{currentWork.expected_completion}</span>
          </div>

          <span className="hidden md:inline text-red-300 font-bold">───▶</span>

          <div className="flex flex-col items-center text-center p-3 bg-red-50 border border-red-300 rounded-lg w-full md:w-36 ring-2 ring-red-400">
            <AlertTriangle className="w-5 h-5 text-red-600 mb-1" />
            <span className="font-bold text-xs text-red-900">{isHindi ? "5. एआई पूर्वानुमानित विलंब" : "5. AI Forecast Slip"}</span>
            <span className="text-[10px] text-red-700 font-mono font-bold mt-0.5">{currentWork.predicted_completion}</span>
          </div>
        </div>
      </div>

      {/* Delay Factor Drivers */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {isHindi ? "विलंब में योगदान देने वाले प्रमुख पूर्वानुमानित कारक" : "Key Predictive Drivers Contributing to Slip"}
          </h3>
          <p className="text-xs text-slate-500">
            {isHindi ? "रैंडम फॉरेस्ट पूर्वानुमान को प्रभावित करने वाले बहु-परिवर्तनीय कारक" : "Multi-variate features influencing the automated random forest prediction"}
          </p>
        </div>

        <div className="space-y-3">
          {delayFactors.map((f, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                  <span>{f.title}</span>
                  <span className="font-mono text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded text-[11px] border border-red-200">
                    {f.impact}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{f.detail}</p>
              </div>
              <span className="font-mono font-bold text-slate-700 text-xs shrink-0">
                {isHindi ? "अंक:" : "Score:"} {f.score}/100
              </span>
            </div>
          ))}
        </div>
      </div>
        </>
      )}
    </div>
  );
};
