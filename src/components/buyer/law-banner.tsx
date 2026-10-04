import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import { colors } from '@/constants/theme';

export function LawBanner() {
  return (
    <View className="flex-row items-center border-b border-savor/5 bg-[#EEE8DE] px-5 py-2.5">
      <Ionicons name="information-circle-outline" size={16} color={colors.sage} />
      <Text className="ml-2 flex-1 text-xs leading-4 text-savor/70">
        Michigan law requires you to be able to contact the maker before buying.
      </Text>
    </View>
  );
}
