import { Stack } from 'expo-router';

import { colors } from '@/constants/theme';

export default function BuyerLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.mint },
        headerTintColor: colors.cocoa,
        headerTitleStyle: { fontWeight: '600', color: colors.cocoa },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.mint },
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="item/[id]" options={{ title: 'Item' }} />
      <Stack.Screen name="maker/[id]" options={{ title: 'Maker' }} />
      <Stack.Screen name="checkout" options={{ title: 'Checkout' }} />
    </Stack>
  );
}
