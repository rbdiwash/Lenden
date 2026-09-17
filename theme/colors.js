/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  THE ONLY FILE YOU NEED TO EDIT TO RECOLOUR LEN DEN
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Both `tailwind.config.js` (the `bg-brand-600` style classes) and
 *  `lib/theme.ts` (raw values for icons, placeholders, the status bar) read
 *  from here, so a hex changed here changes it everywhere.
 *
 *  To try a different accent, change ACTIVE_BRAND below to any key of
 *  BRAND_PRESETS, then restart the bundler with `npx expo start --clear`
 *  (Tailwind only reads this file at startup).
 *
 *  Flat fills only — this app deliberately uses no gradients.
 */

/* -------------------------------------------------------------------------- */
/*  Accent presets                                                            */
/* -------------------------------------------------------------------------- */

const BRAND_PRESETS = {
  /**
   * Default. Deep petrol teal. Chosen because the accent has to sit next to
   * green "money you'll get" and red "money you'll give" without being
   * mistaken for either — an avocado accent reads as another success colour.
   */
  teal: {
    50: '#ECFAF8',
    100: '#D0F2ED',
    200: '#A3E5DC',
    300: '#6FD2C6',
    400: '#3DB8AA',
    500: '#1D9A8C',
    600: '#0F766E',
    700: '#0C5D57',
    800: '#0A4944',
    900: '#073330',
  },

  /** Yellow-green. Warm and distinctive, but close to the "you'll get" green. */
  avocado: {
    50: '#F5F9EC',
    100: '#E8F2D2',
    200: '#D3E5AB',
    300: '#BAD67F',
    400: '#A0C557',
    500: '#87AF37',
    600: '#6B8E23',
    700: '#55721B',
    800: '#425915',
    900: '#2E3E0E',
  },

  /** Classic banking blue. */
  navy: {
    50: '#EEF2F9',
    100: '#D8E1F2',
    200: '#B4C6E5',
    300: '#8AA6D4',
    400: '#5F84C0',
    500: '#3D63A8',
    600: '#2B4C8C',
    700: '#223C70',
    800: '#1A2E56',
    900: '#12203C',
  },

  /** Near-black. Lets the green/red money colours carry all the meaning. */
  charcoal: {
    50: '#F2F3F2',
    100: '#E3E5E3',
    200: '#C6CAC6',
    300: '#9CA29C',
    400: '#6F766F',
    500: '#4B524B',
    600: '#343A34',
    700: '#262B26',
    800: '#1A1E1A',
    900: '#101310',
  },

  /** Terracotta. Warm and earthy — note it sits fairly close to the red. */
  clay: {
    50: '#FDF3EF',
    100: '#FAE2D9',
    200: '#F3C3B2',
    300: '#E89E84',
    400: '#DA7A59',
    500: '#C75E3B',
    600: '#A94A2C',
    700: '#883A23',
    800: '#6A2D1C',
    900: '#4A1F14',
  },
};

/** 👈 Change this one word to recolour the whole app. */
const ACTIVE_BRAND = 'teal';

/* -------------------------------------------------------------------------- */
/*  Semantic colours                                                          */
/* -------------------------------------------------------------------------- */

/** Money owed to you — "you'll get". Avocado green. */
const get = {
  50: '#F5F9EC',
  100: '#E8F2D2',
  200: '#D3E5AB',
  400: '#A0C557',
  500: '#6B8E23',
  600: '#55721B',
  700: '#425915',
};

/** Money you owe — "you'll give". */
const give = {
  50: '#FEF2F2',
  100: '#FEE2E2',
  200: '#FECACA',
  400: '#F87171',
  500: '#DC2626',
  600: '#C81E1E',
  700: '#A31515',
};

/** Due-soon and overdue warnings, kept distinct from "you'll give". */
const warn = {
  50: '#FFF8EB',
  100: '#FDEDC8',
  600: '#B45309',
  700: '#92400E',
};

/** Text, borders and surfaces. Deliberately neutral so any accent works. */
const ink = {
  50: '#F7F8F7',
  100: '#EFF1EF',
  200: '#DFE2DF',
  300: '#B8BDB9',
  400: '#8B918D',
  500: '#606661',
  600: '#454B47',
  700: '#2F3431',
  800: '#1C201D',
  900: '#0F1210',
};

/** The app background behind every screen. */
const canvas = '#F4F6F4';

/** Avatar chips, assigned round-robin as people are added. */
const avatars = [
  { bg: '#EDF3E0', fg: '#4F6B18' },
  { bg: '#E3F0F4', fg: '#1F6079' },
  { bg: '#FBEEDD', fg: '#9A5B14' },
  { bg: '#F6E7E4', fg: '#9A3B2C' },
  { bg: '#E7F1E8', fg: '#2F6B41' },
  { bg: '#F1EEE3', fg: '#6B5B2E' },
  { bg: '#E6EEF6', fg: '#2B5490' },
  { bg: '#F7EAF0', fg: '#8B3A5E' },
  { bg: '#EAF2EC', fg: '#3A6B55' },
  { bg: '#F3F0E6', fg: '#7A6420' },
  { bg: '#E9EDF0', fg: '#3D5566' },
  { bg: '#F5EFE6', fg: '#7C5230' },
];

module.exports = {
  BRAND_PRESETS,
  ACTIVE_BRAND,
  brand: BRAND_PRESETS[ACTIVE_BRAND],
  get,
  give,
  warn,
  ink,
  canvas,
  avatars,
};
