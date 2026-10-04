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
      <View className="h-12 w-12 items-center justify-center rounded-full bg-white">
        <Text className="text-[18px] font-semibold text-cocoa">{name.charAt(0)}</Text>
      </View>
      <View className="ml-3 flex-1">
        <View className="flex-row items-center">
          <Text
            numberOfLines={1}
            className={`flex-1 text-[16px] text-cocoa ${unread ? 'font-semibold' : 'font-medium'}`}>
            {name}
          </Text>
          <Text className="ml-2 text-[13px] text-cocoa/40">{formatInboxTime(latest.sentAt)}</Text>
        </View>
        <View className="mt-1 flex-row items-center">
          <Text numberOfLines={1} className="flex-1 text-[14px] text-cocoa/45">
            {latest.body}
          </Text>
          {unread ? (
            <View
              accessibilityLabel="Unread"
              className="ml-2 h-2 w-2 rounded-full"
              style={{ backgroundColor: colors.sage }}
            />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
