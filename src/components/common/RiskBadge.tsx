import React from "react";
import { ShieldCheck, AlertCircle, AlertTriangle, Flame } from "lucide-react";
import { RiskSeverity, Language } from "../../types";
import { cn } from "../../lib/utils";

interface RiskBadgeProps {
  severity: RiskSeverity;
  score?: number;
  showScore?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  id?: string;
  language?: Language;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  severity,
  score,
  showScore = true,
  size = "md",
  className,
  id,
  language = "en",
}) => {
  const isHindi = language === "hi";

  const getRiskConfig = () => {
    switch (severity) {
      case "CRITICAL":
        return {
          icon: Flame,
          label: isHindi ? "अति गंभीर" : "CRITICAL",
          bg: "bg-red-50 text-[#DC2626] border-red-200",
          dotBg: "bg-[#DC2626]",
          iconColor: "text-[#DC2626]",
        };
      case "HIGH":
        return {
          icon: AlertTriangle,
          label: isHindi ? "उच्च" : "HIGH",
          bg: "bg-amber-50 text-[#D97706] border-amber-200",
          dotBg: "bg-[#D97706]",
          iconColor: "text-[#D97706]",
        };
      case "MEDIUM":
        return {
          icon: AlertCircle,
          label: isHindi ? "मध्यम" : "MEDIUM",
          bg: "bg-amber-50/70 text-[#D97706] border-amber-200/80",
          dotBg: "bg-[#D97706]",
          iconColor: "text-[#D97706]",
        };
      case "LOW":
      default:
        return {
          icon: ShieldCheck,
          label: isHindi ? "कम" : "LOW",
          bg: "bg-emerald-50 text-[#059669] border-emerald-200",
          dotBg: "bg-[#059669]",
          iconColor: "text-[#059669]",
        };
    }
  };

  const config = getRiskConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5 font-semibold",
    lg: "px-3 py-1.5 text-sm gap-2 font-semibold",
  };

  return (
    <span
      id={id || `risk-badge-${severity.toLowerCase()}-${score || 'generic'}`}
      className={cn(
        "inline-flex items-center rounded-[6px] border tracking-wide font-sans transition-colors whitespace-nowrap",
        config.bg,
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label={`Risk Level: ${config.label} ${score !== undefined ? `Score ${score} out of 100` : ""}`}
    >
      <Icon className={cn("shrink-0", config.iconColor, size === "sm" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5")} />
      <span>{config.label}</span>
      {showScore && score !== undefined && (
        <span className="opacity-90 font-semibold tabular-nums">
          {score}
        </span>
      )}
    </span>
  );
};
