import React, { useState, useEffect } from "react";
import { Search, X, ShieldAlert, FileText, Building2, MapPin, ArrowRight } from "lucide-react";
import { WorkRecord, RiskAlert, DistrictSummary, ComplianceRule } from "../../types";
import { RiskBadge } from "./RiskBadge";
import { formatINR } from "../../lib/utils";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  works: WorkRecord[];
  alerts: RiskAlert[];
  districts: DistrictSummary[];
  rules: ComplianceRule[];
  onSelectWork: (work: WorkRecord) => void;
  onNavigate: (view: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  works,
  alerts,
  districts,
  rules,
  onSelectWork,
  onNavigate,
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Toggle or open handled by parent
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredWorks = works.filter(
    (w) =>
      w.work_id.toLowerCase().includes(q) ||
      w.description.toLowerCase().includes(q) ||
      w.district.toLowerCase().includes(q) ||
      w.category.toLowerCase().includes(q) ||
      w.agency.toLowerCase().includes(q)
  );

  const filteredDistricts = districts.filter(
    (d) =>
      d.district.toLowerCase().includes(q) ||
      d.state.toLowerCase().includes(q)
  );

  const filteredAlerts = alerts.filter(
    (a) =>
      a.work_id.toLowerCase().includes(q) ||
      a.reason.toLowerCase().includes(q) ||
      a.district.toLowerCase().includes(q)
  );

  const filteredRules = rules.filter(
    (r) =>
      r.rule_id.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
  );

  return (
    <div
      id="command-palette-modal"
      className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-20 bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search works by ID, name, district, agency, alert or compliance rule..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 text-sm font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Navigation suggestions when search is empty */}
          {!q && (
            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
                Quick Jump
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: "National Overview", view: "overview", icon: Building2 },
                  { label: "Works Intelligence Table", view: "works", icon: FileText },
                  { label: "Risk Alert Inbox", view: "alerts", icon: ShieldAlert },
                  { label: "Near-Duplicate Detection", view: "duplicate", icon: FileText },
                  { label: "Cost Anomaly Benchmarks", view: "analytics", icon: FileText },
                  { label: "Delay Prediction Engine", view: "delay", icon: FileText },
                  { label: "Ask MPLADS AI", view: "aiAssistant", icon: ShieldAlert },
                  { label: "Compliance Center", view: "compliance", icon: FileText },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.view}
                      onClick={() => {
                        onNavigate(item.view);
                        onClose();
                      }}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 text-slate-700 text-left transition-colors"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <Icon className="w-3.5 h-3.5 text-slate-500" />
                        {item.label}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Works Results */}
          {filteredWorks.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
                Monitored Works ({filteredWorks.length})
              </div>
              <div className="space-y-1">
                {filteredWorks.slice(0, 5).map((work) => (
                  <div
                    key={work.work_id}
                    onClick={() => {
                      onSelectWork(work);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-slate-100 flex items-center justify-between gap-3 cursor-pointer transition-colors border border-transparent hover:border-slate-200"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{work.work_id}</span>
                        <span className="text-slate-600 font-medium truncate">{work.category}</span>
                      </div>
                      <p className="text-slate-500 text-[11px] truncate mt-0.5">{work.description}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                        <span>{work.district}, {work.state}</span>
                        <span>•</span>
                        <span>{formatINR(work.sanctioned_cost)}</span>
                      </div>
                    </div>
                    <RiskBadge severity={work.risk_category} score={work.risk_score} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Districts Results */}
          {filteredDistricts.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
                Districts ({filteredDistricts.length})
              </div>
              <div className="space-y-1">
                {filteredDistricts.slice(0, 3).map((dist) => (
                  <div
                    key={dist.district}
                    onClick={() => {
                      onNavigate("districtIntel");
                      onClose();
                    }}
                    className="p-2 rounded-lg hover:bg-slate-100 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-800">{dist.district}, {dist.state}</span>
                      <span className="text-slate-400">({dist.works_count} works)</span>
                    </div>
                    <RiskBadge severity={dist.risk_category} score={dist.risk_score} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alerts Results */}
          {filteredAlerts.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
                Risk Alerts ({filteredAlerts.length})
              </div>
              <div className="space-y-1">
                {filteredAlerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      onNavigate("alerts");
                      onClose();
                    }}
                    className="p-2 rounded-lg hover:bg-slate-100 flex items-center justify-between cursor-pointer"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-medium text-slate-800 truncate">{alert.reason}</div>
                      <div className="text-[11px] text-slate-400">{alert.work_id} • {alert.district}</div>
                    </div>
                    <RiskBadge severity={alert.severity} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules Results */}
          {filteredRules.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
                Compliance Rules ({filteredRules.length})
              </div>
              <div className="space-y-1">
                {filteredRules.slice(0, 3).map((rule) => (
                  <div
                    key={rule.rule_id}
                    onClick={() => {
                      onNavigate("compliance");
                      onClose();
                    }}
                    className="p-2 rounded-lg hover:bg-slate-100 flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <span className="font-mono font-bold text-slate-800 mr-2">{rule.rule_id}</span>
                      <span className="text-slate-700">{rule.title}</span>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      {rule.policy_version}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {q && filteredWorks.length === 0 && filteredDistricts.length === 0 && (
            <div className="py-8 text-center text-slate-400">
              No matching MPLADS records found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Navigate with ↵ / ↑ / ↓</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
