import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

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
        <Stack.Screen name="index" options={{ title: 'Design system' }} />
        <Stack.Screen name="accounts" options={{ title: 'Accounts' }} />
        <Stack.Screen name="foundations" options={{ title: 'Foundations' }} />
        <Stack.Screen name="gallery" options={{ title: 'Gallery' }} />
        <Stack.Screen name="fintech" options={{ title: 'Fintech components' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  // Icons are a font; wait for it so they never flash as empty boxes.
  const [iconsLoaded] = useFonts(Ionicons.font);
  if (!iconsLoaded) return null;

  return (
    <ThemeProvider>
      <ThemedStack />
    </ThemeProvider>
  );
}
