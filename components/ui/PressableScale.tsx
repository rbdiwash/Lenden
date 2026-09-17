import { type ReactNode } from 'react';
import type { PressableProps, ViewStyle } from 'react-native';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/ui/animated';

interface Props extends Omit<PressableProps, 'style' | 'children'> {
  children: ReactNode;
  className?: string;
  style?: ViewStyle;
  /** How far the surface shrinks while held. */
  scaleTo?: number;
}

/**
 * Every tappable surface in the app shrinks slightly while held. It is the one
 * interaction detail that makes a React Native list feel native.
 */
export function PressableScale({
  children,
  className,
  style,
  scaleTo = 0.97,
  disabled,
  ...rest
}: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      disabled={disabled}
      className={className}
      style={[animatedStyle, style]}
      onPressIn={() => {
        scale.value = withSpring(scaleTo, { damping: 18, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 18, stiffness: 320 });
      }}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}
