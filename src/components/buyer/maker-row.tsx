import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { formatDistance } from '@/components/buyer/format';
import { colors } from '@/constants/theme';
import type { Maker } from '@/data/mock';

type MakerRowProps = {
  maker: Maker;
  subtitle: string;
  onPress: () => void;
};

export function MakerRow({ maker, subtitle, onPress }: MakerRowProps) {
  return (
    <Pressable onPress={onPress} className="min-h-[72px] flex-row items-center py-3">
      <Image source={maker.photo} contentFit="cover" className="h-12 w-12 rounded-full bg-map" />
      <View className="ml-3 flex-1">
        <Text className="text-base font-semibold text-savor">{maker.name}</Text>
        <Text className="mt-0.5 text-sm text-savor/45">
          {subtitle} · {formatDistance(maker.distance)}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.dark} />
    </Pressable>
  );
}
