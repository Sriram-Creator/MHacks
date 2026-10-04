import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { formatDistance, formatPrice } from '@/components/buyer/format';
import type { Item, Maker } from '@/data/mock';

type ItemCardProps = {
  item: Item;
  maker: Maker;
  onPress: () => void;
};

export function ItemCard({ item, maker, onPress }: ItemCardProps) {
  return (
    <Pressable onPress={onPress} className="overflow-hidden rounded-2xl bg-white">
      <Image source={item.photo} contentFit="cover" className="h-44 w-full bg-[#F3E6D8]" />
      <View className="p-4">
        <View className="flex-row items-start justify-between gap-3">
          <Text className="flex-1 text-lg font-semibold text-savor">{item.name}</Text>
          <Text className="text-lg font-semibold text-terracotta">{formatPrice(item.price)}</Text>
        </View>
        <Text className="mt-1 text-base text-savor/70">{maker.name}</Text>
        <View className="mt-3 flex-row items-center justify-between">
          <Text className="text-sm text-savor/60">{formatDistance(maker.distance)}</Text>
          <Text className="text-sm font-medium text-sage">{item.left_this_week} left this week</Text>
        </View>
      </View>
    </Pressable>
  );
}
