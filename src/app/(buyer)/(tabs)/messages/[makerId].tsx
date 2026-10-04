import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
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

import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { getMaker } from '@/data/mock';

function asParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function MakerChatScreen() {
  const params = useLocalSearchParams<{ makerId?: string }>();
  const makerId = asParam(params.makerId) ?? '';
  const maker = getMaker(makerId);
  const { threads, sendChatMessage } = useApp();
  const thread = threads[makerId] ?? [];
  const [draft, setDraft] = useState('');
  const inputRef = useRef<TextInput>(null);
  const listRef = useRef<ScrollView>(null);
  const canSend = useMemo(() => draft.trim().length > 0, [draft]);

  function send() {
    if (!maker || !canSend) {
      return;
    }
    sendChatMessage(maker.id, draft);
    setDraft('');
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
      inputRef.current?.focus();
    });
  }

  if (!maker) {
    return (
      <View className="flex-1 items-center justify-center bg-cream px-6">
        <Stack.Screen options={{ title: 'Chat' }} />
        <Text className="text-base text-savor/70">That kitchen chat could not be found.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-cream"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={88}>
      <Stack.Screen options={{ title: maker.name }} />

      <View className="flex-row items-center px-5 pb-2 pt-1">
        <Image source={maker.photo} contentFit="cover" className="h-8 w-8 rounded-full" />
        <Text className="ml-2 text-sm text-savor/45">Usually replies in 10 min</Text>
      </View>

      <ScrollView
        ref={listRef}
        className="flex-1"
        contentContainerClassName="px-5 py-4"
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
          placeholder={`Message ${maker.name}…`}
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
  );
}
