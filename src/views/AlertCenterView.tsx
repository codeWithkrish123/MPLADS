import React, { useState } from "react";
import {
  AlertTriangle,
  Flame,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  UserCheck,
  ChevronRight,
  Download,
} from "lucide-react";
import { RiskAlert, WorkRecord, Language } from "../types";
import { RiskBadge } from "../components/common/RiskBadge";
import { getTranslation, translateText } from "../data/translations";

interface AlertCenterViewProps {
  alerts: RiskAlert[];
  works: WorkRecord[];
  onSelectWork: (work: WorkRecord) => void;
  language?: Language;
}

export const AlertCenterView: React.FC<AlertCenterViewProps> = ({
  alerts,
  works,
  onSelectWork,
  language = "en",
}) => {
  const currentLang: Language = (language || "en") as Language;
  const isHindi = currentLang === "hi";
  const t = getTranslation(currentLang);

  const [selectedSeverity, setSelectedSeverity] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [alertList, setAlertList] = useState<RiskAlert[]>(alerts);

  const filteredAlerts = alertList.filter((a) => {
    const matchSearch =
      a.work_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.work_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchSev = selectedSeverity === "ALL" || a.severity === selectedSeverity;
    const matchCat = selectedCategory === "ALL" || a.category === selectedCategory;

    return matchSearch && matchSev && matchCat;
  });

  const handleAcknowledge = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAlertList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Acknowledged" as const } : a))
    );
  };

  const handleResolve = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAlertList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Resolved" as const } : a))
    );
  };

  return (
    <div id="alert-center-inbox-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-red-100 text-red-900 text-[11px] font-bold rounded font-mono uppercase">
              {isHindi ? "परिचालन ट्रियाज (Operational Triage)" : "Operational Triage"}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {filteredAlerts.length} {isHindi ? "सक्रिय जोखिम संकेत" : "Active Signals"}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            {isHindi ? "जोखिम संकेत व विसंगति ट्रियाज इनबॉक्स" : "Risk Signal & Anomaly Triage Inbox"}
          </h1>
          <p className="text-xs text-slate-600">
            {isHindi
              ? "प्रशासनिक पावती, जांच या ऑडिट ज्ञापन की आवश्यकता वाली मशीन द्वारा चिह्नित विसंगतियों की रीयल-टाइम कतार।"
              : "Real-time queue of machine-flagged anomalies requiring administrative acknowledgement, inquiry, or audit memo."}
          </p>
        </div>

        <button
          onClick={() => alert(isHindi ? "सक्रिय जोखिम अलर्ट लेजर एक्सपोर्ट किया जा रहा है (CSV)..." : "Exporting Active Risk Alerts Ledger (CSV)...")}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>{isHindi ? "अलर्ट लेजर एक्सपोर्ट (CSV)" : "Export Alert Ledger"}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={isHindi ? "कार्य आईडी, शीर्षक, कारण या जिले द्वारा खोजें..." : "Search alerts by work ID, title, reason, or district..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 hover:bg-white border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-500 text-slate-800"
          />
        </div>

        {/* Severity Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
          {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                selectedSeverity === sev
                  ? "bg-slate-900 text-white font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {sev === "ALL" ? (isHindi ? "सभी" : "ALL") : translateText(sev, currentLang)}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">{isHindi ? "विसंगति प्रकार:" : "Anomaly Type:"}</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">{isHindi ? "सभी श्रेणियां" : "All Categories"}</option>
            <option value="Cost Anomaly">{isHindi ? "लागत विसंगति" : "Cost Anomaly"}</option>
            <option value="Duplicate">{isHindi ? "समान / डुप्लिकेट कार्य" : "Near-Duplicate"}</option>
            <option value="Progress Mismatch">{isHindi ? "प्रगति विसंगति" : "Progress Mismatch"}</option>
            <option value="Delay Risk">{isHindi ? "विलंब जोखिम" : "Delay Forecast"}</option>
            <option value="Compliance">{isHindi ? "अनुपालन दिशा-निर्देश" : "Compliance Guideline"}</option>
          </select>
        </div>
      </div>

      {/* Alerts Stream List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const matchedWork = works.find((w) => w.work_id === alert.work_id);
          return (
            <div
              key={alert.id}
              onClick={() => matchedWork && onSelectWork(matchedWork)}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-4 shadow-xs transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-blue-700">
                    {alert.work_id}
                  </span>
                  <RiskBadge severity={alert.severity} size="sm" language={currentLang} />
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {translateText(alert.category, currentLang)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {alert.detected_at}
                  </span>
                </div>

                <div className="font-bold text-sm text-slate-900 group-hover:text-blue-700 truncate">
                  {alert.work_name}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {alert.reason}
                </p>

                <div className="text-[11px] text-slate-500 font-mono">
                  {isHindi ? "स्थान:" : "Location:"} {translateText(alert.district, currentLang)}, {translateText(alert.state, currentLang)} • {isHindi ? "स्थिति:" : "Status:"}{" "}
                  <strong className={alert.status === "Open" ? "text-red-700" : "text-emerald-700"}>
                    {translateText(alert.status, currentLang)}
                  </strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {alert.status === "Open" && (
                  <button
                    onClick={(e) => handleAcknowledge(alert.id, e)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                    <span>{isHindi ? "स्वीकार करें" : "Acknowledge"}</span>
                  </button>
                )}

                {alert.status !== "Resolved" && (
                  <button
                    onClick={(e) => handleResolve(alert.id, e)}
                    className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isHindi ? "निस्तारित करें" : "Mark Resolved"}</span>
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (matchedWork) onSelectWork(matchedWork);
                  }}
                  className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-md text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                >
                  <span>{isHindi ? "विवरण देखें" : "Explain"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
