import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { formatDistance, formatPrice } from '@/components/buyer/format';
import { colors } from '@/constants/theme';
import type { Item, Maker } from '@/data/mock';

type ItemRowProps = {
  item: Item;
  maker: Maker;
  onPress: () => void;
};

export function ItemRow({ item, maker, onPress }: ItemRowProps) {
  return (
    <Pressable onPress={onPress} className="min-h-[76px] flex-row items-center py-3">
      <Image source={item.photo} contentFit="cover" className="h-12 w-12 rounded-full bg-map" />
      <View className="ml-3 flex-1">
        <Text className="text-base font-semibold text-savor">{item.name}</Text>
        <Text className="mt-0.5 text-sm text-savor/45">
          {maker.name} · {formatPrice(item.price)}
        </Text>
      </View>
      <Text className="mr-2 text-sm text-savor/40">{formatDistance(maker.distance)}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.dark} />
    </Pressable>
  );
}
