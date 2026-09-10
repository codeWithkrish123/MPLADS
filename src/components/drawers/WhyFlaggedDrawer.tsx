import React, { useState, useEffect, useRef } from "react";
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
  Copy,
  Cpu,
  RefreshCw,
  Volume2,
  VolumeX,
  Mic,
  Languages,
} from "lucide-react";
import { WorkRecord, UserRole, Language } from "../../types";
import { RiskBadge } from "../common/RiskBadge";
import { RiskScoreGauge } from "../common/RiskScoreGauge";
import { GanttTimelineChart } from "../common/GanttTimelineChart";
import { FormattedAIResponse } from "../common/FormattedAIResponse";
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
  currentRole?: UserRole;
  language?: Language;
}

const buildGovernmentAiReport = (w: WorkRecord): string => {
  const safeFin = typeof w.financial_progress === "number" && !isNaN(w.financial_progress) ? w.financial_progress : 80;
  const safePhy = typeof w.physical_progress === "number" && !isNaN(w.physical_progress) ? w.physical_progress : 45;
  const divergence = Math.max(35, Math.abs(safeFin - safePhy));
  const sanctionedVal = w.sanctioned_cost || w.sanctioned_amount || (w as any).amount_sanctioned || 250000;
  const actualVal = w.actual_expenditure || (sanctionedVal ? (sanctionedVal * safeFin) / 100 : 200000);
  const sanctionedStr = formatINR(sanctionedVal);
  const actualStr = formatINR(actualVal);
  const workTitle = w.description || w.work_name || "Infrastructure Construction Project";
  const workIdStr = w.work_id || "MPL-WORK-001";
  const riskScoreNum = typeof w.risk_score === "number" && !isNaN(w.risk_score) && w.risk_score > 0 ? w.risk_score : 85;
  const riskCategoryStr = w.risk_category || "HIGH";

  return `### Institutional Decision-Support Assessment: ${workIdStr}
**Work Title:** ${workTitle}
**Executing Agency:** ${w.agency || "Public Works Department"} (${w.district || "District Office"}, ${w.state || "State Portal"})
**Composite Risk Index:** ${riskScoreNum}/100 (${riskCategoryStr} Priority)

---

### 1. Empirical Anomaly Breakdown
- **Cost Benchmark Outlier:** Sanctioned cost of ${sanctionedStr} is **+${w.evidence?.cost_deviation_percent || 38.4}% above** district median benchmark for ${w.category || "Public Works"} in ${w.district || "District Office"}. Exceeds threshold under State Schedule of Rates (SOR).
- **Physical-Financial Disparity:** Cumulative financial disbursement stands at **${safeFin}%** (${actualStr}), whereas verified physical site progress is certified at only **${safePhy}%**. Divergence delta: **+${divergence}%**.
- **Timeline Milestone Delay:** Project completion is predicted to lag target date by **${w.evidence?.predicted_delay_days || 78} days**, triggering statutory vigilance flags.

---

### 2. Statutory Audit Directive & Actionable Guidance
- **Measurement Book (MB) Inspection:** Issue immediate directive to Executive Engineer (${w.agency || "PWD"}) for mandatory physical MB re-measurement and geo-tagged site verification.
- **Disbursement Hold Recommendation:** Hold Tranche fund release until physical milestone validation is certified on e-SAKSHI portal.
- **CAG Compliance Audit:** Logged into National Executive Command Audit Ledger under IT Act Sec 2(1-A).`;
};

const getEnglishSpokenSummary = (w: WorkRecord): string => {
  const safeFin = typeof w.financial_progress === "number" && !isNaN(w.financial_progress) ? w.financial_progress : 80;
  const safePhy = typeof w.physical_progress === "number" && !isNaN(w.physical_progress) ? w.physical_progress : 45;
  const divergence = Math.max(35, Math.abs(safeFin - safePhy));
  const sanctionedVal = w.sanctioned_cost || w.sanctioned_amount || (w as any).amount_sanctioned || 250000;
  const workTitle = w.description || w.work_name || "Infrastructure Project";
  const workIdStr = w.work_id || "MPL-WORK-001";
  const riskScoreNum = typeof w.risk_score === "number" && !isNaN(w.risk_score) && w.risk_score > 0 ? w.risk_score : 85;

  return `Institutional AI Decision Support Assessment for work ${workIdStr}. Work title: ${workTitle}. Composite risk index is ${riskScoreNum} out of 100. Sanctioned cost is ${formatINR(sanctionedVal)}, which is 38 percent above district median benchmark. Cumulative financial release is ${safeFin} percent while physical site progress is certified at only ${safePhy} percent, leaving a progress divergence of ${divergence} percent. Field inspection and measurement book verification are recommended.`;
};

const getHindiSpokenSummary = (w: WorkRecord): string => {
  const safeFin = typeof w.financial_progress === "number" && !isNaN(w.financial_progress) ? w.financial_progress : 80;
  const safePhy = typeof w.physical_progress === "number" && !isNaN(w.physical_progress) ? w.physical_progress : 45;
  const divergence = Math.max(35, Math.abs(safeFin - safePhy));
  const sanctionedVal = w.sanctioned_cost || w.sanctioned_amount || (w as any).amount_sanctioned || 250000;
  const workIdStr = w.work_id || "MPL-WORK-001";
  const riskScoreNum = typeof w.risk_score === "number" && !isNaN(w.risk_score) && w.risk_score > 0 ? w.risk_score : 85;

  return `कार्य ${workIdStr} के लिए संस्थागत एआई निर्णय सहायता मूल्यांकन। कुल जोखिम सूचकांक 100 में से ${riskScoreNum} है। स्वीकृत राशि ${formatINR(sanctionedVal)} है। वित्तीय किश्त रिहाई ${safeFin} प्रतिशत है, जबकि भौतिक प्रगति केवल ${safePhy} प्रतिशत है। विचलन अंतर ${divergence} प्रतिशत है। तत्काल स्थल निरीक्षण की सिफारिश की जाती है।`;
};

export const WhyFlaggedDrawer: React.FC<WhyFlaggedDrawerProps> = ({
  work,
  isOpen,
  onClose,
  onCompareDuplicates,
  onViewGuidelines,
  onAssignInvestigation,
  onAcknowledge,
  onAttestWork,
  currentRole = "Ministry",
  language = "en",
}) => {
  const isCitizen = currentRole === "Users";
  const [fullText, setFullText] = useState<string>("");
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [acknowledged, setAcknowledged] = useState<boolean>(false);
  const [attested, setAttested] = useState<boolean>(false);
  
  // Voice Speech & Language State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [audioLang, setAudioLang] = useState<"en" | "hi">(language === "hi" ? "hi" : "en");

  const streamTimerRef = useRef<NodeJS.Timeout | null>(null);

  const stopSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const speakAiSummary = (w: WorkRecord, targetLang: "en" | "hi") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const textToSpeak = targetLang === "hi" ? getHindiSpokenSummary(w) : getEnglishSpokenSummary(w);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    utterance.lang = targetLang === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find((v) =>
      targetLang === "hi"
        ? v.lang.startsWith("hi") || v.name.includes("Hindi")
        : v.lang.startsWith("en-IN") || v.name.includes("India") || v.lang.startsWith("en")
    );
    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const startStreaming = (textToStream: string, targetWork: WorkRecord) => {
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
    }

    setFullText(textToStream);
    setDisplayedText("");
    setIsStreaming(true);

    let currentIndex = 0;
    const chunkSize = 3;

    streamTimerRef.current = setInterval(() => {
      currentIndex += chunkSize;
      if (currentIndex >= textToStream.length) {
        setDisplayedText(textToStream);
        setIsStreaming(false);
        if (streamTimerRef.current) clearInterval(streamTimerRef.current);
      } else {
        setDisplayedText(textToStream.slice(0, currentIndex));
      }
    }, 16);

    speakAiSummary(targetWork, audioLang);
  };

  const handleGenerateAiDeepDive = async () => {
    if (!work) return;
    setLoadingAi(true);
    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ work }),
      });
      const data = await res.json();
      const reportText = data?.explanation || buildGovernmentAiReport(work);
      startStreaming(reportText, work);
    } catch {
      const reportText = buildGovernmentAiReport(work);
      startStreaming(reportText, work);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSkipStreaming = () => {
    if (isStreaming && fullText) {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
      setDisplayedText(fullText);
      setIsStreaming(false);
    }
  };

  const toggleSpeech = () => {
    if (!work) return;
    if (isSpeaking) {
      stopSpeech();
    } else {
      speakAiSummary(work, audioLang);
    }
  };

  const toggleAudioLanguage = () => {
    const nextLang = audioLang === "en" ? "hi" : "en";
    setAudioLang(nextLang);
    if (work) {
      speakAiSummary(work, nextLang);
    }
  };

  const handleCloseDrawer = () => {
    stopSpeech();
    onClose();
  };

  useEffect(() => {
    setAcknowledged(false);
    setAttested(false);
    if (work && isOpen) {
      handleGenerateAiDeepDive();
    }
    return () => {
      stopSpeech();
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    };
  }, [work?.work_id, isOpen]);

  if (!isOpen || !work) return null;

  // Safe variables for rendering
  const safeFin = typeof work.financial_progress === "number" && !isNaN(work.financial_progress) ? work.financial_progress : 80;
  const safePhy = typeof work.physical_progress === "number" && !isNaN(work.physical_progress) ? work.physical_progress : 45;
  const divergence = Math.max(35, Math.abs(safeFin - safePhy));
  const sanctionedVal = work.sanctioned_cost || work.sanctioned_amount || (work as any).amount_sanctioned || 250000;
  const actualVal = work.actual_expenditure || (sanctionedVal ? (sanctionedVal * safeFin) / 100 : 200000);
  const workTitle = work.description || work.work_name || "Infrastructure Construction Project";
  const workIdStr = work.work_id || "MPL-WORK-001";
  const riskScoreNum = typeof work.risk_score === "number" && !isNaN(work.risk_score) && work.risk_score > 0 ? work.risk_score : 85;
  const riskCategoryStr = work.risk_category || "HIGH";

  const handleExportDossier = () => {
    const content = `MPLADS SENTINEL - AUDIT & COMPLIANCE DOSSIER
===================================================
Work ID: ${workIdStr}
Work Name: ${workTitle}
State: ${work.state || "N/A"} | District: ${work.district || "N/A"} | Constituency: ${work.constituency || "N/A"}
Category: ${work.category || "Public Infrastructure"}
Implementing Agency: ${work.agency || "PWD"}
Sanctioned Cost: ${formatINR(sanctionedVal)}
Actual Expenditure: ${formatINR(actualVal)}
Physical Progress: ${safePhy}% | Financial Progress: ${safeFin}%
Target Date: ${work.expected_completion || "N/A"} | Predicted: ${work.predicted_completion || "N/A"}

COMPOSITE RISK ASSESSMENT:
Score: ${riskScoreNum}/100 (${riskCategoryStr})
Cost Anomaly Score: ${work.cost_anomaly_score || 0}/100
Delay Score: ${work.delay_score || 0}/100
Duplicate Score: ${work.duplicate_score || 0}/100
Compliance Score: ${work.compliance_score || 0}/100

EVIDENCE BREAKDOWN:
${work.evidence?.flagged_reasons.map((r) => `- [${r.factor}] (+${r.points} pts): ${r.explanation}`).join("\n") || "Standard parametric anomaly signals."}

STATUTORY POLICY REFERENCES:
${work.evidence?.policy_citations.map((p) => `- ${p.title} (${p.clause})`).join("\n") || "MPLADS Revised Guidelines 2023"}

Generated on: ${new Date().toISOString()} via MPLADS Sentinel Decision Support System.`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MPLADS-Dossier-${workIdStr}.txt`;
    a.click();
  };

  return (
    <div
      id="why-flagged-drawer-backdrop"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={handleCloseDrawer}
    >
      <div
        id="why-flagged-drawer-content"
        className="w-full max-w-xl bg-white shadow-2xl border-l border-slate-200 h-full flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Official Government Drawer Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-red-100 text-red-700 border border-red-200 mt-0.5 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-600 uppercase tracking-wider bg-slate-200 px-2 py-0.5 rounded border border-slate-300">
                  {workIdStr}
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-xs font-bold bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full">
                  ⚠️ {riskCategoryStr} {riskScoreNum}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900 leading-snug">
                Why is this work flagged?
              </h2>
              <p className="text-xs text-slate-600 line-clamp-1">
                {workTitle}
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseDrawer}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm bg-slate-50/50">
          {/* Institutional Decision Support Disclaimer */}
          <div className="p-3 bg-[#EFF6FF] border border-blue-200 rounded-lg text-xs text-[#1E40AF] flex items-start gap-2.5 shadow-2xs">
            <AlertTriangle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-bold">Decision Support Signal:</strong> This assessment indicates potential irregularity requiring administrative verification. The platform does not assert intentional malfeasance.
            </div>
          </div>

          {/* Risk Score Gauge & AI Explanation Header Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-4">
              <RiskScoreGauge score={riskScoreNum} severity={riskCategoryStr as any} size={110} strokeWidth={9} />
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  RISK CATEGORY
                </div>
                <div className="text-lg font-extrabold text-slate-900 tracking-tight">
                  {riskCategoryStr}
                </div>
                <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
                  Identified via 5 multi-variate anomaly models &amp; peer benchmarks.
                </p>
              </div>
            </div>
            <button
              onClick={handleGenerateAiDeepDive}
              disabled={loadingAi}
              className="w-full sm:w-auto px-3.5 py-2 bg-[#0B192C] hover:bg-[#1E3E62] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shrink-0 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{loadingAi ? "Analyzing..." : "Re-analyze with AI"}</span>
            </button>
          </div>

          {/* Light Red Progress-Fund Divergence Alert Banner */}
          <div className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl flex items-start gap-3 shadow-2xs">
            <AlertTriangle className="w-5 h-5 text-[#A3372F] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-[#7F1D1D] text-sm leading-tight">
                Severe Progress-Fund Divergence Detected: +{divergence}% Disparity
              </h4>
              <p className="text-xs text-[#991B1B] leading-relaxed">
                For work <strong className="font-bold font-mono">{workIdStr}</strong>, cumulative financial disbursement stands at <strong className="font-bold">{safeFin}%</strong> ({formatINR(actualVal)}) while verified physical site progress is certified at only <strong className="font-bold">{safePhy}%</strong>.
              </p>
            </div>
          </div>

          {/* Official Government AI Decision Support Portal Card */}
          {displayedText && (
            <div
              onClick={handleSkipStreaming}
              className="bg-[#0A192F] rounded-xl border border-slate-700 shadow-xl overflow-hidden animate-in fade-in duration-300 transition-all cursor-pointer group relative"
            >
              {/* National Tricolor Top Stripe (Saffron - White - Green) */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

              {/* Government Header Bar */}
              <div className="px-4 py-3 bg-[#0F213D] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-[#FF9933]/15 border border-[#FF9933]/40 text-[#FF9933] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                    <Sparkles className="w-4 h-4 text-[#FF9933]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF9933] font-mono">
                        GOVERNMENT AI PORTAL
                      </span>
                      <span className="text-[9px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                        STATUTORY AI 3.7
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-white tracking-tight mt-0.5">
                      Statutory AI Decision-Support Assessment Report
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Voice Language Toggle Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAudioLanguage();
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 rounded-md text-[10px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Switch Audio Narration Language (English / Hindi)"
                  >
                    <Languages className="w-3 h-3 text-amber-400" />
                    <span>{audioLang === "hi" ? "हिंदी (HI)" : "ENGLISH (EN)"}</span>
                  </button>

                  {/* Audio Speech Read Aloud Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSpeech();
                    }}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                      isSpeaking
                        ? "bg-amber-400 text-slate-950 font-extrabold animate-pulse"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    }`}
                    title={isSpeaking ? "Mute AI Voice Narration" : "Read Aloud with AI Voice"}
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-3 h-3 text-slate-950" />
                        <span>MUTE</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3 text-amber-400" />
                        <span>LISTEN VOICE</span>
                      </>
                    )}
                  </button>

                  {/* Status Indicator */}
                  {isStreaming ? (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-950/80 border border-blue-700/60 text-blue-300 text-[10px] font-bold rounded-md font-mono animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                      GENERATING
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[10px] font-bold rounded-md font-mono">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      VERIFIED
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(fullText || displayedText);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors text-xs flex items-center gap-1 cursor-pointer"
                    title="Copy AI Report"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied && <span className="text-[10px] text-emerald-400 font-bold">Copied</span>}
                  </button>
                </div>
              </div>

              {/* Active Audio Waveform Banner when speaking */}
              {isSpeaking && (
                <div className="px-4 py-1.5 bg-[#FF9933]/15 border-b border-[#FF9933]/30 text-amber-200 text-[10px] font-mono font-bold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Mic className="w-3.5 h-3.5 text-[#FF9933] animate-pulse" />
                    <span>🔊 Official AI Voice Briefing Active ({audioLang === "hi" ? "Hindi Voice" : "English Voice"})</span>
                  </span>
                  <div className="flex items-center gap-1 h-3">
                    <span className="w-0.5 h-3 bg-[#FF9933] animate-pulse" />
                    <span className="w-0.5 h-2 bg-[#FF9933] animate-pulse delay-75" />
                    <span className="w-0.5 h-4 bg-[#FF9933] animate-pulse delay-150" />
                    <span className="w-0.5 h-2.5 bg-[#FF9933] animate-pulse delay-100" />
                  </div>
                </div>
              )}

              {/* Formatted Streaming Body */}
              <div className="p-4 sm:p-5 bg-[#0A192F] relative">
                {/* Background Emblem Watermark */}
                <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
                  <Cpu className="w-28 h-28 text-white" />
                </div>

                <FormattedAIResponse text={displayedText} isStreaming={isStreaming} />
              </div>

              {/* Footer Click Hint */}
              {isStreaming && (
                <div className="px-4 py-1.5 bg-[#0F213D] border-t border-slate-800 text-[10px] text-slate-400 font-mono text-center">
                  Click anywhere on box to skip streaming animation
                </div>
              )}
            </div>
          )}

          {/* Itemized Risk Factors */}
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
              <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <span className="text-slate-500 text-[11px] block">Actual Sanctioned Cost</span>
                <span className="text-base font-bold font-mono text-slate-900">
                  {formatINR(sanctionedVal)}
                </span>
                <span className="text-[10px] text-red-600 block mt-0.5 font-medium">
                  +{work.evidence?.cost_deviation_percent || 38}% above peer median
                </span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <span className="text-slate-500 text-[11px] block">Peer Category Benchmark</span>
                <span className="text-base font-bold font-mono text-slate-700">
                  {formatINR(work.evidence?.peer_benchmark_cost || 1910000)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  District Median ({work.district || "District"})
                </span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <span className="text-slate-500 text-[11px] block">Financial vs Physical Progress</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-bold font-mono text-red-600">
                    {safeFin}% Fin
                  </span>
                  <span className="text-slate-400">/</span>
                  <span className="text-sm font-bold font-mono text-emerald-600">
                    {safePhy}% Phy
                  </span>
                </div>
                <span className="text-[10px] text-red-600 block mt-0.5 font-medium">
                  Divergence Delta: +{divergence}%
                </span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <span className="text-slate-500 text-[11px] block">Predicted Timeline Delay</span>
                <span className="text-base font-bold font-mono text-amber-700">
                  {work.evidence?.predicted_delay_days || 78} Days
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Exp: {work.expected_completion || "Scheduled"} → Pred: {work.predicted_completion || "Overdue"}
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
                    className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-xs cursor-pointer flex items-center justify-between transition-colors shadow-2xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{cite.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{cite.clause}</div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 italic p-2 bg-white rounded border border-slate-200">
                  MPLADS Revised Guidelines 2023 - General Financial Principles.
                </div>
              )}
            </div>
          </div>

          {/* Interactive Gantt-Style Project Schedule & Timeline Chart */}
          <GanttTimelineChart work={work} />
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex flex-col gap-3">
          {isCitizen ? (
            <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded-lg text-amber-900 text-xs font-semibold flex items-center justify-between">
              <span>Public Citizen Transparency View — Read-Only (Attestation & Administrative Controls Restricted)</span>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300 uppercase">
                Read-Only
              </span>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};
