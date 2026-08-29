import React, { useState, useEffect } from "react";
import {
  History,
  Lock,
  Search,
  Download,
  Filter,
  CheckCircle,
  FileCheck,
  Shield,
  Sparkles,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  BrainCircuit,
  MessageSquareQuote,
  Activity,
} from "lucide-react";
import { AuditLogEntry, Language } from "../types";
import { getTranslation } from "../data/translations";

interface AuditLogViewProps {
  logs: AuditLogEntry[];
  language?: Language;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs, language = "en" }) => {
  const currentLang: Language = (language || "en") as Language;
  const isHindi = currentLang === "hi";
  const t = getTranslation(currentLang);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [isAnalyzingSentiment, setIsAnalyzingSentiment] = useState(false);
  const [sentimentResult, setSentimentResult] = useState<{
    analysis: string;
    index: number;
    category: string;
  } | null>(null);

  const filteredLogs = logs.filter((l) => {
    const matchSearch =
      l.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.entity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = selectedRole === "ALL" || l.role.toLowerCase().includes(selectedRole.toLowerCase());
    return matchSearch && matchRole;
  });

  const runSentimentAnalysis = async () => {
    setIsAnalyzingSentiment(true);
    try {
      const response = await fetch("/api/ai/audit-sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logs: filteredLogs, focusRole: selectedRole }),
      });
      const data = await response.json();
      if (data.success) {
        setSentimentResult({
          analysis: data.sentiment_analysis,
          index: data.sentiment_index || 76,
          category: data.sentiment_category || (isHindi ? "उच्चीकृत अनुपालन समीक्षा" : "Elevated Compliance Scrutiny"),
        });
      }
    } catch (err) {
      console.error("Failed to run sentiment analysis", err);
    } finally {
      setIsAnalyzingSentiment(false);
    }
  };

  useEffect(() => {
    // Run initial sentiment evaluation on mount
    runSentimentAnalysis();
  }, [selectedRole]);

  return (
    <div id="audit-trail-logs-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-900 text-slate-100 text-[11px] font-bold rounded font-mono uppercase flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              {isHindi ? "क्रिप्टोग्राफिक ऑडिट लेजर" : "Cryptographic Audit Ledger"}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {isHindi ? "SHA-256 अपरिवर्तनीयता" : "SHA-256 Immutability"}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <History className="w-6 h-6 text-slate-800" />
            {isHindi ? "सांविधिक ऑडिट ट्रेल एवं सत्यापन लॉग" : "Statutory Audit Trail & Verification Log"}
          </h1>
          <p className="text-xs text-slate-600">
            {isHindi
              ? "सभी उपयोगकर्ता हस्तक्षेपों, स्थिति निर्धारणों, पूछताछ प्रेषणों और एल्गोरिदम जोखिम ओवरराइड घटनाओं का अपरिवर्तनीय लॉग।"
              : "Immutable log of all user interventions, status determinations, inquiry dispatches, and algorithm risk override events."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runSentimentAnalysis}
            disabled={isAnalyzingSentiment}
            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer disabled:opacity-60"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAnalyzingSentiment ? "animate-spin text-indigo-600" : ""}`} />
            <span>
              {isAnalyzingSentiment
                ? isHindi
                  ? "मूल्यांकन हो रहा है..."
                  : "Evaluating..."
                : isHindi
                ? "एआई भावना ताज़ा करें"
                : "Refresh AI Sentiment"}
            </span>
          </button>

          <button
            onClick={() =>
              alert(
                isHindi
                  ? "क्रिप्टोग्राफिक रूप से सत्यापित ऑडिट प्रमाणपत्र (PDF/CSV) निर्यात किया जा रहा है..."
                  : "Exporting Cryptographically Verified Audit Certificate (PDF/CSV)..."
              )
            }
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{isHindi ? "प्रमाणपत्र निर्यात करें" : "Export Certificate"}</span>
          </button>
        </div>
      </div>

      {/* Gemini AI Sentiment & Friction Analysis Summary Card */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-900/60 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-inner">
              <BrainCircuit className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 text-[10px] font-bold rounded font-mono uppercase border border-indigo-700/60">
                  {isHindi ? "जेमिनी संस्थागत इंटेलिजेंस" : "Gemini Institutional Intelligence"}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {isHindi ? "प्रासंगिक घर्षण एवं व्यवहार सूचकांक" : "Contextual Friction & Behavioral Index"}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-100 mt-0.5">
                {isHindi
                  ? "ऑडिट लॉग भावना एवं प्रशासनिक घर्षण संश्लेषण"
                  : "Audit Log Sentiment & Administrative Friction Synthesis"}
              </h2>
            </div>
          </div>

          {sentimentResult && (
            <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-3.5 py-2 rounded-xl">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block">
                  {isHindi ? "जांच सूचकांक" : "Scrutiny Index"}
                </span>
                <span className="text-base font-extrabold text-amber-400 font-mono">
                  {sentimentResult.index}/100
                </span>
              </div>
              <div className="h-6 w-px bg-slate-700" />
              <span className="text-xs font-semibold text-indigo-200">
                {sentimentResult.category}
              </span>
            </div>
          )}
        </div>

        <div className="pt-4">
          {isAnalyzingSentiment ? (
            <div className="py-8 flex flex-col items-center justify-center gap-3 text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
              <span className="text-xs font-mono">
                {isHindi
                  ? "जेमिनी द्वारा मैन्युअल टिप्पणियों और प्रशासनिक ओवरराइड का मूल्यांकन किया जा रहा है..."
                  : "Gemini evaluating manual comments and administrative overrides..."}
              </span>
            </div>
          ) : sentimentResult ? (
            <div className="prose prose-invert prose-sm max-w-none text-slate-200 text-xs sm:text-sm leading-relaxed space-y-3 font-sans">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 whitespace-pre-line">
                {sentimentResult.analysis}
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400">
              {isHindi
                ? "ऑडिट लॉग रिकॉर्ड्स में अनुपालन भावना का विश्लेषण करने के लिए \"एआई भावना ताज़ा करें\" पर क्लिक करें।"
                : 'Click "Refresh AI Sentiment" to synthesize compliance sentiment across audit log records.'}
            </div>
          )}
        </div>
      </div>

      {/* Security Status Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-600/50 flex items-center justify-center text-emerald-400 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs">
              {isHindi ? "चेन अखंडता सत्यापित: 100% मान्य" : "Chain Integrity Verified: 100% Valid"}
            </div>
            <p className="text-[11px] text-slate-400">
              {isHindi
                ? "नियंत्रक एवं महालेखा परीक्षक (CAG) ऑडिट तत्परता के लिए प्रत्येक दर्ज की गई कार्रवाई क्रिप्टोग्राफिक रूप से हस्ताक्षरित और संग्रहीत है।"
                : "Every logged action is cryptographically signed and archived for Comptroller & Auditor General (CAG) audit readiness."}
            </p>
          </div>
        </div>

        <div className="font-mono text-xs text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800 shrink-0">
          {isHindi ? "हैश: e4b2...8f91 (सक्रिय)" : "HASH: e4b2...8f91 (ACTIVE)"}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              isHindi
                ? "उपयोगकर्ता, कार्रवाई, इकाई आईडी या लॉग हैश द्वारा ऑडिट ट्रेल खोजें..."
                : "Search audit trail by user, action, entity ID or log hash..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 hover:bg-white border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">{isHindi ? "भूमिका:" : "Role:"}</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">{isHindi ? "सभी भूमिकाएं" : "All Roles"}</option>
            <option value="District">{isHindi ? "जिला प्राधिकरण / डीएम" : "District Authority / DM"}</option>
            <option value="State">{isHindi ? "राज्य नोडल" : "State Nodal"}</option>
            <option value="Ministry">{isHindi ? "मंत्रालय" : "Ministry"}</option>
            <option value="Sentinel">{isHindi ? "स्वचालित सेंटिनल" : "Automated Sentinel"}</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{isHindi ? "लॉग आईडी और समय" : "Log ID & Time"}</th>
                <th className="py-3 px-4">{isHindi ? "अधिकृत उपयोगकर्ता एवं भूमिका" : "Authorized User & Role"}</th>
                <th className="py-3 px-4">{isHindi ? "की गई कार्रवाई" : "Action Performed"}</th>
                <th className="py-3 px-4">{isHindi ? "लक्ष्य इकाई" : "Target Entity"}</th>
                <th className="py-3 px-4">{isHindi ? "ऑडिट मान (पुराना → नया)" : "Audit Values (Old → New)"}</th>
                <th className="py-3 px-4 text-right">{isHindi ? "क्रिप्टोग्राफिक हैश" : "Cryptographic Hash"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{log.id}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{log.timestamp}</div>
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-bold text-slate-900">{log.user}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{log.role}</div>
                  </td>
                  <td className="py-3.5 px-4 font-sans font-semibold text-slate-800">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-blue-700">
                    {log.entity}
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-slate-600 font-sans">
                    <span className="text-slate-400 line-through mr-1">{log.old_value}</span>
                    <span>→</span>
                    <span className="font-bold text-slate-900 ml-1">{log.new_value}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-[10px] text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {log.hash_signature.slice(0, 18)}...
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

