import React from "react";
import { FileQuestion, Info } from "lucide-react";
import { INSUFFICIENT_DATA_HEADING, PROJECT_NOT_FOUND_HEADING } from "../../lib/terminology";
import { ApiError } from "../../services/api";

function detailLines(error: ApiError): string[] {
  const d = error.detail;
  if (!d) return error.message ? [error.message] : [];
  if (typeof d === "string") return [d];
  if (Array.isArray(d)) return d.map((item) => (typeof item === "string" ? item : JSON.stringify(item)));
  if (typeof d === "object") {
    const rec = d as Record<string, unknown>;
    const parts = [rec.message, rec.detail, rec.reason, rec.explanation]
      .filter((v) => typeof v === "string" && v.trim())
      .map(String);
    return parts.length ? parts : [error.message];
  }
  return [error.message];
}

export const InsufficientAnalyticalDataState: React.FC<{ error?: ApiError | null }> = ({ error }) => {
  const extra = error ? detailLines(error).filter((line) => line !== INSUFFICIENT_DATA_HEADING) : [];
  return (
    <div className="rounded-md border border-[#FDE68A] bg-[#FFFBEB] p-6">
      <div className="flex items-start gap-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#B45309]" aria-hidden="true" />
        <div>
          <h2 className="text-base font-semibold text-[#92400E]">Insufficient analytical data</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#78350F]">{INSUFFICIENT_DATA_HEADING}</p>
          {extra.map((line, i) => (
            <p key={i} className="mt-2 text-sm text-[#92400E]">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ProjectNotFoundState: React.FC<{ error?: ApiError | null }> = ({ error }) => {
  const extra = error ? detailLines(error).filter((line) => line !== PROJECT_NOT_FOUND_HEADING) : [];
  return (
    <div className="rounded-md border border-[#E2E8F0] bg-white p-8 text-center">
      <FileQuestion className="mx-auto h-10 w-10 text-[#94A3B8]" aria-hidden="true" />
      <h2 className="mt-3 text-base font-semibold text-[#0F172A]">Project not found</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-[#475569]">{PROJECT_NOT_FOUND_HEADING}</p>
      {extra.map((line, i) => (
        <p key={i} className="mt-2 text-sm text-[#64748B]">
          {line}
        </p>
      ))}
    </div>
  );
};

export const ApiErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="rounded-md border border-[#FECACA] bg-[#FEF2F2] p-5 text-sm text-[#991B1B]">
    <p>{message}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 rounded-md border border-[#FECACA] bg-white px-3 py-1.5 text-xs font-semibold text-[#991B1B] hover:bg-[#FEF2F2] focus-visible:outline-2 focus-visible:outline-[#003399]"
      >
        Try again
      </button>
    )}
  </div>
);

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => (
  <div className="space-y-3" aria-busy="true" aria-label="Loading">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-20 animate-pulse rounded-md bg-[#E2E8F0]" />
    ))}
  </div>
);
