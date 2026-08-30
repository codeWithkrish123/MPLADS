import React from "react";
import { Info } from "lucide-react";
import { LEGAL_DISCLAIMER_TEXT } from "../../lib/terminology";

interface LegalDisclaimerProps {
  className?: string;
  compact?: boolean;
}

export const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({
  className = "",
  compact = false,
}) => {
  return (
    <aside
      role="note"
      aria-label="Legal disclaimer"
      className={[
        "flex items-start gap-2.5 rounded-md border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-2.5 text-xs text-[#1E3A8A]",
        compact ? "text-[11px]" : "",
        className,
      ].join(" ")}
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#1D4ED8]" aria-hidden="true" />
      <p className="leading-relaxed font-sans">{LEGAL_DISCLAIMER_TEXT}</p>
    </aside>
  );
};
