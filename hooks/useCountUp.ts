import { useEffect, useRef, useState } from 'react';

/**
 * Eases a number towards its new value so headline totals visibly tick up
 * instead of snapping. Driven by requestAnimationFrame, which behaves the
 * same on iOS, Android and web.
 */
export function useCountUp(value: number, duration = 650): number {
  const [display, setDisplay] = useState(value);
  const displayRef = useRef(value);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const from = displayRef.current;
    const to = value;

    if (from === to) return;

    const startedAt = Date.now();

    const tick = () => {
      const progress = Math.min(1, (Date.now() - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = progress === 1 ? to : from + (to - from) * eased;

      displayRef.current = next;
      setDisplay(next);

      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration]);

  return display;
}
