import React, { useEffect, useState } from "react";
import { BarChart3, ShieldAlert, Activity, Gauge, Layers } from "lucide-react";
import { MetricCard } from "../components/common/MetricCard";
import { LegalDisclaimer } from "../components/common/LegalDisclaimer";
import { ApiErrorState, LoadingSkeleton } from "../components/common/AnalyticalStatus";
import { EmptyState } from "../components/common/EmptyState";
import { sentinelApi, ApiError } from "../services/api";
import { CategoryAnalyticsRow, DashboardSummary, StateAnalyticsRow } from "../types";
import { formatScore } from "../lib/format";
import { CITIZEN_COPY } from "../lib/terminology";

interface ExecutiveAuditDashboardViewProps {
  onNavigateToWorks?: () => void;
}

const LEVEL_ORDER = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const LEVEL_COLORS: Record<string, string> = {
  CRITICAL: "bg-[#DC2626]",
  HIGH: "bg-[#D97706]",
  MEDIUM: "bg-[#CA8A04]",
  LOW: "bg-[#059669]",
};

export const ExecutiveAuditDashboardView: React.FC<ExecutiveAuditDashboardViewProps> = ({
  onNavigateToWorks,
}) => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [states, setStates] = useState<StateAnalyticsRow[]>([]);
  const [categories, setCategories] = useState<CategoryAnalyticsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      sentinelApi.getDashboardSummary(),
      sentinelApi.getStateAnalytics(),
      sentinelApi.getCategoryAnalytics(),
    ])
      .then(([s, st, cat]) => {
        setSummary(s);
        setStates([...st].sort((a, b) => b.average_risk_score - a.average_risk_score));
        setCategories([...cat].sort((a, b) => b.average_risk_score - a.average_risk_score));
      })
      .catch((err) => {
        const msg = err instanceof ApiError ? err.message : "Unable to load dashboard data.";
        setError(msg);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const dist = summary?.risk_distribution || {};
  const distTotal = Object.values(dist).reduce((a, b) => a + b, 0) || 1;
  const distKeys = [
    ...LEVEL_ORDER.filter((k) => dist[k] !== undefined),
    ...Object.keys(dist).filter((k) => !LEVEL_ORDER.includes(k)),
  ];

  return (
    <div className="space-y-6">
      <header className="border-b border-[#E2E8F0] pb-4">
        <nav className="text-xs text-[#64748B]" aria-label="Breadcrumb">
          Home / Executive Audit Dashboard
        </nav>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Executive Audit Dashboard</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#475569]">
          National summary of analysed MPLADS works. Figures are statistical priority indicators for human review, not findings of misconduct.
        </p>
      </header>

      <LegalDisclaimer />

      {loading && <LoadingSkeleton rows={5} />}
      {error && <ApiErrorState message={error} onRetry={load} />}

      {!loading && !error && summary && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard
              title="Works analysed"
              value={summary.total_analyzed.toLocaleString("en-IN")}
              icon={Layers}
              accentColor="navy"
              subtitle="In the analytical cohort"
              sparklineData={[]}
              onClick={onNavigateToWorks}
            />
            <MetricCard
              title="Critical priority"
              value={summary.critical_count.toLocaleString("en-IN")}
              icon={ShieldAlert}
              accentColor="red"
              subtitle={CITIZEN_COPY.requiresValidation}
              sparklineData={[]}
              onClick={onNavigateToWorks}
            />
            <MetricCard
              title="High priority"
              value={summary.high_count.toLocaleString("en-IN")}
              icon={Activity}
              accentColor="amber"
              subtitle="Unusual patterns"
              sparklineData={[]}
              onClick={onNavigateToWorks}
            />
            <MetricCard
              title="Average priority score"
              value={formatScore(summary.average_risk_score)}
              icon={Gauge}
              accentColor="blue"
              subtitle="Across analysed works"
              sparklineData={[]}
            />
            <MetricCard
              title="Average confidence"
              value={formatScore(summary.average_confidence_score)}
              icon={BarChart3}
              accentColor="emerald"
              subtitle="Model confidence"
              sparklineData={[]}
            />
          </div>

          <section className="rounded-md border border-[#E2E8F0] bg-white p-4 sm:p-5">
            <h2 className="text-base font-semibold text-[#0F172A]">{CITIZEN_COPY.riskDistribution}</h2>
            <p className="mb-4 text-xs text-[#64748B]">Share of works by priority level</p>
            {distKeys.length === 0 ? (
              <EmptyState title="No distribution available" description="The API did not return priority distribution data." />
            ) : (
              <ul className="space-y-3">
                {distKeys.map((level) => {
                  const count = dist[level] ?? 0;
                  const pct = Math.round((count / distTotal) * 100);
                  return (
                    <li key={level}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#334155]">{level}</span>
                        <span className="tabular-nums text-[#64748B]">
                          {count.toLocaleString("en-IN")} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-[#F1F5F9]">
                        <div
                          className={`h-full ${LEVEL_COLORS[level] || "bg-[#003399]"}`}
                          style={{ width: `${Math.max(pct, count > 0 ? 2 : 0)}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <section className="overflow-hidden rounded-md border border-[#E2E8F0] bg-white">
              <div className="border-b border-[#E2E8F0] px-4 py-3">
                <h2 className="text-base font-semibold text-[#0F172A]">State leaderboard</h2>
                <p className="text-xs text-[#64748B]">Average priority score and high-priority count</p>
              </div>
              {states.length === 0 ? (
                <div className="p-4">
                  <EmptyState title="No state analytics" description="No state-level records were returned." />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#64748B]">
                      <tr>
                        <th className="px-4 py-2 font-semibold">State</th>
                        <th className="px-4 py-2 font-semibold">Projects</th>
                        <th className="px-4 py-2 font-semibold">Avg score</th>
                        <th className="px-4 py-2 font-semibold">High priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {states.slice(0, 12).map((row) => (
                        <tr key={row.state_name} className="border-t border-[#E2E8F0]">
                          <td className="px-4 py-2.5 font-medium text-[#0F172A]">{row.state_name}</td>
                          <td className="px-4 py-2.5 tabular-nums">{row.project_count.toLocaleString("en-IN")}</td>
                          <td className="px-4 py-2.5 tabular-nums">{formatScore(row.average_risk_score)}</td>
                          <td className="px-4 py-2.5 tabular-nums">{row.high_risk_count.toLocaleString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="overflow-hidden rounded-md border border-[#E2E8F0] bg-white">
              <div className="border-b border-[#E2E8F0] px-4 py-3">
                <h2 className="text-base font-semibold text-[#0F172A]">Category leaderboard</h2>
                <p className="text-xs text-[#64748B]">Work category, volume, and critical-priority count</p>
              </div>
              {categories.length === 0 ? (
                <div className="p-4">
                  <EmptyState title="No category analytics" description="No category records were returned." />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#64748B]">
                      <tr>
                        <th className="px-4 py-2 font-semibold">Category</th>
                        <th className="px-4 py-2 font-semibold">Projects</th>
                        <th className="px-4 py-2 font-semibold">Avg score</th>
                        <th className="px-4 py-2 font-semibold">Critical</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.slice(0, 12).map((row) => (
                        <tr key={row.category_name} className="border-t border-[#E2E8F0]">
                          <td className="px-4 py-2.5 font-medium text-[#0F172A]">{row.category_name}</td>
                          <td className="px-4 py-2.5 tabular-nums">{row.project_count.toLocaleString("en-IN")}</td>
                          <td className="px-4 py-2.5 tabular-nums">{formatScore(row.average_risk_score)}</td>
                          <td className="px-4 py-2.5 tabular-nums">{row.critical_count.toLocaleString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
};
