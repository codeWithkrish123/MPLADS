import React, { useState, useMemo } from "react";
import {
  Landmark,
  IndianRupee,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  FileSpreadsheet,
  Download,
  PlusCircle,
  ChevronRight,
  Filter,
  Layers,
  Search,
  Sliders,
  TrendingUp,
  Activity,
} from "lucide-react";
import { WorkRecord, Language } from "../types";
import { MetricCard } from "../components/common/MetricCard";
import { RiskBadge } from "../components/common/RiskBadge";
import { formatINR, formatCr, cn } from "../lib/utils";
import { getTranslation } from "../data/translations";

interface MPDashboardViewProps {
  works: WorkRecord[];
  onSelectWork: (work: WorkRecord) => void;
  language?: Language;
}

export const MPDashboardView: React.FC<MPDashboardViewProps> = ({
  works,
  onSelectWork,
  language = "en",
}) => {
  const currentLang: Language = (language || "en") as Language;
  const isHindi = currentLang === "hi";
  const t = getTranslation(currentLang);

  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  // Get MP Constituency Works
  const constituencyWorks = useMemo(() => {
    const raw = works.filter(
      (w) =>
        w.constituency?.toLowerCase().includes("ghaziabad") ||
        w.state === "Uttar Pradesh"
    );
    return raw.length > 0 ? raw : works.slice(0, 45);
  }, [works]);

  // Filtered dataset
  const filteredWorks = useMemo(() => {
    return constituencyWorks.filter((w) => {
      // Tab status filter
      if (activeTab === "ONGOING" && (w.status === "Completed" || w.status === "Recommended")) return false;
      if (activeTab === "AT_RISK" && w.risk_category !== "CRITICAL" && w.risk_category !== "HIGH" && w.status !== "Requires Review") return false;
      if (activeTab === "COMPLETED" && w.status !== "Completed") return false;
      if (activeTab === "RECOMMENDED" && w.status !== "Recommended") return false;

      // Category filter
      if (categoryFilter !== "ALL" && w.category !== categoryFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          w.work_id.toLowerCase().includes(q) ||
          w.description.toLowerCase().includes(q) ||
          w.agency.toLowerCase().includes(q) ||
          w.category.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [constituencyWorks, activeTab, categoryFilter, searchQuery]);

  // Aggregates
  const totalSanctionedCr = useMemo(
    () => constituencyWorks.reduce((acc, w) => acc + (w.sanctioned_cost || 0), 0) / 10000000,
    [constituencyWorks]
  );
  const totalDisbursedCr = useMemo(
    () => constituencyWorks.reduce((acc, w) => acc + (w.actual_expenditure || 0), 0) / 10000000,
    [constituencyWorks]
  );
  const completedCount = useMemo(
    () => constituencyWorks.filter((w) => w.status === "Completed").length,
    [constituencyWorks]
  );
  const atRiskCount = useMemo(
    () => constituencyWorks.filter((w) => w.risk_category === "CRITICAL" || w.risk_category === "HIGH" || w.status === "Requires Review").length,
    [constituencyWorks]
  );
  const ongoingCount = useMemo(
    () => constituencyWorks.filter((w) => w.status === "In Progress" || w.status === "Sanctioned" || w.status === "Delayed").length,
    [constituencyWorks]
  );

  return (
    <div id="mp-constituency-dashboard" className="space-y-6 animate-in fade-in duration-200 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-[11px] font-bold rounded font-mono uppercase">
              {isHindi ? "संसदीय क्षेत्र" : "Parliamentary Constituency"}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {isHindi ? "18वीं लोकसभा • वित्त वर्ष 2025-26" : "18th Lok Sabha • FY 2025-26"}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Landmark className="w-6 h-6 text-blue-700" />
            {isHindi ? "मेरा एमपीलैड्स — गाजियाबाद (लोकसभा-12) कार्यस्थान" : "My MPLADS — Ghaziabad (LS-12) Workspace"}
          </h1>
          <p className="text-xs text-slate-600">
            {isHindi
              ? "संसदीय निर्वाचन क्षेत्र-स्तरीय निधि पात्रता आहरण, स्वीकृति ट्रैकिंग, भौतिक प्रगति बनाम वित्तीय व्यय निगरानी।"
              : "Constituency-level fund entitlement drawdown, sanction tracking, and physical milestone vs financial disbursement surveillance."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert(isHindi ? "आधिकारिक एमपीलैड्स अनुशंसा पोर्टल (ई-साक्षी) खुल रहा है..." : "Opening Official MPLADS Recommendation Portal (e-SAKSHI)...")}
            className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{isHindi ? "नए कार्य की अनुशंसा करें" : "Recommend New Work"}</span>
          </button>

          <button
            onClick={() => alert(isHindi ? "सांसद संसदीय क्षेत्र प्रगति रिपोर्ट (PDF) डाउनलोड हो रही है..." : "Downloading MP Constituency Progress Report (PDF)...")}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{isHindi ? "संसदीय क्षेत्र रिपोर्ट" : "Constituency Brief"}</span>
          </button>
        </div>
      </div>

      {/* Entitlement & Draw Financial Ledger */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-3.5">
        <MetricCard
          title={isHindi ? "वार्षिक पात्रता" : "Annual Entitlement"}
          value="₹5.00 Cr"
          subtitle={isHindi ? "निश्चित वार्षिक कोटा" : "Fixed annual quota"}
          icon={IndianRupee}
          accentColor="navy"
          sparklineData={[5, 5, 5, 5]}
        />
        <MetricCard
          title={isHindi ? "डीएम द्वारा स्वीकृत" : "Sanctioned by DM"}
          value={`₹${totalSanctionedCr.toFixed(2)} Cr`}
          subtitle={isHindi ? "सक्रिय स्वीकृत कार्य" : `${constituencyWorks.length} active works`}
          icon={CheckCircle2}
          accentColor="emerald"
          sparklineData={[0.8, 1.5, 2.1, totalSanctionedCr]}
        />
        <MetricCard
          title={isHindi ? "उपयोग / संवितरित" : "Utilized / Disbursed"}
          value={`₹${totalDisbursedCr.toFixed(2)} Cr`}
          subtitle={isHindi ? "वास्तविक क्षेत्र व्यय" : "Actual field expenditure"}
          icon={IndianRupee}
          accentColor="blue"
          sparklineData={[0.4, 0.9, 1.4, totalDisbursedCr]}
        />
        <MetricCard
          title={isHindi ? "प्रगतिशील कार्य" : "Ongoing Works"}
          value={`${ongoingCount}`}
          subtitle={isHindi ? "कार्य प्रगति पर" : "In execution"}
          icon={Activity}
          accentColor="blue"
          sparklineData={[12, 18, 22, ongoingCount]}
        />
        <MetricCard
          title={isHindi ? "पूर्ण कार्य" : "Completed Works"}
          value={`${completedCount}`}
          subtitle={isHindi ? "सार्वजनिक संपत्ति हस्तांतरित" : "Public assets handed over"}
          icon={CheckCircle2}
          accentColor="emerald"
          sparklineData={[10, 18, 24, completedCount]}
        />
        <MetricCard
          title={isHindi ? "जोखिम वाले कार्य" : "At-Risk Works"}
          value={`${atRiskCount}`}
          subtitle={isHindi ? "सांसद समीक्षा आवश्यक" : "Progress mismatch / Lag"}
          icon={AlertTriangle}
          accentColor="red"
          sparklineData={[2, 3, 5, atRiskCount]}
        />
      </div>

      {/* Active Recommended & Ongoing Works in Constituency */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Table Toolbar & Filter Tabs */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-200/70 p-1 rounded-lg">
            {(
              [
                { id: "ALL", label: isHindi ? "समस्त कार्य" : "All Projects", count: constituencyWorks.length },
                { id: "ONGOING", label: isHindi ? "प्रगतिशील" : "Ongoing", count: ongoingCount },
                { id: "AT_RISK", label: isHindi ? "समीक्षा आवश्यक" : "At Risk / Lag", count: atRiskCount },
                { id: "COMPLETED", label: isHindi ? "पूर्ण" : "Completed", count: completedCount },
                { id: "RECOMMENDED", label: isHindi ? "पाइपलाइन" : "Pipeline", count: constituencyWorks.filter((w) => w.status === "Recommended").length },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
                  activeTab === tab.id
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full font-mono",
                    activeTab === tab.id ? "bg-slate-100 text-slate-800" : "bg-slate-200 text-slate-600"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isHindi ? "कार्य या एजेंसी खोजें..." : "Search work or agency..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Project Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{isHindi ? "कार्य आईडी" : "Work ID"}</th>
                <th className="py-3 px-4">{isHindi ? "कार्य शीर्षक एवं विवरण" : "Work Title & Scope"}</th>
                <th className="py-3 px-4">{isHindi ? "श्रेणी" : "Category"}</th>
                <th className="py-3 px-4">{isHindi ? "कार्यान्वयन एजेंसी" : "Implementing Agency"}</th>
                <th className="py-3 px-4 text-right">{isHindi ? "लागत (स्वीकृत)" : "Sanctioned Cost"}</th>
                <th className="py-3 px-4 text-center min-w-[190px]">
                  {isHindi ? "प्रगति (भौतिक बनाम वित्तीय)" : "Progress (Physical vs Financial)"}
                </th>
                <th className="py-3 px-4 text-center">{isHindi ? "जोखिम स्थिति" : "Risk Priority"}</th>
                <th className="py-3 px-4 text-right">{isHindi ? "कार्रवाई" : "Action"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredWorks.map((work) => {
                const phy = work.physical_progress ?? 0;
                const fin = work.financial_progress ?? 0;
                const delta = fin - phy;
                const isCompleted = work.status === "Completed" || (phy === 100 && fin === 100);
                const isPending = work.status === "Recommended" || (phy === 0 && fin === 0);
                const hasDrawAnomaly = delta >= 20;

                return (
                  <tr
                    key={work.work_id}
                    onClick={() => onSelectWork(work)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 group-hover:text-blue-700 whitespace-nowrap">
                      {work.work_id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 max-w-xs">
                      <span className="block truncate font-bold text-slate-900">{work.description}</span>
                      <span className="block text-[11px] text-slate-500 font-normal">
                        Status: <span className="font-semibold text-slate-700">{work.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{work.category}</td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-[140px] font-mono text-[11px]">
                      {work.agency}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                      {formatINR(work.sanctioned_cost || work.recommended_cost)}
                    </td>

                    {/* Rich Visual Progress Column (Physical vs Financial) */}
                    <td className="py-3 px-4 text-center">
                      {isCompleted ? (
                        <div className="flex items-center justify-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-bold font-mono text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>100% Completed</span>
                        </div>
                      ) : isPending ? (
                        <div className="flex items-center justify-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-bold font-mono text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>0% Pipeline Sanction</span>
                        </div>
                      ) : (
                        <div className="space-y-1.5 text-left px-1">
                          {/* Physical Progress Row */}
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-slate-500 font-sans text-[10px] font-bold">Physical:</span>
                            <span className="font-bold text-emerald-700">{phy}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all"
                              style={{ width: `${Math.min(phy, 100)}%` }}
                            />
                          </div>

                          {/* Financial Draw Row */}
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-slate-500 font-sans text-[10px] font-bold">Financial Draw:</span>
                            <span className={cn("font-bold", hasDrawAnomaly ? "text-red-700" : "text-blue-700")}>
                              {fin}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                hasDrawAnomaly ? "bg-red-500" : "bg-blue-500"
                              )}
                              style={{ width: `${Math.min(fin, 100)}%` }}
                            />
                          </div>

                          {/* Mismatch Alert Flag */}
                          {hasDrawAnomaly && (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                              <AlertTriangle className="w-2.5 h-2.5 text-red-600 shrink-0" />
                              <span>Draw Lead: +{delta}%</span>
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <RiskBadge severity={work.risk_category} score={work.risk_score} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectWork(work);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded border border-blue-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        {isHindi ? "ऑडिट विवरण" : "Audit Details"} <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
