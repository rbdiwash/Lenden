import { router } from 'expo-router';

/**
 * Close the current screen. `router.back()` alone is a no-op when the screen
 * was opened directly by URL or deep link and there is no history behind it,
 * which would strand the user on a modal they cannot dismiss.
 */
export function dismiss() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}
