import "../global.css";

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FadeOut } from "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { BrandedSplash } from "@/components/BrandedSplash";
import Animated from "@/components/ui/animated";
import { palette } from "@/lib/theme";
import { useLedger } from "@/store/useLedger";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const hydrated = useLedger((state) => state.hydrated);
  const setHydrated = useLedger((state) => state.setHydrated);
  const onboarded = useLedger((state) => state.settings.onboarded);

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  // If storage never answers we still show the app rather than hanging on splash.
  useEffect(() => {
    const timer = setTimeout(() => setHydrated(true), 2500);
    return () => clearTimeout(timer);
  }, [setHydrated]);

  const ready = (fontsLoaded || Boolean(fontError)) && hydrated;
  const [brandedVisible, setBrandedVisible] = useState(true);

  useEffect(() => {
    if (!ready) return;
    SplashScreen.hideAsync().catch(() => {});
    // Hold the artwork briefly so it does not flash past on a fast device.
    const timer = setTimeout(() => setBrandedVisible(false), 1500);
    return () => clearTimeout(timer);
  }, [ready]);

  if (!ready) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BrandedSplash />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: palette.canvas }}
    >
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: palette.canvas },
          }}
        >
          {/* First run: pick a language and currency before anything else. */}
          <Stack.Protected guard={!onboarded}>
            <Stack.Screen name="welcome" />
          </Stack.Protected>

          <Stack.Protected guard={onboarded}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="person/[id]" />
            <Stack.Screen
              name="new-entry"
              options={{ presentation: "modal" }}
            />
            <Stack.Screen
              name="new-person"
              options={{ presentation: "modal" }}
            />
          </Stack.Protected>
        </Stack>

        {brandedVisible ? (
          <Animated.View
            exiting={FadeOut.duration(400)}
            style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}
          >
            <BrandedSplash />
          </Animated.View>
        ) : null}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
