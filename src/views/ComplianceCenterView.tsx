import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  FileText,
  Search,
  BookOpen,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { ComplianceRule, Language } from "../types";
import { MetricCard } from "../components/common/MetricCard";
import { RiskBadge } from "../components/common/RiskBadge";
import { getTranslation } from "../data/translations";

interface ComplianceCenterViewProps {
  rules: ComplianceRule[];
  onSelectRule?: (rule: ComplianceRule) => void;
  onOpenPolicy?: () => void;
  language?: Language;
}

export const ComplianceCenterView: React.FC<ComplianceCenterViewProps> = ({
  rules,
  onSelectRule,
  onOpenPolicy,
  language = "en",
}) => {
  const currentLang: Language = (language || "en") as Language;
  const isHindi = currentLang === "hi";
  const t = getTranslation(currentLang);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("ALL");

  const filteredRules = rules.filter((r) => {
    const matchSearch =
      r.rule_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSev = selectedSeverity === "ALL" || r.severity === selectedSeverity;
    return matchSearch && matchSev;
  });

  return (
    <div id="compliance-center-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[11px] font-bold rounded font-mono uppercase">
              {isHindi ? "सांविधिक अनुपालन इंजन" : "Statutory Compliance Engine"}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {isHindi ? "संशोधित दिशानिर्देश 2023" : "Revised Guidelines 2023"}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            {isHindi ? "अनुपालन निगरानी केंद्र" : "Compliance Surveillance Center"}
          </h1>
          <p className="text-xs text-slate-600">
            {isHindi
              ? "सांविधिक संसदीय दिशानिर्देशों, वित्तीय सीमाओं और पात्रता प्रतिबंधों के विरुद्ध सक्रिय कार्यों का वास्तविक समय नियम मैपिंग।"
              : "Real-time rule engine mapping active works against statutory parliamentary guidelines, financial thresholds, and eligibility restrictions."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenPolicy && (
            <button
              onClick={onOpenPolicy}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-600" />
              <span>{isHindi ? "नीति ज्ञान कोष" : "Policy Knowledge Base"}</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title={isHindi ? "मूल्यांकित नियम" : "Rules Evaluated"}
          value="12,842"
          change={isHindi ? "100% मूल्यांकित" : "100% evaluated"}
          isGoodTrend={true}
          icon={FileText}
          accentColor="navy"
          subtitle={isHindi ? "प्रतिदिन स्कैन किए गए कार्य" : "Works scanned daily"}
          sparklineData={[12000, 12200, 12500, 12842]}
        />
        <MetricCard
          title={isHindi ? "पूर्णतः अनुपालन" : "Fully Compliant"}
          value="10,231"
          change={isHindi ? "79.7% दर" : "79.7% rate"}
          isGoodTrend={true}
          icon={CheckCircle2}
          accentColor="emerald"
          subtitle={isHindi ? "शून्य सक्रिय ध्वज" : "Zero active flags"}
          sparklineData={[9800, 10000, 10150, 10231]}
        />
        <MetricCard
          title={isHindi ? "अनुपालन चेतावनियां" : "Compliance Warnings"}
          value="2,144"
          change={isHindi ? "मामूली विचलन" : "Minor deviations"}
          isGoodTrend={false}
          icon={AlertTriangle}
          accentColor="amber"
          subtitle={isHindi ? "उदा. एमबी विलंब" : "e.g. MB delay"}
          sparklineData={[2400, 2300, 2210, 2144]}
        />
        <MetricCard
          title={isHindi ? "गंभीर उल्लंघन" : "Critical Violations"}
          value="467"
          change={isHindi ? "भुगतान रोकने की सिफारिश" : "Hold recommended"}
          isGoodTrend={false}
          icon={Flame}
          accentColor="red"
          subtitle={isHindi ? "सांविधिक उल्लंघन" : "Statutory breach"}
          sparklineData={[520, 490, 480, 467]}
        />
      </div>

      {/* Compliance Rules Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {isHindi ? "सांविधिक दिशानिर्देश नियम सूची" : "Statutory Guideline Rule Catalog"}
            </h3>
            <p className="text-xs text-slate-500">
              {isHindi ? "सभी स्वीकृतियों में निरंतर मूल्यांकित पैरामीट्रिक नियम" : "Active parametric rules evaluated continuously across all sanctions"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={isHindi ? "नियम आईडी, शीर्षक खोजें..." : "Search rule ID, title..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-500 w-52"
              />
            </div>

            <div className="flex items-center gap-1 bg-white border border-slate-200 p-0.5 rounded-lg text-xs">
              {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    selectedSeverity === sev
                      ? "bg-slate-900 text-white font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {sev === "ALL" && isHindi ? "सभी" : sev}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-24">{isHindi ? "नियम आईडी" : "Rule ID"}</th>
                <th className="py-3 px-4">{isHindi ? "दिशानिर्देश शीर्षक व सांविधिक स्रोत" : "Guideline Title & Statutory Source"}</th>
                <th className="py-3 px-4">{isHindi ? "श्रेणी" : "Category"}</th>
                <th className="py-3 px-4 text-center">{isHindi ? "प्रभावित कार्य" : "Affected Works"}</th>
                <th className="py-3 px-4 text-center">{isHindi ? "गंभीरता" : "Severity"}</th>
                <th className="py-3 px-4">{isHindi ? "सीमा विनिर्देश" : "Threshold Specification"}</th>
                <th className="py-3 px-4 text-right">{isHindi ? "नीति संदर्भ" : "Policy Reference"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRules.map((rule) => (
                <tr
                  key={rule.rule_id}
                  onClick={() => onSelectRule?.(rule)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 group-hover:text-blue-700">
                    {rule.rule_id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 group-hover:text-blue-700">
                      {rule.title}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {rule.source_document}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{rule.category}</td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-red-600">
                    {rule.affected_works.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <RiskBadge severity={rule.severity} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs text-[11px]">
                    {rule.threshold_description}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {rule.policy_version}
                    </span>
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
