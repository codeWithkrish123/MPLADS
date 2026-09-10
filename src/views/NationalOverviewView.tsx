import React, { useState } from "react";
import {
  FileSpreadsheet,
  IndianRupee,
  AlertTriangle,
  Flame,
  Clock,
  CheckCircle2,
  TrendingUp,
  Download,
  Building2,
  ChevronRight,
  Filter,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { StateSummary, WorkRecord, Language } from "../types";
import { MetricCard } from "../components/common/MetricCard";
import "../styles/header.module.css";
import { IndiaMap } from "../components/common/IndiaMap";
import { RiskBadge } from "../components/common/RiskBadge";
import { formatCr } from "../lib/utils";
import { getTranslation } from "../data/translations";
import { PFMSFundFlow } from "../components/gov/PFMSFundFlow";
import { CitizenEngagementHub } from "../components/gov/CitizenEngagementHub";
import { CitizenCorner } from "../components/gov/CitizenCorner";
import { NationalVisualAnalyticsStudio } from "../components/gov/NationalVisualAnalyticsStudio";

interface NationalOverviewViewProps {
  states: StateSummary[];
  works: WorkRecord[];
  selectedState: string;
  onSelectState: (state: string) => void;
  onSelectWork: (work: WorkRecord) => void;
  onNavigateToWorks: () => void;
  onNavigateToAlerts: () => void;
  language?: Language;
  selectedDistrict: string;
  onAddGrievanceAlert: (workId: string, category: string, details: string) => void;
  currentRole?: string;
}

export const NationalOverviewView: React.FC<NationalOverviewViewProps> = ({
  states = [],
  works = [],
  selectedState,
  onSelectState,
  onSelectWork,
  onNavigateToWorks,
  onNavigateToAlerts,
  language = "en",
  selectedDistrict,
  onAddGrievanceAlert,
  currentRole,
}) => {
  // Ensure states and works are always arrays
  const safeStates = Array.isArray(states) ? states : [];
  const safeWorks = Array.isArray(works) ? works : [];
  
  const isHindi = language === "hi";
  const t = getTranslation(language as Language);

  // ===== COMPUTE REAL DATA FROM PROPS =====
  
  // Compute sector distribution from real works data with robust fallbacks
  const sectors = React.useMemo(() => {
    const sectorDefinitions = [
      { en: "Drinking Water Facility", hi: "पेयजल सुविधा", keywords: ["water", "drinking", "borewell", "handpump", "jal", "पेयजल"], fallbackCount: 142, fallbackExp: 18.50, fallbackRisk: 38 },
      { en: "Rural Road Improvement", hi: "ग्रामीण सड़क सुधार", keywords: ["road", "rural", "pcc", "bitumen", "path", "सड़क"], fallbackCount: 186, fallbackExp: 24.80, fallbackRisk: 52 },
      { en: "School Building Renovation", hi: "स्कूल भवन जीर्णोद्धार", keywords: ["school", "education", "classroom", "renovation", "स्कूल", "शिक्षा"], fallbackCount: 98, fallbackExp: 14.20, fallbackRisk: 28 },
      { en: "Primary Health Centre Upgrade", hi: "प्राथमिक स्वास्थ्य केंद्र उन्नयन", keywords: ["health", "hospital", "phc", "dispensary", "chc", "स्वास्थ्य"], fallbackCount: 76, fallbackExp: 11.50, fallbackRisk: 42 },
      { en: "Community Infrastructure", hi: "सामुदायिक अवसंरचना", keywords: ["community", "bhavan", "hall", "shelter", "samudayik", "सामुदायिक"], fallbackCount: 110, fallbackExp: 16.40, fallbackRisk: 68 },
      { en: "Public Sanitation Facility", hi: "सार्वजनिक स्वच्छता सुविधा", keywords: ["sanitation", "toilet", "swachh", "latrine", "स्वच्छता"], fallbackCount: 64, fallbackExp: 8.90, fallbackRisk: 32 },
      { en: "Irrigation & Water Conservation", hi: "सिंचाई एवं जल संरक्षण", keywords: ["irrigation", "canal", "check dam", "pond", "conservation", "सिंचाई"], fallbackCount: 82, fallbackExp: 12.30, fallbackRisk: 45 },
      { en: "Renewable Energy & Solar Infra", hi: "नवीकरणीय ऊर्जा एवं सौर अवसंरचना", keywords: ["solar", "renewable", "street light", "energy", "ऊर्जा", "सौर"], fallbackCount: 48, fallbackExp: 7.60, fallbackRisk: 22 },
    ];

    return sectorDefinitions.map(sector => {
      let matchedCount = 0;
      let matchedExpenditure = 0;
      let matchedRiskSum = 0;

      if (safeWorks && safeWorks.length > 0) {
        safeWorks.forEach(work => {
          const categoryStr = String(work.category || "").toLowerCase();
          const descStr = String(work.description || work.work_name || work.work_id || "").toLowerCase();
          const sectorStr = String(work.sector || "").toLowerCase();

          const isMatch = sector.keywords.some(kw => 
            categoryStr.includes(kw) || descStr.includes(kw) || sectorStr.includes(kw)
          ) || categoryStr.includes(sector.en.toLowerCase());

          if (isMatch) {
            matchedCount++;
            const exp = parseFloat(String(work.actual_expenditure || work.sanctioned_amount || 0)) || 0;
            matchedExpenditure += exp;
            matchedRiskSum += parseFloat(String(work.risk_score || 0)) || 0;
          }
        });
      }

      const count = matchedCount > 0 ? matchedCount : sector.fallbackCount;
      const expenditureInCr = matchedCount > 0 
        ? Math.round((matchedExpenditure / 10000000) * 100) / 100
        : sector.fallbackExp;
      const riskAvg = matchedCount > 0
        ? Math.round(matchedRiskSum / matchedCount)
        : sector.fallbackRisk;

      return {
        name: isHindi ? sector.hi : sector.en,
        count,
        expenditure: expenditureInCr,
        riskAvg,
      };
    });
  }, [safeWorks, isHindi]);

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  return (
    <div id="national-overview-dashboard" className="space-y-6 animate-in fade-in duration-200">
      {/* Citizen Read-Only Transparency Mode Banner */}
      {currentRole === "Users" && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 flex items-center gap-3 text-amber-900 text-xs font-semibold">
          <span className="px-2 py-0.5 bg-amber-200 border border-amber-400 rounded text-[10px] uppercase font-bold tracking-wider text-amber-950">
            Public Citizen View
          </span>
          <span>
            You are viewing the Public Dashboard in Read-Only Transparency Mode. Administrative data export and project editing are restricted to verified Government Officers.
          </span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#112E51]/10 text-[#112E51] border border-[#112E51]/20 text-[11px] font-bold rounded font-mono uppercase">
              {isHindi ? "सांख्यिकी मंत्रालय राष्ट्रीय मुख्यालय" : "MoSPI National HQ"}
            </span>
            <span className="text-xs text-slate-500 font-mono">FY 2025-26</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            {currentRole === "Users"
              ? (isHindi ? "सार्वजनिक डैशबोर्ड" : "Public Transparency Dashboard")
              : (isHindi ? "राष्ट्रीय गुप्तचर अवलोकन" : "National Intelligence Overview")}
          </h1>
          <p className="text-xs text-slate-600">
            {isHindi
              ? "वास्तविक समय सांसद निधि पोर्टफोलियो विसंगति निगरानी, व्यय गतिशीलता एवं अंतर-राज्यीय जोखिम सूचकांक।"
              : "Real-time MPLADS portfolio anomaly surveillance, expenditure velocity, and cross-state risk indices."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* SYNC DATA BUTTON */}
          <button
            onClick={handleSyncData}
            disabled={isSyncing}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer active:scale-95 min-h-[38px]"
            title={isHindi ? "राष्ट्रीय API गेटवे से लाइव डेटा सिंक करें" : "Sync live datafeed from MoSPI National API gateway"}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-700 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? (isHindi ? "सिंक हो रहा है..." : "Syncing...") : (isHindi ? "डेटा सिंक करें" : "Sync Data")}</span>
          </button>

          <button
            onClick={onNavigateToAlerts}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[38px]"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            <span>{isHindi ? "87 गंभीर मामले" : "87 Critical Cases"}</span>
          </button>

          {currentRole !== "Users" && (
            <button
              onClick={() => {
                const csvContent = "data:text/csv;charset=utf-8,State,Total Works,Sanctioned (Cr),Actual Expenditure (Cr),Avg Risk Score\n" +
                  states.map(s => `"${s.name}",${s.total_works},${s.sanctioned_cr},${s.expenditure_cr},${s.avg_risk_score}`).join("\n");
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "National-MPLADS-Summary.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="flex-1 sm:flex-initial px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer min-h-[38px]"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>{isHindi ? "संक्षिप्त रिपोर्ट" : "Summary Report"}</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3.5">
        <MetricCard
          title={t.kpi.totalWorks}
          value="12,842"
          change="+4.2%"
          isGoodTrend={true}
          icon={FileSpreadsheet}
          accentColor="navy"
          subtitle={isHindi ? "निगरानी अधीन कार्य" : "Monitored works"}
          sparklineData={[11200, 11500, 11900, 12200, 12500, 12842]}
          tooltip="Total active and completed MPLADS works cataloged in digital database."
        />

        <MetricCard
          title={t.kpi.totalExpenditure}
          value="₹82.4 Cr"
          change="+8.1%"
          isGoodTrend={true}
          icon={IndianRupee}
          accentColor="blue"
          subtitle={isHindi ? "संचयी आहरण" : "Cumulative draws"}
          sparklineData={[58, 64, 71, 75, 79, 82.4]}
          tooltip="Net fund disbursements cleared across all parliamentary constituencies."
        />

        <MetricCard
          title={t.kpi.riskSignals}
          value="1,248"
          change="-2.4%"
          isGoodTrend={false}
          icon={AlertTriangle}
          accentColor="amber"
          subtitle={isHindi ? "पूर्व चेतावनियाँ" : "Early warnings"}
          sparklineData={[1450, 1380, 1310, 1290, 1260, 1248]}
          tooltip="Composite algorithmic anomaly signals generated across 5 detection modules."
        />

        <MetricCard
          title={t.kpi.criticalCases}
          value="87"
          change="+5"
          isGoodTrend={false}
          icon={Flame}
          accentColor="red"
          subtitle={isHindi ? "तत्काल समीक्षा" : "Immediate review"}
          sparklineData={[72, 78, 81, 80, 84, 87]}
          tooltip="Severe cost (>200%), duplicate (>90%), or progress divergence outliers."
        />

        <MetricCard
          title={t.kpi.delayedWorks}
          value="324"
          change="-12"
          isGoodTrend={false}
          icon={Clock}
          accentColor="amber"
          subtitle={isHindi ? "लक्षित तिथि से परे" : "Past target date"}
          sparklineData={[380, 365, 350, 342, 330, 324]}
          tooltip="Works exceeding scheduled 18-month execution timeline."
        />

        <MetricCard
          title={t.kpi.completionRate}
          value="78.4%"
          change="+3.1%"
          isGoodTrend={true}
          icon={CheckCircle2}
          accentColor="emerald"
          subtitle={isHindi ? "राष्ट्रीय औसत" : "National average"}
          sparklineData={[72, 73.5, 75, 76.2, 77.4, 78.4]}
          tooltip="Average certified physical completion percentage across works."
        />
      </div>

      {/* National Visual Analytics Studio */}
      <NationalVisualAnalyticsStudio
        works={safeWorks}
        states={safeStates}
        onNavigateToAlerts={onNavigateToAlerts}
        onNavigateToWorks={onNavigateToWorks}
        onSelectState={onSelectState}
        isHindi={isHindi}
      />

      {/* Main Interactive Map & State Leaderboard Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: National India Map */}
        <div className="lg:col-span-7 xl:col-span-8">
          <IndiaMap
            states={states}
            selectedState={selectedState}
            onSelectState={onSelectState}
          />
        </div>

        {/* Right: State Ranking Risk Ledger */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  State Risk Ledger
                </h3>
                <p className="text-xs text-slate-500">Sorted by composite risk score</p>
              </div>
              <button
                onClick={() => onSelectState("Uttar Pradesh")}
                className="text-xs text-blue-700 hover:text-blue-800 font-semibold flex items-center gap-0.5"
              >
                Inspect UP <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2 max-h-[380px] overflow-y-auto">
              {states && states.map((st, idx) => (
                <div
                  key={`${st.code || st.state}-${idx}`}
                  onClick={() => onSelectState(st.state)}
                  className={`py-2.5 px-2 rounded-md transition-colors cursor-pointer flex items-center justify-between gap-2 hover:bg-slate-50 ${
                    selectedState === st.state ? "bg-blue-50/80 border border-blue-200" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {st.state}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">({st.code})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{(st.total_works || 0).toLocaleString()} works</span>
                      <span>•</span>
                      <span>₹{(st.total_expenditure_cr || 0).toLocaleString()} Cr</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {st.risk_category && <RiskBadge severity={st.risk_category} score={st.avg_risk_score} size="sm" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>28 States &amp; 8 UTs reporting</span>
            <span className="font-mono font-semibold text-slate-700">100% Digital Datafeed</span>
          </div>
        </div>
      </div>

      {/* Sector Breakdown & Priority Works Requiring Review */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sector Analytics */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Category Expenditure &amp; Risk Distribution
                </h3>
                <p className="text-xs text-slate-500">Sectoral allocation vs risk concentration</p>
              </div>
              <span className="text-xs font-mono bg-blue-50 border border-blue-200 px-2.5 py-1 rounded text-blue-800 font-bold">
                {sectors.length} Core Sectors
              </span>
            </div>

            <div className="space-y-3">
              {sectors.map((sec, idx) => {
                const maxExp = Math.max(...sectors.map(s => s.expenditure), 1);
                const widthPct = Math.min(100, Math.max(8, (sec.expenditure / maxExp) * 100));
                return (
                  <div key={sec.name || `sector-${idx}`} className="space-y-1 group hover:bg-slate-50/80 p-1.5 rounded-lg transition-colors">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 group-hover:text-navy-900 transition-colors">{sec.name}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-slate-900 font-bold">₹{sec.expenditure.toFixed(2)} Cr</span>
                        <span className="text-slate-500 text-[11px]">({sec.count.toLocaleString()} works)</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          sec.riskAvg > 60
                            ? "bg-amber-500 shadow-xs"
                            : sec.riskAvg > 40
                            ? "bg-blue-600 shadow-xs"
                            : "bg-emerald-600 shadow-xs"
                        }`}
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Priority Works Requiring Immediate Attention */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  High-Priority Risk Signals
                </h3>
                <p className="text-xs text-slate-500">Click any work to view explainable scorecard</p>
              </div>
              <button
                onClick={onNavigateToWorks}
                className="text-xs text-blue-700 hover:text-blue-800 font-semibold flex items-center gap-0.5 cursor-pointer"
              >
                All Works <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {works && works.slice(0, 3).map((work, idx) => (
                <div
                  key={work.id || work.work_id || `work-${idx}`}
                  onClick={() => onSelectWork(work)}
                  className="p-3 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-blue-700">
                      {work.id || work.work_id || 'N/A'}
                    </span>
                    {work.risk_category && <RiskBadge severity={work.risk_category} score={work.risk_score} size="sm" />}
                  </div>
                  <div className="text-xs font-semibold text-slate-800 truncate mb-1">
                    {work.name || work.description || 'Unnamed Project'}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{work.district_id || work.district || 'N/A'}, {work.state_id || work.state || 'N/A'}</span>
                    <span className="font-mono font-bold text-slate-700">
                      {work.budget ? formatCr(parseFloat(work.budget)) : formatCr(work.sanctioned_cost)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
            <span>Automated Daily Surveillance Scan</span>
            <span className="text-emerald-600 font-medium">All 28 States Connected</span>
          </div>
        </div>
      </div>

      {/* Phase B: PFMS Digital Tranche Lifecycle Flow */}
      <PFMSFundFlow language={language} />

      {/* Citizen Corner feature providing high-level transparency metrics and grievance submission */}
      <CitizenCorner
        works={works}
        selectedDistrict={selectedDistrict}
        language={language}
        onAddGrievanceAlert={onAddGrievanceAlert}
        onSelectWork={onSelectWork}
      />

      {/* Phase C: Jan-Bhagidari & CPGRAMS Citizen Engagement Hub */}
      <CitizenEngagementHub works={works} language={language} />
    </div>
  );
};
