import { ActivityIndicator, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { PressableScale } from '@/components/ui/PressableScale';
import { palette } from '@/lib/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'get' | 'give';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const surface: Record<Variant, string> = {
  primary: 'bg-brand-600',
  secondary: 'bg-white border border-ink-200',
  ghost: 'bg-transparent',
  danger: 'bg-give-50 border border-give-100',
  get: 'bg-get-500',
  give: 'bg-give-500',
};

const labelClass: Record<Variant, string> = {
  primary: 'text-white',
  secondary: 'text-ink-800',
  ghost: 'text-ink-500',
  danger: 'text-give-600',
  get: 'text-white',
  give: 'text-white',
};

const iconTint: Record<Variant, string> = {
  primary: palette.white,
  secondary: palette.ink700,
  ghost: palette.ink500,
  danger: palette.give600,
  get: palette.white,
  give: palette.white,
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  loading,
  fullWidth = true,
  className = '',
}: Props) {
  const isDisabled = disabled || loading;
  const width = fullWidth ? 'w-full' : 'self-start px-6';
  const opacity = isDisabled ? 'opacity-50' : '';

  return (
    <PressableScale
      onPress={onPress}
      disabled={isDisabled}
      className={`${width} ${opacity} overflow-hidden rounded-2xl ${surface[variant]} ${className}`}
    >
      <View className="h-14 flex-row items-center justify-center gap-2 px-5">
        {loading ? (
          <ActivityIndicator color={iconTint[variant]} />
        ) : (
          <>
            {icon ? <Ionicons name={icon} size={19} color={iconTint[variant]} /> : null}
            <Text className={`font-ui-bold text-[16px] ${labelClass[variant]}`}>{label}</Text>
          </>
        )}
      </View>
    </PressableScale>
  );
}
