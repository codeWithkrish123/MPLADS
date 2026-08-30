import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Search } from "lucide-react";
import { LegalDisclaimer } from "../components/common/LegalDisclaimer";
import { ApiErrorState, LoadingSkeleton } from "../components/common/AnalyticalStatus";
import { EmptyState } from "../components/common/EmptyState";
import { RiskBadge } from "../components/common/RiskBadge";
import { sentinelApi, ApiError } from "../services/api";
import { CategoryAnalyticsRow, ProjectListItem, SearchSuggestion } from "../types";
import { formatAmount, formatScore, hasNumericScore, toRiskSeverity } from "../lib/format";

interface ProjectReviewQueueViewProps {
  onOpenProject: (projectId: string) => void;
}

const PAGE_SIZE = 10;

const defaultFilters = {
  q: "",
  state: "",
  district: "",
  house: "",
  risk_level: "",
  work_category: "",
  min_risk: "",
  max_risk: "",
  sort_by: "risk_score",
  sort_order: "desc" as "asc" | "desc",
};

export const ProjectReviewQueueView: React.FC<ProjectReviewQueueViewProps> = ({ onOpenProject }) => {
  const [filters, setFilters] = useState(defaultFilters);
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<ProjectListItem[]>([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryAnalyticsRow[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQ(filters.q), 350);
    return () => window.clearTimeout(t);
  }, [filters.q]);

  useEffect(() => {
    sentinelApi.getCategoryAnalytics().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!debouncedQ.trim()) {
      setSuggestions([]);
      return;
    }
    const t = window.setTimeout(() => {
      sentinelApi
        .search(debouncedQ, 8)
        .then(setSuggestions)
        .catch(() => setSuggestions([]));
    }, 200);
    return () => window.clearTimeout(t);
  }, [debouncedQ]);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    sentinelApi
      .getProjects({
        q: debouncedQ || undefined,
        state: filters.state || undefined,
        district: filters.district || undefined,
        house: filters.house || undefined,
        risk_level: filters.risk_level || undefined,
        work_category: filters.work_category || undefined,
        min_risk: filters.min_risk === "" ? undefined : Number(filters.min_risk),
        max_risk: filters.max_risk === "" ? undefined : Number(filters.max_risk),
        sort_by: filters.sort_by,
        sort_order: filters.sort_order,
        page,
        page_size: PAGE_SIZE,
      })
      .then((res) => {
        setItems(res.items);
        setTotalMatches(res.total_matches);
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Unable to load projects.");
        setItems([]);
        setTotalMatches(0);
      })
      .finally(() => setLoading(false));
  }, [
    debouncedQ,
    filters.state,
    filters.district,
    filters.house,
    filters.risk_level,
    filters.work_category,
    filters.min_risk,
    filters.max_risk,
    filters.sort_by,
    filters.sort_order,
    page,
  ]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQ, filters.state, filters.district, filters.house, filters.risk_level, filters.work_category, filters.min_risk, filters.max_risk, filters.sort_by, filters.sort_order]);

  const totalPages = Math.max(1, Math.ceil(totalMatches / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const activeFilters = useMemo(() => {
    const chips: string[] = [];
    if (debouncedQ) chips.push(`Search: ${debouncedQ}`);
    if (filters.state) chips.push(`State: ${filters.state}`);
    if (filters.district) chips.push(`District: ${filters.district}`);
    if (filters.house) chips.push(`House: ${filters.house}`);
    if (filters.risk_level) chips.push(`Priority: ${filters.risk_level}`);
    if (filters.work_category) chips.push(`Category: ${filters.work_category}`);
    if (filters.min_risk !== "") chips.push(`Min score: ${filters.min_risk}`);
    if (filters.max_risk !== "") chips.push(`Max score: ${filters.max_risk}`);
    return chips;
  }, [debouncedQ, filters]);

  const set = (key: keyof typeof defaultFilters, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const inputCls =
    "w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#0F172A] focus-visible:outline-2 focus-visible:outline-[#003399]";

  return (
    <div className="space-y-5">
      <header className="border-b border-[#E2E8F0] pb-4">
        <nav className="text-xs text-[#64748B]" aria-label="Breadcrumb">
          Home / Project Review Queue
        </nav>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Project Review Queue</h1>
        <p className="mt-1 text-sm text-[#475569]">
          Search and filter analysed works. Open a record to view its investigation dossier.
        </p>
      </header>

      <LegalDisclaimer compact />

      <form
        className="grid grid-cols-1 gap-3 rounded-md border border-[#E2E8F0] bg-white p-4 sm:grid-cols-2 lg:grid-cols-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="relative sm:col-span-2" ref={searchRef}>
          <label htmlFor="queue-search" className="mb-1 block text-xs font-semibold text-[#475569]">
            Search
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
            <input
              id="queue-search"
              className={`${inputCls} pl-9`}
              value={filters.q}
              onChange={(e) => set("q", e.target.value)}
              onFocus={() => setShowSuggest(true)}
              onBlur={() => window.setTimeout(() => setShowSuggest(false), 200)}
              placeholder="Work ID, district, or description"
              autoComplete="off"
            />
          </div>
          {showSuggest && suggestions.length > 0 && (
            <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-[#E2E8F0] bg-white shadow-md">
              {suggestions.map((s) => (
                <li key={s.project_id}>
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm hover:bg-[#EFF6FF] focus-visible:bg-[#EFF6FF] focus-visible:outline-none"
                    onMouseDown={() => {
                      set("q", s.project_id);
                      onOpenProject(s.project_id);
                    }}
                  >
                    <span className="font-medium text-[#0F172A]">{s.project_id}</span>
                    <span className="ml-2 text-xs text-[#64748B]">{s.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label htmlFor="queue-state" className="mb-1 block text-xs font-semibold text-[#475569]">State</label>
          <input id="queue-state" className={inputCls} value={filters.state} onChange={(e) => set("state", e.target.value)} />
        </div>
        <div>
          <label htmlFor="queue-district" className="mb-1 block text-xs font-semibold text-[#475569]">District</label>
          <input id="queue-district" className={inputCls} value={filters.district} onChange={(e) => set("district", e.target.value)} />
        </div>
        <div>
          <label htmlFor="queue-house" className="mb-1 block text-xs font-semibold text-[#475569]">House</label>
          <select id="queue-house" className={inputCls} value={filters.house} onChange={(e) => set("house", e.target.value)}>
            <option value="">All</option>
            <option value="LOK_SABHA">LOK_SABHA</option>
            <option value="RAJYA_SABHA">RAJYA_SABHA</option>
          </select>
        </div>
        <div>
          <label htmlFor="queue-risk" className="mb-1 block text-xs font-semibold text-[#475569]">Priority level</label>
          <select id="queue-risk" className={inputCls} value={filters.risk_level} onChange={(e) => set("risk_level", e.target.value)}>
            <option value="">All</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
        <div>
          <label htmlFor="queue-cat" className="mb-1 block text-xs font-semibold text-[#475569]">Work category</label>
          <select id="queue-cat" className={inputCls} value={filters.work_category} onChange={(e) => set("work_category", e.target.value)}>
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c.category_name} value={c.category_name}>{c.category_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="queue-min" className="mb-1 block text-xs font-semibold text-[#475569]">Minimum score</label>
          <input id="queue-min" type="number" min={0} max={100} className={inputCls} value={filters.min_risk} onChange={(e) => set("min_risk", e.target.value)} />
        </div>
        <div>
          <label htmlFor="queue-max" className="mb-1 block text-xs font-semibold text-[#475569]">Maximum score</label>
          <input id="queue-max" type="number" min={0} max={100} className={inputCls} value={filters.max_risk} onChange={(e) => set("max_risk", e.target.value)} />
        </div>
        <div>
          <label htmlFor="queue-sort" className="mb-1 block text-xs font-semibold text-[#475569]">Sort field</label>
          <select id="queue-sort" className={inputCls} value={filters.sort_by} onChange={(e) => set("sort_by", e.target.value)}>
            <option value="risk_score">Priority score</option>
            <option value="sanctioned_amount">Sanctioned amount</option>
            <option value="total_expenditure">Expenditure</option>
            <option value="state">State</option>
            <option value="project_id">Project ID</option>
          </select>
        </div>
        <div>
          <label htmlFor="queue-order" className="mb-1 block text-xs font-semibold text-[#475569]">Order</label>
          <select id="queue-order" className={inputCls} value={filters.sort_order} onChange={(e) => set("sort_order", e.target.value as "asc" | "desc")}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => {
              setFilters(defaultFilters);
              setDebouncedQ("");
              setPage(1);
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-sm font-semibold text-[#0F172A] hover:bg-[#F8FAFC] focus-visible:outline-2 focus-visible:outline-[#003399]"
          >
            <RotateCcw className="h-4 w-4" />
            Reset filters
          </button>
        </div>
      </form>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2" aria-label="Active filters">
          {activeFilters.map((chip) => (
            <span key={chip} className="rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-2.5 py-1 text-xs font-medium text-[#1E3A8A]">
              {chip}
            </span>
          ))}
          <span className="self-center text-xs text-[#64748B]">{totalMatches.toLocaleString("en-IN")} matches</span>
        </div>
      )}

      {error && <ApiErrorState message={error} onRetry={load} />}
      {loading && <LoadingSkeleton rows={6} />}

      {!loading && !error && items.length === 0 && (
        <EmptyState title="No matching projects" description="No records match the current filters. Reset filters or try a different search." />
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <div className="hidden overflow-hidden rounded-md border border-[#E2E8F0] bg-white md:block">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#64748B]">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Project ID</th>
                  <th className="px-4 py-2.5 font-semibold">State / District</th>
                  <th className="px-4 py-2.5 font-semibold">Category</th>
                  <th className="px-4 py-2.5 font-semibold">Sanctioned</th>
                  <th className="px-4 py-2.5 font-semibold">Expenditure</th>
                  <th className="px-4 py-2.5 font-semibold">Priority</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr
                    key={row.project_id}
                    className="cursor-pointer border-t border-[#E2E8F0] hover:bg-[#F8FAFC]"
                    onClick={() => onOpenProject(row.project_id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onOpenProject(row.project_id);
                      }
                    }}
                    tabIndex={0}
                    role="link"
                  >
                    <td className="px-4 py-2.5 font-mono text-xs font-semibold text-[#003399]">{row.project_id}</td>
                    <td className="px-4 py-2.5">{row.district}, {row.state}</td>
                    <td className="px-4 py-2.5">{row.work_category}</td>
                    <td className="px-4 py-2.5 tabular-nums">{formatAmount(row.sanctioned_amount)}</td>
                    <td className="px-4 py-2.5 tabular-nums">{formatAmount(row.total_expenditure)}</td>
                    <td className="px-4 py-2.5">
                      {hasNumericScore(row.risk_score) ? (
                        <RiskBadge severity={toRiskSeverity(row.risk_level)} score={Number(row.risk_score)} />
                      ) : (
                        <span className="text-xs text-[#64748B]">Score unavailable</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {items.map((row) => (
              <button
                key={row.project_id}
                type="button"
                onClick={() => onOpenProject(row.project_id)}
                className="w-full rounded-md border border-[#E2E8F0] bg-white p-4 text-left focus-visible:outline-2 focus-visible:outline-[#003399]"
              >
                <p className="font-mono text-xs font-semibold text-[#003399]">{row.project_id}</p>
                <p className="mt-1 text-sm font-medium text-[#0F172A]">{row.work_category}</p>
                <p className="text-xs text-[#64748B]">{row.district}, {row.state}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs">{formatAmount(row.sanctioned_amount)}</span>
                  {hasNumericScore(row.risk_score) ? (
                    <RiskBadge severity={toRiskSeverity(row.risk_level)} score={Number(row.risk_score)} size="sm" />
                  ) : (
                    <span className="text-xs text-[#64748B]">Score unavailable</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <p className="text-[#64748B]">
              Page {page} of {totalPages} · {totalMatches.toLocaleString("en-IN")} matches
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 rounded-md border border-[#CBD5E1] bg-white px-3 py-1.5 font-semibold disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#003399]"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex items-center gap-1 rounded-md border border-[#CBD5E1] bg-white px-3 py-1.5 font-semibold disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-[#003399]"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
