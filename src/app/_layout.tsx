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
        <Stack.Screen name="accounts" options={{ title: 'Accounts' }} />
        <Stack.Screen name="foundations" options={{ title: 'Foundations' }} />
        <Stack.Screen name="gallery" options={{ title: 'Gallery' }} />
        <Stack.Screen name="fintech" options={{ title: 'Fintech components' }} />
        <Stack.Screen name="ai" options={{ title: 'AI components' }} />
        <Stack.Screen name="assistant" options={{ title: 'Assistant' }} />
        <Stack.Screen name="insights" options={{ title: 'Insights' }} />
        <Stack.Screen name="fraud" options={{ title: 'Security' }} />
        <Stack.Screen name="ai-settings" options={{ title: 'AI and data' }} />
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
