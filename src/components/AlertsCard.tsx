/**
 * Alerts Card Component
 * 
 * Displays early warning alerts for a project with:
 * - Severity color-coding
 * - Status badges
 * - Action buttons (Acknowledge, Escalate, Resolve)
 * - Expandable descriptions
 * 
 * Phase 4 Task 4.5
 * Location: src/components/AlertsCard.tsx
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Bell,
  Flag,
} from 'lucide-react';

interface Alert {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'NEW' | 'ACKNOWLEDGED' | 'ESCALATED' | 'RESOLVED';
  createdAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  recommendation?: string;
}

interface AlertsCardProps {
  alerts: Alert[];
  loading?: boolean;
  language?: 'en' | 'hi';
  onAlertAction?: (alertId: string, action: 'acknowledge' | 'escalate' | 'resolve') => Promise<void>;
}

export const AlertsCard: React.FC<AlertsCardProps> = ({
  alerts = [],
  loading = false,
  language = 'en',
  onAlertAction,
}) => {
  const isHindi = language === 'hi';
  const [expanded, setExpanded] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Severity color mapping
  const severityConfig = {
    CRITICAL: {
      bg: '#E31E24',
      light: '#FCE4E4',
      text: '#C41E3A',
      icon: AlertTriangle,
      label: isHindi ? 'गंभीर' : 'Critical',
    },
    HIGH: {
      bg: '#FF6B00',
      light: '#FFE8D1',
      text: '#E55A00',
      icon: AlertTriangle,
      label: isHindi ? 'उच्च' : 'High',
    },
    MEDIUM: {
      bg: '#FFC107',
      light: '#FFF3E0',
      text: '#FFA500',
      icon: AlertCircle,
      label: isHindi ? 'मध्यम' : 'Medium',
    },
    LOW: {
      bg: '#17A2B8',
      light: '#E0F7FA',
      text: '#0C5A74',
      icon: Bell,
      label: isHindi ? 'कम' : 'Low',
    },
  };

  // Status color mapping
  const statusConfig = {
    NEW: {
      bg: '#E3F2FD',
      text: '#1976D2',
      label: isHindi ? 'नया' : 'New',
      icon: Clock,
    },
    ACKNOWLEDGED: {
      bg: '#F3E5F5',
      text: '#7B1FA2',
      label: isHindi ? 'स्वीकृत' : 'Acknowledged',
      icon: CheckCircle2,
    },
    ESCALATED: {
      bg: '#FCE4EC',
      text: '#C2185B',
      label: isHindi ? 'बढ़ाया गया' : 'Escalated',
      icon: Flag,
    },
    RESOLVED: {
      bg: '#E8F5E9',
      text: '#388E3C',
      label: isHindi ? 'हल किया गया' : 'Resolved',
      icon: CheckCircle2,
    },
  };

  const handleAction = async (
    alertId: string,
    action: 'acknowledge' | 'escalate' | 'resolve'
  ) => {
    if (!onAlertAction) return;

    setActionLoading(`${alertId}-${action}`);
    try {
      await onAlertAction(alertId, action);
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const toggleExpand = (alertId: string) => {
    setExpanded(expanded === alertId ? null : alertId);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 24) {
        return date.toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      } else if (hours > 0) {
        return isHindi
          ? `${hours} घंटे पहले`
          : `${hours}h ago`;
      } else if (minutes > 0) {
        return isHindi
          ? `${minutes} मिनट पहले`
          : `${minutes}m ago`;
      } else {
        return isHindi ? 'अभी' : 'just now';
      }
    } catch {
      return dateString;
    }
  };

  // Empty state
  if (!loading && alerts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderColor: '#047A1E' }}>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900">
              {isHindi ? 'कोई सतर्कता नहीं' : 'No Alerts'}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {isHindi
                ? 'इस परियोजना के लिए कोई सक्रिय सतर्कता नहीं है'
                : 'No active alerts for this project'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <div className="animate-spin inline-block">
              <Bell className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-gray-600 text-sm mt-2">
              {isHindi ? 'सतर्कताएं लोड हो रही हैं...' : 'Loading alerts...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-lg text-gray-900">
            {isHindi ? 'सतर्कताएं' : 'Alerts'}
          </h3>
          <span className="ml-auto inline-flex items-center justify-center w-6 h-6 bg-red-50 text-red-600 rounded-full text-sm font-semibold">
            {alerts.filter(a => a.status === 'NEW').length}
          </span>
        </div>
      </div>

      {/* Alerts List */}
      <div className="divide-y">
        {alerts.map((alert) => {
          const severityConf = severityConfig[alert.severity];
          const statusConf = statusConfig[alert.status];
          const isExpanded = expanded === alert.id;
          const SeverityIcon = severityConf.icon;
          const StatusIcon = statusConf.icon;

          return (
            <div
              key={alert.id}
              className="hover:bg-gray-50 transition"
              style={{ borderLeft: `4px solid ${severityConf.bg}` }}
            >
              {/* Alert Header (Clickable) */}
              <div
                onClick={() => toggleExpand(alert.id)}
                className="px-6 py-4 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Title with Severity and Status */}
                    <div className="flex items-center gap-2 mb-2">
                      <SeverityIcon
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: severityConf.bg }}
                      />
                      <h4 className="font-semibold text-gray-900 truncate flex-1">
                        {alert.title}
                      </h4>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span
                          style={{
                            backgroundColor: severityConf.light,
                            color: severityConf.text,
                          }}
                          className="inline-block px-2 py-1 rounded text-xs font-semibold"
                        >
                          {severityConf.label}
                        </span>
                        <span
                          style={{
                            backgroundColor: statusConf.bg,
                            color: statusConf.text,
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold"
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusConf.label}
                        </span>
                      </div>
                    </div>

                    {/* Alert Type and Time */}
                    <div className="text-sm text-gray-600 mb-1">
                      <span className="inline-block mr-3">
                        {isHindi ? 'प्रकार:' : 'Type:'} <strong>{alert.type}</strong>
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(alert.createdAt)}
                      </span>
                    </div>

                    {/* Short Description */}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {alert.description}
                    </p>
                  </div>

                  {/* Expand Button */}
                  <button
                    className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(alert.id);
                    }}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-6 py-4 bg-gray-50 border-t space-y-4">
                  {/* Full Description */}
                  <div>
                    <h5 className="font-semibold text-sm text-gray-900 mb-1">
                      {isHindi ? 'विवरण' : 'Description'}
                    </h5>
                    <p className="text-sm text-gray-700">
                      {alert.description}
                    </p>
                  </div>

                  {/* Recommendation if available */}
                  {alert.recommendation && (
                    <div>
                      <h5 className="font-semibold text-sm text-gray-900 mb-1">
                        {isHindi ? 'सुझाव' : 'Recommendation'}
                      </h5>
                      <p className="text-sm text-gray-700">
                        {alert.recommendation}
                      </p>
                    </div>
                  )}

                  {/* Acknowledgment Info */}
                  {alert.acknowledgedAt && (
                    <div className="text-xs text-gray-600 p-2 bg-white rounded border">
                      {isHindi ? 'स्वीकृत द्वारा:' : 'Acknowledged by:'}{' '}
                      <strong>{alert.acknowledgedBy || 'Unknown'}</strong> {isHindi ? 'पर' : 'on'}{' '}
                      {formatDate(alert.acknowledgedAt)}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t">
                    {alert.status === 'NEW' && (
                      <button
                        onClick={() => handleAction(alert.id, 'acknowledge')}
                        disabled={
                          actionLoading === `${alert.id}-acknowledge`
                        }
                        className="px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition font-medium disabled:opacity-50"
                      >
                        {actionLoading === `${alert.id}-acknowledge`
                          ? isHindi
                            ? 'स्वीकार कर रहे हैं...'
                            : 'Acknowledging...'
                          : isHindi
                          ? 'स्वीकार करें'
                          : 'Acknowledge'}
                      </button>
                    )}

                    {alert.status !== 'ESCALATED' && alert.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleAction(alert.id, 'escalate')}
                        disabled={
                          actionLoading === `${alert.id}-escalate`
                        }
                        className="px-3 py-1 text-sm bg-orange-50 text-orange-600 hover:bg-orange-100 rounded transition font-medium disabled:opacity-50"
                      >
                        {actionLoading === `${alert.id}-escalate`
                          ? isHindi
                            ? 'बढ़ा रहे हैं...'
                            : 'Escalating...'
                          : isHindi
                          ? 'बढ़ाएं'
                          : 'Escalate'}
                      </button>
                    )}

                    {alert.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleAction(alert.id, 'resolve')}
                        disabled={
                          actionLoading === `${alert.id}-resolve`
                        }
                        className="px-3 py-1 text-sm bg-green-50 text-green-600 hover:bg-green-100 rounded transition font-medium disabled:opacity-50"
                      >
                        {actionLoading === `${alert.id}-resolve`
                          ? isHindi
                            ? 'हल कर रहे हैं...'
                            : 'Resolving...'
                          : isHindi
                          ? 'हल करें'
                          : 'Resolve'}
                      </button>
                    )}
                  </div>

                  {/* Alert ID */}
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    {isHindi ? 'सतर्कता ID:' : 'Alert ID:'} <code>{alert.id}</code>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Summary */}
      <div className="px-6 py-3 border-t bg-gray-50 text-xs text-gray-600">
        <div className="flex items-center justify-between">
          <div className="space-x-3">
            <span>
              {isHindi ? 'कुल:' : 'Total:'} <strong>{alerts.length}</strong>
            </span>
            <span>
              {isHindi ? 'नई:' : 'New:'}{' '}
              <strong>{alerts.filter(a => a.status === 'NEW').length}</strong>
            </span>
            <span>
              {isHindi ? 'हल:' : 'Resolved:'}{' '}
              <strong>{alerts.filter(a => a.status === 'RESOLVED').length}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsCard;
