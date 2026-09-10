/**
 * NationalOverviewView - Real-Time Data Version
 * 
 * This view displays:
 * - KPI cards calculated from real work data
 * - Charts using actual project metrics
 * - Real-time status updates
 * - Live risk analysis
 * 
 * All data comes from backend API, no hardcoded values
 */

import React, { useState, useMemo } from "react";
import {
  FileSpreadsheet,
  IndianRupee,
  AlertTriangle,
  Flame,
  Clock,
  CheckCircle2,
  TrendingUp,
  Download,
  RefreshCw,
  Activity,
} from "lucide-react";
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
} from "recharts";
import { WorkRecord, Language } from "../types";
import { MetricCard } from "../components/common/MetricCard";
import { RiskBadge } from "../components/common/RiskBadge";
import { getTranslation } from "../data/translations";

interface NationalOverviewRealTimeProps {
  works: WorkRecord[];
  loading?: boolean;
  error?: Error | null;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
  language?: Language;
}

export const NationalOverviewViewRealTime: React.FC<NationalOverviewRealTimeProps> = ({
  works = [],
  loading = false,
  error = null,
  lastUpdated = null,
  onRefresh,
  language = "en",
}) => {
  const isHindi = language === "hi";
  const t = getTranslation(language as Language);

  // Calculate all metrics from real data
  const metrics = useMemo(() => {
    if (!works || works.length === 0) {
      return {
        totalWorks: 0,
        totalBudget: 0,
        totalExpenditure: 0,
        avgProgress: 0,
        completedWorks: 0,
        ongoingWorks: 0,
        delayedWorks: 0,
        highRiskWorks: 0,
        criticalWorks: 0,
      };
    }

    const totalWorks = works.length;
    const totalBudget = works.reduce((sum, w) => sum + (parseFloat(String(w.sanctioned_cost || 0)) || 0), 0);
    const totalExpenditure = works.reduce((sum, w) => sum + (parseFloat(String(w.actual_expenditure || 0)) || 0), 0);
    const avgProgress = Math.round(works.reduce((sum, w) => sum + (parseFloat(String(w.physical_progress || 0)) || 0), 0) / works.length) || 0;

    const completedWorks = works.filter(w => w.status?.toLowerCase() === "completed").length;
    const ongoingWorks = works.filter(w => !w.status || w.status?.toLowerCase() === "in progress" || w.status?.toLowerCase() === "in_progress").length;
    const delayedWorks = works.filter(w => w.status?.toLowerCase() === "delayed").length;
    const highRiskWorks = works.filter(w => (w.risk_score || 0) > 60).length;
    const criticalWorks = works.filter(w => (w.risk_score || 0) > 80).length;

    return {
      totalWorks,
      totalBudget,
      totalExpenditure,
      avgProgress,
      completedWorks,
      ongoingWorks,
      delayedWorks,
      highRiskWorks,
      criticalWorks,
    };
  }, [works]);

  // Risk distribution chart data
  const riskDistributionData = useMemo(() => [
    {
      name: "Low Risk",
      value: works.filter(w => (w.risk_score || 0) <= 30).length,
      fill: "#047A1E",
    },
    {
      name: "Medium Risk",
      value: works.filter(w => (w.risk_score || 0) > 30 && (w.risk_score || 0) <= 60).length,
      fill: "#FF6B00",
    },
    {
      name: "High Risk",
      value: works.filter(w => (w.risk_score || 0) > 60 && (w.risk_score || 0) <= 80).length,
      fill: "#E6001A",
    },
    {
      name: "Critical",
      value: works.filter(w => (w.risk_score || 0) > 80).length,
      fill: "#8B0000",
    },
  ], [works]);

  // Work status chart data
  const workStatusData = useMemo(() => [
    {
      name: "Completed",
      count: metrics.completedWorks,
      fill: "#047A1E",
    },
    {
      name: "In Progress",
      count: metrics.ongoingWorks,
      fill: "#0066FF",
    },
    {
      name: "Delayed",
      count: metrics.delayedWorks,
      fill: "#FF6B00",
    },
  ], [metrics]);

  // Budget vs Expenditure
  const budgetData = useMemo(() => {
    if (works.length === 0) return [];
    
    // Group by state
    const stateMap = new Map<string, { budget: number; spent: number }>();
    works.forEach(work => {
      const state = work.state || "Unknown";
      if (!stateMap.has(state)) {
        stateMap.set(state, { budget: 0, spent: 0 });
      }
      const current = stateMap.get(state)!;
      current.budget += parseFloat(String(work.sanctioned_cost || 0)) || 0;
      current.spent += parseFloat(String(work.actual_expenditure || 0)) || 0;
    });

    return Array.from(stateMap.entries())
      .map(([state, data]) => ({
        state: state.substring(0, 3).toUpperCase(),
        Budget: parseFloat((data.budget / 100).toFixed(1)),
        Spent: parseFloat((data.spent / 100).toFixed(1)),
      }))
      .sort((a, b) => b.Budget - a.Budget)
      .slice(0, 6);
  }, [works]);

  // Progress distribution
  const progressData = useMemo(() => {
    const ranges = [
      { name: "0-25%", count: 0 },
      { name: "25-50%", count: 0 },
      { name: "50-75%", count: 0 },
      { name: "75-100%", count: 0 },
    ];

    works.forEach(work => {
      const progress = parseFloat(String(work.physical_progress || 0)) || 0;
      if (progress < 25) ranges[0].count++;
      else if (progress < 50) ranges[1].count++;
      else if (progress < 75) ranges[2].count++;
      else ranges[3].count++;
    });

    return ranges;
  }, [works]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">{isHindi ? "डेटा लोड हो रहा है..." : "Loading real-time data..."}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">{isHindi ? "डेटा लोड करने में त्रुटि:" : "Error loading data:"} {error?.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{isHindi ? "राष्ट्रीय अवलोकन" : "National Overview"}</h1>
          <p className="text-sm text-slate-600 mt-1">
            {lastUpdated 
              ? `${isHindi ? "अंतिम अपडेट:" : "Last updated:"} ${lastUpdated.toLocaleTimeString()}`
              : `${isHindi ? "रीयल-टाइम डेटा" : "Real-time data"}`}
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer active:scale-95 min-h-[38px]"
          title={isHindi ? "राष्ट्रीय API गेटवे से लाइव डेटा सिंक करें" : "Sync live datafeed from MoSPI National API gateway"}
        >
          <RefreshCw className={`w-3.5 h-3.5 text-blue-700 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? (isHindi ? "सिंक हो रहा है..." : "Syncing...") : (isHindi ? "डेटा सिंक करें" : "Sync Data")}</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <MetricCard
          title={isHindi ? "कुल कार्य" : "Total Works"}
          value={metrics.totalWorks.toLocaleString()}
          change={`+${metrics.totalWorks}`}
          isGoodTrend={metrics.totalWorks > 0}
          icon={FileSpreadsheet}
          accentColor="navy"
          subtitle={isHindi ? "निगरानी अधीन" : "Monitored"}
        />

        <MetricCard
          title={isHindi ? "कुल बजट" : "Total Budget"}
          value={`₹${(metrics.totalBudget / 100).toFixed(1)} Cr`}
          change={`Spent: ₹${(metrics.totalExpenditure / 100).toFixed(1)} Cr`}
          isGoodTrend={true}
          icon={IndianRupee}
          accentColor="blue"
          subtitle={`${isHindi ? "व्यय दर:" : "Utilization:"} ${Math.round((metrics.totalExpenditure / metrics.totalBudget) * 100)}%`}
        />

        <MetricCard
          title={isHindi ? "पूर्ण किए गए" : "Completed"}
          value={metrics.completedWorks.toString()}
          change={`${Math.round((metrics.completedWorks / metrics.totalWorks) * 100)}%`}
          isGoodTrend={true}
          icon={CheckCircle2}
          accentColor="emerald"
          subtitle={isHindi ? "समाप्त कार्य" : "Finished works"}
        />

        <MetricCard
          title={isHindi ? "उच्च जोखिम" : "High Risk"}
          value={metrics.highRiskWorks.toString()}
          change={`Critical: ${metrics.criticalWorks}`}
          isGoodTrend={false}
          icon={Flame}
          accentColor="red"
          subtitle={isHindi ? "ऑडिट प्राथमिकता" : "Audit priority"}
        />

        <MetricCard
          title={isHindi ? "औसत प्रगति" : "Avg Progress"}
          value={`${metrics.avgProgress}%`}
          change={isHindi ? "राष्ट्रीय औसत" : "National avg"}
          isGoodTrend={metrics.avgProgress > 50}
          icon={TrendingUp}
          accentColor="sky"
          subtitle={isHindi ? "पूर्ण दर" : "Completion rate"}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            {isHindi ? "जोखिम वितरण" : "Risk Distribution"}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {riskDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Work Status */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            {isHindi ? "कार्य की स्थिति" : "Work Status"}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0066FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Budget vs Expenditure by State */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            {isHindi ? "राज्य-वार बजट बनाम व्यय" : "Budget vs Expenditure by State"}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" />
              <YAxis label={{ value: "Amount (Cr)", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Budget" fill="#0066FF" />
              <Bar dataKey="Spent" fill="#047A1E" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Works Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          {isHindi ? "शीर्ष 10 कार्य (जोखिम द्वारा)" : "Top 10 Works (by Risk)"}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-4 font-semibold text-slate-700">Work ID</th>
                <th className="text-left py-2 px-4 font-semibold text-slate-700">{isHindi ? "विवरण" : "Description"}</th>
                <th className="text-left py-2 px-4 font-semibold text-slate-700">{isHindi ? "जोखिम" : "Risk"}</th>
                <th className="text-left py-2 px-4 font-semibold text-slate-700">{isHindi ? "प्रगति" : "Progress"}</th>
              </tr>
            </thead>
            <tbody>
              {works
                .filter(w => w.risk_score)
                .sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0))
                .slice(0, 10)
                .map((work, idx) => (
                  <tr key={`${work.work_id}-${idx}`} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-slate-900">{work.work_id}</td>
                    <td className="py-3 px-4 text-slate-700">{work.description?.substring(0, 40)}...</td>
                    <td className="py-3 px-4">
                      <RiskBadge severity={work.risk_score > 80 ? "CRITICAL" : work.risk_score > 60 ? "HIGH" : "MEDIUM"} score={work.risk_score} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${work.physical_progress}%` }}
                          />
                        </div>
                        <span className="text-slate-700 font-mono">{work.physical_progress}%</span>
                      </div>
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

export default NationalOverviewViewRealTime;
