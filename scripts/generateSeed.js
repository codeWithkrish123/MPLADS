import fs from "fs";
import path from "path";

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("Grand Total")) continue;
    const row = [];
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

const mpCsv = fs.readFileSync("./src/data/mp_allocations.csv", "utf-8");
const mpRows = parseCSV(mpCsv);
const mps = mpRows.map((r) => ({
  id: "mp-" + r[0],
  sr_no: parseInt(r[0] || "0", 10),
  state: r[1] || "Unknown",
  mp_name: r[2] || "Unknown",
  constituency: r[3] || "Unknown",
  allocated_amount: parseFloat((r[4] || "147000000").replace(/,/g, "")) || 147000000,
}));

const calCsv = fs.readFileSync("./src/data/calamity_consents.csv", "utf-8");
const calRows = parseCSV(calCsv);
const calamities = calRows.map((r) => ({
  id: "cal-" + r[0],
  sr_no: parseInt(r[0] || "0", 10),
  calamity_type: r[1] || "National Calamity",
  calamity_name: r[2] || "Disaster Relief",
  mp_name: r[3] || "Member of Parliament",
  consent_date: r[4] || "2025-01-01",
  consent_amount: parseFloat((r[5] || "1000000").replace(/,/g, "")) || 1000000,
}));

const outCode =
  "export const SEEDED_MPS = " +
  JSON.stringify(mps, null, 2) +
  ";\n\n" +
  "export const SEEDED_CALAMITIES = " +
  JSON.stringify(calamities, null, 2) +
  ";\n";

fs.writeFileSync("./src/data/seededData.ts", outCode);
console.log(`✅ Successfully generated seededData.ts with ${mps.length} MPs and ${calamities.length} Calamity consents!`);
