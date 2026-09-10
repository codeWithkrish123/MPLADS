import React, { useState } from "react";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Zap,
} from "lucide-react";
import { Language } from "../types";

interface AnalysisResultsCardProps {
  projectId: string;
  language?: Language;
  onRecommendationClick?: (recommendationId: string) => void;
}

interface ComponentScore {
  name: string;
  score: number;
  category: string;
  trend: "up" | "down" | "stable";
  description?: string;
}

interface Recommendation {
  id: string;
  priority: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  effort: "high" | "medium" | "low";
  category: string;
}

interface AnalysisResults {
  composite_risk_score: number;
  risk_level: string;
  confidence_score: number;
  component_scores: ComponentScore[];
  recommendations: Recommendation[];
  summary: string;
}

const riskLevelConfig: Record<string, { color: string; bgColor: string; icon: React.ReactNode }> = {
  CRITICAL: {
    color: "text-red-600",
    bgColor: "bg-red-50",
    icon: <AlertTriangle className="w-8 h-8" />,
  },
  HIGH: {
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    icon: <AlertTriangle className="w-8 h-8" />,
  },
  MEDIUM: {
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    icon: <AlertCircle className="w-8 h-8" />,
  },
  LOW: {
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    icon: <CheckCircle2 className="w-8 h-8" />,
  },
};

const priorityColors: Record<string, string> = {
  critical: "border-red-300 bg-red-50 text-red-900",
  high: "border-orange-300 bg-orange-50 text-orange-900",
  medium: "border-yellow-300 bg-yellow-50 text-yellow-900",
  low: "border-blue-300 bg-blue-50 text-blue-900",
};

const effortColors: Record<string, string> = {
  high: "text-red-600",
  medium: "text-yellow-600",
  low: "text-green-600",
};

const CircularGauge: React.FC<{ score: number; label: string; isHindi?: boolean }> = ({
  score,
  label,
  isHindi,
}) => {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (value: number) => {
    if (value >= 80) return "#dc2626"; // red
    if (value >= 60) return "#f97316"; // orange
    if (value >= 40) return "#eab308"; // yellow
    return "#3b82f6"; // blue
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getColor(score)}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-900">{score.toFixed(0)}</span>
          <span className="text-xs text-slate-600">%</span>
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-900 text-center">{label}</p>
    </div>
  );
};

export const AnalysisResultsCard: React.FC<AnalysisResultsCardProps> = ({
  projectId,
  language = "en",
  onRecommendationClick,
}) => {
  const isHindi = language === "hi";
  const [expandedRecommendations, setExpandedRecommendations] = useState<Set<string>>(new Set());

  // Mock data - in real app, would come from API
  const analysisData: AnalysisResults = {
    composite_risk_score: 72.5,
    risk_level: "HIGH",
    confidence_score: 87.3,
    component_scores: [
      {
        name: isHindi ? "वित्तीय जोखिम" : "Financial Risk",
        score: 85,
        category: "financial",
        trend: "up",
        description: "Unusual spending patterns detected",
      },
      {
        name: isHindi ? "पूर्णता जोखिम" : "Completion Risk",
        score: 65,
        category: "execution",
        trend: "stable",
        description: "Project behind schedule",
      },
      {
        name: isHindi ? "अनुपालन जोखिम" : "Compliance Risk",
        score: 45,
        category: "compliance",
        trend: "down",
        description: "Documentation improving",
      },
      {
        name: isHindi ? "गुणवत्ता जोखिम" : "Quality Risk",
        score: 72,
        category: "quality",
        trend: "up",
        description: "Quality issues in deliverables",
      },
    ],
    recommendations: [
      {
        id: "rec_001",
        priority: "critical",
        title: isHindi ? "तत्काल लेखा परीक्षा" : "Immediate Audit Required",
        description:
          isHindi
            ? "वित्तीय लेनदेन की व्यापक लेखा परीक्षा की आवश्यकता है। असंगतियां संदेह का संकेत दे सकती हैं।"
            : "Comprehensive audit of financial transactions required. Discrepancies indicate potential fraud indicators.",
        impact: "high",
        effort: "high",
        category: "financial",
      },
      {
        id: "rec_002",
        priority: "high",
        title: isHindi ? "प्रोजेक्ट शेड्यूल समीक्षा" : "Project Schedule Review",
        description:
          isHindi
            ? "परियोजना बिल्कुल समय सारणी के पीछे है। पुनः प्राप्ति योजना विकसित करें।"
            : "Project is significantly behind schedule. Develop recovery plan with realistic timelines.",
        impact: "high",
        effort: "medium",
        category: "execution",
      },
      {
        id: "rec_003",
        priority: "medium",
        title: isHindi ? "आपूर्तिकर्ता सत्यापन" : "Vendor Verification",
        description:
          isHindi
            ? "सभी प्रमुख आपूर्तिकर्ताओं का सत्यापन और पृष्ठभूमि जांच करें।"
            : "Verify all major vendors and conduct background checks. Cross-check invoices against delivery records.",
        impact: "medium",
        effort: "medium",
        category: "compliance",
      },
      {
        id: "rec_004",
        priority: "medium",
        title: isHindi ? "गुणवत्ता जांच" : "Quality Assurance Review",
        description:
          isHindi
            ? "गुणवत्ता आश्वासन प्रोटोकॉल को सख्त करें और नियमित निरीक्षण बढ़ाएं।"
            : "Strengthen QA protocols and increase inspection frequency. Implement third-party quality checks.",
        impact: "high",
        effort: "medium",
        category: "quality",
      },
      {
        id: "rec_005",
        priority: "low",
        title: isHindi ? "दस्तावेज़ीकरण सुधार" : "Documentation Improvement",
        description:
          isHindi
            ? "परियोजना दस्तावेज़ीकरण को डिजिटाइज़ करें और बेहतर संग्रहण स्थापित करें।"
            : "Digitize project documentation and establish centralized repository for better tracking.",
        impact: "medium",
        effort: "low",
        category: "compliance",
      },
    ],
    summary:
      isHindi
        ? "इस परियोजना के लिए समग्र जोखिम मध्यम-उच्च है, विशेष रूप से वित्तीय और निष्पादन पहलुओं में।"
        : "Overall risk for this project is medium-high, particularly in financial and execution aspects. Financial anomalies require immediate investigation.",
  };

  const toggleRecommendation = (id: string) => {
    const newSet = new Set(expandedRecommendations);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedRecommendations(newSet);
  };

  const riskConfig =
    riskLevelConfig[analysisData.risk_level] || riskLevelConfig.MEDIUM;

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className={`p-6 rounded-lg border-2 ${riskConfig.bgColor}`}>
        <div className="flex gap-4 items-start">
          <div className={riskConfig.color}>{riskConfig.icon}</div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {isHindi ? "जोखिम विश्लेषण सारांश" : "Risk Analysis Summary"}
            </h2>
            <p className="text-slate-700 leading-relaxed">{analysisData.summary}</p>
          </div>
        </div>
      </div>

      {/* Risk Score Gauge & Confidence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Score Gauge */}
        <div className="p-6 border border-slate-200 rounded-lg flex justify-center">
          <CircularGauge
            score={analysisData.composite_risk_score}
            label={isHindi ? "जोखिम स्कोर" : "Risk Score"}
            isHindi={isHindi}
          />
        </div>

        {/* Confidence Score Gauge */}
        <div className="p-6 border border-slate-200 rounded-lg flex justify-center">
          <CircularGauge
            score={analysisData.confidence_score}
            label={isHindi ? "आत्मविश्वास" : "Confidence"}
            isHindi={isHindi}
          />
        </div>
      </div>

      {/* Component Scores */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6 text-blue-600" />
          {isHindi ? "घटक जोखिम स्कोर" : "Component Risk Scores"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysisData.component_scores.map((component) => {
            const scoreColor =
              component.score >= 80
                ? "text-red-600"
                : component.score >= 60
                ? "text-orange-600"
                : component.score >= 40
                ? "text-yellow-600"
                : "text-blue-600";

            const trendIcon =
              component.trend === "up" ? (
                <TrendingUp className="w-5 h-5 text-red-600" />
              ) : component.trend === "down" ? (
                <TrendingUp className="w-5 h-5 text-green-600 transform rotate-180" />
              ) : (
                <div className="w-5 h-5 text-slate-400">−</div>
              );

            return (
              <div key={component.name} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{component.name}</h4>
                    <p className="text-xs text-slate-600 capitalize">
                      {component.category}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-2xl font-bold ${scoreColor}`}>
                      {component.score}
                    </span>
                    {trendIcon}
                  </div>
                </div>

                {/* Score Bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-3">
                  <div
                    className={`h-full transition-all ${
                      component.score >= 80
                        ? "bg-red-600"
                        : component.score >= 60
                        ? "bg-orange-600"
                        : component.score >= 40
                        ? "bg-yellow-600"
                        : "bg-blue-600"
                    }`}
                    style={{ width: `${component.score}%` }}
                  />
                </div>

                {/* Description */}
                {component.description && (
                  <p className="text-sm text-slate-600">{component.description}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          {isHindi ? "सिफारिशें" : "Recommendations"} ({analysisData.recommendations.length})
        </h3>
        <div className="space-y-3">
          {analysisData.recommendations.map((recommendation) => {
            const isExpanded = expandedRecommendations.has(recommendation.id);

            return (
              <div
                key={recommendation.id}
                className={`border rounded-lg overflow-hidden transition-all ${priorityColors[recommendation.priority]}`}
              >
                <button
                  onClick={() => {
                    toggleRecommendation(recommendation.id);
                    onRecommendationClick?.(recommendation.id);
                  }}
                  className="w-full p-4 flex items-start justify-between hover:opacity-80 transition-opacity"
                >
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className={`px-2 py-1 text-xs font-bold rounded-full capitalize ${
                          recommendation.priority === "critical"
                            ? "bg-red-200 text-red-900"
                            : recommendation.priority === "high"
                            ? "bg-orange-200 text-orange-900"
                            : recommendation.priority === "medium"
                            ? "bg-yellow-200 text-yellow-900"
                            : "bg-blue-200 text-blue-900"
                        }`}
                      >
                        {recommendation.priority}
                      </span>
                      <h4 className="font-bold text-base">{recommendation.title}</h4>
                    </div>
                    {!isExpanded && (
                      <p className="text-sm line-clamp-1 opacity-75">
                        {recommendation.description}
                      </p>
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 ml-2 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 ml-2 flex-shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-current opacity-50 pt-3 space-y-3">
                    <p className="text-sm leading-relaxed">{recommendation.description}</p>

                    {/* Impact & Effort */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-current opacity-50">
                      <div>
                        <p className="text-xs font-semibold mb-1">
                          {isHindi ? "प्रभाव" : "Impact"}
                        </p>
                        <span
                          className={`text-sm font-bold capitalize ${
                            recommendation.impact === "high"
                              ? "text-red-700"
                              : recommendation.impact === "medium"
                              ? "text-yellow-700"
                              : "text-green-700"
                          }`}
                        >
                          {recommendation.impact}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-1">
                          {isHindi ? "प्रयास" : "Effort"}
                        </p>
                        <span
                          className={`text-sm font-bold capitalize ${effortColors[recommendation.effort]}`}
                        >
                          {recommendation.effort}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Quality Note */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-900">
          {isHindi
            ? "यह विश्लेषण उपलब्ध डेटा पर आधारित है। अधिक सटीक परिणामों के लिए अतिरिक्त डेटा स्रोतों की जांच की सिफारिश की जाती है।"
            : "This analysis is based on available data sources. Additional data verification is recommended for improved accuracy."}
        </p>
      </div>
    </div>
  );
};

export default AnalysisResultsCard;
