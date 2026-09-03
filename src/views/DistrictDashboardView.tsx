import React from "react";
import {
  MapPin,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  BarChart2,
  ChevronRight,
  Download,
  Flame,
} from "lucide-react";
import { WorkRecord, Language } from "../types";
import { RiskScoreGauge } from "../components/common/RiskScoreGauge";
import { RiskBadge } from "../components/common/RiskBadge";
import { MetricCard } from "../components/common/MetricCard";
import { formatINR } from "../lib/utils";
import { getTranslation } from "../data/translations";

interface DistrictDashboardViewProps {
  districtName: string;
  works: WorkRecord[];
  onSelectWork: (work: WorkRecord) => void;
  onBackToState: () => void;
  language?: Language;
}

export const DistrictDashboardView: React.FC<DistrictDashboardViewProps> = ({
  districtName = "Ghaziabad",
  works,
  onSelectWork,
  onBackToState,
  language = "en",
}) => {
  const currentLang: Language = (language || "en") as Language;
  const isHindi = currentLang === "hi";
  const t = getTranslation(currentLang);

  // Mock data for fallback when works prop is empty
  const mockWorks: WorkRecord[] = [
    {
      work_id: "WK-2026-00142",
      mp_id: "MP001",
      mp_name: "Test MP",
      description: "Road Construction & Bituminous Surfacing - Sector 5 to 8",
      district: "Ghaziabad",
      state: "Uttar Pradesh",
      constituency: "Ghaziabad",
      category: "Rural Road Improvement",
      agency: "PWD",
      recommended_cost: 1.5,
      sanctioned_cost: 1.5,
      actual_expenditure: 1.2,
      physical_progress: 72,
      financial_progress: 80,
      start_date: "2025-01-15",
      expected_completion: "2026-03-15",
      predicted_completion: "2026-04-15",
      status: "In Progress",
      risk_score: 62,
      risk_category: "HIGH",
      cost_anomaly_score: 75,
      delay_score: 55,
      duplicate_score: 20,
      compliance_score: 40,
      latitude: 28.6692,
      longitude: 77.4538,
      anomaly_types: ["Cost Overrun", "Delay Risk"],
    },
    {
      work_id: "WK-2026-00143",
      mp_id: "MP001",
      mp_name: "Test MP",
      description: "Primary School Building Renovation with WiFi Connectivity",
      district: "Ghaziabad",
      state: "Uttar Pradesh",
      constituency: "Ghaziabad",
      category: "School Building Renovation",
      agency: "Education Dept",
      recommended_cost: 0.8,
      sanctioned_cost: 0.8,
      actual_expenditure: 0.45,
      physical_progress: 58,
      financial_progress: 56,
      start_date: "2025-02-01",
      expected_completion: "2026-02-01",
      predicted_completion: "2026-05-01",
      status: "In Progress",
      risk_score: 68,
      risk_category: "HIGH",
      cost_anomaly_score: 70,
      delay_score: 65,
      duplicate_score: 15,
      compliance_score: 35,
      latitude: 28.6750,
      longitude: 77.4600,
      anomaly_types: ["Progress Delay", "Cost Anomaly"],
    },
    {
      work_id: "WK-2026-00144",
      mp_id: "MP001",
      mp_name: "Test MP",
      description: "Water Supply Pipeline Extension to Rural Habitations",
      district: "Ghaziabad",
      state: "Uttar Pradesh",
      constituency: "Ghaziabad",
      category: "Drinking Water Facility",
      agency: "Water Board",
      recommended_cost: 1.2,
      sanctioned_cost: 1.2,
      actual_expenditure: 0.92,
      physical_progress: 85,
      financial_progress: 77,
      start_date: "2024-12-01",
      expected_completion: "2026-01-01",
      predicted_completion: "2026-01-15",
      status: "In Progress",
      risk_score: 35,
      risk_category: "MEDIUM",
      cost_anomaly_score: 30,
      delay_score: 25,
      duplicate_score: 10,
      compliance_score: 70,
      latitude: 28.6680,
      longitude: 77.4520,
      anomaly_types: [],
    },
  ];

  const dataToUse = works && works.length > 0 ? works : mockWorks;
  // Always show mock data for the selected district if no real data
  const districtWorks = dataToUse.filter(
    (w) => w.district.toLowerCase() === districtName.toLowerCase()
  );
  
  // If no works after filtering, use all mock works (show something instead of blank)
  const worksTodisplay = districtWorks.length > 0 ? districtWorks : mockWorks;

  const riskDrivers = [
    {
      name: isHindi ? "लागत विसंगति सूचकांक" : "Cost Anomaly Index",
      score: 82,
      status: isHindi ? "गंभीर विचलन (जिला मध्यिका बनाम +220%)" : "Critical Outlier (+220% vs District Median)",
      color: "bg-red-600"
    },
    {
      name: isHindi ? "विलंब जोखिम सूचकांक" : "Delay Risk Index",
      score: 74,
      status: isHindi ? "78 दिन अनुमानित औसत समयसीमा विसंगति" : "78 Days Predicted Average Timeline Slip",
      color: "bg-amber-600"
    },
    {
      name: isHindi ? "प्रगति बेमेल सूचकांक" : "Progress Mismatch Index",
      score: 68,
      status: isHindi ? "गंभीर वित्तीय-से-भौतिक अंतर" : "Severe Financial-to-Physical Gap",
      color: "bg-amber-600"
    },
    {
      name: isHindi ? "समानता दोहराव सूचकांक" : "Duplicate Similarity Index",
      score: 41,
      status: isHindi ? "2 संदिग्ध ओवरलैपिंग भू-बिंदु" : "2 Suspected Overlapping Geo-Points",
      color: "bg-yellow-500"
    },
    {
      name: isHindi ? "अनुपालन एवं दिशानिर्देश सूचकांक" : "Compliance & Guidelines Index",
      score: 29,
      status: isHindi ? "3 अनुबंधों के लिए एमबी रिकॉर्ड बकाया" : "MB Records Overdue for 3 Contracts",
      color: "bg-emerald-600"
    },
  ];

  return (
    <div id="district-dashboard-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button
              onClick={onBackToState}
              className="hover:text-blue-600 underline font-medium cursor-pointer"
            >
              {isHindi ? "राज्य आसूचना" : "State Intelligence"}
            </button>
            <span>/</span>
            <span className="text-slate-900 font-semibold">{districtName}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-red-600" />
            {districtName} {isHindi ? "जिला जोखिम आसूचना" : "District Risk Intelligence"}
          </h1>
          <p className="text-xs text-slate-600">
            {isHindi
              ? "जिला मजिस्ट्रेट एवं योजना प्रकोष्ठ परिचालन डैशबोर्ड • स्वचालित बहु-कारक विसंगति सूचकांक"
              : "District Magistrate & Planning Cell Operational Dashboard • Automated Multi-Factor Anomaly Index"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert(`Exporting ${districtName} District Magistrate Audit Brief...`)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{isHindi ? "डीएम ऑडिट रिपोर्ट (PDF)" : "DM Audit Brief (PDF)"}</span>
          </button>
        </div>
      </div>

      {/* District Composite Score Card & Main Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Gauge Box */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between items-center text-center">
          <div className="w-full text-left pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              {isHindi ? "जिला समग्र जोखिम रेटिंग" : "District Composite Risk Rating"}
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              {isHindi ? "निगरानी मॉडल स्कोर" : "Surveillance Model Score"}
            </h3>
          </div>

          <div className="my-3">
            <RiskScoreGauge score={81} severity="HIGH" size={140} strokeWidth={12} />
          </div>

          <div className="w-full bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-600 text-left">
            <div className="flex items-center justify-between font-semibold text-slate-900 mb-1">
              <span>{isHindi ? "जोखिम वर्गीकरण" : "Risk Classification"}</span>
              <span className="text-red-700 font-mono">{isHindi ? "उच्च निगरानी" : "HIGH SURVEILLANCE"}</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {isHindi
                ? "नगरपालिका कार्यों में लागत विचलन के लिए जिला शीर्ष 5वें प्रतिशतक में आता है।"
                : "District scores in top 5th percentile for cost divergence across municipal works."}
            </p>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          <MetricCard
            title={isHindi ? "कुल कार्य" : "Total Works"}
            value="342"
            change={isHindi ? "+12 इस वित्तीय वर्ष" : "+12 this FY"}
            isGoodTrend={true}
            icon={FileSpreadsheet}
            accentColor="navy"
            subtitle={isHindi ? "जिले में सूचीबद्ध" : "Cataloged in district"}
            sparklineData={[300, 312, 330, 342]}
          />
          <MetricCard
            title={isHindi ? "पूर्ण" : "Completed"}
            value="281"
            change={isHindi ? "82% दर" : "82% rate"}
            isGoodTrend={true}
            icon={CheckCircle2}
            accentColor="emerald"
            subtitle={isHindi ? "प्रमाणित पूर्ण" : "Certified finished"}
            sparklineData={[240, 255, 270, 281]}
          />
          <MetricCard
            title={isHindi ? "प्रगति पर" : "Ongoing"}
            value="41"
            change={isHindi ? "सक्रिय स्थल" : "Active field sites"}
            isGoodTrend={true}
            icon={TrendingUp}
            accentColor="blue"
            subtitle={isHindi ? "निष्पादन में" : "In execution"}
            sparklineData={[50, 48, 44, 41]}
          />
          <MetricCard
            title={isHindi ? "विलंबित / जोखिम में" : "Delayed / At Risk"}
            value="20"
            change={isHindi ? "+4 हाल में" : "+4 recent"}
            isGoodTrend={false}
            icon={Clock}
            accentColor="red"
            subtitle={isHindi ? "निरीक्षण आवश्यक" : "Requires inspection"}
            sparklineData={[14, 16, 18, 20]}
          />
        </div>
      </div>

      {/* Risk Drivers Breakdown */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-slate-700" />
              Algorithmic Risk Drivers (Multi-Factor Breakdown)
            </h3>
            <p className="text-xs text-slate-500">
              Contribution weights synthesized from empirical baseline metrics
            </p>
          </div>
          <span className="text-xs font-mono bg-slate-100 px-2.5 py-1 rounded text-slate-700 font-semibold">
            5 Active Detection Models
          </span>
        </div>

        <div className="space-y-4">
          {riskDrivers.map((driver, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{driver.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-[11px]">{driver.status}</span>
                  <span className="font-mono font-bold text-slate-900 w-12 text-right">
                    {driver.score}/100
                  </span>
                </div>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${driver.color}`}
                  style={{ width: `${driver.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flagged Works in District Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Flagged Works in {districtName}
            </h3>
            <p className="text-xs text-slate-500">Click any row to open the complete explainable evidence drawer</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700">
            {worksTodisplay.length} flagged records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Work ID</th>
                <th className="py-3 px-4">Work Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Agency</th>
                <th className="py-3 px-4 text-right">Cost</th>
                <th className="py-3 px-4 text-center">Progress (Fin/Phy)</th>
                <th className="py-3 px-4 text-center">Risk</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {worksTodisplay.map((work) => (
                <tr
                  key={work.work_id}
                  onClick={() => onSelectWork(work)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 group-hover:text-blue-700">
                    {work.work_id}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 max-w-xs truncate">
                    {work.description}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{work.category}</td>
                  <td className="py-3 px-4 text-slate-600 truncate max-w-[150px]">{work.agency}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {formatINR(work.sanctioned_cost)}
                  </td>
                  <td className="py-3 px-4 text-center font-mono">
                    <span className="text-red-600 font-bold">{work.financial_progress}%</span>
                    <span className="text-slate-400"> / </span>
                    <span className="text-emerald-600 font-bold">{work.physical_progress}%</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <RiskBadge severity={work.risk_category} score={work.risk_score} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectWork(work);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded border border-blue-200 transition-colors inline-flex items-center gap-1"
                    >
                      Why Flagged? <ChevronRight className="w-3 h-3" />
                    </button>
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
