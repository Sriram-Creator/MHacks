import { Stack } from 'expo-router';

import { colors } from '@/constants/theme';

export default function BuyerLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.cream },
        headerTintColor: colors.dark,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.cream },
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="item/[id]" options={{ title: 'Item' }} />
      <Stack.Screen name="maker/[id]" options={{ title: 'Maker' }} />
      <Stack.Screen name="checkout" options={{ title: 'Checkout' }} />
    </Stack>
  );
}
