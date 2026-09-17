const colors = require('./theme/colors.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  // Expo sets the scheme from `userInterfaceStyle`, which NativeWind only
  // allows when dark mode is class-based rather than media-query-based.
  darkMode: 'class',
  theme: {
    extend: {
      // Every colour comes from theme/colors.js — edit that file, not this one.
      colors: {
        brand: colors.brand,
        get: colors.get,
        give: colors.give,
        warn: colors.warn,
        ink: colors.ink,
        canvas: colors.canvas,
      },
      fontFamily: {
        sans: ['Inter_400Regular'],
        'ui-medium': ['Inter_500Medium'],
        'ui-semibold': ['Inter_600SemiBold'],
        'ui-bold': ['Inter_700Bold'],
        display: ['Inter_800ExtraBold'],
      },
      borderRadius: {
        '4xl': '32px',
      },
    },
  },
  plugins: [],
};
