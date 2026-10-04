import { Stack, usePathname } from 'expo-router';

import { colors } from '@/constants/theme';

export default function MakerLayout() {
  const pathname = usePathname();
  console.log('[maker] group layout mounted, pathname=', pathname);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.mint },
        headerTintColor: colors.cocoa,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.mint },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
