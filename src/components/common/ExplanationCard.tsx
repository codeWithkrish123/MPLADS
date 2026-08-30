import React from "react";
import { getFactorExplanation, neutralizeText } from "../../lib/terminology";

interface ExplanationCardProps {
  type: string;
  score?: number;
  reason?: string;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({ type, score, reason }) => {
  const mapped = getFactorExplanation(type);
  const description = neutralizeText(reason || mapped.description);

  return (
    <article className="rounded-md border border-[#E2E8F0] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">{type}</p>
          <h3 className="mt-1 text-sm font-semibold text-[#0F172A]">{mapped.title}</h3>
        </div>
        {score !== undefined && score !== null && (
          <span className="shrink-0 rounded border border-[#BFDBFE] bg-[#EFF6FF] px-2 py-1 text-xs font-semibold tabular-nums text-[#1D4ED8]">
            {score}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[#334155]">{description}</p>
    </article>
  );
};
