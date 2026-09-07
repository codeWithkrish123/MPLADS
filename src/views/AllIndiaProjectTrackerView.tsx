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
} from "recharts";
import { Language } from "../types";
import { getTranslation } from "../data/translations";

interface AllIndiaProjectTrackerProps {
  language?: Language;
}

export const AllIndiaProjectTracker: React.FC<AllIndiaProjectTrackerProps> = ({
  language = "en",
}) => {
  const isHindi = language === "hi";
  const t = getTranslation(language as Language);
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

  const amenitiesData = [
    { name: isHindi ? "पीने का पानी" : "Drinking Water", value: 28.5 },
    { name: isHindi ? "ग्रामीण सड़कें" : "Rural Roads", value: 24.3 },
    { name: isHindi ? "शिक्षा" : "Education", value: 18.7 },
    { name: isHindi ? "स्वास्थ्य सेवा" : "Healthcare", value: 14.2 },
    { name: isHindi ? "अन्य" : "Others", value: 14.3 },
  ];

  const stateComparisonData = [
    { state: "Uttar Pradesh", sanctioned: 24, completion: 82 },
    { state: "Maharashtra", sanctioned: 18, completion: 78 },
    { state: "Bihar", sanctioned: 14, completion: 65 },
    { state: "Rajasthan", sanctioned: 16, completion: 71 },
    { state: "Tamil Nadu", sanctioned: 12, completion: 88 },
    { state: "Gujarat", sanctioned: 11, completion: 79 },
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
          <p className="font-semibold text-blue-900 text-sm">{isHindi ? "नागरिक मार्गदर्शिका: MPLADS कैसे काम करता है?" : "Citizen Guide: How does MPLADS work?"}</p>
          <p className="text-blue-800 text-xs mt-1">
            {isHindi
              ? "प्रत्येक संसद सदस्य को ₹5 करोड़ वार्षिक कोटा प्राप्त है स्थानीय विकास कार्यों (पीने का पानी, सड़कें, स्कूल) की अनुशंसा करने के लिए। जिला कलेक्टर कार्य को मंजूरी देते और नियंत्रित करते हैं।"
              : "Each Member of Parliament receives ₹5 Crore/year to recommend local developmental works (drinking water, roads, schools). The District Collector sanctions and audits the work."}
          </p>
        </div>
      </div>

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
          icon={BarChart3}
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

      {/* FULL WIDTH CHARTS */}
      <ChartCard
        title={isHindi ? "तुलनात्मक राज्य व्यय और कार्य वितरण अनुपात" : "Comparative State Expenditure & Work Delivery Ratio"}
        subtitle={isHindi ? "अनुमोदित निधि बनाम वास्तविक व्यय और प्रमाणित शारीरिक पूर्णता %" : "Sanctioned funds vs actual disbursement and certified physical completion %"}
        icon={LineChartIcon}
      >
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={stateComparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="state" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" yAxisId="left" label={{ value: "Sanctioned (₹ Cr)", angle: -90, position: "insideLeft" }} />
            <YAxis
              stroke="#9CA3AF"
              yAxisId="right"
              orientation="right"
              label={{ value: "Completion %", angle: 90, position: "insideRight" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="sanctioned" fill="#1B3A7A" radius={[8, 8, 0, 0]} animationDuration={1000} />
            <Line yAxisId="right" type="monotone" dataKey="completion" stroke="#10B981" strokeWidth={3} animationDuration={1000} dot={{ fill: "#10B981", r: 5 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* AMENITIES CHART */}
      <ChartCard
        title={isHindi ? "सार्वजनिक सुविधाएं व्यय (₹ Cr)" : "Public Amenities Spend (₹ Cr)"}
        subtitle={isHindi ? "जहां सार्वजनिक निधि सीधे गांव और शहर सुविधाओं में सुधार करती है" : "Where public funds directly improve village & city facilities"}
        icon={BarChartIcon}
      >
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={amenitiesData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" stroke="#9CA3AF" />
            <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={190} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Bar dataKey="value" fill="#1B3A7A" radius={[0, 8, 8, 0]} animationDuration={1000} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* BOTTOM STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-slate-200 text-center hover:shadow-md transition-all">
          <p className="text-xs text-slate-500 mb-1 uppercase font-bold tracking-wide">Top Spending State</p>
          <p className="text-2xl font-bold text-slate-900">Uttar Pradesh</p>
          <p className="text-sm text-slate-600 mt-1">₹18.4 Cr (2,481 works)</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-slate-200 text-center hover:shadow-md transition-all">
          <p className="text-xs text-slate-500 mb-1 uppercase font-bold tracking-wide">Highest Completion</p>
          <p className="text-2xl font-bold text-slate-900">Gujarat</p>
          <p className="text-sm text-slate-600 mt-1">91.2% Certified</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-slate-200 text-center hover:shadow-md transition-all">
          <p className="text-xs text-slate-500 mb-1 uppercase font-bold tracking-wide">Safest Compliance</p>
          <p className="text-2xl font-bold text-slate-900">Tamil Nadu</p>
          <p className="text-sm text-slate-600 mt-1">Avg Risk 34/100</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-slate-200 text-center hover:shadow-md transition-all">
          <p className="text-xs text-slate-500 mb-1 uppercase font-bold tracking-wide">Audited State</p>
          <p className="text-2xl font-bold text-slate-900">Bihar</p>
          <p className="text-sm text-slate-600 mt-1">28 High-Risk works</p>
        </div>
      </div>
    </div>
  );
};
