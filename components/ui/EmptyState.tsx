import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { FadeInDown } from 'react-native-reanimated';

import Animated from '@/components/ui/animated';

import { Button } from '@/components/ui/Button';
import { palette } from '@/lib/theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, body, actionLabel, onAction }: Props) {
  return (
    <Animated.View entering={FadeInDown.duration(380)} className="items-center px-8 py-14">
      <View className="h-20 w-20 items-center justify-center rounded-3xl bg-brand-50">
        <Ionicons name={icon} size={34} color={palette.brand600} />
      </View>
      <Text className="mt-5 text-center font-ui-bold text-[19px] text-ink-900">{title}</Text>
      <Text className="mt-2 text-center font-sans text-[15px] leading-6 text-ink-400">{body}</Text>
      {actionLabel && onAction ? (
        <View className="mt-6 w-full max-w-xs">
          <Button label={actionLabel} onPress={onAction} icon="add" />
        </View>
      ) : null}
    </Animated.View>
  );
}
