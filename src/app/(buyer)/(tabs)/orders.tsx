import { ScrollView, Text, View } from 'react-native';

import { formatPrice } from '@/components/buyer/format';
import { StatusPill } from '@/components/buyer/status-pill';
import { useApp } from '@/context/AppContext';
import { getItem, getMeetupSpot, pickupWindows } from '@/data/mock';

export default function BuyerOrdersScreen() {
  const { orders } = useApp();

  return (
    <ScrollView className="flex-1 bg-cream" contentContainerClassName="px-5 pb-8 pt-2">
      {orders.map((order) => {
        const spot = getMeetupSpot(order.spotId);
        const window = pickupWindows.find((entry) => entry.id === order.window);
        const names = order.items
          .map((line) => getItem(line.itemId)?.name)
          .filter(Boolean)
          .join(', ');

        return (
          <View key={order.id} className="mb-4 rounded-2xl bg-white p-4">
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="text-base font-semibold text-savor">{spot?.name}</Text>
                <Text className="mt-1 text-sm text-savor/60">{window?.spoken}</Text>
              </View>
              <StatusPill status={order.status} />
            </View>
            <Text className="mt-3 text-sm leading-5 text-savor/70">{names}</Text>
            <View className="mt-3 flex-row items-center justify-between">
              <Text className="text-sm capitalize text-savor/50">{order.cadence.replace('-', ' ')}</Text>
              <Text className="text-base font-semibold text-terracotta">{formatPrice(order.total)}</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}
