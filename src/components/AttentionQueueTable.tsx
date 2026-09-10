/**
 * Attention Queue Table Component
 * 
 * Displays prioritized projects requiring attention
 * Implements pagination, sorting, filtering, and color-coding by risk level
 * 
 * Phase 4 Task 4.2
 * Location: src/components/AttentionQueueTable.tsx
 */

import React, { useState, useEffect } from 'react';
import { mlApi } from '../services/ml';
import { buildErrorReport } from '../utils/errorHandler';
import {
  AlertTriangle,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  RotateCw,
  Filter,
  Loader,
} from 'lucide-react';

interface AttentionQueueItem {
  projectId: string;
  projectName: string;
  priority: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  evidenceStatus: string;
  recommendation: string;
  state?: string;
  district?: string;
  alertCount?: number;
}

interface AttentionQueueTableProps {
  language?: 'en' | 'hi';
  onProjectClick?: (projectId: string) => void;
}

export const AttentionQueueTable: React.FC<AttentionQueueTableProps> = ({
  language = 'en',
  onProjectClick,
}) => {
  const isHindi = language === 'hi';
  
  // State management
  const [items, setItems] = useState<AttentionQueueItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<'priority' | 'risk'>('priority');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({ risk_level: '', priority_tier: '' });

  // Load data
  useEffect(() => {
    fetchQueue();
  }, [page, pageSize, filters]);

  const fetchQueue = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await mlApi.getAttentionQueue({
        page,
        page_size: pageSize,
        ...filters,
      });

      // Transform response to component format
      const transformedItems: AttentionQueueItem[] = (response.items || []).map(
        (item: any) => ({
          projectId: item.projectId || item.project_id,
          projectName: item.projectName || item.project_name,
          priority: item.priority || item.operational_priority_score || 0,
          riskLevel: item.riskLevel || item.risk_level || 'MEDIUM',
          evidenceStatus: item.evidenceStatus || item.evidence_status || 'PENDING',
          recommendation: item.recommendation || 'Monitor closely',
          state: item.state,
          district: item.district,
          alertCount: item.alertCount || 0,
        })
      );

      setItems(transformedItems);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      const { userMessage } = buildErrorReport(err);
      setError(userMessage);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Risk color mapping
  const getRiskColor = (riskLevel: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      CRITICAL: { bg: '#E31E24', text: '#FFFFFF', border: '#C41E3A' },
      HIGH: { bg: '#FF6B00', text: '#FFFFFF', border: '#E55A00' },
      MEDIUM: { bg: '#FFC107', text: '#000000', border: '#FFA500' },
      LOW: { bg: '#17A2B8', text: '#FFFFFF', border: '#0C5A74' },
    };
    return colors[riskLevel] || colors.MEDIUM;
  };

  // Sort handler
  const handleSort = (column: 'priority' | 'risk') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  // Apply sorting
  const sortedItems = [...items].sort((a, b) => {
    let compareValue = 0;
    
    if (sortBy === 'priority') {
      compareValue = a.priority - b.priority;
    } else if (sortBy === 'risk') {
      const riskOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      compareValue =
        (riskOrder[a.riskLevel] || 0) - (riskOrder[b.riskLevel] || 0);
    }

    return sortOrder === 'desc' ? -compareValue : compareValue;
  });

  // Loading state
  if (loading && items.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg shadow p-8">
        <div className="flex items-center justify-center gap-3">
          <Loader className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-gray-600">
            {isHindi ? 'डेटा लोड हो रहा है...' : 'Loading...'}
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full bg-white rounded-lg shadow p-6">
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-800">
              {isHindi ? 'त्रुटि' : 'Error'}
            </h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
            <button
              onClick={fetchQueue}
              className="mt-3 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              {isHindi ? 'पुनः प्रयास करें' : 'Retry'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg shadow p-8">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            {isHindi ? 'कोई परियोजना नहीं मिली' : 'No projects found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow overflow-hidden">
      {/* Header with filters and refresh */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-semibold text-lg text-gray-900">
            {isHindi ? 'ध्यान की आवश्यकता वाली परियोजनाएं' : 'Projects Requiring Attention'}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={fetchQueue}
              disabled={loading}
              className="p-2 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
              title="Refresh"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-3">
          <select
            value={filters.risk_level}
            onChange={(e) => {
              setFilters({ ...filters, risk_level: e.target.value });
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="">
              {isHindi ? 'सभी जोखिम स्तर' : 'All Risk Levels'}
            </option>
            <option value="CRITICAL">
              {isHindi ? 'गंभीर' : 'Critical'}
            </option>
            <option value="HIGH">{isHindi ? 'उच्च' : 'High'}</option>
            <option value="MEDIUM">
              {isHindi ? 'मध्यम' : 'Medium'}
            </option>
            <option value="LOW">{isHindi ? 'कम' : 'Low'}</option>
          </select>

          <select
            value={filters.priority_tier}
            onChange={(e) => {
              setFilters({ ...filters, priority_tier: e.target.value });
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="">
              {isHindi ? 'सभी प्राथमिकताएं' : 'All Priorities'}
            </option>
            <option value="URGENT_ACTION">
              {isHindi ? 'तत्काल कार्रवाई' : 'Urgent Action'}
            </option>
            <option value="ELEVATED_ATTENTION">
              {isHindi ? 'उन्नत ध्यान' : 'Elevated Attention'}
            </option>
            <option value="ROUTINE_MONITORING">
              {isHindi ? 'नियमित निगरानी' : 'Routine Monitoring'}
            </option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 text-sm">
                {isHindi ? 'परियोजना ID' : 'Project ID'}
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 text-sm">
                {isHindi ? 'परियोजना नाम' : 'Project Name'}
              </th>
              <th
                className="px-4 py-3 text-center font-semibold text-gray-900 text-sm cursor-pointer hover:bg-gray-200 transition"
                onClick={() => handleSort('priority')}
              >
                <div className="flex items-center justify-center gap-1">
                  {isHindi ? 'प्राथमिकता' : 'Priority'}
                  {sortBy === 'priority' && (
                    sortOrder === 'desc' ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )
                  )}
                </div>
              </th>
              <th
                className="px-4 py-3 text-center font-semibold text-gray-900 text-sm cursor-pointer hover:bg-gray-200 transition"
                onClick={() => handleSort('risk')}
              >
                <div className="flex items-center justify-center gap-1">
                  {isHindi ? 'जोखिम स्तर' : 'Risk Level'}
                  {sortBy === 'risk' && (
                    sortOrder === 'desc' ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 text-sm">
                {isHindi ? 'सुझाव' : 'Recommendation'}
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-900 text-sm">
                {isHindi ? 'सतर्कताएं' : 'Alerts'}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => {
              const riskColor = getRiskColor(item.riskLevel);
              return (
                <tr
                  key={item.projectId}
                  onClick={() => onProjectClick?.(item.projectId)}
                  style={{ borderLeft: `4px solid ${riskColor.bg}` }}
                  className="border-b hover:bg-gray-50 cursor-pointer transition"
                >
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">
                    {item.projectId}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 max-w-xs truncate">
                    {item.projectName}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-semibold text-sm">
                      <TrendingUp className="w-4 h-4" />
                      {item.priority.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      style={{
                        backgroundColor: riskColor.bg,
                        color: riskColor.text,
                      }}
                      className="inline-block px-3 py-1 rounded-full font-semibold text-sm"
                    >
                      {item.riskLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                    {item.recommendation}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-red-50 text-red-600 rounded-full text-sm font-semibold">
                      {item.alertCount || 0}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {isHindi
            ? `पृष्ठ ${page} का ${totalPages}`
            : `Page ${page} of ${totalPages}`}
        </div>

        <div className="flex gap-2">
          <button
            disabled={page === 1 || loading}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isHindi ? 'पिछला' : 'Previous'}
          </button>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value));
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="25">25 {isHindi ? 'प्रति पृष्ठ' : 'per page'}</option>
            <option value="50">50 {isHindi ? 'प्रति पृष्ठ' : 'per page'}</option>
            <option value="100">100 {isHindi ? 'प्रति पृष्ठ' : 'per page'}</option>
          </select>

          <button
            disabled={page >= totalPages || loading}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isHindi ? 'अगला' : 'Next'}
          </button>
        </div>
      </div>

      {/* Loading overlay for refetch */}
      {loading && items.length > 0 && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
          <Loader className="w-5 h-5 animate-spin text-blue-600" />
        </div>
      )}
    </div>
  );
};

export default AttentionQueueTable;
