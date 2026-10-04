import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { getItemsByMaker, getMaker } from '@/data/mock';

const actions = [
  { key: 'chat', label: 'Chat', icon: 'chatbubble-outline' as const },
  { key: 'call', label: 'Call', icon: 'call-outline' as const },
  { key: 'email', label: 'Email', icon: 'mail-outline' as const },
];

export default function MakerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const maker = getMaker(id);
  const makerItems = maker ? getItemsByMaker(maker.id) : [];

  useLayoutEffect(() => {
    if (maker) {
      navigation.setOptions({ title: maker.name });
    }
  }, [maker, navigation]);

  if (!maker) {
    return (
      <View className="flex-1 items-center justify-center bg-mint px-6">
        <Text className="text-base text-cocoa/70">We could not find that maker.</Text>
      </View>
    );
  }

  const selectedMaker = maker;
  const hero = makerItems[0]?.photo ?? maker.photo;

  function onAction(key: string) {
    if (key === 'chat') {
      router.push({ pathname: '/messages', params: { makerId: selectedMaker.id } });
      return;
    }
    if (key === 'call') {
      Linking.openURL('tel:7345550148');
      return;
    }
    Linking.openURL(`mailto:hello@${selectedMaker.id.replace('maker-', '')}.savor`);
  }

  return (
    <ScrollView className="flex-1 bg-mint" contentContainerClassName="pb-10">
      <Image source={hero} contentFit="cover" className="h-72 w-full bg-white" />

      <View className="-mt-8 rounded-t-[32px] bg-white px-5 pb-8 pt-12">
        <View className="absolute -top-7 left-5 h-14 w-14 items-center justify-center rounded-full bg-mint">
          <Text className="text-[22px] font-semibold text-cocoa">{maker.name.charAt(0)}</Text>
        </View>

        <Text className="text-[28px] font-semibold text-cocoa">{maker.name}</Text>
        <Text className="mt-2 text-[16px] leading-6 text-cocoa/70">{maker.bio}</Text>

        <View className="mt-4 self-start rounded-full bg-savor px-3.5 py-2">
          <Text className="text-[13px] font-medium text-mint">{maker.badge}</Text>
        </View>

        <View className="mt-6 flex-row gap-3">
          {actions.map((action) => (
            <Pressable
              key={action.key}
              onPress={() => onAction(action.key)}
              className="min-h-[52px] flex-1 flex-row items-center justify-center rounded-full border border-cocoa/10 bg-white">
              <Ionicons name={action.icon} size={16} color={colors.cocoa} />
              <Text className="ml-1.5 text-[14px] font-medium text-cocoa">{action.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text className="mt-8 text-[18px] font-semibold text-cocoa">This week&apos;s items</Text>
        <View className="mt-3 flex-row flex-wrap justify-between gap-y-3">
          {makerItems.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => router.push({ pathname: '/item/[id]', params: { id: item.id } })}
              className="w-[48%] overflow-hidden rounded-[22px] bg-mint">
              <Image source={item.photo} contentFit="cover" className="h-36 w-full" />
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
