import React from "react";
import { LucideIcon, TrendingUp, TrendingDown, Info } from "lucide-react";
import { cn } from "../../lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositiveChange?: boolean; // depends on context: e.g. risk signals dropping is good
  isGoodTrend?: boolean;
  icon: LucideIcon;
  sparklineData?: number[];
  tooltip?: string;
  accentColor?: "navy" | "red" | "amber" | "emerald" | "blue";
  id?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  isGoodTrend = true,
  icon: Icon,
  sparklineData = [12, 18, 15, 24, 28, 22, 34, 30],
  tooltip,
  accentColor = "blue",
  id,
  onClick,
}) => {
  const getIconColor = () => {
    switch (accentColor) {
      case "red":
        return "bg-red-50 text-[#DC2626] border-red-100";
      case "amber":
        return "bg-amber-50 text-[#D97706] border-amber-100";
      case "emerald":
        return "bg-emerald-50 text-[#059669] border-emerald-100";
      case "blue":
      case "navy":
      default:
        return "bg-blue-50 text-[#1D4ED8] border-blue-100";
    }
  };

  // Generate SVG path for mini sparkline
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;
  const width = 60;
  const height = 20;
  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div
      id={id || `metric-card-${title.toLowerCase().replace(/\s+/g, "-")}`}
      onClick={onClick}
      className={cn(
        "relative group bg-white border border-[#E2E8F0] rounded-[10px] p-3.5 sm:p-4 transition-all duration-200 shadow-card hover:shadow-md hover:border-slate-300 flex flex-col justify-between min-w-0 overflow-hidden",
        onClick && "cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between gap-2 min-w-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1 min-w-0">
            <span className="truncate" title={title}>{title}</span>
            {tooltip && (
              <span
                className="text-[#64748B] hover:text-[#0F172A] transition-colors cursor-help shrink-0"
                title={tooltip}
              >
                <Info className="w-3 h-3 inline shrink-0" />
              </span>
            )}
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] leading-tight truncate tabular-nums font-sans">
            {value}
          </div>
        </div>
        <div className={cn("p-2 sm:p-2.5 rounded-[8px] border shrink-0", getIconColor())}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-1.5 pt-2 border-t border-[#E2E8F0] text-xs min-w-0">
        {change ? (
          <div className="flex items-center gap-1 min-w-0 flex-1">
            {(() => {
              const isNegative = typeof change === "string" && change.trim().startsWith("-");
              const TrendIcon = isNegative ? TrendingDown : TrendingUp;
              return (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded-[6px] text-[10px] sm:text-[11px] shrink-0",
                    isGoodTrend
                      ? "bg-emerald-50 text-[#059669]"
                      : "bg-red-50 text-[#DC2626]"
                  )}
                >
                  <TrendIcon className="w-3 h-3 shrink-0" />
                  {change}
                </span>
              );
            })()}
            {subtitle && (
              <span className="text-[#64748B] text-[10px] sm:text-[11px] truncate min-w-0" title={subtitle}>
                {subtitle}
              </span>
            )}
          </div>
        ) : (
          <span className="text-[#64748B] text-[10px] sm:text-[11px] truncate min-w-0 flex-1" title={subtitle || "Current FY 2025-26"}>
            {subtitle || "Current FY 2025-26"}
          </span>
        )}

        {/* Sparkline */}
        {sparklineData && sparklineData.length > 1 && (
          <div className="w-12 h-5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
              <polyline
                fill="none"
                stroke={isGoodTrend ? "#059669" : "#DC2626"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
