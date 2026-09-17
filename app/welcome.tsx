import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';
import { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import Animated from '@/components/ui/animated';
import { Button } from '@/components/ui/Button';
import { PressableScale } from '@/components/ui/PressableScale';
import { useI18n } from '@/hooks/useI18n';
import { CURRENCIES } from '@/lib/currencies';
import { haptics } from '@/lib/haptics';
import { LANGUAGES } from '@/lib/i18n';
import { palette } from '@/lib/theme';
import { useLedger } from '@/store/useLedger';

/**
 * First run only. Language comes first so the rest of the screen — and the
 * whole app behind it — is already readable when the currency is chosen.
 */
export default function WelcomeScreen() {
  const { t } = useI18n();
  const settings = useLedger((state) => state.settings);
  const updateSettings = useLedger((state) => state.updateSettings);

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top', 'bottom']}>
      <ScrollView
        className="px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Animated.View entering={FadeInDown.duration(420)} className="pb-8 pt-10">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-brand-600">
            <Ionicons name="wallet-outline" size={26} color="#FFFFFF" />
          </View>
          <Text className="mt-5 font-display text-[32px] leading-[38px] text-ink-900">
            {t('welcomeTitle')}
          </Text>
          <Text className="mt-2 font-sans text-[15px] leading-6 text-ink-500">
            {t('welcomeSubtitle')}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(420).delay(80)}>
          <Text className="mb-3 font-ui-semibold text-[13px] uppercase tracking-wider text-ink-400">
            {t('chooseLanguage')}
          </Text>

          <View className="flex-row gap-3">
            {LANGUAGES.map((option) => {
              const active = settings.language === option.code;
              return (
                <PressableScale
                  key={option.code}
                  onPress={() => {
                    haptics.select();
                    updateSettings({ language: option.code });
                  }}
                  className={
                    active
                      ? 'flex-1 items-center rounded-3xl border-2 border-brand-600 bg-brand-50 p-4'
                      : 'flex-1 items-center rounded-3xl border-2 border-ink-200 bg-white p-4'
                  }
                >
                  <Text
                    className={
                      active
                        ? 'font-ui-bold text-[18px] text-brand-700'
                        : 'font-ui-bold text-[18px] text-ink-800'
                    }
                  >
                    {option.label}
                  </Text>
                  <Text className="mt-0.5 font-sans text-[12px] text-ink-400">
                    {option.english}
                  </Text>
                </PressableScale>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(420).delay(140)} className="mt-8">
          <Text className="mb-3 font-ui-semibold text-[13px] uppercase tracking-wider text-ink-400">
            {t('chooseCurrency')}
          </Text>

          <View className="gap-2.5">
            {CURRENCIES.map((option) => {
              const active = settings.currency === option.symbol;
              return (
                <PressableScale
                  key={option.symbol}
                  scaleTo={0.985}
                  onPress={() => {
                    haptics.select();
                    updateSettings({ currency: option.symbol });
                  }}
                  className={
                    active
                      ? 'flex-row items-center rounded-2xl border-2 border-brand-600 bg-brand-50 p-3.5'
                      : 'flex-row items-center rounded-2xl border-2 border-ink-200 bg-white p-3.5'
                  }
                >
                  <View
                    className={
                      active
                        ? 'h-11 w-11 items-center justify-center rounded-xl bg-brand-600'
                        : 'h-11 w-11 items-center justify-center rounded-xl bg-ink-50'
                    }
                  >
                    <Text
                      className={
                        active
                          ? 'font-ui-bold text-[18px] text-white'
                          : 'font-ui-bold text-[18px] text-ink-700'
                      }
                    >
                      {option.symbol}
                    </Text>
                  </View>
                  <Text className="ml-3.5 flex-1 font-ui-semibold text-[15px] text-ink-900">
                    {t(option.nameKey)}
                  </Text>
                  {active ? (
                    <Ionicons name="checkmark-circle" size={22} color={palette.brand600} />
                  ) : null}
                </PressableScale>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>

      <View className="border-t border-ink-100 bg-canvas px-6 pb-2 pt-3">
        <Button
          label={t('getStarted')}
          icon="arrow-forward"
          onPress={() => {
            haptics.success();
            updateSettings({ onboarded: true });
          }}
        />
        <Text className="mt-3 text-center font-sans text-[12px] text-ink-400">
          {t('changeLaterHint')}
        </Text>
      </View>
    </SafeAreaView>
  );
}
