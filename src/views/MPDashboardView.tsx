import React from "react";
import {
  Landmark,
  IndianRupee,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  FileSpreadsheet,
  Download,
  PlusCircle,
  ChevronRight,
} from "lucide-react";
import { WorkRecord, Language } from "../types";
import { MetricCard } from "../components/common/MetricCard";
import { RiskBadge } from "../components/common/RiskBadge";
import { formatINR, formatCr } from "../lib/utils";
import { getTranslation } from "../data/translations";

interface MPDashboardViewProps {
  works: WorkRecord[];
  onSelectWork: (work: WorkRecord) => void;
  language?: Language;
}

export const MPDashboardView: React.FC<MPDashboardViewProps> = ({
  works,
  onSelectWork,
  language = "en",
}) => {
  const currentLang: Language = (language || "en") as Language;
  const isHindi = currentLang === "hi";
  const t = getTranslation(currentLang);
  const mpWorks = works.filter((w) => w.constituency === "Ghaziabad (LS-12)");

  return (
    <div id="mp-constituency-dashboard" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-[11px] font-bold rounded font-mono uppercase">
              {isHindi ? "संसदीय क्षेत्र" : "Parliamentary Constituency"}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {isHindi ? "18वीं लोकसभा • वित्त वर्ष 2025-26" : "18th Lok Sabha • FY 2025-26"}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Landmark className="w-6 h-6 text-blue-700" />
            {isHindi ? "मेरा एमपीलैड्स — गाजियाबाद (लोकसभा-12) कार्यस्थान" : "My MPLADS — Ghaziabad (LS-12) Workspace"}
          </h1>
          <p className="text-xs text-slate-600">
            {isHindi
              ? "संसदीय निर्वाचन क्षेत्र-स्तरीय निधि पात्रता आहरण, स्वीकृति ट्रैकिंग, और परियोजना निष्पादन जोखिम निगरानी।"
              : "Constituency-level fund entitlement drawdown, sanction tracking, and project execution risk monitoring."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert(isHindi ? "आधिकारिक एमपीलैड्स अनुशंसा पोर्टल (ई-साक्षी) खुल रहा है..." : "Opening Official MPLADS Recommendation Portal (e-SAKSHI)...")}
            className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{isHindi ? "नए कार्य की अनुशंसा करें" : "Recommend New Work"}</span>
          </button>

          <button
            onClick={() => alert(isHindi ? "सांसद संसदीय क्षेत्र प्रगति रिपोर्ट (PDF) डाउनलोड हो रही है..." : "Downloading MP Constituency Progress Report (PDF)...")}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{isHindi ? "संसदीय क्षेत्र रिपोर्ट" : "Constituency Brief"}</span>
          </button>
        </div>
      </div>

      {/* Entitlement & Draw Financial Ledger */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-3.5">
        <MetricCard
          title={isHindi ? "वार्षिक पात्रता" : "Annual Entitlement"}
          value="₹5.00 Cr"
          subtitle={isHindi ? "निश्चित वार्षिक कोटा" : "Fixed annual quota"}
          icon={IndianRupee}
          accentColor="navy"
          sparklineData={[5, 5, 5, 5]}
        />
        <MetricCard
          title={isHindi ? "अनुशंसित कार्य" : "Recommended"}
          value="₹3.20 Cr"
          subtitle={isHindi ? "पात्रता का 64%" : "64% of entitlement"}
          icon={FileSpreadsheet}
          accentColor="blue"
          sparklineData={[1.2, 2.0, 2.8, 3.2]}
        />
        <MetricCard
          title={isHindi ? "डीएम द्वारा स्वीकृत" : "Sanctioned by DM"}
          value="₹2.60 Cr"
          subtitle={isHindi ? "अनुशंसित का 81%" : "81% of recommended"}
          icon={CheckCircle2}
          accentColor="emerald"
          sparklineData={[0.8, 1.5, 2.1, 2.6]}
        />
        <MetricCard
          title={isHindi ? "उपयोग / संवितरित" : "Utilized / Disbursed"}
          value="₹1.80 Cr"
          subtitle={isHindi ? "वास्तविक क्षेत्र व्यय" : "Actual field expenditure"}
          icon={IndianRupee}
          accentColor="blue"
          sparklineData={[0.4, 0.9, 1.4, 1.8]}
        />
        <MetricCard
          title={isHindi ? "पूर्ण कार्य" : "Completed Works"}
          value="61"
          subtitle={isHindi ? "सार्वजनिक संपत्ति हस्तांतरित" : "Public assets handed over"}
          icon={CheckCircle2}
          accentColor="emerald"
          sparklineData={[40, 48, 55, 61]}
        />
        <MetricCard
          title={isHindi ? "जोखिम वाले कार्य" : "At-Risk Works"}
          value="5"
          subtitle={isHindi ? "सांसद समीक्षा आवश्यक" : "Requires MP review"}
          icon={AlertTriangle}
          accentColor="red"
          sparklineData={[2, 3, 4, 5]}
        />
      </div>

      {/* Active Recommended Works in Constituency */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {isHindi ? "निगरानी के तहत संसदीय परियोजनाएं" : "Constituency Projects Under Surveillance"}
            </h3>
            <p className="text-xs text-slate-500">
              {isHindi ? "सांसद द्वारा अनुशंसित एवं जिला योजना प्रकोष्ठ द्वारा स्वीकृत कार्य" : "Works recommended by Member of Parliament and sanctioned by District Planning Cell"}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700">
            {mpWorks.length} {isHindi ? "सक्रिय कार्य" : "active works"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{isHindi ? "कार्य आईडी" : "Work ID"}</th>
                <th className="py-3 px-4">{isHindi ? "कार्य शीर्षक" : "Work Title"}</th>
                <th className="py-3 px-4">{isHindi ? "श्रेणी" : "Category"}</th>
                <th className="py-3 px-4">{isHindi ? "एजेंसी" : "Agency"}</th>
                <th className="py-3 px-4 text-right">{isHindi ? "लागत" : "Cost"}</th>
                <th className="py-3 px-4 text-center">{isHindi ? "प्रगति (भौतिक / वित्तीय)" : "Progress (Phy / Fin)"}</th>
                <th className="py-3 px-4 text-center">{isHindi ? "जोखिम स्थिति" : "Risk Status"}</th>
                <th className="py-3 px-4 text-right">{isHindi ? "कार्रवाई" : "Action"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mpWorks.map((work) => (
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
                  <td className="py-3 px-4 text-slate-600 truncate max-w-[140px]">{work.agency}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {formatINR(work.sanctioned_cost)}
                  </td>
                  <td className="py-3 px-4 text-center font-mono">
                    <span className="text-emerald-600 font-bold">{work.physical_progress}%</span>
                    <span className="text-slate-400"> / </span>
                    <span className="text-red-600 font-bold">{work.financial_progress}%</span>
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
                      className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded border border-blue-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      {isHindi ? "ऑडिट विवरण" : "Audit Details"} <ChevronRight className="w-3 h-3" />
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
