import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { useI18n } from '@/hooks/useI18n';
import { palette } from '@/lib/theme';

export default function NotFound() {
  const { t } = useI18n();

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-canvas px-8">
      <View className="h-20 w-20 items-center justify-center rounded-3xl bg-brand-50">
        <Ionicons name="compass-outline" size={34} color={palette.brand600} />
      </View>
      <Text className="mt-5 font-ui-bold text-[20px] text-ink-900">{t('notFoundTitle')}</Text>
      <Text className="mt-2 text-center font-sans text-[15px] text-ink-400">
        {t('notFoundBody')}
      </Text>
      <View className="mt-6 w-full max-w-xs">
        <Button
          label={t('backToHome')}
          icon="home-outline"
          onPress={() => router.replace('/')}
        />
      </View>
    </SafeAreaView>
  );
}
