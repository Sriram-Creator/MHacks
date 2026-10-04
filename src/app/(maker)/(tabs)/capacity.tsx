import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/maker/primary-button';
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
  console.log('[maker] Capacity screen mounted');

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
      console.log('[maker] Capacity fetch ok, rows=', withForecasts.length);
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
      console.log('[maker] Capacity fetch failed:', message);
      console.error('[maker] Capacity fetch failed:', err);
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

  const featured = rows[0];
  const rest = rows.slice(1);

  if (loading && !error) {
    return (
      <View className="flex-1 items-center justify-center bg-mint">
        <ActivityIndicator size="large" color={colors.dark} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-mint" edges={['bottom']}>
      <ScrollView contentContainerClassName="px-5 pb-28 pt-2" keyboardShouldPersistTaps="handled">
        <Text className="text-center text-[28px] font-semibold text-cocoa">This week&apos;s plan</Text>
        <Text className="mt-1 text-center text-[14px] text-cocoa/40">
          Orders close Wednesday 8pm.
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

        {featured ? (
          <View className="mt-6">
            <CapacityCard
              name={featured.item.name}
              suggested={featured.forecast.suggested}
              sold={featured.forecast.sold}
              reason={featured.forecast.reason}
              photo={featured.item.photo}
              capacity={capacities[featured.item.id] ?? String(featured.forecast.suggested)}
              onChangeCapacity={(value) =>
                setCapacities((prev) => ({
                  ...prev,
                  [featured.item.id]: value.replace(/[^0-9]/g, ''),
                }))
              }
            />
          </View>
        ) : null}

        <View className="mt-3 flex-row flex-wrap justify-between">
          {rest.map(({ item, forecast }) => (
            <View key={item.id} className="mb-3 w-[48%]">
              <CapacityCard
                variant="compact"
                name={item.name}
                suggested={forecast.suggested}
                sold={forecast.sold}
                reason={forecast.reason}
                photo={item.photo}
                capacity={capacities[item.id] ?? String(forecast.suggested)}
                onChangeCapacity={(value) =>
                  setCapacities((prev) => ({ ...prev, [item.id]: value.replace(/[^0-9]/g, '') }))
                }
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {rows.length > 0 ? (
        <View className="absolute bottom-0 left-0 right-0 bg-mint px-5 pb-6 pt-3">
          <PrimaryButton
            variant="outline"
            label="View prep sheet"
            onPress={() => setPrepVisible(true)}
          />
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
