/**
 * Signals Card Component
 * 
 * Displays risk signals for a project with:
 * - Severity color-coding
 * - Confidence scores
 * - Evidence links
 * - Expandable details
 * 
 * Phase 4 Task 4.4
 * Location: src/components/SignalsCard.tsx
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Zap,
} from 'lucide-react';

interface Signal {
  id: string;
  name: string;
  code: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  evidence: string[];
  createdAt: string;
  status: 'ACTIVE' | 'RESOLVED' | 'ARCHIVED';
}

interface SignalsCardProps {
  signals: Signal[];
  loading?: boolean;
  language?: 'en' | 'hi';
  onSignalClick?: (signalId: string) => void;
}

export const SignalsCard: React.FC<SignalsCardProps> = ({
  signals = [],
  loading = false,
  language = 'en',
  onSignalClick,
}) => {
  const isHindi = language === 'hi';
  const [expanded, setExpanded] = useState<string | null>(null);

  // Severity color mapping
  const severityConfig = {
    CRITICAL: {
      bg: '#E31E24',
      light: '#FCE4E4',
      text: '#C41E3A',
      label: isHindi ? 'गंभीर' : 'Critical',
    },
    HIGH: {
      bg: '#FF6B00',
      light: '#FFE8D1',
      text: '#E55A00',
      label: isHindi ? 'उच्च' : 'High',
    },
    MEDIUM: {
      bg: '#FFC107',
      light: '#FFF3E0',
      text: '#FFA500',
      label: isHindi ? 'मध्यम' : 'Medium',
    },
    LOW: {
      bg: '#17A2B8',
      light: '#E0F7FA',
      text: '#0C5A74',
      label: isHindi ? 'कम' : 'Low',
    },
  };

  const toggleExpand = (signalId: string) => {
    setExpanded(expanded === signalId ? null : signalId);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  // Empty state
  if (!loading && signals.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderColor: '#047A1E' }}>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900">
              {isHindi ? 'कोई संकेत नहीं' : 'No Signals'}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {isHindi
                ? 'इस परियोजना के लिए कोई जोखिम संकेत नहीं मिला'
                : 'No risk signals detected for this project'}
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
              <Zap className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-gray-600 text-sm mt-2">
              {isHindi ? 'संकेत लोड हो रहे हैं...' : 'Loading signals...'}
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
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <h3 className="font-semibold text-lg text-gray-900">
            {isHindi ? 'जोखिम संकेत' : 'Risk Signals'}
          </h3>
          <span className="ml-auto inline-flex items-center justify-center w-6 h-6 bg-red-50 text-red-600 rounded-full text-sm font-semibold">
            {signals.length}
          </span>
        </div>
      </div>

      {/* Signals List */}
      <div className="divide-y">
        {signals.map((signal) => {
          const config = severityConfig[signal.severity];
          const isExpanded = expanded === signal.id;

          return (
            <div
              key={signal.id}
              className="hover:bg-gray-50 transition"
              style={{ borderLeft: `4px solid ${config.bg}` }}
            >
              {/* Signal Header (Clickable) */}
              <div
                onClick={() => {
                  toggleExpand(signal.id);
                  onSignalClick?.(signal.id);
                }}
                className="px-6 py-4 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Severity Badge and Title */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        style={{
                          backgroundColor: config.light,
                          color: config.text,
                        }}
                        className="inline-block px-2 py-1 rounded text-xs font-semibold"
                      >
                        {config.label}
                      </span>
                      <h4 className="font-semibold text-gray-900 truncate">
                        {signal.name}
                      </h4>
                    </div>

                    {/* Code and Confidence */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span>
                        {isHindi ? 'कोड:' : 'Code:'} <strong>{signal.code}</strong>
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                          <div
                            style={{
                              width: `${signal.confidence}%`,
                              backgroundColor: config.bg,
                            }}
                            className="h-2 rounded-full transition-all"
                          />
                        </div>
                        <span className="font-semibold">
                          {signal.confidence}%
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="text-xs text-gray-500">
                      {isHindi ? 'स्थिति:' : 'Status:'}{' '}
                      <span className="font-medium">
                        {signal.status === 'ACTIVE'
                          ? isHindi
                            ? 'सक्रिय'
                            : 'Active'
                          : signal.status === 'RESOLVED'
                          ? isHindi
                            ? 'हल किया गया'
                            : 'Resolved'
                          : isHindi
                          ? 'संग्रहीत'
                          : 'Archived'}
                      </span>
                    </div>
                  </div>

                  {/* Expand Button */}
                  <button
                    className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(signal.id);
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
                <div className="px-6 py-4 bg-gray-50 border-t">
                  {/* Evidence Links */}
                  {signal.evidence && signal.evidence.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-semibold text-sm text-gray-900 mb-2">
                        {isHindi ? 'प्रमाण' : 'Evidence'}
                      </h5>
                      <ul className="space-y-1">
                        {signal.evidence.map((evidence, index) => (
                          <li key={index}>
                            <a
                              href="#"
                              onClick={(e) => e.preventDefault()}
                              className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 truncate"
                            >
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{evidence}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="pt-3 border-t text-xs text-gray-600 space-y-1">
                    <div>
                      {isHindi ? 'बनाया गया:' : 'Created:'}{' '}
                      {formatDate(signal.createdAt)}
                    </div>
                    <div>
                      {isHindi ? 'संकेत ID:' : 'Signal ID:'}{' '}
                      <code className="text-gray-500">{signal.id}</code>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition font-medium">
                      {isHindi ? 'विवरण' : 'Details'}
                    </button>
                    <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 rounded transition font-medium">
                      {isHindi ? 'निर्यात करें' : 'Export'}
                    </button>
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
          <span>
            {isHindi
              ? `कुल ${signals.length} संकेत`
              : `Total ${signals.length} signals`}
          </span>
          <span>
            {isHindi ? 'आखिरी अपडेट:' : 'Last update:'}{' '}
            {formatDate(signals[0]?.createdAt || new Date().toISOString())}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignalsCard;
