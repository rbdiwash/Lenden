import { MONTHS, translate, translatePlural, type Language } from '@/lib/i18n';

/**
 * Amounts are grouped the South Asian way (1,23,456) because that is how
 * people in Nepal read money. Written by hand instead of using `Intl` so the
 * output is identical on every JS engine and platform.
 */
function groupDigits(intPart: string): string {
  if (intPart.length <= 3) return intPart;
  const last3 = intPart.slice(-3);
  const rest = intPart.slice(0, -3);
  return `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')},${last3}`;
}

/** `1234.5` → `"1,234.50"`, `1234` → `"1,234"` */
export function formatNumber(value: number): string {
  const safe = Number.isFinite(value) ? Math.abs(value) : 0;
  const hasPaisa = Math.round(safe * 100) % 100 !== 0;
  const fixed = safe.toFixed(hasPaisa ? 2 : 0);
  const [intPart, decimals] = fixed.split('.');
  const grouped = groupDigits(intPart);
  return decimals ? `${grouped}.${decimals}` : grouped;
}

/** `1234, "रू"` → `"रू 1,234"` */
export function formatMoney(value: number, currency = 'रू'): string {
  return `${currency} ${formatNumber(value)}`;
}

/** Compact form for tight spaces: `125000` → `"1.25L"` */
export function formatCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 10000000) return `${(abs / 10000000).toFixed(2).replace(/\.00$/, '')}Cr`;
  if (abs >= 100000) return `${(abs / 100000).toFixed(2).replace(/\.00$/, '')}L`;
  return formatNumber(abs);
}

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/** Whole days between two dates, ignoring the time of day. */
export function daysBetween(a: Date, b: Date): number {
  return Math.round((startOfDay(a) - startOfDay(b)) / 86400000);
}

/** `"17 Sep 2026"` */
export function formatDate(iso: string, lang: Language = 'en'): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[lang][d.getMonth()]} ${d.getFullYear()}`;
}

/** `"4:05 PM"` */
export function formatTime(iso: string): string {
  const d = new Date(iso);
  const hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${minutes} ${suffix}`;
}

/** `"Today"`, `"Yesterday"`, `"3 days ago"`, then falls back to a date. */
export function formatRelativeDate(iso: string, lang: Language = 'en'): string {
  const diff = daysBetween(new Date(), new Date(iso));
  if (diff === 0) return translate(lang, 'today');
  if (diff === 1) return translate(lang, 'yesterday');
  if (diff > 1 && diff < 7) return translatePlural(lang, 'daysAgo', diff);
  if (diff === -1) return translate(lang, 'tomorrow');
  if (diff < -1 && diff > -7) return translatePlural(lang, 'inDays', Math.abs(diff));
  return formatDate(iso, lang);
}

/** Heading used when grouping a list of entries by day. */
export function dayHeading(iso: string, lang: Language = 'en'): string {
  const diff = daysBetween(new Date(), new Date(iso));
  if (diff === 0) return translate(lang, 'today');
  if (diff === 1) return translate(lang, 'yesterday');
  return formatDate(iso, lang);
}

/** Stable `YYYY-MM-DD` key for grouping. */
export function dayKey(iso: string): string {
  const d = new Date(iso);
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

/** Turns free-form keypad input into a number we can store. */
export function parseAmount(input: string): number {
  const cleaned = input.replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  const normalised = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : cleaned;
  const value = Number.parseFloat(normalised);
  return Number.isFinite(value) ? Math.round(value * 100) / 100 : 0;
}

export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

/** A new ISO date `days` from now, with the time set to midday. */
export function isoInDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
}

/** True when two ISO timestamps land on the same calendar day. */
export function isSameDay(a: string, b: string): boolean {
  return dayKey(a) === dayKey(b);
}

/**
 * Midday ISO for a calendar day. Using noon rather than midnight means a
 * timezone shift can never push the stored date onto the previous day.
 */
export function isoFromParts(year: number, month: number, day: number): string {
  return new Date(year, month, day, 12, 0, 0, 0).toISOString();
}

export type DueState = 'overdue' | 'today' | 'soon' | 'later';

/** How urgent an expected-return date is, for colouring badges. */
export function dueState(iso: string): DueState {
  const days = daysBetween(new Date(iso), new Date());
  if (days < 0) return 'overdue';
  if (days === 0) return 'today';
  if (days <= 7) return 'soon';
  return 'later';
}

/** `"Due in 5 days"`, `"Due today"`, `"Overdue by 3 days"` */
export function formatDueLabel(iso: string, lang: Language = 'en'): string {
  const days = daysBetween(new Date(iso), new Date());
  if (days === 0) return translate(lang, 'dueToday');
  if (days === 1) return translate(lang, 'dueTomorrow');
  if (days > 1) return translatePlural(lang, 'dueInDays', days);
  return translatePlural(lang, 'overdueByDays', Math.abs(days));
}
