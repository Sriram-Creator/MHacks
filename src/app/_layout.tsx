import { router, Stack, useRootNavigationState, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

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
  const { mode, isAuthenticated } = useApp();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) {
      return;
    }

    const root = segments[0];
    console.log('[nav] auth=', isAuthenticated, 'mode=', mode, 'root=', root, 'segments=', segments);

    if (!isAuthenticated) {
      if (root !== '(auth)') {
        console.log('[nav] replace → /login (logged out)');
        router.replace('/login');
      }
      return;
    }

    // Stack.Protected unmounts the other group but does not send us into
    // (maker) — there is no root index, so the switch lands on a blank screen
    // unless we replace explicitly.
    if (mode === 'maker' && root !== '(maker)') {
      console.log('[nav] replace → /(maker)/(tabs)/items');
      router.replace('/(maker)/(tabs)/items');
      return;
    }

    if (mode === 'buyer' && root !== '(buyer)') {
      console.log('[nav] replace → /(buyer)/(tabs)');
      router.replace('/(buyer)/(tabs)');
    }
  }, [isAuthenticated, mode, segments, navigationState?.key]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={isAuthenticated && mode === 'buyer'}>
        <Stack.Screen name="(buyer)" />
      </Stack.Protected>
      <Stack.Protected guard={isAuthenticated && mode === 'maker'}>
        <Stack.Screen name="(maker)" />
      </Stack.Protected>
    </Stack>
  );
}
