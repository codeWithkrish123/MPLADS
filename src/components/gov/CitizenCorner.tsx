import React, { useState } from "react";
import {
  Users,
  FileCheck,
  AlertCircle,
  HelpCircle,
  Send,
  Building2,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  Shield,
  ArrowRight,
  BookOpen
} from "lucide-react";
import { WorkRecord, Language } from "../../types";

interface CitizenCornerProps {
  works: WorkRecord[];
  selectedDistrict: string;
  language?: Language;
  onAddGrievanceAlert: (workId: string, category: string, details: string) => void;
  onSelectWork: (work: WorkRecord) => void;
}

export const CitizenCorner: React.FC<CitizenCornerProps> = ({
  works,
  selectedDistrict,
  language = "en",
  onAddGrievanceAlert,
  onSelectWork
}) => {
  const isHindi = language === "hi";

  // Form states for submitting a query/grievance
  const [selectedWorkId, setSelectedWorkId] = useState("");
  const [grievanceCategory, setGrievanceCategory] = useState("Divergence in Progress");
  const [grievanceDetails, setGrievanceDetails] = useState("");
  const [successTicketId, setSuccessTicketId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Filter works by selected district
  const districtWorks = works.filter(
    (w) => w.district.toLowerCase() === selectedDistrict.toLowerCase()
  );

  // Take the 3 most recent projects in the selected district
  const recentProjects = districtWorks.slice(0, 3);

  // Transparency metrics calculations for district
  const totalDistrictProjects = districtWorks.length;
  const completedProjects = districtWorks.filter((w) => w.status === "Completed").length;
  const inProgressProjects = districtWorks.filter((w) => w.status === "In Progress" || w.status === "Sanctioned").length;
  const averageProgress = totalDistrictProjects > 0
    ? Math.round(districtWorks.reduce((acc, curr) => acc + curr.physical_progress, 0) / totalDistrictProjects)
    : 0;

  // Active scheme status steps (GIGW compliance)
  const schemeSteps = [
    { name: isHindi ? "सांसद सिफारिश" : "MP Proposal", desc: isHindi ? "सांसद द्वारा जिले को भेजी गई सिफारिश" : "Recommendation submitted by MP to Authority" },
    { name: isHindi ? "तकनीकी स्वीकृति" : "Technical Sanction", desc: isHindi ? "अभियंता द्वारा लागत एवं तकनीकी व्यवहार्यता जांच" : "Technical viability & cost estimate approval" },
    { name: isHindi ? "प्रशासनिक स्वीकृति" : "Admin Sanction", desc: isHindi ? "जिलाधिकारी द्वारा कार्य स्वीकृति आदेश" : "Formal administrative sanction & order" },
    { name: isHindi ? "धन आवंटन" : "Fund Release", desc: isHindi ? "पीएफएमएस के माध्यम से बैंक खाते में राशि ट्रांसफर" : "First instalment release via PFMS ledger" },
    { name: isHindi ? "निर्माण कार्य" : "Civil Execution", desc: isHindi ? "कार्यकारी एजेंसी द्वारा जमीनी स्तर पर निर्माण" : "Physical construction on location" },
    { name: isHindi ? "ऑडिट एवं जियोटैग" : "Audit & Geotag", desc: isHindi ? "पूर्णता प्रमाणपत्र एवं जीपीएस फोटो अपलोड" : "Final inspection & mandatory geo-tagged photos" }
  ];

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkId || !grievanceDetails) return;

    // Trigger existing notification flow callback
    onAddGrievanceAlert(selectedWorkId, grievanceCategory, grievanceDetails);

    const ticketId = `MPLADS/CPG/2026/${Math.floor(10000 + Math.random() * 90000)}`;
    setSuccessTicketId(ticketId);

    // Reset Form
    setSelectedWorkId("");
    setGrievanceDetails("");
    
    // Auto clear success banner after 6 seconds
    setTimeout(() => {
      setSuccessTicketId(null);
      setIsFormOpen(false);
    }, 6000);
  };

  return (
    <div
      id="citizen-corner-section"
      className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs space-y-0"
    >
      {/* Saffron and Saffron Slashes decorative border bar */}
      <div className="h-1.5 w-full bg-[#FF9933]" />

      <div className="p-5 md:p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="px-2.5 py-0.5 bg-[#FF9933]/10 text-[#FF9933] border border-[#FF9933]/20 text-[10px] font-bold rounded font-mono uppercase tracking-wider">
              {isHindi ? "जीआईजीडब्ल्यू सुशासन पारदर्शिता" : "GIGW Guidelines Public Portal"}
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight font-heading mt-1 flex items-center gap-2">
              <Users className="w-5.5 h-5.5 text-[#0B3C83]" />
              {isHindi ? "नागरिक कोना (सिटीजन कॉर्नर)" : "Citizen Corner - Transparency Dashboard"}
            </h2>
            <p className="text-xs text-slate-500">
              {isHindi
                ? "आपके चयनित जिले में योजनाओं की वर्तमान प्रगति, हाल की स्वीकृत परियोजनाएं और शिकायत निवारण केंद्र।"
                : `Live transparency metrics, project milestones, and CPGRAMS administrative grievance filing for ${selectedDistrict} District.`}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 bg-[#138808]/10 text-[#138808] border border-[#138808]/20 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#138808]" />
              <span>{isHindi ? "राष्ट्रीय प्रकटीकरण सक्रिय" : "NIC Certified Public View"}</span>
            </span>
          </div>
        </div>

        {/* 1. High-Level Transparency Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-[#0B3C83]/5 border border-[#0B3C83]/10 rounded-xl space-y-1">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">
              {isHindi ? "कुल परियोजनाएं" : "Total Tracked Works"}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-[#0B3C83] font-mono">{totalDistrictProjects}</span>
              <span className="text-[10px] text-slate-400 font-medium">in {selectedDistrict}</span>
            </div>
            <p className="text-[10px] text-slate-500">
              {isHindi ? "सांसद अनुशंसित कुल कार्य" : "Total recommended by local MP"}
            </p>
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl space-y-1">
            <span className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider block">
              {isHindi ? "पूर्ण कार्य दर" : "Certified Completed"}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-emerald-700 font-mono">
                {totalDistrictProjects > 0 ? Math.round((completedProjects / totalDistrictProjects) * 100) : 0}%
              </span>
              <span className="text-[10px] text-emerald-600 font-medium font-mono">({completedProjects}/{totalDistrictProjects})</span>
            </div>
            <p className="text-[10px] text-slate-500">
              {isHindi ? "सत्यापित पूर्णता प्रमाण पत्र" : "Physically verified and audited"}
            </p>
          </div>

          <div className="p-4 bg-[#FF9933]/5 border border-[#FF9933]/15 rounded-xl space-y-1">
            <span className="text-[11px] text-amber-800 font-bold uppercase tracking-wider block">
              {isHindi ? "औसत भौतिक प्रगति" : "Average Progress Rate"}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-[#FF9933] font-mono">{averageProgress}%</span>
              <span className="text-xs text-slate-400">
                <TrendingUp className="w-3.5 h-3.5 inline text-emerald-500" />
              </span>
            </div>
            <p className="text-[10px] text-slate-500">
              {isHindi ? "जियोटैग मापन पुस्तक आधारित" : "Based on MB & geotag milestones"}
            </p>
          </div>

          <div className="p-4 bg-purple-50/70 border border-purple-100 rounded-xl space-y-1">
            <span className="text-[11px] text-purple-800 font-bold uppercase tracking-wider block">
              {isHindi ? "शिकायत समाधान" : "Grievance Resolution"}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-purple-800 font-mono">92.4%</span>
              <span className="text-[10px] text-purple-600 font-semibold font-mono">(12/13 Resolved)</span>
            </div>
            <p className="text-[10px] text-slate-500">
              {isHindi ? "औसत समाधान समय: 7 दिन" : "Avg resolution time: 7 working days"}
            </p>
          </div>
        </div>

        {/* 2. Public-Facing 'Scheme Status' Tracker (GIGW compliance) */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#0B3C83]" />
                {isHindi ? "सांसद निधि योजना जीवन चक्र ट्रैकर" : "MPLADS Statutory Project Lifecycle Workflow"}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isHindi ? "निर्णय प्रक्रिया से पूर्णता तक की प्रक्रिया" : "Stages of sanction, fund draw and civil inspection under MoSPI guidelines"}
              </p>
            </div>
            <span className="text-[10px] font-mono bg-[#0B3C83]/10 text-[#0B3C83] px-2 py-0.5 rounded font-bold">
              GIGW V2.0 Audit
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 pt-2">
            {schemeSteps.map((step, idx) => (
              <div key={idx} className="relative group">
                {/* Horizontal Progress Link Line */}
                {idx < 5 && (
                  <div className="hidden md:block absolute top-5 left-1/2 w-full h-[2px] bg-slate-200 group-hover:bg-[#FF9933] transition-colors z-0" />
                )}

                <div className="relative z-10 flex flex-row md:flex-col items-start md:items-center text-left md:text-center space-x-3 md:space-x-0 md:space-y-1.5 p-2 bg-white rounded-lg border border-slate-200 hover:border-[#FF9933] transition-all">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                    idx < 4 
                      ? "bg-emerald-500 text-white" 
                      : idx === 4 
                      ? "bg-[#FF9933] text-white" 
                      : "bg-slate-200 text-slate-600"
                  }`}>
                    {idx < 4 ? "✓" : idx + 1}
                  </div>
                  <div>
                    <span className="block font-bold text-[11px] text-slate-900 leading-tight">
                      {step.name}
                    </span>
                    <span className="block md:hidden lg:block text-[9px] text-slate-500 leading-none mt-0.5">
                      {step.desc}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two-Column Area: Left Column: Recent Projects | Right Column: Submit Grievance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Recent Projects (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#0B3C83]" />
                {isHindi ? `हाल के स्वीकृत कार्य: ${selectedDistrict}` : `Recent Sanctions in ${selectedDistrict}`}
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">
                {recentProjects.length} active projects
              </span>
            </div>

            <div className="space-y-3">
              {recentProjects.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl text-slate-500 text-xs">
                  {isHindi ? "इस जिले में कोई कार्य रिकॉर्ड नहीं मिले।" : "No development works found in this district database."}
                </div>
              ) : (
                recentProjects.map((work) => (
                  <div
                    key={work.work_id}
                    onClick={() => onSelectWork(work)}
                    className="p-3 bg-slate-50 hover:bg-[#0B3C83]/5 border border-slate-200 hover:border-[#0B3C83]/30 rounded-xl transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono text-xs font-bold text-slate-900 hover:text-blue-700">
                        {work.work_id}
                      </span>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md uppercase ${
                        work.status === "Completed"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : work.status === "In Progress"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}>
                        {work.status}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-800 leading-snug line-clamp-2 mb-2">
                      {work.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2 mt-1">
                      <span>{work.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-700">
                          ₹{work.sanctioned_cost.toLocaleString()}
                        </span>
                        <span>•</span>
                        <span className="font-mono font-semibold text-slate-600">
                          {work.physical_progress}% progress
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Submit Grievance / Query Form (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-4 md:p-5 flex flex-col justify-between space-y-4">
            
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-[#FF9933]" />
                {isHindi ? "सीपीग्राम्स (CPGRAMS) त्वरित शिकायत" : "Submit a Query / Grievance"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isHindi
                  ? "यदि किसी कार्य में विलंब या बजट गड़बड़ी दिखे, तो सीधे संबंधित जिलाधिकारी को शिकायत भेजें।"
                  : "Observe any delay, quality mismatch or divergence? File an official administrative inquiry immediately."}
              </p>
            </div>

            {/* Success Banner */}
            {successTicketId ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg space-y-1.5 animate-in zoom-in-95 duration-150">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-xs">
                    {isHindi ? "शिकायत सफलतापूर्वक दर्ज!" : "CPGRAMS Grievance Registered"}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-emerald-700">
                  {isHindi
                    ? `शिकायत टिकट संख्या ${successTicketId} उत्पन्न कर राष्ट्रीय सुरक्षा सतर्क केंद्र (National Alerts) में जोड़ दिया गया है।`
                    : `Ticket ${successTicketId} is issued and pushed to District Surveillance Notification Tray.`}
                </p>
              </div>
            ) : !isFormOpen ? (
              <button
                onClick={() => setIsFormOpen(true)}
                className="w-full py-2.5 px-4 bg-[#0B3C83] hover:bg-[#072d63] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs min-h-[40px]"
              >
                <span>{isHindi ? "नया शिकायत फॉर्म खोलें" : "Raise Grievance Form"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <form onSubmit={handleGrievanceSubmit} className="space-y-3 animate-in fade-in duration-150">
                {/* Selected Work Selector */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    {isHindi ? "संबंधित कार्य आईडी चुनें" : "Select Relevant Project / Work ID"}
                  </label>
                  <select
                    required
                    value={selectedWorkId}
                    onChange={(e) => setSelectedWorkId(e.target.value)}
                    className="w-full text-xs rounded-lg p-2 border border-slate-300 bg-white text-slate-900 outline-none"
                  >
                    <option value="">-- Select Project ID --</option>
                    {districtWorks.map((work) => (
                      <option key={work.work_id} value={work.work_id}>
                        {work.work_id} ({work.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Grievance Category */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    {isHindi ? "शिकायत का विषय" : "Inquiry / Grievance Category"}
                  </label>
                  <select
                    value={grievanceCategory}
                    onChange={(e) => setGrievanceCategory(e.target.value)}
                    className="w-full text-xs rounded-lg p-2 border border-slate-300 bg-white text-slate-900 outline-none"
                  >
                    <option value="Divergence in Progress">{isHindi ? "भौतिक प्रगति बनाम व्यय में असंगति" : "Physical vs Financial Divergence"}</option>
                    <option value="Severe Project Delay">{isHindi ? "परियोजना में अत्यधिक विलंब" : "Severe Project Timeline Delay"}</option>
                    <option value="Quality Concern">{isHindi ? "सामग्री निर्माण गुणवत्ता शिकायत" : "Construction Quality Deficiency"}</option>
                    <option value="Fund Transparency Request">{isHindi ? "निधि उपयोग स्पष्टीकरण अनुरोध" : "Fund Utilization Clarification"}</option>
                  </select>
                </div>

                {/* Grievance Details */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    {isHindi ? "शिकायत विवरण" : "Grievance Details / Evidence"}
                  </label>
                  <textarea
                    required
                    rows={2.5}
                    placeholder={isHindi ? "कृपया अनियमितता या शिकायत का विस्तृत विवरण दें..." : "Describe the observed physical delay or anomaly details..."}
                    value={grievanceDetails}
                    onChange={(e) => setGrievanceDetails(e.target.value)}
                    className="w-full text-xs rounded-lg p-2 border border-slate-300 bg-white text-slate-900 outline-none resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="w-1/3 py-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                  >
                    {isHindi ? "रद्द करें" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2 bg-[#FF9933] hover:bg-[#e07b1b] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isHindi ? "जमा करें" : "Submit Complaint"}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Helpline quick link */}
            <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200 flex items-center justify-between">
              <span>National CPGRAMS Portal</span>
              <a href="tel:1800111992" className="text-amber-700 font-bold hover:underline">
                Call Helpline: 1800-11-1992
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
