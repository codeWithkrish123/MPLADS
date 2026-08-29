import React from "react";
import { X, Bell, ShieldAlert, ChevronRight, Check } from "lucide-react";
import { RiskAlert, WorkRecord } from "../../types";
import { RiskBadge } from "../common/RiskBadge";

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: RiskAlert[];
  works: WorkRecord[];
  onSelectWork: (work: WorkRecord) => void;
  onViewAllAlerts: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  works,
  onSelectWork,
  onViewAllAlerts,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="notifications-drawer-backdrop"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white shadow-2xl border-l border-slate-200 h-full flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 text-blue-800 rounded-md">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Active Risk Alerts</h3>
              <p className="text-[11px] text-slate-500">{alerts.length} signals require monitoring</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {alerts.map((alert) => {
            const matchedWork = works.find((w) => w.work_id === alert.work_id);
            return (
              <div
                key={alert.id}
                onClick={() => {
                  if (matchedWork) {
                    onSelectWork(matchedWork);
                    onClose();
                  }
                }}
                className="p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-blue-700">
                    {alert.work_id}
                  </span>
                  <RiskBadge severity={alert.severity} size="sm" />
                </div>
                <div className="text-xs font-semibold text-slate-800 line-clamp-1 mb-1">
                  {alert.work_name}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {alert.reason}
                </p>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{alert.district}, {alert.state}</span>
                  <span>{alert.detected_at}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => {
              onViewAllAlerts();
              onClose();
            }}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            Open Full Risk Alert Inbox <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
