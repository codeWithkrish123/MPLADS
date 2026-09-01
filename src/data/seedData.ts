import fs from "fs";
import path from "path";

// 1. Raw Calamities Data (12 records)
export const RAW_CALAMITIES = [
  { srNo: 1, calamityType: "National Calamity", calamityName: "Flood 2025 in Punjab", mpName: "Shri Gurjeet Singh Aujla", consentDate: "2025-12-07", consentAmount: 7067400 },
  { srNo: 2, calamityType: "National Calamity", calamityName: "Flood 2025 in Punjab", mpName: "GURMEET SINGH MEET HAYER", consentDate: "2025-11-03", consentAmount: 7500000 },
  { srNo: 3, calamityType: "National Calamity", calamityName: "Flood 2025 in Punjab", mpName: "Shri Jual Oram", consentDate: "2025-10-10", consentAmount: 10000000 },
  { srNo: 4, calamityType: "National Calamity", calamityName: "Andhra Pradesh rainfall and consequent floods - 2024", mpName: "Krishna Prasad Tenneti", consentDate: "2025-03-26", consentAmount: 1000000 },
  { srNo: 5, calamityType: "National Calamity", calamityName: "Meppadi landslides 2024", mpName: "SHAFI PARAMBIL", consentDate: "2025-03-02", consentAmount: 2500000 },
  { srNo: 6, calamityType: "State Calamity", calamityName: "Vilangad Landslides 2024", mpName: "SHAFI PARAMBIL", consentDate: "2025-03-01", consentAmount: 2500000 },
  { srNo: 7, calamityType: "National Calamity", calamityName: "Meppadi landslides 2024", mpName: "DR C N MANJUNATH", consentDate: "2025-02-17", consentAmount: 500000 },
  { srNo: 8, calamityType: "National Calamity", calamityName: "Meppadi landslides 2024", mpName: "Andimuthu Raja", consentDate: "2025-02-05", consentAmount: 2500000 },
  { srNo: 9, calamityType: "State Calamity", calamityName: "Wayanad landslides 2024", mpName: "Shri NK Premachandran", consentDate: "2024-12-07", consentAmount: 1000000 },
  { srNo: 10, calamityType: "State Calamity", calamityName: "Vilangad Landslides 2024", mpName: "Shri NK Premachandran", consentDate: "2024-12-07", consentAmount: 1000000 },
  { srNo: 11, calamityType: "State Calamity", calamityName: "Wayanad landslides 2024", mpName: "K RADHAKRISHNAN", consentDate: "2024-12-04", consentAmount: 2500000 },
  { srNo: 12, calamityType: "State Calamity", calamityName: "Natural Calamity Affected Area", mpName: "BIPLAB KUMAR DEB", consentDate: "2024-09-03", consentAmount: 2500000 },
];
