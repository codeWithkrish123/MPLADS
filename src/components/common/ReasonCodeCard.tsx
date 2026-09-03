import React from "react";
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  Pause,
  TrendingDown,
  AlertCircle,
  Calendar,
  Zap,
  ChevronRight
} from "lucide-react";
import { getReasonCodeExplanation, getRiskLevelDetails } from "../../data/mlCopyMap";

interface ReasonCodeCardProps {
  /**
   * ML-generated reason code (e.g., "COST_PEER_DEVIATION_HIGH")
   */
  reasonCode: string;

  /**
   * Risk score contributed by this reason (0-100)
   */
  riskScore?: number;

  /**
   * Optional: Show as expandable card
   */
  expandable?: boolean;

  /**
   * Optional: Initial expanded state
   */
  defaultExpanded?: boolean;

  /**
   * Optional: Click handler
   */
  onClick?: () => void;

  /**
   * Optional: Show checklist for this reason
   */
  showChecklist?: boolean;
  checklist?: string[];

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Maps reason code icon names to actual icon components
 */
const iconMap: Record<string, React.ReactNode> = {
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  AlertTriangle: <AlertTriangle className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
  Pause: <Pause className="w-5 h-5" />,
  TrendingDown: <TrendingDown className="w-5 h-5" />,
  AlertCircle: <AlertCircle className="w-5 h-5" />,
  Calendar: <Calendar className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />
};

export const ReasonCodeCard: React.FC<ReasonCodeCardProps> = ({
  reasonCode,
  riskScore,
  expandable = true,
  defaultExpanded = false,
  onClick,
  showChecklist = false,
  checklist = [],
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  
  // Get the reason code details
  const reasonDetails = getReasonCodeExplanation(reasonCode);
  const icon = iconMap[reasonDetails.icon] || <AlertCircle className="w-5 h-5" />;

  const handleClick = () => {
    if (expandable) {
      setIsExpanded(!isExpanded);
    }
    onClick?.();
  };

  return (
    <div
      className={`border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 transition-colors ${
        expandable ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* Card Header */}
      <div
        onClick={handleClick}
        className="p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 text-slate-600 mt-0.5">
            {icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 mb-1">
              {reasonDetails.title}
            </h3>
            <p className="text-sm text-slate-600 line-clamp-2">
              {reasonDetails.description}
            </p>

            {/* Risk Score Badge */}
            {riskScore !== undefined && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-medium text-slate-600">Risk Score:</span>
                <span className={`text-sm font-bold ${
                  riskScore > 70 ? "text-red-600" :
                  riskScore > 50 ? "text-orange-600" :
                  riskScore > 30 ? "text-amber-600" :
                  "text-green-600"
                }`}>
                  {riskScore.toFixed(2)}%
                </span>
              </div>
            )}
          </div>

          {/* Expand Icon */}
          {expandable && (
            <div className={`flex-shrink-0 text-slate-400 transition-transform ${
              isExpanded ? "rotate-90" : ""
            }`}>
              <ChevronRight className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-slate-200 p-4 bg-white">
          {/* Full Description */}
          <div className="mb-4">
            <p className="text-sm text-slate-700 leading-relaxed">
              {reasonDetails.description}
            </p>
          </div>

          {/* Checklist (if provided) */}
          {showChecklist && checklist && checklist.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-3">
                Recommended Review Checklist
              </h4>
              <ul className="space-y-2">
                {checklist.map((item, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      className="flex-shrink-0 mt-0.5 cursor-pointer"
                      id={`checklist-${idx}`}
                      aria-label={item}
                    />
                    <label
                      htmlFor={`checklist-${idx}`}
                      className="flex-1 cursor-pointer"
                    >
                      {item}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Metadata */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Code: {reasonCode}</span>
            <span className="font-mono">{riskScore !== undefined ? `+${riskScore.toFixed(1)}%` : ""}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReasonCodeCard;
