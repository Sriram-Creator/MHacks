import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export default function BuyerTabsLayout() {
  const { boxItems } = useApp();
  const boxCount = boxItems.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.cream },
        headerTintColor: colors.dark,
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.terracotta,
        tabBarInactiveTintColor: colors.dark,
        tabBarStyle: { backgroundColor: colors.cream, borderTopColor: 'transparent' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="box"
        options={{
          title: 'My box',
          tabBarBadge: boxCount > 0 ? boxCount : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.terracotta, color: colors.cream },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" color={color} size={size} />
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
