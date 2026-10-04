import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Chip, ChipRow } from '@/components/buyer/chip';
import { formatPrice } from '@/components/buyer/format';
import { PrimaryButton } from '@/components/buyer/primary-button';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import {
  getItem,
  getMeetupSpot,
  meetupSpots,
  pickupWindows,
  type Order,
  type PickupWindow,
} from '@/data/mock';

export default function CheckoutScreen() {
  const { boxItems, placeOrder } = useApp();
  const [spotId, setSpotId] = useState<string | null>(null);
  const [windowId, setWindowId] = useState<PickupWindow>('10-11');
  const [confirmed, setConfirmed] = useState<Order | null>(null);

  const total = boxItems.reduce((sum, line) => {
    const item = getItem(line.itemId);
    return item ? sum + item.price * line.quantity : sum;
  }, 0);

  if (confirmed) {
    const spot = getMeetupSpot(confirmed.spotId);
    const window = pickupWindows.find((entry) => entry.id === confirmed.window);

    return (
      <View className="flex-1 items-center justify-center bg-mint px-6">
        <View className="w-full rounded-[22px] bg-white p-6">
          <Text className="text-sm font-semibold uppercase tracking-wide text-sage">All set</Text>
          <Text className="mt-3 text-2xl font-semibold text-cocoa">
            Order confirmed — pick up {window?.spoken} at {spot?.name}
          </Text>
          <View className="mt-6">
            <PrimaryButton
              variant="forest"
              label="View orders"
              onPress={() => router.replace('/orders')}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-mint">
      <ScrollView contentContainerClassName="px-5 pb-36 pt-2">
        <View className="gap-3">
          {meetupSpots.map((spot) => {
            const selected = spotId === spot.id;
            return (
              <Pressable
                key={spot.id}
                onPress={() => setSpotId(spot.id)}
                className="min-h-[64px] flex-row items-center rounded-full bg-white px-5">
                <Ionicons name="location-outline" size={18} color={colors.cocoa} />
                <Text className="ml-3 flex-1 text-[15px] text-cocoa" numberOfLines={2}>
                  {spot.name}
                </Text>
                {selected ? (
                  <Ionicons name="checkmark" size={18} color={colors.sage} />
                ) : null}
                <View className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-mint">
                  <Ionicons
                    name={selected ? 'heart' : 'heart-outline'}
                    size={16}
                    color={selected ? colors.sage : '#C5D0C4'}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>

        <View className="mt-3 min-h-[64px] flex-row items-center">
          <View className="min-h-[64px] flex-1 justify-center rounded-full bg-white px-5">
            <Text className="text-[15px] text-cocoa/35">Add a public meetup spot</Text>
          </View>
          <View className="-ml-2 h-14 w-14 items-center justify-center rounded-full bg-savor">
            <Ionicons name="add" size={26} color={colors.mint} />
          </View>
        </View>

        <Text className="mt-8 text-[18px] font-semibold text-cocoa">Pickup time</Text>
        <View className="mt-3 -mx-5">
          <ChipRow>
            {pickupWindows.map((window) => (
              <Chip
                key={window.id}
                label={window.label}
                selected={windowId === window.id}
                onPress={() => setWindowId(window.id)}
              />
            ))}
          </ChipRow>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-mint px-5 pb-6 pt-3">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-[16px] text-cocoa">Total</Text>
          <Text className="text-[16px] font-semibold text-cocoa">{formatPrice(total)}</Text>
        </View>
        <PrimaryButton
          variant="forest"
          label="Pay"
          disabled={!spotId || boxItems.length === 0}
          onPress={() => {
            if (!spotId) {
              return;
            }
            setConfirmed(placeOrder(spotId, windowId, total));
          }}
        />
      </View>
    </View>
  );
}
