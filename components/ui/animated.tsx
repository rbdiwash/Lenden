import { cssInterop } from 'nativewind';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';

/**
 * NativeWind does not style Reanimated's components out of the box, so a
 * `className` on a plain `Animated.View` is silently dropped. Registering them
 * once here — and importing Animated from this module everywhere — keeps
 * animated surfaces styled like every other view.
 */
export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

cssInterop(Animated.View, { className: 'style' });
cssInterop(Animated.Text, { className: 'style' });
cssInterop(AnimatedPressable, { className: 'style' });

export { Animated };
export default Animated;
