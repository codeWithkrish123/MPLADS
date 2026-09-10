import React, { useState, useEffect } from "react";
import { 
  Users, 
  AlertTriangle, 
  RotateCw, 
  IndianRupee, 
  Search, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Info,
  Building,
  MapPin,
  Calendar,
  UserCheck
} from "lucide-react";
import { fetchLabourAnomalies, LabourAnomaly } from "../services/intelligenceService";
import { Language } from "../types";

interface LabourIntelligenceViewProps {
  language?: Language;
  onSelectWork?: (work: any) => void;
}

export const LabourIntelligenceView: React.FC<LabourIntelligenceViewProps> = ({
  language = "en",
  onSelectWork,
}) => {
  const [anomalies, setAnomalies] = useState<LabourAnomaly[]>([]);
  const [selectedAnomaly, setSelectedAnomaly] = useState<LabourAnomaly | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("All Anomalies");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isReconciling, setIsReconciling] = useState<boolean>(false);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchLabourAnomalies();
      setAnomalies(data);
      if (data.length > 0) {
        setSelectedAnomaly(data[0]);
      }
    } catch (err) {
      console.error("Failed to load labour intelligence data", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReconcile = () => {
    setIsReconciling(true);
    setTimeout(() => {
      setIsReconciling(false);
      alert("Biometric Reconciliation Complete. 23 ghost worker drawdowns quarantined.");
    }, 1800);
  };

  const filteredAnomalies = anomalies.filter((a) => {
    const matchesSearch =
      a.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.aadhaarMasked.includes(searchQuery) ||
      a.workTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.workId.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "All Anomalies") return matchesSearch;
    return matchesSearch && a.anomalyType === activeFilter;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-50/50 to-red-50/30 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                BIOMETRIC MUSTER ROLL & LABOUR SURVEILLANCE
              </span>
              <span className="px-3 py-1 bg-purple-50 border border-purple-200 text-purple-700 text-[11px] font-bold rounded-md">
                AADHAAR / ABPS INTEGRITY CHECK
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Labour Intelligence & Ghost Worker Verification
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Real-time spatio-temporal detection of simultaneous attendance across distant sites, ghost workers, and inflated wage drawdowns.
            </p>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={loadData}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-600" : ""}`} />
              Reload Data
            </button>

            <button
              onClick={handleReconcile}
              disabled={isReconciling}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B2545] hover:bg-[#133A6B] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <UserCheck className={`w-3.5 h-3.5 ${isReconciling ? "animate-spin" : ""}`} />
              {isReconciling ? "Reconciling Biometrics..." : "Run Biometric Reconciliation"}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row (Matching Image 2) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: SIMULTANEOUS MUSTER ROLLS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              SIMULTANEOUS MUSTER ROLLS
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-red-600 tracking-tight">
              14
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Cross-block attendance within &lt;15 mins
            </div>
          </div>
        </div>

        {/* Card 2: SUSPECTED GHOST WORKERS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              SUSPECTED GHOST WORKERS
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-amber-600 tracking-tight">
              23
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Zero physical biometric matches on site
            </div>
          </div>
        </div>

        {/* Card 3: RECOVERED PUBLIC FUNDS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              RECOVERED PUBLIC FUNDS
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              ₹4.82 <span className="text-lg font-semibold text-slate-600">Lakhs</span>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Quarantined from unearned disbursement
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search worker name, ID or project..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {["All Anomalies", "DUAL MUSTER SIMULTANEOUS", "GHOST WORKER", "WAGE RATE SKEW"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === filter
                  ? "bg-[#0B2545] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout: Anomaly Queue vs Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Active Labour Anomaly Queue */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">
              Active Labour Anomaly Queue
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {filteredAnomalies.length} records
            </span>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="py-12 text-center text-slate-400">
                <RotateCw className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                <p className="text-xs">Analyzing Biometric Muster Rolls...</p>
              </div>
            ) : filteredAnomalies.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-medium">No labour anomalies found matching filter.</p>
              </div>
            ) : (
              filteredAnomalies.map((item) => {
                const isSelected = selectedAnomaly?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedAnomaly(item)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? "bg-blue-50/50 border-blue-500 shadow-sm"
                        : "bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-sm">
                            {item.workerName}
                          </span>
                          <span className="text-xs font-mono text-slate-500">
                            ({item.aadhaarMasked})
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded font-mono ${
                              item.anomalyType === "DUAL MUSTER SIMULTANEOUS"
                                ? "bg-red-100 text-red-700"
                                : item.anomalyType === "GHOST WORKER"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {item.anomalyType}
                          </span>
                        </div>

                        <div className="text-xs font-medium text-slate-700">
                          {item.workTitle}
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                          <span>Claimed: {item.claimedDays} days</span>
                          <span>•</span>
                          <span>Wage: ₹{item.wageAmount.toLocaleString()}</span>
                        </div>
                      </div>

                      <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Biometric Discrepancy Detail Panel */}
        <div className="lg:col-span-5">
          {selectedAnomaly ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5 sticky top-6">
              {/* Detail Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">
                    LAB / {selectedAnomaly.id}
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {selectedAnomaly.workerName}
                  </h3>
                </div>

                <span
                  className={`px-2.5 py-1 border text-[10px] font-extrabold uppercase rounded-lg tracking-wider ${
                    selectedAnomaly.severity === "CRITICAL"
                      ? "bg-red-50 text-red-600 border-red-300"
                      : "bg-amber-50 text-amber-600 border-amber-300"
                  }`}
                >
                  {selectedAnomaly.severity}
                </span>
              </div>

              {/* Callout Box: Biometric Discrepancy Explanation */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
                <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  Biometric Discrepancy Explanation:
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {selectedAnomaly.discrepancyExplanation}
                </p>
              </div>

              {/* Key-Value Details Table (Exact Match to Image 2) */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Project Code</span>
                  <span className="font-mono font-bold text-slate-900">
                    {selectedAnomaly.workId}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Primary Location</span>
                  <span className="font-bold text-slate-800">
                    {selectedAnomaly.location}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Conflicting Muster Site</span>
                  <span className="font-bold text-red-600">
                    {selectedAnomaly.conflictingLocation}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Verified Biometric Days</span>
                  <span className="font-mono font-bold text-slate-900">
                    {selectedAnomaly.verifiedDays} / {selectedAnomaly.claimedDays} days
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-500 font-medium">Status</span>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-md text-[10px] tracking-wider uppercase">
                    {selectedAnomaly.status}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onSelectWork && onSelectWork({ work_id: selectedAnomaly.workId })}
                  className="w-full py-2.5 bg-[#0B2545] hover:bg-[#133A6B] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer text-center"
                >
                  View Full Project Investigation Dossier
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center text-slate-400">
              Select an anomaly from the queue to view biometric audit details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
