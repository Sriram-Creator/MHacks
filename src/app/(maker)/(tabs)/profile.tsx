import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AccountSection } from '@/components/account-section';
import { PublicInfoSection } from '@/components/maker/public-info-section';
import { colors } from '@/constants/theme';
import { useApp, type AppMode, type AppState } from '@/context/AppContext';

const modes: { value: AppMode; label: string }[] = [
  { value: 'buyer', label: 'Buyer' },
  { value: 'maker', label: 'Maker' },
];

const states: { value: AppState; label: string }[] = [
  { value: 'MI', label: 'Michigan' },
  { value: 'WY', label: 'Wyoming' },
];

export default function MakerProfileScreen() {
  const { mode, setMode, state, setState } = useApp();

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['bottom']}>
      <ScrollView
        contentContainerClassName="px-6 pb-12 pt-4"
        keyboardShouldPersistTaps="handled">
        <Text className="text-3xl font-semibold text-savor">Profile</Text>
        <Text className="mt-2 text-base text-savor/70">
          Manage your shop, contact details, and how you use Savor.
        </Text>

        <View className="mt-8 rounded-2xl bg-white p-5">
          <Text className="text-sm font-semibold uppercase tracking-wide text-sage">Mode</Text>
          <View className="mt-3 flex-row gap-3">
            {modes.map((option) => {
              const selected = mode === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setMode(option.value)}
                  className={`flex-1 rounded-2xl border px-4 py-3 ${
                    selected ? 'border-terracotta bg-terracotta' : 'border-savor/15 bg-cream'
                  }`}>
                  <Text
                    className={`text-center text-base font-semibold ${
                      selected ? 'text-cream' : 'text-savor'
                    }`}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="mt-4 rounded-2xl bg-white p-5">
          <Text className="text-sm font-semibold uppercase tracking-wide text-sage">State</Text>
          <View className="mt-3 flex-row gap-3">
            {states.map((option) => {
              const selected = state === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setState(option.value)}
                  className={`flex-1 rounded-2xl border px-4 py-3 ${
                    selected ? 'border-sage bg-sage' : 'border-savor/15 bg-cream'
                  }`}>
                  <Text
                    className={`text-center text-base font-semibold ${
                      selected ? 'text-cream' : 'text-savor'
                    }`}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <PublicInfoSection />

        <AccountSection />

        <View className="mt-4 flex-row items-start rounded-2xl bg-gold/15 p-4">
          <Ionicons name="information-circle-outline" size={20} color={colors.gold} />
          <Text className="ml-2 flex-1 text-sm leading-5 text-savor/80">
            Michigan cottage food law requires your name and home address on every product
            label. Keep your account details above accurate.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
