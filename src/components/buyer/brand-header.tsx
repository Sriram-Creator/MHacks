import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

type BrandHeaderProps = {
  onSearchPress: () => void;
  searching?: boolean;
  radiusMiles?: number;
};

export function BrandHeader({ onSearchPress, searching, radiusMiles }: BrandHeaderProps) {
  return (
    <View className="flex-row items-center px-5 py-3">
      <Pressable
        onPress={onSearchPress}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={searching ? 'Hide search tools' : 'Show search tools'}
        className="h-10 w-10 items-center justify-center">
        <Ionicons name="location-outline" size={22} color={colors.cocoa} />
      </Pressable>
      <Text className="flex-1 text-center text-[28px] font-semibold text-cocoa">Ann Arbor</Text>
      <View className="h-10 min-w-[88px] items-end justify-center">
        {radiusMiles !== undefined ? (
          <View className="rounded-full border border-cocoa/15 bg-white px-3 py-1.5">
            <Text className="text-center text-[13px] leading-4 text-cocoa">
              {`Within\n${radiusMiles} mi`}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
