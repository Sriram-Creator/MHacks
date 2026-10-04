import Ionicons from '@expo/vector-icons/Ionicons';
import { TextInput, View } from 'react-native';

import { colors } from '@/constants/theme';

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <View className="mx-5 flex-row items-center rounded-full bg-white px-4 py-1">
      <Ionicons name="search-outline" size={20} color={colors.dark} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search bread, jam, makers…"
        placeholderTextColor="#7A8678"
        className="ml-3 min-h-[48px] flex-1 text-base text-savor"
        autoCorrect={false}
      />
    </View>
  );
}
