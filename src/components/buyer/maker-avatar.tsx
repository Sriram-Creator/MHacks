import { Image } from 'expo-image';
import { Pressable, Text } from 'react-native';

import { formatDistance } from '@/components/buyer/format';
import type { Maker } from '@/data/mock';

type MakerAvatarProps = {
  maker: Maker;
  onPress: () => void;
};

export function MakerAvatar({ maker, onPress }: MakerAvatarProps) {
  return (
    <Pressable onPress={onPress} className="w-[88px] items-center">
      <Image
        source={maker.photo}
        contentFit="cover"
        className="h-[72px] w-[72px] rounded-full bg-white"
      />
      <Text numberOfLines={2} className="mt-2 text-center text-sm font-semibold text-savor">
        {maker.name}
      </Text>
      <Text className="mt-0.5 text-xs text-savor/60">{formatDistance(maker.distance)}</Text>
    </Pressable>
  );
}
