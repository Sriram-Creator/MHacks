import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppProvider, useApp } from '@/context/AppContext';

import '@/global.css';

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </AppProvider>
  );
}

function RootNavigator() {
  const { mode } = useApp();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={mode === 'buyer'}>
        <Stack.Screen name="(buyer)" />
      </Stack.Protected>
      <Stack.Protected guard={mode === 'maker'}>
        <Stack.Screen name="(maker)" />
      </Stack.Protected>
    </Stack>
  );
}
