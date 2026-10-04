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
import { LawBanner } from '@/components/buyer/law-banner';
import { lastMessage, mockConversations } from '@/components/buyer/mock-conversations';
import { colors } from '@/constants/theme';
import { getMaker, makers } from '@/data/mock';
import { askCottageAgent } from '@/lib/api';

const COTTAGE_AI_ID = 'cottage-ai';

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
  const isCottageAi = makerId === COTTAGE_AI_ID;
  const maker = hasMakerParam && !isCottageAi ? (getMaker(makerId) ?? makers[0]) : undefined;

  function markRead(id: string) {
    setReadMakerIds((current) => (current.has(id) ? current : new Set(current).add(id)));
  }

  if (isCottageAi) {
    return (
      <CottageAiChat
        onBack={() => {
          markRead(COTTAGE_AI_ID);
          router.setParams({ makerId: undefined });
        }}
      />
    );
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
    <ScrollView className="flex-1 bg-cream" contentContainerClassName="pb-6">
      <Pressable
        onPress={() => onOpen(COTTAGE_AI_ID)}
        accessibilityRole="button"
        accessibilityLabel="Cottage AI agent"
        className="min-h-[76px] flex-row items-center border-b border-savor/5 px-5 py-3">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-savor">
          <Ionicons name="sparkles" size={20} color={colors.cream} />
        </View>
        <View className="ml-3 flex-1">
          <View className="flex-row items-center">
            <Text className="flex-1 text-base font-bold text-savor">Cottage AI</Text>
            <Text className="ml-2 text-xs text-savor/45">Now</Text>
          </View>
          <Text numberOfLines={1} className="mt-1 text-sm font-semibold text-savor">
            Legal check, bake forecast, or nut-free box
          </Text>
        </View>
      </Pressable>
      {rows.map(({ conversation, maker }) => (
        <View key={conversation.id} className="border-b border-savor/5">
          <ConversationRow
            conversation={conversation}
            maker={maker}
            unread={conversation.unread && !readMakerIds.has(maker.id)}
            onPress={() => onOpen(maker.id)}
          />
        </View>
      ))}
    </ScrollView>
  );
}

function CottageAiChat({ onBack }: { onBack: () => void }) {
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [thread, setThread] = useState<ChatMessage[]>(() => [
    {
      id: 'seed-ai',
      from: 'maker',
      text: 'I am the Cottage AI agent. Ask me to order a box (e.g. nut-free breakfast box under $30), check if a food is legal to sell in Michigan, or forecast how much to bake.',
      time: clockTime(),
    },
  ]);
  const inputRef = useRef<TextInput>(null);
  const listRef = useRef<ScrollView>(null);
  const canSend = draft.trim().length > 0 && !busy;

  async function send() {
    const text = draft.trim();
    if (!text || busy) {
      return;
    }
    setDraft('');
    setBusy(true);
    setThread((current) => [
      ...current,
      { id: `msg-${Date.now()}`, from: 'buyer', text, time: clockTime() },
    ]);
    try {
      const answer = await askCottageAgent(text);
      setThread((current) => [
        ...current,
        { id: `msg-${Date.now()}-ai`, from: 'maker', text: answer, time: clockTime() },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not reach Cottage AI';
      setThread((current) => [
        ...current,
        {
          id: `msg-${Date.now()}-err`,
          from: 'maker',
          text: `Server error: ${message}. Is the API running at the URL in config.ts?`,
          time: clockTime(),
        },
      ]);
    } finally {
      setBusy(false);
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
        inputRef.current?.focus();
      });
    }
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
          <View className="h-10 w-10 items-center justify-center rounded-full bg-savor">
            <Ionicons name="sparkles" size={18} color={colors.cream} />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-base font-semibold text-savor">Cottage AI</Text>
            <Text className="text-xs text-savor/40">@michigan-cottage-com · same logic as ASI:One</Text>
          </View>
        </View>

        <LawBanner />

        <ScrollView
          ref={listRef}
          className="flex-1"
          contentContainerClassName="px-5 py-5"
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}>
          {thread.map((message) => {
            const mine = message.from === 'buyer';
            return (
              <View key={message.id} className={`mb-3 ${mine ? 'items-end' : 'items-start'}`}>
                <View
                  className={`max-w-[80%] rounded-[22px] px-4 py-3 ${
                    mine ? 'bg-savor' : 'bg-[#EEE8DE]'
                  }`}>
                  <Text className={`text-base leading-6 ${mine ? 'text-cream' : 'text-savor'}`}>
                    {message.text}
                  </Text>
                </View>
                <Text className="mt-1 text-xs text-savor/35">{message.time}</Text>
              </View>
            );
          })}
        </ScrollView>

        <View className="flex-row items-center gap-3 px-5 pb-3 pt-2">
          <TextInput
            ref={inputRef}
            value={draft}
            onChangeText={setDraft}
            placeholder={busy ? 'Cottage AI is thinking…' : 'Ask Cottage AI…'}
            placeholderTextColor="#7A8678"
            editable={!busy}
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              void send();
            }}
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
            onPress={() => {
              void send();
            }}
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
          <Image source={maker.photo} contentFit="cover" className="h-10 w-10 rounded-full" />
          <View className="ml-3 flex-1">
            <Text className="text-base font-semibold text-savor">{maker.name}</Text>
            <Text className="text-xs text-savor/40">Usually replies in 10 min</Text>
          </View>
          <Ionicons name="call-outline" size={20} color={colors.dark} />
        </View>

        <LawBanner />

        <ScrollView
          ref={listRef}
          className="flex-1"
          contentContainerClassName="px-5 py-5"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}>
          {thread.map((message) => {
            const mine = message.from === 'buyer';
            return (
              <View key={message.id} className={`mb-3 ${mine ? 'items-end' : 'items-start'}`}>
                <View
                  className={`max-w-[80%] rounded-[22px] px-4 py-3 ${
                    mine ? 'bg-savor' : 'bg-[#EEE8DE]'
                  }`}>
                  <Text className={`text-base leading-6 ${mine ? 'text-cream' : 'text-savor'}`}>
                    {message.text}
                  </Text>
                </View>
                <Text className="mt-1 text-xs text-savor/35">{message.time}</Text>
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
