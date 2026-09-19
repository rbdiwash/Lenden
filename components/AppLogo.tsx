import { Image } from 'react-native';

import { useI18n } from '@/hooks/useI18n';
import type { Language } from '@/lib/i18n';

/**
 * The brand lockup, which carries its own tagline in the artwork. There is a
 * version per language, so the header speaks the same language as the rest of
 * the app. Ratios are the artwork's own dimensions — keep them in step if the
 * files are re-exported.
 */
const LOCKUPS: Record<Language, { source: number; ratio: number }> = {
  en: { source: require('../assets/len-den-primary-english.png'), ratio: 1520 / 440 },
  ne: { source: require('../assets/len-den-primary-nepali.png'), ratio: 1390 / 450 },
};

interface Props {
  /** Rendered height in points; width follows the artwork's aspect ratio. */
  height?: number;
}

export function AppLogo({ height = 56 }: Props) {
  const { lang, t } = useI18n();
  const lockup = LOCKUPS[lang] ?? LOCKUPS.en;

  return (
    <Image
      source={lockup.source}
      style={{ height, width: height * lockup.ratio }}
      resizeMode="contain"
      accessible
      accessibilityRole="image"
      accessibilityLabel={t('appName')}
    />
  );
}
