import { Stack } from 'expo-router';

import { colors } from '@/constants/theme';

export default function MakerLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.cream },
        headerTintColor: colors.dark,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.cream },
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
