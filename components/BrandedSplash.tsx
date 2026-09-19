import { Image, useWindowDimensions, View } from 'react-native';

/**
 * The full-screen splash artwork, drawn by the app itself.
 *
 * Android 12+ replaced the old full-screen splash with a system API that only
 * ever centres a small icon on a solid colour, so `splash-screen.png` cannot be
 * the OS splash there however it is configured. Rendering it as the app's own
 * first frame brings the branded screen back on both platforms — the sequence
 * becomes: system icon splash → this artwork → the app.
 *
 * The size comes from `useWindowDimensions` rather than `StyleSheet.absoluteFill`
 * on purpose: absolute fill resolves against the nearest sized ancestor, and
 * when that ancestor has no definite height the image lays out at its own
 * natural size and blows the page out instead of covering it.
 */
export function BrandedSplash() {
  const { width, height } = useWindowDimensions();

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
        backgroundColor: '#FFFFFF',
      }}
    >
      <Image
        source={require('../assets/splash-screen.png')}
        style={{ width, height }}
        // The artwork is wider than a phone, so `cover` trims the sides. All of
        // the logo and wording sits well inside that safe area.
        resizeMode="cover"
      />
    </View>
  );
}
