import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Tabs } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export const unstable_settings = {
  initialRouteName: 'items',
};

function ModeBadge() {
  const { mode, setMode } = useApp();
  const label = mode === 'maker' ? 'Maker' : 'Buyer';

  return (
    <Pressable
      onPress={() => {
        const next = mode === 'maker' ? 'buyer' : 'maker';
        console.log('[maker] Mode badge pressed → setMode', next);
        setMode(next);
      }}
      className="mr-4 px-2 py-1">
      <Text className="font-semibold text-cocoa">{label}</Text>
    </Pressable>
  );
}

function NewItemButton() {
  return (
    <Pressable
      onPress={() => router.push('/list')}
      accessibilityRole="button"
      accessibilityLabel="List an item"
      className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white">
      <Ionicons name="add" size={26} color={colors.cocoa} />
    </Pressable>
  );
}

export default function MakerTabsLayout() {
  console.log('[maker] tabs layout mounted');

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.mint },
        headerTintColor: colors.cocoa,
        headerTitleStyle: { fontWeight: '600', fontSize: 28, color: colors.cocoa },
        headerShadowVisible: false,
        headerRight: () => <ModeBadge />,
        tabBarActiveTintColor: colors.mint,
        tabBarInactiveTintColor: '#C5D0C4',
        tabBarStyle: { backgroundColor: colors.dark, borderTopColor: 'transparent' },
      }}>
      <Tabs.Screen
        name="list"
        options={{
          title: 'List an item',
          tabBarLabel: 'List',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: 'Items',
          tabBarLabel: 'Items',
          headerRight: () => (
            <View className="flex-row items-center">
              <ModeBadge />
              <NewItemButton />
            </View>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="capacity"
        options={{
          title: "This week's plan",
          headerShown: false,
          tabBarLabel: 'Capacity',
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
