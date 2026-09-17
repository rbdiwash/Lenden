import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PersonRow } from '@/components/PersonRow';
import { TAB_BAR_SPACE } from '@/components/TabBar';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { useI18n } from '@/hooks/useI18n';
import { useSummaries, useTotals } from '@/hooks/useLedgerData';
import { haptics } from '@/lib/haptics';
import type { TKey } from '@/lib/i18n';
import { sortSummaries, type SortMode } from '@/lib/ledger';
import { palette } from '@/lib/theme';

const SORTS: Array<{ key: SortMode; labelKey: TKey }> = [
  { key: 'recent', labelKey: 'sortRecent' },
  { key: 'highest', labelKey: 'sortHighest' },
  { key: 'name', labelKey: 'sortName' },
];

export default function PeopleScreen() {
  const { t, tp, money } = useI18n();
  const summaries = useSummaries();
  const totals = useTotals();

  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortMode>('recent');

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = needle
      ? summaries.filter(
          (summary) =>
            summary.person.name.toLowerCase().includes(needle) ||
            summary.person.phone?.includes(needle),
        )
      : summaries;
    return sortSummaries(filtered, sort);
  }, [summaries, query, sort]);

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
      <View className="px-5 pb-1 pt-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <Text className="font-display text-[26px] text-ink-900">{t('peopleTitle')}</Text>
            <Text className="mt-0.5 font-sans text-[13px] text-ink-400">
              {tp('peopleCount', summaries.length)}
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

        <View className="mt-4 flex-row gap-3">
          <TotalPill label={t('youllGet')} value={money(totals.receivable)} tone="get" />
          <TotalPill label={t('youllGive')} value={money(totals.payable)} tone="give" />
        </View>

        <View className="mt-4 flex-row items-center rounded-2xl border border-ink-200 bg-white px-4">
          <Ionicons name="search" size={18} color={palette.ink300} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={palette.ink300}
            className="h-12 min-w-0 flex-1 pl-2.5 font-ui-medium text-[15px] text-ink-900"
            returnKeyType="search"
          />
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={palette.ink300} />
            </Pressable>
          ) : null}
        </View>

        <View className="mt-3 flex-row flex-wrap gap-2">
          {SORTS.map((option) => (
            <Chip
              key={option.key}
              label={t(option.labelKey)}
              active={sort === option.key}
              onPress={() => setSort(option.key)}
            />
          ))}
        </View>
      </View>

      <FlatList
        data={visible}
        keyExtractor={(item) => item.person.id}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: TAB_BAR_SPACE,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <PersonRow summary={item} onPress={() => router.push(`/person/${item.person.id}`)} />
        )}
        ListEmptyComponent={
          summaries.length === 0 ? (
            <EmptyState
              icon="people-outline"
              title={t('noPeopleTitle')}
              body={t('noPeopleBody')}
              actionLabel={t('addPersonLabel')}
              onAction={() => router.push('/new-person')}
            />
          ) : (
            <EmptyState
              icon="search"
              title={t('noMatchTitle')}
              body={t('noMatchBody', { query: query.trim() })}
            />
          )
        }
      />
    </SafeAreaView>
  );
}

function TotalPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'get' | 'give';
}) {
  const give = tone === 'give';

  return (
    <View
      className={give ? 'flex-1 rounded-2xl bg-give-50 p-3.5' : 'flex-1 rounded-2xl bg-get-50 p-3.5'}
    >
      <Text
        className={
          give
            ? 'font-ui-medium text-[12px] text-give-600'
            : 'font-ui-medium text-[12px] text-get-600'
        }
        numberOfLines={1}
      >
        {label}
      </Text>
      <Text
        className={
          give
            ? 'mt-1 font-ui-bold text-[18px] text-give-700'
            : 'mt-1 font-ui-bold text-[18px] text-get-700'
        }
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}
