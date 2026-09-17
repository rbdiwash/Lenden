import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { PressableScale } from '@/components/ui/PressableScale';
import { useI18n } from '@/hooks/useI18n';
import { palette } from '@/lib/theme';
import type { PersonSummary } from '@/lib/types';

interface Props {
  summary: PersonSummary;
  onPress: () => void;
}

export function PersonRow({ summary, onPress }: Props) {
  const { t, tp, money, relative } = useI18n();
  const { person, balance, entryCount, lastActivity } = summary;
  const settled = balance === 0;

  const subtitle = lastActivity
    ? `${relative(lastActivity)} · ${tp('entryCount', entryCount)}`
    : t('noEntriesYet');

  return (
    <PressableScale
      onPress={onPress}
      className="mb-3 flex-row items-center rounded-3xl bg-white p-4 shadow-sm shadow-ink-900/5"
    >
      <Avatar name={person.name} colorIndex={person.colorIndex} />

      <View className="ml-3.5 flex-1">
        <Text className="font-ui-bold text-[16px] text-ink-900" numberOfLines={1}>
          {person.name}
        </Text>
        <Text className="mt-0.5 font-sans text-[13px] text-ink-400" numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      <View className="items-end">
        {settled ? (
          <>
            <Text className="font-ui-bold text-[16px] text-ink-300">{money(0)}</Text>
            <Text className="mt-0.5 font-ui-medium text-[12px] text-ink-300">{t('settled')}</Text>
          </>
        ) : (
          <>
            <Text
              className={
                balance > 0
                  ? 'font-ui-bold text-[16px] text-get-600'
                  : 'font-ui-bold text-[16px] text-give-600'
              }
            >
              {money(balance)}
            </Text>
            <Text
              className={
                balance > 0
                  ? 'mt-0.5 font-ui-medium text-[12px] text-get-600'
                  : 'mt-0.5 font-ui-medium text-[12px] text-give-600'
              }
            >
              {balance > 0 ? t('youllGet') : t('youllGive')}
            </Text>
          </>
        )}
      </View>

      <Ionicons name="chevron-forward" size={18} color={palette.ink300} style={{ marginLeft: 6 }} />
    </PressableScale>
  );
}
