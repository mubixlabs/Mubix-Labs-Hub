import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number | null): string {
  if (amount === null) return "Custom";
  if (amount === 0) return "$0";
  return `$${amount}`;
}
