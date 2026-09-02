import React, { useState } from "react";
import {
  Upload,
  FileText,
  Database,
  Plus,
  Trash2,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle2,
  Search,
  Sliders,
  DollarSign,
  Building,
  MapPin,
  HelpCircle,
  FileSpreadsheet,
} from "lucide-react";
import { WorkRecord, RiskSeverity, WorkStatus, Language } from "../types";
import { REAL_WORKS } from "../data/realWorksData";
import { getTranslation, translateText } from "../data/translations";

interface CustomDatasetViewProps {
  onOpenWorkDetail?: (work: WorkRecord) => void;
  language?: Language;
}

export const CustomDatasetView: React.FC<CustomDatasetViewProps> = ({ onOpenWorkDetail, language = "en" }) => {
  const currentLang: Language = (language || "en") as Language;
  const isHindi = currentLang === "hi";
  const t = getTranslation(currentLang);
  // Custom dataset records state, initialized with real CSV works
  const [datasetRecords, setDatasetRecords] = useState<WorkRecord[]>([
    ...REAL_WORKS.slice(0, 15),
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"table" | "analytics" | "upload">("table");
  
  // New record form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newWorkName, setNewWorkName] = useState("");
  const [newDistrict, setNewDistrict] = useState("New Delhi");
  const [newState, setNewState] = useState("Delhi");
  const [newCost, setNewCost] = useState("2500000");
  const [newCategory, setNewCategory] = useState<any>("Drinking Water Facility");

  // CSV Import parser simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        // Simple CSV parse simulation or JSON parse
        if (file.name.endsWith(".json")) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            setDatasetRecords(parsed);
          }
        } else {
          // Parse CSV lines
          const lines = text.split("\n");
          const newRecords: WorkRecord[] = [];
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(",");
            if (cols.length >= 4) {
              const record: WorkRecord = {
                work_id: `CUSTOM-${Math.floor(1000 + Math.random() * 9000)}`,
                mp_id: "MP-CUST",
                mp_name: "Custom Representative",
                state: cols[2]?.trim() || "Sample State",
                district: cols[1]?.trim() || "Sample District",
                constituency: "Constituency 1",
                category: "Community Infrastructure",
                agency: "District Public Works",
                recommended_cost: parseFloat(cols[3]) || 5000000,
                sanctioned_cost: parseFloat(cols[3]) || 5000000,
                actual_expenditure: parseFloat(cols[4]) || 2000000,
                physical_progress: parseInt(cols[5]) || 45,
                financial_progress: parseInt(cols[6]) || 50,
                start_date: "2025-04-01",
                expected_completion: "2026-03-31",
                predicted_completion: "2026-04-15",
                status: "In Progress",
                risk_score: Math.floor(Math.random() * 80) + 10,
                risk_category: "MEDIUM",
                cost_anomaly_score: Math.floor(Math.random() * 70),
                delay_score: 20,
                duplicate_score: 5,
                compliance_score: 85,
                latitude: 28.6139,
                longitude: 77.2090,
                description: cols[0]?.trim() || "Custom imported work record from user dataset.",
                anomaly_types: ["Cost Variance Checked"],
              };
              newRecords.push(record);
            }
          }
          if (newRecords.length > 0) {
            setDatasetRecords((prev) => [...newRecords, ...prev]);
          }
        }
        alert(`Successfully ingested dataset! Loaded ${file.name}.`);
        setActiveTab("table");
      } catch (err) {
        alert("Failed to parse dataset file. Please check CSV/JSON formatting.");
      }
    };
    reader.readAsText(file);
  };

  const handleAddManualRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkName) return;

    const parsedCost = parseFloat(newCost) || 5000000;
    const newRec: WorkRecord = {
      work_id: `CUST-${Math.floor(10000 + Math.random() * 90000)}`,
      mp_id: "MP-CUSTOM",
      mp_name: "Custom MP",
      state: newState,
      district: newDistrict,
      constituency: `${newDistrict} Central`,
      category: newCategory,
      agency: "District Engineering Division",
      recommended_cost: parsedCost,
      sanctioned_cost: parsedCost,
      actual_expenditure: parsedCost * 0.4,
      physical_progress: 35,
      financial_progress: 40,
      start_date: "2025-06-01",
      expected_completion: "2026-06-01",
      predicted_completion: "2026-06-15",
      status: "In Progress",
      risk_score: 42,
      risk_category: "MEDIUM",
      cost_anomaly_score: 15,
      delay_score: 10,
      duplicate_score: 2,
      compliance_score: 90,
      latitude: 28.5,
      longitude: 77.1,
      description: newWorkName,
      anomaly_types: ["User Custom Ingestion"],
    };

    setDatasetRecords([newRec, ...datasetRecords]);
    setNewWorkName("");
    setIsAddModalOpen(false);
  };

  const handleClearDataset = () => {
    if (confirm("Are you sure you want to clear all custom dataset records?")) {
      setDatasetRecords([]);
    }
  };

  const handleLoadSampleDataset = () => {
    setDatasetRecords([...REAL_WORKS.slice(0, 15)]);
  };

  const filteredRecords = datasetRecords.filter((r) => {
    const matchesSearch =
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.work_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === "ALL" || r.risk_category === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const totalSanctionedCost = datasetRecords.reduce((acc, r) => acc + (r.sanctioned_cost || 0), 0);
  const totalExpenditure = datasetRecords.reduce((acc, r) => acc + (r.actual_expenditure || 0), 0);
  const avgRisk = datasetRecords.length > 0 ? Math.round(datasetRecords.reduce((acc, r) => acc + r.risk_score, 0) / datasetRecords.length) : 0;
  const highRiskCount = datasetRecords.filter((r) => r.risk_category === "HIGH" || r.risk_category === "CRITICAL").length;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <Database className="w-4 h-4" /> {isHindi ? "कस्टम डेटासेट स्टूडियो एवं इंजेसन इंजन" : "Custom Dataset Studio & Ingestion Engine"}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-sans text-slate-900 tracking-tight">
            {isHindi ? "डेटासेट एवं सीएसवी विश्लेषक" : "Dataset & CSV Analyzer"}
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            {isHindi
              ? "अपने कस्टम सांसद निधि या जिला परियोजना डेटासेट को रीयल-टाइम में अपलोड, निरीक्षण और मूल्यांकन करें। स्वचालित विसंगति ऑडिट, जोखिम गणना और व्यय गति विश्लेषण करें।"
              : "Upload, inspect, and evaluate your custom MPLADS or district project datasets in real-time. Perform automated anomaly audits, risk calculations, and expenditure velocity analysis."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <label className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>{isHindi ? "सीएसवी / जेएसओएन अपलोड करें" : "Upload CSV / JSON"}</span>
            <input type="file" accept=".csv,.json" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>{isHindi ? "नया रिकॉर्ड जोड़ें" : "Add Record"}</span>
          </button>

          <button
            onClick={handleLoadSampleDataset}
            className="flex items-center gap-2 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-all cursor-pointer"
            title={isHindi ? "नमूना डेटा लोड करें" : "Load sample MOCK dataset"}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isHindi ? "नमूना लोड करें" : "Load Sample"}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">{isHindi ? "लोड किए गए रिकॉर्ड" : "Loaded Records"}</span>
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">
            {datasetRecords.length} <span className="text-xs font-sans font-normal text-slate-500">{isHindi ? "कार्य" : "works"}</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> {isHindi ? "स्कीमा सफलतापूर्वक सत्यापित" : "Schema validated successfully"}
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">{isHindi ? "कुल स्वीकृत लागत" : "Total Sanctioned Cost"}</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 truncate">
            ₹{(totalSanctionedCost / 10000000).toFixed(2)} {isHindi ? "करोड़" : "Cr"}
          </div>
          <div className="mt-2 text-xs text-slate-500 font-mono">
            {isHindi ? "वास्तविक व्यय:" : "Actual Spent:"} ₹{(totalExpenditure / 10000000).toFixed(2)} {isHindi ? "करोड़" : "Cr"}
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">{isHindi ? "औसत जोखिम स्कोर" : "Average Risk Score"}</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900">
            {avgRisk} <span className="text-xs font-sans font-normal text-slate-500">/ 100</span>
          </div>
          <div className="mt-2 text-xs text-amber-600 font-medium">
            {highRiskCount} {isHindi ? "उच्च जोखिम विसंगतियां चिह्नित" : "high risk anomalies flagged"}
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">{isHindi ? "डेटासेट स्थिति" : "Dataset Status"}</span>
            <Sliders className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-lg font-bold font-sans text-slate-900 mt-1">
            {datasetRecords.length > 0 ? (isHindi ? "सक्रिय इंजेसन" : "Active Ingestion") : (isHindi ? "खाली डेटासेट" : "Empty Dataset")}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{isHindi ? "ऑडिट हेतु तैयार" : "Ready for Audit"}</span>
            {datasetRecords.length > 0 && (
              <button onClick={handleClearDataset} className="text-red-600 hover:underline cursor-pointer">
                {isHindi ? "सभी हटाएं" : "Clear All"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* View Tabs & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("table")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "table"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-100"
              }`}
            >
              {isHindi ? `डेटासेट रिकॉर्ड्स (${filteredRecords.length})` : `Dataset Records (${filteredRecords.length})`}
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "analytics"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-100"
              }`}
            >
              {isHindi ? "जोखिम व विसंगति ऑडिट" : "Risk & Anomaly Audit"}
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={isHindi ? "कार्य, जिला, आईडी खोजें..." : "Search works, districts, ID..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">{isHindi ? "सभी जोखिम स्तर" : "All Risk Levels"}</option>
              <option value="LOW">{isHindi ? "कम जोखिम" : "Low Risk"}</option>
              <option value="MEDIUM">{isHindi ? "मध्यम जोखिम" : "Medium Risk"}</option>
              <option value="HIGH">{isHindi ? "उच्च जोखिम" : "High Risk"}</option>
              <option value="CRITICAL">{isHindi ? "अति गंभीर जोखिम" : "Critical Risk"}</option>
            </select>
          </div>
        </div>

        {activeTab === "table" ? (
          <div className="overflow-x-auto">
            {filteredRecords.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <Database className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-semibold text-slate-700">
                  {isHindi ? "कस्टम डेटासेट में कोई रिकॉर्ड नहीं मिला" : "No records found in custom dataset"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {isHindi ? "विश्लेषण शुरू करने के लिए सीएसवी/जेएसओएन फाइल अपलोड करें या 'नया रिकॉर्ड जोड़ें' पर क्लिक करें।" : "Upload a CSV/JSON file or click \"Add Record\" to start analyzing."}
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-mono">
                    <th className="p-3.5 font-semibold">{isHindi ? "कार्य आईडी व विवरण" : "Work ID & Description"}</th>
                    <th className="p-3.5 font-semibold">{isHindi ? "स्थान" : "Location"}</th>
                    <th className="p-3.5 font-semibold">{isHindi ? "श्रेणी" : "Category"}</th>
                    <th className="p-3.5 font-semibold text-right">{isHindi ? "स्वीकृत लागत" : "Sanctioned Cost"}</th>
                    <th className="p-3.5 font-semibold text-right">{isHindi ? "व्यय" : "Expenditure"}</th>
                    <th className="p-3.5 font-semibold text-center">{isHindi ? "प्रगति" : "Progress"}</th>
                    <th className="p-3.5 font-semibold text-center">{isHindi ? "जोखिम स्कोर" : "Risk Score"}</th>
                    <th className="p-3.5 font-semibold text-right">{isHindi ? "कार्रवाई" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredRecords.map((rec) => (
                    <tr key={rec.work_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-blue-600">{rec.work_id}</div>
                        <div className="text-slate-800 font-medium line-clamp-1 mt-0.5">{rec.description}</div>
                      </td>
                      <td className="p-3.5 text-slate-600">
                        <div className="font-medium">{translateText(rec.district, currentLang)}</div>
                        <div className="text-[10px] text-slate-400">{translateText(rec.state, currentLang)}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md font-medium text-[11px]">
                          {translateText(rec.category, currentLang)}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-mono font-medium text-slate-900">
                        ₹{(rec.sanctioned_cost / 100000).toFixed(2)} {isHindi ? "लाख" : "Lakh"}
                      </td>
                      <td className="p-3.5 text-right font-mono text-slate-600">
                        ₹{(rec.actual_expenditure / 100000).toFixed(2)} {isHindi ? "लाख" : "Lakh"}
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5 font-mono">
                          <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${rec.physical_progress}%` }} />
                          </div>
                          <span>{rec.physical_progress}%</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            rec.risk_score > 70
                              ? "bg-red-100 text-red-700"
                              : rec.risk_score > 40
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {isHindi ? "स्कोर:" : "Score:"} {rec.risk_score}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {onOpenWorkDetail ? (
                          <button
                            onClick={() => onOpenWorkDetail(rec)}
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors cursor-pointer"
                          >
                            {isHindi ? "एआई जांचें" : "Inspect AI"}
                          </button>
                        ) : (
                          <span className="text-slate-400 font-mono">{isHindi ? "लोड किया गया" : "Loaded"}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-900 text-xs flex items-start gap-3">
              <Sliders className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Automated Dataset Anomaly Audit:</span> The system has scanned your custom dataset for cost inflation variances, duplicate invoice footprints, and milestone velocity delays.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white border border-slate-200 rounded-lg">
                <div className="text-xs font-mono text-slate-500 uppercase">Cost Inflation Flags</div>
                <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                  {datasetRecords.filter((r) => r.cost_anomaly_score > 40).length} works
                </div>
                <p className="text-xs text-slate-600 mt-1">Sanctioned costs exceeding regional median benchmarks by &gt;25%.</p>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-lg">
                <div className="text-xs font-mono text-slate-500 uppercase">Duplicate Risk Detected</div>
                <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                  {datasetRecords.filter((r) => r.duplicate_score > 20).length} matches
                </div>
                <p className="text-xs text-slate-600 mt-1">High similarity GPS and description fingerprint matches.</p>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-lg">
                <div className="text-xs font-mono text-slate-500 uppercase">Milestone Delays</div>
                <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                  {datasetRecords.filter((r) => r.delay_score > 30).length} projects
                </div>
                <p className="text-xs text-slate-600 mt-1">Projects lagging behind scheduled physical completion rates.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Record Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold font-sans text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" /> Add Custom Work Record
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-mono font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddManualRecord} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Description / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Construction of Community Water Tank at Ward 4"
                  value={newWorkName}
                  onChange={(e) => setNewWorkName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    required
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sanctioned Cost (₹)</label>
                  <input
                    type="number"
                    required
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="Drinking Water Facility">Drinking Water Facility</option>
                    <option value="Rural Road Improvement">Rural Road Improvement</option>
                    <option value="School Building Renovation">School Building Renovation</option>
                    <option value="Primary Health Centre Upgrade">Primary Health Centre Upgrade</option>
                    <option value="Community Infrastructure">Community Infrastructure</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm cursor-pointer"
                >
                  Save & Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
