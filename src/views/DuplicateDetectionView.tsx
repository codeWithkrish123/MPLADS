import React, { useState } from "react";
import {
  Copy,
  AlertTriangle,
  MapPin,
  FileText,
  Building2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Download,
  IndianRupee,
  Layers,
} from "lucide-react";
import { WorkRecord, Language } from "../types";
import { formatINR } from "../lib/utils";
import { getTranslation } from "../data/translations";

interface DuplicateDetectionViewProps {
  works: WorkRecord[];
  onSelectWork: (work: WorkRecord) => void;
  language?: Language;
}

export const DuplicateDetectionView: React.FC<DuplicateDetectionViewProps> = ({
  works,
  onSelectWork,
  language = "en",
}) => {
  const currentLang: Language = (language || "en") as Language;
  const isHindi = currentLang === "hi";
  const t = getTranslation(currentLang);
  const [resolutionStatus, setResolutionStatus] = useState<string | null>(null);

  // Focus Pair from mock data (Work 1 and its duplicate match)
  const workA = works[0]; // UP-GZB-2024-001 (Construction of Community Hall at Ward 12, Loni)
  const workB = works[1]; // UP-GZB-2023-089 (Erection of Community Centre at Ward 12, Loni)

  const similarityMetrics = [
    {
      label: isHindi ? "शब्दार्थ पाठ विवरण मिलान" : "Semantic Text Description Match",
      score: 96,
      detail: isHindi
        ? "'सामुदायिक भवन' और 'सामुदायिक केंद्र' के बीच उच्च एनएलपी एम्बेडिंग समानता"
        : "High NLP embedding cosine similarity between 'Community Hall' & 'Community Centre'"
    },
    {
      label: isHindi ? "भू-स्थानिक सह-स्थान निकटता" : "Geospatial Co-Location Proximity",
      score: 100,
      detail: isHindi
        ? "वार्ड 12, लोनी, गाजियाबाद में 32 मीटर के भीतर निर्देशांक"
        : "Coordinates within 32 meters in Ward 12, Loni, Ghaziabad"
    },
    {
      label: isHindi ? "स्वीकृत लागत अंतर मिलान" : "Sanction Cost Variance Match",
      score: 98,
      detail: isHindi
        ? "₹61.2 लाख बनाम ₹58.5 लाख (4.4% भिन्नता विंडो के भीतर)"
        : "₹61.2 Lakh vs ₹58.5 Lakh within 4.4% variance window"
    },
    {
      label: isHindi ? "श्रेणी एवं उद्देश्य संरेखण" : "Category & Objective Alignment",
      score: 100,
      detail: isHindi
        ? "दोनों 'सामुदायिक अवसंरचना / सार्वजनिक सुविधाएं' के तहत वर्गीकृत"
        : "Both classified under 'Community Infrastructure / Public Amenities'"
    },
  ];

  return (
    <div id="duplicate-detection-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[11px] font-bold rounded font-mono uppercase">
              {isHindi ? "एनएलपी व भू-स्थानिक एआई" : "NLP & Geospatial AI"}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {isHindi ? "समानता सूचकांक इंजन" : "Similarity Index Engine"}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Copy className="w-6 h-6 text-amber-600" />
            {isHindi ? "संभावित दोहरे कार्य (Duplicate Work) विश्लेषक" : "Near-Duplicate Work Intelligence"}
          </h1>
          <p className="text-xs text-slate-600">
            {isHindi
              ? "मल्टी-मॉडल क्रॉस-रेफरेंसिंग संभावित दोहरी स्वीकृति और ओवरलैपिंग नगरपालिका अवसंरचना आवंटन का पता लगाता है।"
              : "Multi-modal cross-referencing detects potential double-sanctions and overlapping municipal infrastructure allocations."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-50 border border-amber-300 text-amber-900 rounded-lg text-xs font-bold font-mono">
            {isHindi ? "स्थिति: मानवीय समीक्षा आवश्यक" : "Status: Requires Human Review"}
          </span>
        </div>
      </div>

      {/* Primary Alert Banner */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 space-y-1">
          <div className="font-bold text-sm">
            {isHindi
              ? "उच्च-विश्वास अर्थगत व भू-स्थानिक क्लस्टर (94% समग्र समानता)"
              : "High-Confidence Semantic & Geospatial Cluster (94% Composite Similarity)"}
          </div>
          <p className="leading-relaxed">
            {isHindi ? (
              <>
                कार्य <strong>{workA.work_id}</strong> (वित्त वर्ष 2024-25 में स्वीकृत) पूर्व स्वीकृत कार्य <strong>{workB.work_id}</strong> (वित्त वर्ष 2023-24) के साथ लगभग समान स्थान निर्देशांक, कार्यक्षेत्र और लागत मानकों को साझा करता है। सत्यापित करें कि क्या यह अदर्शाए गए दोहरे आवंटन का प्रतिनिधित्व करता है या कोई अलग चरण है।
              </>
            ) : (
              <>
                Work <strong>{workA.work_id}</strong> (Sanctioned in FY 2024-25) shares near-identical location coordinates, scope, and cost parameters with prior sanctioned Work <strong>{workB.work_id}</strong> (FY 2023-24). Verify whether this represents an unrecorded duplicate sanction or a distinct phase.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Similarity Breakdown Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {similarityMetrics.map((met, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {met.label}
              </span>
              <span className="font-mono text-sm font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {met.score}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${met.score}%` }} />
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">{met.detail}</p>
          </div>
        ))}
      </div>

      {/* Side-by-Side Comparison Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Work A (Current Sanction) */}
        <div className="bg-white border-2 border-amber-300 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold font-mono rounded">
                {isHindi ? "वर्तमान स्वीकृत कार्य" : "CURRENT WORK (SANCTIONED)"}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1 font-mono">
                {workA.work_id}
              </h3>
            </div>
            <button
              onClick={() => onSelectWork(workA)}
              className="text-xs text-blue-700 hover:text-blue-800 font-semibold underline cursor-pointer"
            >
              {isHindi ? "पूर्ण विवरण" : "Full Profile"}
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">{isHindi ? "शीर्षक / कार्यक्षेत्र" : "Title / Scope"}</span>
              <p className="font-semibold text-slate-900 bg-amber-50/50 p-2 rounded border border-amber-100 mt-0.5">
                {workA.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">{isHindi ? "स्वीकृत लागत" : "Sanctioned Cost"}</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{formatINR(workA.sanctioned_cost)}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">{isHindi ? "वित्तीय वर्ष" : "Financial Year"}</span>
                <span className="font-mono font-semibold text-slate-700">2024-25</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">{isHindi ? "कार्यान्वयन एजेंसी" : "Implementing Agency"}</span>
                <span className="text-slate-800 font-medium">{workA.agency}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">{isHindi ? "क्षेत्रीय अधिकार" : "Jurisdiction"}</span>
                <span className="text-slate-800 font-medium">{workA.district}, {workA.state}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">{isHindi ? "भू-स्थानिक निर्देशांक (अक्षांश/देशांतर)" : "Geospatial Lat/Long"}</span>
              <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                {workA.latitude?.toFixed(4)}, {workA.longitude?.toFixed(4)} ({isHindi ? "वार्ड 12" : "Ward 12"})
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">{isHindi ? "भौतिक प्रगति" : "Physical Progress"}</span>
              <span className="font-mono font-bold text-emerald-600">{workA.physical_progress}% {isHindi ? "प्रमाणित" : "Certified"}</span>
            </div>
          </div>
        </div>

        {/* Work B (Candidate Duplicate Match) */}
        <div className="bg-white border-2 border-slate-300 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold font-mono rounded">
                {isHindi ? "संभावित मेल खाने वाला रिकॉर्ड" : "MATCHING CANDIDATE RECORD"}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1 font-mono">
                {workB.work_id}
              </h3>
            </div>
            <button
              onClick={() => onSelectWork(workB)}
              className="text-xs text-blue-700 hover:text-blue-800 font-semibold underline cursor-pointer"
            >
              {isHindi ? "पूर्ण विवरण" : "Full Profile"}
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">{isHindi ? "शीर्षक / कार्यक्षेत्र" : "Title / Scope"}</span>
              <p className="font-semibold text-slate-900 bg-slate-50 p-2 rounded border border-slate-200 mt-0.5">
                {workB.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">{isHindi ? "स्वीकृत लागत" : "Sanctioned Cost"}</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{formatINR(workB.sanctioned_cost)}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">{isHindi ? "वित्तीय वर्ष" : "Financial Year"}</span>
                <span className="font-mono font-semibold text-slate-700">2023-24</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">{isHindi ? "कार्यान्वयन एजेंसी" : "Implementing Agency"}</span>
                <span className="text-slate-800 font-medium">{workB.agency}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">{isHindi ? "क्षेत्रीय अधिकार" : "Jurisdiction"}</span>
                <span className="text-slate-800 font-medium">{workB.district}, {workB.state}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">{isHindi ? "भू-स्थानिक निर्देशांक (अक्षांश/देशांतर)" : "Geospatial Lat/Long"}</span>
              <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                {workB.latitude?.toFixed(4)}, {workB.longitude?.toFixed(4)} ({isHindi ? "वार्ड 12" : "Ward 12"})
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">{isHindi ? "भौतिक प्रगति" : "Physical Progress"}</span>
              <span className="font-mono font-bold text-emerald-600">{workB.physical_progress}% {isHindi ? "पूर्ण" : "Completed"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Support Review Action Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            {isHindi ? "प्रशासनिक समाधान कार्यप्रवाह" : "Administrative Resolution Workflow"}
          </h4>
          <p className="text-xs text-slate-500">
            {isHindi ? "अपरिवर्तनीय सांविधिक ऑडिट ट्रेल में दर्ज करने हेतु निर्धारण कार्रवाई चुनें।" : "Select a determination action to log in the immutable statutory audit trail."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {resolutionStatus ? (
            <div className="px-4 py-2 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isHindi ? "निर्णय दर्ज किया गया:" : "Determination Logged:"} {resolutionStatus}</span>
            </div>
          ) : (
            <>
              <button
                onClick={() => setResolutionStatus(isHindi ? "भुगतान रोकें एवं संयुक्त स्थल निरीक्षण ज्ञापन जारी करें" : "Hold Disbursement & Issue Joint Site Inspection Memo")}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{isHindi ? "भुगतान रोकें व मेमो जारी करें" : "Hold Disbursement & Memo"}</span>
              </button>

              <button
                onClick={() => setResolutionStatus(isHindi ? "पृथक कार्य / वैध बहु-स्तरीय चरण के रूप में चिह्नित" : "Marked Distinct / Legitimate Multi-Phase Work")}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                <span>{isHindi ? "पृथक / चरण 2 के रूप में चिह्नित करें" : "Mark Distinct / Phase 2"}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
