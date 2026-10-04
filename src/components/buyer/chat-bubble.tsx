import { Text, View } from 'react-native';

import { formatBubbleTime, type ChatMessage } from '@/components/buyer/mock-conversations';
import { colors } from '@/constants/theme';

type ChatBubbleProps = {
  message: ChatMessage;
};

export function ChatBubble({ message }: ChatBubbleProps) {
  const mine = message.author === 'buyer';

  return (
    <View className={`max-w-[80%] ${mine ? 'self-end' : 'self-start'}`}>
      <View
        className={`rounded-2xl px-3.5 py-2.5 ${mine ? 'rounded-br-md' : 'rounded-bl-md bg-white'}`}
        style={mine ? { backgroundColor: colors.terracotta } : undefined}>
        <Text className={`text-base leading-5 ${mine ? 'text-cream' : 'text-savor'}`}>{message.body}</Text>
      </View>
      <Text className={`mt-1 text-xs text-savor/40 ${mine ? 'text-right' : ''}`}>
        {formatBubbleTime(message.sentAt)}
      </Text>
    </View>
  );
}
