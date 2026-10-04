import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandHeader } from '@/components/buyer/brand-header';
import { Chip, ChipRow } from '@/components/buyer/chip';
import { ItemRow } from '@/components/buyer/item-row';
import { MakerRow } from '@/components/buyer/maker-row';
import { RadiusMap } from '@/components/buyer/radius-map';
import { RadiusSlider } from '@/components/buyer/radius-slider';
import { SearchBar } from '@/components/buyer/search-bar';
import { getItemsByMaker, getMaker, items, makers, type ItemCategory } from '@/data/mock';

const categories: { label: string; value: ItemCategory }[] = [
  { label: 'Bread', value: 'bread' },
  { label: 'Jam', value: 'jam' },
  { label: 'Sweets', value: 'cookies' },
  { label: 'Granola', value: 'granola' },
  { label: 'Honey', value: 'honey' },
];

const categoryCopy: Record<ItemCategory, string> = {
  bread: 'bread',
  jam: 'jam',
  granola: 'granola',
  honey: 'honey',
  cookies: 'sweets',
};

function makerSpecialty(makerId: string) {
  const unique = [...new Set(getItemsByMaker(makerId).map((item) => categoryCopy[item.category]))];
  return unique.slice(0, 2).join(' & ') || 'cottage food';
}

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [radius, setRadius] = useState<5 | 10 | 25>(10);
  const [category, setCategory] = useState<ItemCategory | null>(null);
  const [searching, setSearching] = useState(false);
  const [listView, setListView] = useState(false);

  const nearbyMakers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return makers.filter((maker) => {
      if (maker.distance > radius) {
        return false;
      }
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
    });
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

  return (
    <View className="flex-1 bg-cream">
      {!listView ? (
        <View className="bg-map">
          <SafeAreaView edges={['top']}>
            <BrandHeader
              searching={searching}
              onSearchPress={() => setSearching((open) => !open)}
            />
            <RadiusMap makers={nearbyMakers} radius={radius} />
          </SafeAreaView>
        </View>
      ) : (
        <SafeAreaView edges={['top']} className="bg-cream">
          <BrandHeader
            searching={searching}
            onSearchPress={() => setSearching((open) => !open)}
          />
        </SafeAreaView>
      )}

      <ScrollView
        className="flex-1 bg-cream"
        contentContainerClassName="pb-10"
        keyboardShouldPersistTaps="handled">
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
          </View>
        ) : null}

        {listView && featured && featuredItem ? (
          <View className="px-5 pt-2">
            <Text className="text-[11px] font-semibold uppercase tracking-[1.4px] text-savor/35">
              {nearbyMakers.length} featured within {radius} miles
            </Text>
            <Text className="mt-1 text-[34px] font-semibold leading-10 text-savor">Local makers</Text>
            <Pressable
              onPress={() => router.push({ pathname: '/maker/[id]', params: { id: featured.id } })}
              className="mt-5 overflow-hidden rounded-[28px] bg-savor">
              <Image source={featuredItem.photo} contentFit="cover" className="h-48 w-full opacity-70" />
              <View className="absolute inset-0 justify-end p-5">
                <Text className="text-[11px] font-semibold uppercase tracking-[1.4px] text-cream/70">
                  New maker
                </Text>
                <Text className="mt-1 text-2xl font-semibold text-cream">{featured.name}</Text>
                <Text className="mt-1 text-sm text-cream/80" numberOfLines={2}>
                  {featured.bio}
                </Text>
                <View className="mt-4 self-start rounded-full bg-gold px-4 py-2">
                  <Text className="text-sm font-semibold text-savor">Meet the maker →</Text>
                </View>
              </View>
            </Pressable>
          </View>
        ) : (
          <View className="px-5 pt-6">
            <Text className="text-[11px] font-semibold uppercase tracking-[1.4px] text-savor/35">
              Search radius
            </Text>
            <View className="mt-2 flex-row items-end justify-between">
              <Text className="text-[40px] font-semibold leading-[44px] text-savor">
                {radius} miles
              </Text>
              <Text className="mb-1 text-sm text-savor/40">{nearbyMakers.length} makers nearby</Text>
            </View>
            <View className="mt-4">
              <RadiusSlider value={radius} onChange={setRadius} />
            </View>
          </View>
        )}

        <View className="mt-8 flex-row items-end justify-between px-5">
          <View className="flex-1 pr-4">
            <Text className="text-[11px] font-semibold uppercase tracking-[1.4px] text-savor/35">
              {listView ? 'Open this week' : `Within ${radius} miles`}
            </Text>
            <Text className="mt-1 text-[28px] font-semibold text-savor">
              {listView ? 'Available now' : 'Makers near you'}
            </Text>
          </View>
          <Pressable onPress={() => setListView((value) => !value)} className="py-2">
            <Text className="text-sm text-savor/40">{listView ? 'Map view' : 'List view'}</Text>
          </Pressable>
        </View>

        <View className="mt-2 px-5">
          {listView
            ? visibleItems.map((item) => {
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
              })
            : nearbyMakers.map((maker) => (
                <MakerRow
                  key={maker.id}
                  maker={maker}
                  subtitle={makerSpecialty(maker.id)}
                  onPress={() => router.push({ pathname: '/maker/[id]', params: { id: maker.id } })}
                />
              ))}

          {(listView ? visibleItems : nearbyMakers).length === 0 ? (
            <Text className="py-6 text-base text-savor/45">
              Nothing in this radius yet. Widen the search or try another category.
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
