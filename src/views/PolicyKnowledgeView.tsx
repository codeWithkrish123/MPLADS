import React, { useState } from "react";
import {
  BookOpen,
  Search,
  FileText,
  ExternalLink,
  Shield,
  CheckCircle,
  Clock,
  Filter,
  Download,
} from "lucide-react";
import { ComplianceRule, Language } from "../types";
import { getTranslation } from "../data/translations";

interface PolicyKnowledgeViewProps {
  rules: ComplianceRule[];
  language?: Language;
}

export const PolicyKnowledgeView: React.FC<PolicyKnowledgeViewProps> = ({ rules, language = "en" }) => {
  const currentLang: Language = (language || "en") as Language;
  const isHindi = currentLang === "hi";
  const t = getTranslation(currentLang);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const filteredRules = rules.filter((r) => {
    const matchSearch =
      r.rule_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.policy_statement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === "ALL" || r.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div id="policy-knowledge-center-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-[11px] font-bold rounded font-mono uppercase">
              {isHindi ? "संसदीय ज्ञान कोष" : "Parliamentary Knowledge Base"}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {isHindi ? "सांविधिक नीति संग्रह" : "Statutory Policy Corpus"}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            {isHindi ? "एमपीलैड्स नीति एवं विनियामक ज्ञान केंद्र" : "MPLADS Policy & Regulatory Knowledge Center"}
          </h1>
          <p className="text-xs text-slate-600">
            {isHindi
              ? "आधिकारिक सांविधिक उद्धरण, प्रभावी परिपत्र, व्यय सीमाएं, और संहिताबद्ध एल्गोरिथम ऑडिट तर्क।"
              : "Official statutory citations, operative circulars, expenditure thresholds, and codified algorithmic audit logic."}
          </p>
        </div>

        <button
          onClick={() => alert(isHindi ? "संशोधित एमपीलैड्स दिशानिर्देश 2023 गजट पीडीएफ डाउनलोड हो रहा है..." : "Downloading Complete Revised MPLADS Guidelines 2023 Gazette PDF...")}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>{isHindi ? "पूर्ण दिशानिर्देश गजट (PDF)" : "Full Guidelines Gazette (PDF)"}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={isHindi ? "नीति परिपत्र, नियम संख्या, कीवर्ड खोजें..." : "Search policy circulars, rule numbers, keywords (e.g. 'tranche', 'geotag', 'trust')..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 hover:bg-white border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-500 transition-colors text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">{isHindi ? "श्रेणी:" : "Category:"}</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">{isHindi ? "सभी श्रेणियां" : "All Categories"}</option>
            <option value="Eligibility">{isHindi ? "पात्रता एवं निषेध" : "Eligibility & Prohibitions"}</option>
            <option value="Financial">{isHindi ? "वित्तीय एवं किश्त सीमाएं" : "Financial & Tranche Limits"}</option>
            <option value="Timeline">{isHindi ? "समयसीमा एवं हस्तांतरण" : "Timelines & Handover"}</option>
            <option value="Procurement">{isHindi ? "खरीद एवं निविदाएं" : "Procurement & Tenders"}</option>
            <option value="Audit">{isHindi ? "ऑडिट एवं माप पुस्तक" : "Audit & Measurement Book"}</option>
          </select>
        </div>
      </div>

      {/* Policy Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRules.map((rule) => (
          <div
            key={rule.rule_id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  {rule.rule_id}
                </span>
                <span className="text-[11px] font-mono text-slate-500 font-medium">
                  {rule.effective_date}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {rule.title}
              </h3>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700 italic leading-relaxed">
                &ldquo;{rule.policy_statement}&rdquo;
              </div>

              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">{isHindi ? "स्रोत दस्तावेज:" : "Source Document:"}</span>
                  <span className="font-mono font-semibold text-slate-800">{rule.source_document}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">{isHindi ? "संहिताकृत जांच तर्क:" : "Codified Detection Logic:"}</span>
                  <span className="text-slate-700 font-medium">{rule.threshold_description}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 font-mono text-emerald-700 font-semibold text-[11px]">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                {isHindi ? "सक्रिय निगरानी" : "Active Surveillance"}
              </span>
              <span className="text-slate-400 font-mono text-[10px]">
                {rule.policy_version}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
