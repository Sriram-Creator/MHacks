import { Image } from 'expo-image';
import { Text, TextInput, View } from 'react-native';

type CapacityCardProps = {
  name: string;
  suggested: number;
  sold: number;
  reason: string;
  capacity: string;
  onChangeCapacity: (value: string) => void;
  photo?: string;
  variant?: 'featured' | 'compact';
};

export function CapacityCard({
  name,
  suggested,
  sold,
  reason,
  capacity,
  onChangeCapacity,
  photo,
  variant = 'featured',
}: CapacityCardProps) {
  if (variant === 'compact') {
    return (
      <View className="flex-1 rounded-[22px] bg-white p-4">
        <View className="self-start rounded-full bg-mint px-3 py-1">
          <Text className="text-[12px] text-cocoa/50">Forecast</Text>
        </View>
        <Text className="mt-3 text-[32px] font-semibold leading-9 text-cocoa">
          List {suggested}
        </Text>
        <Text className="mt-1 text-[14px] text-cocoa/45" numberOfLines={1}>
          {name}
        </Text>
        <TextInput
          value={capacity}
          onChangeText={onChangeCapacity}
          keyboardType="number-pad"
          className="mt-2 min-h-[40px] rounded-full bg-mint px-3 text-[15px] font-medium text-cocoa"
        />
      </View>
    );
  }

  return (
    <View className="rounded-[28px] bg-white p-4">
      <View className="flex-row">
        {photo ? (
          <Image
            source={photo}
            contentFit="cover"
            className="h-[88px] w-[88px] rounded-[20px] bg-map"
          />
        ) : (
          <View className="h-[88px] w-[88px] rounded-[20px] bg-map" />
        )}
        <View className="ml-3 flex-1">
          <View className="self-start rounded-full bg-mint px-3 py-1">
            <Text className="text-[12px] text-cocoa/50">Forecast</Text>
          </View>
          <Text className="mt-2 text-[40px] font-semibold leading-[44px] text-cocoa">
            List {suggested}
          </Text>
        </View>
      </View>
      <Text className="mt-3 text-[14px] leading-5 text-cocoa/45">{reason}</Text>
      <Text className="mt-2 text-[15px] font-medium text-sage">{sold} sold</Text>
      <TextInput
        value={capacity}
        onChangeText={onChangeCapacity}
        keyboardType="number-pad"
        className="mt-3 min-h-[48px] rounded-full bg-mint px-4 text-[16px] font-semibold text-cocoa"
      />
    </View>
  );
}
