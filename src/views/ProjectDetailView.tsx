import React, { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { LegalDisclaimer } from "../components/common/LegalDisclaimer";
import { ExplanationCard } from "../components/common/ExplanationCard";
import { ProjectLocationMap } from "../components/common/ProjectLocationMap";
import { RiskBadge } from "../components/common/RiskBadge";
import {
  ApiErrorState,
  InsufficientAnalyticalDataState,
  LoadingSkeleton,
  ProjectNotFoundState,
} from "../components/common/AnalyticalStatus";
import { sentinelApi, ApiError } from "../services/api";
import { InvestigationDossier, ProjectDetail } from "../types";
import { formatAmount, hasNumericScore, toRiskSeverity } from "../lib/format";
import { getFactorExplanation, neutralizeText } from "../lib/terminology";

interface ProjectDetailViewProps {
  projectId: string;
  onBack: () => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ projectId, onBack }) => {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [investigation, setInvestigation] = useState<InvestigationDossier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const load = () => {
    setLoading(true);
    setError(null);
    setProject(null);
    sentinelApi
      .getProject(projectId)
      .then((detail) => {
        setProject(detail);
        return sentinelApi.getInvestigation(projectId).catch(() => null);
      })
      .then((inv) => {
        if (inv) setInvestigation(inv);
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err : new ApiError(0, "Unable to load project."));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const lat = project?.mock_visualization?.lat ?? project?.lat;
  const lng = project?.mock_visualization?.lng ?? project?.lng;

  const metaEntries = project
    ? Object.entries(project.metadata).filter(([, v]) => v !== undefined && v !== null && v !== "")
    : [];

  return (
    <div className="space-y-5">
      <header className="border-b border-[#E2E8F0] pb-4">
        <nav className="text-xs text-[#64748B]" aria-label="Breadcrumb">
          <button type="button" className="hover:underline focus-visible:outline-2 focus-visible:outline-[#003399]" onClick={onBack}>
            Project Review Queue
          </button>
          {" / "}Investigation Dossier
        </nav>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">Project detail</h1>
        <p className="mt-1 font-mono text-sm text-[#334155]">{projectId}</p>
      </header>

      <LegalDisclaimer />

      {loading && <LoadingSkeleton rows={6} />}

      {error?.isInsufficientData && <InsufficientAnalyticalDataState error={error} />}
      {error?.isNotFound && <ProjectNotFoundState error={error} />}
      {error && !error.isInsufficientData && !error.isNotFound && (
        <ApiErrorState message={error.message} onRetry={load} />
      )}

      {!loading && project && !error && (
        <>
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoTile label="Project ID" value={project.project_id} mono />
            <InfoTile label="State" value={project.state} />
            <InfoTile label="District" value={project.district} />
            <InfoTile label="Work category" value={project.work_category} />
            <InfoTile label="Sanctioned amount" value={formatAmount(project.sanctioned_amount)} />
            <InfoTile label="Total expenditure" value={formatAmount(project.total_expenditure)} />
            <div className="rounded-md border border-[#E2E8F0] bg-white p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">Priority score</p>
              {hasNumericScore(project.risk_score) ? (
                <div className="mt-2">
                  <RiskBadge severity={toRiskSeverity(project.risk_level)} score={Number(project.risk_score)} />
                </div>
              ) : (
                <p className="mt-2 text-sm text-[#64748B]">Not available</p>
              )}
            </div>
            <InfoTile label="Project status" value={project.project_status || project.work_status || "—"} />
          </section>

          {project.work_description && (
            <section className="rounded-md border border-[#E2E8F0] bg-white p-4">
              <h2 className="text-sm font-semibold text-[#0F172A]">Description</h2>
              <p className="mt-1 text-sm leading-relaxed text-[#334155]">{project.work_description}</p>
            </section>
          )}

          {metaEntries.length > 0 && (
            <section className="rounded-md border border-[#E2E8F0] bg-white p-4">
              <h2 className="text-sm font-semibold text-[#0F172A]">Additional metadata</h2>
              <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {metaEntries.slice(0, 12).map(([k, v]) => (
                  <div key={k} className="text-sm">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">{k.replace(/_/g, " ")}</dt>
                    <dd className="text-[#0F172A]">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <section>
            <h2 className="mb-3 text-base font-semibold text-[#0F172A]">Why this work is prioritised</h2>
            {project.factors.length === 0 ? (
              <p className="rounded-md border border-[#E2E8F0] bg-white p-4 text-sm text-[#64748B]">
                No indicator cards were returned for this record.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {project.factors.map((f, i) => (
                  <ExplanationCard key={`${f.type}-${i}`} type={f.type} score={f.score} reason={f.reason} />
                ))}
              </div>
            )}
          </section>

          <section className="rounded-md border border-[#E2E8F0] bg-white p-4">
            <h2 className="mb-3 text-base font-semibold text-[#0F172A]">Map location</h2>
            {typeof lat === "number" && typeof lng === "number" ? (
              <ProjectLocationMap lat={lat} lng={lng} label={project.project_id} />
            ) : (
              <p className="text-sm text-[#64748B]">Location coordinates were not provided for this project.</p>
            )}
          </section>

          <section className="rounded-md border border-[#E2E8F0] bg-white p-4">
            <h2 className="text-base font-semibold text-[#0F172A]">Investigation checklist</h2>
            <p className="mb-3 text-xs text-[#64748B]">Recommended validation steps. Check-off is local to this session and is not saved.</p>
            {investigation?.data_limitations && investigation.data_limitations.length > 0 && (
              <div className="mb-4 flex items-start gap-2 rounded-md border border-[#FDE68A] bg-[#FFFBEB] p-3 text-sm text-[#92400E]">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-semibold">Data limitations</p>
                  <ul className="mt-1 list-disc pl-4">
                    {investigation.data_limitations.map((line, i) => (
                      <li key={i}>{neutralizeText(line)}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {!investigation || investigation.recommendations.length === 0 ? (
              <p className="text-sm text-[#64748B]">No checklist items were returned for this project.</p>
            ) : (
              <ul className="space-y-2">
                {investigation.recommendations.map((item, i) => (
                  <li key={`${item.check_type}-${i}`} className="flex items-start gap-3 rounded-md border border-[#E2E8F0] p-3">
                    <input
                      id={`check-${i}`}
                      type="checkbox"
                      className="mt-1 h-4 w-4 accent-[#003399]"
                      checked={!!checked[i]}
                      onChange={(e) => setChecked((prev) => ({ ...prev, [i]: e.target.checked }))}
                    />
                    <label htmlFor={`check-${i}`} className="cursor-pointer">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                        {getFactorExplanation(item.check_type).title === item.check_type
                          ? item.check_type.replace(/_/g, " ")
                          : item.check_type}
                      </p>
                      <p className="text-sm text-[#0F172A]">{neutralizeText(item.action)}</p>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
};

const InfoTile: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => (
  <div className="rounded-md border border-[#E2E8F0] bg-white p-3">
    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">{label}</p>
    <p className={`mt-1 text-sm font-medium text-[#0F172A] ${mono ? "font-mono text-xs" : ""}`}>{value}</p>
  </div>
);
