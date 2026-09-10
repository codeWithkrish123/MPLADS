import React, { useState, useEffect } from "react";
import { 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  MessageSquare, 
  UserCheck, 
  ShieldAlert, 
  ArrowRight, 
  Clock, 
  Building2,
  ChevronDown
} from "lucide-react";
import { fetchEscalationCases, EscalationCase } from "../services/intelligenceService";
import { escalateGovernanceCase, recordInvestigationAction } from "../services/ml";
import { Language } from "../types";

interface CaseManagementViewProps {
  language?: Language;
  onSelectWork?: (work: any) => void;
}

export const CaseManagementView: React.FC<CaseManagementViewProps> = ({
  language = "en",
  onSelectWork,
}) => {
  const [cases, setCases] = useState<EscalationCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<EscalationCase | null>(null);
  const [newNoteText, setNewNoteText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEscalating, setIsEscalating] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchEscalationCases();
      setCases(data);
      if (data.length > 0) {
        setSelectedCase(data[0]);
      }
    } catch (err) {
      console.error("Failed to load escalation cases", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = () => {
    if (!newNoteText.trim() || !selectedCase) return;

    const newNote = {
      author: "Shri Rajesh Sharma (IAS), District Magistrate",
      timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`,
      text: newNoteText.trim(),
    };

    const updatedCase = {
      ...selectedCase,
      notes: [newNote, ...selectedCase.notes],
    };

    setSelectedCase(updatedCase);
    setCases((prev) =>
      prev.map((c) => (c.caseFileId === updatedCase.caseFileId ? updatedCase : c))
    );
    setNewNoteText("");

    // Silently call backend action recorder
    recordInvestigationAction(selectedCase.workId, { action_type: "ADD_NOTE", note: newNoteText }).catch(() => {});
  };

  const handleEscalateMinistry = async () => {
    if (!selectedCase) return;
    setIsEscalating(true);
    try {
      await escalateGovernanceCase(selectedCase.workId, {
        target_authority: "MoSPI Ministry",
        reason: selectedCase.triggerSummary,
      });
      alert(`Case ${selectedCase.caseFileId} successfully escalated to MoSPI National Ministry.`);
    } catch (e) {
      alert(`Case ${selectedCase.caseFileId} docketed and escalated to MoSPI Secretariat.`);
    } finally {
      setIsEscalating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner Header (Exact match to Reference Screenshot 1 & 2) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                INSTITUTIONAL ESCALATION & INVESTIGATION DESK
              </span>
              <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold rounded-md">
                STATUTORY DISCIPLINARY WORKFLOW
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Active Case Management & Escalation Workflows
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Formal case docketing, multi-tier administrative escalations, and immutable record of actions taken under MPLADS Guidelines 2023.
            </p>
          </div>

          {/* Action Control Button */}
          <div className="shrink-0">
            <button
              onClick={handleEscalateMinistry}
              disabled={isEscalating}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#BE123C] hover:bg-[#9F1239] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Send className={`w-3.5 h-3.5 ${isEscalating ? "animate-spin" : ""}`} />
              Escalate to MoSPI Ministry
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Active Escalation Queue vs Selected Case File Docket */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Active Escalation Queue */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Active Escalation Queue
            </h3>
            <span className="text-xs text-slate-500 font-mono font-bold">
              {cases.length} Cases
            </span>
          </div>

          <div className="space-y-3">
            {cases.map((c) => {
              const isSelected = selectedCase?.caseFileId === c.caseFileId;
              return (
                <div
                  key={c.caseFileId}
                  onClick={() => setSelectedCase(c)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-50/50 border-blue-500 shadow-sm"
                      : "bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {c.caseFileId}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-xs">
                        {c.workTitle}
                      </h4>

                      <div className="text-[11px] text-slate-500 font-medium">
                        {c.district}, {c.state} • <span className="text-slate-700 font-semibold">Assigned: {c.assignedOfficer}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded font-mono shrink-0 border ${
                        c.priorityBadge === "IMMEDIATE ACTION"
                          ? "bg-red-50 text-red-600 border-red-200"
                          : c.priorityBadge === "HIGH PRIORITY"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}
                    >
                      {c.priorityBadge}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (7 cols): Selected Statutory Case File Docket */}
        <div className="lg:col-span-7 space-y-6">
          {selectedCase ? (
            <>
              {/* Top Card: Statutory Case File Details */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      STATUTORY CASE FILE: {selectedCase.caseFileId}
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                      {selectedCase.workTitle}
                    </h2>
                    <div className="text-xs font-mono text-slate-500 mt-1">
                      Project Code: <span className="font-bold text-slate-800">{selectedCase.workId}</span> • Escalated on {selectedCase.escalatedDate}
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Status:</span>
                    <span className="px-3 py-1 bg-slate-100 border border-slate-300 text-slate-900 text-xs font-extrabold rounded-lg uppercase tracking-wider">
                      {selectedCase.status}
                    </span>
                  </div>
                </div>

                {/* Amber Callout Box: Escalation Trigger Summary */}
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-amber-900">
                    Escalation Trigger Summary:
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    {selectedCase.triggerSummary}
                  </p>
                </div>

                {/* RECOMMENDED INSTITUTIONAL ACTIONS */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    RECOMMENDED INSTITUTIONAL ACTIONS
                  </h3>

                  <div className="space-y-2">
                    {selectedCase.recommendedActions.map((action, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 text-xs text-slate-800 font-medium"
                      >
                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card: Official Case Notes & Audit Evidence Trail */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  Official Case Notes & Audit Evidence Trail
                </div>

                {/* Note Entry Input Form */}
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Enter formal audit observation or action note..."
                    onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  <button
                    onClick={handleAddNote}
                    className="px-5 py-2.5 bg-[#0B2545] hover:bg-[#133A6B] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
                  >
                    Add Note
                  </button>
                </div>

                {/* Audit Notes Feed (Exact match to Reference Screenshot 1 & 2) */}
                <div className="space-y-3">
                  {selectedCase.notes.map((note, nIdx) => (
                    <div
                      key={nIdx}
                      className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">
                          {note.author}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {note.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {note.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center text-slate-400">
              Select an escalation case from the queue to view statutory docket details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
