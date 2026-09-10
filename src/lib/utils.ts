import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amountInRupees?: number | null): string {
  if (amountInRupees == null || isNaN(Number(amountInRupees))) {
    return "₹0";
  }
  const val = Number(amountInRupees);
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  } else if (val >= 100000) {
    return `₹${(val / 100000).toFixed(1)} Lakh`;
  } else if (val >= 1000) {
    return `₹${(val / 1000).toFixed(1)}k`;
  }
  return `₹${val.toLocaleString("en-IN")}`;
}

export function formatLakh(amountInRupees?: number | null): string {
  if (amountInRupees == null || isNaN(Number(amountInRupees))) {
    return "₹0L";
  }
  return `₹${(Number(amountInRupees) / 100000).toFixed(1)}L`;
}

export function formatCr(amountInRupees?: number | null): string {
  if (amountInRupees == null || isNaN(Number(amountInRupees))) {
    return "₹0 Cr";
  }
  return `₹${(Number(amountInRupees) / 10000000).toFixed(2)} Cr`;
}
