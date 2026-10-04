import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatPrice } from '@/components/maker/format';
import { ErrorRetry } from '@/components/error-retry';
import { colors } from '@/constants/theme';
import { fetchItems, type ServerItem } from '@/lib/api';

export default function MakerItemsScreen() {
  console.log('[maker] My Items screen mounted');

  const [items, setItems] = useState<ServerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const next = await fetchItems();
      console.log('[maker] My Items fetch ok, count=', next.length);
      setItems(next);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not load items.';
      console.log('[maker] My Items fetch failed:', message);
      console.error('[maker] My Items fetch failed:', err);
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
      <View className="flex-1 items-center justify-center bg-mint">
        <ActivityIndicator size="large" color={colors.dark} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-mint" edges={['bottom']}>
      <ScrollView
        contentContainerClassName="px-5 pb-10 pt-2"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
            tintColor={colors.dark}
          />
        }>
        {error ? (
          <View className="mt-4">
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

        <View className="gap-3">
          {items.map((item) => {
            const live = item.left_this_week > 0;
            return (
              <View
                key={item.id}
                className="flex-row items-center rounded-[22px] bg-white px-3 py-3">
                <Image
                  source={item.photo}
                  contentFit="cover"
                  className="h-14 w-14 rounded-[14px] bg-map"
                />
                <View className="ml-3 flex-1">
                  <Text className="text-[16px] font-medium text-cocoa" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text className="mt-0.5 text-[15px] text-cocoa/45">{formatPrice(item.price)}</Text>
                  <Text className="mt-0.5 text-[13px] text-cocoa/40">
                    {item.left_this_week} left this week
                  </Text>
                </View>
                <View
                  className={`h-10 min-w-[64px] items-center justify-center rounded-full px-3 ${
                    live ? 'bg-sage' : 'bg-mint'
                  }`}>
                  <Text className={`text-[13px] font-medium ${live ? 'text-white' : 'text-cocoa/45'}`}>
                    {live ? 'Live' : 'Draft'}
                  </Text>
                </View>
              </View>
            );
          })}

          {!error && items.length === 0 ? (
            <Text className="py-6 text-base text-cocoa/45">No items yet.</Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
