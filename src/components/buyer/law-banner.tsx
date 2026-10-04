import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import { colors } from '@/constants/theme';

export function LawBanner() {
  return (
    <View className="mx-5 mt-3 flex-row items-start rounded-[22px] bg-white px-4 py-3">
      <Ionicons name="information-circle-outline" size={18} color={colors.cocoa} />
      <Text className="ml-2 flex-1 text-[13px] leading-5 text-cocoa/70">
        Michigan law requires you to be able to contact the seller before buying.
      </Text>
    </View>
  );
}
