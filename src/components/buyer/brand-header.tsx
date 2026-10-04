import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

type BrandHeaderProps = {
  onSearchPress: () => void;
  searching?: boolean;
};

export function BrandHeader({ onSearchPress, searching }: BrandHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-5 py-3">
      <View className="flex-row items-center">
        <View className="h-9 w-9 items-center justify-center rounded-full bg-savor">
          <Ionicons name="leaf" size={16} color={colors.cream} />
        </View>
        <Text className="ml-2 text-[22px] font-semibold tracking-tight text-savor">savor</Text>
      </View>
      <Pressable
        onPress={onSearchPress}
        className="h-11 w-11 items-center justify-center rounded-full bg-cream">
        <Ionicons
          name={searching ? 'close-outline' : 'search-outline'}
          size={20}
          color={colors.dark}
        />
      </Pressable>
    </View>
  );
}
