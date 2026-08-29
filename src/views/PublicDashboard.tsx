import React, { useState } from "react";
import {
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  PieChart,
  BarChart3,
  Download,
  RefreshCw,
  Info,
  Search,
  Filter,
} from "lucide-react";
import { Language } from "../types";
import { getTranslation } from "../data/translations";

interface PublicDashboardProps {
  language?: Language;
}

export const PublicDashboard: React.FC<PublicDashboardProps> = ({ language = "en" }) => {
  const isHindi = language === "hi";
  const t = getTranslation(language as Language);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock data - Replace with API calls
  const metrics = [
    {
      label: isHindi ? "कुल परियोजनाएं" : "Total Projects",
      value: "8,547",
      change: "+12%",
      icon: TrendingUp,
      color: "blue",
    },
    {
      label: isHindi ? "कुल व्यय" : "Total Expenditure",
      value: "₹45,230 Cr",
      change: "+8.5%",
      icon: DollarSign,
      color: "green",
    },
    {
      label: isHindi ? "पूर्ण परियोजनाएं" : "Completed",
      value: "3,421",
      change: "+5%",
      icon: CheckCircle2,
      color: "emerald",
    },
    {
      label: isHindi ? "चेतावनी" : "Alerts",
      value: "234",
      change: "-3%",
      icon: AlertCircle,
      color: "amber",
    },
  ];

  const stateData = [
    { name: isHindi ? "उत्तर प्रदेश" : "Uttar Pradesh", projects: 412, status: "on-track" },
    { name: isHindi ? "महाराष्ट्र" : "Maharashtra", projects: 387, status: "delayed" },
    { name: isHindi ? "तमिलनाडु" : "Tamil Nadu", projects: 356, status: "on-track" },
    { name: isHindi ? "कर्नाटक" : "Karnataka", projects: 334, status: "at-risk" },
    { name: isHindi ? "बिहार" : "Bihar", projects: 312, status: "on-track" },
  ];

  const getStatusBadge = (status: string) => {
    const statuses = {
      "on-track": { label: isHindi ? "सही पटरी पर" : "On Track", color: "bg-green-100 text-green-800" },
      delayed: { label: isHindi ? "विलंबित" : "Delayed", color: "bg-amber-100 text-amber-800" },
      "at-risk": { label: isHindi ? "जोखिम में" : "At Risk", color: "bg-red-100 text-red-800" },
    };
    return statuses[status as keyof typeof statuses] || statuses["on-track"];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Tricolor Header */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808]" />

      {/* Page Header */}
      <header className="bg-white border-b border-slate-200 py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900">
            {isHindi ? "राष्ट्रीय सारांश" : "National Overview"}
          </h1>
          <p className="text-slate-600 mt-1">
            {isHindi ? "सांसद निधि परियोजनाओं का वास्तविक समय सारांश" : "Real-time summary of MPLADS projects"}
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Key Metrics Cards */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, idx) => {
              const Icon = metric.icon;
              const colorClasses = {
                blue: "bg-blue-50 border-blue-200 text-blue-600",
                green: "bg-green-50 border-green-200 text-green-600",
                emerald: "bg-emerald-50 border-emerald-200 text-emerald-600",
                amber: "bg-amber-50 border-amber-200 text-amber-600",
              };
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-lg border-2 ${colorClasses[metric.color as keyof typeof colorClasses]}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{metric.label}</p>
                      <p className="text-2xl font-bold text-slate-900 mt-2">{metric.value}</p>
                      <p className="text-xs font-semibold text-green-600 mt-2">{metric.change}</p>
                    </div>
                    <Icon className="w-8 h-8 opacity-20" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Charts Section */}
        <section className="grid md:grid-cols-2 gap-6">
          {/* Progress by Status */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              {isHindi ? "परियोजना स्थिति" : "Project Status Distribution"}
            </h2>
            <div className="space-y-3">
              {[
                {
                  label: isHindi ? "पूर्ण" : "Completed",
                  count: 3421,
                  percent: 40,
                  color: "bg-green-500",
                },
                {
                  label: isHindi ? "प्रगति में" : "In Progress",
                  count: 3698,
                  percent: 43,
                  color: "bg-blue-500",
                },
                {
                  label: isHindi ? "विलंबित" : "Delayed",
                  count: 892,
                  percent: 10,
                  color: "bg-amber-500",
                },
                {
                  label: isHindi ? "रुकी हुई" : "Stalled",
                  count: 536,
                  percent: 7,
                  color: "bg-red-500",
                },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                    <span className="text-sm font-bold text-slate-900">
                      {item.count.toLocaleString()} ({item.percent}%)
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              {isHindi ? "शीर्ष श्रेणियां" : "Top Categories"}
            </h2>
            <div className="space-y-3">
              {[
                { name: isHindi ? "शिक्षा" : "Education", count: 2145 },
                { name: isHindi ? "स्वास्थ्य" : "Health", count: 1876 },
                { name: isHindi ? "अवसंरचना" : "Infrastructure", count: 1654 },
                { name: isHindi ? "जल संसाधन" : "Water Resources", count: 1243 },
                { name: isHindi ? "कृषि" : "Agriculture", count: 987 },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">{item.name}</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-semibold">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* State-wise Performance */}
        <section className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              {isHindi ? "राज्य-वार प्रदर्शन" : "State-wise Performance"}
            </h2>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded">
              <RefreshCw className="w-4 h-4" />
              {isHindi ? "ताज़ा करें" : "Refresh"}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">
                    {isHindi ? "राज्य" : "State"}
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">
                    {isHindi ? "परियोजनाएं" : "Projects"}
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">
                    {isHindi ? "स्थिति" : "Status"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {stateData.map((state, idx) => {
                  const statusInfo = getStatusBadge(state.status);
                  return (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4 font-medium text-slate-900">{state.name}</td>
                      <td className="py-4 px-4 text-right text-slate-700 font-semibold">
                        {state.projects}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-3 py-1 rounded text-xs font-semibold ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Alerts */}
        <section className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            {isHindi ? "हाल ही की चेतावनियां" : "Recent Alerts"}
          </h2>
          <div className="space-y-3">
            {[
              {
                msg: isHindi
                  ? "महाराष्ट्र में 45 परियोजनाएं विलंबित हैं"
                  : "45 projects delayed in Maharashtra",
              },
              {
                msg: isHindi
                  ? "बिहार में लागत में 23% वृद्धि"
                  : "23% cost overrun in Bihar projects",
              },
              {
                msg: isHindi
                  ? "तमिलनाडु में डुप्लिकेट कार्य पहचाने गए"
                  : "Duplicate works detected in Tamil Nadu",
              },
            ].map((alert, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded border border-amber-100">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-700">{alert.msg}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-50 border border-blue-200 hover:border-blue-400 rounded-lg text-left transition-all">
            <Search className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-semibold text-slate-900">
              {isHindi ? "परियोजना खोजें" : "Find Project"}
            </h3>
            <p className="text-sm text-slate-600">
              {isHindi ? "कार्य ID द्वारा खोजें" : "Search by work ID"}
            </p>
          </button>
          <button className="p-4 bg-green-50 border border-green-200 hover:border-green-400 rounded-lg text-left transition-all">
            <Download className="w-6 h-6 text-green-600 mb-2" />
            <h3 className="font-semibold text-slate-900">
              {isHindi ? "रिपोर्ट डाउनलोड" : "Download Report"}
            </h3>
            <p className="text-sm text-slate-600">
              {isHindi ? "PDF निर्यात" : "Export as PDF"}
            </p>
          </button>
          <button className="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 rounded-lg text-left transition-all">
            <Info className="w-6 h-6 text-slate-600 mb-2" />
            <h3 className="font-semibold text-slate-900">
              {isHindi ? "अधिक जानकारी" : "Learn More"}
            </h3>
            <p className="text-sm text-slate-600">
              {isHindi ? "दिशानिर्देश पढ़ें" : "Read guidelines"}
            </p>
          </button>
        </section>
      </main>
    </div>
  );
};
