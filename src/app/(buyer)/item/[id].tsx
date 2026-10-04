import { Image } from 'expo-image';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { formatDistance, formatPrice, titleCase } from '@/components/buyer/format';
import { PrimaryButton } from '@/components/buyer/primary-button';
import { useApp } from '@/context/AppContext';
import { getItem, getMaker } from '@/data/mock';

function formatMadeOnShort(isoDate: string) {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToBox } = useApp();
  const navigation = useNavigation();
  const item = getItem(id);
  const maker = item ? getMaker(item.maker_id) : undefined;

  useLayoutEffect(() => {
    if (item) {
      navigation.setOptions({ title: item.name });
    }
  }, [navigation, item]);

  if (!item || !maker) {
    return (
      <View className="flex-1 items-center justify-center bg-mint px-6">
        <Text className="text-base text-cocoa/70">That item is no longer on this week’s list.</Text>
      </View>
    );
  }

  const ingredients = item.ingredients.split(',').map((part) => part.trim());

  return (
    <View className="flex-1 bg-mint">
      <ScrollView contentContainerClassName="pb-44">
        <Image source={item.photo} contentFit="cover" className="h-[300px] w-full bg-[#F3E6D8]" />
        <View className="-mt-6 rounded-t-[28px] bg-white px-6 pt-7">
          <View className="flex-row items-start justify-between gap-3">
            <Text className="flex-1 text-[28px] font-semibold leading-8 text-cocoa">{item.name}</Text>
            <Text className="text-[28px] font-semibold leading-8 text-cocoa">
              {formatPrice(item.price)}
            </Text>
          </View>

          <Pressable
            onPress={() => router.push({ pathname: '/maker/[id]', params: { id: maker.id } })}
            className="mt-5 min-h-[56px] flex-row items-center">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-map">
              <Text className="text-[15px] font-semibold text-cocoa">{maker.name.charAt(0)}</Text>
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-[16px] font-medium text-cocoa">{maker.name}</Text>
              <Text className="text-[13px] text-cocoa/40">
                {titleCase(item.category)} · {formatDistance(maker.distance)}
              </Text>
            </View>
          </Pressable>

          <View className="mt-5 flex-row flex-wrap gap-2">
            {item.allergens.length === 0 ? (
              <View className="rounded-full border border-cocoa/10 bg-white px-4 py-2">
                <Text className="text-[14px] text-cocoa">No listed allergens</Text>
              </View>
            ) : (
              item.allergens.map((allergen) => (
                <View key={allergen} className="rounded-full border border-cocoa/10 bg-white px-4 py-2">
                  <Text className="text-[14px] text-cocoa">{titleCase(allergen)}</Text>
                </View>
              ))
            )}
          </View>

          <View className="mt-6 flex-row">
            <View className="flex-1">
              <Text className="text-[14px] text-cocoa/40">Made on</Text>
              <Text className="mt-1 text-[16px] font-medium text-cocoa">
                {formatMadeOnShort(item.made_on)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-[14px] text-cocoa/40">Best within</Text>
              <Text className="mt-1 text-[16px] font-medium text-cocoa">{item.shelf_life}</Text>
            </View>
          </View>

          <Text className="mt-7 text-[16px] text-cocoa/40">Ingredients</Text>
          <View className="mt-2 pb-4">
            {ingredients.filter(Boolean).map((ingredient, index) => (
              <View key={`${ingredient}-${index}`} className="flex-row items-start py-0.5">
                <Text className="mr-2 text-[16px] leading-6 text-cocoa">•</Text>
                <Text className="flex-1 text-[16px] leading-6 text-cocoa">{ingredient}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white px-6 pb-6 pt-3">
        <PrimaryButton
          variant="forest"
          label="Add to Box"
          onPress={() => {
            addToBox(item.id);
            router.push('/box');
          }}
        />
        <Text className="mt-3 text-center text-[10px] leading-4 text-cocoa/30">
          Made in a home kitchen that has not been inspected by the Michigan Department of
          Agriculture & Rural Development
        </Text>
      </View>
    </View>
  );
}
