import React, { useState } from "react";
import { LegalDisclaimer } from "../components/common/LegalDisclaimer";
import { ExplanationCard } from "../components/common/ExplanationCard";
import { RiskBadge } from "../components/common/RiskBadge";
import {
  ApiErrorState,
  InsufficientAnalyticalDataState,
  ProjectNotFoundState,
} from "../components/common/AnalyticalStatus";
import { sentinelApi, ApiError } from "../services/api";
import { AnalyzePayload, AnalyzeResult } from "../types";
import { formatScore, hasNumericScore, toRiskSeverity } from "../lib/format";

const emptyForm: AnalyzePayload = {
  work_id: "",
  district_name: "",
  work_category: "",
  work_description: "",
  sanctioned_amount: 0,
  total_expenditure: 0,
  sanction_date: "",
  work_status: "",
};

export const RiskSimulatorView: React.FC = () => {
  const [form, setForm] = useState<AnalyzePayload>(emptyForm);
  const [amountStr, setAmountStr] = useState("");
  const [expStr, setExpStr] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  const inputCls =
    "w-full rounded-md border border-[#CBD5E1] bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-[#003399]";

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.work_id.trim()) next.work_id = "Work ID is required.";
    if (!form.district_name.trim()) next.district_name = "District is required.";
    if (!form.work_category.trim()) next.work_category = "Work category is required.";
    if (!form.work_description.trim()) next.work_description = "Description is required.";
    const sanctioned = Number(amountStr);
    const expenditure = Number(expStr);
    if (!amountStr || !Number.isFinite(sanctioned) || sanctioned < 0) next.sanctioned_amount = "Enter a valid sanctioned amount.";
    if (!expStr || !Number.isFinite(expenditure) || expenditure < 0) next.total_expenditure = "Enter a valid expenditure.";
    if (!form.sanction_date) next.sanction_date = "Sanction date is required.";
    if (!form.work_status.trim()) next.work_status = "Work status is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError(null);
    setResult(null);
    sentinelApi
      .analyzePreview({
        ...form,
        sanctioned_amount: Number(amountStr),
        total_expenditure: Number(expStr),
      })
      .then(setResult)
      .catch((err) => {
        setApiError(err instanceof ApiError ? err : new ApiError(0, "Unable to run preview analysis."));
      })
      .finally(() => setLoading(false));
  };

  const reset = () => {
    setForm(emptyForm);
    setAmountStr("");
    setExpStr("");
    setErrors({});
    setApiError(null);
    setResult(null);
  };

  return (
    <div className="space-y-5">
      <header className="border-b border-[#E2E8F0] pb-4">
        <nav className="text-xs text-[#64748B]" aria-label="Breadcrumb">
          Home / Real-Time Risk Simulator
        </nav>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Real-Time Risk Simulator</h1>
        <p className="mt-1 max-w-3xl text-sm text-[#475569]">
          Preview-only scoring. Results are not saved and are not a legal finding. Use them to understand how indicators respond to project inputs.
        </p>
      </header>

      <LegalDisclaimer />

      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 rounded-md border border-[#E2E8F0] bg-white p-4 sm:grid-cols-2">
        <Field label="Work ID" error={errors.work_id}>
          <input className={inputCls} value={form.work_id} onChange={(e) => setForm({ ...form, work_id: e.target.value })} />
        </Field>
        <Field label="District name" error={errors.district_name}>
          <input className={inputCls} value={form.district_name} onChange={(e) => setForm({ ...form, district_name: e.target.value })} />
        </Field>
        <Field label="Work category" error={errors.work_category}>
          <input className={inputCls} value={form.work_category} onChange={(e) => setForm({ ...form, work_category: e.target.value })} />
        </Field>
        <Field label="Work status" error={errors.work_status}>
          <input className={inputCls} value={form.work_status} onChange={(e) => setForm({ ...form, work_status: e.target.value })} />
        </Field>
        <Field label="Sanctioned amount (₹)" error={errors.sanctioned_amount}>
          <input className={inputCls} inputMode="decimal" value={amountStr} onChange={(e) => setAmountStr(e.target.value)} />
        </Field>
        <Field label="Total expenditure (₹)" error={errors.total_expenditure}>
          <input className={inputCls} inputMode="decimal" value={expStr} onChange={(e) => setExpStr(e.target.value)} />
        </Field>
        <Field label="Sanction date" error={errors.sanction_date}>
          <input type="date" className={inputCls} value={form.sanction_date} onChange={(e) => setForm({ ...form, sanction_date: e.target.value })} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Work description" error={errors.work_description}>
            <textarea
              className={`${inputCls} min-h-[88px]`}
              value={form.work_description}
              onChange={(e) => setForm({ ...form, work_description: e.target.value })}
            />
          </Field>
        </div>
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-[#003399] px-4 py-2 text-sm font-semibold text-white hover:bg-[#002266] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003399]"
          >
            {loading ? "Running preview…" : "Run preview"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-[#CBD5E1] bg-white px-4 py-2 text-sm font-semibold text-[#0F172A] hover:bg-[#F8FAFC] focus-visible:outline-2 focus-visible:outline-[#003399]"
          >
            Reset form
          </button>
        </div>
      </form>

      {apiError?.isInsufficientData && <InsufficientAnalyticalDataState error={apiError} />}
      {apiError?.isNotFound && <ProjectNotFoundState error={apiError} />}
      {apiError && !apiError.isInsufficientData && !apiError.isNotFound && (
        <ApiErrorState message={apiError.message} />
      )}

      {result && (
        <section className="space-y-3 rounded-md border border-[#E2E8F0] bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-[#0F172A]">Preview result</h2>
            <span className="rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#1D4ED8]">
              Not saved
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {hasNumericScore(result.composite_risk_score) ? (
              <>
                <p className="text-sm text-[#475569]">
                  Composite score: <span className="font-semibold tabular-nums text-[#0F172A]">{formatScore(result.composite_risk_score)}</span>
                </p>
                <RiskBadge severity={toRiskSeverity(result.risk_level)} score={Number(result.composite_risk_score)} />
              </>
            ) : (
              <p className="text-sm text-[#64748B]">A reliable composite score is not available for this preview.</p>
            )}
          </div>
          <LegalDisclaimer compact />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {(result.factors || []).map((f, i) => (
              <ExplanationCard key={`${f.type}-${i}`} type={f.type} score={f.score} reason={f.reason} />
            ))}
          </div>
          {(!result.factors || result.factors.length === 0) && (
            <p className="text-sm text-[#64748B]">No indicator factors were returned.</p>
          )}
        </section>
      )}
    </div>
  );
};

const Field: React.FC<{ label: string; error?: string; children: React.ReactNode }> = ({ label, error, children }) => (
  <label className="block text-sm">
    <span className="mb-1 block text-xs font-semibold text-[#475569]">{label}</span>
    {children}
    {error && <span className="mt-1 block text-xs text-[#B91C1C]">{error}</span>}
  </label>
);
