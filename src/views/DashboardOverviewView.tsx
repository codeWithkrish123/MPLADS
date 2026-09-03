import React, { useState } from "react";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Building2,
  MapPin,
  Download,
  Filter,
  Eye,
  RefreshCw,
  Zap,
  Clock,
  FileSpreadsheet,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Language } from "../types";
import { getTranslation } from "../data/translations";

interface DashboardOverviewViewProps {
  language?: Language;
}

export const DashboardOverviewView: React.FC<DashboardOverviewViewProps> = ({
  language = "en",
}) => {
  const isHindi = language === "hi";
  const t = getTranslation(language as Language);
  const [activeTab, setActiveTab] = useState("overview");

  // ==================== DATA ====================

  const kpiData = [
    { title: isHindi ? "कुल कार्य" : "Total Works", value: "12,842", subtitle: isHindi ? "निगरानी अधीन" : "Monitored", change: "+4.2%", trend: "up", color: "#1B3A7A" },
    { title: isHindi ? "कुल व्यय" : "Total Expenditure", value: "₹82.4 Cr", subtitle: isHindi ? "स्वीकृत राशि" : "Sanctioned", change: "+8.1%", trend: "up", color: "#FF6B00" },
    { title: isHindi ? "जोखिम संकेत" : "Risk Signals", value: "1,248", subtitle: isHindi ? "गंभीर मुद्दे" : "Critical Issues", change: "-2.4%", trend: "down", color: "#E31E24" },
    { title: isHindi ? "महत्वपूर्ण सूचनाएं" : "Critical Alerts", value: "87", subtitle: isHindi ? "तत्काल कार्रवाई" : "Immediate Action", change: "-1.8%", trend: "down", color: "#FF6B00" },
    { title: isHindi ? "विलंबित कार्य" : "Delayed Works", value: "324", subtitle: isHindi ? "समय से पीछे" : "Behind Schedule", change: "-3.2%", trend: "down", color: "#FF6B00" },
    { title: isHindi ? "औसत पूर्णता" : "Avg Completion", value: "78.4%", subtitle: isHindi ? "राष्ट्रीय औसत" : "National Avg", change: "+1.8%", trend: "up", color: "#047A1E" },
  ];

  const fundFlowData = [
    { name: "Q1", recommended: 85, actual: 72, budgeted: 90 },
    { name: "Q2", recommended: 92, actual: 81, budgeted: 95 },
    { name: "Q3", recommended: 88, actual: 76, budgeted: 92 },
    { name: "Q4", recommended: 95, actual: 88, budgeted: 100 },
    { name: "Q5", recommended: 87, actual: 79, budgeted: 91 },
    { name: "Q6", recommended: 93, actual: 85, budgeted: 97 },
  ];

  const projectRiskData = [
    { name: isHindi ? "कम जोखिम" : "Low Risk", value: 7381, fill: "#047A1E" },
    { name: isHindi ? "मध्यम जोखिम" : "Moderate Risk", value: 3844, fill: "#FF6B00" },
    { name: isHindi ? "उच्च जोखिम" : "High Risk", value: 985, fill: "#E31E24" },
    { name: isHindi ? "गंभीर जोखिम" : "Critical", value: 632, fill: "#C41E3A" },
  ];

  const amenitiesData = [
    { name: isHindi ? "जल संचय" : "Water Resources", value: 28.5 },
    { name: isHindi ? "सड़क सुधार" : "Roads", value: 24.3 },
    { name: isHindi ? "शिक्षा" : "Education", value: 18.7 },
    { name: isHindi ? "स्वास्थ्य" : "Healthcare", value: 14.2 },
    { name: isHindi ? "अन्य" : "Others", value: 14.3 },
  ];

  const workDistributionData = [
    { month: "Jan", planned: 400, completed: 240, in_progress: 160 },
    { month: "Feb", planned: 520, completed: 320, in_progress: 200 },
    { month: "Mar", planned: 480, completed: 380, in_progress: 100 },
    { month: "Apr", planned: 620, completed: 450, in_progress: 170 },
    { month: "May", planned: 580, completed: 520, in_progress: 60 },
    { month: "Jun", planned: 700, completed: 620, in_progress: 80 },
  ];

  const mpFundData = [
    { category: isHindi ? "अनुमोदित" : "Approved", value: 95 },
    { category: isHindi ? "व्यय" : "Spent", value: 78 },
    { category: isHindi ? "पूर्ण" : "Completed", value: 72 },
    { category: isHindi ? "जोखिम" : "Risk", value: 35 },
    { category: isHindi ? "विलंब" : "Delay", value: 28 },
    { category: isHindi ? "समीक्षा" : "Review", value: 82 },
  ];

  // ==================== COMPONENTS ====================

  const KPICard = ({ title, value, subtitle, change, trend, color }: any) => (
    <div className="bg-white rounded-xl p-6 shadow-md border-l-4 hover:shadow-lg transition-all duration-300" style={{ borderLeftColor: color }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-600 font-medium">{title}</p>
          <p className="text-[28px] font-bold text-slate-900 mt-2">{value}</p>
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-bold ${trend === "up" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {trend === "up" ? "↑" : "↓"} {change}
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, subtitle, children, icon: Icon }: any) => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-[#1B3A7A]" />
            </div>
          )}
          <div>
            <h3 className="font-bold text-slate-900">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      {children}
    </div>
  );

  const tabs = [
    { id: "overview", label: isHindi ? "सारांश" : "Overview", icon: Eye },
    { id: "mp-fund", label: isHindi ? "एमपी निधि" : "MP Fund", icon: Building2 },
    { id: "risk", label: isHindi ? "जोखिम" : "Risk", icon: AlertTriangle },
    { id: "state", label: isHindi ? "राज्य" : "State", icon: MapPin },
  ];

  // ==================== RENDER ====================

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-black text-slate-900">
            {isHindi ? "राष्ट्रीय बुद्धिमत्ता सारांश" : "National Intelligence Overview"}
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            {isHindi ? "वास्तविक समय MPLADS पोर्टफोलियो निगरानी" : "Real-time MPLADS portfolio monitoring"}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-red-50 text-red-700 rounded-lg font-semibold text-sm hover:bg-red-100 transition-colors flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            87 {isHindi ? "महत्वपूर्ण" : "Critical"}
          </button>
          <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold text-sm hover:bg-blue-100 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            {isHindi ? "रिपोर्ट" : "Report"}
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpiData.map((kpi, idx) => (
          <KPICard key={idx} title={kpi.title} value={kpi.value} subtitle={kpi.subtitle} change={kpi.change} trend={kpi.trend} color={kpi.color} />
        ))}
      </div>

      {/* TABS */}
      <div className="bg-white rounded-xl shadow-sm p-1 flex items-center gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? "bg-[#1B3A7A] text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* CONTENT */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <ChartCard title={isHindi ? "एमपी अनुशंसित बनाम वास्तविक" : "MP Recommended vs Actual"} icon={TrendingUp}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fundFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff" }} />
                <Legend />
                <Bar dataKey="recommended" fill="#1B3A7A" radius={[8, 8, 0, 0]} />
                <Bar dataKey="actual" fill="#FF6B00" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title={isHindi ? "परियोजना जोखिम स्तर" : "Project Risk Levels"} icon={AlertTriangle}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={projectRiskData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {projectRiskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title={isHindi ? "सार्वजनिक सुविधाएं" : "Public Amenities"} icon={Building2}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={amenitiesData} layout="vertical" margin={{ top: 5, right: 30, left: 150, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#9CA3AF" />
                  <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={140} />
                  <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff" }} />
                  <Bar dataKey="value" fill="#1B3A7A" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <ChartCard title={isHindi ? "समय के साथ कार्य वितरण" : "Work Distribution Over Time"} icon={TrendingUp}>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={workDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff" }} />
                <Legend />
                <Area type="monotone" dataKey="planned" stackId="1" stroke="#1B3A7A" fill="#1B3A7A" fillOpacity={0.8} />
                <Area type="monotone" dataKey="completed" stackId="1" stroke="#047A1E" fill="#047A1E" fillOpacity={0.8} />
                <Area type="monotone" dataKey="in_progress" stackId="1" stroke="#FF6B00" fill="#FF6B00" fillOpacity={0.8} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {activeTab === "mp-fund" && (
        <ChartCard title={isHindi ? "एमपी निधि वितरण" : "MP Fund Distribution"} icon={Building2}>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={mpFundData}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis dataKey="category" stroke="#9CA3AF" />
              <PolarRadiusAxis stroke="#9CA3AF" />
              <Radar name={isHindi ? "एमपी निधि" : "MP Fund"} dataKey="value" stroke="#1B3A7A" fill="#1B3A7A" fillOpacity={0.6} />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff" }} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {activeTab === "risk" && (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900">{isHindi ? "जोखिम विश्लेषण" : "Risk Analysis"}</h3>
          <p className="text-slate-600 mt-2">{isHindi ? "जोखिम विश्लेषण यहां प्रदर्शित होगा" : "Risk analysis will be displayed here"}</p>
        </div>
      )}

      {activeTab === "state" && (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
          <MapPin className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900">{isHindi ? "राज्य तुलना" : "State Comparison"}</h3>
          <p className="text-slate-600 mt-2">{isHindi ? "राज्य तुलना यहां प्रदर्शित होगी" : "State comparison will be displayed here"}</p>
        </div>
      )}
    </div>
  );
};
