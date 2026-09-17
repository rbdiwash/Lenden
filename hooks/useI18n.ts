import { useMemo } from 'react';

import {
  dayHeading as dayHeadingRaw,
  formatDate as formatDateRaw,
  formatDueLabel as formatDueLabelRaw,
  formatMoney,
  formatRelativeDate as formatRelativeDateRaw,
  formatTime,
} from '@/lib/format';
import { translate, translatePlural, type PluralBase, type TKey } from '@/lib/i18n';
import { useLedger } from '@/store/useLedger';

type Vars = Record<string, string | number>;

/**
 * One hook for every language-dependent value: translated strings, plurals,
 * money and dates. Components read the language and currency from here instead
 * of taking them as props.
 */
export function useI18n() {
  const lang = useLedger((state) => state.settings.language);
  const currency = useLedger((state) => state.settings.currency);

  return useMemo(
    () => ({
      lang,
      currency,
      t: (key: TKey, vars?: Vars) => translate(lang, key, vars),
      tp: (base: PluralBase, count: number, vars?: Vars) =>
        translatePlural(lang, base, count, vars),
      money: (value: number) => formatMoney(value, currency),
      date: (iso: string) => formatDateRaw(iso, lang),
      time: (iso: string) => formatTime(iso),
      relative: (iso: string) => formatRelativeDateRaw(iso, lang),
      dayHeading: (iso: string) => dayHeadingRaw(iso, lang),
      dueLabel: (iso: string) => formatDueLabelRaw(iso, lang),
    }),
    [lang, currency],
  );
}
