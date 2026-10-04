import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';

import { formatPrice } from '@/components/buyer/format';
import { colors } from '@/constants/theme';
import { getItemsByMaker, getMaker } from '@/data/mock';

const actions = [
  { key: 'chat', label: 'Chat', icon: 'chatbubble-outline' as const },
  { key: 'call', label: 'Call', icon: 'call-outline' as const },
  { key: 'email', label: 'Email', icon: 'mail-outline' as const },
];

export default function MakerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const maker = getMaker(id);
  const makerItems = maker ? getItemsByMaker(maker.id) : [];

  if (!maker) {
    return (
      <View className="flex-1 items-center justify-center bg-cream px-6">
        <Text className="text-base text-savor/70">We could not find that maker.</Text>
      </View>
    );
  }

  const selectedMaker = maker;

  function onAction(key: string) {
    if (key === 'chat') {
      router.push({ pathname: '/messages/[makerId]', params: { makerId: selectedMaker.id } });
      return;
    }
    if (key === 'call') {
      Linking.openURL('tel:7345550148');
      return;
    }
    Linking.openURL(`mailto:hello@${selectedMaker.id.replace('maker-', '')}.savor`);
  }

  return (
    <ScrollView className="flex-1 bg-cream" contentContainerClassName="px-5 pb-10">
      <View className="items-center pt-4">
        <Image source={maker.photo} contentFit="cover" className="h-28 w-28 rounded-full bg-white" />
        <Text className="mt-4 text-center text-2xl font-semibold text-savor">{maker.name}</Text>
        <View className="mt-3 rounded-full bg-sage/15 px-3 py-1.5">
          <Text className="text-sm font-semibold text-sage">{maker.badge}</Text>
        </View>
        <Text className="mt-4 text-center text-base leading-6 text-savor/75">{maker.bio}</Text>
      </View>

      <View className="mt-6 flex-row gap-3">
        {actions.map((action) => (
          <Pressable
            key={action.key}
            onPress={() => onAction(action.key)}
            className="min-h-[56px] flex-1 items-center justify-center rounded-2xl bg-white">
            <Ionicons name={action.icon} size={20} color={colors.terracotta} />
            <Text className="mt-1 text-sm font-semibold text-savor">{action.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text className="mt-8 text-lg font-semibold text-savor">This week</Text>
      <View className="mt-3 flex-row flex-wrap justify-between gap-y-4">
        {makerItems.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => router.push({ pathname: '/item/[id]', params: { id: item.id } })}
            className="w-[48%] overflow-hidden rounded-2xl bg-white">
            <Image source={item.photo} contentFit="cover" className="h-28 w-full bg-[#F3E6D8]" />
            <View className="p-3">
              <Text numberOfLines={2} className="text-sm font-semibold text-savor">
                {item.name}
              </Text>
              <Text className="mt-1 text-sm text-terracotta">{formatPrice(item.price)}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
