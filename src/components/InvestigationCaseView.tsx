import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  FileText,
  Plus,
  X,
  Loader,
  ChevronDown,
  ChevronUp,
  Save,
  Send,
  MessageSquare,
} from "lucide-react";
import { Language } from "../types";

interface InvestigationCaseViewProps {
  caseId: string;
  projectId: string;
  language?: Language;
  onClose?: () => void;
  onSave?: (caseUpdate: CaseUpdate) => void;
}

interface CaseUpdate {
  status: string;
  notes?: string;
  action?: {
    type: string;
    description: string;
    timestamp: string;
    performedBy: string;
  };
}

interface Evidence {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  confidence: number;
  sourceType: string;
}

interface Action {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  performedBy: string;
  status: "pending" | "completed" | "failed";
}

interface InvestigationCase {
  case_id: string;
  project_id: string;
  status: "open" | "in_progress" | "on_hold" | "closed" | "escalated";
  created_at: string;
  updated_at: string;
  created_by: string;
  assigned_to?: string;
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  description?: string;
  evidence: Evidence[];
  actions: Action[];
  notes?: string;
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  open: { bg: "bg-blue-50", text: "text-blue-900", border: "border-blue-200" },
  in_progress: { bg: "bg-yellow-50", text: "text-yellow-900", border: "border-yellow-200" },
  on_hold: { bg: "bg-slate-50", text: "text-slate-900", border: "border-slate-200" },
  closed: { bg: "bg-green-50", text: "text-green-900", border: "border-green-200" },
  escalated: { bg: "bg-red-50", text: "text-red-900", border: "border-red-200" },
};

const priorityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

const timeAgo = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

export const InvestigationCaseView: React.FC<InvestigationCaseViewProps> = ({
  caseId,
  projectId,
  language = "en",
  onClose,
  onSave,
}) => {
  const isHindi = language === "hi";
  const [caseData, setCaseData] = useState<InvestigationCase>({
    case_id: caseId,
    project_id: projectId,
    status: "in_progress",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "System",
    assigned_to: "investigator_001",
    priority: "high",
    title: "Financial Anomaly Investigation",
    description: "Investigate discrepancies in fund utilization",
    evidence: [
      {
        id: "ev_001",
        type: "financial_record",
        title: "Fund Transfer Log",
        description: "Unauthorized transfer detected in project account",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        confidence: 0.92,
        sourceType: "automated_detection",
      },
      {
        id: "ev_002",
        type: "document",
        title: "Vendor Invoice",
        description: "Invoice amount mismatch with actual delivery",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        confidence: 0.85,
        sourceType: "manual_review",
      },
    ],
    actions: [
      {
        id: "act_001",
        type: "review_requested",
        description: "Financial records review requested",
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        performedBy: "investigator_001",
        status: "completed",
      },
      {
        id: "act_002",
        type: "audit_initiated",
        description: "Preliminary audit of transactions initiated",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        performedBy: "investigator_001",
        status: "in_progress",
      },
    ],
    notes: "Initial findings suggest possible vendor collusion. Awaiting audit results.",
  });

  const [newStatus, setNewStatus] = useState<string>(caseData.status);
  const [showActionModal, setShowActionModal] = useState(false);
  const [newAction, setNewAction] = useState({ type: "", description: "" });
  const [expandedSections, setExpandedSections] = useState({
    evidence: true,
    actions: true,
    notes: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [caseNotes, setCaseNotes] = useState(caseData.notes || "");

  const handleStatusChange = (status: string) => {
    setNewStatus(status);
  };

  const handleAddAction = () => {
    if (!newAction.type || !newAction.description) return;

    const action: Action = {
      id: `act_${Date.now()}`,
      type: newAction.type,
      description: newAction.description,
      timestamp: new Date().toISOString(),
      performedBy: "investigator_001",
      status: "completed",
    };

    setCaseData({
      ...caseData,
      actions: [action, ...caseData.actions],
    });

    setNewAction({ type: "", description: "" });
    setShowActionModal(false);
  };

  const handleSaveCase = async () => {
    setIsSaving(true);
    try {
      const update: CaseUpdate = {
        status: newStatus,
        notes: caseNotes,
      };
      onSave?.(update);
      setCaseData({
        ...caseData,
        status: newStatus as any,
        notes: caseNotes,
        updated_at: new Date().toISOString(),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const colors = statusColors[caseData.status] || statusColors.open;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="w-full max-w-2xl bg-white rounded-t-xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900">{caseData.title}</h2>
            <p className="text-sm text-slate-600 mt-1">{caseData.case_id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Case Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            {/* Current Status */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                {isHindi ? "स्थिति" : "Status"}
              </label>
              <div className={`p-3 rounded-lg border ${colors.border} ${colors.bg}`}>
                <select
                  value={newStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full bg-transparent font-medium text-slate-900 outline-none cursor-pointer"
                >
                  <option value="open">{isHindi ? "खुला" : "Open"}</option>
                  <option value="in_progress">{isHindi ? "प्रगति में" : "In Progress"}</option>
                  <option value="on_hold">{isHindi ? "रुका हुआ" : "On Hold"}</option>
                  <option value="closed">{isHindi ? "बंद" : "Closed"}</option>
                  <option value="escalated">{isHindi ? "बढ़ाया गया" : "Escalated"}</option>
                </select>
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                {isHindi ? "प्राथमिकता" : "Priority"}
              </label>
              <div className={`p-3 rounded-lg ${priorityColors[caseData.priority]}`}>
                <p className="font-medium capitalize">{caseData.priority}</p>
              </div>
            </div>
          </div>

          {/* Case Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="text-xs text-slate-600 mb-1">
                {isHindi ? "असाइन किया गया:" : "Assigned To:"}
              </p>
              <p className="font-medium text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                {caseData.assigned_to || "Unassigned"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-1">
                {isHindi ? "बनाया गया:" : "Created:"}
              </p>
              <p className="font-medium text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                {timeAgo(caseData.created_at)}
              </p>
            </div>
          </div>

          {/* Description */}
          {caseData.description && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">
                {isHindi ? "विवरण" : "Description"}
              </h3>
              <p className="text-slate-700 p-3 bg-slate-50 rounded-lg">
                {caseData.description}
              </p>
            </div>
          )}

          {/* Evidence Section */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection("evidence")}
              className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-600" />
                <span className="font-semibold text-slate-900">
                  {isHindi ? "साक्ष्य" : "Evidence"} ({caseData.evidence.length})
                </span>
              </div>
              {expandedSections.evidence ? (
                <ChevronUp className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {expandedSections.evidence && (
              <div className="p-4 space-y-3 border-t border-slate-200">
                {caseData.evidence.map((evidence) => (
                  <div key={evidence.id} className="p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-slate-900">{evidence.title}</h4>
                        <p className="text-xs text-slate-600 capitalize">
                          {evidence.type.replace(/_/g, " ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-600">
                            {(evidence.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{timeAgo(evidence.timestamp)}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700">{evidence.description}</p>
                    <p className="text-xs text-slate-500 mt-2 capitalize">
                      {isHindi ? "स्रोत:" : "Source:"} {evidence.sourceType.replace(/_/g, " ")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions Timeline */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection("actions")}
              className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-slate-600" />
                <span className="font-semibold text-slate-900">
                  {isHindi ? "कार्य रिकॉर्ड" : "Action Records"} ({caseData.actions.length})
                </span>
              </div>
              {expandedSections.actions ? (
                <ChevronUp className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {expandedSections.actions && (
              <div className="p-4 space-y-4 border-t border-slate-200">
                {/* Add New Action Button */}
                {!showActionModal && (
                  <button
                    onClick={() => setShowActionModal(true)}
                    className="w-full p-3 border border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    {isHindi ? "कार्य जोड़ें" : "Add Action"}
                  </button>
                )}

                {/* New Action Form */}
                {showActionModal && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                    <input
                      type="text"
                      placeholder={isHindi ? "कार्य प्रकार" : "Action type"}
                      value={newAction.type}
                      onChange={(e) => setNewAction({ ...newAction, type: e.target.value })}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg text-slate-900 placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      placeholder={isHindi ? "विवरण" : "Description"}
                      value={newAction.description}
                      onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg text-slate-900 placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddAction}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                      >
                        <Send className="w-4 h-4" />
                        {isHindi ? "सहेजें" : "Save"}
                      </button>
                      <button
                        onClick={() => setShowActionModal(false)}
                        className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        {isHindi ? "रद्द करें" : "Cancel"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="space-y-4">
                  {caseData.actions.map((action, idx) => (
                    <div key={action.id} className="relative">
                      {idx < caseData.actions.length - 1 && (
                        <div className="absolute left-2 top-8 w-0.5 h-8 bg-slate-200" />
                      )}
                      <div className="flex gap-3">
                        <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-1 ${
                          action.status === 'completed' ? 'bg-green-100 border-2 border-green-600' :
                          action.status === 'in_progress' ? 'bg-blue-100 border-2 border-blue-600' :
                          'bg-slate-100 border-2 border-slate-400'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 capitalize">
                            {action.type.replace(/_/g, " ")}
                          </p>
                          <p className="text-sm text-slate-700">{action.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-600">
                            <span>{timeAgo(action.timestamp)}</span>
                            <span>{isHindi ? "द्वारा:" : "By:"} {action.performedBy}</span>
                            <span className="capitalize px-2 py-1 bg-slate-100 text-slate-700 rounded">
                              {action.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Case Notes */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection("notes")}
              className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-600" />
                <span className="font-semibold text-slate-900">
                  {isHindi ? "नोट्स" : "Case Notes"}
                </span>
              </div>
              {expandedSections.notes ? (
                <ChevronUp className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {expandedSections.notes && (
              <div className="p-4 border-t border-slate-200">
                <textarea
                  value={caseNotes}
                  onChange={(e) => setCaseNotes(e.target.value)}
                  placeholder={isHindi ? "केस नोट्स जोड़ें..." : "Add case notes..."}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer - Action Buttons */}
        <div className="border-t border-slate-200 p-6 bg-slate-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium"
          >
            {isHindi ? "बंद करें" : "Close"}
          </button>
          <button
            onClick={handleSaveCase}
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                {isHindi ? "सहेजा जा रहा है..." : "Saving..."}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isHindi ? "सहेजें" : "Save Changes"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestigationCaseView;
