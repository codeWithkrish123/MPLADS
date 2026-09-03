import React, { useState } from "react";
import { Loader, Send, AlertCircle, TrendingUp, Zap } from "lucide-react";
import { Language } from "../types";
import { apiCall } from "../services/api";
import { LegalDisclaimer } from "../components/common/LegalDisclaimer";
import { ReasonCodeCard } from "../components/common/ReasonCodeCard";
import { getRiskLevelDetails } from "../data/mlCopyMap";

interface RiskSimulatorViewProps {
  language?: Language;
}

interface SimulatorFormData {
  work_id: string;
  district_name: string;
  work_category: string;
  work_description: string;
  sanctioned_amount: string;
  total_expenditure: string;
  sanction_date: string;
  work_status: string;
}

interface AnalysisResult {
  work_id_clean: string;
  composite_risk_score: number;
  risk_level: string;
  factors?: Array<{
    type: string;
    score: number;
    reason: string;
  }>;
}

export const RiskSimulatorView: React.FC<RiskSimulatorViewProps> = ({
  language = "en"
}) => {
  const isHindi = language === "hi";

  // Form state
  const [formData, setFormData] = useState<SimulatorFormData>({
    work_id: "WS/NEW/2024/001",
    district_name: "New Delhi",
    work_category: "Drinking Water",
    work_description: "Installation of piped water system in rural area",
    sanctioned_amount: "5000000",
    total_expenditure: "4500000",
    sanction_date: "2024-01-15",
    work_status: "ongoing"
  });

  // Results
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle input changes
  const handleInputChange = (
    field: keyof SimulatorFormData,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Validate required fields
      const required = [
        'work_id', 'district_name', 'work_category',
        'work_description', 'sanctioned_amount',
        'total_expenditure', 'sanction_date', 'work_status'
      ];

      const missing = required.filter(field => !formData[field as keyof SimulatorFormData]);
      if (missing.length > 0) {
        setError(`Missing required fields: ${missing.join(', ')}`);
        setLoading(false);
        return;
      }

      // Call analysis endpoint
      const response = await apiCall<any>(
        '/api/ml/analyze',
        {
          method: 'POST',
          body: JSON.stringify({
            work_id: formData.work_id,
            district_name: formData.district_name,
            work_category: formData.work_category,
            work_description: formData.work_description,
            sanctioned_amount: parseFloat(formData.sanctioned_amount),
            total_expenditure: parseFloat(formData.total_expenditure),
            sanction_date: formData.sanction_date,
            work_status: formData.work_status
          }),
          headers: { 'skipAuth': 'false' }
        }
      );

      setResult((response as any)?.analysis || response);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const riskDetails = result ? getRiskLevelDetails(result.risk_level) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {isHindi ? "जोखिम सिम्युलेटर" : "Risk Simulator"}
        </h1>
        <p className="text-slate-600">
          {isHindi
            ? "नई परियोजना के लिए जोखिम स्कोर का अनुमान लगाएं"
            : "Estimate risk scores for a new project"
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Project ID */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                {isHindi ? "परियोजना ID" : "Project ID"} *
              </label>
              <input
                type="text"
                value={formData.work_id}
                onChange={(e) => handleInputChange('work_id', e.target.value)}
                placeholder="WS/NEW/2024/001"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                {isHindi ? "जिला" : "District"} *
              </label>
              <input
                type="text"
                value={formData.district_name}
                onChange={(e) => handleInputChange('district_name', e.target.value)}
                placeholder="New Delhi"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                {isHindi ? "श्रेणी" : "Category"} *
              </label>
              <select
                value={formData.work_category}
                onChange={(e) => handleInputChange('work_category', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Drinking Water">Drinking Water</option>
                <option value="Rural Road">Rural Road</option>
                <option value="School Building">School Building</option>
                <option value="Health Centre">Health Centre</option>
                <option value="Community Infrastructure">Community Infrastructure</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                {isHindi ? "विवरण" : "Description"} *
              </label>
              <textarea
                value={formData.work_description}
                onChange={(e) => handleInputChange('work_description', e.target.value)}
                placeholder="Project description..."
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sanctioned Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                {isHindi ? "स्वीकृत राशि (₹)" : "Sanctioned Amount (₹)"} *
              </label>
              <input
                type="number"
                value={formData.sanctioned_amount}
                onChange={(e) => handleInputChange('sanctioned_amount', e.target.value)}
                placeholder="5000000"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Total Expenditure */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                {isHindi ? "कुल व्यय (₹)" : "Total Expenditure (₹)"} *
              </label>
              <input
                type="number"
                value={formData.total_expenditure}
                onChange={(e) => handleInputChange('total_expenditure', e.target.value)}
                placeholder="4500000"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sanction Date */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                {isHindi ? "स्वीकृति तारीख" : "Sanction Date"} *
              </label>
              <input
                type="date"
                value={formData.sanction_date}
                onChange={(e) => handleInputChange('sanction_date', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                {isHindi ? "स्थिति" : "Status"} *
              </label>
              <select
                value={formData.work_status}
                onChange={(e) => handleInputChange('work_status', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="completed">Completed</option>
                <option value="ongoing">Ongoing</option>
                <option value="planned">Planned</option>
                <option value="stalled">Stalled</option>
              </select>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  {isHindi ? "विश्लेषण हो रहा है..." : "Analyzing..."}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {isHindi ? "विश्लेषण करें" : "Analyze"}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {result ? (
            <div className="space-y-6">
              {/* Risk Score Card */}
              <div className="p-6 border border-slate-200 rounded-lg bg-gradient-to-br from-slate-50 to-white">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {isHindi ? "विश्लेषण परिणाम" : "Analysis Results"}
                  </h2>
                  <Zap className="w-6 h-6 text-yellow-600" />
                </div>

                {riskDetails && (
                  <div>
                    <div className="mb-4">
                      <p className="text-sm text-slate-600 mb-2">
                        {isHindi ? "परियोजना" : "Project"}
                      </p>
                      <p className="text-2xl font-bold text-slate-900 mb-4">
                        {result.work_id_clean}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {/* Risk Score */}
                      <div className="p-4 bg-white border border-slate-200 rounded-lg">
                        <p className="text-xs font-semibold text-slate-600 uppercase mb-2">
                          {isHindi ? "जोखिम स्कोर" : "Risk Score"}
                        </p>
                        <p className={`text-4xl font-bold ${
                          result.composite_risk_score > 70 ? "text-red-600" :
                          result.composite_risk_score > 50 ? "text-orange-600" :
                          result.composite_risk_score > 30 ? "text-amber-600" :
                          "text-green-600"
                        }`}>
                          {result.composite_risk_score.toFixed(2)}%
                        </p>
                      </div>

                      {/* Risk Level */}
                      <div className="p-4 bg-white border border-slate-200 rounded-lg">
                        <p className="text-xs font-semibold text-slate-600 uppercase mb-2">
                          {isHindi ? "जोखिम स्तर" : "Risk Level"}
                        </p>
                        <p className={`text-2xl font-bold ${riskDetails.textColor}`}>
                          {riskDetails.label}
                        </p>
                      </div>
                    </div>

                    {/* Risk Indicator */}
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden mb-4">
                      <div
                        className={`h-full transition-all ${
                          result.composite_risk_score > 70 ? "bg-red-600" :
                          result.composite_risk_score > 50 ? "bg-orange-600" :
                          result.composite_risk_score > 30 ? "bg-amber-600" :
                          "bg-green-600"
                        }`}
                        style={{ width: `${Math.min(result.composite_risk_score, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Contributing Factors */}
              {result.factors && result.factors.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    {isHindi ? "जोखिम के कारक" : "Contributing Factors"}
                  </h3>
                  <div className="space-y-3">
                    {result.factors.map((factor, idx) => (
                      <div key={idx} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold text-slate-900 capitalize">
                            {factor.type}
                          </p>
                          <span className={`px-2.5 py-1 rounded text-sm font-bold ${
                            factor.score > 70 ? "bg-red-100 text-red-800" :
                            factor.score > 50 ? "bg-orange-100 text-orange-800" :
                            factor.score > 30 ? "bg-amber-100 text-amber-800" :
                            "bg-green-100 text-green-800"
                          }`}>
                            +{factor.score.toFixed(1)}%
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{factor.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Legal Disclaimer */}
              <LegalDisclaimer size="md" variant="light" />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-slate-500">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">
                  {isHindi ? "विश्लेषण के परिणाम यहां दिखाई देंगे" : "Analysis results will appear here"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskSimulatorView;
