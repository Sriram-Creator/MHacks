import { Redirect } from 'expo-router';

import { useApp } from '@/context/AppContext';

/** Always-available anchor so Expo never mounts a tab screen without a navigator. */
export default function RootIndex() {
  const { isAuthenticated, mode } = useApp();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  if (mode === 'maker') {
    return <Redirect href="/(maker)/(tabs)/items" />;
  }

  return <Redirect href="/(buyer)/(tabs)" />;
}
