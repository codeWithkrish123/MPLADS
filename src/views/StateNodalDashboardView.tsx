import React, { useState } from "react";
import {
  Globe,
  SlidersHorizontal,
  BarChart3,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  Download,
} from "lucide-react";
import { DistrictSummary, Language } from "../types";
import { RiskBadge } from "../components/common/RiskBadge";
import { getTranslation } from "../data/translations";

interface StateNodalDashboardViewProps {
  districts: DistrictSummary[];
  onSelectDistrict: (district: string) => void;
  language?: Language;
}

export const StateNodalDashboardView: React.FC<StateNodalDashboardViewProps> = ({
  districts,
  onSelectDistrict,
  language = "en",
}) => {
  const currentLang: Language = (language || "en") as Language;
  const isHindi = currentLang === "hi";
  const t = getTranslation(currentLang);
  const [selectedDistrictNames, setSelectedDistrictNames] = useState<string[]>([
    "Ghaziabad",
    "Patna",
    "Thane",
  ]);

  const toggleDistrictSelection = (name: string) => {
    if (selectedDistrictNames.includes(name)) {
      if (selectedDistrictNames.length > 1) {
        setSelectedDistrictNames(selectedDistrictNames.filter((n) => n !== name));
      }
    } else {
      if (selectedDistrictNames.length < 5) {
        setSelectedDistrictNames([...selectedDistrictNames, name]);
      }
    }
  };

  const comparedDistricts = districts.filter((d) =>
    selectedDistrictNames.includes(d.district)
  );

  return (
    <div id="state-nodal-comparison-dashboard" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 text-[11px] font-bold rounded font-mono uppercase">
              {isHindi ? "राज्य नोडल प्राधिकरण" : "State Nodal Authority"}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {isHindi ? "तुलनात्मक बेंचमार्क मैट्रिक्स" : "Comparative Benchmark Matrix"}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Globe className="w-6 h-6 text-indigo-700" />
            {isHindi ? "अंतर-जिला प्रदर्शन एवं जोखिम तुलना" : "Cross-District Performance & Risk Comparison"}
          </h1>
          <p className="text-xs text-slate-600">
            {isHindi
              ? "संरचनात्मक विसंगतियों और व्यय असमानताओं की पहचान के लिए 2 से 5 प्रशासनिक जिलों की तुलना करें।"
              : "Simultaneously benchmark 2 to 5 administrative districts to identify structural anomalies and expenditure disparities."}
          </p>
        </div>

        <button
          onClick={() =>
            alert(
              isHindi
                ? "अंतर-जिला तुलना विश्लेषण मैट्रिक्स (PDF) निर्यात की जा रही है..."
                : "Exporting Cross-District Comparison Analysis Matrix (PDF)..."
            )
          }
          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>{isHindi ? "मैट्रिक्स निर्यात करें" : "Export Matrix"}</span>
        </button>
      </div>

      {/* District Selection Chips */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            {isHindi ? "तुलना के लिए जिले चुनें (अधिकतम 5):" : "Select Districts to Compare (Max 5):"}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {selectedDistrictNames.length} {isHindi ? "में से 5 चयनित" : "of 5 selected"}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {districts.map((dist) => {
            const isSelected = selectedDistrictNames.includes(dist.district);
            return (
              <button
                key={dist.district}
                onClick={() => toggleDistrictSelection(dist.district)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <MapPin className={`w-3 h-3 ${isSelected ? "text-amber-400" : "text-slate-400"}`} />
                <span>{dist.district}</span>
                <span className="opacity-70 text-[10px]">({dist.state})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparative Grid Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {comparedDistricts.map((dist) => (
          <div
            key={dist.district}
            className="bg-white border-2 border-slate-200 hover:border-blue-400 rounded-xl p-5 shadow-xs transition-all space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">
                  {dist.state}
                </span>
                <h3 className="text-base font-bold text-slate-900">{dist.district}</h3>
              </div>
              <RiskBadge severity={dist.risk_category} score={dist.risk_score} size="sm" />
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isHindi ? "कुल स्वीकृत कार्य:" : "Total Sanctioned Works:"}</span>
                <span className="font-mono font-bold text-slate-900">{dist.works_count}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isHindi ? "संचयी व्यय:" : "Cumulative Expenditure:"}</span>
                <span className="font-mono font-bold text-slate-900">₹{dist.expenditure_cr} {isHindi ? "करोड़" : "Cr"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isHindi ? "उच्च जोखिम संकेत:" : "High-Risk Signals:"}</span>
                <span className="font-mono font-bold text-red-600">{dist.high_risk_works}</span>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{isHindi ? "भौतिक पूर्णता दर:" : "Physical Completion Rate:"}</span>
                  <span className="font-mono font-bold text-emerald-700">{dist.completion_rate}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${dist.completion_rate}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => onSelectDistrict(dist.district)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                {isHindi ? "जिला विस्तृत विश्लेषण देखें" : "Inspect District Deep Dive"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
