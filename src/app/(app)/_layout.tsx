import { Slot } from 'expo-router';

import { AppShell } from '@/demo/AppShell';
import { DemoProvider } from '@/demo/DemoProvider';

/**
 * The demo banking app. Every screen in this folder shares one frame (navigation, privacy mode) and one
 * set of sample accounts. The folder name in brackets is a route GROUP: it organises files and does not
 * appear in the address, so /accounts, /send and /assistant stay exactly as they were.
 */
export default function AppLayout() {
  return (
    <DemoProvider>
      <AppShell>
        <Slot />
      </AppShell>
    </DemoProvider>
  );
}
