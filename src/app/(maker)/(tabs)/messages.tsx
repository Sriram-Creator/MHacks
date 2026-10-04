import Ionicons from '@expo/vector-icons/Ionicons';
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

type ChatMessage = {
  id: string;
  from: 'maker' | 'buyer';
  text: string;
  time: string;
};

const BUYER_NAME = 'Jordan M.';

function clockTime() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function seedThread(): ChatMessage[] {
  return [
    {
      id: 'seed-1',
      from: 'buyer',
      text: 'Hi! Is the sourdough still available for Saturday pickup?',
      time: '1:02 PM',
    },
    {
      id: 'seed-2',
      from: 'maker',
      text: 'Yes! I have a few loaves left — want me to set one aside?',
      time: '1:05 PM',
    },
    {
      id: 'seed-3',
      from: 'buyer',
      text: 'Please do. Is it dairy-free?',
      time: '1:06 PM',
    },
  ];
}

export default function MakerMessagesScreen() {
  const [draft, setDraft] = useState('');
  const [thread, setThread] = useState<ChatMessage[]>(() => seedThread());
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
      { id: `msg-${Date.now()}`, from: 'maker', text, time: clockTime() },
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
          <View className="h-10 w-10 items-center justify-center rounded-full bg-map">
            <Ionicons name="person-outline" size={20} color={colors.sage} />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-base font-semibold text-savor">{BUYER_NAME}</Text>
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
            const mine = message.from === 'maker';
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
