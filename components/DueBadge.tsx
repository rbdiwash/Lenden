import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { useI18n } from '@/hooks/useI18n';
import { dueState } from '@/lib/format';
import { palette } from '@/lib/theme';

interface Props {
  dueDate: string;
  /** `sm` sits inside a list row; `md` is for the person screen. */
  size?: 'sm' | 'md';
}

const tone = {
  overdue: {
    box: 'bg-give-50',
    text: 'text-give-600',
    icon: 'alert-circle' as const,
    color: palette.give600,
  },
  today: {
    box: 'bg-warn-50',
    text: 'text-warn-600',
    icon: 'time' as const,
    color: palette.warn600,
  },
  soon: {
    box: 'bg-warn-50',
    text: 'text-warn-600',
    icon: 'time-outline' as const,
    color: palette.warn600,
  },
  later: {
    box: 'bg-ink-100',
    text: 'text-ink-500',
    icon: 'calendar-outline' as const,
    color: palette.ink500,
  },
};

/** "Due in 5 days" / "Overdue by 3 days", coloured by urgency. */
export function DueBadge({ dueDate, size = 'sm' }: Props) {
  const { dueLabel } = useI18n();
  const style = tone[dueState(dueDate)];
  const pad = size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-1';
  const font = size === 'sm' ? 'text-[11px]' : 'text-[13px]';

  return (
    <View className={`flex-row items-center gap-1 self-start rounded-full ${style.box} ${pad}`}>
      <Ionicons name={style.icon} size={size === 'sm' ? 11 : 13} color={style.color} />
      <Text className={`font-ui-semibold ${font} ${style.text}`}>{dueLabel(dueDate)}</Text>
    </View>
  );
}
