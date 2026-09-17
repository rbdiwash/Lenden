import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import { useI18n } from '@/hooks/useI18n';
import { dayKey, isoFromParts } from '@/lib/format';
import { haptics } from '@/lib/haptics';
import { MONTHS_FULL, WEEKDAYS } from '@/lib/i18n';
import { palette } from '@/lib/theme';

interface Props {
  visible: boolean;
  title: string;
  /** Currently selected day, ISO. */
  value?: string;
  /** Inclusive bounds. Days outside are shown greyed out and cannot be picked. */
  minDate?: string;
  maxDate?: string;
  onSelect: (iso: string) => void;
  onClose: () => void;
}

/**
 * A month calendar in a bottom sheet.
 *
 * Hand-built rather than using a native date picker so the control looks and
 * behaves identically on iOS, Android and web, and so it inherits the app's
 * own colours and typography.
 */
export function CalendarSheet({ visible, ...rest }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={rest.onClose}>
      {/* Mounting the body only while open resets the month to the selected
          date every time the sheet is reopened. */}
      {visible ? <Sheet {...rest} /> : null}
    </Modal>
  );
}

function Sheet({ title, value, minDate, maxDate, onSelect, onClose }: Omit<Props, 'visible'>) {
  const { t, lang } = useI18n();

  const selectedKey = value ? dayKey(value) : null;
  const todayKey = keyOf(new Date());
  const minKey = minDate ? dayKey(minDate) : null;
  const maxKey = maxDate ? dayKey(maxDate) : null;

  const [cursor, setCursor] = useState(() => {
    const start = value ? new Date(value) : new Date();
    return { year: start.getFullYear(), month: start.getMonth() };
  });

  const weeks = useMemo(() => buildWeeks(cursor.year, cursor.month), [cursor]);

  const shiftMonth = (delta: number) => {
    haptics.select();
    setCursor((current) => {
      const moved = new Date(current.year, current.month + delta, 1);
      return { year: moved.getFullYear(), month: moved.getMonth() };
    });
  };

  const isBlocked = (key: string) =>
    Boolean((minKey && key < minKey) || (maxKey && key > maxKey));

  const pick = (day: Date) => {
    haptics.select();
    onSelect(isoFromParts(day.getFullYear(), day.getMonth(), day.getDate()));
    onClose();
  };

  return (
    <Pressable className="flex-1 justify-end bg-black/40" onPress={onClose}>
      {/* Taps inside the sheet are swallowed here so they do not close it. */}
      <Pressable className="rounded-t-4xl bg-white px-5 pb-8 pt-5" onPress={() => {}}>
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="font-ui-bold text-[18px] text-ink-900">{title}</Text>
          <Pressable
            onPress={onClose}
            hitSlop={10}
            className="h-9 w-9 items-center justify-center rounded-full bg-ink-50"
            accessibilityRole="button"
            accessibilityLabel={t('close')}
          >
            <Ionicons name="close" size={18} color={palette.ink700} />
          </Pressable>
        </View>

        <View className="mb-2 flex-row items-center justify-between">
          <Pressable
            onPress={() => shiftMonth(-1)}
            hitSlop={8}
            className="h-10 w-10 items-center justify-center rounded-full bg-ink-50"
            accessibilityRole="button"
            accessibilityLabel={t('previousMonth')}
          >
            <Ionicons name="chevron-back" size={18} color={palette.ink700} />
          </Pressable>

          <Text className="font-ui-bold text-[16px] text-ink-900">
            {MONTHS_FULL[lang][cursor.month]} {cursor.year}
          </Text>

          <Pressable
            onPress={() => shiftMonth(1)}
            hitSlop={8}
            className="h-10 w-10 items-center justify-center rounded-full bg-ink-50"
            accessibilityRole="button"
            accessibilityLabel={t('nextMonth')}
          >
            <Ionicons name="chevron-forward" size={18} color={palette.ink700} />
          </Pressable>
        </View>

        <View className="flex-row">
          {WEEKDAYS[lang].map((label, index) => (
            <View key={index} className="flex-1 items-center py-2">
              <Text className="font-ui-semibold text-[12px] text-ink-400">{label}</Text>
            </View>
          ))}
        </View>

        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} className="flex-row">
            {week.map((day, dayIndex) => {
              if (!day) return <View key={dayIndex} className="flex-1 py-1" />;

              const key = keyOf(day);
              const blocked = isBlocked(key);
              const selected = key === selectedKey;
              const isToday = key === todayKey;

              return (
                <View key={dayIndex} className="flex-1 items-center py-1">
                  <Pressable
                    disabled={blocked}
                    onPress={() => pick(day)}
                    className={
                      selected
                        ? 'h-10 w-10 items-center justify-center rounded-full bg-brand-600'
                        : isToday
                          ? 'h-10 w-10 items-center justify-center rounded-full border border-brand-400'
                          : 'h-10 w-10 items-center justify-center rounded-full'
                    }
                    accessibilityRole="button"
                    accessibilityLabel={`${day.getDate()} ${MONTHS_FULL[lang][day.getMonth()]} ${day.getFullYear()}`}
                  >
                    <Text
                      className={
                        selected
                          ? 'font-ui-bold text-[15px] text-white'
                          : blocked
                            ? 'font-ui-medium text-[15px] text-ink-200'
                            : isToday
                              ? 'font-ui-bold text-[15px] text-brand-700'
                              : 'font-ui-medium text-[15px] text-ink-800'
                      }
                    >
                      {day.getDate()}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        ))}

        <Pressable
          onPress={() => pick(new Date())}
          disabled={isBlocked(todayKey)}
          className={
            isBlocked(todayKey)
              ? 'mt-4 items-center rounded-2xl bg-ink-50 py-3 opacity-40'
              : 'mt-4 items-center rounded-2xl bg-ink-50 py-3'
          }
        >
          <Text className="font-ui-semibold text-[15px] text-ink-800">{t('jumpToToday')}</Text>
        </Pressable>
      </Pressable>
    </Pressable>
  );
}

/** `YYYY-MM-DD` for a local Date, matching `dayKey`'s output. */
function keyOf(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Calendar rows for a month, padded with nulls so every row has seven cells. */
function buildWeeks(year: number, month: number): Array<Array<Date | null>> {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: Array<Date | null> = Array.from({ length: firstWeekday }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(new Date(year, month, day));
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: Array<Array<Date | null>> = [];
  for (let index = 0; index < cells.length; index += 7) weeks.push(cells.slice(index, index + 7));
  return weeks;
}
