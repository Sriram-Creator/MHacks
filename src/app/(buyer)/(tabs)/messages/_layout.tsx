import { Stack } from 'expo-router';

import { colors } from '@/constants/theme';

export default function MessagesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.cream },
        headerTintColor: colors.dark,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.cream },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[makerId]" options={{ title: 'Chat', headerBackTitle: 'Inbox' }} />
    </Stack>
  );
}
