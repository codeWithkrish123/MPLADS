import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { Language } from "../types";
import { apiCall } from "../services/api";
import { getRiskLevelDetails } from "../data/mlCopyMap";
import { LegalDisclaimer } from "../components/common/LegalDisclaimer";

interface ProjectQueueViewProps {
  language?: Language;
  onSelectProject?: (projectId: string) => void;
}

interface Project {
  work_id: string;
  state: string;
  district: string;
  work_category: string;
  composite_risk_score: number;
  risk_level: string;
  sanction_amount: number;
  total_expenditure: number;
  work_status: string;
}

interface FilterState {
  state: string;
  district: string;
  risk_level: string;
  work_category: string;
  minRisk: number;
  maxRisk: number;
  sortBy: string;
  sortOrder: string;
}

export const ProjectQueueView: React.FC<ProjectQueueViewProps> = ({
  language = "en",
  onSelectProject
}) => {
  const isHindi = language === "hi";
  
  // State management
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Project[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMatches, setTotalMatches] = useState(0);
  const pageSize = 50;
  
  // Filters
  const [filters, setFilters] = useState<FilterState>({
    state: "",
    district: "",
    risk_level: "",
    work_category: "",
    minRisk: 0,
    maxRisk: 100,
    sortBy: "composite_risk_score",
    sortOrder: "desc"
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch projects with current filters
  const fetchProjects = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page,
        page_size: pageSize,
        sort_by: filters.sortBy,
        sort_order: filters.sortOrder
      };

      // Add active filters
      if (filters.state) params.state = filters.state;
      if (filters.district) params.district = filters.district;
      if (filters.risk_level) params.risk_level = filters.risk_level;
      if (filters.work_category) params.work_category = filters.work_category;
      if (filters.minRisk > 0 || filters.maxRisk < 100) {
        params.min_risk = filters.minRisk;
        params.max_risk = filters.maxRisk;
      }

      const response = await apiCall<any>(
        `/api/ml/projects`,
        {
          method: 'GET',
          headers: { 'skipAuth': 'false' }
        }
      );

      console.log('📊 API Response:', response);
      
      // Handle different response formats from ML API
      const projectsArray = (response as any)?.data || (response as any)?.projects || response || [];
      const totalCount = (response as any)?.total_matches || (response as any)?.count || projectsArray.length || 0;
      
      setProjects(projectsArray);
      setTotalMatches(totalCount);
      setCurrentPage(page);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Search projects
  const handleSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setShowSearchResults(false);
      return;
    }

    try {
      const response = await apiCall<any>(
        `/api/ml/search?q=${encodeURIComponent(query)}&limit=100`,
        { 
          method: 'GET',
          headers: { 'skipAuth': 'false' }
        }
      );

      setSearchResults(response || []);
      setShowSearchResults(true);
    } catch (err: any) {
      console.error('Search error:', err);
      setSearchResults([]);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchProjects(1);
  }, [fetchProjects]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  // Handle filter change
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      state: "",
      district: "",
      risk_level: "",
      work_category: "",
      minRisk: 0,
      maxRisk: 100,
      sortBy: "composite_risk_score",
      sortOrder: "desc"
    });
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalMatches / pageSize);
  const displayProjects = showSearchResults ? searchResults : projects;

  const riskDetails = (riskLevel: string) => getRiskLevelDetails(riskLevel);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {isHindi ? "परियोजना समीक्षा कतार" : "Project Review Queue"}
        </h1>
        <p className="text-slate-600">
          {isHindi 
            ? `${totalMatches} परियोजनाएं उपलब्ध`
            : `${totalMatches} projects available`
          }
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder={isHindi ? "परियोजना खोजें..." : "Search projects..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span>{isHindi ? "फ़िल्टर" : "Filters"}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Risk Level */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                {isHindi ? "जोखिम स्तर" : "Risk Level"}
              </label>
              <select
                value={filters.risk_level}
                onChange={(e) => handleFilterChange('risk_level', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{isHindi ? "सभी" : "All"}</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                {isHindi ? "राज्य" : "State"}
              </label>
              <input
                type="text"
                placeholder={isHindi ? "राज्य खोजें" : "Search state..."}
                value={filters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                {isHindi ? "जिला" : "District"}
              </label>
              <input
                type="text"
                placeholder={isHindi ? "जिला खोजें" : "Search district..."}
                value={filters.district}
                onChange={(e) => handleFilterChange('district', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                {isHindi ? "श्रेणी" : "Category"}
              </label>
              <input
                type="text"
                placeholder={isHindi ? "श्रेणी खोजें" : "Search category..."}
                value={filters.work_category}
                onChange={(e) => handleFilterChange('work_category', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Risk Range Slider */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-900">
              {isHindi ? "जोखिम स्कोर रेंज" : "Risk Score Range"}
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={filters.minRisk}
                onChange={(e) => handleFilterChange('minRisk', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-slate-900 min-w-[60px]">
                {filters.minRisk} - {filters.maxRisk}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.maxRisk}
                onChange={(e) => handleFilterChange('maxRisk', parseInt(e.target.value))}
                className="flex-1"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-900 mb-2">
                {isHindi ? "सॉर्ट करें" : "Sort By"}
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="composite_risk_score">Risk Score</option>
                <option value="work_id">Project ID</option>
                <option value="state">State</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-900 mb-2">
                {isHindi ? "क्रम" : "Order"}
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">{isHindi ? "घटते" : "Descending"}</option>
                <option value="asc">{isHindi ? "बढ़ते" : "Ascending"}</option>
              </select>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            className="w-full px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {isHindi ? "फ़िल्टर रीसेट करें" : "Reset Filters"}
          </button>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-900">{isHindi ? "त्रुटि" : "Error"}</p>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">{isHindi ? "लोड हो रहा है..." : "Loading projects..."}</p>
        </div>
      )}

      {/* Projects Table */}
      {!loading && displayProjects.length > 0 && (
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">{isHindi ? "परियोजना ID" : "Project ID"}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">{isHindi ? "राज्य" : "State"}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">{isHindi ? "जिला" : "District"}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">{isHindi ? "श्रेणी" : "Category"}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">{isHindi ? "जोखिम" : "Risk"}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">{isHindi ? "स्कोर" : "Score"}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">{isHindi ? "स्थिति" : "Status"}</th>
              </tr>
            </thead>
            <tbody>
              {displayProjects.map((project, idx) => {
                const risk = riskDetails(project.risk_level);
                return (
                  <tr
                    key={project.work_id}
                    onClick={() => onSelectProject?.(project.work_id)}
                    className="border-b border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{project.work_id}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{project.state}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{project.district}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{project.work_category}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${risk.bgColor} ${risk.textColor}`}>
                        {risk.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      {project.composite_risk_score.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 capitalize">{project.work_status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && displayProjects.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium mb-2">
            {showSearchResults
              ? isHindi ? "कोई परिणाम नहीं मिला" : "No search results"
              : isHindi ? "कोई परियोजना नहीं" : "No projects found"
            }
          </p>
          <p className="text-sm text-slate-500">
            {showSearchResults
              ? isHindi ? "अपनी खोज को अपडेट करें" : "Try adjusting your search"
              : isHindi ? "फ़िल्टर को अपडेट करें" : "Try adjusting your filters"
            }
          </p>
        </div>
      )}

      {/* Pagination */}
      {!loading && !showSearchResults && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => fetchProjects(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-slate-600">
            {isHindi ? `पृष्ठ ${currentPage} का ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
          </span>
          <button
            onClick={() => fetchProjects(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Legal Disclaimer */}
      <div className="mt-8">
        <LegalDisclaimer size="sm" variant="light" />
      </div>
    </div>
  );
};

export default ProjectQueueView;
