import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  AlertTriangle,
  MapPin,
  DollarSign,
  TrendingUp,
  Calendar,
  Loader,
  AlertCircle,
  CheckCircle2,
  Square
} from "lucide-react";
import { Language } from "../types";
import { apiCall } from "../services/api";
import { LegalDisclaimer } from "../components/common/LegalDisclaimer";
import { ReasonCodeCard } from "../components/common/ReasonCodeCard";
import { getRiskLevelDetails, investigationChecklistMap } from "../data/mlCopyMap";

interface ProjectDetailViewProps {
  projectId: string;
  language?: Language;
  onBack?: () => void;
}

interface ProjectDetail {
  work_id: string;
  state: string;
  district: string;
  work_category: string;
  sanction_amount: number;
  total_expenditure: number;
  composite_risk_score: number;
  risk_level: string;
  work_status: string;
  physical_progress: number;
  mock_visualization?: {
    lat: number;
    lng: number;
  };
  reason_codes?: string[];
}

interface Investigation {
  project_id: string;
  composite_risk_score: number;
  risk_level: string;
  evidence_confidence_score: number;
  evidence_completeness_state: string;
  active_signals?: Record<string, boolean>;
  recommendations?: Array<{
    check_type: string;
    action: string;
  }>;
  data_limitations?: string[];
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  projectId,
  language = "en",
  onBack
}) => {
  const isHindi = language === "hi";
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // Fetch project detail and investigation
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);

        // Encode project ID
        const encodedId = encodeURIComponent(projectId);

        // Fetch both project detail and investigation
        const [projectRes, investigationRes] = await Promise.all([
          apiCall<any>(`/api/ml/projects/${encodedId}`, { 
            method: 'GET',
            headers: { 'skipAuth': 'false' }
          }).catch(err => {
            if ((err as any).statusCode === 422) {
              setError('This project has insufficient historical data for full analysis.');
              return null;
            }
            throw err;
          }),
          apiCall<any>(`/api/ml/investigations/${encodedId}`, { 
            method: 'GET',
            headers: { 'skipAuth': 'false' }
          }).catch(() => null)
        ]);

        setProject(projectRes);
        setInvestigation(investigationRes);
      } catch (err: any) {
        console.error('Error fetching project detail:', err);
        if (err.statusCode === 404) {
          setError('Project not found.');
        } else {
          setError(err.message || 'Failed to load project details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [projectId]);

  const handleChecklistToggle = (itemId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">{isHindi ? "लोड हो रहा है..." : "Loading project details..."}</p>
        </div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="space-y-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {isHindi ? "वापस जाएं" : "Go Back"}
        </button>

        <div className="p-6 bg-red-50 border border-red-200 rounded-lg flex gap-4">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-900 mb-1">{isHindi ? "त्रुटि" : "Error"}</p>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const risk = getRiskLevelDetails(project.risk_level);
  const utilization = project.sanction_amount > 0 
    ? (project.total_expenditure / project.sanction_amount) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        {isHindi ? "वापस जाएं" : "Go Back"}
      </button>

      {/* Project Title & Risk */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{project.work_id}</h1>
            <p className="text-slate-600">{project.work_category}</p>
          </div>
          <span className={`px-4 py-2 rounded-lg font-semibold text-lg ${risk.bgColor} ${risk.textColor}`}>
            {risk.label}
          </span>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* State & District */}
        <div className="p-4 border border-slate-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2 text-slate-600">
            <MapPin className="w-5 h-5" />
            <span className="text-sm font-medium">{isHindi ? "स्थान" : "Location"}</span>
          </div>
          <p className="font-semibold text-slate-900">{project.state}</p>
          <p className="text-sm text-slate-600">{project.district}</p>
        </div>

        {/* Sanctioned Amount */}
        <div className="p-4 border border-slate-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2 text-slate-600">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-medium">{isHindi ? "स्वीकृत राशि" : "Sanctioned Amount"}</span>
          </div>
          <p className="font-semibold text-slate-900">₹{(project.sanction_amount / 100000).toFixed(2)}L</p>
        </div>

        {/* Expenditure */}
        <div className="p-4 border border-slate-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2 text-slate-600">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">{isHindi ? "व्यय" : "Expenditure"}</span>
          </div>
          <p className="font-semibold text-slate-900">₹{(project.total_expenditure / 100000).toFixed(2)}L</p>
          <p className="text-xs text-slate-600">{utilization.toFixed(1)}% utilization</p>
        </div>

        {/* Risk Score */}
        <div className="p-4 border border-slate-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2 text-slate-600">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">{isHindi ? "जोखिम स्कोर" : "Risk Score"}</span>
          </div>
          <p className="font-semibold text-slate-900">{project.composite_risk_score.toFixed(2)}%</p>
          {investigation?.evidence_confidence_score && (
            <p className="text-xs text-slate-600">
              {isHindi ? "आत्मविश्वास" : "Confidence"}: {investigation.evidence_confidence_score.toFixed(1)}%
            </p>
          )}
        </div>
      </div>

      {/* Physical Progress */}
      <div className="p-4 border border-slate-200 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-slate-900">
            {isHindi ? "भौतिक प्रगति" : "Physical Progress"}
          </span>
          <span className="text-lg font-bold text-slate-900">{project.physical_progress}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all"
            style={{ width: `${Math.min(project.physical_progress, 100)}%` }}
          />
        </div>
        <p className="text-xs text-slate-600 mt-2">
          {isHindi ? "स्थिति" : "Status"}: {project.work_status}
        </p>
      </div>

      {/* Map (if available) */}
      {project.mock_visualization && (
        <div className="p-4 border border-slate-200 rounded-lg">
          <h3 className="font-semibold text-slate-900 mb-3">
            {isHindi ? "परियोजना स्थान" : "Project Location"}
          </h3>
          <div className="bg-slate-100 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600">
                {project.mock_visualization.lat.toFixed(4)}, {project.mock_visualization.lng.toFixed(4)}
              </p>
              <p className="text-xs text-slate-500 mt-1">{isHindi ? "नक्शा उपलब्ध नहीं" : "Map not available"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Data Limitations Warning */}
      {investigation?.data_limitations && investigation.data_limitations.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900 mb-2">
              {isHindi ? "डेटा सीमाएं" : "Data Limitations"}
            </p>
            <ul className="text-sm text-amber-800 space-y-1">
              {investigation.data_limitations.map((limitation, idx) => (
                <li key={idx}>• {limitation}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Reason Codes */}
      {project.reason_codes && project.reason_codes.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            {isHindi ? "पहचाने गए कारण" : "Identified Reasons"}
          </h2>
          <div className="space-y-4">
            {project.reason_codes.map((reasonCode) => (
              <ReasonCodeCard
                key={reasonCode}
                reasonCode={reasonCode}
                expandable={true}
                defaultExpanded={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Investigation Recommendations Checklist */}
      {investigation?.recommendations && investigation.recommendations.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            {isHindi ? "अनुशंसित जांच चेकलिस्ट" : "Recommended Investigation Checklist"}
          </h2>
          <div className="p-4 border border-slate-200 rounded-lg space-y-3">
            {investigation.recommendations.map((rec, idx) => {
              const itemId = `rec-${idx}`;
              const isChecked = checkedItems.has(itemId);
              return (
                <div key={itemId} className="flex items-start gap-3">
                  <button
                    onClick={() => handleChecklistToggle(itemId)}
                    className="flex-shrink-0 mt-1"
                  >
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">
                      {rec.check_type}
                    </p>
                    <p className="text-sm text-slate-600">
                      {rec.action}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Signals */}
      {investigation?.active_signals && Object.keys(investigation.active_signals).length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            {isHindi ? "सक्रिय संकेत" : "Active Signals"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(investigation.active_signals).map(([signal, isActive]) => (
              <div
                key={signal}
                className={`p-3 rounded-lg border ${
                  isActive
                    ? 'bg-red-50 border-red-200'
                    : 'bg-green-50 border-green-200'
                }`}
              >
                <p className={`text-sm font-medium ${
                  isActive ? 'text-red-900' : 'text-green-900'
                }`}>
                  {signal.replace(/_/g, ' ')}
                </p>
                <p className={`text-xs ${
                  isActive ? 'text-red-800' : 'text-green-800'
                }`}>
                  {isActive ? (isHindi ? "सक्रिय" : "Active") : (isHindi ? "निष्क्रिय" : "Inactive")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legal Disclaimer */}
      <div className="mt-8">
        <LegalDisclaimer size="md" variant="light" />
      </div>
    </div>
  );
};

export default ProjectDetailView;
