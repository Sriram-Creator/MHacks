import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, TextInput, View } from 'react-native';

import { colors } from '@/constants/theme';

type CapacityCardProps = {
  name: string;
  suggested: number;
  sold: number;
  reason: string;
  capacity: string;
  onChangeCapacity: (value: string) => void;
};

export function CapacityCard({
  name,
  suggested,
  sold,
  reason,
  capacity,
  onChangeCapacity,
}: CapacityCardProps) {
  return (
    <View className="mb-4 rounded-2xl bg-white p-5">
      <Text className="text-base font-semibold text-savor">{name}</Text>

      <Text className="mt-2 text-[44px] font-semibold leading-[48px] text-savor">
        List {suggested}
      </Text>
      <Text className="mt-1 text-sm leading-5 text-savor/60">{reason}</Text>

      <View className="mt-4">
        <Text className="mb-1.5 text-[11px] font-semibold uppercase tracking-[1.4px] text-savor/40">
          Your capacity
        </Text>
        <TextInput
          value={capacity}
          onChangeText={onChangeCapacity}
          keyboardType="number-pad"
          className="min-h-[52px] rounded-2xl bg-cream px-4 text-xl font-semibold text-savor"
        />
      </View>

      <View className="mt-4 flex-row items-center">
        <Ionicons name="checkmark-circle" size={20} color={colors.sage} />
        <Text className="ml-2 text-sm font-medium text-sage">After cutoff: {sold} sold</Text>
      </View>
    </View>
  );
}
