import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import {
  Layers,
  Building2,
  ShieldAlert,
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  IndianRupee,
  Activity,
  Filter,
  Info,
  ExternalLink,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { StateSummary, WorkRecord } from "../../types";

interface NationalVisualAnalyticsStudioProps {
  works?: WorkRecord[];
  states?: StateSummary[];
  onNavigateToAlerts?: () => void;
  onNavigateToWorks?: () => void;
  onSelectState?: (stateName: string) => void;
  isHindi?: boolean;
}

type TabType = "overview" | "mpFundUse" | "riskAnomalies" | "stateComparison" | "publicAmenities";
type HouseType = "all" | "lokSabha" | "rajyaSabha";
type SortOption = "expenditure" | "completion" | "risk";

export const NationalVisualAnalyticsStudio: React.FC<NationalVisualAnalyticsStudioProps> = ({
  works = [],
  states = [],
  onNavigateToAlerts,
  onNavigateToWorks,
  onSelectState,
  isHindi = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [selectedHouse, setSelectedHouse] = useState<HouseType>("all");
  const [sortOption, setSortOption] = useState<SortOption>("expenditure");
  const [amenitySearch, setAmenitySearch] = useState<string>("");

  // ===== MOCK / REAL DATASETS FOR STUDIO VISUALIZATIONS =====

  // 1. MP Recommended vs Spent Dataset
  const mpData = useMemo(() => {
    const defaultData = [
      { constituency: "Varanasi (UP)", mp: "Narendra Modi", house: "lokSabha", entitlement: 5.0, recommended: 4.8, sanctioned: 4.5, spent: 4.38, utilization: 88, works: 42, completion: 92, status: "Compliant" },
      { constituency: "Ghaziabad (UP)", mp: "Atul Garg", house: "lokSabha", entitlement: 5.0, recommended: 4.2, sanctioned: 3.8, spent: 2.84, utilization: 57, works: 38, completion: 68, status: "Audit Flag" },
      { constituency: "Nagpur (MH)", mp: "Nitin Gadkari", house: "lokSabha", entitlement: 5.0, recommended: 4.6, sanctioned: 4.2, spent: 3.75, utilization: 75, works: 36, completion: 85, status: "Compliant" },
      { constituency: "Coimbatore (TN)", mp: "Ganapathi Rajkumar", house: "lokSabha", entitlement: 5.0, recommended: 4.5, sanctioned: 4.2, spent: 3.92, utilization: 78, works: 34, completion: 89, status: "Compliant" },
      { constituency: "Patna Sahib (BR)", mp: "Ravi Shankar Prasad", house: "lokSabha", entitlement: 5.0, recommended: 3.8, sanctioned: 3.2, spent: 2.45, utilization: 49, works: 31, completion: 64, status: "Audit Flag" },
      { constituency: "Ahmedabad (GJ)", mp: "Hasmukh Patel", house: "lokSabha", entitlement: 5.0, recommended: 4.7, sanctioned: 4.4, spent: 4.15, utilization: 83, works: 39, completion: 91, status: "Compliant" },
      { constituency: "Rajya Sabha (MH)", mp: "Piyush Goyal", house: "rajyaSabha", entitlement: 5.0, recommended: 4.4, sanctioned: 4.1, spent: 3.80, utilization: 76, works: 35, completion: 87, status: "Compliant" },
      { constituency: "Rajya Sabha (KA)", mp: "Nirmala Sitharaman", house: "rajyaSabha", entitlement: 5.0, recommended: 4.6, sanctioned: 4.3, spent: 4.02, utilization: 80, works: 37, completion: 90, status: "Compliant" },
    ];

    if (selectedHouse === "all") return defaultData;
    return defaultData.filter(d => d.house === selectedHouse);
  }, [selectedHouse]);

  // 2. Risk Stratification Pie Data
  const riskDistributionData = [
    { name: "Low Risk (0-30)", value: 9480, percentage: 73.8, color: "#10B981", label: "Low Risk" },
    { name: "Moderate Risk (31-60)", value: 2114, percentage: 16.5, color: "#F97316", label: "Moderate" },
    { name: "High Risk (61-80)", value: 1161, percentage: 9.0, color: "#EF4444", label: "High Risk" },
    { name: "Critical (81-100)", value: 87, percentage: 0.7, color: "#991B1B", label: "Critical" },
  ];

  // 3. Public Amenities Sector Data
  const amenitiesSectorData = [
    { category: "Drinking Water", expenditure: 18.5, works: 142, color: "#0284C7", completion: 86, impactScore: 94 },
    { category: "Rural Roads", expenditure: 24.6, works: 186, color: "#059669", completion: 82, impactScore: 91 },
    { category: "Education & Schools", expenditure: 14.2, works: 98, color: "#1D4ED8", completion: 89, impactScore: 88 },
    { category: "Healthcare (PHC)", expenditure: 11.5, works: 76, color: "#D97706", completion: 78, impactScore: 92 },
    { category: "Community Centres", expenditure: 16.4, works: 110, color: "#8B5CF6", completion: 74, impactScore: 84 },
    { category: "Public Sanitation", expenditure: 8.9, works: 64, color: "#0D9488", completion: 91, impactScore: 95 },
  ];

  // 4. Comparative State Data
  const comparativeStateData = useMemo(() => {
    const rawStateData = [
      { name: "Uttar Pradesh", sanctioned: 22.5, spent: 18.4, completion: 75, riskScore: 42, works: 2481, highRiskWorks: 45 },
      { name: "Maharashtra", sanctioned: 18.0, spent: 14.2, completion: 81, riskScore: 36, works: 1940, highRiskWorks: 22 },
      { name: "Bihar", sanctioned: 14.8, spent: 11.6, completion: 68, riskScore: 58, works: 1520, highRiskWorks: 28 },
      { name: "Tamil Nadu", sanctioned: 12.0, spent: 9.6, completion: 88, riskScore: 34, works: 1210, highRiskWorks: 12 },
      { name: "Gujarat", sanctioned: 8.8, spent: 7.1, completion: 91.2, riskScore: 28, works: 980, highRiskWorks: 8 },
      { name: "Karnataka", sanctioned: 11.2, spent: 9.1, completion: 84, riskScore: 39, works: 1150, highRiskWorks: 15 },
      { name: "Rajasthan", sanctioned: 10.5, spent: 8.2, completion: 72, riskScore: 46, works: 1040, highRiskWorks: 19 },
    ];

    return [...rawStateData].sort((a, b) => {
      if (sortOption === "expenditure") return b.spent - a.spent;
      if (sortOption === "completion") return b.completion - a.completion;
      return a.riskScore - b.riskScore;
    });
  }, [sortOption]);

  // 5. Anomaly Velocity Dataset
  const anomalyCategoryData = [
    { category: "Cost Inflation", flagged: 412, resolved: 289, impact: "₹14.8 Cr" },
    { category: "Progress Lag", flagged: 368, resolved: 214, impact: "₹11.2 Cr" },
    { category: "Timeline Slip", flagged: 324, resolved: 198, impact: "₹9.5 Cr" },
    { category: "Duplicate Risk", flagged: 144, resolved: 96, impact: "₹4.8 Cr" },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
      {/* ===== TOP HEADER & NAVIGATION TABS ===== */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-blue-900 text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1 shadow-2xs">
              <Activity className="w-3 h-3 text-saffron-400" />
              NATIONAL VISUAL ANALYTICS STUDIO
            </span>
            <span className="text-xs text-slate-500 font-medium">Simplified Visuals for Citizens &amp; Public</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            MPLADS Fund Flow, Member Activity &amp; State Risk Diagrams
          </h2>
          <p className="text-xs text-slate-600">
            Clear graphic breakdown showing how Members of Parliament utilize their ₹5 Cr annual quota, real-time risk alerts, and state-by-state delivery.
          </p>
        </div>

        {/* Studio Navigation Pills */}
        <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-lg border border-slate-200 gap-1 self-start xl:self-center">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "overview"
                ? "bg-white text-navy-900 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("mpFundUse")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "mpFundUse"
                ? "bg-white text-navy-900 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>MP Fund Use</span>
          </button>

          <button
            onClick={() => setActiveTab("riskAnomalies")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "riskAnomalies"
                ? "bg-white text-navy-900 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            <span>Risk &amp; Anomalies</span>
          </button>

          <button
            onClick={() => setActiveTab("stateComparison")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "stateComparison"
                ? "bg-white text-navy-900 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>State Comparison</span>
          </button>

          <button
            onClick={() => setActiveTab("publicAmenities")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "publicAmenities"
                ? "bg-white text-navy-900 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-amber-600" />
            <span>Public Amenities</span>
          </button>
        </div>
      </div>

      {/* ===== CITIZEN EXPLAINER BANNER ===== */}
      <div className="bg-gradient-to-r from-blue-50/90 via-slate-50 to-indigo-50/80 border border-blue-200/80 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
            ₹
          </div>
          <div>
            <span className="font-extrabold text-slate-900">Citizen Guide: How does MPLADS work?</span>
            <p className="text-slate-600 text-[11px]">
              Each Member of Parliament receives ₹5 Crore/year to recommend local developmental works (drinking water, roads, schools). The District Collector sanctions and audits the work.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono shrink-0">
          <span className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 font-semibold shadow-2xs">
            Annual Quota: ₹5.00 Cr / MP
          </span>
          <span className="px-2.5 py-1 bg-emerald-100 border border-emerald-300 rounded text-emerald-900 font-bold shadow-2xs">
            PFMS Tracked
          </span>
        </div>
      </div>

      {/* ===== TAB CONTENT SWITCHER WITH MOTION ANIMATION ===== */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* 3 TOP ANALYTICS CARDS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* CARD 1: MP RECOMMENDED VS SPENT */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      MP Recommended vs Spent (₹ Cr)
                    </h3>
                    <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold">Top MPs</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">Funds recommended by MPs vs actual certified civil expenditure:</p>

                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mpData.slice(0, 5)} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="constituency" tick={{ fontSize: 9, fill: "#64748B" }} interval={0} angle={-15} textAnchor="end" />
                        <YAxis tick={{ fontSize: 10, fill: "#64748B" }} domain={[0, 8]} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#0F172A", color: "#FFF", borderRadius: "6px", fontSize: "11px" }}
                          formatter={(val: any) => [`₹${val} Cr`, ""]}
                        />
                        <Bar dataKey="recommended" name="Recommended" fill="#0284C7" radius={[3, 3, 0, 0]} barSize={16} />
                        <Bar dataKey="spent" name="Actual Spent" fill="#0F172A" radius={[3, 3, 0, 0]} barSize={16} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4 text-[11px] font-medium pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-[#0284C7]"></span> Recommended</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-[#0F172A]"></span> Actual Spent</span>
                </div>
              </div>

              {/* CARD 2: PROJECT RISK LEVELS DONUT */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                      Project Risk Levels (12,842 Works)
                    </h3>
                    <button onClick={onNavigateToAlerts} className="text-[10px] text-blue-700 font-bold hover:underline cursor-pointer flex items-center gap-0.5">
                      View Alerts &gt;
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">73.8% works in green safety zone, 0.7% under immediate audit:</p>

                  <div className="h-44 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={riskDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {riskDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: "#0F172A", color: "#FFF", borderRadius: "6px", fontSize: "11px" }}
                          formatter={(val: any, name: any, item: any) => [`${val.toLocaleString()} works (${item.payload.percentage}%)`, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100 font-mono">
                  {riskDistributionData.map(item => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-700 font-medium">{item.label}:</span>
                      <span className="text-slate-900 font-bold">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 3: PUBLIC AMENITIES SPENT */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-600" />
                      Public Amenities Spent (₹ Cr)
                    </h3>
                    <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold">6 Sectors</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">Where public funds directly improve village &amp; city facilities:</p>

                  <div className="space-y-2.5">
                    {amenitiesSectorData.map(sec => {
                      const maxExp = 28;
                      const widthPct = (sec.expenditure / maxExp) * 100;
                      return (
                        <div key={sec.category} className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-slate-800">{sec.category}</span>
                            <span className="font-mono font-bold text-slate-900">₹{sec.expenditure} Cr</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${widthPct}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: sec.color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-3 border-t border-slate-100 mt-2 font-mono text-slate-600">
                  <span>Highest: <strong className="text-slate-900">Rural Roads (₹24.6 Cr)</strong></span>
                  <span className="text-emerald-700 font-bold">82% Avg Complete</span>
                </div>
              </div>
            </div>

            {/* BOTTOM SECTION: COMPARATIVE STATE EXPENDITURE & WORK DELIVERY RATIO */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Comparative State Expenditure &amp; Work Delivery Ratio
                  </h3>
                  <p className="text-xs text-slate-500">Sanctioned funds vs actual disbursement and certified physical completion %:</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Sort by:</span>
                  <select
                    value={sortOption}
                    onChange={e => setSortOption(e.target.value as SortOption)}
                    className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="expenditure">Expenditure (High to Low)</option>
                    <option value="completion">Completion Rate (%)</option>
                    <option value="risk">Lowest Risk Score</option>
                  </select>
                </div>
              </div>

              {/* DUAL-AXIS RECHARTS GRAPH */}
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={comparativeStateData} margin={{ top: 15, right: 20, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#475569", fontWeight: 600 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#64748B" }} unit=" Cr" domain={[0, 28]} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#10B981" }} unit="%" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0F172A", color: "#FFF", borderRadius: "6px", fontSize: "11px" }}
                      formatter={(value: any, name: any) => [
                        name.includes("Rate") ? `${value}%` : `₹${value} Cr`,
                        name,
                      ]}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                    <Bar yAxisId="left" dataKey="sanctioned" name="Sanctioned (₹ Cr)" fill="#0284C7" barSize={22} radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="left" dataKey="spent" name="Actual Spent (₹ Cr)" fill="#0F172A" barSize={22} radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="completion" name="Completion Rate (%)" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4, fill: "#10B981" }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* 4 SUMMARY STAT CARDS BELOW GRAPH */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <span className="text-[11px] text-slate-500 block font-medium">Top Spending State</span>
                  <strong className="text-slate-900 text-sm block">Uttar Pradesh</strong>
                  <span className="text-blue-700 font-mono font-bold">₹18.4 Cr (2,481 works)</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <span className="text-[11px] text-slate-500 block font-medium">Highest Completion</span>
                  <strong className="text-slate-900 text-sm block">Gujarat</strong>
                  <span className="text-emerald-700 font-mono font-bold">91.2% Certified</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <span className="text-[11px] text-slate-500 block font-medium">Safest Compliance</span>
                  <strong className="text-slate-900 text-sm block">Tamil Nadu</strong>
                  <span className="text-emerald-800 font-mono font-bold">Avg Risk 34/100</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <span className="text-[11px] text-slate-500 block font-medium">Audited State</span>
                  <strong className="text-slate-900 text-sm block">Bihar</strong>
                  <span className="text-red-700 font-mono font-bold">28 High-Risk Works</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== TAB 2: MP FUND USE ===== */}
        {activeTab === "mpFundUse" && (
          <motion.div
            key="mpFundUse"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {/* Header & House Filter */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  Member of Parliament Fund Allocation &amp; Work Recommendation Ledger
                </h3>
                <p className="text-xs text-slate-500">Transparent breakdown of ₹5 Cr quota utilization per Member across Lok Sabha and Rajya Sabha:</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">House:</span>
                <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200 text-xs font-semibold">
                  <button
                    onClick={() => setSelectedHouse("all")}
                    className={`px-2.5 py-1 rounded transition-colors ${selectedHouse === "all" ? "bg-blue-900 text-white shadow-2xs" : "text-slate-700 hover:text-slate-900"}`}
                  >
                    All Houses
                  </button>
                  <button
                    onClick={() => setSelectedHouse("lokSabha")}
                    className={`px-2.5 py-1 rounded transition-colors ${selectedHouse === "lokSabha" ? "bg-blue-900 text-white shadow-2xs" : "text-slate-700 hover:text-slate-900"}`}
                  >
                    Lok Sabha
                  </button>
                  <button
                    onClick={() => setSelectedHouse("rajyaSabha")}
                    className={`px-2.5 py-1 rounded transition-colors ${selectedHouse === "rajyaSabha" ? "bg-blue-900 text-white shadow-2xs" : "text-slate-700 hover:text-slate-900"}`}
                  >
                    Rajya Sabha
                  </button>
                </div>
              </div>
            </div>

            {/* CONSTITUENCY-WISE FUND PROGRESS CHART */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Constituency-Wise Fund Progress (₹5.00 Cr Quota Benchmark)
                </h4>
                <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold">
                  {mpData.length} MPs Monitored
                </span>
              </div>
              <p className="text-xs text-slate-500">Entitlement baseline ₹5 Cr vs Recommended vs Sanctioned by DM vs Spent</p>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mpData} margin={{ top: 15, right: 15, left: -10, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="constituency" tick={{ fontSize: 10, fill: "#475569" }} angle={-15} textAnchor="end" />
                    <YAxis tick={{ fontSize: 10, fill: "#64748B" }} domain={[0, 6]} unit=" Cr" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0F172A", color: "#FFF", borderRadius: "6px", fontSize: "11px" }}
                      formatter={(val: any) => [`₹${val} Cr`, ""]}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Bar dataKey="entitlement" name="Entitlement (₹5 Cr)" fill="#CBD5E1" barSize={14} radius={[2, 2, 0, 0]} />
                    <Bar dataKey="recommended" name="Recommended (₹ Cr)" fill="#0284C7" barSize={14} radius={[2, 2, 0, 0]} />
                    <Bar dataKey="sanctioned" name="Sanctioned (₹ Cr)" fill="#10B981" barSize={14} radius={[2, 2, 0, 0]} />
                    <Bar dataKey="spent" name="Actual Spent (₹ Cr)" fill="#0F172A" barSize={14} radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* INDIVIDUAL MP CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mpData.map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-3 hover:border-slate-300 transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">{item.constituency}</h5>
                      <span className="text-xs text-slate-500 block">{item.house === "lokSabha" ? "Lok Sabha MP" : "Rajya Sabha MP"}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.status === "Compliant"
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                        : "bg-red-100 text-red-900 border border-red-300"
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-600">Utilization:</span>
                      <strong className="text-slate-900">₹{item.spent} / 5 Cr ({item.utilization}%)</strong>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.utilization >= 75 ? "bg-emerald-600" : item.utilization >= 60 ? "bg-blue-600" : "bg-amber-500"
                        }`}
                        style={{ width: `${item.utilization}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-600 font-mono">
                    <span>{item.works} Works sanctioned</span>
                    <span className="text-emerald-700 font-bold">{item.completion}% Complete</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ===== TAB 3: RISK & ANOMALIES ===== */}
        {activeTab === "riskAnomalies" && (
          <motion.div
            key="riskAnomalies"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {/* 4 TOP ANOMALY METRIC CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {anomalyCategoryData.map((anom, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">{anom.category}</span>
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">{anom.flagged}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 font-mono">
                    <span>Estimated Impact: <strong className="text-slate-800">{anom.impact}</strong></span>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] text-emerald-800 font-semibold flex items-center justify-between">
                    <span>Resolved in Audit:</span>
                    <span className="font-bold">{anom.resolved}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* MAIN ANALYTICS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* LEFT: ANOMALY VELOCITY BAR CHART */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    Primary Anomaly Categories &amp; Resolution Velocity
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">Total flagged anomaly cases vs cases verified and resolved during physical inspections:</p>

                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={anomalyCategoryData} margin={{ top: 10, right: 15, left: -10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="category" tick={{ fontSize: 10, fill: "#475569" }} />
                        <YAxis tick={{ fontSize: 10, fill: "#64748B" }} domain={[0, 600]} />
                        <Tooltip contentStyle={{ backgroundColor: "#0F172A", color: "#FFF", borderRadius: "6px", fontSize: "11px" }} />
                        <Legend wrapperStyle={{ fontSize: "11px" }} />
                        <Bar dataKey="flagged" name="Flagged Cases" fill="#EA580C" barSize={26} radius={[3, 3, 0, 0]} />
                        <Bar dataKey="resolved" name="Resolved" fill="#059669" barSize={26} radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* RIGHT: RISK STRATIFICATION CARD */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Risk Score Stratification
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">Algorithmic multi-factor surveillance across all works:</p>

                  <div className="space-y-2.5">
                    <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full bg-emerald-600" />
                        <div>
                          <strong className="text-slate-900 text-xs block">Low Risk (0-30)</strong>
                          <span className="text-[11px] text-slate-600">On schedule, benchmark compliant works</span>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <strong className="text-slate-900 text-xs block">9,480</strong>
                        <span className="text-[10px] text-emerald-800 font-bold">73.8%</span>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full bg-amber-500" />
                        <div>
                          <strong className="text-slate-900 text-xs block">Moderate Risk (31-60)</strong>
                          <span className="text-[11px] text-slate-600">Minor progress delay or cost deviation</span>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <strong className="text-slate-900 text-xs block">2,114</strong>
                        <span className="text-[10px] text-amber-800 font-bold">16.5%</span>
                      </div>
                    </div>

                    <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full bg-orange-600" />
                        <div>
                          <strong className="text-slate-900 text-xs block">High Risk (61-80)</strong>
                          <span className="text-[11px] text-slate-600">Divergence between funds and civil work</span>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <strong className="text-slate-900 text-xs block">1,161</strong>
                        <span className="text-[10px] text-orange-900 font-bold">9%</span>
                      </div>
                    </div>

                    <div className="p-3 bg-red-50/70 border border-red-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full bg-red-700 animate-pulse" />
                        <div>
                          <strong className="text-slate-900 text-xs block">Critical Alerts (81-100)</strong>
                          <span className="text-[11px] text-slate-600">Severe benchmark overrun or duplicate warning</span>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <strong className="text-red-900 text-xs block font-extrabold">87</strong>
                        <span className="text-[10px] text-red-800 font-bold">0.7%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-600 font-mono font-semibold">87 Critical Outliers</span>
                  <button
                    onClick={onNavigateToAlerts}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Inspect Critical Cases</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== TAB 4: STATE COMPARISON ===== */}
        {activeTab === "stateComparison" && (
          <motion.div
            key="stateComparison"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    All India State-by-State Comparative Matrix
                  </h3>
                  <p className="text-xs text-slate-500">Comprehensive fund absorption, completion rates, and average risk indices across states:</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Sort metric:</span>
                  <select
                    value={sortOption}
                    onChange={e => setSortOption(e.target.value as SortOption)}
                    className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded text-xs font-semibold text-slate-700"
                  >
                    <option value="expenditure">Spent Funds (High to Low)</option>
                    <option value="completion">Completion Rate (%)</option>
                    <option value="risk">Safest Compliance</option>
                  </select>
                </div>
              </div>

              {/* State Comparative Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                      <th className="p-3">State / UT</th>
                      <th className="p-3">Total Works</th>
                      <th className="p-3">Sanctioned (₹ Cr)</th>
                      <th className="p-3">Actual Spent (₹ Cr)</th>
                      <th className="p-3">Completion Rate</th>
                      <th className="p-3">Avg Risk Score</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {comparativeStateData.map((st, idx) => (
                      <tr key={`${st.name}-${idx}`} className="hover:bg-blue-50/40 transition-colors">
                        <td className="p-3 font-sans font-bold text-slate-900">{st.name}</td>
                        <td className="p-3 text-slate-700">{st.works.toLocaleString()}</td>
                        <td className="p-3 text-slate-700">₹{st.sanctioned} Cr</td>
                        <td className="p-3 font-bold text-slate-900">₹{st.spent} Cr</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-700 font-bold">{st.completion}%</span>
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${st.completion}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            st.riskScore > 50 ? "bg-amber-100 text-amber-900 border border-amber-300" : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          }`}>
                            {st.riskScore} / 100
                          </span>
                        </td>
                        <td className="p-3 font-sans">
                          <button
                            onClick={() => onSelectState && onSelectState(st.name)}
                            className="text-blue-700 hover:text-blue-900 font-bold text-xs flex items-center gap-0.5 cursor-pointer"
                          >
                            Inspect <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== TAB 5: PUBLIC AMENITIES ===== */}
        {activeTab === "publicAmenities" && (
          <motion.div
            key="publicAmenities"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {/* Header & Filter */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-600" />
                  Public Amenities Sector Breakdown &amp; Direct Citizen Impact
                </h3>
                <p className="text-xs text-slate-500">Expenditure allocation and delivery metrics across 6 key public infrastructure domains:</p>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter amenity category..."
                  value={amenitySearch}
                  onChange={e => setAmenitySearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-52"
                />
              </div>
            </div>

            {/* SECTOR CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {amenitiesSectorData
                .filter(sec => sec.category.toLowerCase().includes(amenitySearch.toLowerCase()))
                .map((sec) => (
                  <div key={sec.category} className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4 hover:border-slate-300 transition-all">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: sec.color }} />
                        <h4 className="font-bold text-slate-900 text-sm">{sec.category}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                        ₹{sec.expenditure} Cr
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="bg-slate-50 p-2 rounded border border-slate-100">
                        <span className="text-[10px] text-slate-500 block">Executed Works</span>
                        <strong className="text-slate-900 text-sm">{sec.works} Works</strong>
                      </div>
                      <div className="bg-slate-50 p-2 rounded border border-slate-100">
                        <span className="text-[10px] text-slate-500 block">Avg Completion</span>
                        <strong className="text-emerald-700 text-sm">{sec.completion}%</strong>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-medium">Public Impact Index:</span>
                        <span className="font-mono font-bold text-slate-900">{sec.impactScore} / 100</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-blue-900 rounded-full" style={{ width: `${sec.impactScore}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
