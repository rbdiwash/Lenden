import colors from '@/theme/colors';

/**
 * Raw colour values for props that cannot take a Tailwind class — icon tints,
 * placeholder text, the status bar.
 *
 * These are derived from `theme/colors.js`, which is the single place to edit
 * when recolouring the app. Do not hard-code hex values here.
 */
export const palette = {
  brand50: colors.brand[50],
  brand100: colors.brand[100],
  brand200: colors.brand[200],
  brand300: colors.brand[300],
  brand400: colors.brand[400],
  brand500: colors.brand[500],
  brand600: colors.brand[600],
  brand700: colors.brand[700],
  brand800: colors.brand[800],
  brand900: colors.brand[900],

  get500: colors.get[500],
  get600: colors.get[600],
  get700: colors.get[700],

  give500: colors.give[500],
  give600: colors.give[600],
  give700: colors.give[700],

  warn600: colors.warn[600],
  warn700: colors.warn[700],

  ink100: colors.ink[100],
  ink200: colors.ink[200],
  ink300: colors.ink[300],
  ink400: colors.ink[400],
  ink500: colors.ink[500],
  ink700: colors.ink[700],
  ink900: colors.ink[900],

  canvas: colors.canvas,
  white: '#FFFFFF',
} as const;

export const avatarColors = colors.avatars;

export function avatarColor(index: number) {
  return avatarColors[Math.abs(index) % avatarColors.length];
}
