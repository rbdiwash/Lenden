import type { TKey } from "@/lib/i18n";

/** The currency symbols offered at first run and in Settings. */
export const CURRENCIES: Array<{ symbol: string; nameKey: TKey }> = [
  { symbol: "रू", nameKey: "currencyNPR" },
  { symbol: "A$", nameKey: "currencyAUD" },
  { symbol: "$", nameKey: "currencyUSD" },
  { symbol: "€", nameKey: "currencyEUR" },
  { symbol: "£", nameKey: "currencyGBP" },
];
