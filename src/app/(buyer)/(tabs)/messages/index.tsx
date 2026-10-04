import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { makers } from '@/data/mock';

export default function MessagesInboxScreen() {
  const { threads } = useApp();

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      <Text className="px-5 pt-3 text-[34px] font-semibold text-savor">Messages</Text>
      <Text className="px-5 pt-1 text-base text-savor/45">Chats with the kitchens in your box</Text>

      <ScrollView contentContainerClassName="px-5 pb-8 pt-4">
        {makers.map((maker) => {
          const thread = threads[maker.id] ?? [];
          const latest = thread[thread.length - 1];

          return (
            <Pressable
              key={maker.id}
              onPress={() =>
                router.push({ pathname: '/messages/[makerId]', params: { makerId: maker.id } })
              }
              className="min-h-[76px] flex-row items-center border-b border-savor/5 py-3">
              <Image source={maker.photo} contentFit="cover" className="h-12 w-12 rounded-full" />
              <View className="ml-3 flex-1">
                <Text className="text-base font-semibold text-savor">{maker.name}</Text>
                <Text numberOfLines={1} className="mt-0.5 text-sm text-savor/45">
                  {latest?.text ?? 'Say hello about this week’s bake.'}
                </Text>
              </View>
              <View className="ml-2 items-end">
                <Text className="text-xs text-savor/35">{latest?.time ?? ''}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.dark} />
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
