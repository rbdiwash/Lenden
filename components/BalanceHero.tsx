import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { FadeInDown } from 'react-native-reanimated';

import Animated from '@/components/ui/animated';
import { useCountUp } from '@/hooks/useCountUp';
import { useI18n } from '@/hooks/useI18n';
import colors from '@/theme/colors';
import type { LedgerTotals } from '@/lib/types';

interface Props {
  totals: LedgerTotals;
  greeting: string;
}

export function BalanceHero({ totals, greeting }: Props) {
  const { t, money } = useI18n();

  const net = useCountUp(totals.net);
  const receivable = useCountUp(totals.receivable);
  const payable = useCountUp(totals.payable);

  const settled = Math.abs(totals.net) < 0.005;
  const caption = settled
    ? t('heroSettled')
    : totals.net > 0
      ? t('heroReceive')
      : t('heroPay');

  return (
    <Animated.View entering={FadeInDown.duration(420)}>
      <View className="overflow-hidden rounded-4xl bg-brand-700 p-6">
        <View className="flex-row items-center justify-between">
          <Text className="font-ui-medium text-[14px] text-brand-100">{greeting}</Text>
          <View className="h-9 w-9 items-center justify-center rounded-full bg-white/15">
            <Ionicons name="wallet-outline" size={18} color="#FFFFFF" />
          </View>
        </View>

        <Text className="mt-5 font-ui-medium text-[13px] uppercase tracking-widest text-brand-200">
          {caption}
        </Text>
        <Text className="mt-1 font-display text-[40px] leading-[46px] text-white">
          {money(net)}
        </Text>

        <View className="mt-6 flex-row gap-3">
          <Stat label={t('youllGet')} value={money(receivable)} icon="arrow-down-circle" />
          <Stat label={t('youllGive')} value={money(payable)} icon="arrow-up-circle" />
        </View>
      </View>
    </Animated.View>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View className="flex-1 rounded-2xl bg-white/15 p-4">
      <View className="flex-row items-center gap-1.5">
        <Ionicons name={icon} size={14} color={colors.brand[100]} />
        <Text className="font-ui-medium text-[12px] text-brand-100">{label}</Text>
      </View>
      <Text className="mt-1.5 font-ui-bold text-[19px] text-white" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}
