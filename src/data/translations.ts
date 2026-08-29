import { Language } from "../types";

export const translations = {
  en: {
    appName: "MPLADS Sentinel",
    appTagline: "Detect. Explain. Act.",
    appSubheading: "Transforming MPLADS monitoring from reactive reporting into proactive, explainable risk intelligence.",
    decisionSupportNotice: "Decision Support System — Signals require human review & administrative verification.",
    
    // Groups
    groups: {
      primaryIntel: "Main Portals & Project Lists",
      aiAnomaly: "Automated Smart Checks",
      jurisdiction: "Check by Location & Authorities",
      governance: "Official Rules & Activity Logs",
    },

    // Nav
    nav: {
      overview: "All India Projects Tracker",
      works: "Search MP Projects & Status",
      customDataset: "Download Project Records",
      alerts: "Project Irregularity Alerts",
      map: "Interactive Map of Projects",
      costAnomaly: "Check High Cost Projects",
      duplicate: "Check Double Payments",
      expenditure: "Check Progress vs Spent Money",
      delay: "Check Delay Predictions",
      analytics: "Expense Divergence",
      compliance: "Rule Violation Auditor",
      policy: "Official Scheme Guidelines",
      agencies: "Government Construction Agencies",
      stateIntel: "State-Wise Progress Tracker",
      districtIntel: "District-Wise Progress Tracker",
      mpDashboard: "Member of Parliament Portal",
      stateNodal: "State Nodal Officers Portal",
      auditLogs: "Official Government Logs",
      aiAssistant: "Help Chatbot & Voice Support",
      settings: "System Settings",
    },

    // Roles
    roles: {
      ministry: "Ministry of Statistics & PI",
      stateNodal: "State Nodal Authority",
      districtAuth: "District Authority / DM",
      mp: "Member of Parliament",
    },

    // Topbar
    topbar: {
      searchPlaceholder: "Search work ID, MP, district, or agency...",
      roleSwitch: "Active Role:",
      languageSwitch: "Language:",
      govIndia: "GOVERNMENT OF INDIA",
      mospiName: "Ministry of Statistics and Programme Implementation",
    },

    // Risk levels
    risk: {
      low: "LOW",
      medium: "MEDIUM",
      high: "HIGH",
      critical: "CRITICAL",
      riskSignal: "Risk Signal",
      potentialIrregularity: "Potential Irregularity",
      requiresReview: "Requires Review",
      anomalyDetected: "Anomaly Detected",
      highRiskPattern: "High-Risk Pattern",
      riskScore: "Risk Score",
    },

    // Actions
    actions: {
      exploreDashboard: "Explore Intelligence Dashboard",
      howItWorks: "How It Works",
      chooseWorkspace: "Choose your workspace",
      whyFlagged: "Why is this work flagged?",
      viewEvidence: "View Evidence Dossier",
      compareSimilar: "Compare Similar Works",
      viewGuideline: "View MPLADS Guideline",
      assignInvestigation: "Assign Technical Audit",
      acknowledgeAlert: "Acknowledge Signal",
      resolveSignal: "Mark Resolved",
      exportReport: "Export Government Dossier",
      filter: "Filter Records",
      searchPlaceholder: "Search by Work ID, Project Name, District, MP, or Agency (Press ⌘K)",
      resetFilters: "Reset Filters",
      exportCsv: "Export CSV",
      exportPdf: "Export Audit PDF",
      compareRecords: "Compare Records",
    },

    // Metrics
    kpi: {
      totalWorks: "Total Works Monitored",
      totalExpenditure: "Expenditure Analyzed",
      riskSignals: "Risk Signals Detected",
      criticalCases: "Critical Review Cases",
      delayedWorks: "Delayed Works",
      completionRate: "Average Completion Rate",
      annualEntitlement: "Annual Entitlement",
      recommended: "Recommended",
      sanctioned: "Sanctioned",
      utilized: "Utilized",
      atRisk: "Flagged at Risk",
    },

    // Table columns
    table: {
      workId: "Work ID",
      workName: "Work / Asset Name",
      category: "Category",
      agency: "Implementing Agency",
      estimatedCost: "Estimated / Sanctioned",
      expenditure: "Expenditure",
      physicalProgress: "Physical %",
      financialProgress: "Financial %",
      expectedCompletion: "Target Date",
      predictedCompletion: "Predicted Date",
      risk: "Risk Level",
      status: "Administrative Status",
      actions: "Action",
    },
  },
  hi: {
    appName: "सांसद निधि प्रहरी (MPLADS Sentinel)",
    appTagline: "पहचानें। समझें। समाधान करें।",
    appSubheading: "सांसद स्थानीय क्षेत्र विकास योजना (MPLADS) की निगरानी को प्रतिक्रियात्मक से सक्रिय, व्याख्यात्मक जोखिम आसूचना में रूपांतरित करना।",
    decisionSupportNotice: "निर्णय सहायता प्रणाली — संकेतों की प्रशासनिक एवं स्थलीय समीक्षा अनिवार्य है।",

    // Groups
    groups: {
      primaryIntel: "मुख्य पोर्टल और प्रोजेक्ट्स की सूची",
      aiAnomaly: "ऑटोमैटिक स्मार्ट चेक्स (गड़बड़ी जांच)",
      jurisdiction: "स्थान और अधिकारियों के अनुसार देखें",
      governance: "आधिकारिक नियम और सरकारी लॉग",
    },
    
    // Nav
    nav: {
      overview: "पूरे भारत के प्रोजेक्ट्स का विवरण",
      works: "सांसद निधि प्रोजेक्ट्स और उनकी स्थिति खोजें",
      customDataset: "प्रोजेक्ट्स सूची देखें और डाउनलोड करें",
      alerts: "काम में गड़बड़ियां और शिकायतें",
      map: "मानचित्र (नक्शे) पर प्रोजेक्ट्स देखें",
      costAnomaly: "अधिक खर्च वाले प्रोजेक्ट्स की जांच",
      duplicate: "दोहरे भुगतान व दोहराव की जांच",
      expenditure: "काम की गति बनाम खर्च पैसा",
      delay: "देरी होने वाले प्रोजेक्ट्स का अनुमान",
      analytics: "लागत व प्रगति अंतर",
      compliance: "सरकारी नियमों की उल्लंघन जांच",
      policy: "सांसद निधि के सरकारी नियम",
      agencies: "काम कराने वाली सरकारी एजेंसियां",
      stateIntel: "राज्यों के काम और उनका प्रदर्शन",
      districtIntel: "जिलों के काम और उनका प्रदर्शन",
      mpDashboard: "संसद सदस्य (MP) पोर्टल",
      stateNodal: "राज्य नोडल अधिकारियों का पोर्टल",
      auditLogs: "आधिकारिक सरकारी लॉग और विवरण",
      aiAssistant: "मददगार चैटबॉट और सहायता",
      settings: "प्रणाली सेटिंग्स",
    },

    // Roles
    roles: {
      ministry: "सांख्यिकी एवं का.का. मंत्रालय",
      stateNodal: "राज्य नोडल प्राधिकरण",
      districtAuth: "जिला प्राधिकारी / डीएम",
      mp: "संसद सदस्य (सांसद)",
    },

    // Topbar
    topbar: {
      searchPlaceholder: "कार्य आईडी, सांसद, जिला या एजेंसी खोजें...",
      roleSwitch: "सक्रिय भूमिका:",
      languageSwitch: "भाषा:",
      govIndia: "भारत सरकार",
      mospiName: "सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय",
    },

    // Risk levels
    risk: {
      low: "न्यूनतम जोखिम (LOW)",
      medium: "मध्यम जोखिम (MEDIUM)",
      high: "उच्च जोखिम (HIGH)",
      critical: "अति-संवेदनशील (CRITICAL)",
      riskSignal: "जोखिम संकेत",
      potentialIrregularity: "संभावित विसंगति",
      requiresReview: "पुनरीक्षण आवश्यक",
      anomalyDetected: "असामान्य प्रतिरूप",
      highRiskPattern: "उच्च जोखिम पैटर्न",
      riskScore: "जोखिम सूचकांक",
    },

    // Actions
    actions: {
      exploreDashboard: "आसूचना डैशबोर्ड देखें",
      howItWorks: "कार्यप्रणाली जानें",
      chooseWorkspace: "अपना कार्यक्षेत्र चुनें",
      whyFlagged: "यह कार्य क्यों चिन्हित हुआ?",
      viewEvidence: "साक्ष्य विवरण देखें",
      compareSimilar: "समान कार्यों की तुलना करें",
      viewGuideline: "सांसद निधि दिशा-निर्देश देखें",
      assignInvestigation: "तकनीकी जांच नियुक्त करें",
      acknowledgeAlert: "संकेत संज्ञान में लें",
      resolveSignal: "निस्तारित करें",
      exportReport: "शासकीय विवरणिका डाउनलोड करें",
      filter: "फ़िल्टर लागू करें",
      searchPlaceholder: "कार्य आईडी, नाम, जिला, सांसद या एजेंसी खोजें (⌘K)",
      resetFilters: "फ़िल्टर हटाएं",
      exportCsv: "CSV निर्यात",
      exportPdf: "ऑडिट PDF निर्यात",
      compareRecords: "अभिलेखों की तुलना",
    },

    // Metrics
    kpi: {
      totalWorks: "कुल निगरानी अधीन कार्य",
      totalExpenditure: "विश्लेषित कुल व्यय",
      riskSignals: "पहचाने गए जोखिम संकेत",
      criticalCases: "गंभीर पुनरीक्षण मामले",
      delayedWorks: "विलंबित कार्य",
      completionRate: "औसत पूर्णता दर",
      annualEntitlement: "वार्षिक पात्रता",
      recommended: "अनुशंसित राशि",
      sanctioned: "स्वीकृत राशि",
      utilized: "उपयोग की गई राशि",
      atRisk: "जोखिम में चिन्हित",
    },

    // Table columns
    table: {
      workId: "कार्य आईडी",
      workName: "कार्य / परिसंपत्ति नाम",
      category: "श्रेणी",
      agency: "कार्यान्वयन एजेंसी",
      estimatedCost: "स्वीकृत लागत",
      expenditure: "वास्तविक व्यय",
      physicalProgress: "भौतिक प्रगति %",
      financialProgress: "वित्तीय प्रगति %",
      expectedCompletion: "लक्षित तिथि",
      predictedCompletion: "पूर्वानुमानित तिथि",
      risk: "जोखिम स्तर",
      status: "प्रशासनिक स्थिति",
      actions: "कार्रवाई",
    },
  },
};

export const getTranslation = (lang: Language) => translations[lang] || translations.en;

// Helper translations for data values
export const categoryTranslations: Record<string, string> = {
  "Community Infrastructure": "सामुदायिक अवसंरचना",
  "Drinking Water Facility": "पेयजल सुविधा",
  "Education Infrastructure": "शिक्षा अवसंरचना",
  "Healthcare Infrastructure": "स्वास्थ्य सेवा अवसंरचना",
  "Road Infrastructure": "सड़क अवसंरचना",
  "Irrigation & Water Bodies": "सिंचाई एवं जल स्रोत",
  "Rural Sanitation": "ग्रामीण स्वच्छता",
  "Solar & Energy": "सौर एवं अक्षय ऊर्जा",
  "Community Infrastructure & Sports": "सामुदायिक भवन व खेल अवसंरचना",
  "Water Conservation & Sanitation": "जल संरक्षण व स्वच्छता",
  "Healthcare & Hospital Facilities": "स्वास्थ्य केंद्र व अस्पताल सुविधा",
  "Roads, Bridges & Connectivity": "सड़क, पुल व ग्रामीण संपर्क",
  "Cost Anomaly": "लागत विसंगति",
  "Duplicate": "समान कार्य पहचान",
  "Progress Mismatch": "प्रगति विसंगति",
  "Delay Risk": "विलंब जोखिम",
  "Compliance": "अनुपालन निर्देश",
};

export const statusTranslations: Record<string, string> = {
  "Approved": "स्वीकृत",
  "Sanctioned": "स्वीकृत",
  "In Progress": "प्रगति पर",
  "Completed": "पूर्ण (सत्यापित)",
  "Delayed": "विलंबित",
  "Halted": "कार्य स्थगित",
  "Pending Audit": "ऑडिट लंबित",
  "Under Audit": "जांच जारी",
  "Under Review": "पुनरीक्षण जारी",
  "Action Required": "कार्रवाई आवश्यक",
  "Recommended": "अनुशंसित",
  "Resolved": "निस्तारित",
  "Investigating": "जांच जारी",
  "Open": "सक्रिय (Open)",
  "Acknowledged": "संज्ञान में लिया गया",
};

export const severityTranslations: Record<string, string> = {
  "CRITICAL": "अति गंभीर",
  "HIGH": "उच्च जोखिम",
  "MEDIUM": "मध्यम जोखिम",
  "LOW": "कम जोखिम",
};

export const districtTranslations: Record<string, string> = {
  "Ghaziabad": "गाज़ियाबाद",
  "Patna": "पटना",
  "Varanasi": "वाराणसी",
  "Thane": "ठाणे",
  "Bengaluru Rural": "बेंगलुरु ग्रामीण",
  "Jaipur": "जयपुर",
  "Kamrup Metropolitan": "कामरूप महानगर",
  "Indore": "इंदौर",
  "Lucknow": "लखनऊ",
  "Uttar Pradesh": "उत्तर प्रदेश",
  "Bihar": "बिहार",
  "Maharashtra": "महाराष्ट्र",
  "Karnataka": "कर्नाटक",
  "Rajasthan": "राजस्थान",
  "Assam": "असम",
  "Madhya Pradesh": "मध्य प्रदेश",
  "Delhi": "दिल्ली",
};

export const agencyTranslations: Record<string, string> = {
  "Public Works Dept (PWD) UP": "लोक निर्माण विभाग (PWD) यूपी",
  "State Rural Water Supply Organization": "राज्य ग्रामीण जल आपूर्ति संगठन",
  "District Urban Development Agency (DUDA)": "जिला नगरीय विकास अभिकरण (DUDA)",
  "Zila Parishad Engineering Wing": "जिला परिषद अभियांत्रिकी विंग",
  "State Road Development Corporation": "राज्य सड़क विकास निगम",
  "Public Health Engineering Dept (PHED)": "लोक स्वास्थ्य यांत्रिकी विभाग (PHED)",
};

export const translateText = (text: string | undefined, lang: Language): string => {
  if (!text) return "";
  if (lang !== "hi") return text;
  return (
    categoryTranslations[text] ||
    statusTranslations[text] ||
    severityTranslations[text] ||
    districtTranslations[text] ||
    agencyTranslations[text] ||
    text
  );
};
