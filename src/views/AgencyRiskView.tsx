import React, { useState } from "react";
import {
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  ChevronRight,
  TrendingUp,
  Download,
} from "lucide-react";
import { ImplementingAgency, WorkRecord, Language } from "../types";
import { RiskBadge } from "../components/common/RiskBadge";
import { formatINR } from "../lib/utils";
import { getTranslation } from "../data/translations";

interface AgencyRiskViewProps {
  agencies: ImplementingAgency[];
  works: WorkRecord[];
  onSelectWork: (work: WorkRecord) => void;
  language?: Language;
}

export const AgencyRiskView: React.FC<AgencyRiskViewProps> = ({
  agencies,
  works,
  onSelectWork,
  language = "en",
}) => {
  const currentLang: Language = (language || "en") as Language;
  const isHindi = currentLang === "hi";
  const t = getTranslation(currentLang);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(agencies[0]?.id || null);

  const filteredAgencies = agencies.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.short_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeAgency = agencies.find((a) => a.id === selectedAgencyId) || agencies[0];
  const agencyWorks = works.filter((w) =>
    w.agency.toLowerCase().includes(activeAgency?.short_name.toLowerCase() || "") ||
    activeAgency?.name.toLowerCase().includes(w.agency.toLowerCase())
  );

  return (
    <div id="agency-risk-intelligence-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-[11px] font-bold rounded font-mono uppercase">
              {isHindi ? "निष्पादन जोखिम निगरानी" : "Execution Risk Surveillance"}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {isHindi ? "ठेकेदार एवं लाइन विभाग मैट्रिक्स" : "Contractor & Line Department Matrix"}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-700" />
            {isHindi ? "कार्यान्वयन एजेंसी प्रदर्शन एवं जोखिम पोर्टफोलियो" : "Implementing Agency Performance & Risk Portfolio"}
          </h1>
          <p className="text-xs text-slate-600">
            {isHindi
              ? "पोर्टफोलियो संकेंद्रण जोखिम, आवर्ती विलंब पैटर्न, और दर अनुसूची विचलन बेंचमार्क।"
              : "Portfolio concentration risk, recurring delay patterns, and Schedule of Rates divergence benchmarks."}
          </p>
        </div>

        <button
          onClick={() =>
            alert(
              isHindi
                ? "कार्यान्वयन एजेंसी जोखिम डोजियर (CSV) निर्यात किया जा रहा है..."
                : "Exporting Implementing Agency Risk Dossier (CSV)..."
            )
          }
          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>{isHindi ? "एजेंसी मैट्रिक्स निर्यात करें" : "Export Agency Matrix"}</span>
        </button>
      </div>

      {/* Agency Table & Drilldown Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Agencies List */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {isHindi ? "कार्यान्वयन एजेंसियां" : "Implementing Agencies"}
            </h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={isHindi ? "एजेंसी खोजें..." : "Search agency..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1 bg-white border border-slate-300 rounded-md text-xs outline-none focus:border-blue-500 w-40 text-slate-800"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-200 overflow-y-auto max-h-[520px]">
            {filteredAgencies.map((agency) => {
              const isSelected = agency.id === activeAgency?.id;
              return (
                <div
                  key={agency.id}
                  onClick={() => setSelectedAgencyId(agency.id)}
                  className={`p-4 transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected ? "bg-blue-50/80 border-l-4 border-blue-600" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {agency.name}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-1 font-mono">
                      <span>{agency.total_works} {isHindi ? "कार्य" : "works"}</span>
                      <span>•</span>
                      <span>₹{agency.active_expenditure_cr} {isHindi ? "करोड़" : "Cr"}</span>
                      <span>•</span>
                      <span className="text-red-600 font-bold">{agency.high_risk_works} {isHindi ? "ध्वजंकित" : "flagged"}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <RiskBadge severity={agency.risk_category} score={agency.avg_risk_score} size="sm" />
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Agency Portfolio Deep Dive */}
        <div className="lg:col-span-6 space-y-4">
          {activeAgency && (
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-5">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    {isHindi ? "एजेंसी पोर्टफोलियो इंटेलिजेंस" : "Agency Portfolio Intelligence"}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900">{activeAgency.name}</h2>
                  <p className="text-xs text-slate-500">
                    {isHindi ? "प्रकार:" : "Type:"} {activeAgency.type} • {isHindi ? "संक्षिप्त नाम:" : "Short Identifier:"} {activeAgency.short_name}
                  </p>
                </div>
                <RiskBadge severity={activeAgency.risk_category} score={activeAgency.avg_risk_score} size="md" />
              </div>

              {/* Agency Metrics */}
              <div className="grid grid-cols-3 gap-3 text-xs text-center font-mono">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase block font-sans">
                    {isHindi ? "सक्रिय निधि" : "Active Funds"}
                  </span>
                  <span className="text-lg font-bold text-slate-900">₹{activeAgency.active_expenditure_cr} {isHindi ? "करोड़" : "Cr"}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase block font-sans">
                    {isHindi ? "पूर्णता दर" : "Completion Rate"}
                  </span>
                  <span className="text-lg font-bold text-emerald-700">{activeAgency.avg_completion_rate}%</span>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <span className="text-[10px] text-red-700 uppercase block font-sans">
                    {isHindi ? "विलंबित कार्य" : "Delayed Works"}
                  </span>
                  <span className="text-lg font-bold text-red-700">{activeAgency.delayed_works}</span>
                </div>
              </div>

              {/* Monthly Trend */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                  {isHindi ? "जोखिम एवं मील का पत्थर गति प्रवृत्ति" : "Risk & Milestone Velocity Trend"}
                </h4>
                <div className="grid grid-cols-6 gap-2">
                  {activeAgency.monthly_trend.map((m, idx) => (
                    <div key={idx} className="p-2 bg-slate-50 border border-slate-200 rounded text-center">
                      <span className="text-[10px] text-slate-500 block">{m.month}</span>
                      <span className="text-xs font-mono font-bold text-blue-700">{m.completion}%</span>
                      <span className="text-[10px] font-mono text-red-600 block">{m.risk} {isHindi ? "जोखिम" : "risk"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Works Allocated to Agency */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                  {isHindi ? "निगरानी के तहत संबद्ध कार्य" : "Associated Works Under Surveillance"}
                </h4>
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {agencyWorks.length > 0 ? (
                    agencyWorks.map((work) => (
                      <div
                        key={work.work_id}
                        onClick={() => onSelectWork(work)}
                        className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs cursor-pointer flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate">{work.description}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            {work.work_id} • {formatINR(work.sanctioned_cost)}
                          </div>
                        </div>
                        <RiskBadge severity={work.risk_category} score={work.risk_score} size="sm" />
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-xs text-slate-500 italic bg-slate-50 rounded border border-slate-100 text-center">
                      {isHindi ? "वर्तमान फ़िल्टर दायरे में इस एजेंसी के लिए कोई सक्रिय गंभीर विसंगति नहीं है।" : "No active critical anomalies for this agency in current filter scope."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
