import { useEffect, useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatBubble } from '@/components/buyer/chat-bubble';
import { LawBanner } from '@/components/buyer/law-banner';
import { MessageComposer } from '@/components/buyer/message-composer';
import type { ChatMessage } from '@/components/buyer/mock-conversations';
import { colors } from '@/constants/theme';

type ChatThreadProps = {
  messages: ChatMessage[];
  draft: string;
  onChangeDraft: (value: string) => void;
  onSend: () => void;
};

export function ChatThread({ messages, draft, onChangeDraft, onSend }: ChatThreadProps) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    });
    return () => cancelAnimationFrame(frame);
  }, [messages.length]);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: colors.cream }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top + 56}>
      <LawBanner />
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerClassName="gap-3 px-5 py-4"
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}>
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
      </ScrollView>
      <MessageComposer value={draft} onChangeText={onChangeDraft} onSend={onSend} />
    </KeyboardAvoidingView>
  );
}
