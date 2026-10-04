import Ionicons from '@expo/vector-icons/Ionicons';
import { TextInput, View } from 'react-native';

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <View className="mx-5 flex-row items-center rounded-full border border-cocoa/8 bg-white px-4">
      <Ionicons name="search-outline" size={18} color="#B0A89C" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search food or seller"
        placeholderTextColor="#B0A89C"
        className="ml-2 min-h-[48px] flex-1 text-[16px] text-cocoa"
        autoCorrect={false}
      />
    </View>
  );
}
