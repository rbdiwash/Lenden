# Len Den · लेनदेन

A simple, production-shaped React Native app for keeping track of money you have
lent and borrowed — the digital version of the paper *khata*.

Everything is stored **on the device only**. There is no backend, no account and
no network call; the ledger lives in `AsyncStorage`.

## The model

Len Den deliberately has just two kinds of entry, because that is how people
actually talk about it:

| Entry        | Meaning                                       | Effect on balance |
| ------------ | --------------------------------------------- | ----------------- |
| **You gave** | Money left your hand (you lent, or you repaid) | `+ amount`        |
| **You got**  | Money came to you (you borrowed, or were paid) | `− amount`        |

A person's balance is `sum(gave) − sum(got)`:

- `balance > 0` → they owe you → **"you'll get"** (green)
- `balance < 0` → you owe them → **"you'll give"** (red)
- `balance = 0` → settled

Lending and borrowing both fall out of this one rule, so there is no separate
"loan" concept to learn. *Settle up* simply records the single entry that brings
the balance back to zero.

## Expected returns

A **You gave** entry can carry an expected return date (none, 1 week, 15 days,
1 month, or any day via the stepper). Those loans then surface as an "Expected
returns" list on the home screen and as a badge on the entry itself — grey when
it is far off, amber within a week, red once it is overdue.

Due dates are hidden once the person's balance is no longer in your favour,
since an old return date stops meaning anything after a ledger is settled.

## Screens

| Route                 | What it does                                                            |
| --------------------- | ----------------------------------------------------------------------- |
| `(tabs)/index`        | Dashboard: net balance, receivable/payable, biggest balances, recent activity |
| `(tabs)/people`       | Everyone in the khata, with search and recent/highest/A–Z sorting        |
| `(tabs)/activity`     | Full ledger grouped by day, filterable by direction                      |
| `(tabs)/settings`     | Name, currency symbol, sample data, JSON backup, clear all               |
| `person/[id]`         | One person's ledger with running balances, settle up, call and remind    |
| `new-entry`           | Modal: amount, direction, person (create inline), note, back-date, expected return |
| `new-person`          | Modal: add or edit a person                                              |
| `welcome`             | First run only: pick a language and a currency                           |

## Colours

Everything lives in **`theme/colors.js`** — it is the only file to edit when
recolouring. Both `tailwind.config.js` (the `bg-brand-600` classes) and
`lib/theme.ts` (raw values for icon tints and placeholders) read from it.

Flat solid fills only; there are deliberately **no gradients** anywhere.

To try a different accent, change one word:

```js
const ACTIVE_BRAND = 'teal'; // teal | avocado | navy | charcoal | clay
```

then restart the bundler with `npx expo start --clear` — Tailwind only reads
the config at startup.

The accent deliberately avoids green. Money owed to you is avocado green and
money you owe is red, so a green accent reads as a third success colour and the
hero card stops being distinguishable from a balance. Teal, navy, charcoal and
clay all keep that separation; the `avocado` preset is kept for comparison.

## Languages

English and Nepali, switchable at any time in Settings and chosen on first run.

`lib/i18n.ts` holds both dictionaries and is the only place strings live. The
Nepali dictionary is typed as `Record<TKey, string>`, so a missing translation
is a compile error rather than a blank label. Components never call `translate`
directly — they use the `useI18n()` hook, which also supplies money and date
formatting already bound to the active language and currency:

```tsx
const { t, tp, money, relative } = useI18n();
t('youllGet');                 // "You'll get" / "पाउनु पर्ने"
tp('entryCount', entries.length); // "3 entries" / "3 प्रविष्टि"
money(1234);                   // "रू 1,234"
```

Keys ending `_one` / `_other` are plural pairs picked by `tp`. A few strings
have a `…Short` variant for buttons and chips, where Nepali needs fewer
syllables than English.

## First run

`app/welcome.tsx` asks for a language and a currency before anything else, and
is gated by `<Stack.Protected guard={!onboarded}>` in the root layout. The
choice is stored with the rest of the settings, so it is remembered across
launches and can be changed later in Settings.

## Stack

- **Expo SDK 57** with the New Architecture
- **expo-router** for file-based routing (`expo-router/js-tabs` for the bottom tabs)
- **NativeWind 4** (Tailwind CSS 3.4) for styling
- **Zustand** + `persist` + `AsyncStorage` for state and storage
- **Reanimated 4** for entrance and press animations
- **Inter** via `@expo-google-fonts/inter`

## Running it

```bash
npm install
npm run ios       # or: npm run android
npm run web       # browser preview
npm run type-check
```

## Notes for whoever picks this up next

- `components/ui/animated.tsx` registers Reanimated's components with NativeWind
  via `cssInterop`. Without it a `className` on an `Animated.View` is silently
  dropped, so import `Animated` from there rather than from the library.
- `babel-preset-expo` is a direct devDependency because the project has its own
  `babel.config.js`, which resolves presets from the project root.
- `userInterfaceStyle: "light"` is set per-platform on iOS and Android rather
  than at the root, because Expo's web runtime calls `setColorScheme` and
  NativeWind rejects that unless dark mode is class-based.
- The app is light-theme only by design. Adding dark mode means adding `dark:`
  variants; `darkMode: 'class'` is already configured.
- The persist `version` in `store/useLedger.ts` stays at 1. Bumping it without
  also writing a `migrate` function makes zustand throw away every saved
  ledger. New settings fields are handled by the `merge` function instead,
  which fills in defaults field by field for ledgers saved before they existed.
- Close a screen with `dismiss()` from `lib/nav.ts` rather than `router.back()`.
  A modal opened by deep link has no history, so a bare `back()` does nothing
  and strands the user.

## Not built yet

Backend sync, multi-currency per person, attachments/photos of receipts,
push/local notifications for due dates (they are only shown in-app today),
Nepali (Bikram Sambat) dates, Devanagari numerals, and CSV export.
