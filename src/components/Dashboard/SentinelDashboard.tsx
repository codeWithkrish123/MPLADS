/**
 * ML Sentinel Dashboard Component
 * Real-time monitoring dashboard for MPLADS projects
 * 
 * Features:
 * - Live command center metrics
 * - Priority attention queue
 * - Risk distribution visualization
 * - Automatic 5-second updates
 * - Performance tracking
 * - Error handling with retry
 */

import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  TrendingUp,
  Clock,
  RefreshCw,
  Pause,
  Play,
  Filter,
  Search,
} from 'lucide-react';
import { useSentinelDashboard } from '../../hooks/useSentinelDashboard';
import clsx from 'clsx';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  unit?: string;
  color?: 'blue' | 'red' | 'orange' | 'green';
}

function MetricCard({
  title,
  value,
  icon,
  trend,
  unit,
  color = 'blue',
}: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    red: 'bg-red-50 border-red-200',
    orange: 'bg-orange-50 border-orange-200',
    green: 'bg-green-50 border-green-200',
  };

  return (
    <div className={clsx('rounded-lg border p-6', colorClasses[color])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {unit && <p className="mt-1 text-xs text-gray-500">{unit}</p>}
          {trend !== undefined && (
            <p
              className={clsx(
                'mt-2 text-sm font-medium',
                trend > 0 ? 'text-red-600' : 'text-green-600'
              )}
            >
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
}

interface AttentionQueueItemProps {
  projectId: string;
  priorityScore: number;
  riskLevel: string;
  investigation: string;
  lastActivity: string;
}

function AttentionQueueItem({
  projectId,
  priorityScore,
  riskLevel,
  investigation,
  lastActivity,
}: AttentionQueueItemProps) {
  const getRiskColor = (risk: string) => {
    switch (risk.toUpperCase()) {
      case 'CRITICAL':
        return 'text-red-600 bg-red-50';
      case 'HIGH':
        return 'text-orange-600 bg-orange-50';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50';
      case 'LOW':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (score: number) => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 60) return 'bg-orange-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4 font-mono text-sm text-gray-900">{projectId}</td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getPriorityColor(priorityScore)}`}
              style={{ width: `${priorityScore}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-900">
            {priorityScore.toFixed(0)}
          </span>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className={clsx('px-3 py-1 rounded-full text-sm font-medium', getRiskColor(riskLevel))}>
          {riskLevel}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-gray-600">{investigation}</td>
      <td className="py-3 px-4 text-sm text-gray-600">{lastActivity}</td>
    </tr>
  );
}

export const SentinelDashboard: React.FC = () => {
  const {
    data,
    loading,
    error,
    lastUpdate,
    refresh,
    stopPolling,
    resumePolling,
    isPolling,
    lastResponseTime,
    pollCount,
  } = useSentinelDashboard(5000);

  const [filters, setFilters] = useState({
    state: '',
    district: '',
    riskLevel: '',
  });

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <Activity className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
          <p className="text-lg font-semibold text-gray-900">
            Loading live monitoring data...
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Connecting to ML Sentinel API
          </p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
          <div className="flex-1">
            <p className="text-red-700 font-semibold mb-2">Connection Error</p>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <button
              onClick={refresh}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  const {
    commandCenter = {},
    attentionQueue = {},
    overview = {},
  } = data || {};

  const portfolio = commandCenter.portfolio_health || {};
  const riskDistribution = commandCenter.risk_distribution || {};
  const queueItems = attentionQueue.queue_items || [];

  const getRiskColor = (risk: string): 'blue' | 'red' | 'orange' | 'green' => {
    switch (risk.toUpperCase()) {
      case 'CRITICAL':
        return 'red';
      case 'HIGH':
        return 'orange';
      case 'MEDIUM':
      case 'LOW':
      default:
        return 'blue';
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            ML Sentinel Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Real-time project monitoring & risk intelligence</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Status Indicator */}
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 mb-2">
              <span className={clsx(
                'inline-flex h-3 w-3 rounded-full',
                isPolling ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              )} />
              <span className="text-sm font-medium text-gray-600">
                {isPolling ? 'Live' : 'Paused'}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {lastUpdate && (
                <>
                  <div>Updated: {lastUpdate.toLocaleTimeString()}</div>
                  <div>{lastResponseTime.toFixed(0)}ms • Poll #{pollCount}</div>
                </>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button
              onClick={isPolling ? stopPolling : resumePolling}
              className="p-2 hover:bg-white rounded-lg border border-gray-200 transition-colors"
              title={isPolling ? 'Pause polling' : 'Resume polling'}
            >
              {isPolling ? (
                <Pause size={20} className="text-gray-600" />
              ) : (
                <Play size={20} className="text-gray-600" />
              )}
            </button>
            <button
              onClick={refresh}
              className="p-2 hover:bg-white rounded-lg border border-gray-200 transition-colors"
              title="Manual refresh"
            >
              <RefreshCw size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 flex gap-4">
        <div className="flex-1 flex gap-4">
          <input
            type="text"
            placeholder="Search projects..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
          />
          <select
            value={filters.state}
            onChange={(e) => setFilters({ ...filters, state: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="">All States</option>
            <option value="UP">Uttar Pradesh</option>
            <option value="MH">Maharashtra</option>
          </select>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Filter size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="Total Projects"
          value={portfolio.total_projects || 0}
          icon={<Activity className="text-blue-500" />}
          color="blue"
        />
        <MetricCard
          title="At Risk"
          value={portfolio.projects_at_risk || 0}
          icon={<AlertCircle className="text-red-500" />}
          color="red"
        />
        <MetricCard
          title="Avg Risk Score"
          value={`${(portfolio.average_risk_score || 0).toFixed(1)}/100`}
          icon={<TrendingUp className="text-orange-500" />}
          color="orange"
        />
        <MetricCard
          title="Under Investigation"
          value={portfolio.projects_under_investigation || 0}
          icon={<Search className="text-green-500" />}
          color="green"
        />
      </div>

      {/* Risk Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Risk Distribution</h2>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(riskDistribution).map(([risk, count]) => (
            <div key={risk} className="text-center">
              <div className="mb-3">
                <div
                  className={clsx(
                    'inline-block px-4 py-2 rounded-lg font-bold text-white',
                    risk === 'CRITICAL' && 'bg-red-600',
                    risk === 'HIGH' && 'bg-orange-600',
                    risk === 'MEDIUM' && 'bg-yellow-600',
                    risk === 'LOW' && 'bg-green-600'
                  )}
                >
                  {count as number}
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600">{risk}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Attention Queue */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Top Priority Projects (Attention Queue)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Project ID
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Priority Score
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Risk Level
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Investigation
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Last Activity
                </th>
              </tr>
            </thead>
            <tbody>
              {queueItems && queueItems.length > 0 ? (
                queueItems.slice(0, 10).map((item: any, idx: number) => (
                  <AttentionQueueItem
                    key={idx}
                    projectId={item.project_id || `PRJ-${idx}`}
                    priorityScore={item.priority_score || 0}
                    riskLevel={item.risk_level || 'MEDIUM'}
                    investigation={item.investigation_status || 'Pending'}
                    lastActivity={item.last_activity || 'N/A'}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 px-4 text-center text-gray-500">
                    No projects in attention queue
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
        <div className="flex items-start gap-2">
          <Clock size={16} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">
              Dashboard updates every 5 seconds. Response time target: &lt;500ms.
              {error && ' Currently showing cached data.'}
            </p>
            {lastResponseTime > 500 && (
              <p className="mt-1 text-blue-600">
                ⚠️ Response time exceeded SLA: {lastResponseTime.toFixed(0)}ms
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentinelDashboard;
