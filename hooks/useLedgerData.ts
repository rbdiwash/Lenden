import { useMemo } from 'react';

import {
  balanceOf,
  entriesFor,
  pendingDues,
  runningBalances,
  sortByDateDesc,
  summarise,
  totalsOf,
} from '@/lib/ledger';
import { useLedger } from '@/store/useLedger';

export function usePeople() {
  return useLedger((state) => state.people);
}

export function useEntries() {
  return useLedger((state) => state.entries);
}

export function useCurrency() {
  return useLedger((state) => state.settings.currency);
}

export function useSummaries() {
  const people = usePeople();
  const entries = useEntries();
  return useMemo(() => summarise(people, entries), [people, entries]);
}

export function useTotals() {
  const summaries = useSummaries();
  return useMemo(() => totalsOf(summaries), [summaries]);
}

export function usePerson(personId?: string) {
  const people = usePeople();
  return useMemo(
    () => (personId ? people.find((person) => person.id === personId) : undefined),
    [people, personId],
  );
}

/** Everything one person's detail screen needs, computed once. */
export function usePersonLedger(personId?: string) {
  const entries = useEntries();

  return useMemo(() => {
    if (!personId) {
      return { entries: [], balance: 0, running: {} as Record<string, number> };
    }
    const own = entriesFor(entries, personId);
    return {
      entries: sortByDateDesc(own),
      balance: balanceOf(own),
      running: runningBalances(own),
    };
  }, [entries, personId]);
}

/** The whole ledger, newest first, for the Activity tab. */
export function useRecentEntries(limit?: number) {
  const entries = useEntries();
  return useMemo(() => {
    const sorted = sortByDateDesc(entries);
    return limit ? sorted.slice(0, limit) : sorted;
  }, [entries, limit]);
}

/** Ids of people who still owe the user, used to hide settled due dates. */
export function useOwingIds() {
  const summaries = useSummaries();
  return useMemo(
    () => new Set(summaries.filter((s) => s.balance > 0).map((s) => s.person.id)),
    [summaries],
  );
}

/** Money lent with an expected return date, most urgent first. */
export function usePendingDues() {
  const people = usePeople();
  const entries = useEntries();
  return useMemo(() => pendingDues(people, entries), [people, entries]);
}
