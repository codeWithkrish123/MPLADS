import fs from "fs";
import path from "path";
import { DBMPAllocation, DBCalamityConsent, DBComplianceRule, DBImplementingAgency, DBRiskAlert, DBNearDuplicate, DBUser } from "../services/db.service.js";

// Helper function to parse CSV lines with quoted values
function parseCSV(content: string): string[][] {
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const rows: string[][] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("Grand Total")) continue;

    const row: string[] = [];
    let inQuotes = false;
    let current = "";

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        row.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    if (row.length >= 3) {
      rows.push(row);
    }
  }
  return rows;
}

export function loadAllMPs(): DBMPAllocation[] {
  try {
    const csvPath = path.resolve("./src/data/mp_allocations.csv");
    if (!fs.existsSync(csvPath)) {
      console.warn("mp_allocations.csv not found at", csvPath);
      return [];
    }
    const content = fs.readFileSync(csvPath, "utf-8");
    const rows = parseCSV(content);

    return rows.map((r) => {
      const srNo = parseInt(r[0] || "0", 10);
      const state = r[1] || "Unknown";
      const mpName = r[2] || "Unknown";
      const constituency = r[3] || "Unknown";
      const rawAmt = (r[4] || "147000000").replace(/,/g, "");
      const allocatedAmount = parseFloat(rawAmt) || 147000000;

      return {
        id: `mp-${srNo}`,
        sr_no: srNo,
        state,
        mp_name: mpName,
        constituency,
        allocated_amount: allocatedAmount,
      };
    });
  } catch (err: any) {
    console.error("Error loading MPs CSV:", err.message);
    return [];
  }
}

export function loadAllCalamities(): DBCalamityConsent[] {
  try {
    const csvPath = path.resolve("./src/data/calamity_consents.csv");
    if (!fs.existsSync(csvPath)) {
      return [];
    }
    const content = fs.readFileSync(csvPath, "utf-8");
    const rows = parseCSV(content);

    return rows.map((r) => {
      const srNo = parseInt(r[0] || "0", 10);
      const calamityType = r[1] || "National Calamity";
      const calamityName = r[2] || "Disaster Relief";
      const mpName = r[3] || "Member of Parliament";
      const consentDate = r[4] || "2025-01-01";
      const rawAmt = (r[5] || "1000000").replace(/,/g, "");
      const consentAmount = parseFloat(rawAmt) || 1000000;

      return {
        id: `cal-${srNo}`,
        sr_no: srNo,
        calamity_type: calamityType,
        calamity_name: calamityName,
        mp_name: mpName,
        consent_date: consentDate,
        consent_amount: consentAmount,
      };
    });
  } catch (err: any) {
    console.error("Error loading Calamities CSV:", err.message);
    return [];
  }
}
