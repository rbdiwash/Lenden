import type { Language } from './i18n';

/**
 * Len Den keeps a single ledger per person, exactly like a paper khata.
 *
 * - `gave` — money left your hand (you lent, or you repaid a loan).
 * - `got`  — money came into your hand (you borrowed, or you were repaid).
 *
 * A person's balance is simply `sum(gave) - sum(got)`:
 *   balance > 0  →  they owe you   ("you'll get")
 *   balance < 0  →  you owe them   ("you'll give")
 */
export type EntryType = 'gave' | 'got';

export interface Person {
  id: string;
  name: string;
  phone?: string;
  note?: string;
  /** Index into the avatar palette, so a person keeps the same colour forever. */
  colorIndex: number;
  createdAt: string;
}

export interface Entry {
  id: string;
  personId: string;
  type: EntryType;
  /** Always a positive number. The `type` carries the direction. */
  amount: number;
  note?: string;
  /** ISO timestamp of when the money actually moved. */
  date: string;
  /**
   * Only meaningful on a `gave` entry: when you expect the money back.
   * Undefined means no date was set.
   */
  dueDate?: string;
  createdAt: string;
}

export interface Settings {
  /** Currency symbol shown next to every amount. */
  currency: string;
  /** Optional display name, used in the greeting and in shared summaries. */
  userName: string;
  /** UI language. */
  language: Language;
  /** False until the first-run language and currency choice is made. */
  onboarded: boolean;
}

export interface PersonSummary {
  person: Person;
  balance: number;
  entryCount: number;
  lastActivity: string | null;
}

export interface LedgerTotals {
  /** Total the user is owed across everyone. */
  receivable: number;
  /** Total the user owes across everyone. */
  payable: number;
  /** receivable - payable */
  net: number;
}
