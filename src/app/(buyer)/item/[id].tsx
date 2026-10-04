import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { formatMadeOn, formatPrice, titleCase } from '@/components/buyer/format';
import { PrimaryButton } from '@/components/buyer/primary-button';
import { useApp } from '@/context/AppContext';
import { getItem, getMaker } from '@/data/mock';

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToBox } = useApp();
  const item = getItem(id);
  const maker = item ? getMaker(item.maker_id) : undefined;

  if (!item || !maker) {
    return (
      <View className="flex-1 items-center justify-center bg-cream px-6">
        <Text className="text-base text-savor/70">That item is no longer on this week’s list.</Text>
      </View>
    );
  }

  const ingredients = item.ingredients.split(',').map((part) => part.trim());

  return (
    <View className="flex-1 bg-cream">
      <ScrollView contentContainerClassName="pb-32">
        <Image source={item.photo} contentFit="cover" className="h-72 w-full bg-[#F3E6D8]" />
        <View className="px-5 pt-5">
          <View className="flex-row items-start justify-between gap-3">
            <Text className="flex-1 text-3xl font-semibold text-savor">{item.name}</Text>
            <Text className="text-2xl font-semibold text-terracotta">{formatPrice(item.price)}</Text>
          </View>

          <Pressable
            onPress={() => router.push({ pathname: '/maker/[id]', params: { id: maker.id } })}
            className="mt-4 min-h-[56px] flex-row items-center rounded-2xl bg-white px-3">
            <Image source={maker.photo} contentFit="cover" className="h-12 w-12 rounded-full" />
            <View className="ml-3 flex-1">
              <Text className="text-base font-semibold text-savor">{maker.name}</Text>
              <Text className="text-sm text-savor/60">View maker</Text>
            </View>
          </Pressable>

          <View className="mt-5 flex-row flex-wrap gap-2">
            {item.allergens.length === 0 ? (
              <View className="rounded-full bg-sage/15 px-3 py-2">
                <Text className="text-sm font-medium text-sage">No listed allergens</Text>
              </View>
            ) : (
              item.allergens.map((allergen) => (
                <View key={allergen} className="rounded-full bg-terracotta/15 px-3 py-2">
                  <Text className="text-sm font-medium text-terracotta">{titleCase(allergen)}</Text>
                </View>
              ))
            )}
          </View>

          <View className="mt-5 flex-row gap-3">
            <View className="flex-1 rounded-2xl bg-white p-4">
              <Text className="text-sm text-savor/60">Made on</Text>
              <Text className="mt-1 text-base font-semibold text-savor">
                {formatMadeOn(item.made_on)}
              </Text>
            </View>
            <View className="flex-1 rounded-2xl bg-white p-4">
              <Text className="text-sm text-savor/60">Shelf life</Text>
              <Text className="mt-1 text-base font-semibold text-savor">{item.shelf_life}</Text>
            </View>
          </View>

          <Text className="mt-6 text-lg font-semibold text-savor">Ingredients</Text>
          <View className="mt-2 rounded-2xl bg-white p-4">
            {ingredients.map((ingredient) => (
              <Text key={ingredient} className="py-1 text-base text-savor/80">
                • {ingredient}
              </Text>
            ))}
          </View>

          <Text className="mt-5 text-xs leading-5 text-savor/45">
            Made in a home kitchen that has not been inspected by the Michigan Department of
            Agriculture & Rural Development
          </Text>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-cream px-5 pb-6 pt-3">
        <PrimaryButton
          label="Add to Box"
          onPress={() => {
            addToBox(item.id);
            router.push('/box');
          }}
        />
      </View>
    </View>
  );
}
