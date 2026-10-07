import { Banner } from '@/components/core';

/** A plain label for showcase screens: this is a demonstration, not a live product. Not part of the design system. */
export function DemoNotice({ children }: { children: string }) {
  return (
    <Banner tone="neutral" title="Demo with sample data">
      {children}
    </Banner>
  );
}
