import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
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
import {
  formatBubbleTime,
  lastMessage,
  type ChatMessage,
  type Conversation,
} from '@/components/buyer/mock-conversations';
import {
  getBuyer,
  mockMakerConversations,
  type BuyerPeer,
} from '@/components/maker/mock-conversations';
import { colors } from '@/constants/theme';

function clockIso() {
  return new Date().toISOString();
}

export default function MakerMessagesScreen() {
  const { buyerId } = useLocalSearchParams<{ buyerId?: string }>();
  const [readBuyerIds, setReadBuyerIds] = useState<Set<string>>(() => new Set());
  const hasBuyerParam = typeof buyerId === 'string' && buyerId.length > 0;
  const buyer = hasBuyerParam ? getBuyer(buyerId) : undefined;
  const conversation = hasBuyerParam
    ? mockMakerConversations.find((thread) => thread.makerId === buyerId)
    : undefined;

  function markRead(id: string) {
    setReadBuyerIds((current) => (current.has(id) ? current : new Set(current).add(id)));
  }

  if (!buyer || !conversation) {
    return (
      <Inbox
        readBuyerIds={readBuyerIds}
        onOpen={(id) => {
          markRead(id);
          router.setParams({ buyerId: id });
        }}
      />
    );
  }

  return (
    <BuyerChat
      key={buyer.id}
      buyer={buyer}
      conversation={conversation}
      onBack={() => {
        markRead(buyer.id);
        router.setParams({ buyerId: undefined });
      }}
    />
  );
}

function Inbox({
  readBuyerIds,
  onOpen,
}: {
  readBuyerIds: Set<string>;
  onOpen: (buyerId: string) => void;
}) {
  const rows = useMemo(
    () =>
      mockMakerConversations
        .flatMap((conversation) => {
          const buyer = getBuyer(conversation.makerId);
          return buyer ? [{ conversation, buyer }] : [];
        })
        .sort(
          (a, b) =>
            new Date(lastMessage(b.conversation).sentAt).getTime() -
            new Date(lastMessage(a.conversation).sentAt).getTime(),
        ),
    [],
  );

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      <View className="px-5 pb-2 pt-4">
        <Text className="text-[11px] font-semibold uppercase tracking-[1.4px] text-savor/35">
          Inbox
        </Text>
        <Text className="mt-1 text-[32px] font-semibold leading-9 text-savor">Messages</Text>
        <Text className="mt-1 text-sm text-savor/55">Buyers asking about your products.</Text>
      </View>
      <ScrollView className="flex-1" contentContainerClassName="pb-6">
        {rows.map(({ conversation, buyer }) => (
          <View key={conversation.id} className="border-b border-savor/5">
            <ConversationRow
              conversation={conversation}
              name={buyer.name}
              photo={buyer.photo}
              unread={conversation.unread && !readBuyerIds.has(buyer.id)}
              onPress={() => onOpen(buyer.id)}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function BuyerChat({
  buyer,
  conversation,
  onBack,
}: {
  buyer: BuyerPeer;
  conversation: Conversation;
  onBack: () => void;
}) {
  const [draft, setDraft] = useState('');
  const [thread, setThread] = useState<ChatMessage[]>(() =>
    conversation.messages.map((message) => ({ ...message })),
  );
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
      {
        id: `msg-${Date.now()}`,
        author: 'maker',
        body: text,
        sentAt: clockIso(),
      },
    ]);
    setDraft('');
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
      inputRef.current?.focus();
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}>
        <View className="flex-row items-center border-b border-savor/5 px-5 py-3">
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Back to inbox"
            hitSlop={8}
            className="-ml-2 mr-1 h-10 w-10 items-center justify-center">
            <Ionicons name="chevron-back" size={24} color={colors.dark} />
          </Pressable>
          <Image source={buyer.photo} contentFit="cover" className="h-10 w-10 rounded-full bg-map" />
          <View className="ml-3 flex-1">
            <Text className="text-base font-semibold text-savor">{buyer.name}</Text>
            <Text className="text-xs text-savor/40">Buyer · asking about your products</Text>
          </View>
          <Ionicons name="call-outline" size={20} color={colors.dark} />
        </View>

        <ScrollView
          ref={listRef}
          className="flex-1"
          contentContainerClassName="px-5 py-5"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}>
          {thread.map((message) => {
            const mine = message.author === 'maker';
            return (
              <View key={message.id} className={`mb-3 ${mine ? 'items-end' : 'items-start'}`}>
                <View
                  className={`max-w-[80%] rounded-[22px] px-4 py-3 ${
                    mine ? 'bg-savor' : 'bg-[#EEE8DE]'
                  }`}>
                  <Text className={`text-base leading-6 ${mine ? 'text-cream' : 'text-savor'}`}>
                    {message.body}
                  </Text>
                </View>
                <Text className="mt-1 text-xs text-savor/35">
                  {formatBubbleTime(message.sentAt)}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        <View className="flex-row items-center gap-3 px-5 pb-3 pt-2">
          <TextInput
            ref={inputRef}
            value={draft}
            onChangeText={setDraft}
            placeholder="Message…"
            placeholderTextColor="#7A8678"
            editable
            autoCorrect
            blurOnSubmit={false}
            returnKeyType="send"
            onSubmitEditing={send}
            style={{
              flex: 1,
              minHeight: 48,
              borderRadius: 999,
              backgroundColor: '#FFFFFF',
              paddingHorizontal: 18,
              paddingVertical: 12,
              fontSize: 16,
              color: colors.dark,
            }}
          />
          <Pressable
            onPress={send}
            disabled={!canSend}
            style={{
              height: 48,
              width: 48,
              borderRadius: 24,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: canSend ? colors.dark : '#C8D0C4',
            }}>
            <Ionicons name="arrow-forward" size={18} color={colors.cream} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
