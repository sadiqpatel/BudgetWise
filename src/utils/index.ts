import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'CAD') {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateString: string) {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch (e) {
    return dateString;
  }
}

export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function getCurrentMonthStr() {
  return format(new Date(), 'yyyy-MM');
}

export function isTransactionInCycle(transactionDateStr: string, cycleMonthStr: string, startDay: number = 1) {
  if (!transactionDateStr) return false;
  
  const [yearStr, monthStr] = cycleMonthStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  
  // If cycle starts on the 1st, it's just a simple string match for the month
  if (startDay === 1) {
    return transactionDateStr.startsWith(cycleMonthStr);
  }
  
  // Custom cycle: e.g. "2026-05" with startDay 28 means:
  // Starts: 2026-05-28
  // Ends: 2026-06-28 (exclusive)
  // Note: JS Date month is 0-indexed (0 = Jan).
  const cycleStart = new Date(year, month - 1, startDay);
  const cycleEnd = new Date(year, month, startDay);
  
  const [tYear, tMonth, tDay] = transactionDateStr.split('-');
  const txDate = new Date(parseInt(tYear, 10), parseInt(tMonth, 10) - 1, parseInt(tDay, 10));
  
  // Compare ignoring time components
  txDate.setHours(0, 0, 0, 0);
  cycleStart.setHours(0, 0, 0, 0);
  cycleEnd.setHours(0, 0, 0, 0);
  
  return txDate >= cycleStart && txDate < cycleEnd;
}
