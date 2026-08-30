import React from "react";
import { RiskSeverity } from "../../types";
import { RiskBadge } from "./RiskBadge";
import { cn } from "../../lib/utils";

interface RiskScoreGaugeProps {
  score: number;
  severity: RiskSeverity;
  size?: number;
  strokeWidth?: number;
  className?: string;
  id?: string;
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({
  score,
  severity,
  size = 130,
  strokeWidth = 10,
  className,
  id,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    switch (severity) {
      case "CRITICAL":
        return "#DC2626"; // red-600
      case "HIGH":
        return "#D97706"; // amber-600
      case "MEDIUM":
        return "#CA8A04"; // yellow-600
      case "LOW":
      default:
        return "#059669"; // emerald-600
    }
  };

  const getBgColor = () => {
    switch (severity) {
      case "CRITICAL":
        return "#FEE2E2"; // red-100
      case "HIGH":
        return "#FEF3C7"; // amber-100
      case "MEDIUM":
        return "#FEF9C3"; // yellow-100
      case "LOW":
      default:
        return "#D1FAE5"; // emerald-100
    }
  };

  return (
    <div
      id={id || `risk-score-gauge-${score}`}
      className={cn("flex flex-col items-center justify-center p-3 text-center", className)}
    >
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getBgColor()}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getColor()}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold font-mono tracking-tight text-slate-900">
            {score}
          </span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500">
            / 100
          </span>
        </div>
      </div>
      <div className="mt-3">
        <RiskBadge severity={severity} score={score} size="md" />
      </div>
    </div>
  );
};
