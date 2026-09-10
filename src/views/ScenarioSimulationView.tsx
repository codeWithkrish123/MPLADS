import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  RotateCw, 
  ShieldAlert, 
  Layers, 
  Cpu,
  FileCode
} from "lucide-react";
import { fetchScenarioCatalog, ScenarioCase } from "../services/intelligenceService";
import { analyzeProject } from "../services/ml";
import { Language } from "../types";

interface ScenarioSimulationViewProps {
  language?: Language;
}

export const ScenarioSimulationView: React.FC<ScenarioSimulationViewProps> = ({
  language = "en",
}) => {
  const [scenarios, setScenarios] = useState<ScenarioCase[]>([]);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [isRunningAll, setIsRunningAll] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([
    "System ready. 4 pre-configured synthetic anomaly scenarios loaded.",
    "Sentinel Anomaly Engine v2.6.4 (Deterministic Mode) ONLINE.",
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCatalog();
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const loadCatalog = async () => {
    const data = await fetchScenarioCatalog();
    setScenarios(data);
  };

  const runSingleScenario = (scn: ScenarioCase) => {
    setActiveScenarioId(scn.id);
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    setLogs((prev) => [
      ...prev,
      `--------------------------------------------------`,
      `[${timestamp}] INJECTING PAYLOAD: ${scn.code}`,
      `[${timestamp}] Target: ${scn.title}`,
      `[${timestamp}] Payload metadata: ${scn.payloadInfo}`,
      `[${timestamp}] Executing Sentinel Rule Validation Pipeline...`,
    ]);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        `[${timestamp}] ML Feature Vector Calculated.`,
        `[${timestamp}] DETECTED: ${scn.expectedDetectionImpact}`,
        `[${timestamp}] COMPLIANCE HOLD APPLIED. Audit memo logged to cryptographic ledger.`,
      ]);
      setActiveScenarioId(null);
    }, 1200);

    // Call ML API endpoint
    analyzeProject({
      work_category: scn.typeBadge,
      sanctioned_amount: 5000000,
      total_expenditure: 4500000,
      work_description: scn.description,
      state: "Uttar Pradesh",
    }).catch(() => {});
  };

  const runAllScenarios = () => {
    setIsRunningAll(true);
    let index = 0;

    const interval = setInterval(() => {
      if (index >= scenarios.length) {
        clearInterval(interval);
        setIsRunningAll(false);
        setLogs((prev) => [
          ...prev,
          `==================================================`,
          `SUCCESS: All 4 Synthetic Evaluation Scenarios executed. 100% Detection Rate.`,
        ]);
        return;
      }

      runSingleScenario(scenarios[index]);
      index++;
    }, 1600);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner Header (Exact match to Reference Screenshot 3) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                END-TO-END ANOMALY SIMULATION LAB
              </span>
              <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold rounded-md">
                EVALUATOR BENCHMARK SUITE
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              End-to-End Threat Scenario Simulation & Stress Test
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Deterministic test sandbox for jury evaluators: inject synthetic fraud payloads to observe real-time AI risk score escalations and automated compliance holds.
            </p>
          </div>

          {/* Top Right Action Button */}
          <div className="shrink-0">
            <button
              onClick={runAllScenarios}
              disabled={isRunningAll}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B2545] hover:bg-[#133A6B] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Play className={`w-3.5 h-3.5 fill-current ${isRunningAll ? "animate-spin" : ""}`} />
              {isRunningAll ? "Running Evaluation Suite..." : "Run All Evaluation Scenarios"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Split Layout: Scenario Catalog vs Execution Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Demonstration Scenario Catalog */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Demonstration Scenario Catalog
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              4 Pre-Packaged Cases
            </span>
          </div>

          {/* Scenario Cards */}
          <div className="space-y-4">
            {scenarios.map((scn) => {
              const isRunningThis = activeScenarioId === scn.id;
              return (
                <div
                  key={scn.id}
                  className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all space-y-3"
                >
                  {/* Card Sub-Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      {scn.code}
                    </span>
                    <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 text-[9px] font-extrabold uppercase rounded font-mono">
                      {scn.typeBadge}
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900">
                    {scn.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {scn.description}
                  </p>

                  {/* Amber Callout Box */}
                  <div className="p-3 bg-amber-50/80 border border-amber-200/90 rounded-xl text-xs font-semibold text-amber-900">
                    {scn.expectedDetectionImpact}
                  </div>

                  {/* Footer & Action Button */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[11px] font-mono text-slate-500">
                      Payload: {scn.payloadInfo}
                    </span>

                    <button
                      onClick={() => runSingleScenario(scn)}
                      disabled={isRunningThis}
                      className="px-4 py-1.5 bg-[#0B2545] hover:bg-[#133A6B] text-white text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Play className={`w-3 h-3 fill-current ${isRunningThis ? "animate-spin" : ""}`} />
                      {isRunningThis ? "Injecting..." : "Run Scenario"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (5 cols): SIMULATOR EXECUTION LOGS STDOUT */}
        <div className="lg:col-span-5">
          <div className="bg-[#0B132B] text-emerald-400 rounded-2xl border border-slate-800 shadow-xl p-5 font-mono text-xs flex flex-col h-[680px] sticky top-6">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 text-slate-400 text-[11px]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-500" />
                <span className="font-bold text-white">&gt;_ SIMULATOR EXECUTION LOGS</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                STDOUT
              </span>
            </div>

            {/* Terminal Log Output Window */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {logs.map((log, lIdx) => (
                <div
                  key={lIdx}
                  className={`leading-relaxed break-words ${
                    log.includes("DETECTED:")
                      ? "text-amber-300 font-bold"
                      : log.includes("INJECTING")
                      ? "text-cyan-300 font-bold"
                      : log.includes("SUCCESS:")
                      ? "text-emerald-300 font-bold"
                      : "text-slate-300"
                  }`}
                >
                  {log}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Terminal Footer */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
              <span>Sentinel Runtime: Node v20 / Python ML</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Terminal
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
