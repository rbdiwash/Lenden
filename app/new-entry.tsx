import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { CalendarSheet } from '@/components/ui/CalendarSheet';
import { Chip } from '@/components/ui/Chip';
import { PressableScale } from '@/components/ui/PressableScale';
import { useI18n } from '@/hooks/useI18n';
import { usePeople, useSummaries } from '@/hooks/useLedgerData';
import { isSameDay, isoInDays, parseAmount } from '@/lib/format';
import { haptics } from '@/lib/haptics';
import type { TKey } from '@/lib/i18n';
import { dismiss } from '@/lib/nav';
import { palette } from '@/lib/theme';
import type { EntryType } from '@/lib/types';
import { useLedger } from '@/store/useLedger';

/** `none` clears the date, a number is that many days out, `custom` opens the calendar. */
type DueMode = 'none' | 'custom' | 7 | 15 | 30;

const DUE_PRESETS: Array<{ mode: DueMode; labelKey: TKey }> = [
  { mode: 'none', labelKey: 'dueNone' },
  { mode: 7, labelKey: 'dueOneWeek' },
  { mode: 15, labelKey: 'dueFifteenDays' },
  { mode: 30, labelKey: 'dueOneMonth' },
  { mode: 'custom', labelKey: 'dueCustom' },
];

export default function NewEntryScreen() {
  const params = useLocalSearchParams<{ type?: string; personId?: string }>();
  const { t, money, relative, currency, date: formatDate, dueLabel } = useI18n();

  const people = usePeople();
  const summaries = useSummaries();
  const addEntry = useLedger((state) => state.addEntry);
  const addPerson = useLedger((state) => state.addPerson);

  const [type, setType] = useState<EntryType>(params.type === 'got' ? 'got' : 'gave');
  const [personId, setPersonId] = useState<string | undefined>(params.personId);
  const [amountText, setAmountText] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString());
  /** When the money is expected back. Undefined means no date was set. */
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  const [picker, setPicker] = useState<'date' | 'due' | null>(null);
  const [picking, setPicking] = useState(!params.personId);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const amount = parseAmount(amountText);
  const selected = people.find((person) => person.id === personId);

  /** Which preset chip the current due date corresponds to, if any. */
  const dueMode: DueMode = useMemo(() => {
    if (!dueDate) return 'none';
    return ([7, 15, 30] as const).find((days) => isSameDay(dueDate, isoInDays(days))) ?? 'custom';
  }, [dueDate]);

  const chooseDue = (mode: DueMode) => {
    if (mode === 'none') setDueDate(undefined);
    else if (mode === 'custom') setPicker('due');
    else setDueDate(isoInDays(mode));
  };

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = summaries.filter((summary) =>
      needle ? summary.person.name.toLowerCase().includes(needle) : true,
    );
    return list.sort((a, b) => {
      const aTime = new Date(a.lastActivity ?? a.person.createdAt).getTime();
      const bTime = new Date(b.lastActivity ?? b.person.createdAt).getTime();
      return bTime - aTime;
    });
  }, [summaries, query]);

  const exactMatch = matches.some(
    (summary) => summary.person.name.toLowerCase() === query.trim().toLowerCase(),
  );

  const choose = (id: string) => {
    haptics.select();
    setPersonId(id);
    setPicking(false);
    setQuery('');
    setError(null);
  };

  const createAndChoose = () => {
    const person = addPerson({ name: query.trim() });
    choose(person.id);
  };

  const onSave = () => {
    if (!personId) {
      setError(t('errorChoosePerson'));
      setPicking(true);
      return;
    }
    if (amount <= 0) {
      setError(t('errorAmount'));
      return;
    }

    addEntry({ personId, type, amount, note, date, dueDate });
    haptics.success();
    dismiss();
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-row items-center justify-between px-5 pb-1 pt-2">
          <Text className="font-display text-[22px] text-ink-900">{t('newEntry')}</Text>
          <Pressable
            onPress={() => dismiss()}
            hitSlop={10}
            className="h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm shadow-ink-900/5"
            accessibilityRole="button"
            accessibilityLabel={t('close')}
          >
            <Ionicons name="close" size={20} color={palette.ink700} />
          </Pressable>
        </View>

        <ScrollView
          className="px-5"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <View className="mt-4 flex-row rounded-2xl bg-white p-1.5 shadow-sm shadow-ink-900/5">
            <Toggle
              label={t('youGaveShort')}
              caption={t('moneyOut')}
              active={type === 'gave'}
              tone="give"
              onPress={() => {
                haptics.select();
                setType('gave');
              }}
            />
            <Toggle
              label={t('youGotShort')}
              caption={t('moneyIn')}
              active={type === 'got'}
              tone="get"
              onPress={() => {
                haptics.select();
                setType('got');
              }}
            />
          </View>

          <View className="mt-4 rounded-4xl bg-white px-6 py-6 shadow-sm shadow-ink-900/5">
            <Text className="font-ui-semibold text-[12px] uppercase tracking-widest text-ink-400">
              {t('amount')}
            </Text>
            <View className="mt-1.5 flex-row items-center">
              <Text
                className={
                  type === 'gave'
                    ? 'mr-2 font-display text-[28px] text-give-500'
                    : 'mr-2 font-display text-[28px] text-get-500'
                }
              >
                {currency}
              </Text>
              {/* flex-1 + min-w-0 are load-bearing: an unconstrained TextInput
                  takes the browser's intrinsic input width and overflows the card. */}
              <TextInput
                value={amountText}
                onChangeText={(text) => {
                  setAmountText(text);
                  setError(null);
                }}
                placeholder="0"
                placeholderTextColor={palette.ink200}
                keyboardType="decimal-pad"
                autoFocus
                className={
                  type === 'gave'
                    ? 'min-w-0 flex-1 font-display text-[44px] text-give-600'
                    : 'min-w-0 flex-1 font-display text-[44px] text-get-600'
                }
                style={{ paddingVertical: 0 }}
              />
            </View>
          </View>

          <Text className="mb-2 mt-5 font-ui-semibold text-[13px] uppercase tracking-wider text-ink-400">
            {t('withWhom')}
          </Text>

          {selected && !picking ? (
            <PressableScale
              onPress={() => setPicking(true)}
              className="flex-row items-center rounded-3xl bg-white p-4 shadow-sm shadow-ink-900/5"
            >
              <Avatar name={selected.name} colorIndex={selected.colorIndex} />
              <View className="ml-3.5 flex-1">
                <Text className="font-ui-bold text-[16px] text-ink-900">{selected.name}</Text>
                <Text className="font-sans text-[13px] text-ink-400">{t('tapToChange')}</Text>
              </View>
              <Ionicons name="swap-vertical" size={18} color={palette.ink300} />
            </PressableScale>
          ) : (
            <View className="rounded-3xl bg-white p-3 shadow-sm shadow-ink-900/5">
              <View className="mb-1 flex-row items-center rounded-2xl bg-ink-50 px-3.5">
                <Ionicons name="search" size={17} color={palette.ink300} />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder={t('searchOrType')}
                  placeholderTextColor={palette.ink300}
                  className="h-11 min-w-0 flex-1 pl-2.5 font-ui-medium text-[15px] text-ink-900"
                />
              </View>

              {query.trim().length > 0 && !exactMatch ? (
                <Pressable
                  onPress={createAndChoose}
                  className="mt-1 flex-row items-center rounded-2xl px-2 py-3"
                >
                  <View className="h-10 w-10 items-center justify-center rounded-xl bg-brand-50">
                    <Ionicons name="person-add-outline" size={18} color={palette.brand600} />
                  </View>
                  <Text className="ml-3 flex-1 font-ui-semibold text-[15px] text-brand-600">
                    {t('addAsNewPerson', { name: query.trim() })}
                  </Text>
                </Pressable>
              ) : null}

              {matches.length === 0 && query.trim().length === 0 ? (
                <Text className="px-2 py-4 text-center font-sans text-[14px] text-ink-400">
                  {t('noPeopleTypeName')}
                </Text>
              ) : null}

              <ScrollView
                style={{ maxHeight: 260 }}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
              >
                {matches.map((summary) => (
                  <Pressable
                    key={summary.person.id}
                    onPress={() => choose(summary.person.id)}
                    className="flex-row items-center rounded-2xl px-2 py-2.5"
                  >
                    <Avatar
                      name={summary.person.name}
                      colorIndex={summary.person.colorIndex}
                      size="sm"
                    />
                    <Text className="ml-3 flex-1 font-ui-semibold text-[15px] text-ink-900">
                      {summary.person.name}
                    </Text>
                    <Text
                      className={
                        summary.balance === 0
                          ? 'font-ui-medium text-[13px] text-ink-300'
                          : summary.balance > 0
                            ? 'font-ui-medium text-[13px] text-get-600'
                            : 'font-ui-medium text-[13px] text-give-600'
                      }
                    >
                      {money(summary.balance)}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          <Text className="mb-2 mt-5 font-ui-semibold text-[13px] uppercase tracking-wider text-ink-400">
            {t('details')}
          </Text>

          <View className="rounded-3xl bg-white p-4 shadow-sm shadow-ink-900/5">
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder={t('notePlaceholder')}
              placeholderTextColor={palette.ink300}
              className="h-12 rounded-2xl bg-ink-50 px-4 font-ui-medium text-[15px] text-ink-900"
              maxLength={80}
            />

            <DateRow
              label={formatDate(date)}
              // `relative` falls back to the full date beyond a week, which
              // would just repeat the label.
              hint={relative(date) === formatDate(date) ? undefined : relative(date)}
              onPress={() => setPicker('date')}
            />
          </View>

          {type === 'gave' ? (
            <>
              <Text className="mb-2 mt-5 font-ui-semibold text-[13px] uppercase tracking-wider text-ink-400">
                {t('expectedReturn')}
              </Text>

              <View className="rounded-3xl bg-white p-4 shadow-sm shadow-ink-900/5">
                <View className="flex-row flex-wrap gap-2">
                  {DUE_PRESETS.map((preset) => (
                    <Chip
                      key={preset.labelKey}
                      label={t(preset.labelKey)}
                      active={dueMode === preset.mode}
                      onPress={() => chooseDue(preset.mode)}
                    />
                  ))}
                </View>

                {dueDate ? (
                  <DateRow
                    label={formatDate(dueDate)}
                    hint={dueLabel(dueDate)}
                    onPress={() => setPicker('due')}
                  />
                ) : (
                  <Text className="mt-3 font-sans text-[13px] leading-5 text-ink-400">
                    {t('dueHelper')}
                  </Text>
                )}
              </View>
            </>
          ) : null}

          {error ? (
            <Text className="mt-3 text-center font-ui-medium text-[13px] text-give-600">
              {error}
            </Text>
          ) : null}
        </ScrollView>

        <View className="border-t border-ink-100 bg-canvas px-5 pb-2 pt-3">
          <Button
            label={
              type === 'gave'
                ? t('saveGiven', { amount: money(amount) })
                : t('saveReceived', { amount: money(amount) })
            }
            icon="checkmark-circle"
            variant={type === 'gave' ? 'give' : 'get'}
            onPress={onSave}
            disabled={amount <= 0}
          />
        </View>
      </KeyboardAvoidingView>

      <CalendarSheet
        visible={picker === 'date'}
        title={t('selectDate')}
        value={date}
        // An entry records money that already moved, so it cannot be future-dated.
        maxDate={new Date().toISOString()}
        onSelect={setDate}
        onClose={() => setPicker(null)}
      />

      <CalendarSheet
        visible={picker === 'due'}
        title={t('selectReturnDate')}
        value={dueDate}
        // Money cannot be due back before it was handed over.
        minDate={date}
        onSelect={setDueDate}
        onClose={() => setPicker(null)}
      />
    </SafeAreaView>
  );
}

/** A tappable row that shows the chosen date and opens the calendar. */
function DateRow({
  label,
  hint,
  onPress,
}: {
  label: string;
  hint?: string;
  onPress: () => void;
}) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.99}
      className="mt-3 flex-row items-center justify-between rounded-2xl bg-ink-50 px-4 py-3"
    >
      <View className="flex-row items-center gap-2">
        <Ionicons name="calendar-outline" size={16} color={palette.ink400} />
        <Text className="font-ui-semibold text-[15px] text-ink-800">{label}</Text>
      </View>
      <View className="flex-row items-center gap-1">
        {hint ? (
          <Text className="font-ui-medium text-[13px] text-brand-700">{hint}</Text>
        ) : null}
        <Ionicons name="chevron-forward" size={15} color={palette.ink300} />
      </View>
    </PressableScale>
  );
}

function Toggle({
  label,
  caption,
  active,
  tone,
  onPress,
}: {
  label: string;
  caption: string;
  active: boolean;
  tone: 'get' | 'give';
  onPress: () => void;
}) {
  const give = tone === 'give';

  const activeClass = give
    ? 'flex-1 items-center rounded-xl bg-give-500 py-3'
    : 'flex-1 items-center rounded-xl bg-get-500 py-3';

  return (
    <Pressable onPress={onPress} className={active ? activeClass : 'flex-1 items-center py-3'}>
      <Text
        className={
          active ? 'font-ui-bold text-[15px] text-white' : 'font-ui-bold text-[15px] text-ink-400'
        }
        numberOfLines={1}
      >
        {label}
      </Text>
      <Text
        className={
          active ? 'font-sans text-[11px] text-white/80' : 'font-sans text-[11px] text-ink-300'
        }
        numberOfLines={1}
      >
        {caption}
      </Text>
    </Pressable>
  );
}
