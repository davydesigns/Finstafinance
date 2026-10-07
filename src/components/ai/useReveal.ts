import { useEffect, useEffectEvent, useState } from 'react';

import { useReducedMotion, useTheme } from '@/theme';

/**
 * Reveals `text` a few characters at a time, like a streamed reply. Returns the part to show.
 * With `enabled` false, or when the user prefers reduced motion, the whole text is shown at once.
 * `onDone` fires once the full text is visible.
 */
export function useReveal(text: string, enabled: boolean, onDone?: () => void): string {
  const { motion } = useTheme();
  const reduced = useReducedMotion();
  const active = enabled && !reduced;
  const [progress, setProgress] = useState({ text, count: 0 });
  const count = !active ? text.length : progress.text === text ? Math.min(progress.count, text.length) : 0;
  const done = count >= text.length;

  useEffect(() => {
    if (!active || done) return;
    const stepMs = (1000 * motion.stream.chunk) / motion.stream.charsPerSecond;
    const id = setInterval(() => {
      setProgress((previous) => {
        const from = previous.text === text ? previous.count : 0;
        return from >= text.length ? previous : { text, count: Math.min(from + motion.stream.chunk, text.length) };
      });
    }, stepMs);
    return () => clearInterval(id);
  }, [active, done, text, motion.stream.chunk, motion.stream.charsPerSecond]);

  // An "effect event" always calls the latest onDone without making it a dependency.
  const notifyDone = useEffectEvent(() => onDone?.());
  useEffect(() => {
    if (done) notifyDone();
  }, [done, text]);

  return text.slice(0, count);
}
