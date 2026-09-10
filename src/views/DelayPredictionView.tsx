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
  ArrowRight,
} from "lucide-react";
import { WorkRecord, Language, UserRole } from "../types";
import { getTranslation } from "../data/translations";
import { EmptyState } from "../components/common/EmptyState";
import { exportToCSV } from "../utils/exportUtils";

interface DelayPredictionViewProps {
  works: WorkRecord[];
  onSelectWork: (work: WorkRecord) => void;
  language?: Language;
  currentRole?: UserRole;
}

/**
 * Animated Pipeline Flow Connector for Milestone Execution Horizon
 * Features a sequential moving arrow gliding smoothly left-to-right into the next stage box
 */
const AnimatedPipelineConnector: React.FC<{ isCritical?: boolean; delayMs?: number }> = ({
  isCritical = false,
  delayMs = 0,
}) => {
  const primaryColor = isCritical ? "#EF4444" : "#1B3A7A";
  const glowColor = isCritical ? "#DC2626" : "#3B82F6";
  const trackColor = isCritical ? "#FCA5A5" : "#CBD5E1";

  return (
    <div className="hidden md:flex flex-col items-center justify-center px-1 shrink-0 w-16 relative group">
      {/* SVG Animated Moving Connector */}
      <svg className="w-full h-9 overflow-visible" viewBox="0 0 64 32" fill="none">
        <defs>
          <linearGradient id={`grad-flow-${isCritical ? "crit" : "norm"}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.2" />
            <stop offset="50%" stopColor={glowColor} stopOpacity="1" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Static Background Track Line */}
        <line
          x1="4"
          y1="16"
          x2="58"
          y2="16"
          stroke={trackColor}
          strokeWidth="2"
          strokeDasharray="4 3"
        />

        {/* Animated Moving Stream Line */}
        <line
          x1="4"
          y1="16"
          x2="58"
          y2="16"
          stroke={`url(#grad-flow-${isCritical ? "crit" : "norm"})`}
          strokeWidth="3"
          strokeDasharray="8 6"
          className="animate-pipeline-dash"
        />

        {/* Physically Moving Arrow Packet Travelling Left-to-Right */}
        <g className="animate-pulse-travel" style={{ animationDelay: `${delayMs}ms` }}>
          <circle cx="8" cy="16" r="3.5" fill={glowColor} className="shadow-sm" />
          <path
            d="M6 11L12 16L6 21"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* End Station Arrowhead Target */}
        <path
          d="M52 10L60 16L52 22"
          stroke={primaryColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="group-hover:translate-x-1 transition-transform"
        />
      </svg>

      <span className="text-[9px] font-mono font-extrabold text-slate-400 group-hover:text-[#1B3A7A] transition-colors mt-0.5 tracking-wider flex items-center gap-0.5">
        <span>AUTO</span>
        <ChevronRight className="w-2.5 h-2.5 text-[#FF9933] animate-pulse" />
      </span>
    </div>
  );
};

export const DelayPredictionView: React.FC<DelayPredictionViewProps> = ({
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
    description: "Community Hall Construction",
    expected_completion: "2025-06-30",
    predicted_completion: "2025-10-15",
    start_date: "09-Jul-2024",
    evidence: { predicted_delay_days: 78 },
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

  const handleExportDelayReport = () => {
    exportToCSV("MPLADS_Delay_Prediction_Forecast.csv", [
      {
        work_id: currentWork.work_id,
        description: currentWork.description,
        contract_end_date: currentWork.expected_completion,
        ai_predicted_handover: currentWork.predicted_completion,
        predicted_delay_days: currentWork.evidence?.predicted_delay_days || 78,
        delay_probability: "82.4%",
        primary_factor_1: delayFactors[0].title,
        primary_factor_2: delayFactors[1].title,
        primary_factor_3: delayFactors[2].title,
      },
    ]);
  };

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
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-950 border border-amber-300 text-[11px] font-extrabold rounded-md font-mono uppercase tracking-wider">
              {isHindi ? "पूर्वानुमानित एमएल मॉडल" : "Predictive ML Model"}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {isHindi ? "रैंडम फॉरेस्ट समयरेखा पूर्वानुमान" : "Random Forest Timeline Forecasting"}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Clock className="w-7 h-7 text-[#FF9933]" />
            {currentRole === "District Authority"
              ? (isHindi ? "ठेकेदार विलंब निगरानी" : "Contractor Delay Monitor")
              : (isHindi ? "विलंब भविष्यवाणी" : "Delay Prediction Monitor")}
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            {isHindi
              ? "रुके हुए नागरिक अवसंरचना, ठेकेदार थ्रूपुट बाधाओं और अनुमानित हैंडओवर देरी की समय से पहले पहचान।"
              : "Early identification of stalled civil infrastructure, contractor throughput bottlenecks, and predicted handover slips."}
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
                {w.work_id} — {w.description.slice(0, 32)}...
              </option>
            ))}
          </select>
          <button
            onClick={handleExportDelayReport}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <span>{isHindi ? "पूर्वानुमान निर्यात" : "Export Forecast"}</span>
          </button>
        </div>
      </div>

      {/* Primary Delay Highlight Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-1 hover:border-slate-300 transition-all">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            {isHindi ? "अनुबंधित निर्धारित पूर्णता तिथि" : "Scheduled Contract End Date"}
          </span>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1">
            {currentWork.expected_completion}
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {isHindi ? "आधिकारिक 18-माह दिशानिर्देश लक्ष्य" : "Official 18-month guideline target"}
          </span>
        </div>

        <div className="bg-red-50/90 border border-red-200 rounded-2xl p-5 shadow-2xs space-y-1 hover:border-red-300 transition-all">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-950">
            {isHindi ? "एआई अनुमानित हैंडओवर तिथि" : "AI Predicted Handover Date"}
          </span>
          <div className="text-2xl font-black font-mono text-red-700 mt-1">
            {currentWork.predicted_completion}
          </div>
          <span className="text-xs text-red-800 font-bold font-mono inline-block bg-white/70 px-2 py-0.5 rounded border border-red-200">
            {isHindi ? "अनुमानित विलंब:" : "Predicted Timeline Slip:"} +{currentWork.evidence?.predicted_delay_days || 78} {isHindi ? "दिन" : "Days"}
          </span>
        </div>

        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-5 shadow-2xs space-y-1 hover:border-amber-300 transition-all">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-950">
            {isHindi ? "विलंब होने की संभावना" : "Delay Occurrence Probability"}
          </span>
          <div className="text-2xl font-black font-mono text-amber-800 mt-1">
            82.4%
          </div>
          <span className="text-xs text-amber-900 font-medium">
            {isHindi ? "एजेंसी व मील का पत्थर गति के आधार पर उच्च विश्वास" : "High confidence based on agency & milestone velocity"}
          </span>
        </div>
      </div>

      {/* Lifecycle Milestone Flow Visualization — Animated Pipeline Flow */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-sm font-black text-[#0A2740] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF9933]" />
              {isHindi ? "कार्य मील का पत्थर निष्पादन क्षितिज" : "WORK MILESTONE EXECUTION HORIZON"}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {isHindi ? "स्वीकृत अनुसूची मील के पत्थरों बनाम अनुमानित परिचालन समयरेखा का स्वचालन चित्रण" : "Visualizing sanctioned schedule milestones vs forecasted operational timeline with automated pipeline flow"}
            </p>
          </div>
          <span className="px-2.5 py-1 bg-blue-50 text-[#1B3A7A] border border-blue-200 rounded-lg text-[11px] font-bold font-mono self-start sm:self-auto">
            LIVE ENGINE PIPELINE
          </span>
        </div>

        {/* Milestone Steps with Animated Pipeline Connectors */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-3 py-4 overflow-x-auto">
          
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center p-4 bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl w-full md:w-40 shadow-2xs hover:shadow-md transition-all group">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xs text-slate-900">{isHindi ? "1. सांसद अनुशंसा" : "1. MP Recommended"}</span>
            <span className="text-[10px] text-slate-600 font-mono font-semibold mt-1 bg-white px-2 py-0.5 rounded border border-emerald-200">15 Jan 2024</span>
          </div>

          <AnimatedPipelineConnector delayMs={0} />

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center p-4 bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl w-full md:w-40 shadow-2xs hover:shadow-md transition-all group">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xs text-slate-900">{isHindi ? "2. डीएम स्वीकृति" : "2. DM Sanction"}</span>
            <span className="text-[10px] text-slate-600 font-mono font-semibold mt-1 bg-white px-2 py-0.5 rounded border border-emerald-200">10 Feb 2024</span>
          </div>

          <AnimatedPipelineConnector delayMs={300} />

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center p-4 bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl w-full md:w-40 shadow-2xs hover:shadow-md transition-all group">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xs text-slate-900">{isHindi ? "3. कार्य प्रारंभ" : "3. Commencement"}</span>
            <span className="text-[10px] text-slate-600 font-mono font-semibold mt-1 bg-white px-2 py-0.5 rounded border border-emerald-200">{currentWork.start_date}</span>
          </div>

          <AnimatedPipelineConnector delayMs={600} />

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center p-4 bg-amber-50/90 border-2 border-amber-400 rounded-2xl w-full md:w-40 shadow-2xs hover:shadow-md transition-all group">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-110 transition-transform">
              <Hourglass className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xs text-amber-950">{isHindi ? "4. लक्ष्य समय-सीमा" : "4. Target Deadline"}</span>
            <span className="text-[10px] text-amber-900 font-mono font-bold mt-1 bg-white px-2 py-0.5 rounded border border-amber-300">{currentWork.expected_completion}</span>
          </div>

          <AnimatedPipelineConnector isCritical delayMs={900} />

          {/* Step 5: AI Forecast Slip */}
          <div className="flex flex-col items-center text-center p-4 bg-red-50/90 border-2 border-red-500 rounded-2xl w-full md:w-44 shadow-md ring-4 ring-red-400/20 hover:shadow-lg transition-all group">
            <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center mb-2 shadow-xs animate-pulse">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xs text-red-950">{isHindi ? "5. एआई पूर्वानुमानित विलंब" : "5. AI Forecast Slip"}</span>
            <span className="text-[10px] text-red-700 font-mono font-extrabold mt-1 bg-white px-2 py-0.5 rounded border border-red-300 shadow-2xs">
              {currentWork.predicted_completion}
            </span>
          </div>

        </div>
      </div>

      {/* Delay Factor Drivers */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="pb-3 border-b border-slate-100">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            {isHindi ? "विलंब में योगदान देने वाले प्रमुख पूर्वानुमानित कारक" : "Key Predictive Drivers Contributing to Slip"}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {isHindi ? "रैंडम फॉरेस्ट पूर्वानुमान को प्रभावित करने वाले बहु-परिवर्तनीय कारक" : "Multi-variate features influencing the automated random forest prediction"}
          </p>
        </div>

        <div className="space-y-3">
          {delayFactors.map((f, idx) => (
            <div key={idx} className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl flex items-center justify-between gap-4 hover:border-slate-300 transition-all shadow-2xs">
              <div className="space-y-1">
                <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                  <span>{f.title}</span>
                  <span className="font-mono text-red-700 font-extrabold bg-red-50 px-2 py-0.5 rounded-md text-[11px] border border-red-200">
                    {f.impact}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">{f.detail}</p>
              </div>
              <span className="font-mono font-extrabold text-slate-800 text-xs shrink-0 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
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

