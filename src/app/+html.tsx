import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * Web only: the HTML shell around every page, and the tags that make a pasted link
 * show a title, description and preview image on LinkedIn, Slack, X and in search.
 * Set SITE_URL to the final public address (social previews need an absolute image URL).
 */
const SITE_URL = 'https://finstafinance.vercel.app';
const TITLE = 'Finsta: Fintech Design System';
const DESCRIPTION =
  'Finsta: a production-quality React Native fintech design system with tokens, light and dark themes, accessible components and AI patterns. Designed by Davy Designs.';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="description" content={DESCRIPTION} />
        <meta name="theme-color" content="#2557BD" />
        <meta name="color-scheme" content="light dark" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Finsta" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content={`${SITE_URL}/og.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Finsta logo with the title Fintech Design System, designed by Davy Designs" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={`${SITE_URL}/og.png`} />

        <ScrollViewStyleReset />
        {/* Page background before the app loads, so dark-mode visitors don't see a white flash.
            Same values as background.primary in the light and dark themes. */}
        <style dangerouslySetInnerHTML={{ __html: 'body{background-color:#F6F8FB}@media(prefers-color-scheme:dark){body{background-color:#0E121A}}' }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
