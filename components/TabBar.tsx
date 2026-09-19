import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useI18n } from '@/hooks/useI18n';
import { haptics } from '@/lib/haptics';
import type { TKey } from '@/lib/i18n';
import { palette } from '@/lib/theme';

type IconPair = [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap];

const TABS: Record<string, { labelKey: TKey; icons: IconPair }> = {
  index: { labelKey: 'tabHome', icons: ['home', 'home-outline'] },
  people: { labelKey: 'tabPeople', icons: ['people', 'people-outline'] },
  activity: { labelKey: 'tabActivity', icons: ['receipt', 'receipt-outline'] },
  settings: { labelKey: 'tabSettings', icons: ['settings', 'settings-outline'] },
};

/** Height of the floating bar. */
export const TAB_BAR_HEIGHT = 68;

/** Bottom padding a tab screen needs so content clears the bar and its raised "+". */
export const TAB_BAR_SPACE = TAB_BAR_HEIGHT + 76;

export function TabBar({ state, navigation, insets }: BottomTabBarProps) {
  const routes = state.routes;
  const left = routes.slice(0, 2);
  const right = routes.slice(2);

  const onPress = (routeKey: string, routeName: string, isFocused: boolean) => {
    const event = navigation.emit({ type: 'tabPress', target: routeKey, canPreventDefault: true });
    if (isFocused || event.defaultPrevented) return;
    haptics.select();
    navigation.navigate(routeName);
  };

  return (
    <View
      className="absolute inset-x-0 bottom-0 items-center px-5"
      style={{ paddingBottom: Math.max(insets.bottom, 12), pointerEvents: 'box-none' }}
    >
      <View
        className="w-full max-w-md flex-row items-center rounded-[28px] bg-white px-2 shadow-xl shadow-ink-900/20"
        style={{ height: TAB_BAR_HEIGHT }}
      >
        {left.map((route) => (
          <TabButton
            key={route.key}
            routeName={route.name}
            focused={state.routes[state.index].key === route.key}
            onPress={() => onPress(route.key, route.name, state.routes[state.index].key === route.key)}
          />
        ))}

        <View className="w-16" />

        {right.map((route) => (
          <TabButton
            key={route.key}
            routeName={route.name}
            focused={state.routes[state.index].key === route.key}
            onPress={() => onPress(route.key, route.name, state.routes[state.index].key === route.key)}
          />
        ))}
      </View>

      <AddButton />
    </View>
  );
}

function TabButton({
  routeName,
  focused,
  onPress,
}: {
  routeName: string;
  focused: boolean;
  onPress: () => void;
}) {
  const { t } = useI18n();
  const tab = TABS[routeName];
  if (!tab) return <View className="flex-1" />;

  const [active, inactive] = tab.icons;

  return (
    <Pressable onPress={onPress} className="flex-1 items-center justify-center py-2">
      <Ionicons
        name={focused ? active : inactive}
        size={22}
        color={focused ? palette.brand700 : palette.ink300}
      />
      <Text
        className={
          focused
            ? 'mt-1 font-ui-semibold text-[11px] text-brand-700'
            : 'mt-1 font-ui-medium text-[11px] text-ink-300'
        }
        numberOfLines={1}
      >
        {t(tab.labelKey)}
      </Text>
    </Pressable>
  );
}

/** The raised "+" that opens the new entry sheet from anywhere in the app. */
function AddButton() {
  const { t } = useI18n();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View
      className="absolute inset-x-0 items-center"
      style={{ bottom: TAB_BAR_HEIGHT - 24, pointerEvents: 'box-none' }}
    >
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.9, { damping: 16, stiffness: 320 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 16, stiffness: 320 });
        }}
        onPress={() => {
          haptics.press();
          router.push('/new-entry');
        }}
        accessibilityRole="button"
        accessibilityLabel={t('addEntryLabel')}
      >
        <Animated.View style={animatedStyle}>
          {/* Orange against the teal chrome, mirroring the two-tone logo. */}
          <View className="h-16 w-16 items-center justify-center rounded-full border-4 border-canvas bg-accent-500 shadow-xl shadow-accent-700/40">
            <Ionicons name="add" size={30} color="#FFFFFF" />
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}
