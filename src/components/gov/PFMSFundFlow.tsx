import React, { useState } from "react";
import { 
  TrendingUp, 
  ArrowRight, 
  FileCheck2, 
  Camera, 
  Sparkles, 
  Building2, 
  ChevronRight, 
  IndianRupee, 
  HelpCircle 
} from "lucide-react";

interface PFMSFundFlowProps {
  language?: "en" | "hi";
}

export const PFMSFundFlow: React.FC<PFMSFundFlowProps> = ({ language = "en" }) => {
  const isHindi = language === "hi";
  const [activeStage, setActiveStage] = useState<number>(2); // Default to Tranche 1 release

  const stages = [
    {
      id: 0,
      title: isHindi ? "1. प्रस्ताव एवं अनुशंसा" : "1. MP Recommendation",
      status: "completed",
      description: isHindi ? "सांसदों द्वारा जिला प्राधिकरण को ₹5 करोड़ के कार्यों की सूची प्रस्तुत करना।" : "MP submits works proposal of up to ₹5 Crore per annum to District Authority.",
      stat: "₹142.8 Cr Recommended",
      color: "emerald"
    },
    {
      id: 1,
      title: isHindi ? "2. प्रशासनिक एवं तकनीकी स्वीकृति" : "2. Administrative & Technical Sanction",
      status: "completed",
      description: isHindi ? "जिला कलेक्टर / राज्य नोडल द्वारा कार्य व्यवहार्यता व तकनीकी ऑडिट।" : "Feasibility validation & structural pricing audits completed by PWD engineers.",
      stat: "₹128.5 Cr Sanctioned (90%)",
      color: "emerald"
    },
    {
      id: 2,
      title: isHindi ? "3. प्रथम किश्त प्रेषण (₹2.5 करोड़)" : "3. 1st Tranche Release (₹2.5 Cr)",
      status: "active",
      description: isHindi ? "केंद्रीय स्तर (PFMS) से राज्य नोडल खाते में निधि का डिजिटल अंतरण।" : "Direct digital transfer from Central MoSPI account to state holding pools.",
      stat: "₹114.2 Cr Disbursed (80%)",
      color: "blue"
    },
    {
      id: 3,
      title: isHindi ? "4. भू-स्थानिक और भौतिक ऑडिट" : "4. ISRO Bhuvan Geo-Tagging & Physical Audit",
      status: "pending",
      description: isHindi ? "इसरो भुवन प्लेटफॉर्म पर 'प्रारंभ होने से पूर्व' व 'निर्माण के दौरान' तस्वीरों का सत्यापन।" : "Three-stage satellite geotagging validation of progress prior to secondary tranche release.",
      stat: "72% Assets Geotagged",
      color: "slate"
    },
    {
      id: 4,
      title: isHindi ? "5. द्वितीय किश्त प्रेषण (₹2.5 करोड़)" : "5. 2nd Tranche Release (₹2.5 Cr)",
      status: "pending",
      description: isHindi ? "60% उपयोगिता प्रमाणपत्र (UC) जमा होने व ऑडिट मंजूरी के बाद जारी।" : "Conditional dispatch upon submission of 60% certified utilization certificates (UCs).",
      stat: "₹48.6 Cr Disbursed (34%)",
      color: "slate"
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold rounded font-mono uppercase tracking-wider">
            {isHindi ? "पीएफएमएस डिजिटल निधि प्रवाह पाइपलाइन" : "PFMS Digital Fund Flow Pipeline"}
          </span>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mt-1 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#B48A30]" />
            {isHindi ? "₹5 करोड़ योजना आवंटन चक्र" : "₹5 Crore Central Allocation Lifecycle"}
          </h3>
          <p className="text-xs text-slate-500">
            {isHindi 
              ? "सांसद निधि योजना (MPLADS) में निधि आवंटन, तकनीकी स्वीकृति तथा उपयोगिता प्रमाणपत्र (UC) जारी होने की चरणबद्ध प्रगति।"
              : "Tranche-by-tranche validation mechanism mapping real-time treasury dispatches to ground-level asset completion."}
          </p>
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-center bg-slate-50 border border-slate-100 p-1 rounded-md">
          <span className="text-[10px] font-bold uppercase text-slate-500 pl-1">PFMS Link Status:</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-mono font-bold text-emerald-700">ONLINE</span>
        </div>
      </div>

      {/* Pipeline Stepper Horizontal Block */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3.5 relative">
        {stages.map((st, idx) => {
          const isActive = activeStage === st.id;
          const isCompleted = st.status === "completed";
          
          return (
            <div 
              key={st.id}
              onClick={() => setActiveStage(st.id)}
              className={`p-3.5 border rounded-lg transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2 select-none relative ${
                isActive 
                  ? "bg-blue-50/50 border-blue-400 ring-1 ring-blue-400 shadow-sm"
                  : isCompleted
                  ? "bg-emerald-50/20 border-emerald-200 hover:bg-slate-50"
                  : "bg-white border-slate-200 hover:bg-slate-50/50"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isCompleted 
                      ? "bg-emerald-100 text-emerald-800" 
                      : isActive 
                      ? "bg-blue-100 text-blue-800"
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    {isCompleted ? (isHindi ? "पूर्ण" : "Completed") : isActive ? (isHindi ? "सक्रिय" : "Active") : (isHindi ? "लंबित" : "Pending")}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">Step 0{st.id + 1}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 font-heading leading-tight pt-1">
                  {st.title}
                </h4>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="text-[10px] font-mono font-extrabold text-[#B48A30] flex items-center gap-1">
                  <IndianRupee className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{st.stat}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Stage Detail Panel */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Stage Description / कार्य क्षेत्र विवरण
            </span>
            <span>•</span>
            <span className="text-xs font-bold text-slate-700 font-heading">
              {stages[activeStage].title}
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-sans">
            {stages[activeStage].description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
          <div className="p-3 bg-white border border-slate-200 rounded-md shadow-2xs flex-1 md:flex-initial">
            <div className="text-[10px] text-slate-400 font-mono uppercase font-bold">MoSPI Audit Checklist</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-slate-800">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>GIGW 3.0 Standard Verified</span>
            </div>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-md shadow-2xs flex-1 md:flex-initial">
            <div className="text-[10px] text-slate-400 font-mono uppercase font-bold">ISRO Bhuvan Tracking</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-slate-800">
              <Camera className="w-4 h-4 text-[#B48A30]" />
              <span>Auto Geotag Sync Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
