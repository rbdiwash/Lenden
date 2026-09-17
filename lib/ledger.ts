import type { Entry, LedgerTotals, Person, PersonSummary } from './types';

/** Positive → they owe you. Negative → you owe them. */
export function balanceOf(entries: Entry[]): number {
  const total = entries.reduce(
    (sum, entry) => (entry.type === 'gave' ? sum + entry.amount : sum - entry.amount),
    0,
  );
  // Guard against floating point dust so a settled ledger reads as exactly 0.
  return Math.round(total * 100) / 100;
}

export function entriesFor(entries: Entry[], personId: string): Entry[] {
  return entries.filter((entry) => entry.personId === personId);
}

/** Newest first. Ties are broken by insertion order so same-day entries stay stable. */
export function sortByDateDesc(entries: Entry[]): Entry[] {
  return [...entries].sort((a, b) => {
    const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (diff !== 0) return diff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function summarise(people: Person[], entries: Entry[]): PersonSummary[] {
  const byPerson = new Map<string, Entry[]>();
  for (const entry of entries) {
    const bucket = byPerson.get(entry.personId);
    if (bucket) bucket.push(entry);
    else byPerson.set(entry.personId, [entry]);
  }

  return people.map((person) => {
    const own = byPerson.get(person.id) ?? [];
    const lastActivity = own.reduce<string | null>((latest, entry) => {
      if (!latest || new Date(entry.date).getTime() > new Date(latest).getTime()) {
        return entry.date;
      }
      return latest;
    }, null);

    return {
      person,
      balance: balanceOf(own),
      entryCount: own.length,
      lastActivity,
    };
  });
}

export function totalsOf(summaries: PersonSummary[]): LedgerTotals {
  let receivable = 0;
  let payable = 0;

  for (const summary of summaries) {
    if (summary.balance > 0) receivable += summary.balance;
    else if (summary.balance < 0) payable += -summary.balance;
  }

  receivable = Math.round(receivable * 100) / 100;
  payable = Math.round(payable * 100) / 100;

  return { receivable, payable, net: Math.round((receivable - payable) * 100) / 100 };
}

export type SortMode = 'recent' | 'highest' | 'name';

export function sortSummaries(summaries: PersonSummary[], mode: SortMode): PersonSummary[] {
  const sorted = [...summaries];
  switch (mode) {
    case 'highest':
      return sorted.sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));
    case 'name':
      return sorted.sort((a, b) => a.person.name.localeCompare(b.person.name));
    case 'recent':
    default:
      return sorted.sort((a, b) => {
        const aTime = new Date(a.lastActivity ?? a.person.createdAt).getTime();
        const bTime = new Date(b.lastActivity ?? b.person.createdAt).getTime();
        return bTime - aTime;
      });
  }
}

/** Running balance after each entry, oldest → newest, keyed by entry id. */
export function runningBalances(entries: Entry[]): Record<string, number> {
  const oldestFirst = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const result: Record<string, number> = {};
  let running = 0;
  for (const entry of oldestFirst) {
    running += entry.type === 'gave' ? entry.amount : -entry.amount;
    result[entry.id] = Math.round(running * 100) / 100;
  }
  return result;
}

export interface DueItem {
  entry: Entry;
  person: Person;
}

/**
 * Money you gave with an expected return date, where the person still owes you
 * something. Once a ledger is settled the old due dates stop mattering, so
 * they drop out. Soonest (and most overdue) first.
 */
export function pendingDues(people: Person[], entries: Entry[]): DueItem[] {
  const summaries = summarise(people, entries);
  const owing = new Set(
    summaries.filter((summary) => summary.balance > 0).map((summary) => summary.person.id),
  );
  const byId = new Map(people.map((person) => [person.id, person]));

  return entries
    .filter((entry) => entry.type === 'gave' && entry.dueDate && owing.has(entry.personId))
    .map((entry) => ({ entry, person: byId.get(entry.personId)! }))
    .filter((item) => Boolean(item.person))
    .sort(
      (a, b) => new Date(a.entry.dueDate!).getTime() - new Date(b.entry.dueDate!).getTime(),
    );
}
