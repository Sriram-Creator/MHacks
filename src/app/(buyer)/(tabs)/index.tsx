import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Ionicons from '@expo/vector-icons/Ionicons';

import { Chip, ChipRow } from '@/components/buyer/chip';
import { formatDistance } from '@/components/buyer/format';
import { ItemRow } from '@/components/buyer/item-row';
import { RadiusMap } from '@/components/buyer/radius-map';
import { RadiusSlider } from '@/components/buyer/radius-slider';
import { SearchBar } from '@/components/buyer/search-bar';
import { colors } from '@/constants/theme';
import { getItemsByMaker, getMaker, items, makers, type ItemCategory, type Maker } from '@/data/mock';

const categories: { label: string; value: ItemCategory }[] = [
  { label: 'Bread', value: 'bread' },
  { label: 'Jam', value: 'jam' },
  { label: 'Sweets', value: 'cookies' },
  { label: 'Granola', value: 'granola' },
  { label: 'Honey', value: 'honey' },
];

const RADIUS_CHIPS = [5, 10, 15, 25] as const;

const categoryCopy: Record<ItemCategory, string> = {
  bread: 'Bread',
  jam: 'Jam',
  granola: 'Granola',
  honey: 'Honey',
  cookies: 'Sweets',
};

function makerSpecialty(makerId: string) {
  const unique = [...new Set(getItemsByMaker(makerId).map((item) => categoryCopy[item.category]))];
  return unique[0] ?? 'Cottage food';
}

function matchesFilters(maker: Maker, needle: string, category: ItemCategory | null) {
  if (category && !getItemsByMaker(maker.id).some((item) => item.category === category)) {
    return false;
  }
  if (needle) {
    const matchesMaker = maker.name.toLowerCase().includes(needle);
    const matchesItem = getItemsByMaker(maker.id).some((item) =>
      item.name.toLowerCase().includes(needle),
    );
    if (!matchesMaker && !matchesItem) {
      return false;
    }
  }
  return true;
}

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [radius, setRadius] = useState(10);
  const [category, setCategory] = useState<ItemCategory | null>(null);
  const [searching, setSearching] = useState(false);
  const [listView, setListView] = useState(false);

  const nearbyMakers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return makers.filter((maker) => maker.distance <= radius && matchesFilters(maker, needle, category));
  }, [category, query, radius]);

  const nearbyMakerIds = useMemo(() => new Set(nearbyMakers.map((maker) => maker.id)), [nearbyMakers]);

  const visibleItems = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return items.filter((item) => {
      const maker = getMaker(item.maker_id);
      if (!maker || !nearbyMakerIds.has(maker.id)) {
        return false;
      }
      if (category && item.category !== category) {
        return false;
      }
      if (!needle) {
        return true;
      }
      return (
        item.name.toLowerCase().includes(needle) || maker.name.toLowerCase().includes(needle)
      );
    });
  }, [category, nearbyMakerIds, query]);

  const featured = nearbyMakers[0];
  const featuredItem = featured ? getItemsByMaker(featured.id)[0] : undefined;

  const makersWithin25 = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return makers.filter((maker) => maker.distance <= 25 && matchesFilters(maker, needle, category))
      .length;
  }, [category, query]);

  const previewMakers = listView ? nearbyMakers : nearbyMakers.slice(0, 3);

  return (
    <View className="flex-1 bg-mint">
      <SafeAreaView edges={['top']} className="bg-mint">
        <Text className="px-5 pb-2 pt-3 text-center text-[28px] font-semibold text-cocoa">
          Find makers near you
        </Text>
        <RadiusMap makers={nearbyMakers} radius={radius} />
      </SafeAreaView>

      <View className="flex-1 bg-white pt-5">
        <Pressable
          onPress={() => setSearching((open) => !open)}
          className="flex-row items-center px-5">
          <Ionicons name="location-outline" size={16} color={colors.cocoa} />
          <Text className="ml-2 text-[15px] text-cocoa/70">Around Ann Arbor, MI 48104</Text>
        </Pressable>

        <View className="mt-4 flex-row gap-2 px-5">
          {RADIUS_CHIPS.map((miles) => {
            const selected = radius === miles;
            return (
              <Pressable
                key={miles}
                onPress={() => setRadius(miles)}
                className={`h-9 min-w-[58px] items-center justify-center rounded-full px-3 ${
                  selected
                    ? 'bg-white shadow-sm'
                    : 'border border-cocoa/15 bg-transparent'
                }`}>
                <Text className="text-[14px] text-cocoa">{miles} mi</Text>
              </Pressable>
            );
          })}
        </View>

        {searching ? (
          <View className="pt-4">
            <SearchBar value={query} onChangeText={setQuery} />
            <View className="mt-3">
              <ChipRow>
                {categories.map((option) => (
                  <Chip
                    key={option.value}
                    label={option.label}
                    selected={category === option.value}
                    onPress={() =>
                      setCategory((current) => (current === option.value ? null : option.value))
                    }
                  />
                ))}
              </ChipRow>
            </View>
            <View className="px-5 pt-3">
              <RadiusSlider value={radius} onChange={setRadius} />
            </View>
          </View>
        ) : null}

        <View className="mx-5 mt-5 rounded-[28px] bg-mint px-5 py-4">
          <Text className="text-[28px] font-semibold leading-8 text-cocoa">
            {nearbyMakers.length} makers within {radius} miles
          </Text>
          <Text className="mt-1 text-[14px] text-cocoa/45">
            {makersWithin25} makers within 25 miles.
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-28"
          keyboardShouldPersistTaps="handled">
          {listView && featured && featuredItem ? (
            <View className="px-5 pt-4">
              <Pressable
                onPress={() => router.push({ pathname: '/maker/[id]', params: { id: featured.id } })}
                className="overflow-hidden rounded-[28px] bg-savor">
                <Image
                  source={featuredItem.photo}
                  contentFit="cover"
                  className="h-48 w-full opacity-70"
                />
                <View className="absolute inset-0 justify-end p-5">
                  <Text className="text-2xl font-semibold text-mint">{featured.name}</Text>
                  <Text className="mt-1 text-sm text-mint/80" numberOfLines={2}>
                    {featured.bio}
                  </Text>
                </View>
              </Pressable>
            </View>
          ) : null}

          <View className="mt-2 px-5">
            {previewMakers.map((maker) => (
              <Pressable
                key={maker.id}
                onPress={() => router.push({ pathname: '/maker/[id]', params: { id: maker.id } })}
                className="min-h-[64px] flex-row items-center py-2">
                <View className="h-12 w-12 items-center justify-center rounded-full bg-mint">
                  <Text className="text-[18px] font-semibold text-cocoa">
                    {maker.name.charAt(0)}
                  </Text>
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-[16px] font-medium text-cocoa">{maker.name}</Text>
                  <Text className="mt-0.5 text-[13px] text-cocoa/40">
                    {makerSpecialty(maker.id)} · {formatDistance(maker.distance)}
                  </Text>
                </View>
              </Pressable>
            ))}

            {nearbyMakers.length === 0 ? (
              <Text className="py-6 text-base text-cocoa/45">
                Nothing in this radius yet. Widen the search or try another category.
              </Text>
            ) : null}

            {nearbyMakers.length > 3 ? (
              <Pressable onPress={() => setListView((value) => !value)} className="items-center py-3">
                <Text className="text-[15px] text-cocoa/50">
                  {listView ? 'Show less' : `See all ${nearbyMakers.length}`}
                </Text>
              </Pressable>
            ) : null}
          </View>

          {listView ? (
            <View className="mt-2 px-5">
              {visibleItems.map((item) => {
                const maker = getMaker(item.maker_id);
                if (!maker) {
                  return null;
                }
                return (
                  <ItemRow
                    key={item.id}
                    item={item}
                    maker={maker}
                    onPress={() => router.push({ pathname: '/item/[id]', params: { id: item.id } })}
                  />
                );
              })}
            </View>
          ) : null}
        </ScrollView>
      </View>

      <View className="absolute bottom-0 left-0 right-0 bg-savor px-5 pb-3 pt-3">
        <Pressable
          onPress={() => setListView(true)}
          className="min-h-[56px] items-center justify-center">
          <Text className="text-[17px] font-semibold text-mint">
            Show {nearbyMakers.length} makers
          </Text>
        </Pressable>
      </View>

    </View>
  );
}
