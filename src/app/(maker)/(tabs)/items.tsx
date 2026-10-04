import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatPrice } from '@/components/buyer/format';
import { ErrorRetry } from '@/components/error-retry';
import { colors } from '@/constants/theme';
import { fetchItems, type ServerItem } from '@/lib/api';

export default function MakerItemsScreen() {
  const [items, setItems] = useState<ServerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const next = await fetchItems();
      setItems(next);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not load items.';
      console.log('[items] load failed:', message);
      console.error('[items] load failed:', err);
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Refetch whenever the tab regains focus so newly published items show up.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (loading && !error) {
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
          This week
        </Text>
        <Text className="mt-1 text-[32px] font-semibold leading-9 text-savor">My items</Text>

        {error ? (
          <View className="mt-6">
            <ErrorRetry
              title="Couldn't load items"
              message={error}
              onRetry={() => {
                setLoading(true);
                load();
              }}
            />
          </View>
        ) : null}

        <View className="mt-5 gap-4">
          {items.map((item) => {
            const low = item.left_this_week <= 5;
            return (
              <View key={item.id} className="overflow-hidden rounded-2xl bg-white">
                <Image
                  source={item.photo}
                  contentFit="cover"
                  className="h-40 w-full bg-map"
                />
                <View className="p-4">
                  <View className="flex-row items-start justify-between gap-3">
                    <Text className="flex-1 text-lg font-semibold text-savor">{item.name}</Text>
                    <Text className="text-lg font-semibold text-terracotta">
                      {formatPrice(item.price)}
                    </Text>
                  </View>
                  <Text className="mt-1 text-sm capitalize text-savor/55">{item.category}</Text>

                  <View className="mt-3 flex-row items-center justify-between">
                    <View
                      className={`rounded-full px-3 py-1.5 ${low ? 'bg-terracotta/15' : 'bg-sage/15'}`}>
                      <Text
                        className={`text-sm font-semibold ${low ? 'text-terracotta' : 'text-sage'}`}>
                        {item.left_this_week} left this week
                      </Text>
                    </View>
                    {item.allergens.length > 0 ? (
                      <Text className="text-xs text-savor/45">{item.allergens.join(' · ')}</Text>
                    ) : null}
                  </View>
                </View>
              </View>
            );
          })}

          {!error && items.length === 0 ? (
            <Text className="py-6 text-base text-savor/45">No items yet.</Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
