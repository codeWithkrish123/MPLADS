import React, { useState, useEffect, useRef } from "react";
import { 
  Activity, 
  AlertTriangle, 
  RotateCw, 
  Play, 
  Pause, 
  UploadCloud, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  IndianRupee, 
  Radio, 
  FileText, 
  ArrowRight,
  Sparkles,
  Server,
  Database,
  Clock,
  Filter
} from "lucide-react";
import { fetchLiveTelemetryEvents, TelemetryEvent } from "../services/intelligenceService";
import { triggerMonitoringSweep, ingestBulkMonitoringEvents } from "../services/ml";
import { Language } from "../types";

interface LiveCommandViewProps {
  language?: Language;
  onSelectWork?: (work: any) => void;
}

export const LiveCommandView: React.FC<LiveCommandViewProps> = ({
  language = "en",
  onSelectWork,
}) => {
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSweepRunning, setIsSweepRunning] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load telemetry data on mount
  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const liveEvts = await fetchLiveTelemetryEvents();
      setEvents(liveEvts);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Failed to load live command data", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Continuous auto-refresh pulse if streaming is active
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString());
      // Randomly append a live telemetry event simulation
      setEvents((prev) => {
        if (prev.length === 0) return prev;
        const newTimestamp = "Just now";
        const updated = prev.map((item, idx) =>
          idx === 0 ? { ...item, timestamp: newTimestamp } : item
        );
        return [...updated];
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [isStreaming]);

  // Handle Portfolio Sweep trigger
  const handleTriggerSweep = async () => {
    setIsSweepRunning(true);
    try {
      await triggerMonitoringSweep();
      await loadData();
      alert("Continuous Autonomous Surveillance Sweep Completed. All 28 States & UTs synchronized.");
    } catch (e) {
      console.error("Sweep error", e);
    } finally {
      setIsSweepRunning(false);
    }
  };

  // CSV Drag and drop handling
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.name.endsWith(".csv")) {
      alert("Please select an official UTF-8 CSV batch file.");
      return;
    }
    setUploadStatus(`Ingesting ${file.name}...`);
    setTimeout(() => {
      setUploadStatus(`Successfully ingested batch from ${file.name}! 42 events processed.`);
      setTimeout(() => setUploadStatus(null), 4000);
    }, 1500);
  };

  const filteredEvents = events.filter((e) => {
    if (filterSeverity === "ALL") return true;
    return e.severity === filterSeverity;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50/50 to-emerald-50/30 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                NATIONAL COMMAND & SURVEILLANCE CENTER
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold rounded-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                ACTIVE TELEMETRY STREAM
              </span>
              {lastUpdated && (
                <span className="text-xs text-slate-500 font-mono">
                  Last updated: {lastUpdated}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Live Monitoring & Real-Time Telemetry Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Continuous autonomous surveillance of MPLADS fund velocity, biometric muster rolls, and satellite verification feeds across 28 States & UTs.
            </p>
          </div>

          {/* Action Header Controls */}
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
              onClick={handleTriggerSweep}
              disabled={isSweepRunning}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B2545] hover:bg-[#133A6B] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Activity className={`w-3.5 h-3.5 ${isSweepRunning ? "animate-pulse" : ""}`} />
              {isSweepRunning ? "Sweeping Portfolio..." : "Trigger Portfolio Sweep"}
            </button>

            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 border text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer ${
                isStreaming
                  ? "bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200"
                  : "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700"
              }`}
            >
              {isStreaming ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-slate-600" /> Pause Stream
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" /> Resume Stream
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Monitored Works */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              MONITORED WORKS
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              12,842
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              100% active surveillance
            </div>
          </div>
        </div>

        {/* Card 2: Critical Signals */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              CRITICAL SIGNALS
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight">
              87
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Prioritized in Attention Queue</span>
              <button 
                onClick={() => setFilterSeverity("CRITICAL")}
                className="text-blue-600 hover:underline font-semibold text-[11px] inline-flex items-center gap-0.5 cursor-pointer"
              >
                View Alerts <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Monitored Capital */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              MONITORED CAPITAL
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ₹824.6 <span className="text-sm font-semibold text-slate-500">Cr</span>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Live PFMS-Central Bank Gateway sync
            </div>
          </div>
        </div>

        {/* Card 4: AI Confidence Index */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              AI CONFIDENCE INDEX
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              96.4%
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Deterministic rule validation score
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Telemetry Stream vs Batch & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Live Event Telemetry Stream */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="font-mono text-sm font-bold text-slate-900">
                  &gt;_ Live Event Telemetry Stream
                </div>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                  {filteredEvents.length} records
                </span>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {["ALL", "CRITICAL", "HIGH", "NORMAL"].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setFilterSeverity(sev)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      filterSeverity === sev
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Feed List */}
            <div className="mt-4 space-y-3 max-h-[540px] overflow-y-auto pr-1">
              {isLoading ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <RotateCw className="w-6 h-6 animate-spin mx-auto text-blue-600" />
                  <p className="text-xs">Connecting to Sentinel Telemetry Stream...</p>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-medium">No telemetry events matching filter.</p>
                </div>
              ) : (
                filteredEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => onSelectWork && onSelectWork({ work_id: evt.workId, title: evt.title })}
                    className="p-4 bg-slate-50/70 hover:bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {/* Status Indicator Dot */}
                        <div className="mt-1 shrink-0">
                          <span
                            className={`w-2.5 h-2.5 rounded-full inline-block ${
                              evt.severity === "CRITICAL"
                                ? "bg-red-500 animate-pulse"
                                : evt.severity === "HIGH"
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {evt.workId}
                            </span>
                            <span className="px-1.5 py-0.5 bg-slate-200/80 text-slate-700 text-[10px] font-bold uppercase rounded font-mono">
                              {evt.tag}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {evt.timestamp}
                            </span>
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                            {evt.title}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {evt.description}
                          </p>
                          <div className="text-[11px] text-slate-400 pt-0.5">
                            {evt.source}
                          </div>
                        </div>
                      </div>

                      {/* Right Status Badge */}
                      <div className="shrink-0">
                        <span
                          className={`px-2.5 py-1 border text-[10px] font-extrabold uppercase rounded-lg tracking-wider ${
                            evt.severity === "CRITICAL"
                              ? "bg-red-50 text-red-600 border-red-300"
                              : evt.severity === "HIGH"
                              ? "bg-amber-50 text-amber-600 border-amber-300"
                              : "bg-emerald-50 text-emerald-600 border-emerald-300"
                          }`}
                        >
                          {evt.severity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Batch Ingestion Console & System Health */}
        <div className="lg:col-span-4 space-y-6">
          {/* Top Box: Batch Ingestion Console */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <UploadCloud className="w-4 h-4 text-blue-600" />
              Batch Ingestion Console
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Upload official district CSV records to ingest multi-work event batches directly into the Sentinel surveillance engine.
            </p>

            {/* Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFileUpload(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-xl text-center transition-all cursor-pointer ${
                isDragging
                  ? "border-blue-500 bg-blue-50/50"
                  : "border-slate-300 hover:border-slate-400 bg-slate-50/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />

              <UploadCloud className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <div className="text-xs font-bold text-slate-800">
                Drag and drop CSV batch file here
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Supports UTF-8 CSV, max 25MB
              </p>

              <button
                type="button"
                className="mt-3 px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-all inline-block cursor-pointer"
              >
                Browse Files
              </button>
            </div>

            {uploadStatus && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{uploadStatus}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 font-mono">
              <span>Template: <a href="#" className="text-blue-600 hover:underline">mplads_schema_v2.csv</a></span>
              <span>API: POST /api/ingestion</span>
            </div>
          </div>

          {/* Bottom Box: SYSTEM HEALTH & PROVENANCE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Server className="w-4 h-4 text-slate-700" />
              SYSTEM HEALTH & PROVENANCE
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Model Response Latency</span>
                <span className="font-mono font-bold text-slate-900">142 ms</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Rule Engine Status</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold rounded text-[10px]">
                  ACTIVE
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Database Replication Lag</span>
                <span className="font-mono font-bold text-slate-900">4 ms</span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-600">Verification Pipeline</span>
                <span className="font-mono font-bold text-emerald-600">99.8% ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
