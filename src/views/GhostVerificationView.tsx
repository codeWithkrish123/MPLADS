import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  AlertTriangle, 
  RotateCw, 
  FileSearch, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  ArrowRight, 
  Image as ImageIcon, 
  FileText, 
  Users, 
  MapPin, 
  Activity,
  Layers
} from "lucide-react";
import { fetchGhostVerificationQueue, GhostVerificationItem } from "../services/intelligenceService";
import { Language } from "../types";

interface GhostVerificationViewProps {
  language?: Language;
  onSelectWork?: (work: any) => void;
}

export const GhostVerificationView: React.FC<GhostVerificationViewProps> = ({
  language = "en",
  onSelectWork,
}) => {
  const [items, setItems] = useState<GhostVerificationItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<GhostVerificationItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const queue = await fetchGhostVerificationQueue();
      setItems(queue);
    } catch (err) {
      console.error("Failed to load ghost verification data", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenDetail = (item: GhostVerificationItem) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const pipelineStages = [
    { id: "1", title: "WORK REPORTED", subtitle: "Sanction Data" },
    { id: "2", title: "FIELD EVIDENCE", subtitle: "Geotag Upload" },
    { id: "3", title: "IMAGE INTELLIGENCE", subtitle: "CV Feature Match" },
    { id: "4", title: "DOCUMENT / OCR", subtitle: "MB Voucher Scan" },
    { id: "5", title: "LABOUR INTELLIGENCE", subtitle: "Aadhaar ABPS Sync" },
    { id: "6", title: "PROGRESS ANALYSIS", subtitle: "SAR Satellite Delta" },
    { id: "7", title: "LOCATION VALIDATION", subtitle: "GPS vs GIS Fence" },
    { id: "8", title: "ML RISK ANALYSIS", subtitle: "Ensemble Scoring" },
    { id: "9", title: "VERIFICATION RESULT", subtitle: "Audit Decision" },
  ];

  const filteredItems = items.filter((item) => {
    if (filterStatus === "ALL") return true;
    return item.verificationStatus === filterStatus;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                AI GHOST WORK VERIFICATION PIPELINE
              </span>
              <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold rounded-md">
                MULTI-STAGE SENSOR FUSION
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Ghost Verification & Physical Audit Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              AI-assisted verification of MPLADS work existence, reported progress, field evidence, document vouchers, and ghost asset detection.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={loadData}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-600" : ""}`} />
              Reload Pipeline
            </button>
          </div>
        </div>

        {/* Visual Verification Pipeline Flow */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            AUTOMATED MULTI-STAGE VERIFICATION PIPELINE
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-9 gap-1.5">
            {pipelineStages.map((stage, idx) => (
              <div
                key={stage.id}
                className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center flex flex-col justify-between hover:bg-blue-50/50 hover:border-blue-300 transition-all"
              >
                <div className="text-[9px] font-bold text-blue-600 font-mono">
                  STAGE 0{stage.id}
                </div>
                <div className="text-[10px] font-extrabold text-slate-900 leading-tight mt-1">
                  {stage.title}
                </div>
                <div className="text-[9px] text-slate-400 mt-1 truncate">
                  {stage.subtitle}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            WORKS CHECKED
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">12,842</div>
          <div className="text-[11px] text-slate-500 mt-1">Total in surveillance</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            VERIFIED
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">11,940</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">● 93% match rate</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            SUSPICIOUS
          </span>
          <div className="text-2xl font-black text-amber-600 mt-1">645</div>
          <div className="text-[11px] text-amber-600 mt-1">Evidence variance</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            HIGH RISK
          </span>
          <div className="text-2xl font-black text-red-600 mt-1">87</div>
          <div className="text-[11px] text-red-600 mt-1">Escalated to DM</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            PENDING VERIFICATION
          </span>
          <div className="text-2xl font-black text-slate-700 mt-1">170</div>
          <div className="text-[11px] text-slate-500 mt-1">Queue in progress</div>
        </div>
      </div>

      {/* Verification Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Ghost Verification Queue
            </h3>
            <p className="text-xs text-slate-500">
              Priority works undergoing multi-spectral image, document OCR, and satellite spatial validation.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {["ALL", "SUSPECTED GHOST", "HIGH RISK", "VERIFIED"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  filterStatus === st
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Work ID & Title</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Reported vs Observed</th>
                <th className="py-3 px-4">Evidence Status</th>
                <th className="py-3 px-4">ML Risk</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-slate-900">{item.workId}</div>
                    <div className="text-slate-600 max-w-xs truncate">{item.workTitle}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {item.district}, {item.state}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{item.reportedProgress}% reported</span>
                      <span className="text-slate-400">vs</span>
                      <span className={`font-bold ${item.reportedProgress - item.observedProgress > 20 ? "text-red-600" : "text-emerald-600"}`}>
                        {item.observedProgress}% ML observed
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        item.evidenceStatus === "MISMATCH"
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {item.evidenceStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold">
                    <span className={item.riskLevel === "CRITICAL" ? "text-red-600" : "text-emerald-600"}>
                      {item.riskLevel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-lg border ${
                        item.verificationStatus === "SUSPECTED GHOST"
                          ? "bg-red-50 text-red-600 border-red-300"
                          : item.verificationStatus === "HIGH RISK"
                          ? "bg-amber-50 text-amber-600 border-amber-300"
                          : "bg-emerald-50 text-emerald-600 border-emerald-300"
                      }`}
                    >
                      {item.verificationStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenDetail(item)}
                      className="px-3 py-1.5 bg-[#0B2545] hover:bg-[#133A6B] text-white text-xs font-bold rounded-lg transition-all cursor-pointer inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Detail Modal / Panel */}
      {isDrawerOpen && selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600">{selectedItem.workId}</span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-extrabold rounded uppercase">
                    {selectedItem.verificationStatus}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                  {selectedItem.workTitle}
                </h2>
                <p className="text-xs text-slate-500">
                  {selectedItem.district}, {selectedItem.state} • Last Checked: {selectedItem.lastChecked}
                </p>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Grid of Evidence Intelligence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* IMAGE INTELLIGENCE */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  IMAGE INTELLIGENCE & COMPUTER VISION
                </div>
                {selectedItem.fieldImage && (
                  <img
                    src={selectedItem.fieldImage}
                    alt="Field evidence"
                    className="w-full h-40 object-cover rounded-lg border border-slate-200"
                  />
                )}
                <div className="text-xs text-slate-700 space-y-1">
                  <div className="font-semibold text-slate-900">Detected Image Anomaly:</div>
                  <p className="text-slate-600 leading-relaxed">{selectedItem.imageAnomaly}</p>
                </div>
              </div>

              {/* DOCUMENT / OCR */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <FileText className="w-4 h-4 text-purple-600" />
                  DOCUMENT OCR & VOUCHER EXTRACTION
                </div>
                {selectedItem.documentOcrData && (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Document Type</span>
                      <span className="font-bold">{selectedItem.documentOcrData.documentType}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Extracted Voucher No.</span>
                      <span className="font-mono font-bold">{selectedItem.documentOcrData.extractedVoucherNo}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">MB Measurement Match</span>
                      <span className={selectedItem.documentOcrData.mbMeasurementMatch ? "text-emerald-600 font-bold" : "text-red-600 font-bold"}>
                        {selectedItem.documentOcrData.mbMeasurementMatch ? "VERIFIED" : "MISMATCH DETECTED"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Voucher Disbursed Amount</span>
                      <span className="font-mono font-bold text-slate-900">₹{selectedItem.documentOcrData.extractedAmount.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* LABOUR INTELLIGENCE */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <Users className="w-4 h-4 text-amber-600" />
                  LABOUR & MUSTER ROLL FUSION
                </div>
                {selectedItem.labourAnalysis && (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Expected Daily Labour</span>
                      <span className="font-bold">{selectedItem.labourAnalysis.expectedLabour} workers</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Observed Biometric On-Site</span>
                      <span className="font-bold text-amber-600">{selectedItem.labourAnalysis.observedLabour} workers</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Labour Anomaly State</span>
                      <span className="font-bold text-red-600">
                        {selectedItem.labourAnalysis.anomalyDetected ? "GHOST WORKER SKEW" : "NORMAL"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* LOCATION VALIDATION */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  GIS GEOTAG & LOCATION VALIDATION
                </div>
                {selectedItem.locationValidation && (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Reported Sanction Coords</span>
                      <span className="font-mono font-bold">{selectedItem.locationValidation.reportedCoords}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Observed Geotag Coords</span>
                      <span className="font-mono font-bold">{selectedItem.locationValidation.observedCoords}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Distance Mismatch</span>
                      <span className="font-mono font-bold text-red-600">
                        {selectedItem.locationValidation.distanceMismatchKm} km mismatch
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* FINAL ML ASSESSMENT */}
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">FINAL ML ASSESSMENT & ENSEMBLE DECISION</span>
                <span className="text-xs font-bold text-emerald-400">
                  Confidence Score: {selectedItem.confidenceScore}%
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Multi-spectral satellite analysis confirms severe physical progress discrepancy. MB measurement voucher does not match satellite earthwork reflectance. Escalated for immediate statutory audit.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Escalation Memo generated for ${selectedItem.workId}. Logged to audit ledger.`);
                  setIsDrawerOpen(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm"
              >
                Escalate Investigation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
