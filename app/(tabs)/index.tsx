import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BalanceHero } from '@/components/BalanceHero';
import { EntryRow } from '@/components/EntryRow';
import { PersonRow } from '@/components/PersonRow';
import { TAB_BAR_SPACE } from '@/components/TabBar';
import Animated from '@/components/ui/animated';
import { EmptyState } from '@/components/ui/EmptyState';
import { PressableScale } from '@/components/ui/PressableScale';
import { useI18n } from '@/hooks/useI18n';
import {
  usePendingDues,
  usePeople,
  useRecentEntries,
  useSummaries,
  useTotals,
} from '@/hooks/useLedgerData';
import { dueState } from '@/lib/format';
import { haptics } from '@/lib/haptics';
import type { TKey } from '@/lib/i18n';
import { palette } from '@/lib/theme';
import { useLedger } from '@/store/useLedger';

const GREETINGS: Array<{ untilHour: number; plain: TKey; named: TKey }> = [
  { untilHour: 12, plain: 'greetingMorning', named: 'greetingMorningNamed' },
  { untilHour: 17, plain: 'greetingAfternoon', named: 'greetingAfternoonNamed' },
  { untilHour: 24, plain: 'greetingEvening', named: 'greetingEveningNamed' },
];

export default function HomeScreen() {
  const { t, tp } = useI18n();

  const people = usePeople();
  const summaries = useSummaries();
  const totals = useTotals();
  const recent = useRecentEntries(4);
  const dues = usePendingDues();
  const userName = useLedger((state) => state.settings.userName);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    const slot = GREETINGS.find((g) => hour < g.untilHour) ?? GREETINGS[2];
    const firstName = userName.trim().split(/\s+/)[0];
    return firstName ? t(slot.named, { name: firstName }) : t(slot.plain);
  }, [userName, t]);

  const topBalances = useMemo(
    () =>
      summaries
        .filter((summary) => summary.balance !== 0)
        .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance))
        .slice(0, 3),
    [summaries],
  );

  const peopleById = useMemo(
    () => Object.fromEntries(people.map((person) => [person.id, person])),
    [people],
  );

  const overdueCount = useMemo(
    () => dues.filter((item) => dueState(item.entry.dueDate!) === 'overdue').length,
    [dues],
  );

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_SPACE }}
        className="px-5"
      >
        <View className="flex-row items-center justify-between pb-5 pt-2">
          <View>
            <Text className="font-display text-[26px] text-ink-900">Len Den</Text>
            <Text className="mt-0.5 font-sans text-[13px] text-ink-400">
              {t('homeSubtitle')}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              haptics.tap();
              router.push('/new-person');
            }}
            className="h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm shadow-ink-900/5"
            accessibilityRole="button"
            accessibilityLabel={t('addPersonLabel')}
          >
            <Ionicons name="person-add-outline" size={19} color={palette.brand600} />
          </Pressable>
        </View>

        <BalanceHero totals={totals} greeting={greeting} />

        <View className="mt-4 flex-row gap-3">
          <QuickAction
            label={t('youGaveShort')}
            caption={t('moneyOut')}
            icon="arrow-up"
            tone="give"
            onPress={() => router.push('/new-entry?type=gave')}
          />
          <QuickAction
            label={t('youGotShort')}
            caption={t('moneyIn')}
            icon="arrow-down"
            tone="get"
            onPress={() => router.push('/new-entry?type=got')}
          />
        </View>

        {people.length === 0 ? (
          <EmptyState
            icon="people-outline"
            title={t('homeEmptyTitle')}
            body={t('homeEmptyBody')}
            actionLabel={t('homeEmptyAction')}
            onAction={() => router.push('/new-person')}
          />
        ) : (
          <>
            {dues.length > 0 ? (
              <Animated.View entering={FadeInDown.duration(420).delay(40)} className="mt-7">
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="font-ui-bold text-[17px] text-ink-900">
                    {t('expectedReturns')}
                  </Text>
                  {overdueCount > 0 ? (
                    <View className="rounded-full bg-give-50 px-2.5 py-1">
                      <Text className="font-ui-semibold text-[12px] text-give-600">
                        {tp('overdueCount', overdueCount)}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {dues.slice(0, 3).map((item) => (
                  <EntryRow
                    key={item.entry.id}
                    entry={item.entry}
                    person={item.person}
                    onPress={() => router.push(`/person/${item.person.id}`)}
                  />
                ))}
              </Animated.View>
            ) : null}

            {topBalances.length > 0 ? (
              <Animated.View entering={FadeInDown.duration(420).delay(80)} className="mt-7">
                <SectionHeader
                  title={t('whoOwesWhat')}
                  seeAll={t('seeAll')}
                  onSeeAll={() => router.push('/people')}
                />
                {topBalances.map((summary) => (
                  <PersonRow
                    key={summary.person.id}
                    summary={summary}
                    onPress={() => router.push(`/person/${summary.person.id}`)}
                  />
                ))}
              </Animated.View>
            ) : (
              <View className="mt-7 items-center rounded-3xl bg-white p-6 shadow-sm shadow-ink-900/5">
                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-get-50">
                  <Ionicons name="checkmark-circle" size={28} color={palette.get600} />
                </View>
                <Text className="mt-3 font-ui-bold text-[17px] text-ink-900">
                  {t('allSettledTitle')}
                </Text>
                <Text className="mt-1 text-center font-sans text-[14px] text-ink-400">
                  {t('allSettledBody')}
                </Text>
              </View>
            )}

            {recent.length > 0 ? (
              <Animated.View entering={FadeInDown.duration(420).delay(140)} className="mt-7">
                <SectionHeader
                  title={t('recentActivity')}
                  seeAll={t('seeAll')}
                  onSeeAll={() => router.push('/activity')}
                />
                {recent.map((entry) => (
                  <EntryRow
                    key={entry.id}
                    entry={entry}
                    person={peopleById[entry.personId]}
                    showDue={false}
                    onPress={() => router.push(`/person/${entry.personId}`)}
                  />
                ))}
              </Animated.View>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({
  title,
  seeAll,
  onSeeAll,
}: {
  title: string;
  seeAll: string;
  onSeeAll: () => void;
}) {
  return (
    <View className="mb-3 flex-row items-center justify-between">
      <Text className="font-ui-bold text-[17px] text-ink-900">{title}</Text>
      <Pressable onPress={onSeeAll} hitSlop={8}>
        <Text className="font-ui-semibold text-[13px] text-brand-600">{seeAll}</Text>
      </Pressable>
    </View>
  );
}

function QuickAction({
  label,
  caption,
  icon,
  tone,
  onPress,
}: {
  label: string;
  caption: string;
  icon: keyof typeof Ionicons.glyphMap;
  tone: 'get' | 'give';
  onPress: () => void;
}) {
  const give = tone === 'give';

  return (
    <PressableScale
      onPress={() => {
        haptics.tap();
        onPress();
      }}
      className="flex-1 flex-row items-center rounded-3xl bg-white p-4 shadow-sm shadow-ink-900/5"
    >
      <View
        className={
          give
            ? 'h-10 w-10 items-center justify-center rounded-xl bg-give-50'
            : 'h-10 w-10 items-center justify-center rounded-xl bg-get-50'
        }
      >
        <Ionicons name={icon} size={18} color={give ? palette.give600 : palette.get600} />
      </View>
      <View className="ml-3 flex-1">
        <Text className="font-ui-bold text-[15px] text-ink-900" numberOfLines={1}>
          {label}
        </Text>
        <Text className="font-sans text-[12px] text-ink-400" numberOfLines={1}>
          {caption}
        </Text>
      </View>
    </PressableScale>
  );
}
