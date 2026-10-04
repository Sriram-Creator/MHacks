import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { formatDistance, formatPrice } from '@/components/buyer/format';
import type { Item, Maker } from '@/data/mock';

type ItemRowProps = {
  item: Item;
  maker: Maker;
  onPress: () => void;
};

export function ItemRow({ item, maker, onPress }: ItemRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 flex-row items-center overflow-hidden rounded-[22px] bg-white p-2.5">
      <Image source={item.photo} contentFit="cover" className="h-[84px] w-[84px] rounded-[16px] bg-map" />
      <View className="ml-3.5 flex-1 py-1 pr-2">
        <View className="flex-row items-start justify-between gap-2">
          <Text className="flex-1 text-[17px] font-semibold text-cocoa" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-[17px] font-semibold text-cocoa">{formatPrice(item.price)}</Text>
        </View>
        <Text className="mt-1 text-[13px] text-cocoa/45">
          {maker.name} · {formatDistance(maker.distance)}
        </Text>
        <Text className="mt-1 text-[13px] text-cocoa/45">
          {item.left_this_week} left this week
        </Text>
      </View>
    </Pressable>
  );
}
