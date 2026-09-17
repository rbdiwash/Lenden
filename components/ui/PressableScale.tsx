import { useState, type ReactNode } from 'react';
import {
  Pressable,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

interface Props extends Omit<PressableProps, 'style' | 'children'> {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  /** How far the surface shrinks while held. */
  scaleTo?: number;
}

/**
 * Every tappable surface shrinks slightly while held.
 *
 * This is a plain `Pressable` on purpose. An earlier version wrapped
 * `Animated.createAnimatedComponent(Pressable)` so Reanimated could spring the
 * scale, but NativeWind does not apply `className` to that component on native
 * — every class was silently dropped, so cards lost their background, padding
 * and layout and white button labels ended up invisible on a white screen. It
 * looked correct on web only because react-native-web takes a different path.
 *
 * Keep the outer element a component NativeWind supports directly.
 */
export function PressableScale({
  children,
  className,
  style,
  scaleTo = 0.97,
  disabled,
  onPressIn,
  onPressOut,
  ...rest
}: Props) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      disabled={disabled}
      className={className}
      style={[pressed ? { transform: [{ scale: scaleTo }] } : null, style]}
      onPressIn={(event: GestureResponderEvent) => {
        setPressed(true);
        onPressIn?.(event);
      }}
      onPressOut={(event: GestureResponderEvent) => {
        setPressed(false);
        onPressOut?.(event);
      }}
      {...rest}
    >
      {children}
    </Pressable>
  );
}
