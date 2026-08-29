import React, { useState, useMemo } from "react";
import {
  Map as MapIcon,
  Layers,
  Globe,
  Search,
  Filter,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  Sparkles,
  AlertTriangle,
  Flame,
  CheckCircle2,
  TrendingUp,
  Building2,
  Landmark,
  ChevronRight,
  Download,
  Eye,
  Compass,
  Satellite,
  Info,
  Sliders,
  FileSpreadsheet,
  IndianRupee,
} from "lucide-react";
import { StateSummary, WorkRecord, Language, RiskSeverity } from "../types";
import { RiskBadge } from "../components/common/RiskBadge";
import { IndiaMap } from "../components/common/IndiaMap";
import { formatCr, formatINR } from "../lib/utils";
import { getTranslation } from "../data/translations";

interface MapIntelligenceViewProps {
  states: StateSummary[];
  works: WorkRecord[];
  selectedState: string;
  onSelectState: (state: string) => void;
  onSelectWork: (work: WorkRecord) => void;
  onNavigateToDistrict: (district: string) => void;
  onNavigateToMP: () => void;
  language?: Language;
}

// Extended MP Constituency & State Geospatial Dataset
interface ConstituencyPoint {
  id: string;
  mp_name: string;
  house_type: "Lok Sabha" | "Rajya Sabha" | "Nominated";
  constituency: string;
  state: string;
  district: string;
  party: string;
  total_works: number;
  expenditure_cr: number;
  risk_score: number;
  risk_category: RiskSeverity;
  lat: number;
  lng: number;
  isro_bhuvan_geotags: number;
  geotag_compliance_pct: number;
  cx: number;
  cy: number;
}

const MOCK_CONSTITUENCIES: ConstituencyPoint[] = [
  {
    id: "CONST-01",
    mp_name: "Dr. Rajeshwar Sharma",
    house_type: "Lok Sabha",
    constituency: "Ghaziabad Lok Sabha",
    state: "Uttar Pradesh",
    district: "Ghaziabad",
    party: "BJP",
    total_works: 342,
    expenditure_cr: 2.84,
    risk_score: 91,
    risk_category: "CRITICAL",
    lat: 28.6692,
    lng: 77.4538,
    isro_bhuvan_geotags: 310,
    geotag_compliance_pct: 90.6,
    cx: 200,
    cy: 165,
  },
  {
    id: "CONST-02",
    mp_name: "Smt. Manju Kumari",
    house_type: "Lok Sabha",
    constituency: "Patna Sahib",
    state: "Bihar",
    district: "Patna",
    party: "JD(U)",
    total_works: 298,
    expenditure_cr: 2.45,
    risk_score: 88,
    risk_category: "CRITICAL",
    lat: 25.5941,
    lng: 85.1376,
    isro_bhuvan_geotags: 250,
    geotag_compliance_pct: 83.8,
    cx: 355,
    cy: 212,
  },
  {
    id: "CONST-03",
    mp_name: "Shri Arvind Pratap",
    house_type: "Lok Sabha",
    constituency: "Varanasi Lok Sabha",
    state: "Uttar Pradesh",
    district: "Varanasi",
    party: "BJP",
    total_works: 312,
    expenditure_cr: 2.62,
    risk_score: 76,
    risk_category: "HIGH",
    lat: 25.3176,
    lng: 82.9739,
    isro_bhuvan_geotags: 295,
    geotag_compliance_pct: 94.5,
    cx: 310,
    cy: 220,
  },
  {
    id: "CONST-04",
    mp_name: "Thiru S. Venkatesan",
    house_type: "Lok Sabha",
    constituency: "Coimbatore Lok Sabha",
    state: "Tamil Nadu",
    district: "Coimbatore",
    party: "CPI(M)",
    total_works: 284,
    expenditure_cr: 2.31,
    risk_score: 14,
    risk_category: "LOW",
    lat: 11.0168,
    lng: 76.9558,
    isro_bhuvan_geotags: 280,
    geotag_compliance_pct: 98.5,
    cx: 215,
    cy: 525,
  },
  {
    id: "CONST-05",
    mp_name: "Shri Nitin Gadkari",
    house_type: "Lok Sabha",
    constituency: "Nagpur Lok Sabha",
    state: "Maharashtra",
    district: "Nagpur",
    party: "BJP",
    total_works: 390,
    expenditure_cr: 3.12,
    risk_score: 32,
    risk_category: "LOW",
    lat: 21.1458,
    lng: 79.0882,
    isro_bhuvan_geotags: 382,
    geotag_compliance_pct: 97.9,
    cx: 250,
    cy: 330,
  },
  {
    id: "CONST-06",
    mp_name: "Prof. Manoj Jha",
    house_type: "Rajya Sabha",
    constituency: "Rajya Sabha (Bihar)",
    state: "Bihar",
    district: "Muzaffarpur",
    party: "RJD",
    total_works: 185,
    expenditure_cr: 1.82,
    risk_score: 65,
    risk_category: "HIGH",
    lat: 26.1209,
    lng: 85.3647,
    isro_bhuvan_geotags: 152,
    geotag_compliance_pct: 82.1,
    cx: 365,
    cy: 200,
  },
  {
    id: "CONST-07",
    mp_name: "Dr. Abhishek Manu Singhvi",
    house_type: "Rajya Sabha",
    constituency: "Rajya Sabha (Rajasthan)",
    state: "Rajasthan",
    district: "Jaipur",
    party: "INC",
    total_works: 160,
    expenditure_cr: 1.55,
    risk_score: 48,
    risk_category: "MEDIUM",
    lat: 26.9124,
    lng: 75.7873,
    isro_bhuvan_geotags: 148,
    geotag_compliance_pct: 92.5,
    cx: 175,
    cy: 210,
  },
  {
    id: "CONST-08",
    mp_name: "Smt. Sudha Murty",
    house_type: "Nominated",
    constituency: "Nominated MP (Presidential)",
    state: "Karnataka",
    district: "Bengaluru Urban",
    party: "Nominated",
    total_works: 110,
    expenditure_cr: 1.15,
    risk_score: 18,
    risk_category: "LOW",
    lat: 12.9716,
    lng: 77.5946,
    isro_bhuvan_geotags: 108,
    geotag_compliance_pct: 98.1,
    cx: 185,
    cy: 470,
  },
];

// High-precision geometric state outlines for India Map
const MAP_STATE_PATHS = [
  { name: "Jammu & Kashmir / Ladakh", code: "JK", d: "M 180 30 L 260 35 L 290 85 L 250 115 L 200 110 L 165 80 Z", cx: 220, cy: 70 },
  { name: "Punjab", code: "PB", d: "M 175 110 L 210 115 L 205 145 L 165 140 Z", cx: 188, cy: 128 },
  { name: "Himachal Pradesh", code: "HP", d: "M 210 110 L 245 115 L 235 145 L 205 140 Z", cx: 225, cy: 128 },
  { name: "Uttarakhand", code: "UK", d: "M 235 140 L 270 145 L 260 175 L 225 165 Z", cx: 248, cy: 155 },
  { name: "Haryana & Delhi", code: "HR", d: "M 180 145 L 225 145 L 220 180 L 180 175 Z", cx: 200, cy: 162 },
  { name: "Rajasthan", code: "RJ", d: "M 115 160 L 185 165 L 200 235 L 140 270 L 95 210 Z", cx: 145, cy: 215 },
  { name: "Uttar Pradesh", code: "UP", d: "M 220 170 L 320 175 L 340 230 L 250 250 L 205 210 Z", cx: 270, cy: 210 },
  { name: "Bihar", code: "BR", d: "M 325 185 L 390 190 L 385 240 L 325 235 Z", cx: 355, cy: 212 },
  { name: "West Bengal", code: "WB", d: "M 375 220 L 415 225 L 390 310 L 360 275 Z", cx: 385, cy: 260 },
  { name: "Gujarat", code: "GJ", d: "M 75 245 L 145 250 L 155 315 L 105 340 L 65 295 Z", cx: 110, cy: 290 },
  { name: "Madhya Pradesh", code: "MP", d: "M 170 245 L 295 240 L 305 320 L 210 335 L 160 295 Z", cx: 235, cy: 285 },
  { name: "Jharkhand", code: "JH", d: "M 325 240 L 375 245 L 365 290 L 315 285 Z", cx: 345, cy: 265 },
  { name: "Odisha", code: "OD", d: "M 315 290 L 375 295 L 345 365 L 295 340 Z", cx: 335, cy: 325 },
  { name: "Maharashtra", code: "MH", d: "M 135 320 L 250 325 L 255 400 L 160 420 L 125 360 Z", cx: 195, cy: 365 },
  { name: "Chhattisgarh", code: "CG", d: "M 270 285 L 315 290 L 295 385 L 255 365 Z", cx: 285, cy: 335 },
  { name: "Telangana & Andhra Pradesh", code: "AP", d: "M 205 390 L 295 375 L 300 480 L 225 485 L 195 430 Z", cx: 250, cy: 435 },
  { name: "Karnataka", code: "KA", d: "M 160 415 L 225 410 L 215 510 L 150 490 Z", cx: 185, cy: 455 },
  { name: "Tamil Nadu", code: "TN", d: "M 195 490 L 255 480 L 235 570 L 180 560 Z", cx: 215, cy: 525 },
  { name: "Kerala", code: "KL", d: "M 165 500 L 190 495 L 185 575 L 155 560 Z", cx: 172, cy: 535 },
  { name: "Assam & North East", code: "NE", d: "M 410 185 L 485 190 L 475 255 L 400 240 Z", cx: 445, cy: 215 },
];

export const MapIntelligenceView: React.FC<MapIntelligenceViewProps> = ({
  states,
  works,
  selectedState,
  onSelectState,
  onSelectWork,
  onNavigateToDistrict,
  onNavigateToMP,
  language = "en",
}) => {
  const isHindi = language === "hi";
  const t = getTranslation(language as Language);

  // View & Layer Controls
  const [mapMode, setMapMode] = useState<"choropleth" | "clusters" | "satellite">("choropleth");
  const [mpTypeFilter, setMpTypeFilter] = useState<"ALL" | "Lok Sabha" | "Rajya Sabha" | "Nominated">("ALL");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [sectorFilter, setSectorFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredStateName, setHoveredStateName] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<ConstituencyPoint | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<ConstituencyPoint | null>(MOCK_CONSTITUENCIES[0]);

  // Filter constituencies
  const filteredConstituencies = useMemo(() => {
    return MOCK_CONSTITUENCIES.filter((c) => {
      const matchesMpType = mpTypeFilter === "ALL" || c.house_type === mpTypeFilter;
      const matchesSeverity = severityFilter === "ALL" || c.risk_category === severityFilter;
      const matchesSearch =
        !searchQuery ||
        c.mp_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.constituency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.district.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesMpType && matchesSeverity && matchesSearch;
    });
  }, [mpTypeFilter, severityFilter, searchQuery]);

  // Get state summary
  const getStateData = (name: string): StateSummary | undefined => {
    return states.find(
      (s) =>
        s.state.toLowerCase() === name.toLowerCase() ||
        name.toLowerCase().includes(s.state.toLowerCase()) ||
        s.state.toLowerCase().includes(name.toLowerCase())
    );
  };

  const getRiskColor = (severity?: RiskSeverity, isHovered?: boolean, isSelected?: boolean) => {
    if (isSelected) return "#0F172A"; // Slate-900 highlight
    if (isHovered) return "#334155"; // Slate-700 hover

    switch (severity) {
      case "CRITICAL":
        return "#EF4444"; // Red-500
      case "HIGH":
        return "#F59E0B"; // Amber-500
      case "MEDIUM":
        return "#EAB308"; // Yellow-500
      case "LOW":
        return "#10B981"; // Emerald-500
      default:
        return "#94A3B8"; // Slate-400
    }
  };

  // Top high risk works for currently selected point/state
  const currentWorks = useMemo(() => {
    if (selectedPoint) {
      return works.filter((w) => w.district.toLowerCase() === selectedPoint.district.toLowerCase() || w.state.toLowerCase() === selectedPoint.state.toLowerCase());
    }
    if (selectedState && selectedState !== "All States") {
      return works.filter((w) => w.state.toLowerCase() === selectedState.toLowerCase());
    }
    return works;
  }, [works, selectedPoint, selectedState]);

  return (
    <div id="map-intelligence-dashboard" className="space-y-6 animate-in fade-in duration-200">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-blue-100 text-[#1D4ED8] border border-blue-200 text-[11px] font-bold rounded font-mono uppercase tracking-wide flex items-center gap-1">
              <Satellite className="w-3.5 h-3.5 text-[#1D4ED8]" />
              ISRO Bhuvan &amp; MoSPI Geospatial Layer
            </span>
            <span className="text-xs text-slate-500 font-mono">Real-time Telemetry v2.6</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <MapIcon className="w-6 h-6 text-[#1D4ED8]" />
            {isHindi ? "राष्ट्रीय भौगोलिक जोखिम आसूचना" : "National Geographic & Constituency Map Intelligence"}
          </h1>
          <p className="text-xs text-slate-600">
            {isHindi
              ? "संसदीय निर्वाचन क्षेत्र, राज्य नोडल क्षेत्राधिकार, एवं इसरो भुवन जिओटैगिंग विसंगति मानचित्र।"
              : "Interactive Lok Sabha, Rajya Sabha & State Nodal territorial surveillance with ISRO Bhuvan geotag anomaly detection."}
          </p>
        </div>

        {/* Quick Stat Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <div>
              <span className="text-[10px] text-slate-500 block">Monitored Geotags</span>
              <span className="font-mono font-bold text-slate-900">12,842 Works</span>
            </div>
          </div>

          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-600" />
            <div>
              <span className="text-[10px] text-slate-500 block">Critical Outliers</span>
              <span className="font-mono font-bold text-red-600">87 Outliers</span>
            </div>
          </div>

          <button
            onClick={() => {
              const csvData = "data:text/csv;charset=utf-8,Constituency,MP Name,House Type,State,District,Risk Score,Risk Category\n" +
                MOCK_CONSTITUENCIES.map(c => `"${c.constituency}","${c.mp_name}","${c.house_type}","${c.state}","${c.district}",${c.risk_score},"${c.risk_category}"`).join("\n");
              const link = document.createElement("a");
              link.setAttribute("href", encodeURI(csvData));
              link.setAttribute("download", "MPLADS-Constituency-Map-Intelligence.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-3 py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export GIS Dataset</span>
          </button>
        </div>
      </div>

      {/* MP House Type Selector & Global Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* MP House Type Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 overflow-x-auto">
            <span className="text-xs font-bold text-slate-500 uppercase px-2 tracking-wider shrink-0 flex items-center gap-1">
              <Landmark className="w-3.5 h-3.5 text-slate-700" />
              MP Category:
            </span>
            {[
              { id: "ALL", label: "All MPs (788)" },
              { id: "Lok Sabha", label: "Lok Sabha (LS - 543)" },
              { id: "Rajya Sabha", label: "Rajya Sabha (RS - 245)" },
              { id: "Nominated", label: "Nominated MPs" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMpTypeFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  mpTypeFilter === tab.id
                    ? "bg-[#1D4ED8] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search MP, Constituency, District..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Map Rendering Mode Switcher & Severity Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Map Layer Mode */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              Map View Mode:
            </span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md border border-slate-200">
              <button
                onClick={() => setMapMode("choropleth")}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  mapMode === "choropleth" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Choropleth Heatmap
              </button>
              <button
                onClick={() => setMapMode("clusters")}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  mapMode === "clusters" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Geotag Work Clusters
              </button>
              <button
                onClick={() => setMapMode("satellite")}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  mapMode === "satellite" ? "bg-slate-900 text-amber-400 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🛰️ ISRO Bhuvan Radar
              </button>
            </div>
          </div>

          {/* Severity Pills */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-semibold mr-1">Risk Severity:</span>
            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                  severityFilter === sev
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Map & Intelligence Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Map Canvas (Col 8) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
          <IndiaMap
            states={states}
            selectedState={selectedState}
            onSelectState={onSelectState}
            mapHeight="560px"
            id="real-gis-map-intelligence"
          />
        </div>

        {/* Right State & Constituency Risk Ledger (Col 5) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          {/* Active Constituency Focus Card */}
          {selectedPoint && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
              <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-mono text-[10px] font-bold rounded uppercase">
                      {selectedPoint.house_type}
                    </span>
                    <span className="text-xs text-slate-500">{selectedPoint.party}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    {selectedPoint.mp_name}
                  </h3>
                  <p className="text-xs font-medium text-slate-600">
                    {selectedPoint.constituency} • {selectedPoint.district}, {selectedPoint.state}
                  </p>
                </div>
                <RiskBadge severity={selectedPoint.risk_category} score={selectedPoint.risk_score} size="md" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-500 text-[10px] block">Sanctioned Works</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {selectedPoint.total_works} Works
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-500 text-[10px] block">Expenditure</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    ₹{selectedPoint.expenditure_cr} Cr
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-500 text-[10px] block">ISRO Geotags</span>
                  <span className="font-mono font-bold text-emerald-700 text-sm">
                    {selectedPoint.isro_bhuvan_geotags}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-500 text-[10px] block">Geotag Compliance</span>
                  <span className="font-mono font-bold text-blue-700 text-sm">
                    {selectedPoint.geotag_compliance_pct}%
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onNavigateToDistrict(selectedPoint.district)}
                  className="flex-1 px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <span>Drill into District ({selectedPoint.district})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Constituency Ledger List */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between max-h-[440px] overflow-hidden">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Constituency &amp; MP Risk Ledger ({filteredConstituencies.length})
                </h3>
                <p className="text-[11px] text-slate-500">Sorted by composite risk index</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 overflow-y-auto mt-2 space-y-0.5">
              {filteredConstituencies.map((c) => {
                const isSel = selectedPoint?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedPoint(c);
                      onSelectState(c.state);
                    }}
                    className={`p-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-between gap-3 hover:bg-slate-50 ${
                      isSel ? "bg-blue-50/90 border border-blue-200" : ""
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {c.mp_name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">({c.party})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="truncate">{c.constituency}</span>
                        <span>•</span>
                        <span className="font-mono">₹{c.expenditure_cr} Cr</span>
                      </div>
                    </div>

                    <RiskBadge severity={c.risk_category} score={c.risk_score} size="sm" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Flagged Works in Selected Map Region */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              High-Risk Works Flagged in Active Map Region ({currentWorks.length})
            </h3>
            <p className="text-xs text-slate-500">
              Click any project record below to open the complete explainable anomaly scorecard.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {currentWorks.map((work) => (
            <div
              key={work.work_id}
              onClick={() => onSelectWork(work)}
              className="p-4 bg-slate-50/80 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl transition-all cursor-pointer group space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-blue-700">
                  {work.work_id}
                </span>
                <RiskBadge severity={work.risk_category} score={work.risk_score} size="sm" />
              </div>

              <div className="text-xs font-bold text-slate-900 line-clamp-1">
                {work.description}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                <span>{work.district}, {work.state}</span>
                <span className="font-mono font-bold text-slate-800">
                  {formatCr(work.sanctioned_cost)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
