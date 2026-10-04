import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConversationRow } from '@/components/buyer/conversation-row';
import { LawBanner } from '@/components/buyer/law-banner';
import { lastMessage, mockConversations } from '@/components/buyer/mock-conversations';
import { colors } from '@/constants/theme';
import { getMaker, makers } from '@/data/mock';

type ChatMessage = {
  id: string;
  from: 'maker' | 'buyer';
  text: string;
  time: string;
};

function clockTime() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function seedThread(makerName: string): ChatMessage[] {
  return [
    {
      id: 'seed-1',
      from: 'maker',
      text: `I'm making your order now. Anything you'd like me to know?`,
      time: '2:14 PM',
    },
    {
      id: 'seed-2',
      from: 'buyer',
      text: 'Medium-dark is perfect, thank you!',
      time: '2:16 PM',
    },
    {
      id: 'seed-3',
      from: 'maker',
      text: `Got it. See you at the meetup — ${makerName} will have it boxed.`,
      time: '2:17 PM',
    },
  ];
}

export default function MessagesScreen() {
  const { makerId } = useLocalSearchParams<{ makerId?: string }>();
  const [readMakerIds, setReadMakerIds] = useState<Set<string>>(() => new Set());
  const hasMakerParam = typeof makerId === 'string' && makerId.length > 0;
  const maker = hasMakerParam ? (getMaker(makerId) ?? makers[0]) : undefined;

  function markRead(id: string) {
    setReadMakerIds((current) => (current.has(id) ? current : new Set(current).add(id)));
  }

  if (!maker) {
    return (
      <Inbox
        readMakerIds={readMakerIds}
        onOpen={(id) => {
          markRead(id);
          router.setParams({ makerId: id });
        }}
      />
    );
  }

  return (
    <MakerChat
      key={maker.id}
      maker={maker}
      onBack={() => {
        markRead(maker.id);
        router.setParams({ makerId: undefined });
      }}
    />
  );
}

function Inbox({
  readMakerIds,
  onOpen,
}: {
  readMakerIds: Set<string>;
  onOpen: (makerId: string) => void;
}) {
  const rows = useMemo(
    () =>
      mockConversations
        .flatMap((conversation) => {
          const maker = getMaker(conversation.makerId);
          return maker ? [{ conversation, maker }] : [];
        })
        .sort(
          (a, b) =>
            new Date(lastMessage(b.conversation).sentAt).getTime() -
            new Date(lastMessage(a.conversation).sentAt).getTime(),
        ),
    [],
  );

  return (
    <SafeAreaView className="flex-1 bg-mint" edges={['top']}>
      <Text className="px-5 pb-2 pt-3 text-center text-[28px] font-semibold text-cocoa">
        Messages
      </Text>
      <ScrollView className="flex-1" contentContainerClassName="pb-6">
        {rows.map(({ conversation, maker }) => (
          <View key={conversation.id}>
            <ConversationRow
              conversation={conversation}
              name={maker.name}
              photo={maker.photo}
              unread={conversation.unread && !readMakerIds.has(maker.id)}
              onPress={() => onOpen(maker.id)}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function MakerChat({
  maker,
  onBack,
}: {
  maker: NonNullable<ReturnType<typeof getMaker>>;
  onBack: () => void;
}) {
  const [draft, setDraft] = useState('');
  const [thread, setThread] = useState<ChatMessage[]>(() => seedThread(maker.name));
  const inputRef = useRef<TextInput>(null);
  const listRef = useRef<ScrollView>(null);

  const canSend = useMemo(() => draft.trim().length > 0, [draft]);

  function send() {
    const text = draft.trim();
    if (!text) {
      return;
    }

    setThread((current) => [
      ...current,
      { id: `msg-${Date.now()}`, from: 'buyer', text, time: clockTime() },
    ]);
    setDraft('');
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
      inputRef.current?.focus();
    });
  }

  const firstName = maker.name.split(' ')[0];

  return (
    <SafeAreaView className="flex-1 bg-mint" edges={['top']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}>
        <View className="flex-row items-center px-4 py-3">
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Back to inbox"
            hitSlop={8}
            className="h-10 w-10 items-center justify-center">
            <Ionicons name="arrow-back" size={22} color={colors.cocoa} />
          </Pressable>
          <Text
            numberOfLines={1}
            className="flex-1 text-center text-[22px] font-semibold text-cocoa">
            {maker.name}
          </Text>
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
            <Text className="text-[16px] font-semibold text-cocoa">{maker.name.charAt(0)}</Text>
          </View>
        </View>

        <LawBanner />

        <ScrollView
          ref={listRef}
          className="flex-1"
          contentContainerClassName="px-5 py-5"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}>
          <Text className="mb-5 text-center text-[13px] text-cocoa/40">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
          {thread.map((message) => {
            const mine = message.from === 'buyer';
            return (
              <View key={message.id} className={`mb-3 ${mine ? 'items-end' : 'items-start'}`}>
                <View
                  className={`max-w-[80%] rounded-[22px] px-4 py-3 ${
                    mine ? 'bg-savor' : 'bg-white'
                  }`}>
                  <Text className={`text-[16px] leading-6 ${mine ? 'text-mint' : 'text-cocoa'}`}>
                    {message.text}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View className="flex-row items-center gap-3 px-5 pb-3 pt-2">
          <TextInput
            ref={inputRef}
            value={draft}
            onChangeText={setDraft}
            placeholder={`Message ${firstName}`}
            placeholderTextColor="#B0A89C"
            editable
            autoCorrect
            blurOnSubmit={false}
            returnKeyType="send"
            onSubmitEditing={send}
            style={{
              flex: 1,
              minHeight: 52,
              borderRadius: 999,
              backgroundColor: '#FFFFFF',
              paddingHorizontal: 18,
              paddingVertical: 12,
              fontSize: 16,
              color: colors.cocoa,
            }}
          />
          <Pressable
            onPress={send}
            disabled={!canSend}
            style={{
              height: 52,
              width: 52,
              borderRadius: 26,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: canSend ? colors.dark : '#C8D0C4',
            }}>
            <Ionicons name="paper-plane" size={18} color={colors.mint} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
