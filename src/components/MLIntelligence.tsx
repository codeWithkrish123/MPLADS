import React, { useState, useEffect } from 'react';
import { AlertCircle, TrendingUp, Zap, Shield, Clock, DollarSign } from 'lucide-react';
import { mlApi } from '../services/ml';

interface MLIntelligenceProps {
  projectId: string;
  projectName: string;
  budget: number;
  expenditure: number;
  progress: number;
  status: string;
}

export const MLIntelligence: React.FC<MLIntelligenceProps> = ({
  projectId,
  projectName,
  budget,
  expenditure,
  progress,
  status
}) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalysis();
  }, [projectId]);

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🤖 Loading ML analysis for project:', projectId);
      
      const result = await mlApi.analyzeProject({
        project_id: projectId,
        name: projectName,
        budget,
        expenditure,
        progress,
        status
      });

      if (result) {
        console.log('✅ ML Analysis loaded:', result);
        setAnalysis(result);
      } else {
        setError('Failed to load ML analysis');
      }
    } catch (err: any) {
      console.error('❌ Error loading analysis:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600">
        <AlertCircle className="inline w-4 h-4 mr-2" />
        {error}
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const delayProb = (analysis.delay_probability * 100).toFixed(1);
  const costAnomaly = (analysis.cost_anomaly_score * 100).toFixed(1);
  const riskLevel = analysis.risk_level || 'MEDIUM';

  return (
    <div className="space-y-4 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-indigo-600" />
        <h3 className="font-semibold text-slate-900">ML Intelligence</h3>
      </div>

      {/* Risk Level */}
      <div className="grid grid-cols-3 gap-3">
        {/* Delay Risk */}
        <div className="p-3 bg-white rounded-lg border border-slate-200">
          <div className="flex items-center gap-1 mb-1">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold text-slate-600 uppercase">Delay Risk</span>
          </div>
          <div className="text-2xl font-bold text-amber-600">{delayProb}%</div>
          <div className="text-[10px] text-slate-500 mt-1">
            {parseFloat(delayProb) > 70 ? '🚨 High Risk' : parseFloat(delayProb) > 40 ? '⚠️ Medium Risk' : '✓ Low Risk'}
          </div>
        </div>

        {/* Cost Anomaly */}
        <div className="p-3 bg-white rounded-lg border border-slate-200">
          <div className="flex items-center gap-1 mb-1">
            <DollarSign className="w-4 h-4 text-red-600" />
            <span className="text-xs font-semibold text-slate-600 uppercase">Cost Anomaly</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{costAnomaly}%</div>
          <div className="text-[10px] text-slate-500 mt-1">
            {parseFloat(costAnomaly) > 50 ? '🚨 Detected' : '✓ Normal'}
          </div>
        </div>

        {/* Risk Level */}
        <div className="p-3 bg-white rounded-lg border border-slate-200">
          <div className="flex items-center gap-1 mb-1">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-slate-600 uppercase">Overall Risk</span>
          </div>
          <div className="text-xl font-bold text-blue-600">{riskLevel}</div>
          <div className="text-[10px] text-slate-500 mt-1">
            {riskLevel === 'HIGH' ? '🔴 High' : riskLevel === 'MEDIUM' ? '🟡 Medium' : '🟢 Low'}
          </div>
        </div>
      </div>

      {/* Estimated Delay */}
      {analysis.estimated_delay_days > 0 && (
        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="text-sm text-red-800">
              <strong>Estimated Delay:</strong> {analysis.estimated_delay_days} days
            </span>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-700 uppercase flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Recommendations
          </h4>
          <ul className="space-y-1">
            {analysis.recommendations.map((rec: string, idx: number) => (
              <li key={idx} className="text-xs text-slate-700 flex gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Refresh Button */}
      <button
        onClick={loadAnalysis}
        className="w-full py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100 rounded transition-colors"
      >
        🔄 Refresh Analysis
      </button>
    </div>
  );
};
