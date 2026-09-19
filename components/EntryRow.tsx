import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { DueBadge } from '@/components/DueBadge';
import { Avatar } from '@/components/ui/Avatar';
import { PressableScale } from '@/components/ui/PressableScale';
import { useI18n } from '@/hooks/useI18n';
import { palette } from '@/lib/theme';
import type { Entry, Person } from '@/lib/types';

interface Props {
  entry: Entry;
  /** Pass a person to show who the entry belongs to (used on the Activity tab). */
  person?: Person;
  /** Balance after this entry, shown on a person's own ledger. */
  runningBalance?: number;
  /** Replaces the small caption under the amount (the date, by default). */
  caption?: string;
  /**
   * Whether to surface loan details — the expected return date and the
   * interest rate. Callers pass false once the person's ledger is settled,
   * since neither means anything after that.
   */
  showLoanMeta?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
}

/**
 * Colours follow the khata convention people already know:
 * money leaving your hand is red, money arriving is green.
 */
export function EntryRow({
  entry,
  person,
  runningBalance,
  caption,
  showLoanMeta = true,
  onPress,
  onLongPress,
}: Props) {
  const { t, money, relative } = useI18n();

  const gave = entry.type === 'gave';
  const direction = gave ? t('youGave') : t('youGot');
  const title = person ? person.name : entry.note || direction;
  // Always spell out the direction: the colour alone is ambiguous when the
  // running balance moves the opposite way to your cash.
  const subtitle = person
    ? `${direction}${entry.note ? ` · ${entry.note}` : ''}`
    : `${direction} · ${relative(entry.date)}`;
  const due = showLoanMeta && gave && entry.dueDate ? entry.dueDate : null;
  const rate = showLoanMeta && gave ? entry.interestRate : undefined;

  return (
    <PressableScale
      onPress={onPress}
      onLongPress={onLongPress}
      scaleTo={0.985}
      className="mb-2.5 flex-row items-center rounded-3xl bg-white p-4 shadow-sm shadow-ink-900/5"
    >
      {person ? (
        <Avatar name={person.name} colorIndex={person.colorIndex} size="sm" />
      ) : (
        <View
          className={
            gave
              ? 'h-10 w-10 items-center justify-center rounded-xl bg-give-50'
              : 'h-10 w-10 items-center justify-center rounded-xl bg-get-50'
          }
        >
          <Ionicons
            name={gave ? 'arrow-up' : 'arrow-down'}
            size={18}
            color={gave ? palette.give600 : palette.get600}
          />
        </View>
      )}

      <View className="ml-3.5 flex-1">
        <Text className="font-ui-semibold text-[15px] text-ink-900" numberOfLines={1}>
          {title}
        </Text>
        <Text className="mt-0.5 font-sans text-[13px] text-ink-400" numberOfLines={1}>
          {subtitle}
        </Text>
        {due || rate ? (
          <View className="mt-1.5 flex-row flex-wrap items-center gap-1.5">
            {due ? <DueBadge dueDate={due} /> : null}
            {rate ? (
              <View className="flex-row items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5">
                <Ionicons name="trending-up" size={11} color={palette.brand700} />
                <Text className="font-ui-semibold text-[11px] text-brand-700">
                  {t('interestRateBadge', { rate })}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>

      <View className="items-end">
        <Text
          className={
            gave
              ? 'font-ui-bold text-[16px] text-give-600'
              : 'font-ui-bold text-[16px] text-get-600'
          }
        >
          {money(entry.amount)}
        </Text>
        <Text className="mt-0.5 font-ui-medium text-[12px] text-ink-300">
          {runningBalance !== undefined
            ? `${t('balanceShort')} ${money(runningBalance)}`
            : (caption ?? relative(entry.date))}
        </Text>
      </View>
    </PressableScale>
  );
}
