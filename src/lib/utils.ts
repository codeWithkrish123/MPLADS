import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amountInRupees: number): string {
  if (amountInRupees >= 10000000) {
    return `₹${(amountInRupees / 10000000).toFixed(2)} Cr`;
  } else if (amountInRupees >= 100000) {
    return `₹${(amountInRupees / 100000).toFixed(1)} Lakh`;
  } else if (amountInRupees >= 1000) {
    return `₹${(amountInRupees / 1000).toFixed(1)}k`;
  }
  return `₹${amountInRupees.toLocaleString("en-IN")}`;
}

export function formatLakh(amountInRupees: number): string {
  return `₹${(amountInRupees / 100000).toFixed(1)}L`;
}

export function formatCr(amountInRupees: number): string {
  return `₹${(amountInRupees / 10000000).toFixed(2)} Cr`;
}
