import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/buyer/primary-button';
import { ErrorRetry } from '@/components/error-retry';
import { CapacityCard } from '@/components/maker/capacity-card';
import { PrepSheetModal, type PrepLine } from '@/components/maker/prep-sheet-modal';
import { colors } from '@/constants/theme';
import { fetchForecast, fetchItems, type ServerForecast, type ServerItem } from '@/lib/api';

type Row = {
  item: ServerItem;
  forecast: ServerForecast;
};

export default function CapacityScreen() {
  const [rows, setRows] = useState<Row[]>([]);
  const [capacities, setCapacities] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prepVisible, setPrepVisible] = useState(false);

  const load = useCallback(async () => {
    try {
      const items = await fetchItems();
      const withForecasts = await Promise.all(
        items.map(async (item) => ({ item, forecast: await fetchForecast(item.id) })),
      );
      setError(null);
      setRows(withForecasts);
      setCapacities((prev) => {
        const next = { ...prev };
        for (const { item, forecast } of withForecasts) {
          if (next[item.id] === undefined) {
            next[item.id] = String(forecast.suggested);
          }
        }
        return next;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not load capacity.';
      console.log('[capacity] load failed:', message);
      console.error('[capacity] load failed:', err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const prepLines = useMemo<PrepLine[]>(
    () =>
      rows.map(({ item, forecast }) => ({
        id: item.id,
        label: item.name,
        count: Number(capacities[item.id] ?? forecast.suggested) || 0,
      })),
    [rows, capacities],
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
      <ScrollView contentContainerClassName="px-5 pb-28 pt-4" keyboardShouldPersistTaps="handled">
        <Text className="text-[11px] font-semibold uppercase tracking-[1.4px] text-savor/35">
          Forecast
        </Text>
        <Text className="mt-1 text-[32px] font-semibold leading-9 text-savor">Capacity</Text>
        <Text className="mt-2 text-base leading-6 text-savor/60">
          Suggested batch sizes from your regulars, the weather, and recent sales.
        </Text>

        {error ? (
          <View className="mt-6">
            <ErrorRetry
              title="Couldn't load capacity"
              message={error}
              onRetry={() => {
                setLoading(true);
                load();
              }}
            />
          </View>
        ) : null}

        <View className="mt-5">
          {rows.map(({ item, forecast }) => (
            <CapacityCard
              key={item.id}
              name={item.name}
              suggested={forecast.suggested}
              sold={forecast.sold}
              reason={forecast.reason}
              capacity={capacities[item.id] ?? String(forecast.suggested)}
              onChangeCapacity={(value) =>
                setCapacities((prev) => ({ ...prev, [item.id]: value.replace(/[^0-9]/g, '') }))
              }
            />
          ))}
        </View>
      </ScrollView>

      {rows.length > 0 ? (
        <View className="absolute bottom-0 left-0 right-0 bg-cream px-5 pb-6 pt-3">
          <PrimaryButton label="View prep sheet" onPress={() => setPrepVisible(true)} />
        </View>
      ) : null}

      <PrepSheetModal
        visible={prepVisible}
        onClose={() => setPrepVisible(false)}
        lines={prepLines}
      />
    </SafeAreaView>
  );
}
