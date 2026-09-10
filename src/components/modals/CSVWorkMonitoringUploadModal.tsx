import React, { useState } from "react";
import {
  X,
  Upload,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Download,
  Play,
  FileText,
  HelpCircle,
  RefreshCw,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import {
  workMonitoringService,
  SAMPLE_WORK_ASSIGNMENT_CSV,
  SAMPLE_WORK_PROGRESS_MONTH_1_CSV,
  SAMPLE_WORK_PROGRESS_MONTH_2_CSV,
  SAMPLE_WORK_PROGRESS_MONTH_3_CSV,
} from "../../services/workMonitoringService";
import { CSVUploadResult, Language } from "../../types";

interface CSVWorkMonitoringUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  projectId?: string;
  language?: Language;
}

export const CSVWorkMonitoringUploadModal: React.FC<CSVWorkMonitoringUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  projectId = "WORK_UP_10293",
  language = "en",
}) => {
  const isHindi = language === "hi";
  const [activeTab, setActiveTab] = useState<"assignment" | "progress">("assignment");
  const [csvContent, setCsvContent] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState<CSVUploadResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || "";
      setCsvContent(text);
      setUploadResult(null);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || "";
      setCsvContent(text);
      setUploadResult(null);
    };
    reader.readAsText(file);
  };

  const handleProcessUpload = () => {
    if (!csvContent.trim()) return;
    setIsProcessing(true);

    setTimeout(() => {
      let result: CSVUploadResult;
      if (activeTab === "assignment") {
        result = workMonitoringService.parseWorkAssignmentCSV(csvContent, projectId);
      } else {
        result = workMonitoringService.parseWorkProgressCSV(csvContent, projectId);
      }

      setUploadResult(result);
      setIsProcessing(false);

      if (result.success && onSuccess) {
        onSuccess();
      }
    }, 400);
  };

  const downloadSampleCSV = (type: "assignment" | "progress") => {
    const sampleText =
      type === "assignment" ? SAMPLE_WORK_ASSIGNMENT_CSV : SAMPLE_WORK_PROGRESS_MONTH_3_CSV;
    const blob = new Blob([sampleText], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${type}_sample.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadDemoCSV = (month: 1 | 2 | 3) => {
    setActiveTab("progress");
    setFileName(`work_progress_month_${month}.csv`);
    let demoText = SAMPLE_WORK_PROGRESS_MONTH_1_CSV;
    if (month === 2) demoText = SAMPLE_WORK_PROGRESS_MONTH_2_CSV;
    if (month === 3) demoText = SAMPLE_WORK_PROGRESS_MONTH_3_CSV;
    setCsvContent(demoText);
    setUploadResult(null);
  };

  const copyToClipboard = () => {
    if (!csvContent) return;
    navigator.clipboard.writeText(csvContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Authoritative e-Government Header with High Contrast White Text */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-[#0A2740] via-[#0F2A6B] to-[#1B3A7A] text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-white/10 border border-white/20 rounded-xl shadow-inner backdrop-blur-xs">
              <FileSpreadsheet className="w-6 h-6 text-[#FF9933]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-5-[#FF9933]/20 border border-[#FF9933]/40 text-[#FF9933] text-[10px] font-extrabold rounded font-mono uppercase tracking-wider">
                  {isHindi ? "ई-गवर्नेंस डेटा लोड" : "e-Gov Ingestion"}
                </span>
                <span className="text-[11px] text-slate-300 font-mono">
                  ID: {projectId}
                </span>
              </div>
              <h2 className="text-xl font-black !text-white tracking-tight leading-tight mt-0.5" style={{ color: "#FFFFFF" }}>
                {isHindi ? "सीएसवी कार्य आवंटन एवं प्रगति अपलोड" : "CSV Work Ingestion & Monitoring Engine"}
              </h2>
              <p className="text-xs !text-slate-200 mt-0.5 font-medium" style={{ color: "#E2E8F0" }}>
                {isHindi
                  ? "नियोजित कार्य एवं भौतिक/वित्तीय प्रगति रिपोर्ट अपलोड करें"
                  : "Ingest planned work assignments & actual periodic progress reports"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-slate-200 hover:text-white border border-white/15"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Tricolor accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/90 px-6 pt-3 gap-3">
          <button
            onClick={() => {
              setActiveTab("assignment");
              setUploadResult(null);
            }}
            className={`pb-3 px-4 font-bold text-xs border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "assignment"
                ? "border-[#1B3A7A] text-[#1B3A7A] bg-white rounded-t-lg shadow-2xs"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 rounded-t-lg"
            }`}
          >
            <FileText className={`w-4 h-4 ${activeTab === "assignment" ? "text-[#1B3A7A]" : "text-slate-400"}`} />
            <span>{isHindi ? "1. कार्य आवंटन (Planned Work)" : "1. Work Assignment (Planned Work)"}</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("progress");
              setUploadResult(null);
            }}
            className={`pb-3 px-4 font-bold text-xs border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "progress"
                ? "border-[#1B3A7A] text-[#1B3A7A] bg-white rounded-t-lg shadow-2xs"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 rounded-t-lg"
            }`}
          >
            <FileSpreadsheet className={`w-4 h-4 ${activeTab === "progress" ? "text-[#1B3A7A]" : "text-slate-400"}`} />
            <span>{isHindi ? "2. कार्य प्रगति रिपोर्ट (Actual Progress)" : "2. Work Progress (Actual Progress)"}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-white">
          {/* Quick Demo Preset Toolbar */}
          <div className="p-4 bg-gradient-to-r from-blue-50/90 via-slate-50 to-amber-50/70 border border-blue-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
            <div>
              <span className="font-extrabold text-[#0A2740] flex items-center gap-1.5 text-xs">
                <Play className="w-3.5 h-3.5 text-[#1B3A7A] fill-[#1B3A7A]" />
                {isHindi ? "डेमो प्रगति रिपोर्ट सिम्युलेटर:" : "Demo Progression Simulator:"}
              </span>
              <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                {isHindi
                  ? "जोखिम प्रगति देखने के लिए माह 1 से 3 सीएसवी लोड करें (Risk 18 → 42 → 82)"
                  : "Load Month 1 to 3 CSVs to demonstrate risk escalation (Risk 18 → 42 → 82)"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => loadDemoCSV(1)}
                className="px-3 py-1.5 bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg font-bold text-[11px] transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Month 1 (Low)
              </button>
              <button
                onClick={() => loadDemoCSV(2)}
                className="px-3 py-1.5 bg-white hover:bg-amber-50 border border-amber-300 text-amber-900 rounded-lg font-bold text-[11px] transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Month 2 (Med)
              </button>
              <button
                onClick={() => loadDemoCSV(3)}
                className="px-3 py-1.5 bg-[#E31E24] hover:bg-[#c9181d] text-white rounded-lg font-bold text-[11px] transition-colors shadow-xs cursor-pointer flex items-center gap-1"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Month 3 (Critical)
              </button>
            </div>
          </div>

          {/* Upload Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-300 hover:border-[#1B3A7A] rounded-2xl p-6 text-center bg-slate-50/60 hover:bg-blue-50/30 transition-all cursor-pointer group shadow-inner"
          >
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileChange}
              className="hidden"
              id="csv-file-input"
            />
            <label htmlFor="csv-file-input" className="cursor-pointer block space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center mx-auto group-hover:scale-105 group-hover:border-[#1B3A7A] transition-all">
                <Upload className="w-6 h-6 text-slate-500 group-hover:text-[#1B3A7A] transition-colors" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-800">
                  {fileName ? (
                    <span className="text-[#1B3A7A] font-mono">Selected File: {fileName}</span>
                  ) : isHindi ? (
                    "यहाँ सीएसवी फ़ाइल खींचें और छोड़ें या ब्राउज़ करने के लिए क्लिक करें"
                  ) : (
                    "Drag & drop CSV file here or click to browse"
                  )}
                </p>
                <p className="text-[11px] text-slate-500 mt-1 font-mono leading-relaxed max-w-xl mx-auto">
                  {activeTab === "assignment"
                    ? "Required Columns: project_id, work_id, work_description, assigned_date, planned_start_date, planned_end_date, assigned_quantity, unit, assigned_amount"
                    : "Required Columns: project_id, work_id, report_date, completed_quantity, unit, reported_progress_percent, reported_amount_spent"}
                </p>
              </div>
            </label>
          </div>

          {/* Helper & Sample Download Link */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2 px-1">
            <span className="flex items-center gap-1.5 font-medium">
              <HelpCircle className="w-4 h-4 text-[#1B3A7A]" />
              {isHindi
                ? "स्वचालित रूप से डुप्लिकेट प्रविष्टियों को अद्यतन करता है (Idempotent Upload)"
                : "Idempotent upload updates existing records without duplication"}
            </span>
            <button
              onClick={() => downloadSampleCSV(activeTab)}
              className="text-[#1B3A7A] hover:text-[#0F2A6B] font-bold flex items-center gap-1.5 cursor-pointer hover:underline self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5 text-[#FF9933]" />
              {isHindi ? `नमूना ${activeTab} CSV डाउनलोड करें` : `Download Sample ${activeTab} CSV`}
            </button>
          </div>

          {/* Raw CSV Text Area Code Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                {isHindi ? "सीएसवी सामग्री पूर्वावलोकन / टेक्स्ट दर्ज करें:" : "CSV Raw Payload Preview:"}
              </label>
              {csvContent && (
                <button
                  onClick={copyToClipboard}
                  className="text-[11px] font-bold text-slate-600 hover:text-[#1B3A7A] flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copied!" : "Copy Payload"}</span>
                </button>
              )}
            </div>
            <textarea
              value={csvContent}
              onChange={(e) => {
                setCsvContent(e.target.value);
                setUploadResult(null);
              }}
              placeholder={
                activeTab === "assignment" ? SAMPLE_WORK_ASSIGNMENT_CSV : SAMPLE_WORK_PROGRESS_MONTH_3_CSV
              }
              rows={5}
              className="w-full font-mono text-[11.5px] p-3.5 bg-[#0B132B] text-[#00FF9D] rounded-xl border border-slate-700 outline-none focus:border-[#1B3A7A] focus:ring-2 focus:ring-blue-400/20 leading-relaxed shadow-inner"
            />
          </div>

          {/* Validation Result Box */}
          {uploadResult && (
            <div
              className={`p-4 rounded-xl border text-xs space-y-3 animate-in fade-in duration-150 shadow-xs ${
                uploadResult.success
                  ? "bg-emerald-50/90 border-emerald-300 text-emerald-950"
                  : "bg-red-50/90 border-red-300 text-red-950"
              }`}
            >
              <div className="flex items-center gap-2 font-extrabold text-sm">
                {uploadResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                )}
                <span>{uploadResult.message}</span>
              </div>

              {/* Validation Errors Table */}
              {uploadResult.errors.length > 0 && (
                <div className="mt-2 overflow-x-auto border border-red-200 rounded-lg bg-white shadow-2xs">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead className="bg-red-100/80 text-red-900 font-extrabold border-b border-red-200">
                      <tr>
                        <th className="px-3 py-1.5">Row</th>
                        <th className="px-3 py-1.5">Field</th>
                        <th className="px-3 py-1.5">Validation Error Detail</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-red-100 text-red-800">
                      {uploadResult.errors.map((err, i) => (
                        <tr key={i} className="hover:bg-red-50/50">
                          <td className="px-3 py-1.5 font-bold">{err.row}</td>
                          <td className="px-3 py-1.5 text-red-900 font-semibold">{err.field}</td>
                          <td className="px-3 py-1.5">{err.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              setCsvContent("");
              setFileName("");
              setUploadResult(null);
            }}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            {isHindi ? "रीसेट करें" : "Reset Input"}
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
            >
              {isHindi ? "रद्द करें" : "Cancel"}
            </button>
            <button
              onClick={handleProcessUpload}
              disabled={isProcessing || !csvContent.trim()}
              className="px-5 py-2.5 text-xs font-extrabold text-white bg-[#1B3A7A] hover:bg-[#0F2A6B] rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {isProcessing && <RefreshCw className="w-4 h-4 animate-spin text-white" />}
              {isHindi ? "प्रोसेस और मॉनitor" : "Validate & Ingest CSV"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

