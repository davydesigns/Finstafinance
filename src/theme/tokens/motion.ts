/**
 * Motion. Every animation in the system takes its timing from here and is switched
 * off (or replaced by a static equivalent) when the user asks for reduced motion.
 */
export const motion = {
  /** Milliseconds. */
  duration: {
    instant: 0,
    fast: 150,
    base: 250,
    slow: 400,
    /** One full cycle of the "thinking" pulse. */
    pulse: 1200,
  },
  /** How AI text is revealed while streaming. */
  stream: {
    /** Characters revealed per second. Fast enough to feel live, slow enough to read along. */
    charsPerSecond: 90,
    /** Reveal in small chunks so a screen magnifier user isn't chasing every character. */
    chunk: 4,
  },
} as const;
