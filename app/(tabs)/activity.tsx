import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { SectionList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EntryRow } from '@/components/EntryRow';
import { TAB_BAR_SPACE } from '@/components/TabBar';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { useI18n } from '@/hooks/useI18n';
import { useOwingIds, usePeople, useRecentEntries } from '@/hooks/useLedgerData';
import { dayKey } from '@/lib/format';
import type { TKey } from '@/lib/i18n';
import type { Entry, EntryType } from '@/lib/types';

type Filter = 'all' | EntryType;

const FILTERS: Array<{ key: Filter; labelKey: TKey }> = [
  { key: 'all', labelKey: 'filterAll' },
  { key: 'gave', labelKey: 'youGaveShort' },
  { key: 'got', labelKey: 'youGotShort' },
];

export default function ActivityScreen() {
  const { t, tp, money, time, dayHeading } = useI18n();
  const entries = useRecentEntries();
  const people = usePeople();
  const owing = useOwingIds();
  const [filter, setFilter] = useState<Filter>('all');

  const peopleById = useMemo(
    () => Object.fromEntries(people.map((person) => [person.id, person])),
    [people],
  );

  const visible = useMemo(
    () => (filter === 'all' ? entries : entries.filter((entry) => entry.type === filter)),
    [entries, filter],
  );

  const sections = useMemo(() => {
    const groups: Array<{ title: string; data: Entry[] }> = [];
    let currentKey = '';

    for (const entry of visible) {
      const key = dayKey(entry.date);
      if (key !== currentKey) {
        currentKey = key;
        groups.push({ title: dayHeading(entry.date), data: [entry] });
      } else {
        groups[groups.length - 1].data.push(entry);
      }
    }
    return groups;
  }, [visible, dayHeading]);

  const filteredTotal = useMemo(
    () => visible.reduce((sum, entry) => sum + entry.amount, 0),
    [visible],
  );

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
      <View className="px-5 pb-1 pt-2">
        <Text className="font-display text-[26px] text-ink-900">{t('activityTitle')}</Text>
        <Text className="mt-0.5 font-sans text-[13px] text-ink-400">
          {tp('entryCount', visible.length)} · {t('activityMoved', { amount: money(filteredTotal) })}
        </Text>

        <View className="mt-4 flex-row flex-wrap gap-2">
          {FILTERS.map((option) => (
            <Chip
              key={option.key}
              label={t(option.labelKey)}
              active={filter === option.key}
              onPress={() => setFilter(option.key)}
            />
          ))}
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: TAB_BAR_SPACE,
        }}
        renderSectionHeader={({ section }) => (
          <Text className="mb-2.5 mt-3 font-ui-semibold text-[13px] uppercase tracking-wider text-ink-400">
            {section.title}
          </Text>
        )}
        renderItem={({ item }) => (
          <EntryRow
            entry={item}
            person={peopleById[item.personId]}
            caption={time(item.date)}
            showDue={owing.has(item.personId)}
            onPress={() => router.push(`/person/${item.personId}`)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="receipt-outline"
            title={t('activityEmptyTitle')}
            body={filter === 'all' ? t('activityEmptyAll') : t('activityEmptyFiltered')}
          />
        }
      />
    </SafeAreaView>
  );
}
