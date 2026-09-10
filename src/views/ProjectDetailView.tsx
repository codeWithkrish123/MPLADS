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
  Square,
  Zap,
  Bell,
  BookOpen,
} from "lucide-react";
import { Language } from "../types";
import { apiCall } from "../services/api";
import { mlApi } from "../services/ml";
import { buildErrorReport } from "../utils/errorHandler";
import { LegalDisclaimer } from "../components/common/LegalDisclaimer";
import { ReasonCodeCard } from "../components/common/ReasonCodeCard";
import { SignalsCard } from "../components/SignalsCard";
import { AlertsCard } from "../components/AlertsCard";
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
  
  // ML API data states
  const [signals, setSignals] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [mlLoading, setMlLoading] = useState({ signals: false, alerts: false, investigation: false });
  const [mlError, setMlError] = useState<Record<string, string>>({});
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'signals' | 'alerts' | 'investigation'>('overview');

  // Fetch project detail and investigation
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);

        // Encode project ID
        const encodedId = encodeURIComponent(projectId);

        // Fetch project detail
        const projectRes = await apiCall<any>(`/api/ml/projects/${encodedId}`, { 
          method: 'GET',
          headers: { 'skipAuth': 'false' }
        }).catch(err => {
          if ((err as any).statusCode === 422) {
            setError('This project has insufficient historical data for full analysis.');
            return null;
          }
          throw err;
        });

        setProject(projectRes);

        // Fetch investigation from legacy service (keep for compatibility)
        const investigationRes = await apiCall<any>(`/api/ml/investigations/${encodedId}`, { 
          method: 'GET',
          headers: { 'skipAuth': 'false' }
        }).catch(() => null);

        setInvestigation(investigationRes);
        
        // Fetch ML API data (signals, alerts, investigation)
        await fetchMlData(projectId);
      } catch (err: any) {
        setError(err?.message || 'Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [projectId]);

  // Fetch signals, alerts, and investigation from ML API
  const fetchMlData = async (pId: string) => {
    try {
      // Fetch signals
      setMlLoading(prev => ({ ...prev, signals: true }));
      try {
        const signalsRes = await mlApi.getProjectSignals(pId);
        setSignals(signalsRes.signals || []);
        setMlError(prev => ({ ...prev, signals: '' }));
      } catch (err) {
        const { userMessage } = buildErrorReport(err);
        setMlError(prev => ({ ...prev, signals: userMessage }));
      } finally {
        setMlLoading(prev => ({ ...prev, signals: false }));
      }

      // Fetch alerts
      setMlLoading(prev => ({ ...prev, alerts: true }));
      try {
        const alertsRes = await mlApi.getProjectAlerts(pId);
        setAlerts(alertsRes.alerts || []);
        setMlError(prev => ({ ...prev, alerts: '' }));
      } catch (err) {
        const { userMessage } = buildErrorReport(err);
        setMlError(prev => ({ ...prev, alerts: userMessage }));
      } finally {
        setMlLoading(prev => ({ ...prev, alerts: false }));
      }

      // Fetch investigation
      setMlLoading(prev => ({ ...prev, investigation: true }));
      try {
        const invRes = await mlApi.getProjectInvestigation(pId);
        setInvestigation(invRes);
        setMlError(prev => ({ ...prev, investigation: '' }));
      } catch (err) {
        const { userMessage } = buildErrorReport(err);
        setMlError(prev => ({ ...prev, investigation: userMessage }));
      } finally {
        setMlLoading(prev => ({ ...prev, investigation: false }));
      }
    } catch (err) {
      console.error('Error fetching ML data:', err);
    }
  };

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

      {/* Tabs for Signals, Alerts, and Investigation */}
      <div className="border-b border-slate-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {isHindi ? 'अवलोकन' : 'Overview'}
          </button>
          <button
            onClick={() => setActiveTab('signals')}
            className={`px-4 py-3 font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'signals'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4" />
            {isHindi ? 'संकेत' : 'Signals'}
            {signals.length > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
                {signals.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-3 font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'alerts'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            {isHindi ? 'सतर्कताएं' : 'Alerts'}
            {alerts.length > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
                {alerts.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('investigation')}
            className={`px-4 py-3 font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === 'investigation'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            {isHindi ? 'जांच' : 'Investigation'}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="pt-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
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
        )}

        {/* Signals Tab */}
        {activeTab === 'signals' && (
          <div>
            {mlLoading.signals ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : mlError.signals ? (
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg flex gap-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-900 mb-1">{isHindi ? "त्रुटि" : "Error"}</p>
                  <p className="text-red-800">{mlError.signals}</p>
                </div>
              </div>
            ) : signals.length > 0 ? (
              <SignalsCard 
                signals={signals}
                language={language}
              />
            ) : (
              <div className="text-center py-12">
                <Zap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">{isHindi ? "कोई संकेत नहीं मिले" : "No signals found"}</p>
              </div>
            )}
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div>
            {mlLoading.alerts ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : mlError.alerts ? (
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg flex gap-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-900 mb-1">{isHindi ? "त्रुटि" : "Error"}</p>
                  <p className="text-red-800">{mlError.alerts}</p>
                </div>
              </div>
            ) : alerts.length > 0 ? (
              <AlertsCard 
                alerts={alerts}
                language={language}
                onAlertAction={(alertId, action) => {
                  console.log(`Alert ${alertId}: ${action}`);
                  // Action can be: 'acknowledge' | 'escalate' | 'resolve'
                  // TODO: Implement alert action callbacks
                }}
              />
            ) : (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">{isHindi ? "कोई सतर्कताएं नहीं मिलीं" : "No alerts found"}</p>
              </div>
            )}
          </div>
        )}

        {/* Investigation Tab */}
        {activeTab === 'investigation' && (
          <div className="space-y-6">
            {mlLoading.investigation ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : mlError.investigation ? (
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg flex gap-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-900 mb-1">{isHindi ? "त्रुटि" : "Error"}</p>
                  <p className="text-red-800">{mlError.investigation}</p>
                </div>
              </div>
            ) : investigation ? (
              <>
                {/* Investigation Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Risk Assessment */}
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-3">
                      {isHindi ? "जोखिम आकलन" : "Risk Assessment"}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">
                          {isHindi ? "जोखिम स्तर" : "Risk Level"}
                        </p>
                        <p className={`text-lg font-bold ${
                          investigation.risk_level === 'CRITICAL' ? 'text-red-600' :
                          investigation.risk_level === 'HIGH' ? 'text-orange-600' :
                          investigation.risk_level === 'MEDIUM' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`}>
                          {investigation.risk_level}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">
                          {isHindi ? "जोखिम स्कोर" : "Risk Score"}
                        </p>
                        <p className="text-lg font-bold text-slate-900">
                          {investigation.composite_risk_score.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Evidence Quality */}
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-3">
                      {isHindi ? "साक्ष्य गुणवत्ता" : "Evidence Quality"}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">
                          {isHindi ? "आत्मविश्वास स्कोर" : "Confidence Score"}
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-green-600 h-full"
                              style={{ width: `${investigation.evidence_confidence_score}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-slate-900">
                            {investigation.evidence_confidence_score.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">
                          {isHindi ? "पूर्णता स्थिति" : "Completeness Status"}
                        </p>
                        <p className="text-sm font-medium text-slate-900">
                          {investigation.evidence_completeness_state}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Limitations */}
                {investigation.data_limitations && investigation.data_limitations.length > 0 && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h3 className="font-semibold text-amber-900 mb-3">
                      {isHindi ? "डेटा सीमाएं" : "Data Limitations"}
                    </h3>
                    <ul className="text-sm text-amber-800 space-y-2">
                      {investigation.data_limitations.map((limitation, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-amber-600">•</span>
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {investigation.recommendations && investigation.recommendations.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">
                      {isHindi ? "अनुशंसाएं" : "Recommendations"}
                    </h3>
                    <div className="space-y-3">
                      {investigation.recommendations.map((rec, idx) => (
                        <div key={idx} className="p-4 border border-slate-200 rounded-lg">
                          <p className="font-semibold text-slate-900 mb-2">
                            {rec.check_type}
                          </p>
                          <p className="text-sm text-slate-600">
                            {rec.action}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">{isHindi ? "कोई जांच डेटा उपलब्ध नहीं" : "No investigation data available"}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailView;
