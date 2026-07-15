import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSmallNumber(num: number | null | undefined, decimals = 4): string {
  if (num === null || num === undefined) return "—";
  if (num === 0) return "0";
  if (Math.abs(num) < 0.0001) return "< 0.0001";
  if (Math.abs(num) < 0.001) return num.toExponential(1);
  return num.toFixed(decimals).replace(/\.?0+$/, "") || "0";
}

export function getEcoColor(score?: string): string {
  switch (score?.toUpperCase()) {
    case "A":
      return "var(--eco-a)";
    case "B":
      return "var(--eco-b)";
    case "C":
      return "var(--eco-c)";
    case "D":
      return "var(--eco-d)";
    case "E":
      return "var(--eco-e)";
    default:
      return "var(--text-muted)";
  }
}
