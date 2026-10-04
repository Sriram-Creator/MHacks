import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import type { Maker } from '@/data/mock';

export function ThreadTitle({ maker }: { maker: Maker }) {
  return (
    <View className="max-w-[220px] flex-row items-center">
      <Image
        source={maker.photo}
        contentFit="cover"
        style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.map }}
      />
      <Text numberOfLines={1} className="ml-2 min-w-0 flex-1 text-base font-semibold text-savor">
        {maker.name}
      </Text>
    </View>
  );
}
