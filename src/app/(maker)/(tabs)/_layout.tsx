import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export const unstable_settings = {
  initialRouteName: 'items',
};

function BuyerSwitch() {
  const { setMode } = useApp();

  return (
    <Pressable onPress={() => setMode('buyer')} className="mr-4 px-2 py-1">
      <Text className="font-semibold text-terracotta">Buyer mode</Text>
    </Pressable>
  );
}

export default function MakerTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.cream },
        headerTintColor: colors.dark,
        headerShadowVisible: false,
        headerRight: () => <BuyerSwitch />,
        tabBarActiveTintColor: colors.terracotta,
        tabBarInactiveTintColor: colors.dark,
        tabBarStyle: { backgroundColor: colors.cream, borderTopColor: 'transparent' },
      }}>
      <Tabs.Screen
        name="list"
        options={{
          title: 'List item',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: 'My items',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="basket-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="capacity"
        options={{
          title: 'Capacity',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="speedometer-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
