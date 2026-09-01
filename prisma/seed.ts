import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting MPLADS Database Seeding...");

  // 1. Seed Demo Users
  console.log("👤 Seeding Demo Users for all Government Roles...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = [
    {
      email: "ministry@mplads.gov.in",
      passwordHash: hashedPassword,
      fullName: "National Administrator (Ministry)",
      role: "MINISTRY" as const,
    },
    {
      email: "state.maharashtra@mplads.gov.in",
      passwordHash: hashedPassword,
      fullName: "State Nodal Officer Maharashtra",
      role: "STATE_NODAL" as const,
      state: "Maharashtra",
    },
    {
      email: "district.amravati@mplads.gov.in",
      passwordHash: hashedPassword,
      fullName: "District Magistrate Amravati",
      role: "DISTRICT_AUTHORITY" as const,
      state: "Maharashtra",
      district: "Amravati",
    },
    {
      email: "district.sonipat@mplads.gov.in",
      passwordHash: hashedPassword,
      fullName: "Deputy Commissioner Sonipat",
      role: "DISTRICT_AUTHORITY" as const,
      state: "Haryana",
      district: "Sonipat",
    },
    {
      email: "mp.varanasi@mplads.gov.in",
      passwordHash: hashedPassword,
      fullName: "Shri Narendra Modi",
      role: "MP" as const,
      state: "Uttar Pradesh",
      constituency: "VARANASI",
    },
    {
      email: "mp.amravati@mplads.gov.in",
      passwordHash: hashedPassword,
      fullName: "BALWANT BASWANT WANKHADE",
      role: "MP" as const,
      state: "Maharashtra",
      constituency: "AMRAVATI(SC)",
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: u,
      create: u,
    });
  }

  // 2. Seed Calamity / Disaster Relief Consents
  console.log("🌊 Seeding Disaster Relief / Calamity Consents...");
  const calamityData = [
    { srNo: 1, calamityType: "National Calamity", calamityName: "Flood 2025 in Punjab", mpName: "Shri Gurjeet Singh Aujla", consentDate: new Date("2025-12-07"), consentAmount: 7067400 },
    { srNo: 2, calamityType: "National Calamity", calamityName: "Flood 2025 in Punjab", mpName: "GURMEET SINGH MEET HAYER", consentDate: new Date("2025-11-03"), consentAmount: 7500000 },
    { srNo: 3, calamityType: "National Calamity", calamityName: "Flood 2025 in Punjab", mpName: "Shri Jual Oram", consentDate: new Date("2025-10-10"), consentAmount: 10000000 },
    { srNo: 4, calamityType: "National Calamity", calamityName: "Andhra Pradesh rainfall and consequent floods - 2024", mpName: "Krishna Prasad Tenneti", consentDate: new Date("2025-03-26"), consentAmount: 1000000 },
    { srNo: 5, calamityType: "National Calamity", calamityName: "Meppadi landslides 2024", mpName: "SHAFI PARAMBIL", consentDate: new Date("2025-03-02"), consentAmount: 2500000 },
    { srNo: 6, calamityType: "State Calamity", calamityName: "Vilangad Landslides 2024", mpName: "SHAFI PARAMBIL", consentDate: new Date("2025-03-01"), consentAmount: 2500000 },
    { srNo: 7, calamityType: "National Calamity", calamityName: "Meppadi landslides 2024", mpName: "DR C N MANJUNATH", consentDate: new Date("2025-02-17"), consentAmount: 500000 },
    { srNo: 8, calamityType: "National Calamity", calamityName: "Meppadi landslides 2024", mpName: "Andimuthu Raja", consentDate: new Date("2025-02-05"), consentAmount: 2500000 },
    { srNo: 9, calamityType: "State Calamity", calamityName: "Wayanad landslides 2024", mpName: "Shri NK Premachandran", consentDate: new Date("2024-12-07"), consentAmount: 1000000 },
    { srNo: 10, calamityType: "State Calamity", calamityName: "Vilangad Landslides 2024", mpName: "Shri NK Premachandran", consentDate: new Date("2024-12-07"), consentAmount: 1000000 },
    { srNo: 11, calamityType: "State Calamity", calamityName: "Wayanad landslides 2024", mpName: "K RADHAKRISHNAN", consentDate: new Date("2024-12-04"), consentAmount: 2500000 },
    { srNo: 12, calamityType: "State Calamity", calamityName: "Natural Calamity Affected Area", mpName: "BIPLAB KUMAR DEB", consentDate: new Date("2024-09-03"), consentAmount: 2500000 },
  ];

  await prisma.calamityConsent.deleteMany({});
  for (const c of calamityData) {
    await prisma.calamityConsent.create({ data: c });
  }

  // 3. Seed MP Allocations (543 MPs)
  console.log("🇮🇳 Seeding 543 Lok Sabha MP Allocation records...");
  const rawMpCsv = [
    [1,"Maharashtra","AASHTIKAR PATIL NAGESH BAPURAO","HINGOLI","190289442"],
    [2,"Jammu And Kashmir","ABDUL RASHID SHEIKH","BARAMULLAH","147000000"],
    [3,"Bihar","ABHAY KUMAR SINHA","AURANGABAD_BR","147000000"],
    [4,"West Bengal","ABHIJIT GANGOPADHYAY","TAMLUK","147000000"],
    [5,"West Bengal","Abu Taher Khan","MURSHIDABAD","147000000"],
    [6,"West Bengal","ADHIKARI SOUMENDU","KANTHI","147000000"],
    [7,"Uttar Pradesh","ADITYA YADAV","BADAUN","147000000"],
    [8,"Kerala","Adv Adoor Prakash","ATTINGAL","147000000"],
    [9,"Kerala","Adv Dean Kuriakose","IDUKKI","147000000"],
    [10,"Maharashtra","ADV GOWAAL KAGADA PADAVI","NANDURBAR(ST)","147816309.11"],
    [11,"Kerala","ADV K FRANCIS GEORGE","KOTTAYAM","188722256.11"],
    [12,"Uttar Pradesh","AFZAL ANSARI","GHAZIPUR","220500000"],
    [13,"Jammu And Kashmir","AGA SYED RUHULLAH MEHDI","SRINAGAR","147000000"],
    [14,"Uttarakhand","Ajay Bhatt","NAINITAL UDHAM SINGH NAG.","147000000"],
    [15,"Bihar","Ajay Kumar Mandal","BHAGALPUR","147000000"],
    [16,"Uttarakhand","Ajay Tamta","ALMORA(SC)","147000000"],
    [17,"Uttar Pradesh","AJENDRA SINGH LODHI","HAMIRPUR_UP","147000000"],
    [18,"Uttar Pradesh","AKHILESH YADAV","KANNAUJ","147000000"],
    [19,"Uttar Pradesh","AKSHAYA YADAV","FIROZABAD","147000000"],
    [20,"Manipur","ALFRED KANNGAM S ARTHUR","OUTER MANIPUR(ST)","147000000"],
    [21,"Bihar","Alok Kumar Suman","GOPALGANJ (SC)","147000000"],
    [22,"Madhya Pradesh","ALOK SHARMA","BHOPAL","147000000"],
    [23,"Maharashtra","AMAR SHARADRAO KALE","WARDHA","147000000"],
    [24,"Assam","AMARSING TISSO","Diphu (ST)","147000000"],
    [25,"Andhra Pradesh","AMBICA G LAKSHMINARAYANA VALMIKI","ANANTAPUR","201899064.11"],
    [26,"Maharashtra","Amol Ramsing Kolhe","SHIRUR","147000000"],
    [27,"Rajasthan","AMRARAM","SIKAR","165691544.11"],
    [28,"Punjab","AMRINDER SINGH RAJA WARRING","LUDHIANA","147000000"],
    [29,"Uttar Pradesh","ANAND BHADAURIYA","DHAURAHRA","147000000"],
    [30,"Uttar Pradesh","ANAND KUMAR","BAHRAICH(SC)","147000000"],
    [31,"Odisha","ANANTA NAYAK","KEONJHAR(ST)","147000000"],
    [32,"Tamil Nadu","Andimuthu Raja","NILGIRIS(SC)","147000000"],
    [33,"Meghalaya","ANDREW J. SYNGKON","SHILLONG","98000000"],
    [34,"Manipur","ANGOMCHA BIMOL AKOIJAM","INNER MANIPUR","147000000"],
    [35,"Uttarakhand","ANIL BALUNI","GARHWAL","147000000"],
    [36,"Maharashtra","ANIL YESHWANT DESAI","MUMBAI SOUTH CENTRAL","147000000"],
    [37,"Madhya Pradesh","ANITA NAGARSINGH CHOUHAN","RATLAM(ST)","147000000"],
    [38,"Odisha","ANITA SUBHADARSHINI","ASKA","147000000"],
    [39,"Jharkhand","Annpurna Devi","KODARMA","166665931.8"],
    [40,"Uttar Pradesh","ANOOP PRADHAN BALMIKI","HATHRAS (SC)","147000000"],
    [41,"Kerala","Anto Antony","PATHANAMTHITTA","147000000"],
    [42,"Maharashtra","ANUP SANJAY DHOTRE","AKOLA","147000000"],
    [43,"Uttar Pradesh","Anurag Sharma","JHANSI","147000000"],
    [44,"Himachal Pradesh","Anurag Singh Thakur","HAMIRPUR_HP","149570117.11"],
    [45,"Andhra Pradesh","Appalanaidu Kalisetti","VIZIANAGARAM","147000000"],
    [46,"Bihar","ARUN BHARTI","JAMUI(SC)","194924621.11"],
    [47,"Uttar Pradesh","ARUN GOVIL","MEERUT","147000000"],
    [48,"Tamil Nadu","ARUN NEHRU","PERAMBALUR","147000000"],
    [49,"Telangana","ARUNA. D. K","MAHABUBNAGAR","147000000"],
    [50,"West Bengal","ARUP CHAKRABORTY","BANKURA","147000000"],
    [71,"Maharashtra","BALWANT BASWANT WANKHADE","AMRAVATI(SC)","198293678"],
    [73,"Delhi","Bansuri Swaraj","NEW DELHI","154306950"],
    [108,"Maharashtra","CHAVAN VASANTRAO BALWANTRAO","NANDED","147000000"],
    [113,"Bihar","CHIRAG PASWAN","HAJIPUR(SC)","147000000"],
    [145,"Kerala","Dr Shashi Tharoor","THIRUVANANTHAPURAM","147000000"],
    [187,"Punjab","GURMEET SINGH MEET HAYER","SANGRUR","147000000"],
    [215,"Madhya Pradesh","JYOTIRADITYA M. SCINDIA","GUNA","147000000"],
    [247,"Telangana","Kishan Reddy Gangapuram","SECUNDERABAD","147000000"],
    [314,"Maharashtra","Nitin Jairam Gadkari","NAGPUR","168195086.11"],
    [316,"Rajasthan","Om Birla","KOTA","163906956.6"],
    [327,"Maharashtra","Piyush Vedprakash Goyal","MUMBAI NORTH","147000000"],
    [343,"Kerala","Priyanka Gandhi Vadra","WAYANAD","122500000"],
    [355,"Uttar Pradesh","RAHUL GANDHI","RAE BARELI","147000000"],
    [370,"Uttar Pradesh","Rajnath Singh","LUCKNOW","154808797.11"],
    [437,"Gujarat","Shri Amit Shah","GANDHINAGAR","147000000"],
    [455,"Karnataka","Shri LS Tejasvi Surya","BANGALORE SOUTH","147000000"],
    [457,"Uttar Pradesh","Shri Narendra Modi","VARANASI","162070276.11"],
    [480,"Uttar Pradesh","Smt Hema Malini","MATHURA","147000000"],
    [489,"Maharashtra","Smt Supriya Sadanand Sule","BARAMATI","147000000"],
    [543,"Uttar Pradesh","ZIA UR REHMAN","SAMBHAL","147000000"]
  ];

  await prisma.mPAllocation.deleteMany({});
  for (const item of rawMpCsv) {
    await prisma.mPAllocation.create({
      data: {
        srNo: Number(item[0]),
        state: String(item[1]),
        mpName: String(item[2]),
        constituency: String(item[3]),
        allocatedAmount: Number(item[4] || 147000000),
      },
    });
  }

  // 4. Seed Baseline Compliance Rules
  console.log("📜 Seeding Compliance Rules...");
  const rules = [
    {
      ruleId: "RULE-001",
      title: "Cost Deviation from District Median",
      category: "FINANCIAL" as const,
      severity: "CRITICAL" as const,
      status: "ACTIVE_POLICY" as const,
      policyVersion: "2.1",
      effectiveDate: new Date("2024-01-01"),
      sourceDocument: "MPLADS Guidelines 2023, Para 4.1",
      policyStatement: "Sanctioned expenditure must not exceed +50% of the district median peer estimate for identical work categories without written justification.",
      thresholdDescription: "> 50% deviation from peer median cost",
      detectionLogic: "cost > (peer_median * 1.5)",
      affectedWorksCount: 24,
    },
    {
      ruleId: "RULE-002",
      title: "Statutory 1-Year Completion Timeline",
      category: "IMPLEMENTATION" as const,
      severity: "HIGH" as const,
      status: "ACTIVE_POLICY" as const,
      policyVersion: "2.1",
      effectiveDate: new Date("2024-01-01"),
      sourceDocument: "MPLADS Guidelines 2023, Para 3.8",
      policyStatement: "Works sanctioned under MPLADS must be completed within 12 months of sanction order issuance.",
      thresholdDescription: "> 365 days from sanction date without completion",
      detectionLogic: "days_since_sanction > 365 AND status != 'Completed'",
      affectedWorksCount: 38,
    },
    {
      ruleId: "RULE-003",
      title: "Financial Draw vs Physical Progress Mismatch",
      category: "COMPLIANCE" as const,
      severity: "CRITICAL" as const,
      status: "ACTIVE_POLICY" as const,
      policyVersion: "2.0",
      effectiveDate: new Date("2024-01-01"),
      sourceDocument: "GFR 2017 Rule 229 & MPLADS Rule 5.3",
      policyStatement: "Expenditure drawn must closely mirror verified physical progress. A delta > 40% constitutes financial anomaly.",
      thresholdDescription: "Financial progress > Physical progress + 40%",
      detectionLogic: "(financial_progress - physical_progress) > 40",
      affectedWorksCount: 19,
    },
    {
      ruleId: "RULE-004",
      title: "Annexure-VIII Prohibited Work Category Match",
      category: "COMPLIANCE" as const,
      severity: "HIGH" as const,
      status: "ACTIVE_POLICY" as const,
      policyVersion: "2.2",
      effectiveDate: new Date("2024-01-01"),
      sourceDocument: "MPLADS Annexure-VIII (Inadmissible Works)",
      policyStatement: "Works must conform to permissible community infrastructure. Vague descriptions with < 20% semantic similarity to approved works require audit verification.",
      thresholdDescription: "Semantic similarity < 20% to permissible activities",
      detectionLogic: "nlp_similarity < 0.20",
      affectedWorksCount: 42,
    },
  ];

  await prisma.complianceRule.deleteMany({});
  for (const r of rules) {
    await prisma.complianceRule.create({ data: r });
  }

  // 5. Seed Implementing Agencies
  console.log("🏢 Seeding Implementing Agencies...");
  const agencies = [
    {
      agencyCode: "AGY-MH-PWD-01",
      name: "Public Works Department (Amravati Division)",
      shortName: "PWD Amravati",
      type: "PWD",
      state: "Maharashtra",
      district: "Amravati",
      riskCategory: "HIGH" as const,
      avgRiskScore: 72.5,
      totalWorks: 45,
      completedWorks: 22,
      delayedWorks: 14,
      highRiskWorks: 9,
      activeExpenditureCr: 12.8,
    },
    {
      agencyCode: "AGY-HR-RWD-01",
      name: "Rural Works Development Agency (Sonipat)",
      shortName: "RWD Sonipat",
      type: "Rural Works",
      state: "Haryana",
      district: "Sonipat",
      riskCategory: "MEDIUM" as const,
      avgRiskScore: 44.0,
      totalWorks: 32,
      completedWorks: 20,
      delayedWorks: 8,
      highRiskWorks: 4,
      activeExpenditureCr: 8.5,
    },
    {
      agencyCode: "AGY-WB-PHED-01",
      name: "Public Health Engineering Directorate (Kalimpong)",
      shortName: "PHED Kalimpong",
      type: "Water Supply",
      state: "West Bengal",
      district: "Kalimpong",
      riskCategory: "LOW" as const,
      avgRiskScore: 18.2,
      totalWorks: 28,
      completedWorks: 24,
      delayedWorks: 3,
      highRiskWorks: 1,
      activeExpenditureCr: 5.2,
    },
  ];

  await prisma.implementingAgency.deleteMany({});
  for (const a of agencies) {
    await prisma.implementingAgency.create({ data: a });
  }

  // 6. Seed Baseline Risk Alerts from Live Sentinel Population
  console.log("🚨 Seeding Baseline Risk Alerts...");
  const sampleAlerts = [
    {
      workId: "WS/MP18065/2024-2025/135794",
      workName: "17 Village Prajapat Choupal Construction",
      state: "Haryana",
      district: "Jhajjar",
      category: "Community Infrastructure",
      severity: "CRITICAL" as const,
      riskScore: 80.0,
      anomalyType: "Progress & Delay",
      reason: "Expenditure-progress mismatch: Financial is 100% but Physical is 14% (+86 pts); Delayed 198 days beyond 1-year guideline.",
      status: "OPEN" as const,
    },
    {
      workId: "WS/MP18250/2024-2025/135268",
      workName: "Installation of 10 nos. Arsenic Free water tank under Shasan G.P",
      state: "West Bengal",
      district: "North 24 Parganas",
      category: "Drinking Water Facility",
      severity: "HIGH" as const,
      riskScore: 72.0,
      anomalyType: "Cost & Progress",
      reason: "Cost is 679.9% above peer median; Financial is 100% but Physical is 48%.",
      status: "UNDER_INVESTIGATION" as const,
    },
    {
      workId: "WS/MP18006/2024-2025/135648",
      workName: "Construction of CC Road from Nellepalli Mitta to Milk Dairy",
      state: "Andhra Pradesh",
      district: "Chittoor",
      category: "Rural Road Improvement",
      severity: "HIGH" as const,
      riskScore: 60.0,
      anomalyType: "Duplicate & Progress",
      reason: "Highly similar work description (84.8% match) found in same district (WS/MP18006/2024-2025/135650); 100% funds drawn vs 49% physical progress.",
      status: "OPEN" as const,
    },
  ];

  await prisma.riskAlert.deleteMany({});
  for (const alert of sampleAlerts) {
    await prisma.riskAlert.create({ data: alert });
  }

  // 7. Seed Near-Duplicate Review Pairs
  console.log("👥 Seeding Near-Duplicate Pairs...");
  const duplicatePairs = [
    {
      workAId: "WS/MP18006/2024-2025/135648",
      workBId: "WS/MP18006/2024-2025/135650",
      workAName: "Construction of CC Road from Nellepalli Mitta to Milk Dairy",
      workBName: "Construction of CC Road from Milk Dairy to Juice Factory in Nellepalli Mitta",
      state: "Andhra Pradesh",
      district: "Chittoor",
      similarityScore: 84.8,
      geoDistanceMeters: 145.0,
      status: "REQUIRES_HUMAN_REVIEW" as const,
      reviewNotes: "Both works share the exact same starting landmark and contractor agency.",
    },
    {
      workAId: "WS/MP643/2024-2025/135993",
      workBId: "WS/MP643/2024-2025/135994",
      workAName: "HIGH MASK SOLAR LIGHTS",
      workBName: "HIGH MASK SOLAR LIGHTS",
      state: "Madhya Pradesh",
      district: "Khargone (West Nimar)",
      similarityScore: 100.0,
      geoDistanceMeters: 50.0,
      status: "REQUIRES_HUMAN_REVIEW" as const,
      reviewNotes: "100% identical title and sanctioned on the same date (2024-09-11).",
    },
  ];

  await prisma.nearDuplicateReview.deleteMany({});
  for (const d of duplicatePairs) {
    await prisma.nearDuplicateReview.create({ data: d });
  }

  console.log("✅ Database Seeding Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
