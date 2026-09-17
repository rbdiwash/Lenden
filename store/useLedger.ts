import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createId } from '@/lib/id';
import { balanceOf, entriesFor } from '@/lib/ledger';
import type { Entry, EntryType, Person, Settings } from '@/lib/types';

export interface NewPersonInput {
  name: string;
  phone?: string;
  note?: string;
}

export interface NewEntryInput {
  personId: string;
  type: EntryType;
  amount: number;
  note?: string;
  /** Defaults to now. */
  date?: string;
  /** Only used for `gave`: when you expect the money back. */
  dueDate?: string;
}

export interface LedgerSnapshot {
  people: Person[];
  entries: Entry[];
  settings?: Partial<Settings>;
}

interface LedgerState {
  people: Person[];
  entries: Entry[];
  settings: Settings;
  /** False until AsyncStorage has been read, so we never flash an empty ledger. */
  hydrated: boolean;

  addPerson: (input: NewPersonInput) => Person;
  updatePerson: (id: string, patch: Partial<Omit<Person, 'id' | 'createdAt'>>) => void;
  removePerson: (id: string) => void;

  addEntry: (input: NewEntryInput) => Entry;
  updateEntry: (id: string, patch: Partial<Omit<Entry, 'id' | 'personId' | 'createdAt'>>) => void;
  removeEntry: (id: string) => void;
  /** Adds the one entry that brings a person's balance back to zero. */
  settleUp: (personId: string, note?: string) => Entry | null;

  updateSettings: (patch: Partial<Settings>) => void;
  replaceAll: (snapshot: LedgerSnapshot) => void;
  clearAll: () => void;
  loadSampleData: () => void;

  setHydrated: (value: boolean) => void;
}

export const defaultSettings: Settings = {
  currency: 'रू',
  userName: '',
  language: 'en',
  onboarded: false,
};

const STORAGE_KEY = 'len-den:ledger:v1';

export const useLedger = create<LedgerState>()(
  persist(
    (set, get) => ({
      people: [],
      entries: [],
      settings: defaultSettings,
      hydrated: false,

      addPerson: ({ name, phone, note }) => {
        const person: Person = {
          id: createId('p_'),
          name: name.trim(),
          phone: phone?.trim() || undefined,
          note: note?.trim() || undefined,
          colorIndex: get().people.length,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ people: [...state.people, person] }));
        return person;
      },

      updatePerson: (id, patch) =>
        set((state) => ({
          people: state.people.map((person) =>
            person.id === id
              ? {
                  ...person,
                  ...patch,
                  name: patch.name?.trim() ?? person.name,
                  phone: patch.phone?.trim() || undefined,
                  note: patch.note?.trim() || undefined,
                }
              : person,
          ),
        })),

      removePerson: (id) =>
        set((state) => ({
          people: state.people.filter((person) => person.id !== id),
          entries: state.entries.filter((entry) => entry.personId !== id),
        })),

      addEntry: ({ personId, type, amount, note, date, dueDate }) => {
        const now = new Date().toISOString();
        const entry: Entry = {
          id: createId('e_'),
          personId,
          type,
          amount: Math.abs(Math.round(amount * 100) / 100),
          note: note?.trim() || undefined,
          date: date ?? now,
          // A return date only makes sense for money leaving your hand.
          dueDate: type === 'gave' ? dueDate : undefined,
          createdAt: now,
        };
        set((state) => ({ entries: [...state.entries, entry] }));
        return entry;
      },

      updateEntry: (id, patch) =>
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id
              ? {
                  ...entry,
                  ...patch,
                  amount:
                    patch.amount === undefined
                      ? entry.amount
                      : Math.abs(Math.round(patch.amount * 100) / 100),
                  note: patch.note?.trim() || undefined,
                }
              : entry,
          ),
        })),

      removeEntry: (id) =>
        set((state) => ({ entries: state.entries.filter((entry) => entry.id !== id) })),

      settleUp: (personId, note) => {
        const balance = balanceOf(entriesFor(get().entries, personId));
        if (balance === 0) return null;
        return get().addEntry({
          personId,
          // They owed you → the money now comes in. You owed them → it goes out.
          type: balance > 0 ? 'got' : 'gave',
          amount: Math.abs(balance),
          // The caller passes the note already translated.
          note: note ?? 'Settled up',
        });
      },

      updateSettings: (patch) =>
        set((state) => ({ settings: { ...state.settings, ...patch } })),

      replaceAll: ({ people, entries, settings }) =>
        set((state) => ({
          people,
          entries,
          settings: { ...state.settings, ...settings },
        })),

      clearAll: () => set({ people: [], entries: [] }),

      loadSampleData: () => set(buildSampleData()),

      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: STORAGE_KEY,
      // Stays at 1: bumping it without a `migrate` makes zustand discard every
      // saved ledger. New settings are handled by `merge` below instead.
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      /**
       * Zustand replaces top-level keys wholesale, so a ledger saved before
       * `language` or `onboarded` existed would leave them undefined. Merging
       * `settings` field by field keeps old saves working after an upgrade.
       */
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<LedgerState>;
        return {
          ...current,
          ...saved,
          settings: { ...current.settings, ...(saved.settings ?? {}) },
        };
      },
      partialize: (state) => ({
        people: state.people,
        entries: state.entries,
        settings: state.settings,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) console.warn('Len Den: could not read saved ledger', error);
        useLedger.getState().setHydrated(true);
      },
    },
  ),
);

/** A believable demo ledger, so the app can be explored before real data exists. */
function buildSampleData(): Pick<LedgerState, 'people' | 'entries'> {
  const day = 86400000;
  const now = Date.now();
  const at = (daysAgo: number) => new Date(now - daysAgo * day).toISOString();

  const seed: Array<{
    name: string;
    phone?: string;
    note?: string;
    /** [type, amount, note, daysAgo, dueInDays?] */
    entries: Array<[EntryType, number, string, number, number?]>;
  }> = [
    {
      name: 'Sita Gurung',
      phone: '9801234567',
      note: 'Neighbour',
      entries: [
        ['gave', 15000, 'Emergency hospital bill', 24, -4],
        ['got', 5000, 'First instalment', 10],
        ['gave', 2500, 'Taxi fare', 3, 11],
      ],
    },
    {
      name: 'Ramesh Thapa',
      phone: '9812345678',
      entries: [
        ['got', 20000, 'Borrowed for laptop', 18],
        ['gave', 8000, 'Partial repayment', 6],
      ],
    },
    {
      name: 'Anjali Shrestha',
      note: 'Office',
      entries: [
        ['gave', 1200, 'Lunch at Bhatbhateni', 5, 2],
        ['gave', 800, 'Movie tickets', 2, 26],
      ],
    },
    {
      name: 'Bikash Rai',
      phone: '9843210987',
      entries: [
        ['got', 4500, 'Futsal booking money', 9],
        ['gave', 4500, 'Settled up', 1],
      ],
    },
  ];

  const people: Person[] = [];
  const entries: Entry[] = [];

  seed.forEach((item, index) => {
    const person: Person = {
      id: createId('p_'),
      name: item.name,
      phone: item.phone,
      note: item.note,
      colorIndex: index,
      createdAt: at(30),
    };
    people.push(person);

    item.entries.forEach(([type, amount, note, daysAgo, dueInDays]) => {
      entries.push({
        id: createId('e_'),
        personId: person.id,
        type,
        amount,
        note,
        date: at(daysAgo),
        dueDate: dueInDays === undefined ? undefined : at(-dueInDays),
        createdAt: at(daysAgo),
      });
    });
  });

  return { people, entries };
}
