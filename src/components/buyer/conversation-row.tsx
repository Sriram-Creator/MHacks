import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import {
  formatInboxTime,
  lastMessage,
  type Conversation,
} from '@/components/buyer/mock-conversations';
import { colors } from '@/constants/theme';

type ConversationRowProps = {
  conversation: Conversation;
  name: string;
  photo: string;
  unread: boolean;
  onPress: () => void;
};

export function ConversationRow({
  conversation,
  name,
  photo,
  unread,
  onPress,
}: ConversationRowProps) {
  const latest = lastMessage(conversation);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${name}. ${latest.body}`}
      className="min-h-[76px] flex-row items-center px-5 py-3">
      <Image source={photo} contentFit="cover" className="h-12 w-12 rounded-full bg-map" />
      <View className="ml-3 flex-1">
        <View className="flex-row items-center">
          <Text
            numberOfLines={1}
            className={`flex-1 text-base text-savor ${unread ? 'font-bold' : 'font-semibold'}`}>
            {name}
          </Text>
          <Text className="ml-2 text-xs text-savor/45">{formatInboxTime(latest.sentAt)}</Text>
        </View>
        <View className="mt-1 flex-row items-center">
          <Text
            numberOfLines={1}
            className={`flex-1 text-sm ${unread ? 'font-semibold text-savor' : 'text-savor/60'}`}>
            {latest.body}
          </Text>
          {unread ? (
            <View
              accessibilityLabel="Unread"
              className="ml-2 h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: colors.terracotta }}
            />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
