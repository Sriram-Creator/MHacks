import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
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
  const maker = getMaker(typeof makerId === 'string' ? makerId : '') ?? makers[0];

  return <MakerChat key={maker.id} maker={maker} />;
}

function MakerChat({ maker }: { maker: NonNullable<ReturnType<typeof getMaker>> }) {
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
          <Image source={maker.photo} contentFit="cover" className="h-10 w-10 rounded-full" />
          <View className="ml-3 flex-1">
            <Text className="text-base font-semibold text-savor">{maker.name}</Text>
            <Text className="text-xs text-savor/40">Usually replies in 10 min</Text>
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
