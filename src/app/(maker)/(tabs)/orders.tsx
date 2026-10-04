import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatPrice } from '@/components/buyer/format';
import { colors } from '@/constants/theme';
import {
  fetchMeetupSpots,
  fetchOrders,
  type ServerMeetupSpot,
  type ServerOrder,
} from '@/lib/api';

function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function MakerOrdersScreen() {
  const [orders, setOrders] = useState<ServerOrder[]>([]);
  const [spots, setSpots] = useState<ServerMeetupSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [nextOrders, nextSpots] = await Promise.all([fetchOrders(), fetchMeetupSpots()]);
      setOrders(nextOrders);
      setSpots(nextSpots);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load orders.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Fetch once on mount; load() only sets state after awaiting the network.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const spotName = useMemo(() => {
    const map = new Map(spots.map((spot) => [spot.id, spot.name]));
    return (id: string | null) => (id ? (map.get(id) ?? 'Meetup spot') : 'No spot chosen');
  }, [spots]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-cream">
        <ActivityIndicator size="large" color={colors.terracotta} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['bottom']}>
      <ScrollView
        contentContainerClassName="px-5 pb-10 pt-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
            tintColor={colors.terracotta}
          />
        }>
        <Text className="text-[11px] font-semibold uppercase tracking-[1.4px] text-savor/35">
          Incoming
        </Text>
        <Text className="mt-1 text-[32px] font-semibold leading-9 text-savor">Orders</Text>

        {error ? (
          <View className="mt-6 rounded-2xl bg-white p-5">
            <Text className="text-base font-semibold text-terracotta">Couldn&apos;t load orders</Text>
            <Text className="mt-1 text-sm text-savor/70">{error}</Text>
            <Text className="mt-2 text-xs text-savor/45">Pull down to retry.</Text>
          </View>
        ) : null}

        <View className="mt-5 gap-4">
          {orders.map((order) => (
            <View key={order.id} className="rounded-2xl bg-white p-4">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-savor">{order.buyerName}</Text>
                  <Text className="mt-1 text-sm text-savor/60">{formatTime(order.createdAt)}</Text>
                </View>
                <Text className="text-base font-semibold text-terracotta">
                  {formatPrice(order.total)}
                </Text>
              </View>

              <Text className="mt-3 text-sm leading-5 text-savor/80">
                {order.quantity}× {order.itemName}
              </Text>

              <View className="mt-3 flex-row items-center">
                <Ionicons name="location-outline" size={16} color={colors.sage} />
                <Text className="ml-1.5 text-sm text-savor/60">{spotName(order.meetupSpotId)}</Text>
              </View>
            </View>
          ))}

          {!error && orders.length === 0 ? (
            <View className="mt-6 items-center rounded-2xl bg-white p-8">
              <Ionicons name="receipt-outline" size={40} color={colors.dark} />
              <Text className="mt-3 text-lg font-semibold text-savor">No orders yet</Text>
              <Text className="mt-1 text-center text-sm text-savor/55">
                Orders from buyers will show up here as they come in.
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
