import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';

import { Logo } from '@/components/core';
import { LocaleProvider } from '@/i18n';
import { ThemeProvider, useTheme } from '@/theme';

function ThemedStack() {
  const { colors, name } = useTheme();
  return (
    <>
      <StatusBar style={name === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface.primary },
          headerTintColor: colors.text.primary,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background.primary },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: 'Finsta', headerTitle: () => <Logo size="small" color="primary" /> }}
        />
        {/* The demo banking app has its own frame (navigation, privacy mode), so it hides the stack header. */}
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="soft" options={{ title: 'Soft (2.0)' }} />
        <Stack.Screen name="foundations" options={{ title: 'Foundations' }} />
        <Stack.Screen name="gallery" options={{ title: 'Gallery' }} />
        <Stack.Screen name="fintech" options={{ title: 'Fintech components' }} />
        <Stack.Screen name="charts" options={{ title: 'Charts and states' }} />
        <Stack.Screen name="playground" options={{ title: 'Playground' }} />
        <Stack.Screen name="ai" options={{ title: 'AI components' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <Head>
          <title>Finsta: Fintech Design System</title>
        </Head>
        <ThemedStack />
      </LocaleProvider>
    </ThemeProvider>
  );
}
