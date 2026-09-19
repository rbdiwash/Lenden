import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Linking, Platform, Pressable, Text, View } from 'react-native';
import { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EntryRow } from '@/components/EntryRow';
import Animated from '@/components/ui/animated';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { PressableScale } from '@/components/ui/PressableScale';
import { useI18n } from '@/hooks/useI18n';
import { usePerson, usePersonLedger } from '@/hooks/useLedgerData';
import { confirm } from '@/lib/confirm';
import { dueState } from '@/lib/format';
import { haptics } from '@/lib/haptics';
import { interestForPerson } from '@/lib/interest';
import { dismiss } from '@/lib/nav';
import { palette } from '@/lib/theme';
import { useLedger } from '@/store/useLedger';

export default function PersonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, tp, money, date, dueLabel } = useI18n();
  const person = usePerson(id);
  const { entries, balance, running } = usePersonLedger(id);

  const removePerson = useLedger((state) => state.removePerson);
  const removeEntry = useLedger((state) => state.removeEntry);
  const settleUp = useLedger((state) => state.settleUp);

  /** Interest earned so far across this person's live loans. */
  const accruedInterest = useMemo(
    () => interestForPerson(entries, balance),
    [entries, balance],
  );

  // The soonest expected return still outstanding, surfaced on the balance card.
  const nextDue = useMemo(() => {
    if (balance <= 0) return null;
    const dates = entries
      .filter((entry) => entry.type === 'gave' && entry.dueDate)
      .map((entry) => entry.dueDate!)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    return dates[0] ?? null;
  }, [entries, balance]);

  if (!person) {
    return (
      <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
        <EmptyState
          icon="person-outline"
          title={t('personNotFound')}
          body={t('personNotFoundBody')}
          actionLabel={t('goBack')}
          onAction={() => dismiss()}
        />
      </SafeAreaView>
    );
  }

  const settled = balance === 0;

  const onDeletePerson = async () => {
    const ok = await confirm({
      title: t('confirmDeletePersonTitle', { name: person.name }),
      message: t('confirmDeletePersonBody'),
      confirmLabel: t('delete'),
      cancelLabel: t('cancel'),
      destructive: true,
    });
    if (!ok) return;
    haptics.warning();
    removePerson(person.id);
    dismiss();
  };

  const onDeleteEntry = async (entryId: string, amount: number) => {
    const ok = await confirm({
      title: t('confirmDeleteEntryTitle'),
      message: t('confirmDeleteEntryBody', { amount: money(amount) }),
      confirmLabel: t('delete'),
      cancelLabel: t('cancel'),
      destructive: true,
    });
    if (!ok) return;
    haptics.warning();
    removeEntry(entryId);
  };

  const onSettle = async () => {
    const ok = await confirm({
      title: t('confirmSettleTitle'),
      message:
        balance > 0
          ? t('confirmSettleReceive', { amount: money(balance), name: person.name })
          : t('confirmSettlePay', { amount: money(Math.abs(balance)), name: person.name }),
      confirmLabel: t('confirmSettleAction'),
      cancelLabel: t('cancel'),
    });
    if (!ok) return;
    haptics.success();
    settleUp(person.id, t('settledUpNote'));
  };

  const openLink = (url: string) => {
    if (Platform.OS === 'web') return;
    haptics.tap();
    Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
      <View className="flex-row items-center justify-between px-5 pb-2 pt-2">
        <Pressable
          onPress={() => dismiss()}
          hitSlop={10}
          className="h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm shadow-ink-900/5"
          accessibilityRole="button"
          accessibilityLabel={t('goBack')}
        >
          <Ionicons name="arrow-back" size={19} color={palette.ink700} />
        </Pressable>

        <View className="flex-row gap-2">
          <Pressable
            onPress={() => router.push(`/new-person?id=${person.id}`)}
            hitSlop={10}
            className="h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm shadow-ink-900/5"
            accessibilityRole="button"
            accessibilityLabel={t('editPersonLabel')}
          >
            <Ionicons name="create-outline" size={19} color={palette.ink700} />
          </Pressable>
          <Pressable
            onPress={onDeletePerson}
            hitSlop={10}
            className="h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm shadow-ink-900/5"
            accessibilityRole="button"
            accessibilityLabel={t('deletePersonLabel')}
          >
            <Ionicons name="trash-outline" size={19} color={palette.give600} />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        ListHeaderComponent={
          <View>
            <Animated.View entering={FadeInDown.duration(380)} className="items-center pb-5 pt-1">
              <Avatar name={person.name} colorIndex={person.colorIndex} size="lg" />
              <Text className="mt-3 font-display text-[24px] text-ink-900">{person.name}</Text>
              {person.phone ? (
                <Text className="mt-0.5 font-sans text-[14px] text-ink-400">{person.phone}</Text>
              ) : null}
              {person.note ? (
                <Text className="mt-0.5 font-sans text-[13px] text-ink-300">{person.note}</Text>
              ) : null}
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(400).delay(60)}>
              <View className="overflow-hidden rounded-4xl bg-brand-700 p-6">
                <Text className="font-ui-medium text-[13px] uppercase tracking-widest text-brand-200">
                  {settled ? t('allSettledShort') : balance > 0 ? t('youllGet') : t('youllGive')}
                </Text>
                <Text className="mt-1 font-display text-[34px] leading-[40px] text-white">
                  {money(balance)}
                </Text>
                {accruedInterest > 0 ? (
                  <Text className="mt-1 font-ui-semibold text-[15px] text-brand-200">
                    {t('interestWithTotal', { amount: money(balance + accruedInterest) })}
                  </Text>
                ) : null}

                <Text className="mt-1 font-sans text-[13px] text-brand-100">
                  {tp('entriesRecorded', entries.length)}
                </Text>

                {accruedInterest > 0 ? (
                  <View className="mt-4 flex-row items-center gap-1.5 self-start rounded-full bg-white/15 px-3 py-1.5">
                    <Ionicons name="trending-up" size={14} color="#FFFFFF" />
                    <Text className="font-ui-semibold text-[12px] text-white">
                      {t('interestSoFar')} · {money(accruedInterest)}
                    </Text>
                  </View>
                ) : null}

                {nextDue ? (
                  <View className="mt-2 flex-row items-center gap-1.5 self-start rounded-full bg-white/15 px-3 py-1.5">
                    <Ionicons
                      name={dueState(nextDue) === 'overdue' ? 'alert-circle' : 'time-outline'}
                      size={14}
                      color="#FFFFFF"
                    />
                    <Text className="font-ui-semibold text-[12px] text-white">
                      {dueLabel(nextDue)} · {date(nextDue)}
                    </Text>
                  </View>
                ) : null}
              </View>
            </Animated.View>

            <View className="mt-4 flex-row gap-3">
              <ActionButton
                label={t('youGaveShort')}
                icon="arrow-up"
                tone="give"
                onPress={() => router.push(`/new-entry?type=gave&personId=${person.id}`)}
              />
              <ActionButton
                label={t('youGotShort')}
                icon="arrow-down"
                tone="get"
                onPress={() => router.push(`/new-entry?type=got&personId=${person.id}`)}
              />
            </View>

            <View className="mt-3 flex-row gap-3">
              {!settled ? (
                <PressableScale
                  onPress={onSettle}
                  className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-ink-900 py-3.5"
                >
                  <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                  <Text className="font-ui-semibold text-[14px] text-white" numberOfLines={1}>
                    {t('settleUp')}
                  </Text>
                </PressableScale>
              ) : null}

              {person.phone && Platform.OS !== 'web' ? (
                <>
                  <PressableScale
                    onPress={() => openLink(`tel:${person.phone}`)}
                    className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-ink-200 bg-white py-3.5"
                  >
                    <Ionicons name="call-outline" size={17} color={palette.ink700} />
                    <Text className="font-ui-semibold text-[14px] text-ink-800">{t('call')}</Text>
                  </PressableScale>
                  <PressableScale
                    onPress={() =>
                      openLink(
                        `sms:${person.phone}${Platform.OS === 'ios' ? '&' : '?'}body=${encodeURIComponent(
                          t('reminderMessage', {
                            name: person.name,
                            amount: money(Math.abs(balance)),
                          }),
                        )}`,
                      )
                    }
                    className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-ink-200 bg-white py-3.5"
                  >
                    <Ionicons name="chatbubble-ellipses-outline" size={17} color={palette.ink700} />
                    <Text className="font-ui-semibold text-[14px] text-ink-800">{t('remind')}</Text>
                  </PressableScale>
                </>
              ) : null}
            </View>

            {entries.length > 0 ? (
              <Text className="mb-2.5 mt-7 font-ui-semibold text-[13px] uppercase tracking-wider text-ink-400">
                {t('history')}
              </Text>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <EntryRow
            entry={item}
            runningBalance={running[item.id]}
            showLoanMeta={balance > 0}
            onLongPress={() => onDeleteEntry(item.id, item.amount)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            title={t('noEntriesYet')}
            body={t('personEmptyBody', { name: person.name })}
          />
        }
      />
    </SafeAreaView>
  );
}

function ActionButton({
  label,
  icon,
  tone,
  onPress,
}: {
  label: string;
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
      className={
        give
          ? 'flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-give-500 py-4'
          : 'flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-get-500 py-4'
      }
    >
      <Ionicons name={icon} size={18} color="#FFFFFF" />
      <Text className="font-ui-bold text-[15px] text-white" numberOfLines={1}>
        {label}
      </Text>
    </PressableScale>
  );
}
