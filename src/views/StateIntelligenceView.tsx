import React, { useState } from "react";
import {
  MapPin,
  IndianRupee,
  AlertTriangle,
  Flame,
  CheckCircle2,
  FileSpreadsheet,
  ChevronRight,
  TrendingUp,
  Download,
  Filter,
} from "lucide-react";
import { DistrictSummary, Language, UserRole } from "../types";
import { MetricCard } from "../components/common/MetricCard";
import { RiskBadge } from "../components/common/RiskBadge";
import { formatCr } from "../lib/utils";
import { getTranslation } from "../data/translations";

import { DEFAULT_DISTRICT_SUMMARIES } from "../data/districtSummaries";

interface StateIntelligenceViewProps {
  districts: DistrictSummary[];
  selectedState: string;
  onChangeState: (state: string) => void;
  onSelectDistrict: (district: string) => void;
  language?: Language;
  currentRole?: UserRole;
}

export const StateIntelligenceView: React.FC<StateIntelligenceViewProps> = ({
  districts,
  selectedState,
  onChangeState,
  onSelectDistrict,
  language = "en",
  currentRole = "Ministry",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("ALL");
  const isHindi = language === "hi";
  const t = getTranslation(language as Language);

  const dataToUse = districts && districts.length > 0 ? districts : DEFAULT_DISTRICT_SUMMARIES;

  const filteredDistricts = dataToUse.filter((d) => {
    const matchSearch =
      d.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSev = filterSeverity === "ALL" || d.risk_category === filterSeverity;
    return matchSearch && matchSev;
  });

  return (
    <div id="state-intelligence-dashboard" className="space-y-6 animate-in fade-in duration-200">
      {/* Header & State Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[11px] font-bold rounded font-mono uppercase">
              {isHindi ? "राज्य नोडल प्राधिकरण" : "State Nodal Authority"}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {isHindi ? "निगरानी कंसोल" : "Surveillance Console"}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            {selectedState === "All States"
              ? currentRole === "State Nodal Authority"
                ? (isHindi ? "राज्य जिला ट्रैकर" : "State-Wide Progress Tracker")
                : (isHindi ? "राज्य-वार प्रगति ट्रैकर" : "State-Wise Progress Tracker")
              : `${selectedState} — ${isHindi ? "राज्य प्रगति ट्रैकर" : "State Progress Tracker"}`}
          </h1>
          <p className="text-xs text-slate-600">
            {isHindi
              ? "जिला स्तरीय जोखिम श्रेणीकरण, कार्यान्वयन एजेंसी प्रदर्शन बेंचमार्क एवं निधि उपयोग गतिशीलता।"
              : "District-level risk stratification, implementing agency performance benchmarks, and fund utilization velocity."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedState}
            onChange={(e) => onChangeState(e.target.value)}
            className="bg-white text-slate-800 text-xs font-semibold rounded-lg px-3 py-2 border border-slate-300 shadow-2xs outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="Uttar Pradesh">Uttar Pradesh (UP)</option>
            <option value="Maharashtra">Maharashtra (MH)</option>
            <option value="Bihar">Bihar (BR)</option>
            <option value="Tamil Nadu">Tamil Nadu (TN)</option>
            <option value="Rajasthan">Rajasthan (RJ)</option>
            <option value="Karnataka">Karnataka (KA)</option>
            <option value="West Bengal">West Bengal (WB)</option>
            <option value="Gujarat">Gujarat (GJ)</option>
            <option value="All States">All States Overview</option>
          </select>

          <button
            onClick={() => alert(`Exporting ${selectedState} State Intelligence Dossier...`)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>State Dossier</span>
          </button>
        </div>
      </div>

      {/* State Metric KPIs - Calculated from Real Data */}
      {(() => {
        const totalWorks = dataToUse.reduce((sum, d) => sum + d.works_count, 0);
        const totalExpenditure = dataToUse.reduce((sum, d) => sum + d.expenditure_cr, 0);
        const totalHighRiskWorks = dataToUse.reduce((sum, d) => sum + d.high_risk_works, 0);
        const avgCompletionRate = dataToUse.length > 0
          ? Math.round(dataToUse.reduce((sum, d) => sum + d.completion_rate, 0) / dataToUse.length)
          : 0;

        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            <MetricCard
              title={isHindi ? "निगरानी किए गए कार्य" : "Monitored Works"}
              value={totalWorks.toLocaleString()}
              change={`${dataToUse.length} districts`}
              isGoodTrend={true}
              icon={FileSpreadsheet}
              accentColor="navy"
              subtitle={isHindi ? "कुल गणना" : "Total count"}
              sparklineData={[totalWorks * 0.7, totalWorks * 0.8, totalWorks * 0.9, totalWorks]}
            />
            <MetricCard
              title={isHindi ? "राज्य व्यय" : "State Expenditure"}
              value={`₹${formatCr(totalExpenditure)}`}
              change={`${dataToUse.length} districts`}
              isGoodTrend={true}
              icon={IndianRupee}
              accentColor="blue"
              subtitle={isHindi ? "कुल व्यय" : "Total expenditure"}
              sparklineData={[totalExpenditure * 0.6, totalExpenditure * 0.75, totalExpenditure * 0.9, totalExpenditure]}
            />
            <MetricCard
              title={isHindi ? "उच्च जोखिम कार्य" : "High-Risk Works"}
              value={totalHighRiskWorks.toString()}
              change={dataToUse.length > 0 ? `Avg Risk: ${Math.round(dataToUse.reduce((s, d) => s + d.risk_score, 0) / dataToUse.length)}` : "No data"}
              isGoodTrend={false}
              icon={Flame}
              accentColor="red"
              subtitle={isHindi ? "ऑडिट प्राथमिकता" : "Audit priority"}
              sparklineData={[totalHighRiskWorks * 0.5, totalHighRiskWorks * 0.7, totalHighRiskWorks * 0.85, totalHighRiskWorks]}
            />
            <MetricCard
              title={isHindi ? "औसत समापन दर" : "Avg Completion Rate"}
              value={`${avgCompletionRate}%`}
              change={`${dataToUse.length} districts`}
              isGoodTrend={true}
              icon={CheckCircle2}
              accentColor="emerald"
              subtitle={isHindi ? "प्रगति दर" : "Progress rate"}
              sparklineData={[avgCompletionRate * 0.6, avgCompletionRate * 0.75, avgCompletionRate * 0.9, avgCompletionRate]}
            />
          </div>
        );
      })()}

      {/* District Risk Ranking Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Table Filters & Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {isHindi ? "जिला जोखिम रैंकिंग तालिका" : "District Risk Ranking Table"}
            </h3>
            <p className="text-xs text-slate-500">
              {isHindi ? "समग्र मशीन लर्निंग जोखिम स्कोर द्वारा वर्गीकृत • विस्तृत विश्लेषण के लिए रो पर क्लिक करें" : "Ranked by composite machine learning risk score • Click row for district deep dive"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder={isHindi ? "जिला खोजें..." : "Search district name..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-500 w-48 text-slate-800 placeholder:text-slate-400"
            />

            <div className="flex items-center gap-1 bg-white border border-slate-200 p-0.5 rounded-lg text-xs">
              {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    filterSeverity === sev
                      ? "bg-slate-900 text-white font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4">District &amp; State</th>
                <th className="py-3 px-4 text-right">Works Count</th>
                <th className="py-3 px-4 text-right">Expenditure (₹ Cr)</th>
                <th className="py-3 px-4 text-center">Composite Risk</th>
                <th className="py-3 px-4 text-center">High-Risk Works</th>
                <th className="py-3 px-4">Completion Index</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDistricts.map((dist, idx) => (
                <tr
                  key={dist.district}
                  onClick={() => onSelectDistrict(dist.district)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-500">
                    #{idx + 1}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 group-hover:text-blue-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {dist.district}
                    </div>
                    <div className="text-[11px] text-slate-500">{dist.state}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                    {dist.works_count}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                    ₹{dist.expenditure_cr} Cr
                  </td>
                  <td className="py-3 px-4 text-center">
                    <RiskBadge severity={dist.risk_category} score={dist.risk_score} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-red-600">
                    {dist.high_risk_works}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${dist.completion_rate}%` }}
                        />
                      </div>
                      <span className="font-mono font-semibold text-slate-700 text-[11px]">
                        {dist.completion_rate}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDistrict(dist.district);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded border border-blue-200 transition-colors inline-flex items-center gap-1"
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
    </div>
  );
};
