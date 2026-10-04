import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

type BrandHeaderProps = {
  onSearchPress: () => void;
  onRadiusPress?: () => void;
  searching?: boolean;
  radiusMiles?: number;
};

export function BrandHeader({
  onSearchPress,
  onRadiusPress,
  searching,
  radiusMiles,
}: BrandHeaderProps) {
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
      <View className="min-w-[88px] items-end justify-center">
        {radiusMiles !== undefined ? (
          <Pressable
            onPress={onRadiusPress}
            disabled={!onRadiusPress}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Within ${radiusMiles} miles. Adjust search radius`}
            className="rounded-full border border-cocoa/15 bg-white px-3 py-1.5">
            <Text className="text-[13px] leading-4 text-cocoa" numberOfLines={1}>
              {`Within ${radiusMiles} mi`}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
