import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function BuyerTabsLayout() {
  const { boxItems } = useApp();
  const boxCount = boxItems.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.mint },
        headerTintColor: colors.cocoa,
        headerTitleStyle: { fontWeight: '600', fontSize: 28, color: colors.cocoa },
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.mint,
        tabBarInactiveTintColor: '#C5D0C4',
        tabBarStyle: { backgroundColor: colors.dark, borderTopColor: 'transparent' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="box"
        options={{
          title: 'Box',
          tabBarBadge: boxCount > 0 ? boxCount : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.mint, color: colors.dark },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bag-handle-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="clipboard-outline" color={color} size={size} />
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
