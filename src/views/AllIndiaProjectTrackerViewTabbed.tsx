import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Download,
  Filter,
  Eye,
  RefreshCw,
  Zap,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Info,
  MapIcon,
  AlertCircle,
  Globe,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  ScatterChart,
  Scatter,
} from "recharts";
import { Language } from "../types";
import { getTranslation } from "../data/translations";

interface AllIndiaProjectTrackerViewTabbedProps {
  language?: Language;
}

export const AllIndiaProjectTrackerViewTabbed: React.FC<
  AllIndiaProjectTrackerViewTabbedProps
> = ({ language = "en" }) => {
  const isHindi = language === "hi";
  const t = getTranslation(language as Language);
  const [activeTab, setActiveTab] = useState<"overview" | "mpFund" | "risk" | "states">("overview");
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    setAnimationComplete(true);
  }, []);

  // ==================== DATA ====================

  const mpRecommendedData = [
    { state: "Uttar Pradesh", recommended: 5.2, actual: 4.8 },
    { state: "Maharashtra", recommended: 4.1, actual: 3.2 },
    { state: "Nagpur (MP)", recommended: 3.8, actual: 3.1 },
    { state: "Chhattisgarh", recommended: 2.9, actual: 2.5 },
    { state: "Odisha (MP)", recommended: 3.5, actual: 2.8 },
    { state: "Manipur", recommended: 2.1, actual: 1.8 },
  ];

  const projectRiskData = [
    { name: isHindi ? "कम जोखिम" : "Low Risk", value: 7381, fill: "#10B981" },
    { name: isHindi ? "मध्यम जोखिम" : "Moderate Risk", value: 3844, fill: "#F59E0B" },
    { name: isHindi ? "उच्च जोखिम" : "High Risk", value: 985, fill: "#EF4444" },
    { name: isHindi ? "गंभीर जोखिम" : "Critical", value: 632, fill: "#7C2D12" },
  ];

  const anomalyData = [
    { category: isHindi ? "कीमत मुद्रास्फीति" : "Cost Inflation", flagged: 412, resolved: 289 },
    { category: isHindi ? "प्रगति विलंब" : "Progress Lag", flagged: 368, resolved: 234 },
    { category: isHindi ? "समय स्लिप" : "Timeline Slip", flagged: 324, resolved: 186 },
    { category: isHindi ? "डुप्लिकेट जोखिम" : "Duplicate Risk", flagged: 144, resolved: 96 },
  ];

  const amenitiesData = [
    { name: isHindi ? "पीने का पानी" : "Drinking Water", value: 28.5 },
    { name: isHindi ? "ग्रामीण सड़कें" : "Rural Roads", value: 24.3 },
    { name: isHindi ? "शिक्षा" : "Education", value: 18.7 },
    { name: isHindi ? "स्वास्थ्य सेवा" : "Healthcare", value: 14.2 },
    { name: isHindi ? "अन्य" : "Others", value: 14.3 },
  ];

  const stateComparisonData = [
    { state: "Uttar Pradesh", sanctioned: 24, actual: 18.4, completion: 82, riskScore: 68 },
    { state: "Maharashtra", sanctioned: 18, actual: 14.2, completion: 78, riskScore: 52 },
    { state: "Bihar", sanctioned: 14, actual: 11.8, completion: 65, riskScore: 74 },
    { state: "Rajasthan", sanctioned: 16, actual: 12.5, completion: 71, riskScore: 48 },
    { state: "Tamil Nadu", sanctioned: 12, actual: 9.6, completion: 88, riskScore: 34 },
    { state: "Gujarat", sanctioned: 11, actual: 7.1, completion: 91, riskScore: 31 },
  ];

  const constituencyData = [
    { constituency: "Varanasi (UP)", allocated: 5.0, recommended: 4.8, sanctioned: 4.5, spent: 3.8, completion: 85 },
    { constituency: "Ghaziabad (UP)", allocated: 5.0, recommended: 4.2, sanctioned: 4.0, spent: 3.2, completion: 72 },
    { constituency: "Nagpur (MH)", allocated: 5.0, recommended: 3.8, sanctioned: 3.5, spent: 3.1, completion: 68 },
    { constituency: "Coimbatore (TN)", allocated: 5.0, recommended: 4.5, sanctioned: 4.2, spent: 4.0, completion: 90 },
    { constituency: "Patna Sahib (BR)", allocated: 5.0, recommended: 3.2, sanctioned: 2.8, spent: 2.45, completion: 49 },
    { constituency: "Ahmedabad (GJ)", allocated: 5.0, recommended: 4.1, sanctioned: 4.0, spent: 3.5, completion: 85 },
  ];

  // ==================== STAT CARD ====================

  const StatCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
    <div
      className={`bg-white rounded-xl p-6 border-l-4 shadow-md hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
        animationComplete ? "opacity-100" : "opacity-0"
      }`}
      style={{ borderLeftColor: color, animationDelay: `${Math.random() * 0.3}s` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-600 font-medium">{title}</p>
          <p className="text-[28px] font-bold text-slate-900 mt-2">{value}</p>
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );

  // ==================== CHART CARD ====================

  const ChartCard = ({ title, subtitle, children, icon: Icon }: any) => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 hover:shadow-lg transition-all duration-300 animate-in fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-[#1B3A7A]" />
            </div>
          )}
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
      {children}
    </div>
  );

  // ==================== TAB BUTTON ====================

  const TabButton = ({ tab, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all duration-200 ${
        activeTab === tab
          ? "bg-blue-600 text-white shadow-md"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  // ==================== RENDER ====================

  return (
    <div className="space-y-6 bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8 rounded-2xl">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
              {isHindi ? "राष्ट्रीय दृश्य विश्लेषण" : "NATIONAL VISUAL ANALYTICS"}
            </span>
          </div>
          <h1 className="text-[32px] font-black text-slate-900">
            {isHindi
              ? "MPLADS निधि प्रवाह, सदस्य गतिविधि और राज्य जोखिम"
              : "MPLADS Fund Flow, Member Activity & State Risk Diagrams"}
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            {isHindi
              ? "कक्षा विश्लेषण दिखाता है कि संसद सदस्य अपने ₹5 Cr वार्षिक कोटा, वास्तविक जोखिम सतर्कताओं और राज्य-दर-राज्य वितरण को कैसे उपयोग करते हैं।"
              : "Clear graphic breakdown showing how Members of Parliament utilize their ₹5 Cr annual quota, real-time risk alerts, and state-by-state delivery."}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold text-sm hover:bg-blue-100 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            {isHindi ? "डाउनलोड" : "Download"}
          </button>
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            {isHindi ? "फ़िल्टर" : "Filter"}
          </button>
        </div>
      </div>

      {/* INFO BOX */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900 text-sm">
            {isHindi ? "नागरिक मार्गदर्शिका: MPLADS कैसे काम करता है?" : "Citizen Guide: How does MPLADS work?"}
          </p>
          <p className="text-blue-800 text-xs mt-1">
            {isHindi
              ? "प्रत्येक संसद सदस्य को ₹5 करोड़ वार्षिक कोटा प्राप्त है स्थानीय विकास कार्यों (पीने का पानी, सड़कें, स्कूल) की अनुशंसा करने के लिए। जिला कलेक्टर कार्य को मंजूरी देते और नियंत्रित करते हैं।"
              : "Each Member of Parliament receives ₹5 Crore/year to recommend local developmental works (drinking water, roads, schools). The District Collector sanctions and audits the work."}
          </p>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex flex-wrap gap-2 p-4 bg-white rounded-xl border border-slate-200">
        <TabButton
          tab="overview"
          label={isHindi ? "सारांश" : "Overview"}
          icon={BarChart3}
        />
        <TabButton
          tab="mpFund"
          label={isHindi ? "MP निधि उपयोग" : "MP Fund Use"}
          icon={TrendingUp}
        />
        <TabButton
          tab="risk"
          label={isHindi ? "जोखिम और विसंगतियां" : "Risk & Anomalies"}
          icon={AlertTriangle}
        />
        <TabButton
          tab="states"
          label={isHindi ? "राज्य तुलना" : "State Comparison"}
          icon={Globe}
        />
      </div>

      {/* ==================== OVERVIEW TAB ==================== */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* STATS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <StatCard
              title={isHindi ? "MP अनुशंसित" : "MP Recommended"}
              value="₹85 Cr"
              subtitle={isHindi ? "तुलना में वास्तविक व्यय" : "vs Actual Spent"}
              icon={TrendingUp}
              color="#1B3A7A"
            />
            <StatCard
              title={isHindi ? "परियोजना जोखिम स्तर" : "Project Risk Levels"}
              value="12,842"
              subtitle={isHindi ? "कार्य निगरानी अधीन" : "Works monitored"}
              icon={AlertTriangle}
              color="#E31E24"
            />
            <StatCard
              title={isHindi ? "सार्वजनिक सुविधाएं" : "Public Amenities"}
              value="6"
              subtitle={isHindi ? "क्षेत्र श्रेणियां" : "Sector categories"}
              icon={CheckCircle2}
              color="#047A1E"
            />
            <StatCard
              title={isHindi ? "उच्च जोखिम कार्य" : "Highest Risk Works"}
              value="₹24.6 Cr"
              subtitle={isHindi ? "82% औसत पूर्ण" : "82% Avg Complete"}
              icon={MapPin}
              color="#FF6B00"
            />
          </div>

          {/* CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* MP Recommended vs Actual */}
            <ChartCard
              title={isHindi ? "MP अनुशंसित बनाम वास्तविक व्यय (₹ Cr)" : "MP Recommended vs Actual Spend (₹ Cr)"}
              subtitle={isHindi ? "तुलना अध्ययन द्वारा प्रमुख काज" : "Comparative study by Top MPs"}
              icon={BarChartIcon}
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={mpRecommendedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="state" angle={-45} textAnchor="end" height={80} interval={0} tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="recommended" fill="#1B3A7A" radius={[8, 8, 0, 0]} animationDuration={1000} />
                  <Bar dataKey="actual" fill="#FF6B00" radius={[8, 8, 0, 0]} animationDuration={1000} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Project Risk Levels */}
            <ChartCard
              title={isHindi ? "परियोजना जोखिम स्तर (12,842 कार्य)" : "Project Risk Levels (12,842 works)"}
              subtitle={isHindi ? "73.8% कार्य हरी सुरक्षा क्षेत्र में" : "73.8% works in green safety zone"}
              icon={PieChartIcon}
            >
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={projectRiskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1000}
                  >
                    {projectRiskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {projectRiskData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-slate-700 text-xs">{item.name}: {item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {/* ==================== MP FUND USE TAB ==================== */}
      {activeTab === "mpFund" && (
        <div className="space-y-6">
          {/* CONSTITUENCY FUND ALLOCATION */}
          <ChartCard
            title={isHindi ? "सदस्य संसद निधि आवंटन और कार्य अनुशंसा खाता (₹5 करोड़ कोटा बेंचमार्क)" : "Member of Parliament Fund Allocation & Work Recommendation Ledger (₹5.00 CR Quota Benchmark)"}
            subtitle={isHindi ? "Lok Sabha और Rajya Sabha भर में प्रत्येक सदस्य के ₹5 करोड़ कोटा उपयोग का पारदर्शी विश्लेषण" : "Transparent breakdown of ₹5 Cr quota utilization per Member across Lok Sabha and Rajya Sabha"}
            icon={BarChartIcon}
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={constituencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="constituency" angle={-45} textAnchor="end" height={100} interval={0} tick={{ fontSize: 11 }} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(value) => `₹${value} Cr`}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Bar dataKey="allocated" fill="#E0E7FF" radius={[8, 8, 0, 0]} animationDuration={1000} />
                <Bar dataKey="recommended" fill="#818CF8" radius={[8, 8, 0, 0]} animationDuration={1000} />
                <Bar dataKey="sanctioned" fill="#3730A3" radius={[8, 8, 0, 0]} animationDuration={1000} />
                <Bar dataKey="spent" fill="#1B3A7A" radius={[8, 8, 0, 0]} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* CONSTITUENCY DETAILS */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
            <h3 className="font-bold text-slate-900 text-lg mb-4">{isHindi ? "संभ्रमण विवरण" : "Constituency Details"}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">{isHindi ? "संभ्रमण" : "Constituency"}</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-700">{isHindi ? "आवंटित (₹ Cr)" : "Allocated (₹ Cr)"}</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-700">{isHindi ? "अनुशंसित" : "Recommended"}</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-700">{isHindi ? "व्यय (₹ Cr)" : "Spent (₹ Cr)"}</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-700">{isHindi ? "पूर्ण%" : "Completion %"}</th>
                  </tr>
                </thead>
                <tbody>
                  {constituencyData.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-blue-50 transition-colors">
                      <td className="py-3 px-4 text-slate-900">{row.constituency}</td>
                      <td className="py-3 px-4 text-right text-slate-700">{row.allocated}</td>
                      <td className="py-3 px-4 text-right text-slate-700">{row.recommended}</td>
                      <td className="py-3 px-4 text-right text-slate-900 font-semibold">{row.spent}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          row.completion >= 80 ? "bg-green-100 text-green-700" :
                          row.completion >= 60 ? "bg-amber-100 text-amber-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {row.completion}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* HOUSE FILTER BUTTONS */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 flex items-center justify-between">
            <h4 className="font-semibold text-slate-900">{isHindi ? "हाउस:" : "House:"}</h4>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition-colors">
                {isHindi ? "सभी हाउस" : "All Houses"}
              </button>
              <button className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-200 transition-colors">
                {isHindi ? "लोक सभा" : "Lok Sabha"}
              </button>
              <button className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-200 transition-colors">
                {isHindi ? "राज्य सभा" : "Rajya Sabha"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== RISK & ANOMALIES TAB ==================== */}
      {activeTab === "risk" && (
        <div className="space-y-6">
          {/* STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title={isHindi ? "कीमत मुद्रास्फीति" : "Cost Inflation"}
              value="412"
              subtitle={isHindi ? "अनुमानित प्रभाव: ₹14.8 करोड़" : "Estimated Impact: ₹14.8 Cr"}
              icon={AlertTriangle}
              color="#FF6B00"
            />
            <StatCard
              title={isHindi ? "प्रगति विलंब" : "Progress Lag"}
              value="368"
              subtitle={isHindi ? "अनुमानित प्रभाव: ₹11.2 करोड़" : "Estimated Impact: ₹11.2 Cr"}
              icon={AlertTriangle}
              color="#E31E24"
            />
            <StatCard
              title={isHindi ? "समय स्लिप" : "Timeline Slip"}
              value="324"
              subtitle={isHindi ? "अनुमानित प्रभाव: ₹9.5 करोड़" : "Estimated Impact: ₹9.5 Cr"}
              icon={AlertTriangle}
              color="#EF4444"
            />
            <StatCard
              title={isHindi ? "डुप्लिकेट जोखिम" : "Duplicate Risk"}
              value="144"
              subtitle={isHindi ? "अनुमानित प्रभाव: ₹4.8 करोड़" : "Estimated Impact: ₹4.8 Cr"}
              icon={AlertCircle}
              color="#7C2D12"
            />
          </div>

          {/* ANOMALY RESOLUTION CHART */}
          <ChartCard
            title={isHindi ? "प्राथमिक विसंगति श्रेणियां और समाधान वेग" : "Primary Anomaly Categories & Resolution Velocity"}
            subtitle={isHindi ? "भौतिक निरीक्षण के दौरान सत्यापित और समाधान किए गए कुल फ्लैग किए गए विसंगति मामले" : "Total flagged anomaly cases verified and resolved during physical inspections"}
            icon={AlertTriangle}
          >
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={anomalyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 11 }} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Bar dataKey="flagged" fill="#EF4444" radius={[8, 8, 0, 0]} animationDuration={1000} />
                <Bar dataKey="resolved" fill="#10B981" radius={[8, 8, 0, 0]} animationDuration={1000} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* RISK STRATIFICATION */}
          <ChartCard
            title={isHindi ? "जोखिम स्कोर स्तरीकरण" : "Risk Score Stratification"}
            subtitle={isHindi ? "सभी कार्यों में बहु-कारक निगरानी" : "Multi-factor surveillance across all works"}
            icon={AlertTriangle}
          >
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={projectRiskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1000}
                >
                  {projectRiskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {projectRiskData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-slate-700 text-xs">{item.name}: {item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* CRITICAL CASES BUTTON */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900 text-lg">{isHindi ? "87 गंभीर बाहरी" : "87 Critical Outliers"}</h4>
              <p className="text-sm text-slate-600 mt-1">{isHindi ? "गंभीर बेंचमार्क अधिकतम या डुप्लिकेट चेतावनी" : "Severe benchmark overrun or duplicate warning"}</p>
            </div>
            <button className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {isHindi ? "गंभीर मामले निरीक्षण करें" : "Inspect Critical Cases"}
            </button>
          </div>
        </div>
      )}

      {/* ==================== STATE COMPARISON TAB ==================== */}
      {activeTab === "states" && (
        <div className="space-y-6">
          {/* STATE COMPARISON CHART */}
          <ChartCard
            title={isHindi ? "सभी राज्यों की व्यापक प्रदर्शन चार्ट" : "All-States Comprehensive Performance Chart"}
            subtitle={isHindi ? "प्रमाणित व्यय, कार्य सूचीबद्ध और पूर्णता प्रतिशत" : "Certified expenditure, works cataloged, and completion percentages"}
            icon={LineChartIcon}
          >
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={stateComparisonData} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
                <defs>
                  <linearGradient id="colorSanctioned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B3A7A" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1B3A7A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="state" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value) => `₹${value} Cr`}
                />
                <Legend />
                <Area type="monotone" dataKey="sanctioned" stroke="#1B3A7A" strokeWidth={2} fillOpacity={1} fill="url(#colorSanctioned)" animationDuration={1000} />
                <Area type="monotone" dataKey="actual" stroke="#FF6B00" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* STATE CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stateComparisonData.map((state, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-slate-900">{state.state}</h4>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    state.riskScore <= 40 ? "bg-green-100 text-green-700" :
                    state.riskScore <= 60 ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {isHindi ? "जोखिम:" : "Risk:"} {state.riskScore}/100
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">{isHindi ? "अनुमोदित:" : "Sanctioned:"}</span>
                    <span className="font-semibold text-slate-900">₹{state.sanctioned} Cr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{isHindi ? "व्यय:" : "Spent:"}</span>
                    <span className="font-semibold text-slate-900">₹{state.actual} Cr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{isHindi ? "पूर्णता:" : "Completion:"}</span>
                    <span className="font-semibold text-slate-900">{state.completion}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SORT DROPDOWN */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 flex items-center justify-between">
            <h4 className="font-semibold text-slate-900">{isHindi ? "छांटें:" : "Sort by:"}</h4>
            <select className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:border-slate-400 transition-colors">
              <option>{isHindi ? "सर्वोच्च व्यय" : "Highest Expenditure"}</option>
              <option>{isHindi ? "उच्चतम पूर्णता" : "Highest Completion"}</option>
              <option>{isHindi ? "न्यूनतम जोखिम" : "Lowest Risk"}</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
