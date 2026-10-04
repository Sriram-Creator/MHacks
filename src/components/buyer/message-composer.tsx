import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, TextInput, View } from 'react-native';

import { colors, Colors } from '@/constants/theme';

type MessageComposerProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSend: () => void;
};

export function MessageComposer({ value, onChangeText, onSend }: MessageComposerProps) {
  const canSend = value.trim().length > 0;

  return (
    <View
      className="flex-row items-end px-4 py-3"
      style={{ backgroundColor: colors.cream, borderTopWidth: 1, borderTopColor: colors.map }}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Message the maker"
        placeholderTextColor={Colors.light.textSecondary}
        multiline
        className="max-h-28 min-h-[48px] flex-1 rounded-2xl bg-white px-4 py-3 text-base text-savor"
      />
      <Pressable
        onPress={onSend}
        disabled={!canSend}
        accessibilityRole="button"
        accessibilityLabel="Send message"
        className="ml-2 h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: colors.terracotta, opacity: canSend ? 1 : 0.4 }}>
        <Ionicons name="arrow-up" size={22} color={colors.cream} />
      </Pressable>
    </View>
  );
}
