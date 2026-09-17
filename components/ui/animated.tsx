import { cssInterop } from 'nativewind';
import Animated from 'react-native-reanimated';

/**
 * NativeWind does not style Reanimated's components out of the box, so a
 * `className` on a plain `Animated.View` is silently dropped. Registering them
 * once here — and importing Animated from this module everywhere — keeps
 * animated surfaces styled like every other view.
 *
 * Only register components NativeWind can actually reach. Registering a
 * component built with `Animated.createAnimatedComponent(...)` appears to work
 * on web but drops every class on native, so do not add one here.
 */
cssInterop(Animated.View, { className: 'style' });
cssInterop(Animated.Text, { className: 'style' });

export { Animated };
export default Animated;
