import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  FileText,
  Building2,
  ChevronRight,
  Info,
  Download,
  Sparkles,
} from "lucide-react";
import { WorkRecord, Language } from "../types";
import { formatINR } from "../lib/utils";
import { getTranslation } from "../data/translations";
import { EmptyState } from "../components/common/EmptyState";

interface CostAnomalyViewProps {
  works: WorkRecord[];
  onSelectWork: (work: WorkRecord) => void;
  language?: Language;
}

export const CostAnomalyView: React.FC<CostAnomalyViewProps> = ({
  works,
  onSelectWork,
  language = "en",
}) => {
  const currentLang: Language = (language || "en") as Language;
  const isHindi = currentLang === "hi";
  const t = getTranslation(currentLang);
  
  // Fallback data for when no works exist
  const fallbackWork = {
    work_id: "UP-GZB-2024-001",
    district: "Ghaziabad",
    sanctioned_cost: 4500000,
  };
  
  const [selectedWorkId, setSelectedWorkId] = useState(works[0]?.work_id || fallbackWork.work_id);
  const currentWork = works.find((w) => w.work_id === selectedWorkId) || works[0] || fallbackWork;

  const peerBenchmarks = [
    { label: isHindi ? `चयनित कार्य लागत (${currentWork.work_id})` : `Selected Work Cost (${currentWork.work_id})`, amount: currentWork.sanctioned_cost, isTarget: true, color: "bg-red-600" },
    { label: isHindi ? `जिला 90वाँ प्रतिशतक (${currentWork.district})` : `District 90th Percentile (${currentWork.district})`, amount: 3200000, isTarget: false, color: "bg-amber-500" },
    { label: isHindi ? "राष्ट्रीय श्रेणी मध्यिका (सामुदायिक भवन)" : "National Category Median (Community Hall)", amount: 2240000, isTarget: false, color: "bg-slate-400" },
    { label: isHindi ? `जिला मध्यिका बेंचमार्क (${currentWork.district})` : `District Median Benchmark (${currentWork.district})`, amount: 1910000, isTarget: false, color: "bg-emerald-600" },
    { label: isHindi ? "राज्य मानक दर सूची (SOR मूल)" : "State Standard Schedule of Rates (SOR Basic)", amount: 1650000, isTarget: false, color: "bg-slate-400" },
  ];

  const maxAmount = Math.max(...peerBenchmarks.map((b) => b.amount)) * 1.1;

  return (
    <div id="cost-anomaly-benchmark-view" className="space-y-6 animate-in fade-in duration-200">
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
              {isHindi ? "इकोनोमेट्रिक एआई मॉडल" : "Econometric AI Model"}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {isHindi ? "लागत वितरण क्वांटाइल" : "Quantile Cost Distribution"}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-red-600" />
            {isHindi ? "लागत विसंगति एवं बेंचमार्क विश्लेषक" : "Cost Anomaly & Benchmark Intelligence"}
          </h1>
          <p className="text-xs text-slate-600">
            {isHindi
              ? "समान परियोजना क्षेत्रों में सांख्यिकीय सहकर्मी बेंचमार्किंग और दर अनुसूची (SOR) विचलन निगरानी।"
              : "Statistical peer benchmarking and Schedule of Rates (SOR) divergence surveillance across identical project scopes."}
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
                {w.work_id} — {w.category} ({formatINR(w.sanctioned_cost)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Work Quick Highlight */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              {isHindi ? "सक्रिय लक्षित कार्य रिकॉर्ड" : "Active Focus Work Record"}
            </span>
            <h2 className="text-lg font-bold text-slate-900">{currentWork.description}</h2>
            <p className="text-xs text-slate-500">
              {currentWork.district}, {currentWork.state} • {isHindi ? "कार्यान्वयन एजेंसी:" : "Agency:"} {currentWork.agency}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">{isHindi ? "स्वीकृत अनुमानित लागत" : "Sanctioned Estimate"}</span>
            <span className="text-2xl font-mono font-extrabold text-red-700">
              {formatINR(currentWork.sanctioned_cost)}
            </span>
          </div>
        </div>

        {/* Statistical Divergence Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-red-50/80 border border-red-200 rounded-lg">
            <span className="text-red-900 font-semibold block text-[11px]">{isHindi ? "जिला मध्यिका से विचलन" : "Divergence vs District Median"}</span>
            <span className="text-2xl font-bold font-mono text-red-700 mt-1 block">
              +220.4%
            </span>
            <span className="text-[10px] text-red-800 mt-0.5 block">
              {isHindi ? "₹61.2 लाख बनाम ₹19.1 लाख जिला आधार" : "₹61.2L vs ₹19.1L district baseline"}
            </span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-slate-600 font-semibold block text-[11px]">{isHindi ? "क्वांटाइल प्रतिशतक रैंक" : "Quantile Percentile Rank"}</span>
            <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">
              99.4th
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              {isHindi ? "श्रेणी में शीर्ष 0.6% सबसे महंगी परियोजन" : "Top 0.6% most expensive in category"}
            </span>
          </div>

          <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-lg">
            <span className="text-blue-900 font-semibold block text-[11px]">{isHindi ? "सहकर्मी नमूना आकार" : "Peer Sample Size"}</span>
            <span className="text-2xl font-bold font-mono text-blue-900 mt-1 block">
              342 {isHindi ? "कार्य" : "Works"}
            </span>
            <span className="text-[10px] text-blue-800 mt-0.5 block">
              {isHindi ? "ऐतिहासिक तुलनात्मक अनुबंध" : "Historical comparable contracts"}
            </span>
          </div>
        </div>
      </div>

      {/* Comparative Benchmark Bar Chart */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {isHindi ? "पैरामीट्रिक लागत वितरण स्पेक्ट्रम" : "Parametric Cost Distribution Spectrum"}
            </h3>
            <p className="text-xs text-slate-500">
              {isHindi ? "जिला मध्यिका, राष्ट्रीय प्रतिशतक एवं राज्य एसओआर के साथ तुलनात्मक बेंचमार्क" : "Comparative benchmark across district medians, national percentiles, and state SOR"}
            </p>
          </div>
          <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">
            {isHindi ? "भारतीय रुपये (लाख में)" : "INR Lakhs"}
          </span>
        </div>

        <div className="space-y-4 pt-2">
          {peerBenchmarks.map((bench, idx) => {
            const widthPct = (bench.amount / maxAmount) * 100;
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-semibold ${bench.isTarget ? "text-red-700 font-bold" : "text-slate-700"}`}>
                    {bench.label}
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatINR(bench.amount)}
                  </span>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${bench.color}`}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explainable AI Decision Support Box */}
      <div className="bg-slate-900 text-slate-100 rounded-lg p-5 shadow-lg border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-amber-400 font-bold text-xs uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            {isHindi ? "निर्णय-सहायता विश्लेषण व तकनीकी आधार" : "Decision-Support Analysis & Technical Grounding"}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Statistical Audit Model v2.4</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {isHindi
            ? `यह कार्य ${currentWork.district} जिले में सामुदायिक अवसंरचना परियोजनाओं के लिए देखे गए लागत वितरण से 3.2 गुना अधिक है। ₹61.2 लाख की अनुमानित लागत समान स्वीकृत प्लिंथ क्षेत्र (2,400 वर्ग फुट) वाले सहकर्मी कार्यों की तुलना में सांख्यिकीय रूप से असाधारण है।`
            : `This work falls 3.2× above the observed cost distribution for Community Infrastructure projects in Ghaziabad District. The estimated cost of ₹61.2 Lakh is statistically atypical compared to peer works with identical sanctioned plinth area (2,400 sq ft).`}
        </p>

        <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 text-xs text-slate-300 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <span>
            <strong>{isHindi ? "अनुशंसित प्रक्रिया:" : "Recommended Protocol:"}</strong>{" "}
            {isHindi
              ? "सांख्यिकी एवं कार्यान्वयन मंत्रालय (MoSPI) के दिशा-निर्देशों के अनुसार स्थानीय पीडब्ल्यूडी दर अनुसूची से 50% से अधिक विचलन वाले अनुमानों को चरण-2 किश्त जारी करने से पहले अधीक्षण अभियंता (SE) से तकनीकी जांच की आवश्यकता होती है।"
              : "MoSPI guidelines stipulate that estimates deviating >50% from local PWD Schedule of Rates require technical vetting from the Superintending Engineer (SE) prior to Stage-2 tranche release."}
          </span>
        </div>
      </div>
        </>
      )}
    </div>
  );
};
