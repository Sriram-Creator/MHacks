import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { ChatThread } from '@/components/buyer/chat-thread';
import { ConversationRow } from '@/components/buyer/conversation-row';
import {
  lastMessage,
  mockConversations,
  type ChatMessage,
  type Conversation,
} from '@/components/buyer/mock-conversations';
import { ThreadTitle } from '@/components/buyer/thread-title';
import { colors } from '@/constants/theme';
import { getMaker } from '@/data/mock';

export default function MessagesScreen() {
  const navigation = useNavigation();
  const [threads, setThreads] = useState<Conversation[]>(mockConversations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const active = threads.find((thread) => thread.id === activeId) ?? null;
  const activeMaker = active ? getMaker(active.makerId) : undefined;

  useLayoutEffect(() => {
    if (!activeId || !activeMaker) {
      navigation.setOptions({
        title: 'Messages',
        headerTitle: 'Messages',
        headerLeft: () => null,
      });
      return;
    }

    navigation.setOptions({
      headerTitle: () => <ThreadTitle maker={activeMaker} />,
      headerLeft: () => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to inbox"
          onPress={() => setActiveId(null)}
          className="h-11 w-11 items-center justify-center">
          <Ionicons name="chevron-back" size={26} color={colors.dark} />
        </Pressable>
      ),
    });
  }, [activeId, activeMaker, navigation]);

  function openThread(id: string) {
    setThreads((current) =>
      current.map((thread) => (thread.id === id ? { ...thread, unread: false } : thread)),
    );
    setDraft('');
    setActiveId(id);
  }

  function sendMessage() {
    const body = draft.trim();
    if (!activeId || !body) {
      return;
    }

    const message: ChatMessage = {
      id: `local-${Date.now()}`,
      author: 'buyer',
      body,
      sentAt: new Date().toISOString(),
    };

    setThreads((current) =>
      current.map((thread) =>
        thread.id === activeId ? { ...thread, unread: false, messages: [...thread.messages, message] } : thread,
      ),
    );
    setDraft('');
  }

  if (active && activeMaker) {
    return (
      <ChatThread
        messages={active.messages}
        draft={draft}
        onChangeDraft={setDraft}
        onSend={sendMessage}
      />
    );
  }

  const inbox = [...threads].sort(
    (a, b) => new Date(lastMessage(b).sentAt).getTime() - new Date(lastMessage(a).sentAt).getTime(),
  );

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: colors.cream }} contentContainerClassName="pb-6 pt-2">
      {inbox.map((conversation) => {
        const maker = getMaker(conversation.makerId);
        if (!maker) {
          return null;
        }

        return (
          <View key={conversation.id}>
            <ConversationRow
              conversation={conversation}
              maker={maker}
              onPress={() => openThread(conversation.id)}
            />
            <View className="ml-20 h-px" style={{ backgroundColor: colors.map }} />
          </View>
        );
      })}
    </ScrollView>
  );
}
