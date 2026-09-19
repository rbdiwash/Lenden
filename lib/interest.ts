import { daysBetween } from '@/lib/format';
import type { Entry } from '@/lib/types';

/**
 * Interest is simple, not compounding, and prorated by the day:
 *
 *     interest = principal × (rate / 100) × (days / 365)
 *
 * So a yearly rate accrues a little every day, which is how informal lending
 * is normally reckoned. It is always computed on demand and never written into
 * the ledger — the stored balance stays a record of money that actually moved,
 * and settling up can still land on exactly zero.
 */
const DAYS_IN_YEAR = 365;

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Whole days a loan has been outstanding. Never negative. */
export function daysOutstanding(entry: Entry, now: Date = new Date()): number {
  return Math.max(0, daysBetween(now, new Date(entry.date)));
}

/** What one day of interest costs on a principal at a yearly rate. */
export function interestPerDay(principal: number, rate: number): number {
  return round((principal * (rate / 100)) / DAYS_IN_YEAR);
}

/** Interest accrued so far on a single entry. */
export function interestOn(entry: Entry, now: Date = new Date()): number {
  if (entry.type !== 'gave' || !entry.interestRate) return 0;
  return round(entry.amount * (entry.interestRate / 100) * (daysOutstanding(entry, now) / DAYS_IN_YEAR));
}

/** Interest accrued between two dates, used to preview a loan before saving. */
export function interestBetween(principal: number, rate: number, days: number): number {
  return round(principal * (rate / 100) * (Math.max(0, days) / DAYS_IN_YEAR));
}

/**
 * Total interest across a person's loans. Returns 0 once their ledger is
 * settled or in your debt, matching how due dates stop mattering then.
 */
export function interestForPerson(
  entries: Entry[],
  balance: number,
  now: Date = new Date(),
): number {
  if (balance <= 0) return 0;
  return round(entries.reduce((sum, entry) => sum + interestOn(entry, now), 0));
}

/** True when any of these entries is still earning interest. */
export function hasInterestBearing(entries: Entry[]): boolean {
  return entries.some((entry) => entry.type === 'gave' && Boolean(entry.interestRate));
}
