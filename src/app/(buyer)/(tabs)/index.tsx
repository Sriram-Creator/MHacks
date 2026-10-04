import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandHeader } from '@/components/buyer/brand-header';
import { Chip, ChipRow } from '@/components/buyer/chip';
import { ItemRow } from '@/components/buyer/item-row';
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

function makerFirstName(name: string) {
  return name.split(/[\s&]/)[0] || name;
}

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [radius, setRadius] = useState(10);
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
    <View className="flex-1 bg-mint">
      <SafeAreaView edges={['top']} className="bg-mint">
        <BrandHeader
          searching={searching}
          onSearchPress={() => setSearching((open) => !open)}
          onRadiusPress={() => setSearching((open) => !open)}
          radiusMiles={radius}
        />
        {!listView ? <RadiusMap makers={nearbyMakers} radius={radius} /> : null}
      </SafeAreaView>

      <View className="bg-mint pt-3">
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

      {searching ? (
        <View className="bg-mint px-5 pt-4">
          <Text className="text-[11px] font-semibold uppercase tracking-[1.4px] text-cocoa/35">
            Search radius
          </Text>
          <View className="mt-2 flex-row items-end justify-between">
            <Text className="text-[40px] font-semibold leading-[44px] text-cocoa">{radius} miles</Text>
            <Text className="mb-1 text-sm text-cocoa/40">{nearbyMakers.length} makers nearby</Text>
          </View>
          <View className="mt-3">
            <RadiusSlider value={radius} onChange={setRadius} />
          </View>
        </View>
      ) : null}

      <ScrollView
        className="flex-1 bg-mint"
        contentContainerClassName="pb-10"
        keyboardShouldPersistTaps="handled">
        {listView && featured && featuredItem ? (
          <View className="px-5 pt-4">
            <Text className="text-[11px] font-semibold uppercase tracking-[1.4px] text-cocoa/35">
              {nearbyMakers.length} featured within {radius} miles
            </Text>
            <Text className="mt-1 text-[34px] font-semibold leading-10 text-cocoa">Local makers</Text>
            <Pressable
              onPress={() => router.push({ pathname: '/maker/[id]', params: { id: featured.id } })}
              className="mt-5 overflow-hidden rounded-[28px] bg-savor">
              <Image source={featuredItem.photo} contentFit="cover" className="h-48 w-full opacity-70" />
              <View className="absolute inset-0 justify-end p-5">
                <Text className="text-[11px] font-semibold uppercase tracking-[1.4px] text-mint/70">
                  New maker
                </Text>
                <Text className="mt-1 text-2xl font-semibold text-mint">{featured.name}</Text>
                <Text className="mt-1 text-sm text-mint/80" numberOfLines={2}>
                  {featured.bio}
                </Text>
                <View className="mt-4 self-start rounded-full bg-gold px-4 py-2">
                  <Text className="text-sm font-semibold text-savor">Meet the maker →</Text>
                </View>
              </View>
            </Pressable>
          </View>
        ) : null}

        <View className="mt-6 flex-row items-end justify-between px-5">
          <Text className="text-[22px] font-semibold text-cocoa">Makers near you</Text>
          <Pressable onPress={() => setListView((value) => !value)} className="py-2">
            <Text className="text-sm text-cocoa/40">{listView ? 'Map view' : 'List view'}</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-5 pt-4">
          {nearbyMakers.map((maker) => (
            <Pressable
              key={maker.id}
              onPress={() => router.push({ pathname: '/maker/[id]', params: { id: maker.id } })}
              className="mr-5 w-[64px] items-center">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-map">
                <Text className="text-[18px] font-semibold text-cocoa">
                  {maker.name.charAt(0)}
                </Text>
              </View>
              <Text numberOfLines={1} className="mt-2 text-[13px] text-cocoa">
                {makerFirstName(maker.name)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View className="mt-7 px-5">
          <Text className="mb-3 text-[22px] font-semibold text-cocoa">This week</Text>
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

          {visibleItems.length === 0 && nearbyMakers.length === 0 ? (
            <Text className="py-6 text-base text-cocoa/45">
              Nothing in this radius yet. Widen the search or try another category.
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
