import React, { useState } from "react";
import { 
  Megaphone, 
  PlusCircle, 
  Check, 
  Users, 
  FileWarning, 
  Search, 
  ChevronRight, 
  CheckCircle, 
  HelpCircle, 
  Clock, 
  FileText 
} from "lucide-react";
import { WorkRecord } from "../../types";

interface CitizenEngagementHubProps {
  works: WorkRecord[];
  language?: "en" | "hi";
}

interface UserRecommendation {
  id: number;
  category: string;
  location: string;
  description: string;
  votes: number;
  voted: boolean;
  status: "Draft" | "Forwarded to MP" | "Feasibility Approved";
}

interface GrievanceTicket {
  id: string;
  workId: string;
  description: string;
  category: string;
  date: string;
  status: "Registered" | "Assigned to District Collector" | "Resolved";
  updates: string[];
}

export const CitizenEngagementHub: React.FC<CitizenEngagementHubProps> = ({ 
  works, 
  language = "en" 
}) => {
  const isHindi = language === "hi";
  const [activeTab, setActiveTab] = useState<"jan-bhagidari" | "cpgrams">("jan-bhagidari");

  // Stateful list of Citizen recommendations (Jan-Bhagidari)
  const [recommendations, setRecommendations] = useState<UserRecommendation[]>([
    {
      id: 101,
      category: isHindi ? "पेयजल" : "Drinking Water Facility",
      location: "Gosaiganj Village, Lucknow",
      description: isHindi ? "मझगवां प्राथमिक विद्यालय के निकट पेयजल बोरवेल निर्माण की अत्यंत आवश्यकता है।" : "Urgent installation of deep borewell hand pump near Gosaiganj primary school.",
      votes: 342,
      voted: false,
      status: "Forwarded to MP"
    },
    {
      id: 102,
      category: isHindi ? "सार्वजनिक स्वच्छता" : "Public Sanitation Facility",
      location: "Bhelsar Market Block, Ayodhya",
      description: isHindi ? "स्थानीय महिलाओं के लिए साप्ताहिक बाजार परिसर में सामुदायिक शौचालय ब्लॉक।" : "Construct a public ladies sanitation toilet block at the busy local weekly market square.",
      votes: 189,
      voted: true,
      status: "Feasibility Approved"
    },
    {
      id: 103,
      category: isHindi ? "ग्राम सड़क सुधार" : "Rural Road Improvement",
      location: "Malgudi Hamlet Link Road, Karnataka",
      description: isHindi ? "मुख्य राजमार्ग से ग्रामीण विद्यालय तक 2 किमी संपर्क मार्ग का पक्कीकरण।" : "Asphalting of 2km connector road linking main state highway to rural high school.",
      votes: 95,
      voted: false,
      status: "Draft"
    }
  ]);

  // Form states for Suggestion submission
  const [suggestCategory, setSuggestCategory] = useState("");
  const [suggestLocation, setSuggestLocation] = useState("");
  const [suggestDesc, setSuggestDesc] = useState("");
  const [showSuggestSuccess, setShowSuggestSuccess] = useState(false);

  // Stateful list of Grievances filed
  const [grievances, setGrievances] = useState<GrievanceTicket[]>([
    {
      id: "MPLADS/CPG/2026/89410",
      workId: "LKO-204-012",
      description: "Drinking water pipeline project approved last year but ground physical work has not started yet.",
      category: "Divergence in Progress",
      date: "14 Aug 2026",
      status: "Assigned to District Collector",
      updates: ["Registered on National CPGRAMS Desk", "Re-assigned to Lucknow District Commissioner for physical verify"]
    }
  ]);

  // Grievance Form state
  const [selectedWorkId, setSelectedWorkId] = useState("");
  const [grievanceCategory, setGrievanceCategory] = useState("Divergence in Progress");
  const [grievanceDetails, setGrievanceDetails] = useState("");
  const [successGrievanceId, setSuccessGrievanceId] = useState<string | null>(null);

  // Upvote support recommendation
  const handleVote = (id: number) => {
    setRecommendations(prev => 
      prev.map(rec => {
        if (rec.id === id) {
          return {
            ...rec,
            votes: rec.voted ? rec.votes - 1 : rec.votes + 1,
            voted: !rec.voted
          };
        }
        return rec;
      })
    );
  };

  // Submit new local asset suggestion
  const handleSubmitSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestCategory || !suggestLocation || !suggestDesc) return;

    const newRec: UserRecommendation = {
      id: Date.now(),
      category: suggestCategory,
      location: suggestLocation,
      description: suggestDesc,
      votes: 1,
      voted: true,
      status: "Draft"
    };

    setRecommendations(prev => [newRec, ...prev]);
    setSuggestCategory("");
    setSuggestLocation("");
    setSuggestDesc("");
    setShowSuggestSuccess(true);
    setTimeout(() => setShowSuggestSuccess(false), 4000);
  };

  // Submit new grievance complaint
  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkId || !grievanceDetails) return;

    const gId = `MPLADS/CPG/2026/${Math.floor(10000 + Math.random() * 90000)}`;
    const newGrievance: GrievanceTicket = {
      id: gId,
      workId: selectedWorkId,
      category: grievanceCategory,
      description: grievanceDetails,
      date: "Today",
      status: "Registered",
      updates: ["Lodged via Sentinel-CPGRAMS Portal", "Awaiting official review from nodal officer"]
    };

    setGrievances(prev => [newGrievance, ...prev]);
    setSelectedWorkId("");
    setGrievanceDetails("");
    setSuccessGrievanceId(gId);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-6">
      
      {/* Title & Core Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="px-2 py-0.5 bg-amber-50 text-[#B48A30] border border-[#B48A30]/30 text-[10px] font-bold rounded font-mono uppercase tracking-wider">
            {isHindi ? "राष्ट्रीय जनभागीदारी एवं शिकायत निवारण मंच" : "National Citizen Engagement & Grievance Redressal"}
          </span>
          <h2 className="text-base font-black text-slate-900 tracking-tight font-heading mt-1 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-primary" />
            {isHindi ? "नागरिक भागीदारी केंद्र" : "Citizen Participation Hub (Jan Bhagidari)"}
          </h2>
          <p className="text-xs text-slate-500">
            {isHindi 
              ? "सांसद निधि योजना में जनसमुदाय के विकास सुझावों को प्रस्तुत करें और निर्माणाधीन परियोजनाओं की विसंगति शिकायत दर्ज करें।"
              : "Direct citizen portal allowing local asset recommendations and official CPGRAMS administrative grievance filing."}
          </p>
        </div>

        {/* Dynamic Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0 self-start md:self-center">
          <button
            onClick={() => setActiveTab("jan-bhagidari")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "jan-bhagidari" 
                ? "bg-white text-slate-900 shadow-2xs" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{isHindi ? "जनभागीदारी सुझाव" : "Jan-Bhagidari Propose"}</span>
          </button>
          <button
            onClick={() => setActiveTab("cpgrams")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "cpgrams" 
                ? "bg-white text-slate-900 shadow-2xs" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileWarning className="w-3.5 h-3.5" />
            <span>{isHindi ? "CPGRAMS शिकायत" : "CPGRAMS Grievances"}</span>
          </button>
        </div>
      </div>

      {/* Tab 1 Content: JAN BHAGIDARI - Citizen Asset Recommender */}
      {activeTab === "jan-bhagidari" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Form to submit Suggestion */}
          <div className="lg:col-span-5 p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4 text-primary" />
                {isHindi ? "नए सामुदायिक कार्य का प्रस्ताव करें" : "Propose Local Community Work"}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isHindi ? "आपके क्षेत्र में आवश्यक विकास कार्यों का विवरण सांसद कार्यालय को प्रेषित किया जायेगा।" : "Submit required infrastructure requests directly to your regional MP constituency cell."}
              </p>
            </div>

            {showSuggestSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2 animate-in fade-in duration-200">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{isHindi ? "सुझाव सफलतापूर्वक पंजीकृत और दर्ज किया गया!" : "Local Recommendation registered successfully!"}</span>
              </div>
            )}

            <form onSubmit={handleSubmitSuggestion} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{isHindi ? "कार्य श्रेणी" : "Work Category"}</label>
                <select
                  value={suggestCategory}
                  onChange={(e) => setSuggestCategory(e.target.value)}
                  required
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="">{isHindi ? "-- श्रेणी चुनें --" : "-- Select Category --"}</option>
                  <option value="Drinking Water Facility">{isHindi ? "पेयजल सुविधा" : "Drinking Water Facility"}</option>
                  <option value="Rural Road Improvement">{isHindi ? "ग्रामीण सड़क सुधार" : "Rural Road Improvement"}</option>
                  <option value="School Building Renovation">{isHindi ? "स्कूल भवन उन्नयन" : "School Building Renovation"}</option>
                  <option value="Public Sanitation Facility">{isHindi ? "सार्वजनिक शौचालय / स्वच्छता" : "Public Sanitation Facility"}</option>
                  <option value="Solar Street Lights">{isHindi ? "सौर स्ट्रीट लाइट" : "Solar Street Lights"}</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{isHindi ? "सटीक स्थान" : "Constituency Location"}</label>
                <input
                  type="text"
                  value={suggestLocation}
                  onChange={(e) => setSuggestLocation(e.target.value)}
                  placeholder={isHindi ? "उदा. ग्राम गढ़ी, लखनऊ" : "e.g. Village Garhi, Lucknow Constituency"}
                  required
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">{isHindi ? "आवश्यकता का विस्तृत विवरण" : "Requirement Description"}</label>
                <textarea
                  value={suggestDesc}
                  onChange={(e) => setSuggestDesc(e.target.value)}
                  rows={3}
                  placeholder={isHindi ? "कार्य के लाभ व प्रभाव का वर्णन करें..." : "Describe why this asset is critical for the village/locality..."}
                  required
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{isHindi ? "प्रस्ताव दर्ज करें" : "Submit Recommendation"}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Dynamic Feed of Citizen suggestions with vote tracking */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                {isHindi ? "सक्रिय नागरिक प्रस्ताव फीड" : "Active Public Infrastructure Proposals"}
              </h4>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono font-bold">
                {recommendations.length} {isHindi ? "कुल प्रस्ताव" : "proposals listed"}
              </span>
            </div>

            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
              {recommendations.map((rec) => (
                <div 
                  key={rec.id} 
                  className="p-3.5 border border-slate-200 rounded-lg bg-white shadow-2xs flex items-start gap-3 justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[9px] font-bold rounded">
                        {rec.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Loc: {rec.location}</span>
                      
                      {/* State tag */}
                      <span className={`text-[9px] font-extrabold px-1.5 rounded ${
                        rec.status === "Forwarded to MP"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : rec.status === "Feasibility Approved"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-50 text-slate-500 border border-slate-200"
                      }`}>
                        {rec.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-normal font-medium pt-1">
                      {rec.description}
                    </p>
                  </div>

                  {/* Vote action panel */}
                  <button
                    onClick={() => handleVote(rec.id)}
                    className={`p-2 rounded flex flex-col items-center justify-center border transition-all cursor-pointer min-w-14 shrink-0 ${
                      rec.voted 
                        ? "bg-amber-50 border-amber-300 text-amber-800" 
                        : "bg-white border-slate-200 hover:border-slate-300 text-slate-500"
                    }`}
                  >
                    <Users className="w-4 h-4 mb-0.5 text-slate-400" />
                    <span className="font-mono text-[11px] font-bold">{rec.votes}</span>
                    <span className="text-[8px] font-bold uppercase tracking-wider">{rec.voted ? (isHindi ? "समर्थित" : "Supported") : (isHindi ? "समर्थन करें" : "Support")}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2 Content: CPGRAMS - Grievance Portal Linkage */}
      {activeTab === "cpgrams" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Complaint Box Form */}
          <div className="lg:col-span-5 p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileWarning className="w-4 h-4 text-red-600" />
                {isHindi ? "आधिकारिक विसंगति शिकायत दर्ज करें" : "Register Formal Anomaly Complaint"}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isHindi ? "सीधे केंद्रीय CPGRAMS लोक शिकायत निवारण प्रणाली से लिंक।" : "Lodges a tracking ticket dispatched to both the MoSPI Quality Cell & District Authority."}
              </p>
            </div>

            {successGrievanceId && (
              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 text-xs rounded-md space-y-1.5 animate-in fade-in duration-200">
                <div className="font-bold flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>{isHindi ? "शिकायत सफलतापूर्वक पंजीकृत!" : "Grievance Lodged Successfully!"}</span>
                </div>
                <div className="text-[10px] font-mono bg-white p-1 rounded border border-blue-100 font-bold select-all">
                  CPGRAMS Reference: {successGrievanceId}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitGrievance} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  {isHindi ? "परियोजना आईडी / कार्य का चयन करें" : "Select Project / Work of Interest"}
                </label>
                <select
                  value={selectedWorkId}
                  onChange={(e) => setSelectedWorkId(e.target.value)}
                  required
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">{isHindi ? "-- परियोजना आईडी चुनें --" : "-- Choose Project ID --"}</option>
                  {works.slice(0, 5).map(w => (
                    <option key={w.work_id} value={w.work_id}>
                      {w.work_id} - {w.description.substring(0, 45)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  {isHindi ? "शिकायत का विषय" : "Category of Grievance"}
                </label>
                <select
                  value={grievanceCategory}
                  onChange={(e) => setGrievanceCategory(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Divergence in Progress">{isHindi ? "प्रगति में अत्यधिक विलम्ब" : "Delay in Milestone Progression"}</option>
                  <option value="Sub-standard Quality">{isHindi ? "घटिया निर्माण सामग्री / गुणवत्ता" : "Sub-standard Construction Quality"}</option>
                  <option value="Asset Does Not Exist">{isHindi ? "कागजों पर कार्य, वास्तविक अनुपस्थिति" : "Ghost Asset (Paper work only)"}</option>
                  <option value="Fund Misappropriation">{isHindi ? "निधि का दुरुपयोग / वित्तीय विसंगति" : "Cost Inflation / Misappropriation"}</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  {isHindi ? "शिकायत का विवरण" : "Grievance Specifics"}
                </label>
                <textarea
                  value={grievanceDetails}
                  onChange={(e) => setGrievanceDetails(e.target.value)}
                  rows={3}
                  required
                  placeholder={isHindi ? "स्थान, कार्य की स्थिति व शिकायत का स्पष्ट वर्णन करें..." : "State clearly what anomaly was observed at the construction location..."}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileWarning className="w-3.5 h-3.5" />
                <span>{isHindi ? "शिकायत दर्ज करें" : "Lodged CPGRAMS Ticket"}</span>
              </button>
            </form>
          </div>

          {/* Right Column: CPGRAMS ticket tracking board */}
          <div className="lg:col-span-7 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              {isHindi ? "आपकी सक्रिय CPGRAMS शिकायतें" : "Your Active CPGRAMS Tracking Tickets"}
            </h4>

            <div className="space-y-3">
              {grievances.map((gt) => (
                <div key={gt.id} className="p-4 border border-slate-200 bg-white rounded-lg space-y-3 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono font-bold block">TICKET ID</span>
                      <span className="text-xs font-mono font-bold text-blue-700 select-all">{gt.id}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-mono font-bold block">STATUS</span>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-extrabold uppercase rounded-full">
                        {gt.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-500 font-mono">Project Ref:</span>
                      <span className="font-mono font-bold text-slate-800">{gt.workId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-500 font-mono">Category:</span>
                      <span className="font-medium text-slate-800">{gt.category}</span>
                    </div>
                    <p className="text-slate-600 mt-1 italic leading-normal">
                      "{gt.description}"
                    </p>
                  </div>

                  {/* Audit Trail Timeline block */}
                  <div className="pt-2.5 border-t border-slate-100 space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">CPGRAMS Audit Trail:</span>
                    <div className="space-y-1.5 pl-2 border-l border-slate-200">
                      {gt.updates.map((up, uidx) => (
                        <div key={uidx} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <Clock className="w-3 h-3 text-[#B48A30] shrink-0" />
                          <span>{up}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
