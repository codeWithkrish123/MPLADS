import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  ArrowUpDown,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  CheckSquare,
  Square,
  ExternalLink,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  PauseCircle,
  X,
} from "lucide-react";
import { WorkRecord, RiskSeverity, Language } from "../types";
import { RiskBadge } from "../components/common/RiskBadge";
import { formatINR } from "../lib/utils";
import { getTranslation, translateText } from "../data/translations";

interface WorkIntelligenceTableViewProps {
  works: WorkRecord[];
  onSelectWork: (work: WorkRecord) => void;
  language?: Language;
}

export const WorkIntelligenceTableView: React.FC<WorkIntelligenceTableViewProps> = ({
  works,
  onSelectWork,
  language = "en",
}) => {
  const lang: Language = (language as Language) || "en";
  const isHindi = lang === "hi";
  const t = getTranslation(lang);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [sortField, setSortField] = useState<keyof WorkRecord>("risk_score");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [bulkActionToast, setBulkActionToast] = useState<string | null>(null);
  const pageSize = 6;

  const categories = useMemo(() => {
    const set = new Set(works.map((w) => w.category));
    return ["ALL", ...Array.from(set)];
  }, [works]);

  const filteredWorks = useMemo(() => {
    return works.filter((w) => {
      const matchSearch =
        w.work_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.agency.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCat = selectedCategory === "ALL" || w.category === selectedCategory;
      const matchSev = selectedSeverity === "ALL" || w.risk_category === selectedSeverity;
      const matchStat = selectedStatus === "ALL" || w.status === selectedStatus;

      return matchSearch && matchCat && matchSev && matchStat;
    });
  }, [works, searchTerm, selectedCategory, selectedSeverity, selectedStatus]);

  const sortedWorks = useMemo(() => {
    return [...filteredWorks].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === "string") {
        return sortDirection === "asc"
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }

      if (typeof aVal === "number") {
        return sortDirection === "asc"
          ? (aVal as number) - (bVal as number)
          : (bVal as number) - (aVal as number);
      }

      return 0;
    });
  }, [filteredWorks, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedWorks.length / pageSize) || 1;
  const paginatedWorks = sortedWorks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field: keyof WorkRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const isCurrentPageAllSelected =
    paginatedWorks.length > 0 &&
    paginatedWorks.every((w) => selectedRowIds.includes(w.work_id));

  const handleToggleSelectPage = () => {
    if (isCurrentPageAllSelected) {
      const pageIds = new Set(paginatedWorks.map((w) => w.work_id));
      setSelectedRowIds(selectedRowIds.filter((id) => !pageIds.has(id)));
    } else {
      const pageIds = paginatedWorks.map((w) => w.work_id);
      setSelectedRowIds(Array.from(new Set([...selectedRowIds, ...pageIds])));
    }
  };

  const handleSelectAllFiltered = () => {
    setSelectedRowIds(filteredWorks.map((w) => w.work_id));
  };

  const handleClearSelection = () => {
    setSelectedRowIds([]);
  };

  const handleToggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedRowIds.includes(id)) {
      setSelectedRowIds(selectedRowIds.filter((rId) => rId !== id));
    } else {
      setSelectedRowIds([...selectedRowIds, id]);
    }
  };

  const generateCSV = (dataset: WorkRecord[], filename: string) => {
    const headers = [
      "Work ID",
      "Title / Description",
      "Category",
      "District",
      "State",
      "Implementing Agency",
      "Sanctioned Cost (INR)",
      "Actual Expenditure (INR)",
      "Physical Progress (%)",
      "Financial Progress (%)",
      "Progress Disparity Delta (%)",
      "Expected Completion",
      "Predicted Completion",
      "Risk Score (0-100)",
      "Risk Category",
      "Status",
      "Flagged Anomaly Reasons",
    ].join(",") + "\n";

    const rows = dataset
      .map((w) => {
        const flagReasons = (w.evidence?.flagged_reasons || [])
          .map((r) => `${r.factor}: ${r.explanation.replace(/"/g, '""')}`)
          .join(" | ");

        return [
          `"${w.work_id}"`,
          `"${w.description.replace(/"/g, '""')}"`,
          `"${w.category}"`,
          `"${w.district}"`,
          `"${w.state}"`,
          `"${w.agency.replace(/"/g, '""')}"`,
          w.sanctioned_cost,
          w.actual_expenditure,
          `${w.physical_progress}%`,
          `${w.financial_progress}%`,
          `${w.financial_progress - w.physical_progress}%`,
          `"${w.expected_completion}"`,
          `"${w.predicted_completion || "N/A"}"`,
          w.risk_score,
          `"${w.risk_category}"`,
          `"${w.status}"`,
          `"${flagReasons}"`,
        ].join(",");
      })
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportFilteredCSV = () => {
    const dateStr = new Date().toISOString().slice(0, 10);
    generateCSV(sortedWorks, `MPLADS_Sentinel_Filtered_Works_${dateStr}.csv`);
  };

  const handleExportSelectedCSV = () => {
    const selectedDataset = works.filter((w) => selectedRowIds.includes(w.work_id));
    if (selectedDataset.length === 0) return;
    const dateStr = new Date().toISOString().slice(0, 10);
    generateCSV(selectedDataset, `MPLADS_Sentinel_Batch_Selected_${selectedDataset.length}_Works_${dateStr}.csv`);
  };

  const showToast = (msg: string) => {
    setBulkActionToast(msg);
    setTimeout(() => setBulkActionToast(null), 4000);
  };

  return (
    <div id="works-intelligence-table-view" className="space-y-4 animate-in fade-in duration-200 relative pb-16">
      {/* Toast Notification */}
      {bulkActionToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-700 shadow-2xl flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{bulkActionToast}</span>
          <button onClick={() => setBulkActionToast(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#112E51]/10 text-[#112E51] border border-[#112E51]/20 text-[11px] font-bold rounded font-mono uppercase">
              {isHindi ? "डेटाबेस एक्सप्लोरर एवं लेजर" : "Database Explorer & Ledger"}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {filteredWorks.length} {isHindi ? "संबंधित विकास कार्य सूचीबद्ध" : "matching works in scope"}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            {isHindi ? "संसदीय विकास कार्य इंटेलिजेंस लेजर" : "Works Intelligence Ledger"}
          </h1>
          <p className="text-xs text-slate-600">
            {isHindi ? "मशीन-गणना योग्य जोखिम स्कोर, व्यय मील के पत्थर और समयसीमा पूर्वानुमानों के साथ व्यापक ऑडिट मैट्रिक्स।" : "Comprehensive audit matrix with machine-calculated risk scores, expenditure milestones, and timeline forecasts."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportFilteredCSV}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            title="Export all currently filtered projects to CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{isHindi ? "डेटा एक्सपोर्ट (CSV)" : "Export Data (CSV)"}</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isHindi ? "कार्य आई-डी, नाम, जिला या एजेंसी खोजें..." : "Filter by Work ID, title, district or agency..."}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 hover:bg-white border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-500 transition-colors text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">{isHindi ? "श्रेणी:" : "Category:"}</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "ALL" ? (isHindi ? "सभी श्रेणियां" : "ALL") : translateText(c, lang)}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
              <button
                key={sev}
                onClick={() => {
                  setSelectedSeverity(sev);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  selectedSeverity === sev
                    ? "bg-slate-900 text-white font-semibold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {sev === "ALL" ? (isHindi ? "सभी" : "ALL") : translateText(sev, lang)}
              </button>
            ))}
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">{isHindi ? "स्थिति:" : "Status:"}</span>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">{isHindi ? "सभी स्थितियाँ" : "All Statuses"}</option>
              <option value="In Progress">{isHindi ? "प्रगति पर" : "In Progress"}</option>
              <option value="Sanctioned">{isHindi ? "स्वीकृत" : "Sanctioned"}</option>
              <option value="Delayed">{isHindi ? "विलंबित" : "Delayed"}</option>
              <option value="Completed">{isHindi ? "पूर्ण" : "Completed"}</option>
            </select>
          </div>
        </div>

        {/* Selection Banner if items are selected across filters */}
        {selectedRowIds.length > 0 && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700 bg-blue-50/50 p-2 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-blue-900 font-mono">
                {selectedRowIds.length} project(s) currently selected
              </span>
              {selectedRowIds.length < filteredWorks.length && (
                <button
                  onClick={handleSelectAllFiltered}
                  className="text-blue-700 hover:text-blue-900 underline font-medium cursor-pointer"
                >
                  Select all {filteredWorks.length} filtered works
                </button>
              )}
            </div>
            <button
              onClick={handleClearSelection}
              className="text-slate-500 hover:text-slate-800 text-xs font-medium cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        )}
      </div>

      {/* Main Data Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/90 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200 select-none">
              <tr>
                <th className="py-3 px-3 w-10 text-center">
                  <button
                    onClick={handleToggleSelectPage}
                    className="text-slate-500 hover:text-slate-800 cursor-pointer"
                    title={isCurrentPageAllSelected ? "Deselect Page" : "Select All on Page"}
                  >
                    {isCurrentPageAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th
                  onClick={() => handleSort("work_id")}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-200/60"
                >
                  <div className="flex items-center gap-1">
                    <span>{isHindi ? "कार्य आईडी" : "Work ID"}</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("description")}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 max-w-xs"
                >
                  <div className="flex items-center gap-1">
                    <span>{isHindi ? "कार्य विवरण एवं नाम" : "Work Name / Title"}</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-3">{isHindi ? "श्रेणी" : "Category"}</th>
                <th className="py-3 px-3">{isHindi ? "एजेंसी" : "Agency"}</th>
                <th
                  onClick={() => handleSort("sanctioned_cost")}
                  className="py-3 px-3 text-right cursor-pointer hover:bg-slate-200/60"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>{isHindi ? "स्वीकृत लागत" : "Sanctioned Cost"}</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center">{isHindi ? "प्रगति (भौतिक / वित्तीय)" : "Progress (Phy / Fin)"}</th>
                <th
                  onClick={() => handleSort("expected_completion")}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-200/60 text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>{isHindi ? "समयसीमा" : "Timeline"}</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("risk_score")}
                  className="py-3 px-3 text-center cursor-pointer hover:bg-slate-200/60"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>{isHindi ? "जोखिम स्तर" : "Risk Level"}</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right">{isHindi ? "कार्रवाई" : "Action"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedWorks.map((work) => {
                const isSelected = selectedRowIds.includes(work.work_id);
                return (
                  <tr
                    key={work.work_id}
                    onClick={() => onSelectWork(work)}
                    className={`hover:bg-slate-50/90 transition-colors cursor-pointer group ${
                      isSelected ? "bg-blue-50/70" : ""
                    }`}
                  >
                    <td
                      className="py-3 px-3 text-center"
                      onClick={(e) => handleToggleSelectRow(work.work_id, e)}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-blue-600 inline" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 inline" />
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 group-hover:text-blue-700 whitespace-nowrap">
                      {work.work_id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-700 line-clamp-1">
                        {work.description}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {translateText(work.district, lang)}, {translateText(work.state, lang)}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                      {translateText(work.category, lang)}
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-[140px] truncate">
                      {translateText(work.agency, lang)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                      {formatINR(work.sanctioned_cost)}
                    </td>
                    <td className="py-3 px-3 text-center font-mono whitespace-nowrap">
                      <span className="text-emerald-600 font-bold">{work.physical_progress}%</span>
                      <span className="text-slate-400"> / </span>
                      <span className="text-red-600 font-bold">{work.financial_progress}%</span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-[11px] whitespace-nowrap text-slate-600">
                      {work.expected_completion}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <RiskBadge severity={work.risk_category} score={work.risk_score} size="sm" language={lang} />
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectWork(work);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded border border-blue-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        {isHindi ? "विवरण देखें" : "Explain"} <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing <strong className="font-mono">{Math.min((currentPage - 1) * pageSize + 1, sortedWorks.length)}</strong> to{" "}
            <strong className="font-mono">{Math.min(currentPage * pageSize, sortedWorks.length)}</strong> of{" "}
            <strong className="font-mono">{sortedWorks.length}</strong> works
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 flex items-center gap-1 font-medium cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>

            <span className="font-mono text-slate-700 font-semibold px-2">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 flex items-center gap-1 font-medium cursor-pointer"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Batch Action Toolbar - Fully Responsive on Mobile & Desktop */}
      {selectedRowIds.length > 0 && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 text-white px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-slate-700 shadow-2xl flex flex-wrap items-center justify-between sm:justify-start gap-2 sm:gap-3 max-w-[94vw] sm:max-w-max backdrop-blur-md animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-1.5 sm:gap-2 pr-2 sm:pr-3 border-r border-slate-700">
            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-mono text-[11px] sm:text-xs font-bold">
              {selectedRowIds.length}
            </span>
            <span className="text-[11px] sm:text-xs font-medium text-slate-200 hidden sm:inline">Selected</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <button
              onClick={() => {
                showToast(`Batch Memo: Marked ${selectedRowIds.length} projects for priority human audit.`);
                handleClearSelection();
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs min-h-[36px]"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Review</span>
            </button>

            <button
              onClick={() => {
                showToast(`Inspection Order: Dispatched field verification notice for ${selectedRowIds.length} projects.`);
                handleClearSelection();
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white rounded-lg text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs min-h-[36px]"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Notice</span>
            </button>

            <button
              onClick={() => {
                showToast(`Disbursement Hold: Paused 2nd tranche release on ${selectedRowIds.length} flagged projects.`);
                handleClearSelection();
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white rounded-lg text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs min-h-[36px]"
            >
              <PauseCircle className="w-3.5 h-3.5" />
              <span>Hold</span>
            </button>

            <button
              onClick={handleExportSelectedCSV}
              className="px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-slate-200 border border-slate-600 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs min-h-[36px]"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Export (CSV)</span>
              <span className="sm:hidden">CSV</span>
            </button>
          </div>

          <button
            onClick={handleClearSelection}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-1 sm:ml-2 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="Clear Selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

