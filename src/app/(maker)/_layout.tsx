import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export const unstable_settings = {
  initialRouteName: 'list',
};

function BuyerSwitch() {
  const { setMode } = useApp();

  return (
    <Pressable onPress={() => setMode('buyer')} className="mr-4 px-2 py-1">
      <Text className="font-semibold text-terracotta">Buyer mode</Text>
    </Pressable>
  );
}

export default function MakerLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.cream },
        headerTintColor: colors.dark,
        headerShadowVisible: false,
        headerRight: () => <BuyerSwitch />,
        tabBarActiveTintColor: colors.terracotta,
        tabBarInactiveTintColor: colors.dark,
        tabBarStyle: { backgroundColor: colors.cream },
      }}>
      <Tabs.Screen
        name="list"
        options={{
          title: 'List',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: 'Items',
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
    </Tabs>
  );
}
