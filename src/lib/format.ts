import { RiskSeverity } from "../types";

export function formatAmount(value?: number | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  if (Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(2)} Lakh`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export function formatScore(value?: number | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  return Number(value).toFixed(1);
}

export function toRiskSeverity(level?: string | null): RiskSeverity {
  const v = String(level || "").toUpperCase();
  if (v === "CRITICAL" || v === "HIGH" || v === "MEDIUM" || v === "LOW") return v;
  return "LOW";
}

export function hasNumericScore(value?: number | null): boolean {
  return value !== undefined && value !== null && !Number.isNaN(Number(value));
}
