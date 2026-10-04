import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Chip, ChipRow } from '@/components/buyer/chip';
import { formatPrice } from '@/components/buyer/format';
import { PrimaryButton } from '@/components/buyer/primary-button';
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
      <View className="flex-1 items-center justify-center bg-cream px-6">
        <View className="w-full rounded-2xl bg-white p-6">
          <Text className="text-sm font-semibold uppercase tracking-wide text-sage">All set</Text>
          <Text className="mt-3 text-2xl font-semibold text-savor">
            Order confirmed — pick up {window?.spoken} at {spot?.name}
          </Text>
          <View className="mt-6">
            <PrimaryButton label="View orders" onPress={() => router.replace('/orders')} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-cream">
      <ScrollView contentContainerClassName="px-5 pb-36 pt-2">
        <Text className="text-lg font-semibold text-savor">Meetup spot</Text>
        <View className="mt-3 gap-3">
          {meetupSpots.map((spot) => {
            const selected = spotId === spot.id;
            return (
              <Pressable
                key={spot.id}
                onPress={() => setSpotId(spot.id)}
                className={`rounded-2xl border p-4 ${
                  selected ? 'border-terracotta bg-white' : 'border-transparent bg-white'
                }`}>
                <Text className="text-base font-semibold text-savor">{spot.name}</Text>
                <Text className="mt-1 text-sm text-savor/60">{spot.address}</Text>
                <Text className="mt-2 text-sm leading-5 text-savor/70">{spot.notes}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text className="mt-7 text-lg font-semibold text-savor">Time window</Text>
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

      <View className="absolute bottom-0 left-0 right-0 bg-cream px-5 pb-6 pt-3">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-base text-savor/70">Total</Text>
          <Text className="text-xl font-semibold text-savor">{formatPrice(total)}</Text>
        </View>
        <PrimaryButton
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
