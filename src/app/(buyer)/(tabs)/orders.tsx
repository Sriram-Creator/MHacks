import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView, Text, View } from 'react-native';

import { StatusPill } from '@/components/buyer/status-pill';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { getItem, getMaker, getMeetupSpot, pickupWindows } from '@/data/mock';

export default function BuyerOrdersScreen() {
  const { orders } = useApp();
  const confirmed = orders.find((order) => order.status === 'Confirmed');
  const confirmedSpot = confirmed ? getMeetupSpot(confirmed.spotId) : undefined;
  const confirmedWindow = confirmed
    ? pickupWindows.find((entry) => entry.id === confirmed.window)
    : undefined;

  return (
    <ScrollView className="flex-1 bg-mint" contentContainerClassName="px-5 pb-8 pt-2">
      {confirmed ? (
        <View className="mb-4 min-h-[56px] flex-row items-center rounded-full bg-white px-4 py-3">
          <Ionicons name="checkmark" size={18} color={colors.sage} />
          <Text className="ml-2 flex-1 text-[14px] leading-5 text-cocoa">
            Order confirmed. Pickup {confirmedWindow?.spoken} at {confirmedSpot?.name}.
          </Text>
        </View>
      ) : null}

      {orders.map((order) => {
        const spot = getMeetupSpot(order.spotId);
        const window = pickupWindows.find((entry) => entry.id === order.window);
        const firstItem = getItem(order.items[0]?.itemId);
        const maker = firstItem ? getMaker(firstItem.maker_id) : undefined;

        return (
          <View key={order.id} className="mb-3 rounded-[22px] bg-white px-5 py-4">
            <View className="flex-row items-start justify-between gap-3">
              <Text className="flex-1 text-[16px] font-medium text-cocoa">
                {maker?.name ?? spot?.name}
              </Text>
              <StatusPill status={order.status} />
            </View>
            <Text className="mt-3 text-[16px] text-cocoa">{firstItem?.name}</Text>
            <Text className="mt-1 text-[13px] text-cocoa/40">
              {spot?.name} · {window?.label}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}
