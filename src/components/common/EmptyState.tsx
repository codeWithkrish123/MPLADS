import React from "react";
import { Database, RefreshCw } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  isLoading?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Database,
  title,
  description,
  actionLabel,
  onAction,
  isLoading = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 bg-slate-50 rounded-lg border border-slate-200 min-h-[300px]">
      <Icon className="w-16 h-16 text-slate-300 mb-4" />
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-slate-600 max-w-md text-center mb-4">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          disabled={isLoading}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
          {actionLabel}
        </button>
      )}
    </div>
  );
};
